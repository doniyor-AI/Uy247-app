// Shahar, tuman va qulayliklar bazada o'zbekcha saqlanadi — ekranda (va Telegram xabarlarida)
// tanlangan tilda ko'rsatish uchun lug'at. Ilova ham, server (api/) ham shu fayldan o'qiydi.
export const PLACE_NAMES = {
  ru: {
    "Toshkent shahri": "Ташкент", "Samarqand": "Самарканд", "Buxoro": "Бухара", "Farg'ona": "Фергана", "Andijon": "Андижан", "Namangan": "Наманган",
    "Yunusobod": "Юнусабад", "Chilonzor": "Чиланзар", "Mirzo Ulug'bek": "Мирзо-Улугбек", "Mirobod": "Мирабад", "Yakkasaroy": "Яккасарай",
    "Shayxontohur": "Шайхантахур", "Olmazor": "Алмазар", "Uchtepa": "Учтепа", "Yashnobod": "Яшнабад", "Sergeli": "Сергели",
    "Bektemir": "Бектемир", "Yangihayot": "Янгихаёт", "Markaz": "Центр",
  },
  en: {
    "Toshkent shahri": "Tashkent", "Samarqand": "Samarkand", "Buxoro": "Bukhara", "Farg'ona": "Fergana", "Andijon": "Andijan", "Namangan": "Namangan",
    "Yunusobod": "Yunusabad", "Chilonzor": "Chilanzar", "Mirzo Ulug'bek": "Mirzo Ulugbek", "Mirobod": "Mirabad", "Yakkasaroy": "Yakkasaray",
    "Shayxontohur": "Shaykhantahur", "Olmazor": "Almazar", "Uchtepa": "Uchtepa", "Yashnobod": "Yashnabad", "Sergeli": "Sergeli",
    "Bektemir": "Bektemir", "Yangihayot": "Yangihayot", "Markaz": "City centre",
  },
};

export const AMENITY_NAMES = {
  ru: { "Konditsioner": "Кондиционер", "Mashina turargohi": "Парковка", "Lift": "Лифт", "Muzlatgich": "Холодильник", "Kir yuvish mashinasi": "Стиральная машина" },
  en: { "Konditsioner": "Air conditioning", "Mashina turargohi": "Parking", "Lift": "Lift", "Muzlatgich": "Fridge", "Kir yuvish mashinasi": "Washing machine" },
};

export const placeName = (name, lang) => (name && PLACE_NAMES[lang]?.[name]) || name || "";
