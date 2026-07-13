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
  if (!token || !chatId) return; // sozlanmagan bo'lsa, jim o'tkazib yuboradi

  const url = `${process.env.SITE_URL || "https://uy247.uz"}/elon/${listing.id}`;
  const rentLabel = listing.rent_type === "Kunlik" ? "kuniga" : "oyiga";
  const caption =
    `🏠 <b>${escapeHtml(listing.title)}</b>\n` +
    `📍 ${escapeHtml(listing.district || "")}, ${escapeHtml(listing.city)}\n` +
    `🛏 ${listing.rooms} xona · ${listing.area} m²\n` +
    `💰 ${Number(listing.price).toLocaleString("uz-UZ")} so'm / ${rentLabel}\n\n` +
    `🔗 ${url}`;

  try {
    if (listing.imageUrl) {
      await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, photo: listing.imageUrl, caption, parse_mode: "HTML" }),
      });
    } else {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: caption, parse_mode: "HTML" }),
      });
    }
  } catch (e) {
    console.error("Telegram xatosi:", e.message);
  }
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Faqat POST" });
  try {
    const { listing } = req.body; // { id, title, city, district, rooms, area, price, rent_type, property_type, imageUrl }
    if (!listing?.id) return res.status(400).json({ message: "listing topilmadi" });

    // 1) Telegram
    await postToTelegram(listing);

    // 2) Mos saqlangan qidiruvlarni topib, egalariga SMS yuborish
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

    return res.status(200).json({ notified: seenPhones.size });
  } catch (e) {
    console.error("on-listing-approved xatosi:", e);
    return res.status(500).json({ message: e.message });
  }
}
