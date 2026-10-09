// Operator — Uy24/7 ni boshqaruvchi yuridik shaxs (MChJ) rekvizitlari.
// MChJ ro'yxatdan o'tgach shu yerni to'ldiring va GitHub'ga qayta yuklang.
// Bo'sh qoldirilgan maydonlar sahifalarda ko'rsatilmaydi.
// Bu ma'lumotlar Oferta, Maxfiylik siyosati, Foydalanish shartlari va "Biz haqimizda" sahifalarida chiqadi.
export const COMPANY = {
  name: "",          // masalan: "UY247" MChJ
  tin: "",           // STIR (INN) — 9 ta raqam
  address: "",       // yuridik manzil
  director: "",      // rahbar: F.I.Sh.
  bankName: "",      // bank nomi
  bankAccount: "",   // hisob raqami — 20 ta raqam
  bankMfo: "",       // bank MFO kodi — 5 ta raqam

  // Aloqa: foydalanuvchilarning murojaatlari shu yerga keladi — albatta ISHLAYDIGAN pochta bo'lsin.
  // uy247.uz domeni hali ulanmagan bo'lsa, vaqtincha ochiq Gmail yozing (masalan: uy247.yordam@gmail.com).
  email: "info@uy247.uz",
  phone: "",         // masalan: +998 90 123 45 67
  telegram: "",      // masalan: uy247_support (@ belgisisiz)

  // Serverlar qayerda (Maxfiylik siyosati, 6-bo'lim). Vercel — AQSh.
  // Supabase mintaqasini tekshiring: Supabase → Project Settings → General → Region.
  // Masalan "Central EU (Frankfurt)" — Yevropa Ittifoqi; "Southeast Asia (Singapore)" bo'lsa, Singapurni qo'shing.
  serverCountries: {
    uz: "AQSh va Yevropa Ittifoqi",            // matnda: "...— AQSh va Yevropa Ittifoqida joylashgan"
    ru: "в США и Европейском союзе",
    en: "in the USA and the European Union",
  },
};
