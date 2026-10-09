// Huquqiy hujjatlar tahriri (YYYY-MM-DD).
// Shartlar, Maxfiylik siyosati yoki Oferta matni o'zgarsa — sanani yangilang:
// raqami tasdiqlangan foydalanuvchilarga "Hujjatlar yangilandi" xabari chiqadi va rozilik qayta yoziladi.
export const LEGAL_VERSION = "2026-10-09";

export const LEGAL_ROUTES = {
  terms: "/qoidalar",
  privacy: "/maxfiylik",
  offer: "/oferta",
  about: "/biz-haqimizda",
};

const MONTHS = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

// "2026-10-09" -> "2026-yil 9-oktabr" / "9 октября 2026 г." / "9 October 2026"
export function legalDate(iso, lang) {
  const [y, m, d] = String(iso).split("-").map(Number);
  const month = (MONTHS[lang] || MONTHS.uz)[m - 1] || "";
  if (lang === "ru") return `${d} ${month} ${y} г.`;
  if (lang === "en") return `${d} ${month} ${y}`;
  return `${y}-yil ${d}-${month}`;
}
