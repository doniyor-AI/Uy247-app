// /api/telegram-link — foydalanuvchining Telegram'ini bildirishnomalar uchun ulash
//   { action: "start", lang }  → bir martalik kod yaratadi va t.me/<bot>?start=<kod> havolasini qaytaradi
//   { action: "check", lang }  → botga kelgan START'larni o'qib ulaydi; { linked: true/false }
//   { action: "unlink" }       → Telegram'ni uzadi
// Webhook sozlash shart emas: START xabarlari getUpdates orqali o'qiladi.
import { randomBytes } from "crypto";
import { admin, getUser, readBody, tg, getBotUsername, safeLang, botText } from "./_lib/server.js";

const CODE_TTL_MS = 60 * 60 * 1000; // havola 1 soat amal qiladi

// Botga kelgan barcha START xabarlarini qayta ishlaydi (bir vaqtda ulayotgan hamma uchun)
async function processUpdates() {
  const r = await tg("getUpdates", { timeout: 0, allowed_updates: ["message"] });
  if (!r.ok) throw new Error(r.description || "getUpdates xatosi");
  let maxId = 0;
  for (const u of r.result || []) {
    maxId = Math.max(maxId, u.update_id || 0);
    const msg = u.message;
    if (!msg?.chat || msg.chat.type !== "private") continue;
    const text = String(msg.text || "");
    const m = /^\/start(?:@\w+)?\s+([A-Za-z0-9_-]{8,64})\s*$/.exec(text);
    if (!m) {
      if (/^\/start\b/.test(text)) await tg("sendMessage", { chat_id: msg.chat.id, text: botText.startHint() });
      continue;
    }
    const since = new Date(Date.now() - CODE_TTL_MS).toISOString();
    const { data: prof } = await admin
      .from("profiles")
      .update({ telegram_chat_id: msg.chat.id, telegram_link_code: null, telegram_link_code_at: null })
      .eq("telegram_link_code", m[1])
      .gte("telegram_link_code_at", since)
      .select("id, notify_lang")
      .maybeSingle();
    if (prof) {
      // Bitta Telegram — bitta akkaunt: shu Telegram avval boshqa profilga ulangan bo'lsa, o'shani uzamiz
      await admin.from("profiles").update({ telegram_chat_id: null }).eq("telegram_chat_id", msg.chat.id).neq("id", prof.id);
      await tg("sendMessage", { chat_id: msg.chat.id, text: botText.linked(prof.notify_lang) });
    } else {
      // Parallel tekshiruv allaqachon ulagan bo'lishi mumkin — unda "eskirgan" demaymiz
      const { data: already } = await admin.from("profiles").select("id").eq("telegram_chat_id", msg.chat.id).maybeSingle();
      if (!already) {
        await tg("sendMessage", { chat_id: msg.chat.id, text: botText.expired("uz") + "\n\n" + botText.expired("ru") + "\n\n" + botText.expired("en") });
      }
    }
  }
  // O'qilganlarini Telegram'ga "tasdiqlaymiz" — keyingi safar qayta kelmaydi
  if (maxId) await tg("getUpdates", { offset: maxId + 1, timeout: 0 });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Faqat POST" });
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: "Sessiya yaroqsiz" });
    const body = readBody(req);
    const lang = safeLang(body.lang);

    if (body.action === "start") {
      // Faqat telefoni tasdiqlanganlar (anonim tashrif buyuruvchiga bildirishnoma kerak emas)
      if (!user.phone_confirmed_at) return res.status(403).json({ message: "NOT_VERIFIED" });
      const code = randomBytes(12).toString("base64url"); // 16 belgi, taxmin qilib bo'lmaydi
      const { error } = await admin.from("profiles")
        .update({ telegram_link_code: code, telegram_link_code_at: new Date().toISOString(), notify_lang: lang })
        .eq("id", user.id);
      if (error) throw error;
      const username = await getBotUsername();
      return res.status(200).json({ url: `https://t.me/${username}?start=${code}` });
    }

    if (body.action === "check") {
      // getUpdates muvaffaqiyatsiz bo'lsa ham (masalan, botga webhook o'rnatilgan) — holatni qaytaramiz
      try { await processUpdates(); } catch (e) { console.error("getUpdates:", e?.message || e); }
      const { data } = await admin.from("profiles").select("telegram_chat_id").eq("id", user.id).maybeSingle();
      return res.status(200).json({ linked: !!data?.telegram_chat_id });
    }

    if (body.action === "unlink") {
      const { error } = await admin.from("profiles")
        .update({ telegram_chat_id: null, telegram_link_code: null, telegram_link_code_at: null })
        .eq("id", user.id);
      if (error) throw error;
      return res.status(200).json({ linked: false });
    }

    return res.status(400).json({ message: "Noma'lum amal" });
  } catch (e) {
    console.error("telegram-link xatosi:", e?.message || e);
    return res.status(500).json({ message: e?.message || "Server xatosi" });
  }
}
