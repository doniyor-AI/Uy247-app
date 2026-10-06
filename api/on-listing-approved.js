// /api/on-listing-approved.js
// Admin bir e'lonni "tasdiqlash" bosganda chaqiriladi. Ikki ishni bajaradi:
// 1) Telegram kanaliga avtomatik joylash
// 2) Shu mezonlarga mos "saqlangan qidiruv"i bor foydalanuvchilarga SMS yuborish
//
// DIQQAT: bu funksiya SUPABASE_SERVICE_ROLE_KEY ishlatadi (barcha foydalanuvchilar
// ma'lumotini o'qish uchun). Bu kalitni HECH QACHON frontend kodiga qo'ymang —
// faqat shu yerda, server tomonida, Vercel muhit o'zgaruvchisi sifatida saqlanadi.

import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

let cachedToken = null;
let cachedTokenAt = 0;
async function getEskizToken() {
  if (cachedToken && Date.now() - cachedTokenAt < 20 * 60 * 1000) return cachedToken;
  const r = await fetch("https://notify.eskiz.uz/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: process.env.ESKIZ_EMAIL, password: process.env.ESKIZ_PASSWORD }),
  });
  const data = await r.json();
  if (!data?.data?.token) throw new Error("Eskiz tokenini olib bo'lmadi");
  cachedToken = data.data.token;
  cachedTokenAt = Date.now();
  return cachedToken;
}

async function sendSms(phone, message) {
  try {
    const token = await getEskizToken();
    await fetch("https://notify.eskiz.uz/api/message/sms/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mobile_phone: phone.replace("+", ""), message, from: "4546" }),
    });
  } catch (e) {
    console.error("SMS yuborishda xato:", e.message);
  }
}

async function postToTelegram(listing) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) {
    console.error("Telegram sozlanmagan: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHANNEL_ID yo'q");
    return { ok: false, reason: "TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHANNEL_ID muhit o'zgaruvchisi topilmadi" };
  }

  const url = `${process.env.SITE_URL || "https://uy247.uz"}/elon/${listing.id}`;
  const rentLabel = listing.rent_type === "Kunlik" ? "kuniga" : "oyiga";
  const isShared = listing.listing_mode === "shared";
  const genderLabel = listing.gender_pref === "erkak" ? "Erkaklar"
    : listing.gender_pref === "ayol" ? "Ayollar"
    : listing.gender_pref === "aralash" ? "Aralash" : "";

  const caption = isShared
    ? `🛏 <b>${escapeHtml(listing.title)}</b>\n` +
      `📍 ${escapeHtml(listing.district || "")}, ${escapeHtml(listing.city)}\n` +
      `✅ <b>${listing.free_spots || 0} o'rin bo'sh</b>${genderLabel ? ` · ${genderLabel}` : ""}\n` +
      `📐 ${listing.area} m² · ${listing.rooms} xonali\n` +
      `💰 ${Number(listing.price).toLocaleString("uz-UZ")} so'm / ${rentLabel} (1 kishi)\n\n` +
      `🔗 ${url}`
    : `🏠 <b>${escapeHtml(listing.title)}</b>\n` +
      `📍 ${escapeHtml(listing.district || "")}, ${escapeHtml(listing.city)}\n` +
      `🛏 ${listing.rooms} xona · ${listing.area} m²\n` +
      `💰 ${Number(listing.price).toLocaleString("uz-UZ")} so'm / ${rentLabel}\n\n` +
      `🔗 ${url}`;

  try {
    const endpoint = listing.imageUrl ? "sendPhoto" : "sendMessage";
    const body = listing.imageUrl
      ? { chat_id: chatId, photo: listing.imageUrl, caption, parse_mode: "HTML" }
      : { chat_id: chatId, text: caption, parse_mode: "HTML" };

    const res = await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error("Telegram API xatosi:", JSON.stringify(data));
      return { ok: false, reason: data.description || `Telegram xato qaytardi (${res.status})` };
    }
    return { ok: true };
  } catch (e) {
    console.error("Telegram xatosi:", e.message);
    return { ok: false, reason: e.message };
  }
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

// Faqat shu manzillardan kelgan brauzer so'rovlariga ruxsat (admin panel).
// Qo'shimcha manzil kerak bo'lsa — Vercel'da ADMIN_ORIGINS="https://a.uz,https://b.uz"
const ALLOWED_ORIGINS = [
  "https://uy247-admin.vercel.app",
  ...(process.env.ADMIN_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean),
];

// JWT ichidagi ma'lumotni o'qish (imzo getUser() orqali alohida tekshiriladi)
function jwtPayload(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(part, "base64").toString("utf8"));
  } catch (_) { return {}; }
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ message: "Faqat POST" });
  try {
    // ---- 1) KIM CHAQIRYAPTI: faqat 2FA bilan kirgan admin ----
    const authHeader = req.headers.authorization || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!jwt) return res.status(401).json({ message: "Avtorizatsiya kerak" });

    const { data: userData, error: userErr } = await admin.auth.getUser(jwt); // imzo shu yerda tekshiriladi
    if (userErr || !userData?.user) return res.status(401).json({ message: "Sessiya yaroqsiz" });
    if (jwtPayload(jwt).aal !== "aal2") return res.status(403).json({ message: "2FA talab qilinadi" });

    const { data: prof } = await admin.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
    if (!prof?.is_admin) return res.status(403).json({ message: "Ruxsat yo'q" });

    // ---- 2) E'LONNI BAZADAN O'QIYMIZ — tashqaridan kelgan matnga ishonmaymiz ----
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const listingId = body.listing_id;
    if (!listingId) return res.status(400).json({ message: "listing_id topilmadi" });

    const { data: row, error: rowErr } = await admin
      .from("listings")
      .select("*, listing_images(url, position)")
      .eq("id", listingId)
      .maybeSingle();
    if (rowErr || !row) return res.status(404).json({ message: "E'lon topilmadi" });
    if (row.status !== "approved") return res.status(400).json({ message: "E'lon tasdiqlanmagan" });

    // Bir e'lon kanalga ikki marta chiqmasin
    if (row.telegram_posted_at) {
      return res.status(200).json({ notified: 0, telegram: { ok: true, skipped: true } });
    }

    const firstImage = [...(row.listing_images || [])].sort((a, b) => (a.position || 0) - (b.position || 0))[0]?.url || null;
    const listing = {
      id: row.id, title: row.title, city: row.city, district: row.district,
      rooms: row.rooms, area: row.area, price: row.price, rent_type: row.rent_type,
      property_type: row.property_type, imageUrl: firstImage,
      listing_mode: row.listing_mode, free_spots: row.free_spots, gender_pref: row.gender_pref,
    };

    // 1) Telegram
    const telegramResult = await postToTelegram(listing);
    if (telegramResult?.ok) {
      await admin.from("listings").update({ telegram_posted_at: new Date().toISOString() }).eq("id", row.id);
    }

    // 2) Mos saqlangan qidiruvlarni topib, egalariga SMS yuborish (bu qismdagi xato Telegram natijasini yashirmasin)
    let notifiedCount = 0;
    try {
      const { data: searches, error } = await admin
        .from("saved_searches")
        .select("*, profiles(phone)")
        .eq("city", listing.city);
      if (error) throw error;

      const matches = (searches || []).filter((s) => {
        if (s.rent_type && s.rent_type !== "Barchasi" && s.rent_type !== listing.rent_type) return false;
        if (s.property_type && s.property_type !== "Barchasi" && s.property_type !== listing.property_type) return false;
        if (s.rooms && s.rooms !== "Barchasi") {
          const want = s.rooms === "4+" ? listing.rooms >= 4 : Number(s.rooms) === listing.rooms;
          if (!want) return false;
        }
        if (s.min_price && listing.price < s.min_price) return false;
        if (s.max_price && listing.price > s.max_price) return false;
        return true;
      });

      const seenPhones = new Set();
      for (const m of matches) {
        const phone = m.profiles?.phone;
        if (!phone || seenPhones.has(phone)) continue;
        seenPhones.add(phone);
        await sendSms(phone, `Uy24/7: saqlangan qidiruvingizga mos yangi e'lon qo'shildi — "${listing.title}". Ko'rish: ${process.env.SITE_URL || "uy247.uz"}/elon/${listing.id}`);
      }
      notifiedCount = seenPhones.size;
    } catch (smsErr) {
      console.error("Saqlangan qidiruv/SMS qismida xato:", smsErr.message);
    }

    return res.status(200).json({ notified: notifiedCount, telegram: telegramResult });
  } catch (e) {
    console.error("on-listing-approved xatosi:", e);
    return res.status(500).json({ message: e.message });
  }
}
