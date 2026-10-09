// Server funksiyalari uchun umumiy yordamchilar (Vercel "_" bilan boshlangan papkani alohida manzil qilmaydi).
// DIQQAT: SUPABASE_SERVICE_ROLE_KEY faqat shu yerda — server tomonida ishlatiladi, frontend'ga hech qachon chiqmaydi.
import { createClient } from "@supabase/supabase-js";
import { placeName } from "../../src/lib/places.js";

export const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export const LANGS = ["uz", "ru", "en"];
export const siteUrl = () => (process.env.SITE_URL || "https://uy247-app.vercel.app").replace(/\/+$/, "");
export const safeLang = (l) => (LANGS.includes(l) ? l : "uz");

export function readBody(req) {
  try { return typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {}); }
  catch (_) { return {}; }
}

// So'rov kimdan kelganini aniqlaydi: "Authorization: Bearer <JWT>" — imzo Supabase'da tekshiriladi
export async function getUser(req) {
  const h = req.headers?.authorization || "";
  const jwt = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!jwt) return null;
  const { data, error } = await admin.auth.getUser(jwt);
  if (error || !data?.user) return null;
  return data.user;
}

// Telegram Bot API chaqiruvi — xato bo'lsa ham { ok:false, ... } qaytaradi, otmaydi
export async function tg(method, payload = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN topilmadi" };
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await r.json();
  } catch (e) {
    return { ok: false, description: e.message };
  }
}

let botUsername = null;
export async function getBotUsername() {
  if (botUsername) return botUsername;
  const r = await tg("getMe");
  if (!r.ok || !r.result?.username) throw new Error(r.description || "Bot nomini olib bo'lmadi");
  botUsername = r.result.username;
  return botUsername;
}

export const escapeHtml = (s) => String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// 4 200 000 (uz/ru) yoki 4,200,000 (en)
export const fmtNum = (n, lang) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : " ");

// ---------- Bot xabarlari (foydalanuvchi tanlagan tilda) ----------
const T = {
  uz: {
    linked: "✅ Uy24/7 bildirishnomalari ulandi!\n\nEndi sizga yozishsa yoki saqlangan qidiruvingizga mos e'lon chiqsa — shu yerga xabar keladi.\nO'chirish: ilova → Sozlamalar → Telegram.",
    expired: "⌛ Bu havola eskirgan. Ilovada Sozlamalar → Telegram → «Telegram'ni ulash» tugmasini qaytadan bosing.",
    newMessage: "💬 <b>Yangi xabar</b> — «{title}»\n\n{text}\n\n👉 Javob berish: {url}",
    searchMatch: "🔔 <b>Saqlangan qidiruvingizga mos yangi e'lon</b>\n\n🏠 {title}\n📍 {place}\n💰 {price}\n\n🔗 {url}",
    currency: "so'm", perDay: "kun", perMonth: "oy", perPerson: " (1 kishi)",
  },
  ru: {
    linked: "✅ Уведомления Uy24/7 подключены!\n\nТеперь, когда вам напишут или появится объявление по сохранённому поиску, сообщение придёт сюда.\nОтключить: приложение → Настройки → Telegram.",
    expired: "⌛ Ссылка устарела. В приложении откройте Настройки → Telegram и снова нажмите «Подключить Telegram».",
    newMessage: "💬 <b>Новое сообщение</b> — «{title}»\n\n{text}\n\n👉 Ответить: {url}",
    searchMatch: "🔔 <b>Новое объявление по вашему сохранённому поиску</b>\n\n🏠 {title}\n📍 {place}\n💰 {price}\n\n🔗 {url}",
    currency: "сум", perDay: "сутки", perMonth: "мес.", perPerson: " (за человека)",
  },
  en: {
    linked: "✅ Uy24/7 notifications are on!\n\nWhen someone messages you or a listing matches your saved search, you'll get a message here.\nTo turn off: app → Settings → Telegram.",
    expired: "⌛ This link has expired. In the app, open Settings → Telegram and tap “Connect Telegram” again.",
    newMessage: "💬 <b>New message</b> — “{title}”\n\n{text}\n\n👉 Reply: {url}",
    searchMatch: "🔔 <b>New listing matching your saved search</b>\n\n🏠 {title}\n📍 {place}\n💰 {price}\n\n🔗 {url}",
    currency: "UZS", perDay: "night", perMonth: "month", perPerson: " (per person)",
  },
};
const fill = (s, vars) => Object.entries(vars).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(v), s);

export const botText = {
  linked: (lang) => T[safeLang(lang)].linked,
  expired: (lang) => T[safeLang(lang)].expired,
  // Kodsiz /start — foydalanuvchi tilini bilmaymiz, shuning uchun uch tilda
  startHint: () => "👋 Uy24/7\n\n🇺🇿 Ilovada: Sozlamalar → Telegram → «Telegram'ni ulash».\n🇷🇺 В приложении: Настройки → Telegram → «Подключить Telegram».\n🇬🇧 In the app: Settings → Telegram → “Connect Telegram”.",
  newMessage: (lang, { title, text }) => fill(T[safeLang(lang)].newMessage, {
    title: escapeHtml(title || "Uy24/7"),
    text: escapeHtml(String(text || "").slice(0, 300)) + (String(text || "").length > 300 ? "…" : ""),
    url: `${siteUrl()}/xabarlar`,
  }),
  searchMatch: (lang, l) => {
    const L = safeLang(lang), t = T[L];
    const price = `${fmtNum(l.price, L)} ${t.currency}/${l.rent_type === "Kunlik" ? t.perDay : t.perMonth}${l.listing_mode === "shared" ? t.perPerson : ""}`;
    const place = [placeName(l.district, L), placeName(l.city, L)].filter(Boolean).join(", ");
    return fill(t.searchMatch, { title: escapeHtml(l.title), place: escapeHtml(place), price, url: `${siteUrl()}/elon/${l.id}` });
  },
};
