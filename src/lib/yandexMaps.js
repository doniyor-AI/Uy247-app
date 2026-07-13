// src/lib/yandexMaps.js
// Yandex Maps JS API'ni yuklash va xaritalarni ishlatish uchun umumiy yordamchilar.
// API kalitni https://developer.tech.yandex.ru dan bepul olish mumkin (JavaScript API va Geocoder).

export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY || "";
export const TASHKENT_CENTER = [41.311081, 69.240562];

let loadPromise = null;

export function loadYmaps() {
  if (!YANDEX_MAPS_API_KEY) return Promise.reject(new Error("no-api-key"));
  if (typeof window !== "undefined" && window.ymaps) return Promise.resolve(window.ymaps);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=uz_UZ`;
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = () => reject(new Error("Yandex Maps yuklanmadi"));
    document.head.appendChild(script);
  });
  return loadPromise;
}
