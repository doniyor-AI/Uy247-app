// Interfeys tilini aniqlash — asosiy ilova, statik sahifalar va xarita bir xil natija olishi uchun.
// Tartib:
//  1) Foydalanuvchi oldin tanlagan til (localStorage) — har doim ustun.
//  2) Brauzer tillari ichida o'zbekcha bo'lsa — o'zbekcha.
//  3) Brauzer ruscha (yoki rus tilida ko'p o'qiladigan qo'shni tillar) — ruscha.
//  4) Boshqa til (inglizcha, nemischa...): qurilma O'zbekiston vaqt mintaqasida bo'lsa — o'zbekcha
//     (telefoni inglizcha sozlangan mahalliy foydalanuvchi), aks holda — inglizcha (chet ellik mehmon).
export const SUPPORTED_LANGS = ["uz", "ru", "en"];
const RU_FAMILY = ["ru", "be", "kk", "ky", "tg"];
const UZ_TIMEZONES = ["Asia/Tashkent", "Asia/Samarkand"];

export function detectLang() {
  try {
    const saved = localStorage.getItem("uy247_lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch (_) {}
  try {
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""])
      .map((l) => String(l || "").toLowerCase());
    if (list.some((l) => l.startsWith("uz"))) return "uz";
    const first = (list[0] || "").split(/[-_]/)[0];
    if (!first) return "uz";
    if (RU_FAMILY.includes(first)) return "ru";
    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (_) {}
    if (UZ_TIMEZONES.includes(tz)) return "uz";
    return "en";
  } catch (_) {
    return "uz";
  }
}
