// /api/send-sms-hook.js
// Bu funksiyani Supabase "Send SMS Hook" chaqiradi (Authentication -> Hooks).
// Vazifasi: Supabase generatsiya qilgan OTP kodni Eskiz.uz orqali haqiqiy SMS qilib yuborish.
//
// XAVFSIZLIK: har bir so'rov Supabase imzosi bilan tekshiriladi.
// Imzo to'g'ri bo'lmasa — SMS YUBORILMAYDI. Aks holda har kim bu manzil orqali
// istalgan raqamga, sizning brendingiz nomidan va sizning pulingizga SMS yubora olardi.
// Sozlash: Supabase -> Authentication -> Hooks -> Send SMS hook ochilganda ko'rsatiladigan
// maxfiy kalitni (v1,whsec_... ko'rinishida) Vercel'da SEND_SMS_HOOK_SECRET ga qo'ying.

import crypto from "crypto";

// So'rov tanasini o'zgarishsiz (xom holda) o'qiymiz — imzo aynan shu baytlar ustida hisoblanadi
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString("utf8");
}

// "Standard Webhooks" imzosini tekshiradi (Supabase hook'lari shu standartdan foydalanadi)
function verifySignature(rawBody, headers) {
  const secretEnv = process.env.SEND_SMS_HOOK_SECRET;
  if (!secretEnv) return false; // kalit sozlanmagan bo'lsa — hech narsa yubormaymiz

  const id = headers["webhook-id"];
  const ts = headers["webhook-timestamp"];
  const sigHeader = headers["webhook-signature"];
  if (!id || !ts || !sigHeader) return false;

  // Eski so'rovni qayta yuborish hujumidan himoya: 5 daqiqadan eski bo'lmasin
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(ts)) > 300) return false;

  const key = Buffer.from(secretEnv.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${rawBody}`).digest("base64");
  const expectedBuf = Buffer.from(expected);

  return String(sigHeader).split(" ").some(part => {
    const sig = part.split(",")[1];
    if (!sig) return false;
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
  });
}

let cachedToken = null;
let cachedTokenAt = 0;

async function getEskizToken() {
  // Tokenni 20 daqiqa keshda saqlaymiz (har safar login qilib o'tirmaslik uchun)
  if (cachedToken && Date.now() - cachedTokenAt < 20 * 60 * 1000) return cachedToken;

  const r = await fetch("https://notify.eskiz.uz/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ESKIZ_EMAIL,
      password: process.env.ESKIZ_PASSWORD,
    }),
  });
  const data = await r.json();
  if (!data?.data?.token) {
    console.error("Eskiz login javobi:", data);
    throw new Error("Eskiz tokenini olib bo'lmadi");
  }
  cachedToken = data.data.token;
  cachedTokenAt = Date.now();
  return cachedToken;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Faqat POST so'rovlar qabul qilinadi" });
  }

  try {
    const rawBody = await readRawBody(req);
    if (!verifySignature(rawBody, req.headers)) {
      console.error("send-sms-hook: imzo noto'g'ri yoki SEND_SMS_HOOK_SECRET sozlanmagan — SMS yuborilmadi");
      return res.status(401).json({ message: "Imzo noto'g'ri" });
    }

    // Supabase yuboradigan payload: { user: {...phone...}, sms: { otp: "123456" } }
    const body = JSON.parse(rawBody || "{}");
    const phone = String(body?.user?.phone || "");
    const otp = String(body?.sms?.otp || "");

    // Qo'shimcha himoya: faqat O'zbekiston raqami va faqat raqamlardan iborat kod
    if (!/^\+?998\d{9}$/.test(phone) || !/^\d{4,8}$/.test(otp)) {
      return res.status(400).json({ message: "phone yoki otp formati noto'g'ri" });
    }

    const token = await getEskizToken();
    // Eskiz "998901234567" formatini kutadi (+ belgisisiz)
    const mobilePhone = phone.replace("+", "");
    const message = `Uy24/7 tasdiqlash kodingiz: ${otp}. Hech kimga aytmang!`;

    const smsRes = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // "4546" — Eskiz test rejimidagi standart jo'natuvchi nomi.
      // Haqiqiy ishga tushirganda, Eskiz kabinetida o'z brendingizni tasdiqlatib, shu yerga yozasiz.
      body: JSON.stringify({ mobile_phone: mobilePhone, message, from: "4546" }),
    });

    if (!smsRes.ok) {
      const errText = await smsRes.text();
      console.error("Eskiz SMS xatosi:", errText);
      return res.status(500).json({ message: "SMS yuborishda xatolik" });
    }

    // Supabase talabi: muvaffaqiyatli bo'lsa bo'sh javob va 200 status qaytarish kifoya
    return res.status(200).json({});
  } catch (e) {
    console.error("send-sms-hook xatosi:", e);
    return res.status(500).json({ message: e.message || "Server xatosi" });
  }
}
