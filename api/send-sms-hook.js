// /api/send-sms-hook.js
// Bu funksiyani Supabase "Send SMS Hook" chaqiradi (Authentication -> Hooks).
// Vazifasi: Supabase generatsiya qilgan OTP kodni Eskiz.uz orqali haqiqiy SMS qilib yuborish.

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
    // Supabase yuboradigan payload: { user: {...phone...}, sms: { otp: "123456" } }
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const phone = body?.user?.phone;
    const otp = body?.sms?.otp;

    if (!phone || !otp) {
      return res.status(400).json({ message: "phone yoki otp topilmadi" });
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
