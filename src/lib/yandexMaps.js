// src/lib/yandexMaps.js
// Yandex Maps JS API'ni yuklash uchun yordamchi.
// Agar VITE_YANDEX_MAPS_API_KEY sozlanmagan bo'lsa, ilova avtomatik
// OpenStreetMap'ga o'tadi (App.jsx ichidagi MapPicker/MapListView/MapStatic'ga qarang).

export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY || "";

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
