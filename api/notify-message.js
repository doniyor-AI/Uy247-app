// /api/notify-message — chatda yangi xabar yozilganda, suhbatdoshga Telegram orqali xabar beradi.
// Ilova xabar yuborgach chaqiradi: { chat_id }. Server o'zi tekshiradi: chaqiruvchi shu chat ishtirokchisimi,
// xabar yaqinda yozilganmi, avval xabar berilmaganmi. Ketma-ket ko'p xabarda 2 daqiqada bir martadan ortiq yubormaydi.
import { admin, getUser, readBody, tg, botText } from "./_lib/server.js";

const RECENT_MS = 10 * 60 * 1000;   // faqat oxirgi 10 daqiqadagi xabarlar
const THROTTLE_MS = 2 * 60 * 1000;  // bitta chat bo'yicha 2 daqiqada ko'pi bilan 1 ta Telegram xabar

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Faqat POST" });
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: "Sessiya yaroqsiz" });
    const { chat_id } = readBody(req);
    if (!chat_id) return res.status(400).json({ message: "chat_id kerak" });

    const { data: chat } = await admin.from("chats")
      .select("id, renter_id, owner_id, listings(title)")
      .eq("id", chat_id).maybeSingle();
    if (!chat || (chat.renter_id !== user.id && chat.owner_id !== user.id)) {
      return res.status(403).json({ message: "Ruxsat yo'q" });
    }
    const recipientId = chat.renter_id === user.id ? chat.owner_id : chat.renter_id;

    const since = new Date(Date.now() - RECENT_MS).toISOString();
    const { data: msgs, error: msgErr } = await admin.from("messages")
      .select("id, text, created_at, notified_at")
      .eq("chat_id", chat.id).eq("sender_id", user.id).gte("created_at", since)
      .order("created_at", { ascending: false }).limit(20);
    if (msgErr) throw msgErr;
    const pending = (msgs || []).filter((m) => !m.notified_at);
    if (!pending.length) return res.status(200).json({ sent: false, reason: "nothing-new" });

    const lastNotifiedAt = Math.max(0, ...(msgs || []).filter((m) => m.notified_at).map((m) => new Date(m.notified_at).getTime()));
    const throttled = lastNotifiedAt && Date.now() - lastNotifiedAt < THROTTLE_MS;

    // Xabarlarni "egallab" olamiz — parallel chaqiruv bo'lsa ham Telegram ikki marta ketmaydi
    const { data: claimed } = await admin.from("messages")
      .update({ notified_at: new Date().toISOString() })
      .in("id", pending.map((m) => m.id)).is("notified_at", null)
      .select("id");
    if (!claimed?.length) return res.status(200).json({ sent: false, reason: "already-handled" });
    if (throttled) return res.status(200).json({ sent: false, reason: "throttled" });

    const { data: rp } = await admin.from("profiles")
      .select("telegram_chat_id, notify_messages, notify_lang")
      .eq("id", recipientId).maybeSingle();
    if (!rp?.telegram_chat_id || rp.notify_messages === false) return res.status(200).json({ sent: false, reason: "off" });

    const r = await tg("sendMessage", {
      chat_id: rp.telegram_chat_id,
      text: botText.newMessage(rp.notify_lang, { title: chat.listings?.title, text: pending[0].text }),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    // Foydalanuvchi botni bloklagan bo'lsa — ulanishni o'chiramiz (keyin qayta ulashi mumkin)
    if (!r.ok && r.error_code === 403) {
      await admin.from("profiles").update({ telegram_chat_id: null }).eq("id", recipientId);
    }
    return res.status(200).json({ sent: !!r.ok });
  } catch (e) {
    console.error("notify-message xatosi:", e?.message || e);
    return res.status(500).json({ message: e?.message || "Server xatosi" });
  }
}
