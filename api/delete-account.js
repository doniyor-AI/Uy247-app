// /api/delete-account — foydalanuvchi o'z akkauntini butunlay o'chiradi.
// 0) Firibgarlikka qarshi qisqa arxiv yozuvi (raqam, sanalar, blok holati) — 1 yil saqlanadi
// 1) Rasmlar (Storage) alohida o'chiriladi
// 2) Qolgan hammasi — profil, e'lonlar, chatlar, xabarlar, sevimlilar, saqlangan qidiruvlar —
//    akkaunt o'chganda bazada avtomatik (cascade) o'chadi
import { admin, getUser, readBody } from "./_lib/server.js";

const BUCKET = "listing-images";

// <uid>/<listing_id>/<fayl> ko'rinishidagi barcha fayllarni yig'adi
async function collectFiles(uid) {
  const bucket = admin.storage.from(BUCKET);
  const paths = [];
  const { data: top, error } = await bucket.list(uid, { limit: 1000 });
  if (error) throw error;
  for (const entry of top || []) {
    const isFolder = !entry.id && !entry.metadata;
    if (!isFolder) { paths.push(`${uid}/${entry.name}`); continue; }
    let offset = 0;
    for (;;) {
      const { data: files, error: e2 } = await bucket.list(`${uid}/${entry.name}`, { limit: 1000, offset });
      if (e2) throw e2;
      for (const f of files || []) paths.push(`${uid}/${entry.name}/${f.name}`);
      if (!files || files.length < 1000) break;
      offset += 1000;
    }
  }
  return paths;
}

// SQL funksiya hali o'rnatilmagan (migration-legal.sql ishga tushirilmagan) holatni ajratib olamiz
const isMissingFunction = (err) =>
  err && (err.code === "PGRST202" || err.code === "42883" || /could not find the function|does not exist/i.test(err.message || ""));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Faqat POST" });
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: "Sessiya yaroqsiz" });
    if (readBody(req).confirm !== "DELETE") return res.status(400).json({ message: "Tasdiq kerak" });
    const uid = user.id;

    // 0) Arxiv — o'chirishdan OLDIN (e'lonlar soni va blok holati hali bazada)
    const { error: arcErr } = await admin.rpc("archive_account", { p_user_id: uid });
    if (arcErr) {
      if (isMissingFunction(arcErr)) console.warn("archive_account topilmadi — migration-legal.sql ni ishga tushiring");
      else throw arcErr; // arxivsiz o'chirmaymiz — foydalanuvchi qayta urinib ko'radi
    }

    // 1) Rasmlar
    const paths = await collectFiles(uid);
    for (let i = 0; i < paths.length; i += 100) {
      const { error } = await admin.storage.from(BUCKET).remove(paths.slice(i, i + 100));
      if (error) throw error;
    }

    // 2) Avtomatik o'chmaydigan bog'lanishlar
    await admin.from("profiles").update({ referred_by: null }).eq("referred_by", uid);
    await admin.from("phone_reveals").delete().eq("user_id", uid);

    // 3) Akkauntning o'zi (qolgani cascade bilan)
    const { error: delErr } = await admin.auth.admin.deleteUser(uid);
    if (delErr) throw delErr;

    // 4) Saqlash muddati tugagan eski yozuvlarni tozalash (pg_cron bo'lmasa ham ishlaydi)
    try {
      const { error: pErr } = await admin.rpc("purge_expired_legal_data");
      if (pErr && !isMissingFunction(pErr)) console.warn("Tozalashda xato:", pErr.message);
    } catch (_) {}

    return res.status(200).json({ ok: true, files: paths.length, archived: !arcErr });
  } catch (e) {
    console.error("delete-account xatosi:", e?.message || e);
    return res.status(500).json({ message: e?.message || "Server xatosi" });
  }
}
