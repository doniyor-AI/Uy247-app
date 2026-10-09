import { detectLang } from "../lib/lang";

// Statik sahifalar (huquqiy hujjatlar, Biz haqimizda) uchun tarjimalar.
// Hujjatlarning o'z matni — legalTexts.js da.
export const PAGE_STR = {
  uz: {
    back: "Orqaga",
    effectiveFrom: "Kuchga kirgan sana",
    contactsTitle: "Aloqa va rekvizitlar",
    reqPending: "Operator rekvizitlari (nomi, STIR, manzili) yuridik shaxs davlat ro'yxatidan o'tkazilgach shu yerda e'lon qilinadi.",
    reqTin: "STIR",
    reqAddress: "Manzil",
    reqDirector: "Rahbar",
    reqBank: "Bank",
    reqAccount: "Hisob raqami",
    reqMfo: "MFO",
    otherDocs: "Boshqa hujjatlar",
    // Biz haqimizda
    aboutTitle: "Biz haqimizda",
    aboutIntro: "Uy24/7 — O'zbekistonda uy-joy ijarasini oddiy va ishonchli qiladigan platforma. Rieltorsiz — to'g'ridan-to'g'ri uy egasidan.",
    a1Title: "Muammo",
    a1Body: "Uy qidirayotgan odam ko'pincha bir xil e'lonni o'nlab rieltordan ko'radi, narx oshirib yuboriladi, va haqiqiy egasiga yetib borish qiyin bo'ladi.",
    a2Title: "Yechim",
    a2Body: "Bizda faqat uy egalari e'lon joylaydi. Har bir e'lon admin tomonidan tekshiriladi, telefon raqam tasdiqlanadi, shikoyat tizimi ishlaydi.",
    a3Title: "Qanday ishlaydi",
    a3Body: "Xaritadan yoki ro'yxatdan uy tanlang, egasi bilan ichki chat orqali bog'laning. Raqamingiz oshkor qilinmaydi. Kelishsangiz — to'g'ridan-to'g'ri uchrashasiz, hech qanday komissiya yo'q.",
    a4Title: "Bog'lanish",
    a4Body: "Savol, taklif yoki hamkorlik uchun:",
  },
  ru: {
    back: "Назад",
    effectiveFrom: "Дата вступления в силу",
    contactsTitle: "Контакты и реквизиты",
    reqPending: "Реквизиты оператора (наименование, ИНН, адрес) будут опубликованы здесь после государственной регистрации юридического лица.",
    reqTin: "ИНН",
    reqAddress: "Адрес",
    reqDirector: "Руководитель",
    reqBank: "Банк",
    reqAccount: "Расчётный счёт",
    reqMfo: "МФО",
    otherDocs: "Другие документы",
    aboutTitle: "О нас",
    aboutIntro: "Uy24/7 — платформа, которая делает аренду жилья в Узбекистане простой и надёжной. Без риелторов — напрямую от владельца.",
    a1Title: "Проблема",
    a1Body: "Тот, кто ищет жильё, часто видит одно и то же объявление у десятков риелторов: цена накручивается, а до настоящего владельца не добраться.",
    a2Title: "Решение",
    a2Body: "У нас объявления размещают только владельцы. Каждое объявление проверяется администратором, номер телефона подтверждается, работает система жалоб.",
    a3Title: "Как это работает",
    a3Body: "Выберите жильё на карте или в списке и напишите владельцу во внутреннем чате — ваш номер останется скрытым. Договорились — общаетесь с владельцем напрямую, без комиссий.",
    a4Title: "Связаться с нами",
    a4Body: "По вопросам, предложениям и сотрудничеству:",
  },
  en: {
    back: "Back",
    effectiveFrom: "Effective date",
    contactsTitle: "Contacts and company details",
    reqPending: "The operator's details (name, TIN, address) will be published here once the legal entity has been registered.",
    reqTin: "TIN",
    reqAddress: "Address",
    reqDirector: "Director",
    reqBank: "Bank",
    reqAccount: "Account number",
    reqMfo: "Bank code (MFO)",
    otherDocs: "Other documents",
    aboutTitle: "About us",
    aboutIntro: "Uy24/7 is a platform that makes renting a home in Uzbekistan simple and trustworthy. No realtors — straight from the owner.",
    a1Title: "The problem",
    a1Body: "Someone looking for a home often sees the same listing from dozens of realtors, the price gets marked up, and reaching the actual owner is difficult.",
    a2Title: "The solution",
    a2Body: "Here only owners post listings. Every listing is reviewed by an admin, phone numbers are verified, and a reporting system is in place.",
    a3Title: "How it works",
    a3Body: "Pick a home on the map or in the list and message the owner through the in-app chat — your number stays private. Once you agree, you deal with the owner directly, with no commission.",
    a4Title: "Get in touch",
    a4Body: "For questions, suggestions and partnerships:",
  },
};

// Tanlangan tilni o'qish (asosiy ilova bilan bir xil manba va bir xil aniqlash tartibi)
export function getPageLang() {
  const l = detectLang();
  return PAGE_STR[l] ? l : "uz";
}
