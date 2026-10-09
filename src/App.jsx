import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search, Heart, Plus, User, MapPin, Phone, X, Check,
  SlidersHorizontal, ChevronRight, ChevronLeft, BedDouble, MessageSquare,
  Maximize2, ShieldCheck, Building2, ArrowLeft, Flag,
  ImagePlus, Trash2, Settings as SettingsIcon, Globe, Lock,
  Bell, LogOut, TrendingUp, Users, ClipboardList, AlertTriangle,
  Sparkles, Eye, CircleCheck, CircleX, ShieldAlert, MessageCircle, Send, Camera,
  ArrowUpDown, Home, Building, Store, Share2, Ban, Map, List, CalendarDays, LocateFixed, Pencil, ChevronDown
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { loadYmaps, YANDEX_MAPS_API_KEY } from "./lib/yandexMaps";
import { detectLang } from "./lib/lang";
import { PLACE_NAMES, AMENITY_NAMES, placeName } from "./lib/places";
import { COMPANY } from "./lib/company";
import { LEGAL_VERSION, LEGAL_ROUTES } from "./lib/legal";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet'ning standart marker rasmlari Vite bilan to'g'ri yuklanishi uchun majburiy sozlash
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

/* ---------------------------------------------------------
   Uy24/7 — rieltorsiz uy-joy ijara platformasi (demo prototip)
   v3: + Ichki chat (raqamni oshkor qilmasdan yozishish)
       + Haqiqiy rasm yuklash (qurilmadan tanlash va ko'rish)
--------------------------------------------------------- */

const CITIES = ["Toshkent shahri", "Samarqand", "Buxoro", "Farg'ona", "Andijon", "Namangan"];
const DISTRICTS = { "Toshkent shahri": ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Mirobod", "Yakkasaroy", "Shayxontohur", "Olmazor", "Uchtepa", "Yashnobod", "Sergeli", "Bektemir", "Yangihayot"] };
const AMENITIES_LIST = ["Wi-Fi", "Konditsioner", "Mashina turargohi", "Lift", "Muzlatgich", "Kir yuvish mashinasi"];


const STR = {
  uz: {
    _lang: "uz",
    navSearch: "Qidirish",
    navFavs: "Sevimli",
    navPost: "E'lon berish",
    navProfile: "Profil",
    settings: "Sozlamalar",
    language: "Til",
    notifications: "Bildirishnomalar",
    myListings: "Mening e'lonlarim",
    logout: "Chiqish",
    cancel: "Bekor qilish",
    boost: "Top qilish",
    pending: "Kutilmoqda",
    approved: "Faol",
    blocked: "Bloklangan",
    guest: "Mehmon",
    unverified: "Tasdiqlanmagan",
    verified: "Tasdiqlangan",
    navChats: "Xabarlar",
    writeMessage: "Xabar yozing...",
    noChats: "Hozircha xabarlar yo'q. Yoqqan e'longa kirib, chat orqali yozing.",
    chatCta: "Chat orqali yozish",
    chatHint: "Raqamingiz oshkor qilinmaydi",
    sortNew: "Yangi qo'shilgan",
    sortCheap: "Eng arzoni",
    sortPopular: "Eng ommabop",
    priceRange: "Narx oralig'i (so'm)",
    from: "dan",
    to: "gacha",
    roomsCount: "Xonalar soni",
    all: "Barchasi",
    daily: "Kunlik",
    monthly: "Oylik",
    saveSearch: "Qidiruvni saqlash",
    verifiedOwner: "Tasdiqlangan egasi",
    noResults: "Bu filtrlar bo'yicha e'lon topilmadi. Filtrni o'zgartirib ko'ring.",
    roomsHeader: "Xonalar",
    areaHeader: "Maydon",
    floorHeader: "Qavat",
    descTitle: "Tavsif",
    amenitiesTitle: "Qulayliklar",
    addressTitle: "Manzil",
    contactOwner: "Egasi bilan bog'lanish",
    callBtn: "Qo'ng'iroq",
    smsBtn: "SMS",
    linkCopied: "Havola nusxalandi",
    similarListings: "Shunga o'xshash e'lonlar",
    occupiedDays: "Band kunlar",
    occupiedLegend: "Band",
    freeLegend: "Bo'sh",
    titleLabel: "E'lon sarlavhasi",
    propertyTypeLabel: "Uy turi",
    cityLabel: "Shahar",
    districtLabel: "Tuman",
    floorLabel: "Qavat",
    areaLabelM2: "Maydon (m²)",
    rentTypeLabel: "Ijara turi",
    priceLabelSom: "Narx (so'm)",
    amenitiesLabel: "Qulayliklar",
    descLabel: "Tavsif",
    addressMapLabel: "Aniq manzil (xaritada belgilang)",
    ownersOnlyNotice: "Bu platformada faqat uy egalari e'lon joylashi mumkin. Rieltor yoki vositachi ekanligi aniqlansa, e'lon o'chiriladi va akkaunt bloklanadi.",
    submitBtn: "E'lonni joylash",
    submitting: "Yuklanmoqda...",
    successTitle: "E'lon yuborildi!",
    successBody: "E'loningiz admin tomonidan tekshirilmoqda (odatda 1 soat ichida). Tasdiqlangach qidiruvda ko'rinadi.",
    typeKvartira: "Kvartira",
    typeHovli: "Hovli / xususiy uy",
    typeOfis: "Ofis / do'kon",
    termsLink: "Foydalanish shartlari",
    aboutLink: "Biz haqimizda",
    detailBtn: "Batafsil",
    modeLabel: "Ijara shakli",
    modeWhole: "Butun uy",
    modeShared: "O'rin (sherik bilan)",
    roomsConfigLabel: "Xonalar va o'rinlar",
    roomWord: "Xona",
    capacityLabel: "Jami o'rin",
    occupiedLabel: "Band",
    addRoomBtn: "Xona qo'shish",
    freeSpotsTotal: "Jami bo'sh o'rin",
    noFreeSpots: "Bo'sh o'rin yo'q",
    perPerson: "1 kishi uchun",
    pricePerPersonLabel: "Narx — 1 kishi uchun (so'm)",
    genderLabel: "Kim yashaydi",
    genderMale: "Erkaklar",
    genderFemale: "Ayollar",
    genderMixed: "Aralash",
    spotFreedBtn: "O'rin bo'shadi",
    spotTakenBtn: "O'rin band bo'ldi",
    filterFreeSpots: "Bo'sh o'rinlar",
    anyMode: "Barchasi",
    roomsBreakdown: "Xonalar holati",
    youPrefix: "Siz: ",
    dailyShort: "Kunlik",
    monthlyShort: "Oylik",
    modeWholeShort: "Butun uy",
    modeSharedShort: "Sherik bilan",
    filterTitle: "Filtr",
    clearFilters: "Tozalash",
    showResultsNone: "Mos e'lon topilmadi",
    sortLabel: "Saralash",
    viewList: "Ro'yxat",
    viewMap: "Xarita",
    closeLabel: "Yopish",
    searchSaved: "Qidiruv saqlandi",
    boostRequestSent: "So'rov qabul qilindi. To'lov tasdiqlangach e'loningiz Top bo'ladi.",
    boostRequestError: "Xatolik yuz berdi, qayta urinib ko'ring.",
    accountBlockedTitle: "Akkauntingiz bloklangan",
    revealPhoneBtn: "Raqamni ko'rsatish",
    phoneLimitReached: "Bugungi limit tugadi — ertaga yana ko'ra olasiz. Chat orqali yozishingiz mumkin.",
    phoneUnavailable: "Egasi raqam qoldirmagan — chat orqali yozing.",
    resubmittedForReview: "O'zgarishlar saqlandi. Sarlavha, tavsif yoki rasm o'zgargani uchun e'lon qayta tekshiruvga yuborildi.",
    accountBlockedBody: "Platforma qoidalari buzilgani sababli e'lon joylash va xabar yozish cheklangan. Xato deb hisoblasangiz: {email}",
    preparingPhotos: "Tayyorlanmoqda...",
    loadMore: "Yana ko'rsatish",
    yesterday: "Kecha",
    mapDragHint: "Xaritani surib, belgini uyingiz ustiga to'g'rilang. Aniqroq bo'lishi uchun yaqinlashtiring.",
    months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    weekdays: ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"],
    bookingEditTitle: "Band kunlarni belgilash",
    bookingEditHint: "Kunlarga bosib, band/bo'sh holatini belgilang.",
    saveBtn: "Saqlash",
    savingBtn: "Saqlanmoqda...",
    geoUnsupported: "Bu qurilma joylashuvni aniqlay olmaydi",
    geoDenied: "Joylashuvga ruxsat berilmadi. Brauzer sozlamalarida ruxsat bering.",
    editListing: "Tahrirlash",
    deleteListing: "O'chirish",
    editTitle: "E'lonni tahrirlash",
    deleteConfirmTitle: "E'lonni o'chirish",
    deleteConfirmBody: "Bu e'lon butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.",
    cancelBtn: "Bekor qilish",
    confirmDeleteBtn: "Ha, o'chirish",
    blockedReason: "Bloklanish sababi",
    noReasonGiven: "Sabab ko'rsatilmagan",
    boostTitle: "Top e'lon qilish",
    boostDays7: "7 kun",
    boostDays30: "30 kun",
    boostDesc7: "Qidiruv natijalarida yuqorida chiqadi",
    boostDesc30: "Eng ko'p tanlanadigan variant",
    boostFreeCredit: "Bepul kredit bilan (7 kun)",
    payMethod: "To'lov usuli",
    reportTitle: "Shubhali deb belgilash",
    reportSubmit: "Yuborish",
    reportFooter: "Shikoyat admin tomonidan 24 soat ichida ko'rib chiqiladi.",
    titlePlaceholder: "Masalan: Yunusobodda yorug' 2 xonali",
    ismLabel: "Ism",
    ismPlaceholder: "Ismingiz",
    familiyaLabel: "Familiya",
    familiyaPlaceholder: "Familiyangiz",
    nameHint: "Faqat tasdiqlash uchun, e'londa ochiq ko'rsatilmaydi.",
    addPhotoBtn: "Qo'shish",
    photosHint: "Telefon galereyasidan yoki kameradan tanlashingiz mumkin",
    descPlaceholder: "Uyingiz haqida qisqacha yozing: ta'mir, mebel, texnika...",
    ownerConfirmBold: "rieltor emasman",
    sessionNotFoundError: "Seans topilmadi, sahifani yangilab qayta urinib ko'ring.",
    genericError: "Xatolik yuz berdi, qayta urinib ko'ring.",
    successBody2: "Holatini \"Profil → Mening e'lonlarim\"da kuzatib boring.",
    verifyPhoneBtn: "Raqamni tasdiqlash",
    noListingsYet: "Hali e'lon joylamagansiz.",
    occupiedBadge: "Band",
    topActiveLabel: "TOP faol",
    markFreeBtn: "Bo'sh deb belgilash (qidiruvda qayta ko'rinadi)",
    markOccupiedBtn: "Band deb belgilash (vaqtincha yashirish)",
    markBookingBtn: "Band kunlarni belgilash",
    referralTitle: "Do'stingizni taklif qiling",
    referralSubtitle: "Har bir taklif qilingan do'stingiz ro'yxatdan o'tsa — ikkalangizga ham bepul \"Top e'lon\" krediti beriladi.",
    copyBtn: "Nusxalash",
    currentCreditsLabel: "Joriy bonus kredit:",
    ta: "ta",
    savedSearchesTitle: "Saqlangan qidiruvlar",
    loadingText: "Yuklanmoqda...",
    emptyFavs: "Sevimlilar bo'sh. Yoqqan e'lonlarni yurak belgisi bilan saqlang.",
    verifyTitle1: "Raqamni tasdiqlash",
    verifyTitle2: "SMS kodni kiriting",
    verifyIntro: "Egasi bilan bog'lanish uchun raqamingizni tasdiqlang. Bu soxta so'rovlardan himoya qiladi.",
    sendCodeBtn: "Kod yuborish",
    sendingCode: "Yuborilmoqda...",
    confirmBtn: "Tasdiqlash",
    checkingCode: "Tekshirilmoqda...",
    sendCodeError: "Kod yuborishda xatolik. Raqamni tekshirib qayta urinib ko'ring.",
    codeInvalidError: "Kod noto'g'ri yoki muddati o'tgan.",
    appTitle: "Uy24/7 — rieltorsiz uy-joy ijarasi",
    currency: "so'm",
    perDay: "kun",
    perMonth: "oy",
    sqm: "m²",
    mln: "mln",
    thousand: "ming",
    resultsN: "{n} ta e'lon",
    showResultsN: "{n} ta e'lonni ko'rsatish",
    viewsN: "{n} marta ko'rilgan",
    daysLeftN: "{n} kun qoldi",
    favCountN: "{n} kishi sevimliga qo'shgan",
    chatCountN: "{n} kishi yozgan",
    freeSpotsN: "{n} o'rin bo'sh",
    freeN: "{n} bo'sh",
    roomsN: "{n} xona",
    roomCapacityN: "{n} kishilik",
    boostLeftN: "{n} ta qoldi",
    photosCountN: "Rasmlar (kamida 3 ta) — {n} ta qo'shildi",
    codeSentToN: "{phone} raqamiga yuborilgan 6 xonali kodni kiriting.",
    payWith: "{p} orqali",
    priceFromP: "{p} dan",
    priceToP: "{p} gacha",
    searchPlaceholder: "Qidirish...",
    chatSafetyNote: "Suhbat Uy24/7 ichida, telefon raqamlar oshkor qilinmaydi",
    listingFallback: "E'lon",
    smsTemplate: "Assalomu alaykum! Uy24/7 saytida \"{title}\" e'loningizga qiziqdim.",
    reportRealtor: "Bu rieltor/vositachi",
    reportWrongPrice: "Narx noto'g'ri ko'rsatilgan",
    reportScam: "Firibgarlik shubhasi",
    reportUnavailable: "E'lon o'chirilgan/band",
    dangerZone: "Xavfli hudud",
    deleteProfileBtn: "Profilni o'chirish",
    deleteProfileConfirm: "Aniq o'chirmoqchimisiz? E'lonlar, rasmlar, xabarlar va sevimlilar darhol va butunlay o'chiriladi. Firibgarlikka qarshi 1 yil davomida faqat qisqa yozuv saqlanadi: raqam, ism-familiya, sanalar, bloklash holati va sababi, e'lonlar va shikoyatlar soni.",
    legalSection: "Huquqiy",
    dailyLimitError: "Bugungi limit tugadi — ertaga qayta urinib ko'ring.",
    notVerifiedError: "Avval telefon raqamingizni tasdiqlang.",
    rlsLimitError: "Amalni bajarib bo'lmadi: kunlik limit tugagan yoki akkauntingiz cheklangan.",
    networkError: "Internet aloqasi yo'q. Ulanishni tekshirib, qayta urinib ko'ring.",
    fileTooLargeError: "Rasm hajmi juda katta (ko'pi bilan 10 MB).",
    codeTooSoonError: "Yangi kod so'rashdan oldin biroz kuting.",
    phoneInvalidError: "Raqam noto'g'ri. Namuna: +998901234567",
    photosUpdateError: "Rasmlarni yangilab bo'lmadi. Qayta urinib ko'ring.",
    backLabel: "Orqaga",
    shareLabel: "Ulashish",
    favLabel: "Sevimlilarga qo'shish",
    sendLabel: "Yuborish",
    myLocationLabel: "Mening joylashuvim",
    accountSection: "Akkaunt",
    phoneNumberLabel: "Telefon raqami",
    telegramTitle: "Telegram orqali xabarnoma",
    telegramLinked: "Ulangan",
    telegramNotLinked: "Ulanmagan",
    telegramDesc: "Bepul. Sizga kimdir yozsa yoki saqlangan qidiruvingizga mos e'lon chiqsa — darrov Telegram'ga xabar keladi.",
    telegramConnectBtn: "Telegram'ni ulash",
    telegramUnlinkBtn: "Telegram'ni uzish",
    telegramWaiting: "Telegram'da «START» tugmasini bosing va shu yerga qayting...",
    telegramLinkedToast: "Telegram ulandi ✅",
    telegramError: "Telegram bilan bog'lanib bo'lmadi. Keyinroq urinib ko'ring.",
    telegramNeedVerify: "Xabarnoma olish uchun avval telefon raqamingizni tasdiqlang.",
    notifyMessagesLabel: "Yangi xabar kelganda",
    notifySearchesLabel: "Saqlangan qidiruvga mos e'lon chiqqanda",
    deletingProfile: "O'chirilmoqda...",
    privacyLink: "Maxfiylik siyosati",
    offerLink: "Ommaviy oferta",
    consentText: "Men 18 yoshga to'lganman, {terms} qabul qilaman va {privacy} muvofiq shaxsga doir ma'lumotlarimga ishlov berilishiga, jumladan ularning O'zbekistondan tashqariga uzatilishiga roziman.",
    consentTermsLabel: "Foydalanish shartlarini",
    consentPrivacyLabel: "Maxfiylik siyosatiga",
    postPublishNote: "Tasdiqlangan e'lon rasmiy Telegram kanalimizda ham chop etiladi — ismingiz va raqamingizsiz.",
    postNeedsVerifyTitle: "E'lon joylash uchun raqamingizni tasdiqlang",
    postNeedsVerifyBody: "Har bir e'lon ortida tasdiqlangan raqam turadi — shu bilan firibgarlarni to'xtatamiz. Raqamingiz faqat raqami tasdiqlangan ijarachilarga va faqat ular so'raganda ko'rsatiladi.",
    boostOfferNote: "To'lov tasdiqlangach Top 24 soat ichida yoqiladi. To'lov qilib, siz {offer} shartlarini qabul qilasiz.",
    boostOfferLabel: "Ommaviy oferta",
    safetyTitle: "Xavfsiz ijara",
    safetyBody: "Uyni ko'rmasdan va egasining hujjatlarini tekshirmasdan pul o'tkazmang. «Bron uchun oldindan to'lov» so'rashsa — bu firibgarlik belgisi, e'lon haqida xabar bering.",
    legalUpdatedText: "{terms} va {privacy} yangilandi — iltimos, tanishib chiqing.",
    legalAcceptBtn: "Roziman",
    ownerConsentText: "Men ushbu mulk egasiman (yoki egasining rasmiy vakiliman), {realtor}, ma'lumotlar va rasmlar haqiqiy. {terms} qabul qilaman va {privacy} muvofiq ma'lumotlarimga ishlov berilishiga, jumladan O'zbekistondan tashqariga uzatilishiga roziman.",
  },
  ru: {
    _lang: "ru",
    navSearch: "Поиск",
    navFavs: "Избранное",
    navPost: "Разместить",
    navProfile: "Профиль",
    settings: "Настройки",
    language: "Язык",
    notifications: "Уведомления",
    myListings: "Мои объявления",
    logout: "Выйти",
    cancel: "Отмена",
    boost: "Поднять в Топ",
    pending: "На проверке",
    approved: "Активно",
    blocked: "Заблокировано",
    guest: "Гость",
    unverified: "Не подтверждён",
    verified: "Подтверждён",
    navChats: "Сообщения",
    writeMessage: "Сообщение…",
    noChats: "Сообщений пока нет. Откройте понравившееся объявление и напишите владельцу в чат.",
    chatCta: "Написать владельцу",
    chatHint: "Ваш номер скрыт",
    sortNew: "Сначала новые",
    sortCheap: "Сначала дешевле",
    sortPopular: "Сначала популярные",
    priceRange: "Цена, сум",
    from: "от",
    to: "до",
    roomsCount: "Количество комнат",
    all: "Все",
    daily: "Посуточно",
    monthly: "Помесячно",
    saveSearch: "Сохранить поиск",
    verifiedOwner: "Проверенный владелец",
    noResults: "По этим фильтрам ничего не найдено. Попробуйте изменить фильтры.",
    roomsHeader: "Комнаты",
    areaHeader: "Площадь",
    floorHeader: "Этаж",
    descTitle: "Описание",
    amenitiesTitle: "Удобства",
    addressTitle: "Расположение",
    contactOwner: "Связаться с владельцем",
    callBtn: "Позвонить",
    smsBtn: "SMS",
    linkCopied: "Ссылка скопирована",
    similarListings: "Похожие объявления",
    occupiedDays: "Занятые даты",
    occupiedLegend: "Занято",
    freeLegend: "Свободно",
    titleLabel: "Заголовок объявления",
    propertyTypeLabel: "Тип жилья",
    cityLabel: "Город",
    districtLabel: "Район",
    floorLabel: "Этаж",
    areaLabelM2: "Площадь, м²",
    rentTypeLabel: "Срок аренды",
    priceLabelSom: "Цена, сум",
    amenitiesLabel: "Удобства",
    descLabel: "Описание",
    addressMapLabel: "Точное расположение (отметьте на карте)",
    ownersOnlyNotice: "Объявления здесь размещают только владельцы жилья. Если выяснится, что вы риелтор или посредник, объявление будет удалено, а аккаунт — заблокирован.",
    submitBtn: "Разместить объявление",
    submitting: "Публикуем…",
    successTitle: "Объявление отправлено!",
    successBody: "Объявление проверяет модератор (обычно в течение часа). После одобрения оно появится в поиске.",
    typeKvartira: "Квартира",
    typeHovli: "Частный дом",
    typeOfis: "Офис / магазин",
    termsLink: "Правила пользования",
    aboutLink: "О нас",
    detailBtn: "Подробнее",
    modeLabel: "Формат аренды",
    modeWhole: "Жильё целиком",
    modeShared: "Койко-место (с соседями)",
    roomsConfigLabel: "Комнаты и места",
    roomWord: "Комната",
    capacityLabel: "Всего мест",
    occupiedLabel: "Занято",
    addRoomBtn: "Добавить комнату",
    freeSpotsTotal: "Свободных мест",
    noFreeSpots: "Свободных мест нет",
    perPerson: "за человека",
    pricePerPersonLabel: "Цена за человека, сум",
    genderLabel: "Кто живёт",
    genderMale: "Мужчины",
    genderFemale: "Женщины",
    genderMixed: "Смешанно",
    spotFreedBtn: "Место освободилось",
    spotTakenBtn: "Место заняли",
    filterFreeSpots: "Свободные места",
    anyMode: "Все",
    roomsBreakdown: "Заполненность комнат",
    youPrefix: "Вы: ",
    dailyShort: "Сутки",
    monthlyShort: "Месяц",
    modeWholeShort: "Целиком",
    modeSharedShort: "С соседями",
    filterTitle: "Фильтры",
    clearFilters: "Сбросить",
    showResultsNone: "Ничего не найдено",
    sortLabel: "Сортировка",
    viewList: "Список",
    viewMap: "Карта",
    closeLabel: "Закрыть",
    searchSaved: "Поиск сохранён",
    boostRequestSent: "Запрос принят. После подтверждения оплаты объявление поднимется в Топ.",
    boostRequestError: "Что-то пошло не так. Попробуйте ещё раз.",
    accountBlockedTitle: "Ваш аккаунт заблокирован",
    revealPhoneBtn: "Показать номер",
    phoneLimitReached: "На сегодня лимит просмотра номеров исчерпан. Завтра снова будет доступно, а пока можно написать в чат.",
    phoneUnavailable: "Владелец не указал номер — напишите ему в чат.",
    resubmittedForReview: "Изменения сохранены. Так как изменились заголовок, описание или фото, объявление отправлено на повторную проверку.",
    accountBlockedBody: "Из-за нарушения правил платформы размещение объявлений и переписка ограничены. Если считаете это ошибкой, напишите нам: {email}",
    preparingPhotos: "Обработка…",
    loadMore: "Показать ещё",
    yesterday: "Вчера",
    mapDragHint: "Передвигайте карту, чтобы метка оказалась точно на вашем доме. Для точности приблизьте.",
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    bookingEditTitle: "Отметьте занятые даты",
    bookingEditHint: "Нажмите на дату, чтобы отметить её занятой или свободной.",
    saveBtn: "Сохранить",
    savingBtn: "Сохраняем…",
    geoUnsupported: "Это устройство не может определить местоположение",
    geoDenied: "Нет доступа к геолокации. Разрешите его в настройках браузера.",
    editListing: "Изменить",
    deleteListing: "Удалить",
    editTitle: "Редактирование объявления",
    deleteConfirmTitle: "Удалить объявление?",
    deleteConfirmBody: "Объявление будет удалено безвозвратно. Это действие нельзя отменить.",
    cancelBtn: "Отмена",
    confirmDeleteBtn: "Да, удалить",
    blockedReason: "Причина блокировки",
    noReasonGiven: "Причина не указана",
    boostTitle: "Поднять в Топ",
    boostDays7: "7 дней",
    boostDays30: "30 дней",
    boostDesc7: "Объявление показывается выше в поиске",
    boostDesc30: "Чаще всего выбирают",
    boostFreeCredit: "Бесплатно по бонусу (7 дней)",
    payMethod: "Способ оплаты",
    reportTitle: "Пожаловаться на объявление",
    reportSubmit: "Отправить жалобу",
    reportFooter: "Мы рассмотрим жалобу в течение 24 часов.",
    titlePlaceholder: "Например: светлая 2-комнатная в Юнусабаде",
    ismLabel: "Имя",
    ismPlaceholder: "Ваше имя",
    familiyaLabel: "Фамилия",
    familiyaPlaceholder: "Ваша фамилия",
    nameHint: "Нужно только для проверки, в объявлении не показывается.",
    addPhotoBtn: "Добавить",
    photosHint: "Выберите фото из галереи или сделайте снимок камерой",
    descPlaceholder: "Кратко опишите жильё: ремонт, мебель, техника…",
    ownerConfirmBold: "не риелтор",
    sessionNotFoundError: "Сессия не найдена. Обновите страницу и попробуйте снова.",
    genericError: "Что-то пошло не так. Попробуйте ещё раз.",
    successBody2: "Статус можно посмотреть в разделе «Профиль → Мои объявления».",
    verifyPhoneBtn: "Подтвердить номер",
    noListingsYet: "У вас пока нет объявлений.",
    occupiedBadge: "Занято",
    topActiveLabel: "В Топе",
    markFreeBtn: "Снова свободно — показать в поиске",
    markOccupiedBtn: "Сдано — временно скрыть",
    markBookingBtn: "Отметить занятые даты",
    referralTitle: "Пригласите друга",
    referralSubtitle: "Когда друг зарегистрируется по вашей ссылке, вы оба получите бесплатное поднятие в Топ на 7 дней.",
    copyBtn: "Копировать",
    currentCreditsLabel: "Бесплатных поднятий:",
    ta: "",
    savedSearchesTitle: "Сохранённые поиски",
    loadingText: "Загрузка…",
    emptyFavs: "В избранном пока пусто. Нажмите ♥ на объявлении, чтобы сохранить его.",
    verifyTitle1: "Подтверждение номера",
    verifyTitle2: "Введите код из SMS",
    verifyIntro: "Чтобы связаться с владельцем, подтвердите свой номер. Это защищает от фейковых обращений.",
    sendCodeBtn: "Получить код",
    sendingCode: "Отправляем…",
    confirmBtn: "Подтвердить",
    checkingCode: "Проверяем…",
    sendCodeError: "Не удалось отправить код. Проверьте номер и попробуйте снова.",
    codeInvalidError: "Код неверный или устарел.",
    appTitle: "Uy24/7 — аренда жилья без риелторов",
    currency: "сум",
    perDay: "сутки",
    perMonth: "мес.",
    sqm: "м²",
    mln: " млн",
    thousand: " тыс.",
    resultsN: { one: "{n} объявление", few: "{n} объявления", many: "{n} объявлений", other: "{n} объявления" },
    showResultsN: { one: "Показать {n} объявление", few: "Показать {n} объявления", many: "Показать {n} объявлений", other: "Показать {n} объявления" },
    viewsN: { one: "{n} просмотр", few: "{n} просмотра", many: "{n} просмотров", other: "{n} просмотра" },
    daysLeftN: { one: "остался {n} день", few: "осталось {n} дня", many: "осталось {n} дней", other: "осталось {n} дня" },
    favCountN: "В избранном: {n}",
    chatCountN: "Написали: {n}",
    freeSpotsN: { one: "{n} место свободно", few: "{n} места свободно", many: "{n} мест свободно", other: "{n} места свободно" },
    freeN: "свободно: {n}",
    roomsN: "{n} комн.",
    roomCapacityN: "{n}-местная",
    boostLeftN: "осталось: {n}",
    photosCountN: "Фото (минимум 3) — добавлено {n}",
    codeSentToN: "Введите 6-значный код, отправленный на номер {phone}.",
    payWith: "Через {p}",
    priceFromP: "от {p}",
    priceToP: "до {p}",
    searchPlaceholder: "Поиск…",
    chatSafetyNote: "Переписка идёт внутри Uy24/7 — номера телефонов скрыты",
    listingFallback: "Объявление",
    smsTemplate: "Здравствуйте! Меня заинтересовало ваше объявление «{title}» на Uy24/7.",
    reportRealtor: "Это риелтор / посредник",
    reportWrongPrice: "Неверно указана цена",
    reportScam: "Подозрение на мошенничество",
    reportUnavailable: "Уже сдано или неактуально",
    dangerZone: "Опасная зона",
    deleteProfileBtn: "Удалить профиль",
    deleteProfileConfirm: "Точно удалить? Объявления, фото, сообщения и избранное удалятся сразу и навсегда. Для защиты от мошенничества 1 год хранится только краткая запись: номер, имя, даты, статус и причина блокировки, количество объявлений и жалоб.",
    legalSection: "Правовая информация",
    dailyLimitError: "Лимит на сегодня исчерпан — попробуйте завтра.",
    notVerifiedError: "Сначала подтвердите номер телефона.",
    rlsLimitError: "Не удалось выполнить действие: исчерпан дневной лимит или аккаунт ограничен.",
    networkError: "Нет соединения с интернетом. Проверьте подключение и попробуйте снова.",
    fileTooLargeError: "Фото слишком большое (не более 10 МБ).",
    codeTooSoonError: "Подождите немного, прежде чем запросить новый код.",
    phoneInvalidError: "Неверный номер. Пример: +998901234567",
    photosUpdateError: "Не удалось обновить фото. Попробуйте ещё раз.",
    backLabel: "Назад",
    shareLabel: "Поделиться",
    favLabel: "В избранное",
    sendLabel: "Отправить",
    myLocationLabel: "Моё местоположение",
    accountSection: "Аккаунт",
    phoneNumberLabel: "Номер телефона",
    telegramTitle: "Уведомления в Telegram",
    telegramLinked: "Подключено",
    telegramNotLinked: "Не подключено",
    telegramDesc: "Бесплатно. Сообщим в Telegram, как только вам напишут или появится объявление по сохранённому поиску.",
    telegramConnectBtn: "Подключить Telegram",
    telegramUnlinkBtn: "Отключить Telegram",
    telegramWaiting: "Нажмите «START» в Telegram и вернитесь сюда…",
    telegramLinkedToast: "Telegram подключён ✅",
    telegramError: "Не удалось связаться с Telegram. Попробуйте позже.",
    telegramNeedVerify: "Чтобы получать уведомления, сначала подтвердите номер телефона.",
    notifyMessagesLabel: "Новые сообщения",
    notifySearchesLabel: "Объявления по сохранённым поискам",
    deletingProfile: "Удаляем…",
    privacyLink: "Политика конфиденциальности",
    offerLink: "Публичная оферта",
    consentText: "Мне исполнилось 18 лет. Я принимаю {terms} и соглашаюсь на обработку моих персональных данных согласно {privacy}, включая их передачу за пределы Узбекистана.",
    consentTermsLabel: "Правила пользования",
    consentPrivacyLabel: "Политике конфиденциальности",
    postPublishNote: "После проверки объявление также публикуется в нашем официальном Telegram-канале — без вашего имени и номера.",
    postNeedsVerifyTitle: "Подтвердите номер, чтобы разместить объявление",
    postNeedsVerifyBody: "За каждым объявлением стоит подтверждённый номер — так мы останавливаем мошенников. Ваш номер увидят только арендаторы с подтверждённым номером и только по их запросу.",
    boostOfferNote: "Топ включается в течение 24 часов после подтверждения оплаты. Оплачивая, вы принимаете условия {offer}.",
    boostOfferLabel: "Публичной оферты",
    safetyTitle: "Безопасная аренда",
    safetyBody: "Не переводите деньги, пока не увидите жильё и не проверите документы владельца. Просят «предоплату за бронь» — это признак мошенничества, пожалуйтесь на объявление.",
    legalUpdatedText: "Обновлены {terms} и {privacy} — пожалуйста, ознакомьтесь.",
    legalAcceptBtn: "Принимаю",
    ownerConsentText: "Подтверждаю, что я владелец этого жилья (или официальный представитель владельца), {realtor}, данные и фото достоверны. Принимаю {terms} и соглашаюсь на обработку моих персональных данных согласно {privacy}, включая их передачу за пределы Узбекистана.",
  },
  en: {
    _lang: "en",
    navSearch: "Search",
    navFavs: "Saved",
    navPost: "Post",
    navProfile: "Profile",
    settings: "Settings",
    language: "Language",
    notifications: "Notifications",
    myListings: "My listings",
    logout: "Log out",
    cancel: "Cancel",
    boost: "Boost",
    pending: "Under review",
    approved: "Active",
    blocked: "Blocked",
    guest: "Guest",
    unverified: "Not verified",
    verified: "Verified",
    navChats: "Messages",
    writeMessage: "Type a message…",
    noChats: "No messages yet. Open a listing you like and message the owner.",
    chatCta: "Message the owner",
    chatHint: "Your number stays private",
    sortNew: "Newest first",
    sortCheap: "Lowest price first",
    sortPopular: "Most popular",
    priceRange: "Price, UZS",
    from: "Min",
    to: "Max",
    roomsCount: "Number of rooms",
    all: "All",
    daily: "Daily",
    monthly: "Monthly",
    saveSearch: "Save search",
    verifiedOwner: "Verified owner",
    noResults: "No listings match these filters. Try changing them.",
    roomsHeader: "Rooms",
    areaHeader: "Area",
    floorHeader: "Floor",
    descTitle: "Description",
    amenitiesTitle: "Amenities",
    addressTitle: "Location",
    contactOwner: "Contact the owner",
    callBtn: "Call",
    smsBtn: "SMS",
    linkCopied: "Link copied",
    similarListings: "Similar listings",
    occupiedDays: "Booked dates",
    occupiedLegend: "Booked",
    freeLegend: "Available",
    titleLabel: "Listing title",
    propertyTypeLabel: "Property type",
    cityLabel: "City",
    districtLabel: "District",
    floorLabel: "Floor",
    areaLabelM2: "Area, m²",
    rentTypeLabel: "Rental period",
    priceLabelSom: "Price, UZS",
    amenitiesLabel: "Amenities",
    descLabel: "Description",
    addressMapLabel: "Exact location (mark it on the map)",
    ownersOnlyNotice: "Only property owners can post listings here. If you turn out to be a realtor or agent, the listing will be removed and your account blocked.",
    submitBtn: "Publish listing",
    submitting: "Publishing…",
    successTitle: "Listing submitted!",
    successBody: "Our team is reviewing your listing (usually within an hour). It will appear in search once approved.",
    typeKvartira: "Apartment",
    typeHovli: "House",
    typeOfis: "Office / shop",
    termsLink: "Terms of Use",
    aboutLink: "About us",
    detailBtn: "Details",
    modeLabel: "Type of place",
    modeWhole: "Entire place",
    modeShared: "Shared (per person)",
    roomsConfigLabel: "Rooms and beds",
    roomWord: "Room",
    capacityLabel: "Total beds",
    occupiedLabel: "Taken",
    addRoomBtn: "Add room",
    freeSpotsTotal: "Free beds",
    noFreeSpots: "No free beds",
    perPerson: "per person",
    pricePerPersonLabel: "Price per person, UZS",
    genderLabel: "Who lives here",
    genderMale: "Men",
    genderFemale: "Women",
    genderMixed: "Mixed",
    spotFreedBtn: "A bed freed up",
    spotTakenBtn: "A bed was taken",
    filterFreeSpots: "Free beds",
    anyMode: "Any",
    roomsBreakdown: "Occupancy",
    youPrefix: "You: ",
    dailyShort: "Daily",
    monthlyShort: "Monthly",
    modeWholeShort: "Entire place",
    modeSharedShort: "Shared",
    filterTitle: "Filters",
    clearFilters: "Reset",
    showResultsNone: "No matching listings",
    sortLabel: "Sort by",
    viewList: "List",
    viewMap: "Map",
    closeLabel: "Close",
    searchSaved: "Search saved",
    boostRequestSent: "Request received. Your listing will be boosted once the payment is confirmed.",
    boostRequestError: "Something went wrong. Please try again.",
    accountBlockedTitle: "Your account is blocked",
    revealPhoneBtn: "Show phone number",
    phoneLimitReached: "You've reached today's limit for viewing phone numbers. Try again tomorrow, or message the owner in the chat.",
    phoneUnavailable: "The owner hasn't added a phone number — please use the chat.",
    resubmittedForReview: "Changes saved. Because the title, description or photos changed, the listing has been sent for review again.",
    accountBlockedBody: "Because the platform rules were violated, posting and messaging are restricted. If you think this is a mistake, write to us: {email}",
    preparingPhotos: "Processing…",
    loadMore: "Show more",
    yesterday: "Yesterday",
    mapDragHint: "Move the map until the pin sits right on your home. Zoom in for accuracy.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    bookingEditTitle: "Mark booked dates",
    bookingEditHint: "Tap a date to mark it as booked or available.",
    saveBtn: "Save",
    savingBtn: "Saving…",
    geoUnsupported: "This device can't determine your location",
    geoDenied: "Location access is blocked. Allow it in your browser settings.",
    editListing: "Edit",
    deleteListing: "Delete",
    editTitle: "Edit listing",
    deleteConfirmTitle: "Delete this listing?",
    deleteConfirmBody: "The listing will be permanently deleted. This can't be undone.",
    cancelBtn: "Cancel",
    confirmDeleteBtn: "Yes, delete",
    blockedReason: "Reason for blocking",
    noReasonGiven: "No reason given",
    boostTitle: "Boost your listing",
    boostDays7: "7 days",
    boostDays30: "30 days",
    boostDesc7: "Your listing shows near the top of search",
    boostDesc30: "Most popular choice",
    boostFreeCredit: "Use a free boost (7 days)",
    payMethod: "Payment method",
    reportTitle: "Report this listing",
    reportSubmit: "Send report",
    reportFooter: "We'll review the report within 24 hours.",
    titlePlaceholder: "e.g. Bright 2-room flat in Yunusabad",
    ismLabel: "First name",
    ismPlaceholder: "Your first name",
    familiyaLabel: "Last name",
    familiyaPlaceholder: "Your last name",
    nameHint: "Used only for verification — never shown on your listing.",
    addPhotoBtn: "Add",
    photosHint: "Choose from your gallery or take a photo",
    descPlaceholder: "Describe your place briefly: renovation, furniture, appliances…",
    ownerConfirmBold: "I'm not a realtor",
    sessionNotFoundError: "Your session wasn't found. Refresh the page and try again.",
    genericError: "Something went wrong. Please try again.",
    successBody2: "You can track its status in Profile → My listings.",
    verifyPhoneBtn: "Verify phone number",
    noListingsYet: "You haven't posted any listings yet.",
    occupiedBadge: "Occupied",
    topActiveLabel: "Boosted",
    markFreeBtn: "Available again — show in search",
    markOccupiedBtn: "Rented out — hide for now",
    markBookingBtn: "Mark booked dates",
    referralTitle: "Invite a friend",
    referralSubtitle: "When a friend signs up with your link, you both get a free 7-day boost.",
    copyBtn: "Copy",
    currentCreditsLabel: "Free boosts:",
    ta: "",
    savedSearchesTitle: "Saved searches",
    loadingText: "Loading…",
    emptyFavs: "Nothing saved yet. Tap ♥ on a listing to save it.",
    verifyTitle1: "Verify your number",
    verifyTitle2: "Enter the SMS code",
    verifyIntro: "To contact the owner, please verify your phone number. This protects everyone from fake inquiries.",
    sendCodeBtn: "Send code",
    sendingCode: "Sending…",
    confirmBtn: "Confirm",
    checkingCode: "Checking…",
    sendCodeError: "We couldn't send the code. Check the number and try again.",
    codeInvalidError: "The code is incorrect or has expired.",
    appTitle: "Uy24/7 — rent directly from owners",
    currency: "UZS",
    perDay: "night",
    perMonth: "month",
    sqm: "m²",
    mln: "M",
    thousand: "K",
    resultsN: { one: "{n} listing", other: "{n} listings" },
    showResultsN: { one: "Show {n} listing", other: "Show {n} listings" },
    viewsN: { one: "{n} view", other: "{n} views" },
    daysLeftN: { one: "{n} day left", other: "{n} days left" },
    favCountN: { one: "{n} save", other: "{n} saves" },
    chatCountN: { one: "{n} person messaged", other: "{n} people messaged" },
    freeSpotsN: { one: "{n} bed free", other: "{n} beds free" },
    freeN: "{n} free",
    roomsN: { one: "{n} room", other: "{n} rooms" },
    roomCapacityN: { one: "{n} bed", other: "{n} beds" },
    boostLeftN: "{n} left",
    photosCountN: "Photos (at least 3) — {n} added",
    codeSentToN: "Enter the 6-digit code we sent to {phone}.",
    payWith: "Pay with {p}",
    priceFromP: "from {p}",
    priceToP: "up to {p}",
    searchPlaceholder: "Search…",
    chatSafetyNote: "This chat stays inside Uy24/7 — phone numbers stay private",
    listingFallback: "Listing",
    smsTemplate: "Hello! I'm interested in your listing \"{title}\" on Uy24/7.",
    reportRealtor: "This is a realtor / agent",
    reportWrongPrice: "The price is wrong",
    reportScam: "Looks like a scam",
    reportUnavailable: "No longer available",
    dangerZone: "Danger zone",
    deleteProfileBtn: "Delete profile",
    deleteProfileConfirm: "Are you sure? Your listings, photos, messages and saved items will be deleted right away, for good. For fraud prevention we keep only a short record for 1 year: number, name, dates, block status and reason, and the number of listings and reports.",
    legalSection: "Legal",
    dailyLimitError: "You've reached today's limit — please try again tomorrow.",
    notVerifiedError: "Please verify your phone number first.",
    rlsLimitError: "Couldn't complete this: the daily limit is reached or your account is restricted.",
    networkError: "No internet connection. Check your connection and try again.",
    fileTooLargeError: "The photo is too large (10 MB max).",
    codeTooSoonError: "Please wait a moment before requesting a new code.",
    phoneInvalidError: "Invalid number. Example: +998901234567",
    photosUpdateError: "Couldn't update the photos. Please try again.",
    backLabel: "Back",
    shareLabel: "Share",
    favLabel: "Save",
    sendLabel: "Send",
    myLocationLabel: "My location",
    accountSection: "Account",
    phoneNumberLabel: "Phone number",
    telegramTitle: "Telegram notifications",
    telegramLinked: "Connected",
    telegramNotLinked: "Not connected",
    telegramDesc: "Free. We'll message you on Telegram as soon as someone writes to you or a listing matches your saved search.",
    telegramConnectBtn: "Connect Telegram",
    telegramUnlinkBtn: "Disconnect Telegram",
    telegramWaiting: "Tap “START” in Telegram, then come back here…",
    telegramLinkedToast: "Telegram connected ✅",
    telegramError: "Couldn't reach Telegram. Please try again later.",
    telegramNeedVerify: "To get notifications, please verify your phone number first.",
    notifyMessagesLabel: "New messages",
    notifySearchesLabel: "Listings matching saved searches",
    deletingProfile: "Deleting…",
    privacyLink: "Privacy Policy",
    offerLink: "Public Offer",
    consentText: "I'm 18 or older, I accept the {terms} and I consent to the processing of my personal data under the {privacy}, including its transfer outside Uzbekistan.",
    consentTermsLabel: "Terms of Use",
    consentPrivacyLabel: "Privacy Policy",
    postPublishNote: "Once approved, your listing is also posted to our official Telegram channel — without your name or number.",
    postNeedsVerifyTitle: "Verify your number to post a listing",
    postNeedsVerifyBody: "Every listing is backed by a verified number — that's how we stop scammers. Your number is shown only to renters with a verified number, and only when they ask for it.",
    boostOfferNote: "Your boost goes live within 24 hours of payment confirmation. By paying, you accept the {offer}.",
    boostOfferLabel: "Public Offer",
    safetyTitle: "Rent safely",
    safetyBody: "Don't send money before you've seen the place and checked the owner's documents. Asked for a “deposit to hold it”? That's a scam sign — report the listing.",
    legalUpdatedText: "We've updated our {terms} and {privacy} — please take a look.",
    legalAcceptBtn: "I accept",
    ownerConsentText: "I confirm that I own this property (or officially represent the owner), {realtor}, and the details and photos are genuine. I accept the {terms} and consent to the processing of my personal data under the {privacy}, including its transfer outside Uzbekistan.",
  },
};

const TASHKENT_CENTER = [41.311081, 69.240562];

const PROPERTY_TYPE_ICONS = { kvartira: Building, hovli: Home, ofis: Store };
const getPropertyTypes = (t) => [
  { id: "kvartira", label: t.typeKvartira, Icon: Building },
  { id: "hovli", label: t.typeHovli, Icon: Home },
  { id: "ofis", label: t.typeOfis, Icon: Store },
];
const typeLabel = (id, t) => getPropertyTypes(t).find(x => x.id === id)?.label || t.typeKvartira;
const typeIcon = (id) => PROPERTY_TYPE_ICONS[id] || Building;

const getSortOptions = (t) => [
  { id: "new", label: t.sortNew },
  { id: "cheap", label: t.sortCheap },
  { id: "popular", label: t.sortPopular },
];

// Chat xabari vaqti: bugun bo'lsa faqat soat, kecha bo'lsa "Kecha", eskisi bo'lsa sana
const msgTime = (iso, t = STR.uz) => {
  try {
    const d = new Date(iso);
    const now = new Date();
    const yesterdayLabel = t.yesterday;
    const pad = (x) => String(x).padStart(2, "0");
    // Vaqt va sana qo'lda: 14:05, 08.10 (uz/ru) yoki 08/10 (en) — brauzer tilidan qat'i nazar bir xil
    const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return hhmm;
    const yest = new Date(now); yest.setDate(now.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return yesterdayLabel + " " + hhmm;
    return `${pad(d.getDate())}${t._lang === "en" ? "/" : "."}${pad(d.getMonth() + 1)} ${hhmm}`;
  } catch (_) { return ""; }
};

// Top tugashiga necha kun qolganini hisoblaydi
const daysLeft = (until) => {
  const diff = new Date(until) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
};

// Raqam tanlangan til uslubida: 4 200 000 (uz/ru) yoki 4,200,000 (en).
// Qo'lda formatlaymiz: ba'zi brauzerlarda o'zbekcha raqam formati yo'q va ular "4,200,000" chiqarib qo'yadi.
const fmt = (n, t) => {
  const num = Number(n) || 0;
  const en = t?._lang === "en";
  const [int, dec] = String(Math.abs(num)).split(".");
  return (num < 0 ? "-" : "") + int.replace(/\B(?=(\d{3})+(?!\d))/g, en ? "," : "\u00A0") + (dec ? (en ? "." : ",") + dec : "");
};

// Ko'plik shakllari: ruscha "1 объявление / 2 объявления / 5 объявлений", inglizcha "1 listing / 2 listings"
const PLURAL_RULES = {};
const pluralCat = (lang, n) => {
  try { return (PLURAL_RULES[lang] = PLURAL_RULES[lang] || new Intl.PluralRules(lang)).select(n); }
  catch (_) { return n === 1 ? "one" : "other"; }
};
// tn(t, "resultsN", 5) -> "5 ta e'lon" / "5 объявлений" / "5 listings"
function tn(t, key, n) {
  const v = t[key];
  const s = v == null ? "{n}" : typeof v === "string" ? v : (v[pluralCat(t._lang, n)] ?? v.other ?? v.one);
  return s.replace("{n}", typeof n === "number" ? fmt(n, t) : String(n));
}
// tf(t, "payWith", { p: "Payme" }) -> "Payme orqali" / "Через Payme" / "Pay with Payme"
const tf = (t, key, vars = {}) => Object.entries(vars).reduce((acc, [k, x]) => acc.replace(`{${k}}`, x), t[key] || "");
// Matndagi {joy} o'rniga havola kabi React elementini qo'yadi: tl(t, "consentText", { terms: <Link …/> })
const tl = (t, key, nodes = {}) => String(t[key] || "").split(/\{(\w+)\}/).map((part, i) =>
  <React.Fragment key={i}>{i % 2 ? (nodes[part] ?? `{${part}}`) : part}</React.Fragment>);
const linkStyle = { color: "#3E92B0", textDecoration: "underline", textUnderlineOffset: "2px" };

// Shahar, tuman va qulayliklar bazada o'zbekcha saqlanadi — ekranda tanlangan tilda ko'rsatiladi (lug'at: lib/places.js)
const placeLabel = (name, t) => placeName(name, t?._lang);
// Qidiruvda tuman nomi uch tilda ham topiladi: "Yunusobod", "Юнусабад", "Yunusabad"
const placeSearchText = (name) => [name, PLACE_NAMES.ru[name], PLACE_NAMES.en[name]].filter(Boolean).join(" ").toLowerCase();
const amenityLabel = (a, t) => AMENITY_NAMES[t?._lang]?.[a] || a;

// Server funksiyalarini (Vercel /api) foydalanuvchi sessiyasi bilan chaqirish
async function callApi(path, body) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body || {}),
  });
  let json = {};
  try { json = await r.json(); } catch (_) {}
  if (!r.ok) { const e = new Error(json.message || `HTTP ${r.status}`); e.status = r.status; throw e; }
  return json;
}

// +998901234567 -> +998 90 123 45 67
const formatPhone = (p) => {
  const d = String(p || "").replace(/\D/g, "");
  return d.length === 12 && d.startsWith("998") ? `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}` : (p || "");
};

// Server xatolarini (ko'pincha inglizcha, texnik) foydalanuvchiga tushunarli matnga aylantiradi
function friendlyError(err, t, fallbackKey = "genericError") {
  const m = String(err?.message || err || "");
  if (m.includes("DAILY_LIMIT")) return t.dailyLimitError;
  if (m.includes("NOT_VERIFIED")) return t.notVerifiedError;
  if (m.includes("BLOCKED")) return t.accountBlockedTitle;
  if (err?.code === "42501" || /row-level security/i.test(m)) return t.rlsLimitError;
  if (/maximum allowed size|payload too large|too large/i.test(m)) return t.fileTooLargeError;
  if (/failed to fetch|network|load failed/i.test(m)) return t.networkError;
  return t[fallbackKey] || t.genericError;
}
const box = { background: "#1E333C", border: "1px solid #2A424C" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "14px", background: "#16262E", color: "#F2EDE4", border: "1px solid #2A424C", outline: "none" };

function MosaicStrip({ className = "" }) {
  return (
    <div className={`flex ${className}`} aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="h-full flex-1" style={{ background: i % 2 === 0 ? "#3E92B0" : "#D4783C", clipPath: i % 2 === 0 ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" : "none" }} />
      ))}
    </div>
  );
}

function PriceTag({ price, rentType, perPerson = false, t = STR.uz }) {
  return (
    <div className="inline-flex flex-col items-start">
      <div className="relative inline-flex items-baseline gap-1 pl-3 pr-4 py-1.5" style={{ background: "#E8B94A", clipPath: "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)" }}>
        <span className="font-mono font-semibold text-[15px]" style={{ color: "#16262E" }}>{fmt(price, t)}</span>
        <span className="text-[11px] font-medium" style={{ color: "#4A3812" }}>{t.currency}/{rentType === "Kunlik" ? t.perDay : t.perMonth}</span>
      </div>
      {perPerson && (
        <span className="text-[10.5px] mt-0.5 pl-3" style={{ color: "#93A5AA" }}>{t.perPerson}</span>
      )}
    </div>
  );
}

// Rasmni to'liq ekranda ko'rish oynasi
function ImageLightbox({ images, startIdx = 0, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const touchX = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  // Barmoq bilan surib almashtirish
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) {
      setIdx(i => dx > 0 ? (i - 1 + images.length) % images.length : (i + 1) % images.length);
    }
    touchX.current = null;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(8,14,17,0.97)" }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button onClick={onClose} className="absolute right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{ background: "rgba(30,51,60,0.9)", top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}>
        <X size={20} color="#F2EDE4" />
      </button>

      <img src={images[idx]} alt="" className="max-w-full max-h-full object-contain" />

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(30,51,60,0.9)" }}><ChevronLeft size={20} color="#F2EDE4" /></button>
          <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(30,51,60,0.9)" }}><ChevronRight size={20} color="#F2EDE4" /></button>
          <div className="absolute left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[12.5px] font-mono"
            style={{ background: "rgba(30,51,60,0.9)", color: "#F2EDE4", bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}>
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

function Gallery({ images, hue, height = "h-64", zoomable = false }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!images || images.length === 0) {
    return (
      <div className={`${height} relative flex items-center justify-center`} style={{ background: `linear-gradient(135deg, hsl(${hue} 45% 28%), hsl(${hue + 30} 40% 18%))` }}>
        <Building2 size={64} color="rgba(242,237,228,0.3)" strokeWidth={1.2} />
      </div>
    );
  }
  return (
    <div className={`${height} relative overflow-hidden`} style={{ background: "#0E1B21" }}>
      {lightbox && <ImageLightbox images={images} startIdx={idx} onClose={() => setLightbox(false)} />}
      <img src={images[idx]} alt="" onClick={() => zoomable && setLightbox(true)}
        className="w-full h-full object-cover" style={{ cursor: zoomable ? "zoom-in" : "default" }} />
      {images.length > 1 && (
        <>
          <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.7)" }}><ChevronLeft size={17} color="#F2EDE4" /></button>
          <button onClick={() => setIdx(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.7)" }}><ChevronRight size={17} color="#F2EDE4" /></button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === idx ? "#E8B94A" : "rgba(242,237,228,0.4)" }} />)}
          </div>
        </>
      )}
    </div>
  );
}

function Badge({ children, color, bg }) {
  return <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium" style={{ color, background: bg }}>{children}</span>;
}

function ListingCard({ item, onOpen, isFav, onToggleFav, t = STR.uz }) {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98] relative" style={box} onClick={() => onOpen(item)}>
      {item.boosted && (
        <div className="absolute top-0 right-0 z-10 px-3 py-1 text-[10.5px] font-semibold flex items-center gap-1" style={{ background: "#D4783C", color: "#16262E", clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%)" }}>
          <Sparkles size={11} /> TOP
        </div>
      )}
      <div className="h-40 relative flex items-center justify-center overflow-hidden" style={item.images?.length ? { background: "#0E1B21" } : { background: `linear-gradient(135deg, hsl(${item.hue} 45% 28%), hsl(${item.hue + 30} 40% 18%))` }}>
        {item.images?.length ? <img src={item.thumbs?.[0] || item.images[0]} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <Building2 size={40} color="rgba(242,237,228,0.35)" strokeWidth={1.3} />}
        {item.verified && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: "rgba(22,38,46,0.85)", color: "#E8B94A" }}>
            <ShieldCheck size={13} /> {t.verifiedOwner}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleFav(item.id); }} aria-label={t.favLabel} aria-pressed={!!isFav} className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.75)" }}>
          <Heart size={16} fill={isFav ? "#D4783C" : "none"} color={isFav ? "#D4783C" : "#F2EDE4"} />
        </button>
      </div>
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <PriceTag price={item.price} rentType={item.rentType} perPerson={item.listingMode === "shared"} t={t} />
          <span className="flex items-center gap-1 text-[11px]" style={{ color: "#65787E" }}>
            {React.createElement(typeIcon(item.propertyType), { size: 13 })} {typeLabel(item.propertyType, t)}
          </span>
        </div>
        <h3 className="font-serif text-[16px] leading-snug" style={{ color: "#F2EDE4" }}>{item.title}</h3>
        <div className="flex items-center gap-1 text-[13px]" style={{ color: "#93A5AA" }}><MapPin size={13} /> {placeLabel(item.district, t)}, {placeLabel(item.city, t)}</div>
        {item.listingMode === "shared" ? (
          <div className="flex items-center gap-2 flex-wrap text-[12.5px] pt-1">
            <span className="px-2 py-0.5 rounded-full font-medium"
              style={{ background: item.freeSpots > 0 ? "#3E92B0" : "#2A424C", color: item.freeSpots > 0 ? "#0E1B21" : "#93A5AA" }}>
              {item.freeSpots > 0 ? tn(t, "freeSpotsN", item.freeSpots) : t.noFreeSpots}
            </span>
            {item.genderPref && (
              <span style={{ color: "#93A5AA" }}>
                {item.genderPref === "erkak" ? t.genderMale : item.genderPref === "ayol" ? t.genderFemale : t.genderMixed}
              </span>
            )}
            <span className="flex items-center gap-1" style={{ color: "#93A5AA" }}><Maximize2 size={13} /> {item.area} {t.sqm}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[13px] pt-1" style={{ color: "#93A5AA" }}>
            <span className="flex items-center gap-1"><BedDouble size={14} /> {tn(t, "roomsN", item.rooms)}</span>
            <span className="flex items-center gap-1"><Maximize2 size={14} /> {item.area} {t.sqm}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBar({ filters, setFilters, resultsCount, onSaveSearch, viewMode, setViewMode, t }) {
  const [open, setOpen] = useState(false);
  const roomOptions = [["Barchasi", t.all], [1, "1"], [2, "2"], [3, "3"], ["4+", "4+"]];
  const isShared = filters.listingMode === "shared";

  // Tepadagi tanlovlar: bosilgani yana bosilsa — bekor bo'ladi (hammasi ko'rinadi)
  const toggleRent = (val) => setFilters(f => ({ ...f, rentType: f.rentType === val ? "Barchasi" : val }));
  const toggleMode = (val) => setFilters(f => {
    const next = f.listingMode === val ? "Barchasi" : val;
    // "Sherik bilan"dan chiqilganda unga xos filtrlarni ham tozalaymiz —
    // aks holda ko'rinmay qolgan filtr natijalarni yashirib qo'yadi
    return next === "shared"
      ? { ...f, listingMode: next }
      : { ...f, listingMode: next, minFreeSpots: "Barchasi", gender: "Barchasi" };
  });

  // Filtr oynasi ichidagi nechta tanlov faol (tugmadagi belgi uchun)
  const activeCount = [
    filters.propertyType !== "Barchasi",
    !!(filters.min || filters.max),
    String(filters.rooms) !== "Barchasi",
    isShared && filters.minFreeSpots !== "Barchasi",
    isShared && filters.gender !== "Barchasi",
  ].filter(Boolean).length;

  // Faqat oyna ichidagilarni tozalaydi — shahar va tepadagi tanlovlar qoladi
  const resetRefinements = () => setFilters(f => ({
    ...f, propertyType: "Barchasi", sortBy: "new", min: "", max: "", rooms: "Barchasi", minFreeSpots: "Barchasi", gender: "Barchasi",
  }));

  // Oyna ochiqligida orqadagi sahifa surilmasin; Esc bilan yopilsin
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prevOverflow; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const seg = (active) => ({ background: active ? "#3E92B0" : "transparent", color: active ? "#0E1B21" : "#93A5AA" });
  const chip = (active) => ({
    background: active ? "#3E92B0" : "#16262E",
    color: active ? "#0E1B21" : "#F2EDE4",
    border: "1px solid #2A424C",
  });
  const sectionLabel = (text) => <div className="text-[12px] mb-1.5" style={{ color: "#93A5AA" }}>{text}</div>;

  return (
    <>
      <div className="px-4 pt-3 pb-2" style={{ background: "#16262E" }}>
        {/* 1-qator: asosiy tanlovlar + filtr tugmasi */}
        <div className="flex items-center gap-1.5">
          <div className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto no-scrollbar">
            <div className="shrink-0 flex rounded-full p-0.5" style={box}>
              {[["Kunlik", t.dailyShort], ["Oylik", t.monthlyShort]].map(([val, text]) => (
                <button key={val} onClick={() => toggleRent(val)} aria-pressed={filters.rentType === val}
                  className="px-1.5 min-[375px]:px-2 min-[390px]:px-2.5 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors"
                  style={seg(filters.rentType === val)}>{text}</button>
              ))}
            </div>
            <div className="shrink-0 flex rounded-full p-0.5" style={box}>
              {[["whole", t.modeWholeShort], ["shared", t.modeSharedShort]].map(([val, text]) => (
                <button key={val} onClick={() => toggleMode(val)} aria-pressed={filters.listingMode === val}
                  className="px-1.5 min-[375px]:px-2 min-[390px]:px-2.5 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors"
                  style={seg(filters.listingMode === val)}>{text}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setOpen(true)} aria-label={t.filterTitle} title={t.filterTitle}
            className="shrink-0 relative w-10 h-9 rounded-full flex items-center justify-center"
            style={{ background: activeCount ? "#26343A" : "#1E333C", border: `1px solid ${activeCount ? "#D4783C" : "#2A424C"}` }}>
            <SlidersHorizontal size={15} color={activeCount ? "#D4783C" : "#F2EDE4"} />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: "#D4783C", color: "#16262E" }}>{activeCount}</span>
            )}
          </button>
        </div>

        {/* 2-qator: shahar · natijalar soni · ro'yxat/xarita */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="min-w-0 flex items-center gap-1 text-[12px]" style={{ color: "#93A5AA" }}>
            <button onClick={() => setOpen(true)} className="min-w-0 flex items-center gap-1 font-medium" style={{ color: "#F2EDE4" }}>
              <MapPin size={12} className="shrink-0" color="#3E92B0" />
              <span className="truncate">{placeLabel(filters.city, t)}</span>
              <ChevronDown size={12} className="shrink-0" color="#93A5AA" />
            </button>
            <span className="shrink-0 whitespace-nowrap">· {tn(t, "resultsN", resultsCount)}</span>
          </div>
          <div className="shrink-0 flex rounded-full p-0.5" style={box}>
            <button onClick={() => setViewMode("list")} aria-label={t.viewList} title={t.viewList} aria-pressed={viewMode === "list"}
              className="px-2.5 py-1 rounded-full flex items-center" style={{ background: viewMode === "list" ? "#3E92B0" : "transparent" }}>
              <List size={14} color={viewMode === "list" ? "#0E1B21" : "#93A5AA"} />
            </button>
            <button onClick={() => setViewMode("map")} aria-label={t.viewMap} title={t.viewMap} aria-pressed={viewMode === "map"}
              className="px-2.5 py-1 rounded-full flex items-center" style={{ background: viewMode === "map" ? "#3E92B0" : "transparent" }}>
              <Map size={14} color={viewMode === "map" ? "#0E1B21" : "#93A5AA"} />
            </button>
          </div>
        </div>
      </div>

      {/* Filtr oynasi — sahifaning eng yuqori qatlamida (aks holda xarita uni yopib qo'yadi) */}
      {open && createPortal(
        <div className="fixed inset-0 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}
          style={{ zIndex: 3000, background: "rgba(10,17,20,0.7)", fontFamily: "Inter, sans-serif" }}>
          <div role="dialog" aria-modal="true" aria-label={t.filterTitle}
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl flex flex-col" onClick={(e) => e.stopPropagation()}
            style={{ background: "#1E333C", maxHeight: "88vh" }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0" style={{ borderBottom: "1px solid #2A424C" }}>
              <h3 className="font-serif text-lg flex items-center gap-2" style={{ color: "#F2EDE4" }}>
                <SlidersHorizontal size={16} color="#3E92B0" /> {t.filterTitle}
              </h3>
              <button onClick={() => setOpen(false)} aria-label={t.closeLabel} className="p-1 -m-1"><X size={20} color="#93A5AA" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ overscrollBehavior: "contain" }}>
              <div>
                {sectionLabel(t.cityLabel)}
                <div className="relative">
                  <select value={filters.city} onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))} style={{ ...inputStyle, paddingRight: 36 }}>
                    {CITIES.map(c => <option key={c} value={c}>{placeLabel(c, t)}</option>)}
                  </select>
                  <ChevronDown size={16} color="#93A5AA" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                {sectionLabel(t.propertyTypeLabel)}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilters(f => ({ ...f, propertyType: "Barchasi" }))} className="px-3 py-1.5 rounded-lg text-[13px]"
                    style={chip(filters.propertyType === "Barchasi")}>{t.all}</button>
                  {getPropertyTypes(t).map(pt => (
                    <button key={pt.id} onClick={() => setFilters(f => ({ ...f, propertyType: pt.id }))} className="px-3 py-1.5 rounded-lg text-[13px] flex items-center gap-1.5"
                      style={chip(filters.propertyType === pt.id)}>
                      <pt.Icon size={13} /> {pt.label.split(" / ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {sectionLabel(t.sortLabel)}
                <div className="flex flex-wrap gap-2">
                  {getSortOptions(t).map(s => (
                    <button key={s.id} onClick={() => setFilters(f => ({ ...f, sortBy: s.id }))} className="px-3 py-1.5 rounded-lg text-[13px]"
                      style={chip(filters.sortBy === s.id)}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div>
                {sectionLabel(isShared ? `${t.priceRange} — ${t.perPerson}` : t.priceRange)}
                <div className="flex items-center gap-2">
                  <input type="number" inputMode="numeric" placeholder={t.from} value={filters.min}
                    onChange={(e) => setFilters(f => ({ ...f, min: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
                  <span style={{ color: "#93A5AA" }}>—</span>
                  <input type="number" inputMode="numeric" placeholder={t.to} value={filters.max}
                    onChange={(e) => setFilters(f => ({ ...f, max: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
                </div>
              </div>

              <div>
                {sectionLabel(t.roomsCount)}
                <div className="flex flex-wrap gap-2">
                  {roomOptions.map(([val, text]) => (
                    <button key={val} onClick={() => setFilters(f => ({ ...f, rooms: val }))} className="px-3 py-1.5 rounded-lg text-[13px]"
                      style={chip(filters.rooms === val)}>{text}</button>
                  ))}
                </div>
              </div>

              {isShared && (
                <>
                  <div>
                    {sectionLabel(t.filterFreeSpots)}
                    <div className="flex flex-wrap gap-2">
                      {[["Barchasi", t.anyMode], ["1", "1+"], ["2", "2+"], ["3", "3+"]].map(([val, text]) => (
                        <button key={val} onClick={() => setFilters(f => ({ ...f, minFreeSpots: val }))} className="px-3 py-1.5 rounded-lg text-[13px]"
                          style={chip(filters.minFreeSpots === val)}>{text}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    {sectionLabel(t.genderLabel)}
                    <div className="flex flex-wrap gap-2">
                      {[["Barchasi", t.anyMode], ["erkak", t.genderMale], ["ayol", t.genderFemale], ["aralash", t.genderMixed]].map(([val, text]) => (
                        <button key={val} onClick={() => setFilters(f => ({ ...f, gender: val }))} className="px-3 py-1.5 rounded-lg text-[13px]"
                          style={chip(filters.gender === val)}>{text}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 pt-3 shrink-0 space-y-1.5" style={{ borderTop: "1px solid #2A424C", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
              <div className="flex gap-2">
                <button onClick={resetRefinements} className="px-4 py-3 rounded-xl text-[13.5px] font-medium"
                  style={{ background: "#16262E", color: "#F2EDE4", border: "1px solid #2A424C" }}>{t.clearFilters}</button>
                <button onClick={() => setOpen(false)} className="flex-1 py-3 rounded-xl text-[14px] font-semibold"
                  style={{ background: "#3E92B0", color: "#0E1B21" }}>
                  {resultsCount > 0 ? tn(t, "showResultsN", resultsCount) : t.showResultsNone}
                </button>
              </div>
              <button onClick={() => { setOpen(false); onSaveSearch(); }} className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12.5px] font-medium"
                style={{ color: "#3E92B0" }}><Bell size={12} /> {t.saveSearch}</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// Supabase Auth xatolari inglizcha keladi — foydalanuvchiga tanlangan tilda tushuntiramiz
function verifyErrorText(e, t, fallback) {
  const m = String(e?.message || "");
  if (e?.status === 429 || /security purposes|rate limit|too many/i.test(m)) return t.codeTooSoonError;
  if (/expired|invalid.*(otp|token|code)|(otp|token).*(expired|invalid)/i.test(m)) return t.codeInvalidError;
  if (/phone/i.test(m) && /invalid|format/i.test(m)) return t.phoneInvalidError;
  if (/failed to fetch|network|load failed/i.test(m)) return t.networkError;
  return fallback;
}

function VerifyModal({ onClose, onVerified, t = STR.uz }) {
  const [step, setStep] = useState(1);
  const [phoneInput, setPhoneInput] = useState("");
  const [code, setCode] = useState("");
  const [flowType, setFlowType] = useState("phone_change"); // yoki "sms" (qaytgan foydalanuvchi)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Shaxsga doir ma'lumotlarga ishlov berishga rozilik (qonun talabi) — belgilanmaguncha kod yuborilmaydi
  const [agreed, setAgreed] = useState(false);

  const normalizedPhone = () => {
    let p = phoneInput.replace(/[^\d+]/g, "");
    if (!p.startsWith("+")) p = "+" + p;
    return p;
  };

  const sendCode = async () => {
    setLoading(true); setError("");
    const phone = normalizedPhone();
    try {
      // Avval joriy (anonim) hisobga shu raqamni ulashga urinamiz
      const { error: linkErr } = await supabase.auth.updateUser({ phone });
      if (!linkErr) { setFlowType("phone_change"); setStep(2); setLoading(false); return; }

      // Agar raqam allaqachon boshqa hisobga ulangan bo'lsa — qaytgan foydalanuvchi sifatida kod yuboramiz
      if (String(linkErr.message || "").toLowerCase().includes("already") || linkErr.status === 422) {
        const { error: otpErr } = await supabase.auth.signInWithOtp({ phone });
        if (otpErr) throw otpErr;
        setFlowType("sms"); setStep(2); setLoading(false); return;
      }
      throw linkErr;
    } catch (e) {
      setError(verifyErrorText(e, t, t.sendCodeError));
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    setLoading(true); setError("");
    const phone = normalizedPhone();
    try {
      const { error: verErr } = await supabase.auth.verifyOtp({ phone, token: code, type: flowType });
      if (verErr) throw verErr;
      await onVerified(phone);
    } catch (e) {
      setError(verifyErrorText(e, t, t.codeInvalidError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>{step === 1 ? t.verifyTitle1 : t.verifyTitle2}</h3>
          <button onClick={onClose} aria-label={t.closeLabel}><X size={20} color="#93A5AA" /></button>
        </div>
        {error && <p className="text-[12.5px] mb-3" style={{ color: "#D4783C" }}>{error}</p>}
        {step === 1 ? (
          <>
            <p className="text-[13px] mb-3" style={{ color: "#93A5AA" }}>{t.verifyIntro}</p>
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+998901234567" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none mb-3" style={inputStyle} />
            <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 shrink-0" />
              <span className="text-[12px] leading-snug" style={{ color: "#C8D4D6" }}>
                {tl(t, "consentText", {
                  terms: <Link to={LEGAL_ROUTES.terms} target="_blank" style={linkStyle}>{t.consentTermsLabel}</Link>,
                  privacy: <Link to={LEGAL_ROUTES.privacy} target="_blank" style={linkStyle}>{t.consentPrivacyLabel}</Link>,
                })}
              </span>
            </label>
            <button onClick={sendCode} disabled={phoneInput.length < 9 || loading || !agreed} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: (phoneInput.length < 9 || loading || !agreed) ? "#2A424C" : "#3E92B0", color: (phoneInput.length < 9 || loading || !agreed) ? "#93A5AA" : "#0E1B21" }}>{loading ? t.sendingCode : t.sendCodeBtn}</button>
          </>
        ) : (
          <>
            <p className="text-[13px] mb-3" style={{ color: "#93A5AA" }}>{tf(t, "codeSentToN", { phone: normalizedPhone() })}</p>
            <input inputMode="numeric" autoComplete="one-time-code" placeholder="000000" value={code} maxLength={6} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="w-full px-3 py-2.5 rounded-lg text-[20px] tracking-[8px] text-center outline-none mb-3 font-mono" style={inputStyle} />
            <button onClick={confirmCode} disabled={code.length < 6 || loading} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: (code.length < 6 || loading) ? "#2A424C" : "#D4783C", color: "#16262E" }}>{loading ? t.checkingCode : t.confirmBtn}</button>
          </>
        )}
      </div>
    </div>
  );
}

function ReportModal({ onClose, onSubmit, t = STR.uz }) {
  // [bazaga yoziladigan qiymat (admin o'zbekcha ko'radi), ekrandagi matn]
  const reasons = [
    ["Bu rieltor/vositachi", t.reportRealtor],
    ["Narx noto'g'ri ko'rsatilgan", t.reportWrongPrice],
    ["Firibgarlik shubhasi", t.reportScam],
    ["E'lon o'chirilgan/band", t.reportUnavailable],
  ];
  const [reason, setReason] = useState(reasons[0][0]);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg flex items-center gap-2" style={{ color: "#F2EDE4" }}><Flag size={17} color="#D4783C" /> {t.reportTitle}</h3>
          <button onClick={onClose} aria-label={t.closeLabel}><X size={20} color="#93A5AA" /></button>
        </div>
        <div className="space-y-2 mb-4">
          {reasons.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer" style={{ background: reason === value ? "#26343A" : "transparent", border: "1px solid #2A424C" }}>
              <input type="radio" name="report-reason" checked={reason === value} onChange={() => setReason(value)} />
              <span className="text-[13.5px]" style={{ color: "#F2EDE4" }}>{label}</span>
            </label>
          ))}
        </div>
        <button onClick={() => onSubmit(reason)} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: "#D4783C", color: "#16262E" }}>{t.reportSubmit}</button>
        <p className="text-[11.5px] mt-2 text-center" style={{ color: "#65787E" }}>{t.reportFooter}</p>
      </div>
    </div>
  );
}

function BoostModal({ onClose, onBoost, onUseCredit, boostCredits, t = STR.uz }) {
  const packages = [
    { id: "7d", label: t.boostDays7, price: 25000, desc: t.boostDesc7 },
    { id: "30d", label: t.boostDays30, price: 80000, desc: t.boostDesc30 },
  ];
  const [selected, setSelected] = useState("7d");
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg flex items-center gap-2" style={{ color: "#F2EDE4" }}><Sparkles size={17} color="#E8B94A" /> {t.boostTitle}</h3>
          <button onClick={onClose} aria-label={t.closeLabel}><X size={20} color="#93A5AA" /></button>
        </div>
        {boostCredits > 0 && (
          <button onClick={() => onUseCredit()} className="w-full flex items-center justify-between p-3.5 rounded-xl mb-3" style={{ background: "#26343A", border: "1.5px solid #E8B94A" }}>
            <span className="text-[13.5px] font-medium flex items-center gap-2" style={{ color: "#E8B94A" }}><Sparkles size={15} /> {t.boostFreeCredit}</span>
            <span className="text-[12px]" style={{ color: "#93A5AA" }}>{tn(t, "boostLeftN", boostCredits)}</span>
          </button>
        )}
        <div className="space-y-2.5 mb-4">
          {packages.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} className="w-full text-left p-3.5 rounded-xl flex items-center justify-between" style={{ background: selected === p.id ? "#26343A" : "#16262E", border: selected === p.id ? "1.5px solid #E8B94A" : "1px solid #2A424C" }}>
              <div>
                <div className="text-[14px] font-medium" style={{ color: "#F2EDE4" }}>{p.label}</div>
                <div className="text-[12px]" style={{ color: "#93A5AA" }}>{p.desc}</div>
              </div>
              <div className="font-mono text-[14px] font-semibold whitespace-nowrap" style={{ color: "#E8B94A" }}>{fmt(p.price, t)} <span className="text-[11px] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{t.currency}</span></div>
            </button>
          ))}
        </div>
        <div className="text-[12px] mb-2" style={{ color: "#93A5AA" }}>{t.payMethod}</div>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => onBoost(selected, packages.find(p => p.id === selected).price, "payme")} className="py-2.5 rounded-lg font-medium text-[13.5px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>{tf(t, "payWith", { p: "Payme" })}</button>
          <button onClick={() => onBoost(selected, packages.find(p => p.id === selected).price, "click")} className="py-2.5 rounded-lg font-medium text-[13.5px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>{tf(t, "payWith", { p: "Click" })}</button>
        </div>
        <p className="text-[11px] leading-snug mt-3 text-center" style={{ color: "#93A5AA" }}>
          {tl(t, "boostOfferNote", { offer: <Link to={LEGAL_ROUTES.offer} target="_blank" style={linkStyle}>{t.boostOfferLabel}</Link> })}
        </p>
      </div>
    </div>
  );
}

function DetailView({ item, onBack, verified, onRequestVerify, isFav, onToggleFav, onReport, onOpenChat, onRevealPhone, t, similar, favs, onOpenSimilar }) {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);
  const smsBody = encodeURIComponent(tf(t, "smsTemplate", { title: item.title }));

  const share = async () => {
    const url = `${window.location.origin}/elon/${item.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: item.title, url }); } catch (e) { /* foydalanuvchi bekor qildi */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pb-44">
      <div className="relative">
        <Gallery images={item.images} hue={item.hue} zoomable />
        <button onClick={onBack} aria-label={t.backLabel} className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center z-10" style={{ background: "rgba(22,38,46,0.85)", top: "calc(env(safe-area-inset-top, 0px) + 20px)" }}><ArrowLeft size={19} color="#F2EDE4" /></button>
        <div className="absolute right-4 flex gap-2 z-10" style={{ top: "calc(env(safe-area-inset-top, 0px) + 20px)" }}>
          <button onClick={share} aria-label={t.shareLabel} className="w-11 h-11 rounded-full flex items-center justify-center relative" style={{ background: "rgba(22,38,46,0.85)" }}>
            <Share2 size={17} color="#F2EDE4" />
            {copied && <span className="absolute top-12 right-0 whitespace-nowrap px-2 py-1 rounded-lg text-[11px]" style={{ background: "#E8B94A", color: "#16262E" }}>{t.linkCopied}</span>}
          </button>
          <button onClick={() => setShowReport(true)} aria-label={t.reportTitle} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.85)" }}><Flag size={17} color="#F2EDE4" /></button>
          <button onClick={() => onToggleFav(item.id)} aria-label={t.favLabel} aria-pressed={!!isFav} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.85)" }}><Heart size={18} fill={isFav ? "#D4783C" : "none"} color={isFav ? "#D4783C" : "#F2EDE4"} /></button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <PriceTag price={item.price} rentType={item.rentType} perPerson={item.listingMode === "shared"} t={t} />
          <span className="flex items-center gap-1 text-[12px]" style={{ color: "#65787E" }}>
            {React.createElement(typeIcon(item.propertyType), { size: 14 })} {typeLabel(item.propertyType, t)}
          </span>
        </div>
        <div>
          <h1 className="font-serif text-2xl" style={{ color: "#F2EDE4" }}>{item.title}</h1>
          <div className="flex items-center gap-1 text-[14px] mt-1" style={{ color: "#93A5AA" }}><MapPin size={14} /> {placeLabel(item.district, t)}, {placeLabel(item.city, t)}</div>
        </div>
        <div className="flex items-center gap-3 text-[12.5px]" style={{ color: "#93A5AA" }}>
          <span className="flex items-center gap-1"><Eye size={13} /> {tn(t, "viewsN", item.views)}</span>
          {item.verified && <span className="flex items-center gap-1.5 font-medium" style={{ color: "#E8B94A" }}><ShieldCheck size={14} /> {t.verifiedOwner}</span>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[[t.roomsHeader, `${item.rooms}${t.ta ? " " + t.ta : ""}`], [t.areaHeader, `${item.area} ${t.sqm}`], [t.floorHeader, item.floor || "—"]].map(([l, v]) => (
            <div key={l} className="rounded-xl p-3 text-center" style={box}><div className="text-[11px]" style={{ color: "#93A5AA" }}>{l}</div><div className="text-[15px] font-medium mt-0.5" style={{ color: "#F2EDE4" }}>{v}</div></div>
          ))}
        </div>

        {/* O'rin ijarasi: bo'sh o'rinlar va xonalar holati */}
        {item.listingMode === "shared" && (
          <div className="rounded-2xl p-4" style={box}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium flex items-center gap-1.5" style={{ color: "#F2EDE4" }}>
                <Users size={14} color="#3E92B0" /> {t.roomsBreakdown}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold"
                style={{ background: item.freeSpots > 0 ? "#3E92B0" : "#2A424C", color: item.freeSpots > 0 ? "#0E1B21" : "#93A5AA" }}>
                {item.freeSpots > 0 ? tn(t, "freeSpotsN", item.freeSpots) : t.noFreeSpots}
              </span>
            </div>

            <div className="space-y-1.5">
              {(item.roomsConfig || []).map((r, i) => {
                const free = Math.max(0, (r.capacity || 0) - (r.occupied || 0));
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "#16262E" }}>
                    <span className="text-[12.5px]" style={{ color: "#C8D4D6" }}>
                      {t.roomWord} {i + 1} · {tn(t, "roomCapacityN", r.capacity)}
                    </span>
                    <span className="text-[12px] font-medium" style={{ color: free > 0 ? "#8FD19E" : "#93A5AA" }}>
                      {free > 0 ? tn(t, "freeN", free) : t.noFreeSpots}
                    </span>
                  </div>
                );
              })}
            </div>

            {item.genderPref && (
              <div className="mt-3 text-[12.5px]" style={{ color: "#93A5AA" }}>
                {t.genderLabel}: <b style={{ color: "#F2EDE4" }}>
                  {item.genderPref === "erkak" ? t.genderMale : item.genderPref === "ayol" ? t.genderFemale : t.genderMixed}
                </b>
              </div>
            )}
          </div>
        )}
        <div><div className="text-[13px] font-medium mb-1.5" style={{ color: "#F2EDE4" }}>{t.descTitle}</div><p className="text-[14px] leading-relaxed" style={{ color: "#93A5AA" }}>{item.desc}</p></div>
        <div>
          <div className="text-[13px] font-medium mb-2" style={{ color: "#F2EDE4" }}>{t.amenitiesTitle}</div>
          <div className="flex flex-wrap gap-2">{item.amenities.map(a => <span key={a} className="px-3 py-1.5 rounded-full text-[12px]" style={{ ...box, color: "#93A5AA" }}>{amenityLabel(a, t)}</span>)}</div>
        </div>
        <MapStatic lat={item.lat} lng={item.lng} addressTitle={t.addressTitle} />
        {item.rentType === "Kunlik" && <BookingCalendarView listingId={item.id} t={t} />}
        {/* Oldindan to'lov firibgarligidan ogohlantirish */}
        {!item.mine && (
          <div className="rounded-2xl p-3.5 flex items-start gap-2.5" style={{ background: "#26343A", border: "1px solid #3E5560" }}>
            <ShieldAlert size={17} color="#E8B94A" className="shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[13px] font-medium mb-0.5" style={{ color: "#F2EDE4" }}>{t.safetyTitle}</div>
              <p className="text-[12.5px] leading-snug" style={{ color: "#C8D4D6" }}>{t.safetyBody}</p>
            </div>
          </div>
        )}
      </div>

      {similar && similar.length > 0 && (
        <div className="pb-2">
          <div className="px-4 text-[13px] font-medium mb-2.5" style={{ color: "#F2EDE4" }}>{t.similarListings}</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
            {similar.map(s => (
              <div key={s.id} className="shrink-0 w-44">
                <ListingCard item={s} onOpen={onOpenSimilar} isFav={favs?.has(s.id)} onToggleFav={onToggleFav} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, #16262E 75%, transparent)", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
        {verified ? (
          <div className="space-y-2">
            <button onClick={() => onOpenChat(item)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-[15px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>
              <MessageCircle size={17} /> {t.chatCta}
            </button>
            {!item.ownerPhone && !item.mine && onRevealPhone && (
              <button onClick={() => onRevealPhone(item)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-[13px]"
                style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                <Phone size={14} /> {t.revealPhoneBtn}
              </button>
            )}
            {item.ownerPhone && (
              <div className="grid grid-cols-2 gap-2.5">
                <a href={`tel:${item.ownerPhone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-[13px]" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}><Phone size={14} /> {t.callBtn}</a>
                <a href={`sms:${item.ownerPhone}?body=${smsBody}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-[13px]" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}><MessageSquare size={14} /> {t.smsBtn}</a>
              </div>
            )}
            <p className="text-center text-[11px]" style={{ color: "#65787E" }}>{t.chatHint}</p>
          </div>
        ) : (
          <button onClick={onRequestVerify} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-[15px]" style={{ background: "#D4783C", color: "#16262E" }}><Phone size={17} /> {t.contactOwner}</button>
        )}
      </div>

      {showReport && !reported && (
        <ReportModal onClose={() => setShowReport(false)} onSubmit={(reason) => { onReport(item, reason); setReported(true); setShowReport(false); }} t={t} />
      )}
    </div>
  );
}

function ChatThread({ chat, onBack, onSend, t }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat.messages.length]);

  const submit = () => {
    if (!text.trim()) return;
    onSend(chat.listingId, text.trim());
    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#16262E" }}>
      <header className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3" style={{ background: "#1A2B33", borderBottom: "1px solid #22343B", paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
        <button onClick={onBack} aria-label={t.backLabel}><ArrowLeft size={19} color="#F2EDE4" /></button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `hsl(${chat.hue} 45% 28%)` }}>
          <Building2 size={16} color="rgba(242,237,228,0.7)" />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-medium truncate" style={{ color: "#F2EDE4" }}>{chat.listingTitle || t.listingFallback}</div>
          <div className="text-[11px] flex items-center gap-1" style={{ color: "#93A5AA" }}><Lock size={10} /> {t.chatHint}</div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto pb-24">
        <div className="text-center text-[11.5px] py-2" style={{ color: "#65787E" }}>{t.chatSafetyNote}</div>
        {chat.messages.map(m => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-snug"
              style={m.from === "me"
                ? { background: "#3E92B0", color: "#0E1B21", borderBottomRightRadius: 4 }
                : { background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C", borderBottomLeftRadius: 4 }}>
              <div>{m.text}</div>
              {m.createdAt && (
                <div className="text-[10px] mt-1 text-right" style={{ color: m.from === "me" ? "rgba(14,27,33,0.55)" : "#65787E" }}>
                  {msgTime(m.createdAt, t)}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 flex items-center gap-2" style={{ background: "#1A2B33", borderTop: "1px solid #22343B", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder={t.writeMessage} className="flex-1 px-3.5 py-2.5 rounded-full text-[13.5px] outline-none" style={{ background: "#16262E", color: "#F2EDE4", border: "1px solid #2A424C" }} />
        <button onClick={submit} aria-label={t.sendLabel} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#D4783C" }}>
          <Send size={16} color="#16262E" />
        </button>
      </div>
    </div>
  );
}

function ChatsListView({ chats, onOpen, t, unreadByChat = {} }) {
  const threads = Object.values(chats).sort((a, b) => (b.messages.at(-1)?.id || 0) - (a.messages.at(-1)?.id || 0));
  return (
    <div className="px-4 pt-4 pb-28 space-y-2.5">
      {threads.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle size={32} color="#3E5560" className="mx-auto mb-3" />
          <p className="text-[14px] px-6" style={{ color: "#93A5AA" }}>{t.noChats}</p>
        </div>
      ) : threads.map(c => {
        const last = c.messages.at(-1);
        return (
          <button key={c.listingId} onClick={() => onOpen(c)} className="w-full flex items-center gap-3 p-3 rounded-2xl text-left" style={box}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: `hsl(${c.hue} 45% 28%)` }}>
              <Building2 size={18} color="rgba(242,237,228,0.7)" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-medium truncate" style={{ color: "#F2EDE4" }}>{c.listingTitle || t.listingFallback}</div>
              <div className="text-[12px] truncate" style={{ color: unreadByChat[c.listingId] ? "#C8D4D6" : "#93A5AA", fontWeight: unreadByChat[c.listingId] ? 500 : 400 }}>{last ? (last.from === "me" ? t.youPrefix : "") + last.text : ""}</div>
            </div>
            {unreadByChat[c.listingId] ? (
              <span className="min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: "#D4783C", color: "#16262E" }}>
                {unreadByChat[c.listingId] > 9 ? "9+" : unreadByChat[c.listingId]}
              </span>
            ) : (
              <ChevronRight size={16} color="#65787E" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Har bir rasmdan IKKITA nusxa tayyorlaydi:
//  - katta (1600px) — e'lon sahifasi va to'liq ekran uchun
//  - kichik (400px) — ro'yxat kartochkalari va xarita uchun (~15 barobar kam trafik)
async function makeImageVariants(file) {
  const full = await compressImage(file, 1600, 0.82);
  const thumb = await compressImage(file, 400, 0.75);
  return { full, thumb };
}

async function compressImage(file, maxSize = 1600, quality = 0.82) {
  // Rasm bo'lmasa — tegmaymiz.
  // Katta nusxa uchun: allaqachon kichik fayl bo'lsa qayta siqmaymiz.
  // Kichik nusxa (maxSize kichik) uchun esa doim kichraytiramiz.
  if (!file.type.startsWith("image/")) return file;
  if (maxSize >= 1000 && file.size < 300 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file; // foyda bo'lmasa — asl faylni qoldiramiz

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch (_) {
    return file; // eski brauzerlarda ishlamasa — asl fayl bilan davom etamiz
  }
}

function PostForm({ onPublish, userId, t = STR.uz, initialFullName = "", onFullNameSaved }) {
  const [nameParts] = useState(() => {
    const parts = (initialFullName || "").trim().split(/\s+/);
    return { ism: parts[0] || "", familiya: parts.slice(1).join(" ") || "" };
  });
  const [form, setForm] = useState({ ism: nameParts.ism, familiya: nameParts.familiya, title: "", propertyType: "kvartira", city: CITIES[0], district: DISTRICTS["Toshkent shahri"][0], rooms: 1, area: "", floor: "", rentType: "Oylik", price: "", amenities: [], desc: "", ownerConfirm: false, lat: null, lng: null,
    listingMode: "whole", genderPref: "aralash", roomsConfig: [{ capacity: 4, occupied: 0 }] });
  const [images, setImages] = useState([]); // { file, url, name }
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const toggleAmenity = (a) => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));

// Rasmni yuklashdan oldin kichraytiradi (telefon rasmlari 5-10 MB bo'ladi — bu juda katta).
// Eni/bo'yi 1600px dan oshmaydi, sifat 82% — ko'z bilan farq sezilmaydi, hajm ~10 barobar kamayadi.


  const [compressing, setCompressing] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 8 - images.length);
    e.target.value = "";
    if (!files.length) return;
    setCompressing(true);
    const next = [];
    for (const raw of files) {
      const file = await compressImage(raw);
      next.push({ file, url: URL.createObjectURL(file), name: file.name });
    }
    setImages(prev => [...prev, ...next]);
    setCompressing(false);
  };
  const removeImage = (i) => setImages(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); });

  const valid = form.ism.trim() && form.familiya.trim() && form.title && form.area && form.price && form.ownerConfirm && images.length >= 3 && !submitting;

  const submit = async () => {
    if (!userId) { setError(t.sessionNotFoundError); return; }
    setSubmitting(true);
    setError("");
    try {
      // 0) Ism-familiyani profilga saqlash
      const fullName = `${form.ism.trim()} ${form.familiya.trim()}`.trim();
      const { error: nameErr } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
      if (nameErr) throw nameErr;
      onFullNameSaved && onFullNameSaved(fullName);

      // Belgilangan rozilik (shartlar + maxfiylik siyosati) serverda qayd etiladi — raqam tasdiqlanmagan bo'lsa ham
      const { error: consentErr } = await supabase.rpc("accept_terms", { p_version: LEGAL_VERSION });
      if (consentErr) console.error("Rozilikni yozishda xato:", consentErr.message);

      // 1) E'lonni yaratish (pending holatda)
      const { data: listingRow, error: insertErr } = await supabase.from("listings").insert({
        owner_id: userId, title: form.title, city: form.city, district: form.district,
        property_type: form.propertyType, rooms: Number(form.rooms), area: Number(form.area), floor: form.floor,
        rent_type: form.rentType, price: Number(form.price), amenities: form.amenities,
        description: form.desc, status: "pending", lat: form.lat, lng: form.lng,
        listing_mode: form.listingMode,
        gender_pref: form.listingMode === "shared" ? form.genderPref : null,
        rooms_config: form.listingMode === "shared" ? form.roomsConfig : [],
        free_spots: form.listingMode === "shared" ? countFreeSpots(form.roomsConfig) : 0,
      }).select().single();
      if (insertErr) throw insertErr;

      // 2) Rasmlarni Storage'ga yuklash — har biridan katta va kichik nusxa
      const uploaded = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const stamp = `${Date.now()}_${i}`;
        const { full, thumb } = await makeImageVariants(img.file);

        const fullPath = `${userId}/${listingRow.id}/${stamp}.jpg`;
        const { error: e1 } = await supabase.storage.from("listing-images").upload(fullPath, full);
        if (e1) throw e1;

        const thumbPath = `${userId}/${listingRow.id}/${stamp}_t.jpg`;
        const { error: e2 } = await supabase.storage.from("listing-images").upload(thumbPath, thumb);
        if (e2) throw e2;

        uploaded.push({
          url: supabase.storage.from("listing-images").getPublicUrl(fullPath).data.publicUrl,
          thumb_url: supabase.storage.from("listing-images").getPublicUrl(thumbPath).data.publicUrl,
        });
      }

      // 3) Rasm URL'larini bazaga yozish
      if (uploaded.length) {
        const rows = uploaded.map((u, position) => ({ listing_id: listingRow.id, url: u.url, thumb_url: u.thumb_url, position }));
        const { error: imgErr } = await supabase.from("listing_images").insert(rows);
        if (imgErr) throw imgErr;
      }

      setDone(true);
      onPublish();
    } catch (e) {
      console.error(e);
      setError(friendlyError(e, t));
    } finally {
      setSubmitting(false);
    }
  };
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#E8B94A" }}><Check size={28} color="#16262E" /></div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#F2EDE4" }}>{t.successTitle}</h2>
        <p className="text-[14px]" style={{ color: "#93A5AA" }}>{t.successBody} {t.successBody2}</p>
      </div>
    );
  }
  return (
    <div className="p-4 pb-28 space-y-5">
      <div className="rounded-xl p-3.5 flex items-start gap-2.5" style={{ background: "#26343A", border: "1px solid #3E5560" }}>
        <ShieldCheck size={18} color="#3E92B0" className="shrink-0 mt-0.5" />
        <p className="text-[12.5px] leading-snug" style={{ color: "#C8D4D6" }}>{t.ownersOnlyNotice}</p>
      </div>
      {error && (
        <div className="rounded-xl p-3.5" style={{ background: "#3A2429", border: "1px solid #6B3A42" }}>
          <p className="text-[12.5px]" style={{ color: "#F2C2C2" }}>{error}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.ismLabel}><input value={form.ism} onChange={e => setForm(f => ({ ...f, ism: e.target.value }))} placeholder={t.ismPlaceholder} style={inputStyle} /></Field>
        <Field label={t.familiyaLabel}><input value={form.familiya} onChange={e => setForm(f => ({ ...f, familiya: e.target.value }))} placeholder={t.familiyaPlaceholder} style={inputStyle} /></Field>
      </div>
      <p className="text-[11px] -mt-3" style={{ color: "#65787E" }}>{t.nameHint}</p>
      <Field label={t.titleLabel}><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={t.titlePlaceholder} style={inputStyle} /></Field>

      <Field label={t.propertyTypeLabel}>
        <div className="grid grid-cols-3 gap-2">
          {getPropertyTypes(t).map(pt => (
            <button key={pt.id} type="button" onClick={() => setForm(f => ({ ...f, propertyType: pt.id }))}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[11.5px] font-medium"
              style={{ background: form.propertyType === pt.id ? "#3E92B0" : "#16262E", color: form.propertyType === pt.id ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>
              <pt.Icon size={18} />
              {pt.label}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.cityLabel}><select value={form.city} onChange={e => { const city = e.target.value; setForm(f => ({ ...f, city, district: (DISTRICTS[city] || ["Markaz"])[0] })); }} style={inputStyle}>{CITIES.map(c => <option key={c} value={c}>{placeLabel(c, t)}</option>)}</select></Field>
        <Field label={t.districtLabel}><select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} style={inputStyle}>{(DISTRICTS[form.city] || ["Markaz"]).map(d => <option key={d} value={d}>{placeLabel(d, t)}</option>)}</select></Field>
      </div>
      <Field label={t.addressMapLabel}>
        <MapPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm(f => ({ ...f, lat, lng }))} />
        <p className="text-[11px] mt-1.5" style={{ color: "#65787E" }}>{t.mapDragHint}</p>
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label={t.roomsHeader}><input type="number" min={1} value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))} style={inputStyle} /></Field>
        <Field label={t.areaLabelM2}><input type="number" inputMode="decimal" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} style={inputStyle} /></Field>
        <Field label={t.floorLabel}><input placeholder="3/9" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} style={inputStyle} /></Field>
      </div>

      {/* Ijara shakli: butun uy yoki o'rin (sherik bilan) */}
      <Field label={t.modeLabel}>
        <div className="grid grid-cols-2 gap-2">
          {[["whole", t.modeWhole, Home], ["shared", t.modeShared, Users]].map(([val, label, Icon]) => (
            <button key={val} type="button" onClick={() => setForm(f => ({ ...f, listingMode: val }))}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[12px] font-medium"
              style={{ background: form.listingMode === val ? "#3E92B0" : "#16262E", color: form.listingMode === val ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
      </Field>

      {form.listingMode === "shared" && (
        <>
          <Field label={t.roomsConfigLabel}>
            <RoomsEditor rooms={form.roomsConfig} setRooms={(rc) => setForm(f => ({ ...f, roomsConfig: rc }))} t={t} />
          </Field>
          <Field label={t.genderLabel}>
            <div className="grid grid-cols-3 gap-2">
              {[["erkak", t.genderMale], ["ayol", t.genderFemale], ["aralash", t.genderMixed]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => setForm(f => ({ ...f, genderPref: val }))}
                  className="py-2 rounded-lg text-[12.5px] font-medium"
                  style={{ background: form.genderPref === val ? "#D4783C" : "#16262E", color: form.genderPref === val ? "#16262E" : "#93A5AA", border: "1px solid #2A424C" }}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label={t.rentTypeLabel}>
          <div className="flex rounded-lg p-0.5" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
            {[["Oylik", t.monthly], ["Kunlik", t.daily]].map(([val, label]) => <button key={val} type="button" onClick={() => setForm(f => ({ ...f, rentType: val }))} className="flex-1 py-2 rounded-md text-[13px] font-medium" style={{ background: form.rentType === val ? "#3E92B0" : "transparent", color: form.rentType === val ? "#0E1B21" : "#93A5AA" }}>{label}</button>)}
          </div>
        </Field>
        <Field label={form.listingMode === "shared" ? t.pricePerPersonLabel : t.priceLabelSom}>
          <input type="number" inputMode="numeric" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder={form.listingMode === "shared" ? "800000" : "4200000"} style={inputStyle} />
        </Field>
      </div>
      <Field label={t.amenitiesLabel}>
        <div className="flex flex-wrap gap-2">{AMENITIES_LIST.map(a => <button key={a} type="button" onClick={() => toggleAmenity(a)} className="px-3 py-1.5 rounded-full text-[12.5px]" style={{ background: form.amenities.includes(a) ? "#D4783C" : "#16262E", color: form.amenities.includes(a) ? "#16262E" : "#93A5AA", border: "1px solid #2A424C" }}>{amenityLabel(a, t)}</button>)}</div>
      </Field>
      <Field label={t.descLabel}><textarea rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder={t.descPlaceholder} style={{ ...inputStyle, resize: "none" }} /></Field>
      <Field label={tn(t, "photosCountN", images.length)}>
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <div key={img.url} className="w-16 h-16 rounded-lg overflow-hidden relative">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#D4783C" }}><Trash2 size={11} color="#16262E" /></button>
            </div>
          ))}
          {images.length < 8 && (
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={compressing} className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1" style={{ border: "1.5px dashed #3E5560", color: "#93A5AA" }}>
              {compressing
                ? <span className="text-[9.5px] text-center leading-tight px-1">{t.preparingPhotos}</span>
                : <><Camera size={18} /><span className="text-[10px]">{t.addPhotoBtn}</span></>}
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: "#65787E" }}>{t.photosHint}</p>
      </Field>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.ownerConfirm} onChange={e => setForm(f => ({ ...f, ownerConfirm: e.target.checked }))} className="mt-0.5 w-4 h-4 shrink-0" />
        <span className="text-[13px] leading-snug" style={{ color: "#C8D4D6" }}>
          {tl(t, "ownerConsentText", {
            realtor: <b>{t.ownerConfirmBold}</b>,
            terms: <Link to={LEGAL_ROUTES.terms} target="_blank" style={linkStyle} onClick={e => e.stopPropagation()}>{t.consentTermsLabel}</Link>,
            privacy: <Link to={LEGAL_ROUTES.privacy} target="_blank" style={linkStyle} onClick={e => e.stopPropagation()}>{t.consentPrivacyLabel}</Link>,
          })}
        </span>
      </label>
      <p className="text-[11.5px] leading-snug -mt-2" style={{ color: "#65787E" }}>{t.postPublishNote}</p>
      <button disabled={!valid} onClick={submit} className="w-full py-3.5 rounded-xl font-medium text-[15px]" style={{ background: valid ? "#3E92B0" : "#2A424C", color: valid ? "#0E1B21" : "#65787E" }}>{submitting ? t.submitting : t.submitBtn}</button>
    </div>
  );
}

// Xonalar ro'yxatidan jami bo'sh o'rinlarni hisoblaydi
function countFreeSpots(roomsConfig) {
  return (roomsConfig || []).reduce(
    (sum, r) => sum + Math.max(0, (Number(r.capacity) || 0) - (Number(r.occupied) || 0)),
    0
  );
}

// Uy egasi xonalarni va ulardagi band/bo'sh o'rinlarni kiritadigan bo'lim
function RoomsEditor({ rooms, setRooms, t }) {
  const update = (i, field, value) => {
    const v = Math.max(0, Number(value) || 0);
    setRooms(rooms.map((r, idx) => {
      if (idx !== i) return r;
      const next = { ...r, [field]: v };
      // Band o'rin jami o'rindan ko'p bo'lib ketmasin
      if (next.occupied > next.capacity) next.occupied = next.capacity;
      return next;
    }));
  };

  const totalFree = countFreeSpots(rooms);

  return (
    <div className="space-y-2">
      {rooms.map((r, i) => {
        const free = Math.max(0, (r.capacity || 0) - (r.occupied || 0));
        return (
          <div key={i} className="p-2.5 rounded-xl" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12.5px] font-medium" style={{ color: "#F2EDE4" }}>{t.roomWord} {i + 1}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] px-2 py-0.5 rounded-full"
                  style={{ background: free > 0 ? "#3E92B0" : "#2A424C", color: free > 0 ? "#0E1B21" : "#93A5AA" }}>
                  {tn(t, "freeN", free)}
                </span>
                {rooms.length > 1 && (
                  <button type="button" onClick={() => setRooms(rooms.filter((_, idx) => idx !== i))}>
                    <Trash2 size={13} color="#D4783C" />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10.5px] mb-1" style={{ color: "#93A5AA" }}>{t.capacityLabel}</div>
                <input type="number" min={1} value={r.capacity} onChange={e => update(i, "capacity", e.target.value)}
                  style={{ ...inputStyle, padding: "7px 10px", fontSize: 13 }} />
              </div>
              <div>
                <div className="text-[10.5px] mb-1" style={{ color: "#93A5AA" }}>{t.occupiedLabel}</div>
                <input type="number" min={0} value={r.occupied} onChange={e => update(i, "occupied", e.target.value)}
                  style={{ ...inputStyle, padding: "7px 10px", fontSize: 13 }} />
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={() => setRooms([...rooms, { capacity: 4, occupied: 0 }])}
          className="px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5"
          style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
          <Plus size={12} /> {t.addRoomBtn}
        </button>
        <span className="text-[12.5px] font-medium" style={{ color: "#E8B94A" }}>
          {t.freeSpotsTotal}: {totalFree}
        </span>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><div className="text-[12px] mb-1.5" style={{ color: "#93A5AA" }}>{label}</div>{children}</div>;
}

function Toggle({ on, onClick, disabled = false }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} role="switch" aria-checked={!!on} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background: on ? "#3E92B0" : "#2A424C", cursor: disabled ? "default" : "pointer" }}>
      <div className="w-4.5 h-4.5 rounded-full absolute top-[3px] transition-all" style={{ width: 18, height: 18, background: "#F2EDE4", left: on ? 22 : 3 }} />
    </button>
  );
}

function SettingsView({ onBack, lang, setLang, verified, phone, onRequestVerify, onLogout, onDeleteAccount, notify, onTelegramLinked, onTelegramUnlink, onToggleNotify }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const t = STR[lang];

  const doDelete = async () => {
    setDeleting(true); setDeleteError("");
    try { await onDeleteAccount(); }
    catch (e) { setDeleteError(friendlyError(e, t)); setDeleting(false); }
  };

  return (
    <div className="pb-10">
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
        <button onClick={onBack} aria-label={t.backLabel}><ArrowLeft size={19} color="#F2EDE4" /></button>
        <h2 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>{t.settings}</h2>
      </header>
      <div className="p-4 space-y-5">
        <Section icon={Globe} title={t.language}>
          <div className="flex gap-2">
            {LANG_OPTIONS.map(([code, label]) => (
              <button key={code} onClick={() => setLang(code)} className="flex-1 py-2.5 rounded-lg text-[13px] font-medium" style={{ background: lang === code ? "#3E92B0" : "#16262E", color: lang === code ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>{label}</button>
            ))}
          </div>
        </Section>

        {/* Akkaunt: telefon raqami va chiqish */}
        <Section icon={User} title={t.accountSection}>
          <div className="space-y-3">
            {verified ? (
              <Row label={<span className="font-mono" style={{ color: "#F2EDE4" }}>{formatPhone(phone)}</span>}>
                <Badge color="#16262E" bg="#E8B94A">{t.verified}</Badge>
              </Row>
            ) : (
              <Row label={t.phoneNumberLabel}>
                <button onClick={onRequestVerify} className="px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>{t.verifyPhoneBtn}</button>
              </Row>
            )}
            {verified && (
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-medium"
                style={{ background: "#16262E", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                <LogOut size={14} /> {t.logout}
              </button>
            )}
          </div>
        </Section>

        {/* Bildirishnomalar — Telegram orqali (bepul) */}
        <Section icon={Bell} title={t.notifications}>
          <TelegramBlock t={t} lang={lang} verified={verified} notify={notify}
            onLinked={onTelegramLinked} onUnlink={onTelegramUnlink} onToggle={onToggleNotify} onRequestVerify={onRequestVerify} />
        </Section>

        <Section icon={ShieldAlert} title={t.dangerZone}>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="w-full py-2.5 rounded-lg text-[13.5px] font-medium" style={{ background: "transparent", color: "#D4783C", border: "1px solid #D4783C" }}>{t.deleteProfileBtn}</button>
          ) : (
            <div className="space-y-2">
              <p className="text-[12.5px] leading-snug" style={{ color: "#C8D4D6" }}>{t.deleteProfileConfirm}</p>
              {deleteError && <p className="text-[12px]" style={{ color: "#F2C2C2" }}>{deleteError}</p>}
              <div className="grid grid-cols-2 gap-2">
                <button disabled={deleting} onClick={() => setConfirmDelete(false)} className="py-2 rounded-lg text-[13px]" style={{ background: "#2A424C", color: "#F2EDE4" }}>{t.cancel}</button>
                <button disabled={deleting} onClick={doDelete} className="py-2 rounded-lg text-[13px] font-medium" style={{ background: "#D4783C", color: "#16262E", opacity: deleting ? 0.7 : 1 }}>{deleting ? t.deletingProfile : t.confirmDeleteBtn}</button>
              </div>
            </div>
          )}
        </Section>

        <Section icon={ClipboardList} title={t.legalSection}>
          <div className="space-y-2">
            {[[LEGAL_ROUTES.terms, t.termsLink], [LEGAL_ROUTES.privacy, t.privacyLink], [LEGAL_ROUTES.offer, t.offerLink], [LEGAL_ROUTES.about, t.aboutLink]].map(([to, label]) => (
              <Link key={to} to={to} className="flex items-center justify-between py-1"><span className="text-[13px]" style={{ color: "#C8D4D6" }}>{label}</span><ChevronRight size={15} color="#65787E" /></Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// Telegram'ni ulash: bir martalik havola -> botda START -> ilova o'zi tekshirib, "Ulangan" ko'rsatadi
function TelegramBlock({ t, lang, verified, notify, onLinked, onUnlink, onToggle, onRequestVerify }) {
  const [link, setLink] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const linked = !!notify?.linked;

  // Havolani oldindan tayyorlaymiz — tugma oddiy havola bo'ladi (telefonda yangi oyna to'silmaydi)
  useEffect(() => {
    if (!verified || linked) return;
    let cancelled = false;
    setError("");
    callApi("/api/telegram-link", { action: "start", lang })
      .then((d) => { if (!cancelled) setLink(d.url || ""); })
      .catch(() => { if (!cancelled) setError(t.telegramError); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified, linked, lang]);

  // START bosilishini kutamiz: har 3 soniyada (2 daqiqagacha) va ilovaga qaytilganda tekshiramiz
  useEffect(() => {
    if (!waiting) return;
    let stopped = false, tries = 0, inFlight = false;
    const check = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const d = await callApi("/api/telegram-link", { action: "check", lang });
        if (d.linked && !stopped) { stopped = true; setWaiting(false); onLinked(); }
      } catch (_) {}
      inFlight = false;
      if (++tries >= 40 && !stopped) { stopped = true; setWaiting(false); }
    };
    const iv = setInterval(check, 3000);
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", onVisible);
    return () => { stopped = true; clearInterval(iv); window.removeEventListener("focus", check); document.removeEventListener("visibilitychange", onVisible); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting]);

  const unlink = async () => {
    setBusy(true); setError("");
    try { await callApi("/api/telegram-link", { action: "unlink" }); onUnlink(); }
    catch (_) { setError(t.telegramError); }
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#229ED9" }}><Send size={15} color="#FFFFFF" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13.5px] font-medium" style={{ color: "#F2EDE4" }}>{t.telegramTitle}</span>
            <Badge color={linked ? "#16262E" : "#C8D4D6"} bg={linked ? "#8FD19E" : "#2A424C"}>{linked ? t.telegramLinked : t.telegramNotLinked}</Badge>
          </div>
          <p className="text-[12px] mt-1 leading-snug" style={{ color: "#93A5AA" }}>{t.telegramDesc}</p>
        </div>
      </div>

      {!verified ? (
        <div className="rounded-lg p-3 text-[12.5px]" style={{ background: "#16262E", border: "1px solid #2A424C", color: "#C8D4D6" }}>
          {t.telegramNeedVerify}
          <button onClick={onRequestVerify} className="block mt-2 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>{t.verifyPhoneBtn}</button>
        </div>
      ) : !linked ? (
        waiting ? (
          <div role="status" className="rounded-lg p-3 text-[12.5px] flex items-center gap-2.5" style={{ background: "#16262E", border: "1px solid #2A424C", color: "#C8D4D6" }}>
            <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin shrink-0" style={{ borderColor: "#3E92B0", borderTopColor: "transparent" }} />
            {t.telegramWaiting}
          </div>
        ) : (
          <a href={link || undefined} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { if (!link) { e.preventDefault(); return; } setWaiting(true); }}
            aria-disabled={!link}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13.5px] font-semibold"
            style={{ background: link ? "#229ED9" : "#2A424C", color: "#FFFFFF", cursor: link ? "pointer" : "default" }}>
            <Send size={15} /> {t.telegramConnectBtn}
          </a>
        )
      ) : null}

      {error && <p className="text-[12px]" style={{ color: "#F2C2C2" }}>{error}</p>}

      <div className="space-y-3 pt-1" style={{ opacity: linked ? 1 : 0.45 }}>
        <Row label={t.notifyMessagesLabel}><Toggle on={notify.messages} disabled={!linked} onClick={() => onToggle("notify_messages", !notify.messages)} /></Row>
        <Row label={t.notifySearchesLabel}><Toggle on={notify.searches} disabled={!linked} onClick={() => onToggle("notify_searches", !notify.searches)} /></Row>
      </div>

      {linked && (
        <button onClick={unlink} disabled={busy} className="text-[12px] font-medium" style={{ color: "#D4783C" }}>{t.telegramUnlinkBtn}</button>
      )}
    </div>
  );
}

const LANG_OPTIONS = [["uz", "O'zbekcha"], ["ru", "Русский"], ["en", "English"]];

// Sarlavhadagi kichik til tugmasi: ko'rinishi "🌐 RU", bosilganda telefonning o'z ro'yxati ochiladi
function LangPicker({ lang, setLang, label }) {
  return (
    <label className="relative shrink-0 ml-2 h-9 px-2.5 rounded-full flex items-center gap-1 text-[12px] font-semibold cursor-pointer" style={{ ...box, color: "#F2EDE4" }}>
      <Globe size={14} color="#93A5AA" />
      <span aria-hidden="true">{lang.toUpperCase()}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={label}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
        {LANG_OPTIONS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>
    </label>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl p-4" style={box}>
      <div className="flex items-center gap-2 mb-3"><Icon size={16} color="#3E92B0" /><span className="text-[13.5px] font-medium" style={{ color: "#F2EDE4" }}>{title}</span></div>
      {children}
    </div>
  );
}
function Row({ label, children }) {
  return <div className="flex items-center justify-between gap-3"><span className="text-[13px] min-w-0" style={{ color: "#C8D4D6" }}>{label}</span>{children}</div>;
}

const WEEKDAYS_UZ = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
const MONTHS_UZ = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

function toDateStr(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

function MonthGrid({ viewDate, bookedSet, onToggle, t = STR.uz }) {
  const year = viewDate.getFullYear(), monthIndex = viewDate.getMonth();
  const first = new Date(year, monthIndex, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Dushanbadan boshlanadi
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const now = new Date();
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="text-center text-[13px] font-medium mb-2.5" style={{ color: "#F2EDE4" }}>{(t.months || MONTHS_UZ)[monthIndex]} {year}</div>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {(t.weekdays || WEEKDAYS_UZ).map(d => <div key={d} className="text-center text-[10px]" style={{ color: "#65787E" }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateStr = toDateStr(year, monthIndex, d);
          const isPast = dateStr < todayStr;
          const isBooked = bookedSet.has(dateStr);
          const clickable = !!onToggle && !isPast;
          return (
            <button key={i} type="button" disabled={!clickable} onClick={() => onToggle && onToggle(dateStr)}
              className="aspect-square rounded-lg text-[11px] flex items-center justify-center"
              style={{
                background: isBooked ? "#D4783C" : "transparent",
                color: isPast ? "#3A4A50" : isBooked ? "#16262E" : "#C8D4D6",
                border: isPast || isBooked ? "none" : "1px solid #2A424C",
                cursor: clickable ? "pointer" : "default",
              }}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MonthNav({ viewDate, setViewDate }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#16262E", border: "1px solid #2A424C" }}><ChevronLeft size={14} color="#F2EDE4" /></button>
      <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#16262E", border: "1px solid #2A424C" }}><ChevronRight size={14} color="#F2EDE4" /></button>
    </div>
  );
}

// Ijarachi uchun: band kunlarni faqat ko'rsatadi (o'zgartirib bo'lmaydi)
function BookingCalendarView({ listingId, t = STR.uz }) {
  const [bookedSet, setBookedSet] = useState(new Set());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("listing_bookings").select("date").eq("listing_id", listingId);
      if (!error) setBookedSet(new Set((data || []).map(r => r.date)));
      setLoading(false);
    })();
  }, [listingId]);

  if (loading) return null;
  return (
    <div className="rounded-2xl p-4" style={box}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[13px] font-medium flex items-center gap-1.5" style={{ color: "#F2EDE4" }}><Ban size={14} color="#D4783C" /> {t.occupiedDays}</div>
        <MonthNav viewDate={viewDate} setViewDate={setViewDate} />
      </div>
      <MonthGrid viewDate={viewDate} bookedSet={bookedSet} t={t} />
      <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: "#65787E" }}>
        <span className="w-3 h-3 rounded" style={{ background: "#D4783C" }} /> {t.occupiedLegend} <span className="ml-2 w-3 h-3 rounded" style={{ border: "1px solid #2A424C" }} /> {t.freeLegend}
      </div>
    </div>
  );
}

// Uy egasi uchun: band kunlarni belgilash/bekor qilish
// E'lonni tahrirlash oynasi (egasi uchun)
function EditListingModal({ listing, onClose, onSaved, t = STR.uz }) {
  const [form, setForm] = useState({
    title: listing.title || "",
    price: listing.price || "",
    rooms: listing.rooms || 1,
    area: listing.area || "",
    floor: listing.floor || "",
    rentType: listing.rentType || "Oylik",
    desc: listing.desc || "",
    amenities: listing.amenities || [],
    listingMode: listing.listingMode || "whole",
    genderPref: listing.genderPref || "aralash",
    roomsConfig: (listing.roomsConfig && listing.roomsConfig.length) ? listing.roomsConfig : [{ capacity: 4, occupied: 0 }],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Rasmlar: mavjudlari (URL) + yangi qo'shilganlar (fayl)
  const [existingImages, setExistingImages] = useState(listing.images || []);
  const [newImages, setNewImages] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const editFileRef = useRef(null);

  const totalImages = existingImages.length + newImages.length;

  const handleEditFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 8 - totalImages);
    e.target.value = "";
    if (!files.length) return;
    setCompressing(true);
    const next = [];
    for (const raw of files) {
      const file = await compressImage(raw);
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setNewImages(prev => [...prev, ...next]);
    setCompressing(false);
  };

  const toggleAmenity = (a) => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));

  const save = async () => {
    setSaving(true); setError("");

    // Rasmlar o'zgargan bo'lsa — bazadagi ro'yxatni yangilaymiz
    try {
      const removed = (listing.images || []).filter(u => !existingImages.includes(u));
      if (removed.length) {
        await supabase.from("listing_images").delete().eq("listing_id", listing.id).in("url", removed);
      }
      if (newImages.length) {
        const uploaded = [];
        for (let i = 0; i < newImages.length; i++) {
          const img = newImages[i];
          const stamp = `${Date.now()}_${i}`;
          const { full, thumb } = await makeImageVariants(img.file);

          const fullPath = `${listing.ownerId}/${listing.id}/${stamp}.jpg`;
          const { error: e1 } = await supabase.storage.from("listing-images").upload(fullPath, full);
          if (e1) throw e1;

          const thumbPath = `${listing.ownerId}/${listing.id}/${stamp}_t.jpg`;
          const { error: e2 } = await supabase.storage.from("listing-images").upload(thumbPath, thumb);
          if (e2) throw e2;

          uploaded.push({
            url: supabase.storage.from("listing-images").getPublicUrl(fullPath).data.publicUrl,
            thumb_url: supabase.storage.from("listing-images").getPublicUrl(thumbPath).data.publicUrl,
          });
        }
        const startPos = existingImages.length;
        await supabase.from("listing_images").insert(
          uploaded.map((u, i) => ({ listing_id: listing.id, url: u.url, thumb_url: u.thumb_url, position: startPos + i }))
        );
        existingImages.push(...uploaded.map(u => u.url));
      }
    } catch (imgErr) {
      setSaving(false);
      setError(friendlyError(imgErr, t, "photosUpdateError"));
      return;
    }

    const { error: err } = await supabase.from("listings").update({
      title: form.title,
      price: Number(form.price),
      rooms: Number(form.rooms),
      area: Number(form.area),
      floor: form.floor,
      rent_type: form.rentType,
      description: form.desc,
      amenities: form.amenities,
      listing_mode: form.listingMode,
      gender_pref: form.listingMode === "shared" ? form.genderPref : null,
      rooms_config: form.listingMode === "shared" ? form.roomsConfig : [],
      free_spots: form.listingMode === "shared" ? countFreeSpots(form.roomsConfig) : 0,
    }).eq("id", listing.id);
    setSaving(false);
    if (err) { setError(friendlyError(err, t)); return; }
    // Tasdiqlangan e'lonning sarlavhasi, tavsifi yoki rasmi o'zgarsa — server uni qayta tekshiruvga yuboradi
    const resubmitted = listing.status === "approved" &&
      (form.title !== listing.title || form.desc !== (listing.desc || "") || newImages.length > 0);
    onSaved({
      ...listing, ...form,
      price: Number(form.price), rooms: Number(form.rooms), area: Number(form.area),
      images: existingImages,
      freeSpots: form.listingMode === "shared" ? countFreeSpots(form.roomsConfig) : 0,
      status: resubmitted ? "pending" : listing.status,
      resubmitted,
    });
    onClose();
  };

  const valid = form.title && form.price && form.area && totalImages >= 3 && !saving && !compressing;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>{t.editTitle}</h3>
          <button onClick={onClose} aria-label={t.closeLabel}><X size={20} color="#93A5AA" /></button>
        </div>

        {error && <p className="text-[12.5px] mb-3" style={{ color: "#D4783C" }}>{error}</p>}

        <div className="space-y-3.5">
          <Field label={t.titleLabel}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t.rentTypeLabel}>
              <div className="flex rounded-lg p-0.5" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
                {[["Oylik", t.monthly], ["Kunlik", t.daily]].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setForm(f => ({ ...f, rentType: val }))} className="flex-1 py-2 rounded-md text-[12.5px] font-medium"
                    style={{ background: form.rentType === val ? "#3E92B0" : "transparent", color: form.rentType === val ? "#0E1B21" : "#93A5AA" }}>{label}</button>
                ))}
              </div>
            </Field>
            <Field label={form.listingMode === "shared" ? t.pricePerPersonLabel : t.priceLabelSom}>
              <input type="number" inputMode="numeric" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} />
            </Field>
          </div>

          <Field label={t.modeLabel}>
            <div className="grid grid-cols-2 gap-2">
              {[["whole", t.modeWhole], ["shared", t.modeShared]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => setForm(f => ({ ...f, listingMode: val }))}
                  className="py-2 rounded-lg text-[12.5px] font-medium"
                  style={{ background: form.listingMode === val ? "#3E92B0" : "#16262E", color: form.listingMode === val ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>
                  {label}
                </button>
              ))}
            </div>
          </Field>

          {form.listingMode === "shared" && (
            <>
              <Field label={t.roomsConfigLabel}>
                <RoomsEditor rooms={form.roomsConfig} setRooms={(rc) => setForm(f => ({ ...f, roomsConfig: rc }))} t={t} />
              </Field>
              <Field label={t.genderLabel}>
                <div className="grid grid-cols-3 gap-2">
                  {[["erkak", t.genderMale], ["ayol", t.genderFemale], ["aralash", t.genderMixed]].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setForm(f => ({ ...f, genderPref: val }))}
                      className="py-2 rounded-lg text-[12.5px] font-medium"
                      style={{ background: form.genderPref === val ? "#D4783C" : "#16262E", color: form.genderPref === val ? "#16262E" : "#93A5AA", border: "1px solid #2A424C" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          <div className="grid grid-cols-3 gap-3">
            <Field label={t.roomsHeader}><input type="number" min={1} value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))} style={inputStyle} /></Field>
            <Field label={t.areaLabelM2}><input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} style={inputStyle} /></Field>
            <Field label={t.floorLabel}><input value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} style={inputStyle} /></Field>
          </div>

          <Field label={t.amenitiesLabel}>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className="px-3 py-1.5 rounded-full text-[12px]"
                  style={{ background: form.amenities.includes(a) ? "#D4783C" : "#16262E", color: form.amenities.includes(a) ? "#16262E" : "#93A5AA", border: "1px solid #2A424C" }}>{amenityLabel(a, t)}</button>
              ))}
            </div>
          </Field>

          <Field label={t.descLabel}>
            <textarea rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ ...inputStyle, resize: "none" }} />
          </Field>

          <Field label={tn(t, "photosCountN", totalImages)}>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((url, i) => (
                <div key={url} className="w-16 h-16 rounded-lg overflow-hidden relative">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#D4783C" }}>
                    <Trash2 size={11} color="#16262E" />
                  </button>
                </div>
              ))}
              {newImages.map((img, i) => (
                <div key={img.url} className="w-16 h-16 rounded-lg overflow-hidden relative" style={{ border: "1.5px solid #E8B94A" }}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setNewImages(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); })}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#D4783C" }}>
                    <Trash2 size={11} color="#16262E" />
                  </button>
                </div>
              ))}
              {totalImages < 8 && (
                <button type="button" onClick={() => editFileRef.current?.click()} disabled={compressing}
                  className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1" style={{ border: "1.5px dashed #3E5560", color: "#93A5AA" }}>
                  {compressing
                    ? <span className="text-[9.5px] text-center leading-tight px-1">{t.preparingPhotos}</span>
                    : <><Camera size={18} /><span className="text-[10px]">{t.addPhotoBtn}</span></>}
                </button>
              )}
              <input ref={editFileRef} type="file" accept="image/*" multiple hidden onChange={handleEditFiles} />
            </div>
          </Field>
        </div>

        <button onClick={save} disabled={!valid} className="w-full mt-4 py-3 rounded-xl font-medium text-[14.5px]"
          style={{ background: valid ? "#3E92B0" : "#2A424C", color: valid ? "#0E1B21" : "#65787E" }}>
          {saving ? t.savingBtn : t.saveBtn}
        </button>
      </div>
    </div>
  );
}

// E'lonni o'chirishni tasdiqlash oynasi
function DeleteConfirmModal({ listing, onClose, onDeleted, t = STR.uz }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const doDelete = async () => {
    setDeleting(true); setError("");
    // Avval bog'liq yozuvlarni, keyin e'lonning o'zini o'chiramiz
    await supabase.from("listing_images").delete().eq("listing_id", listing.id);
    await supabase.from("listing_bookings").delete().eq("listing_id", listing.id);
    const { error: err } = await supabase.from("listings").delete().eq("id", listing.id);
    setDeleting(false);
    if (err) { setError(friendlyError(err, t)); return; }
    onDeleted(listing.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-serif text-lg flex items-center gap-2" style={{ color: "#F2EDE4" }}><Trash2 size={17} color="#D4783C" /> {t.deleteConfirmTitle}</h3>
          <button onClick={onClose} aria-label={t.closeLabel}><X size={20} color="#93A5AA" /></button>
        </div>
        <p className="text-[13.5px] mb-1.5" style={{ color: "#F2EDE4" }}>{listing.title}</p>
        <p className="text-[12.5px] mb-4" style={{ color: "#93A5AA" }}>{t.deleteConfirmBody}</p>
        {error && <p className="text-[12.5px] mb-3" style={{ color: "#D4783C" }}>{error}</p>}
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={onClose} className="py-2.5 rounded-lg font-medium text-[13.5px]" style={{ background: "#2A424C", color: "#F2EDE4" }}>{t.cancelBtn}</button>
          <button onClick={doDelete} disabled={deleting} className="py-2.5 rounded-lg font-medium text-[13.5px]" style={{ background: "#D4783C", color: "#16262E" }}>
            {deleting ? t.savingBtn : t.confirmDeleteBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingEditorModal({ listingId, onClose, t = STR.uz }) {
  const [original, setOriginal] = useState(new Set());
  const [localBooked, setLocalBooked] = useState(new Set());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("listing_bookings").select("date").eq("listing_id", listingId);
      if (!error) {
        const set = new Set((data || []).map(r => r.date));
        setOriginal(set);
        setLocalBooked(new Set(set));
      }
    })();
  }, [listingId]);

  const toggle = (dateStr) => setLocalBooked(prev => { const next = new Set(prev); next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr); return next; });

  const save = async () => {
    setSaving(true);
    const toAdd = [...localBooked].filter(d => !original.has(d));
    const toRemove = [...original].filter(d => !localBooked.has(d));
    if (toAdd.length) await supabase.from("listing_bookings").insert(toAdd.map(date => ({ listing_id: listingId, date })));
    if (toRemove.length) await supabase.from("listing_bookings").delete().eq("listing_id", listingId).in("date", toRemove);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>{t.bookingEditTitle}</h3>
          <button onClick={onClose} aria-label={t.closeLabel}><X size={20} color="#93A5AA" /></button>
        </div>
        <p className="text-[12px] mb-3" style={{ color: "#93A5AA" }}>{t.bookingEditHint}</p>
        <MonthNav viewDate={viewDate} setViewDate={setViewDate} />
        <MonthGrid viewDate={viewDate} bookedSet={localBooked} onToggle={toggle} t={t} />
        <button onClick={save} disabled={saving} className="w-full mt-4 py-2.5 rounded-lg font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>{saving ? t.savingBtn : t.saveBtn}</button>
      </div>
    </div>
  );
}

// Barcha xarita pin'lari uchun oddiy, rasm-siz belgi (Leaflet standart iconlariga muhtoj emas)
function dotIcon(color = "#D4783C") {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;background:${color};border:2.5px solid #16262E;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// Narxni xaritada sig'adigan qisqa shaklga o'giradi: 4200000 -> "4.2mln" / "4,2 млн" / "4.2M"
function shortPrice(price, t = STR.uz) {
  const dec = (x) => (t._lang === "ru" ? String(x).replace(".", ",") : String(x));
  if (price >= 1000000) {
    const m = price / 1000000;
    return dec(Number.isInteger(m) ? m : m.toFixed(1)) + t.mln;
  }
  if (price >= 1000) return Math.round(price / 1000) + t.thousand;
  return String(price);
}

// E'lon pin'lari uchun — narx to'g'ridan-to'g'ri ko'rinadigan yorliq (Airbnb uslubida)
// Bir joyga to'plangan e'lonlar uchun guruh belgisi
function clusterIcon(count) {
  return L.divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-50%);width:38px;height:38px;border-radius:50%;background:#D4783C;border:2.5px solid #16262E;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:#16262E;font-weight:700;font-size:14px;cursor:pointer;">${count}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function priceIcon(price, boosted, t) {
  const bg = boosted ? "#D4783C" : "#E8B94A";
  return L.divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-100%);white-space:nowrap;display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:6px;margin:-6px;">
      <div style="background:${bg};color:#16262E;font-weight:700;font-size:12px;padding:5px 11px;border-radius:14px;box-shadow:0 2px 6px rgba(0,0,0,0.35);border:1.5px solid #16262E;">${shortPrice(price, t)}</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${bg};margin-top:-1px;"></div>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// ---- OpenStreetMap (zaxira, kalit talab qilmaydi) ----
function OsmMapPicker({ lat, lng, onChange }) {
  const ref = useRef(null);
  const mapObj = useRef(null);

  useEffect(() => {
    if (!ref.current || mapObj.current) return;
    const center = [lat || TASHKENT_CENTER[0], lng || TASHKENT_CENTER[1]];
    const map = L.map(ref.current, { center, zoom: 16 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapObj.current = map;

    // Xarita to'xtaganda markaz koordinatasini olamiz (belgi doim markazda turadi)
    map.on("moveend", () => {
      const c = map.getCenter();
      onChange(c.lat, c.lng);
    });
    onChange(center[0], center[1]);

    const refresh = () => { try { map.invalidateSize(); } catch (_) {} };
    refresh();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    if (ro) ro.observe(ref.current);
    window.addEventListener("orientationchange", refresh);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("orientationchange", refresh);
      map.remove();
      mapObj.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} style={{ width: "100%", height: 240, borderRadius: 12, overflow: "hidden", background: "#16262E" }} />
      <CenterPin />
    </div>
  );
}

function OsmMapListView({ listings, onOpen, userLoc, t }) {
  const ref = useRef(null);
  const mapObj = useRef(null);
  const layerRef = useRef(null);
  const meMarker = useRef(null);
  const [zoomTick, setZoomTick] = useState(0); // zoom o'zgarganda guruhlarni qayta hisoblash uchun

  useEffect(() => {
    if (!ref.current) return;
    const withCoords = listings.filter(l => l.lat && l.lng);
    const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : TASHKENT_CENTER;
    if (!mapObj.current) {
      const map = L.map(ref.current, { center, zoom: 11 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      mapObj.current = map;
    }
    if (layerRef.current) mapObj.current.removeLayer(layerRef.current);
    const group = L.layerGroup();
    // Yaqin joylashganlarni guruhlaymiz (zoom darajasiga qarab)
    const zoom = mapObj.current.getZoom();
    const cellSize = zoom >= 15 ? 0.0004 : zoom >= 13 ? 0.002 : 0.01;
    const buckets = {};
    withCoords.forEach(l => {
      const key = `${Math.round(l.lat / cellSize)}_${Math.round(l.lng / cellSize)}`;
      (buckets[key] = buckets[key] || []).push(l);
    });

    Object.values(buckets).forEach(items => {
      if (items.length === 1) {
        const l = items[0];
        const marker = L.marker([l.lat, l.lng], { icon: priceIcon(l.price, l.boosted, t) });
        marker.on("click", () => onOpen(l));
        marker.addTo(group);
      } else {
        // Guruh markazi
        const lat = items.reduce((s, x) => s + x.lat, 0) / items.length;
        const lng = items.reduce((s, x) => s + x.lng, 0) / items.length;
        const marker = L.marker([lat, lng], { icon: clusterIcon(items.length) });
        marker.on("click", () => {
          // Bosilganda shu joyga yaqinlashadi — guruh yoyiladi
          mapObj.current.setView([lat, lng], Math.min(mapObj.current.getZoom() + 3, 18));
        });
        marker.addTo(group);
      }
    });
    group.addTo(mapObj.current);
    layerRef.current = group;
    return () => {};
  }, [listings, zoomTick, t]);

  // Zoom o'zgarganda guruhlar qayta hisoblanadi
  useEffect(() => {
    if (!mapObj.current) return;
    const onZoom = () => setZoomTick(n => n + 1);
    mapObj.current.on("zoomend", onZoom);
    return () => { if (mapObj.current) mapObj.current.off("zoomend", onZoom); };
  }, [zoomTick]);

  // "Mening joylashuvim" bosilganda — xaritani o'sha joyga suradi va ko'k belgi qo'yadi
  useEffect(() => {
    if (!userLoc || !mapObj.current) return;
    mapObj.current.setView(userLoc, 15);
    if (meMarker.current) mapObj.current.removeLayer(meMarker.current);
    meMarker.current = L.marker(userLoc, { icon: dotIcon("#3E92B0") }).addTo(mapObj.current);
  }, [userLoc]);

  useEffect(() => () => { if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; } }, []);

  return <div ref={ref} style={{ width: "100%", height: "calc(100vh - 210px)", touchAction: "none" }} />;
}

function OsmMapStatic({ lat, lng, addressTitle = "Manzil" }) {
  const ref = useRef(null);
  const mapObj = useRef(null);

  useEffect(() => {
    if (!ref.current || !lat || !lng || mapObj.current) return;
    const map = L.map(ref.current, { center: [lat, lng], zoom: 15, dragging: false, scrollWheelZoom: false, zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    L.marker([lat, lng], { icon: dotIcon() }).addTo(map);
    mapObj.current = map;
    return () => { if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; } };
  }, [lat, lng]);

  if (!lat || !lng) return null;
  return (
    <div>
      <div className="text-[13px] font-medium mb-2" style={{ color: "#F2EDE4" }}>{addressTitle}</div>
      <div ref={ref} style={{ width: "100%", height: 160, borderRadius: 12, overflow: "hidden", background: "#16262E", touchAction: "none" }} />
    </div>
  );
}

// ---- Yandex Maps (kalit sozlangan bo'lsa ishlatiladi, aniqroq xarita) ----
// Xarita markazida turadigan belgi (Yandex Go / Uber uslubi).
// Foydalanuvchi xaritani suradi, belgi doim markazda — bosish kerak emas,
// shuning uchun "bosgan joyim emas" degan xato umuman bo'lmaydi.
function CenterPin() {
  return (
    <>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -100%)",
        pointerEvents: "none", zIndex: 500,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "#D4783C", border: "3px solid #F2EDE4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
        }} />
        <div style={{
          width: 2, height: 12, background: "#F2EDE4",
          margin: "0 auto", boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }} />
      </div>
    </>
  );
}

function YandexMapPicker({ lat, lng, onChange, onFail }) {
  const ref = useRef(null);
  const objs = useRef({});

  useEffect(() => {
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !ref.current) return;
      const center = [lat || TASHKENT_CENTER[0], lng || TASHKENT_CENTER[1]];
      const map = new ymaps.Map(ref.current, { center, zoom: 16, controls: ["zoomControl"] });

      // Xarita to'xtaganda markaz koordinatasini olamiz
      map.events.add("actionend", () => {
        const c = map.getCenter();
        onChange(c[0], c[1]);
      });

      // Boshlang'ich qiymatni ham darhol yozib qo'yamiz
      onChange(center[0], center[1]);

      const refresh = () => { try { map.container.fitToViewport(); } catch (_) {} };
      refresh();
      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
      if (ro && ref.current) ro.observe(ref.current);
      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);

      objs.current = { map, cleanup: () => {
        if (ro) ro.disconnect();
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
      } };
    }).catch(() => onFail());
    return () => {
      cancelled = true;
      if (objs.current.cleanup) objs.current.cleanup();
      if (objs.current.map) objs.current.map.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} style={{ width: "100%", height: 240, borderRadius: 12, overflow: "hidden", background: "#16262E" }} />
      <CenterPin />
    </div>
  );;
}

function YandexMapListView({ listings, onOpen, onFail, userLoc, t }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const meMarkRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !ref.current) return;
      const withCoords = listings.filter(l => l.lat && l.lng);
      const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : TASHKENT_CENTER;
      const map = new ymaps.Map(ref.current, { center, zoom: 11, controls: ["zoomControl"] });
      // Yaqin joylashgan pinlarni guruhlaymiz — aks holda ular bir-birini yopadi
      const clusterer = new ymaps.Clusterer({
        preset: "islands#invertedOrangeClusterIcons",
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        gridSize: 64,
      });
      const placemarks = withCoords.map(l => {
        const pm = new ymaps.Placemark([l.lat, l.lng],
          { iconContent: shortPrice(l.price, t) },
          {
            preset: l.boosted ? "islands#orangeStretchyIcon" : "islands#darkOrangeStretchyIcon",
            hasBalloon: false,
            hasHint: false,
            cursor: "pointer",
          });
        pm.events.add("click", (e) => { e.preventDefault(); onOpen(l); });
        return pm;
      });
      clusterer.add(placemarks);
      map.geoObjects.add(clusterer);
      mapRef.current = map;
    }).catch(() => onFail());
    return () => { cancelled = true; if (mapRef.current) mapRef.current.destroy(); };
  }, [listings, t]);

  // "Mening joylashuvim" bosilganda — xaritani o'sha joyga suradi va ko'k belgi qo'yadi
  useEffect(() => {
    if (!userLoc || !mapRef.current || !window.ymaps) return;
    mapRef.current.setCenter(userLoc, 15);
    if (meMarkRef.current) mapRef.current.geoObjects.remove(meMarkRef.current);
    meMarkRef.current = new window.ymaps.Placemark(userLoc, {}, { preset: "islands#blueCircleIcon" });
    mapRef.current.geoObjects.add(meMarkRef.current);
  }, [userLoc]);

  return <div ref={ref} style={{ width: "100%", height: "calc(100vh - 210px)", touchAction: "none" }} />;
}

function YandexMapStatic({ lat, lng, onFail, addressTitle = "Manzil" }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !ref.current) return;
      const map = new ymaps.Map(ref.current, { center: [lat, lng], zoom: 15, controls: [] });
      map.behaviors.disable(["drag", "scrollZoom"]);
      map.geoObjects.add(new ymaps.Placemark([lat, lng], {}, { preset: "islands#orangeDotIcon" }));
      mapRef.current = map;
    }).catch(() => onFail());
    return () => { cancelled = true; if (mapRef.current) mapRef.current.destroy(); };
  }, [lat, lng]);

  if (!lat || !lng) return null;
  return (
    <div>
      <div className="text-[13px] font-medium mb-2" style={{ color: "#F2EDE4" }}>{addressTitle}</div>
      <div ref={ref} style={{ width: "100%", height: 160, borderRadius: 12, overflow: "hidden", background: "#16262E", touchAction: "none" }} />
    </div>
  );
}

// ---- Tashqi qatlam: kalit bo'lsa Yandex, bo'lmasa (yoki yuklashda xato bo'lsa) OpenStreetMap ----
function MapPicker(props) {
  const [useOsm, setUseOsm] = useState(!YANDEX_MAPS_API_KEY);
  return useOsm ? <OsmMapPicker {...props} /> : <YandexMapPicker {...props} onFail={() => setUseOsm(true)} />;
}
// Xaritada pin bosilganda pastdan chiqadigan kartochka
function MapPreviewCard({ item, onOpen, onClose, isFav, onToggleFav, t }) {
  if (!item) return null;
  return (
    <div className="absolute left-3 right-3 rounded-2xl overflow-hidden shadow-2xl"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)", zIndex: 1200, background: "#1E333C", border: "1px solid #2A424C" }}>
      <div className="flex">
        <div className="w-28 h-28 shrink-0 relative flex items-center justify-center"
          style={item.images?.length ? { background: "#0E1B21" } : { background: `linear-gradient(135deg, hsl(${item.hue} 45% 28%), hsl(${item.hue + 30} 40% 18%))` }}>
          {item.images?.length
            ? <img src={item.thumbs?.[0] || item.images[0]} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            : <Building2 size={30} color="rgba(242,237,228,0.35)" strokeWidth={1.3} />}
          {item.boosted && (
            <div className="absolute top-0 left-0 px-2 py-0.5 text-[9.5px] font-semibold flex items-center gap-0.5"
              style={{ background: "#D4783C", color: "#16262E" }}>
              <Sparkles size={9} /> TOP
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <PriceTag price={item.price} rentType={item.rentType} perPerson={item.listingMode === "shared"} t={t} />
              <button onClick={onClose} aria-label={t.closeLabel} className="shrink-0 -mt-0.5 -mr-0.5 p-1"><X size={16} color="#93A5AA" /></button>
            </div>
            <div className="font-serif text-[14.5px] leading-snug mt-1 truncate" style={{ color: "#F2EDE4" }}>{item.title}</div>
            <div className="flex items-center gap-1 text-[11.5px] mt-0.5 truncate" style={{ color: "#93A5AA" }}>
              <MapPin size={11} className="shrink-0" /> <span className="truncate">{placeLabel(item.district, t)}, {placeLabel(item.city, t)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-2.5 text-[11.5px]" style={{ color: "#93A5AA" }}>
              <span className="flex items-center gap-1"><BedDouble size={12} /> {item.rooms}</span>
              <span className="flex items-center gap-1"><Maximize2 size={12} /> {item.area} {t.sqm}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => onToggleFav(item.id)} aria-label={t.favLabel} aria-pressed={!!isFav} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#16262E" }}>
                <Heart size={13} fill={isFav ? "#D4783C" : "none"} color={isFav ? "#D4783C" : "#93A5AA"} />
              </button>
              <button onClick={() => onOpen(item)} className="px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>
                {t?.detailBtn || "Batafsil"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapListView(props) {
  const { listings, onOpen, favs, onToggleFav, t } = props;
  const [useOsm, setUseOsm] = useState(!YANDEX_MAPS_API_KEY);
  const [userLoc, setUserLoc] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [preview, setPreview] = useState(null); // pin bosilganda ko'rinadigan e'lon

  // Ro'yxat o'zgarsa (filtr almashsa), ochiq kartochkani yopamiz
  useEffect(() => {
    if (preview && !listings.some(l => l.id === preview.id)) setPreview(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

  const findMe = () => {
    if (!navigator.geolocation) { setLocateError(t?.geoUnsupported || "Bu qurilma joylashuvni aniqlay olmaydi"); return; }
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc([pos.coords.latitude, pos.coords.longitude]); setLocating(false); },
      () => { setLocating(false); setLocateError(t?.geoDenied || "Joylashuvga ruxsat berilmadi"); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Pin bosilganda — darhol ochish o'rniga, avval kartochkani ko'rsatamiz
  const mapProps = { ...props, onOpen: (l) => setPreview(l), userLoc };

  return (
    <div className="relative">
      {useOsm
        ? <OsmMapListView {...mapProps} />
        : <YandexMapListView {...mapProps} onFail={() => setUseOsm(true)} />}

      <button onClick={findMe} disabled={locating} aria-label={t?.myLocationLabel}
        className="absolute right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: "#3E92B0", zIndex: 1000, bottom: preview ? "calc(env(safe-area-inset-bottom, 0px) + 160px)" : "calc(env(safe-area-inset-bottom, 0px) + 20px)", transition: "bottom 0.2s" }}>
        <LocateFixed size={20} color="#0E1B21" />
      </button>

      {locateError && (
        <div className="absolute bottom-20 right-3 px-3 py-2 rounded-lg text-[11.5px]" style={{ background: "#1E333C", color: "#F2EDE4", zIndex: 1000, maxWidth: 200 }}>
          {locateError}
        </div>
      )}

      <MapPreviewCard
        item={preview}
        onOpen={onOpen}
        onClose={() => setPreview(null)}
        isFav={favs?.has(preview?.id)}
        onToggleFav={onToggleFav}
        t={t}
      />
    </div>
  );
}
function MapStatic(props) {
  const [useOsm, setUseOsm] = useState(!YANDEX_MAPS_API_KEY);
  return useOsm ? <OsmMapStatic {...props} /> : <YandexMapStatic {...props} onFail={() => setUseOsm(true)} />;
}

function describeSavedSearch(s, t) {
  const parts = [placeLabel(s.city, t)];
  if (s.rent_type === "Kunlik") parts.push(t.daily);
  else if (s.rent_type === "Oylik") parts.push(t.monthly);
  if (s.property_type && s.property_type !== "Barchasi") parts.push(typeLabel(s.property_type, t).split(" / ")[0]);
  if (s.rooms && s.rooms !== "Barchasi") parts.push(s.rooms === "4+" ? tn(t, "roomsN", 4).replace(fmt(4, t), "4+") : tn(t, "roomsN", Number(s.rooms)));
  const p = (v) => `${fmt(v, t)} ${t.currency}`;
  if (s.min_price && s.max_price) parts.push(`${fmt(s.min_price, t)}–${p(s.max_price)}`);
  else if (s.min_price) parts.push(tf(t, "priceFromP", { p: p(s.min_price) }));
  else if (s.max_price) parts.push(tf(t, "priceToP", { p: p(s.max_price) }));
  return parts.join(" · ");
}

const TAB_PATHS = { browse: "/", chats: "/xabarlar", post: "/elon-berish", favs: "/sevimli", profile: "/profil" };
const pathToTab = (path) => {
  if (path.startsWith("/xabarlar")) return "chats";
  if (path.startsWith("/elon-berish")) return "post";
  if (path.startsWith("/sevimli")) return "favs";
  if (path.startsWith("/profil")) return "profile";
  return "browse";
};

export default function Uy247App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Diqqat: bu qasddan useParams() emas — /elon/:id alohida <Route> bo'lsa, undan boshqa
  // yo'lga qaytganda butun komponent qayta o'rnatilib (remount), barcha state (e'lonlar,
  // chatlar, sevimlilar) yo'qolib qolar edi. Shu sabab hammasi bitta "/*" route ostida
  // ishlaydi va id shu yerda pathname'dan qo'lda ajratib olinadi.
  const routeListingId = useMemo(() => {
    const m = location.pathname.match(/^\/elon\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }, [location.pathname]);
  const [tab, setTab] = useState(() => pathToTab(window.location.pathname));
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [userId, setUserId] = useState(null);
  const [filters, setFilters] = useState({ city: CITIES[0], rentType: "Barchasi", propertyType: "Barchasi", sortBy: "new", min: "", max: "", rooms: "Barchasi", listingMode: "Barchasi", minFreeSpots: "Barchasi", gender: "Barchasi" });
  const [selected, setSelected] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [verified, setVerified] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  // Til: avval tanlangani, bo'lmasa brauzer tilidan (rus brauzer — ruscha, chet ellik — inglizcha)
  const [lang, setLang] = useState(() => { const l = detectLang(); return STR[l] ? l : "uz"; });

  useEffect(() => {
    try { localStorage.setItem("uy247_lang", lang); } catch (_) {}
    // Brauzer "tarjima qilaymi?" deb so'ramasligi va ekran o'quvchilar to'g'ri talaffuz qilishi uchun
    try { document.documentElement.lang = lang; document.title = STR[lang].appTitle; } catch (_) {}
  }, [lang]);
  const [showSettings, setShowSettings] = useState(false);
  const [reports, setReports] = useState([]);
  const [revenue, setRevenue] = useState(340000);
  const [boostTarget, setBoostTarget] = useState(null);
  // Telegram bildirishnomalari holati (profiles jadvalidan)
  const [notify, setNotify] = useState({ linked: false, messages: true, searches: true });
  const [chats, setChats] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [refCode] = useState(() => new URLSearchParams(window.location.search).get("ref"));
  const [profile, setProfile] = useState({ referralCode: "", boostCredits: 0, fullName: "" });
  const [ownerStats, setOwnerStats] = useState({});
  const [savedSearches, setSavedSearches] = useState([]);
  const [bookingEditorId, setBookingEditorId] = useState(null);
  // Qisqa xabar (toast) — bir necha soniyadan keyin o'zi yo'qoladi
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const tm = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(tm);
  }, [notice]);
  // Admin bu foydalanuvchini bloklagan bo'lsa
  const [accountBlocked, setAccountBlocked] = useState(false);
  // Huquqiy hujjatlarning joriy tahririga rozilik: null — noma'lum, false — so'rash kerak, true — rozi
  const [legalOk, setLegalOk] = useState(null);
  // Admin yoqsa (app_settings jadvali) — e'lon joylash uchun tasdiqlangan raqam shart
  const [requirePhoneToPost, setRequirePhoneToPost] = useState(false);
  // Ro'yxatni bo'lib-bo'lib ko'rsatamiz (bir vaqtda yuzlab kartochka chizilsa telefon sekinlashadi)
  const PAGE_SIZE = 24;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Har bir suhbat oxirgi marta qachon ochilgani (o'qilmagan xabarlarni aniqlash uchun)
  const [lastSeen, setLastSeen] = useState(() => {
    try { return JSON.parse(localStorage.getItem("uy247_last_seen") || "{}"); } catch (_) { return {}; }
  });
  // Har bir suhbatda nechta o'qilmagan xabar borligi
  const unreadByChat = useMemo(() => {
    const res = {};
    for (const [listingId, chat] of Object.entries(chats)) {
      const seenAt = lastSeen[listingId];
      const count = (chat.messages || []).filter(m =>
        m.from !== "me" && m.createdAt && (!seenAt || new Date(m.createdAt) > new Date(seenAt))
      ).length;
      if (count > 0) res[listingId] = count;
    }
    return res;
  }, [chats, lastSeen]);

  const totalUnread = useMemo(
    () => Object.values(unreadByChat).reduce((s, n) => s + n, 0),
    [unreadByChat]
  );

  const markChatSeen = (listingId) => {
    setLastSeen(prev => {
      const next = { ...prev, [listingId]: new Date().toISOString() };
      try { localStorage.setItem("uy247_last_seen", JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };
  const [editingListing, setEditingListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(null);
  const [viewMode, setViewMode] = useState("map");
  const t = STR[lang];

  const switchTab = (id) => { setTab(id); setSelected(null); navigate(TAB_PATHS[id]); };

  // Tugma bosilganda e'lonni ochish: bir zumda ko'rsatish (agar ro'yxatda bo'lsa) + havolani yangilash
  const openListing = (item) => {
    setSelected(item);
    navigate(`/elon/${item.id}`);
    incrementView(item);
  };

  // Egasining raqamini e'lon ochilganda birma-bir olib kelamiz
  // Egasining raqami — faqat "Raqamni ko'rsatish" bosilganda so'raladi.
  // Server: faqat telefoni tasdiqlanganlarga, kuniga 40 ta e'longacha (raqam yig'ishdan himoya).
  const fetchOwnerPhone = async (item) => {
    if (!item || item.mine || item.ownerPhone) return;
    const { data, error } = await supabase.rpc("get_owner_phone", { p_listing_id: item.id });
    if (error) {
      const m = error.message || "";
      if (m.includes("DAILY_LIMIT")) setNotice(t.phoneLimitReached);
      else if (m.includes("NOT_VERIFIED")) setShowVerify(true);
      else if (m.includes("BLOCKED")) setNotice(t.accountBlockedTitle);
      else setNotice(t.boostRequestError);
      return;
    }
    if (!data) { setNotice(t.phoneUnavailable); return; }
    const phone = data.startsWith("+") ? data : "+" + data;
    setSelected(prev => prev && prev.id === item.id ? { ...prev, ownerPhone: phone } : prev);
    setListings(ls => ls.map(l => l.id === item.id ? { ...l, ownerPhone: phone } : l));
  };
  const closeListing = () => { setSelected(null); navigate(TAB_PATHS[tab] || "/"); };

  // Bazadagi qatorni ilova ishlatadigan shaklga o'giradi
  const mapRow = (row, myId) => {
    const sortedImgs = (row.listing_images || []).slice().sort((a, b) => (a.position || 0) - (b.position || 0));
    const imgs = sortedImgs.map(i => i.url);
    // Kichik nusxalar — ro'yxat va xarita uchun (yo'q bo'lsa kattasi ishlatiladi)
    const thumbs = sortedImgs.map(i => i.thumb_url || i.url);
    let hash = 0;
    for (const ch of String(row.id)) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
    return {
      id: row.id, title: row.title, city: row.city, district: row.district,
      rooms: row.rooms, area: row.area, floor: row.floor, rentType: row.rent_type,
      price: row.price, amenities: row.amenities || [], desc: row.description,
      verified: row.verified, status: row.status, views: row.views || 0,
      // Top faqat muddati o'tmagan bo'lsa amal qiladi
      boosted: !!row.boosted && (!row.boost_until || new Date(row.boost_until) > new Date()),
      boostUntil: row.boost_until || null,
      mine: row.owner_id === myId, images: imgs, thumbs, hue: hash,
      listingMode: row.listing_mode || "whole",
      genderPref: row.gender_pref || null,
      roomsConfig: Array.isArray(row.rooms_config) ? row.rooms_config : [],
      freeSpots: row.free_spots || 0,
      ownerPhone: null, ownerId: row.owner_id, propertyType: row.property_type || "kvartira",
      lat: row.lat ? Number(row.lat) : null, lng: row.lng ? Number(row.lng) : null,
      isOccupied: !!row.is_occupied,
      blockReason: row.block_reason || "",
    };
  };

  // E'lonlarni bo'lak-bo'lak yuklaymiz: birinchi bo'lak darhol ko'rinadi,
  // qolgani orqa fonda yuklanadi. Shunday qilib 500 ta chegara yo'q,
  // lekin sahifa ham tez ochiladi.
  const BATCH = 300;
  const MAX_TOTAL = 3000; // aql bovar qiladigan yuqori chegara

  const fetchListings = async (myId) => {
    setLoadingListings(true);

    const fetchBatch = async (from) => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, listing_images(url, thumb_url, position)")
        .order("boosted", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, from + BATCH - 1);
      if (error) { console.error("E'lonlarni yuklashda xato:", error.message); return null; }
      return data || [];
    };

    const first = await fetchBatch(0);
    if (first === null) { setLoadingListings(false); return []; }

    let all = first.map(r => mapRow(r, myId));
    setListings(all);
    setLoadingListings(false);

    // Qolganini orqa fonda yuklaymiz — foydalanuvchi kutmaydi
    if (first.length === BATCH) {
      (async () => {
        let from = BATCH;
        while (from < MAX_TOTAL) {
          const next = await fetchBatch(from);
          if (!next || next.length === 0) break;
          all = [...all, ...next.map(r => mapRow(r, myId))];
          setListings(all);
          if (next.length < BATCH) break;
          from += BATCH;
        }
      })();
    }

    return all;
  };

  const fetchFavorites = async (myId) => {
    const { data } = await supabase.from("favorites").select("listing_id").eq("user_id", myId);
    setFavs(new Set((data || []).map(r => r.listing_id)));
  };

  const fetchSavedSearches = async (myId) => {
    const { data } = await supabase.from("saved_searches").select("*").eq("user_id", myId).order("created_at", { ascending: false });
    setSavedSearches(data || []);
  };

  const fetchOwnerStats = async (mineIds) => {
    if (!mineIds.length) return;
    const [{ data: favRows }, { data: chatRows }] = await Promise.all([
      supabase.from("favorites").select("listing_id").in("listing_id", mineIds),
      supabase.from("chats").select("listing_id").in("listing_id", mineIds),
    ]);
    const stats = {};
    for (const id of mineIds) stats[id] = { favCount: 0, chatCount: 0 };
    (favRows || []).forEach(r => { if (stats[r.listing_id]) stats[r.listing_id].favCount++; });
    (chatRows || []).forEach(r => { if (stats[r.listing_id]) stats[r.listing_id].chatCount++; });
    setOwnerStats(stats);
  };

  // Ko'rishlar sonini oshiradi (egasi o'zinikini ko'rsa hisoblanmaydi)
  const incrementView = (item) => {
    if (!item || item.ownerId === userId) return;
    supabase.rpc("increment_views", { p_listing_id: item.id }).then(({ error }) => { if (error) console.error("Ko'rish sonini oshirishda xato:", error.message); });
  };

  // Havola orqali (masalan Telegram'dan) to'g'ridan-to'g'ri ochilgan bitta e'lonni yuklaydi
  const fetchOneListing = async (id, myId) => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(url, thumb_url, position)")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) { console.error("E'lon topilmadi:", error?.message); return; }
    const mapped = mapRow(data, myId);
    setSelected(mapped);
    incrementView(mapped);
  };

  // URL'da /elon/:id bo'lsa va hali ochilmagan bo'lsa — bazadan yuklaydi (havola orqali kirilganda ishlaydi)
  useEffect(() => {
    if (routeListingId && (!selected || selected.id !== routeListingId)) {
      const fromList = listings.find(l => l.id === routeListingId);
      if (fromList) { setSelected(fromList); incrementView(fromList); }
      else if (userId !== null || listings.length > 0) fetchOneListing(routeListingId, userId);
    }
    if (!routeListingId && selected) setSelected(null);
  }, [routeListingId, listings, userId]);

  // Brauzerning orqaga/oldinga tugmalari bilan tablar orasida yurilganda ham holatni to'g'ri ushlab turadi
  useEffect(() => {
    if (!routeListingId) setTab(pathToTab(location.pathname));
  }, [location.pathname, routeListingId]);

  // Ilova ochilganda: anonim seans ochish (RLS uchun kerak) + e'lonlarni yuklash
  useEffect(() => {
    // Umumiy sozlamalar (jadval hali yo'q bo'lsa — cheklov yo'q deb hisoblanadi)
    supabase.from("app_settings").select("require_phone_to_post").eq("id", 1).maybeSingle()
      .then(({ data }) => setRequirePhoneToPost(!!data?.require_phone_to_post), () => {});
    (async () => {
      let { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) { console.error("Anonim kirishda xato:", error.message); return; }
        session = data.session;
      }
      const myId = session?.user?.id || null;
      setUserId(myId);
      if (myId) {
        // Profil qatori bo'lmasa yaratamiz (listings.owner_id shu jadvalga bog'langan)
        await supabase.from("profiles").upsert({ id: myId }, { onConflict: "id", ignoreDuplicates: true });
        const { data: profRow } = await supabase.from("profiles").select("referral_code, boost_credits, full_name, is_blocked").eq("id", myId).maybeSingle();
        if (profRow) {
          setProfile({ referralCode: profRow.referral_code || "", boostCredits: profRow.boost_credits || 0, fullName: profRow.full_name || "" });
          setAccountBlocked(!!profRow.is_blocked);
        }
        loadNotifyPrefs(myId);
        // Oxirgi faollik vaqti — admin panelda "oxirgi kirgan" sifatida ko'rinadi
        supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", myId).then(() => {});
        // Agar bu foydalanuvchi avval telefonini tasdiqlagan bo'lsa — eslab qolamiz
        if (session.user.phone && session.user.phone_confirmed_at) {
          setVerified(true);
          setPhone("+" + session.user.phone);
          loadLegalStatus(myId);
        }
        fetchFavorites(myId);
        fetchSavedSearches(myId);
      }
      const mapped = await fetchListings(myId);
      fetchChats(myId);
      if (myId) {
        const mineIds = mapped.filter(l => l.mine).map(l => l.id);
        if (mineIds.length) fetchOwnerStats(mineIds);
      }
    })();
  }, []);

  // Bildirishnoma sozlamalari alohida so'raladi: SQL migratsiya hali ishga tushirilmagan bo'lsa ham profil buzilmaydi
  const loadNotifyPrefs = async (uid) => {
    const { data, error } = await supabase.from("profiles").select("telegram_chat_id, notify_messages, notify_searches").eq("id", uid).maybeSingle();
    if (!error && data) setNotify({ linked: !!data.telegram_chat_id, messages: data.notify_messages !== false, searches: data.notify_searches !== false });
  };

  // Qaysi hujjat tahririga rozi bo'lgani (SQL migratsiya hali ishga tushirilmagan bo'lsa — so'ramaymiz)
  const loadLegalStatus = async (uid) => {
    const { data, error } = await supabase.from("profiles").select("terms_version").eq("id", uid).maybeSingle();
    setLegalOk(error ? true : (data?.terms_version || null) === LEGAL_VERSION);
  };

  // Rozilikni serverda qayd etish: kim, qaysi tahrir, qachon (vaqtni server o'zi qo'yadi)
  const recordConsent = async () => {
    const { error } = await supabase.rpc("accept_terms", { p_version: LEGAL_VERSION });
    if (error) console.error("Rozilikni yozishda xato:", error.message);
    return error || null;
  };

  const acceptLegal = async () => {
    const error = await recordConsent();
    if (error) { setNotice(friendlyError(error, t)); return; }
    setLegalOk(true);
  };

  const setNotifyPref = async (column, value) => {
    setNotify(n => ({ ...n, [column === "notify_messages" ? "messages" : "searches"]: value }));
    const { error } = await supabase.from("profiles").update({ [column]: value }).eq("id", userId);
    if (error) setNotice(friendlyError(error, t));
  };

  // Bot xabarlari foydalanuvchi tanlagan tilda kelishi uchun tilni profilga yozib qo'yamiz (faqat o'zgarganda)
  useEffect(() => {
    if (!userId) return;
    let last = null;
    try { last = localStorage.getItem("uy247_notify_lang"); } catch (_) {}
    if (last === `${userId}:${lang}`) return;
    supabase.from("profiles").update({ notify_lang: lang }).eq("id", userId).then(({ error }) => {
      if (!error) { try { localStorage.setItem("uy247_notify_lang", `${userId}:${lang}`); } catch (_) {} }
    });
  }, [lang, userId]);

  // Haqiqiy chiqish: sessiya yopiladi, ilova yangi (mehmon) holatda qayta ochiladi
  const logout = async () => {
    try { await supabase.auth.signOut(); } catch (_) {}
    window.location.replace("/");
  };

  // Akkauntni butunlay o'chirish (server: rasmlar + akkaunt; qolgani bazada avtomatik)
  const deleteAccount = async () => {
    await callApi("/api/delete-account", { confirm: "DELETE" });
    try { localStorage.removeItem("uy247_last_seen"); localStorage.removeItem("uy247_notify_lang"); } catch (_) {}
    try { await supabase.auth.signOut(); } catch (_) {}
    window.location.replace("/");
  };

  // Real-time: yangi xabar kelsa avtomatik ko'rsatish
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("messages-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new;
        if (m.sender_id === userId) return; // o'z xabarim allaqachon ko'rsatilgan
        setChats(prev => {
          const entry = Object.values(prev).find(c => c.chatId === m.chat_id);
          if (!entry) return prev;
          return { ...prev, [entry.listingId]: { ...entry, messages: [...entry.messages, { id: m.id, from: "owner", text: m.text, createdAt: m.created_at || new Date().toISOString() }] } };
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Foydalanuvchining barcha chatlarini yuklash
  const fetchChats = async (myId) => {
    const { data, error } = await supabase
      .from("chats")
      .select("id, listing_id, renter_id, owner_id, listings(title), messages(id, sender_id, text, created_at)")
      .or(`renter_id.eq.${myId},owner_id.eq.${myId}`);
    if (error) { console.error("Chatlarni yuklashda xato:", error.message); return; }
    const next = {};
    for (const c of data || []) {
      let hash = 0;
      for (const ch of String(c.listing_id)) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
      next[c.listing_id] = {
        chatId: c.id, listingId: c.listing_id, listingTitle: c.listings?.title || "", hue: hash,
        messages: (c.messages || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map(m => ({ id: m.id, from: m.sender_id === myId ? "me" : "owner", text: m.text, createdAt: m.created_at })),
      };
    }
    setChats(next);
  };

  const openChat = async (item) => {
    if (item.ownerId === userId) { switchTab("chats"); return; } // o'z e'loniga o'zi yozmaydi
    if (!chats[item.id]) {
      // Mavjud chatni topish yoki yangi yaratish
      let { data: existing } = await supabase.from("chats").select("id").eq("listing_id", item.id).eq("renter_id", userId).maybeSingle();
      if (!existing) {
        const { data: created, error } = await supabase.from("chats")
          .insert({ listing_id: item.id, renter_id: userId, owner_id: item.ownerId }).select("id").single();
        if (error) { console.error("Chat ochishda xato:", error.message); setNotice(friendlyError(error, t)); return; }
        existing = created;
      }
      setChats(prev => ({ ...prev, [item.id]: { chatId: existing.id, listingId: item.id, listingTitle: item.title, hue: item.hue, messages: [] } }));
    }
    setActiveChat(item.id);
    markChatSeen(item.id);
    setSelected(null);
    setTab("chats");
    navigate("/xabarlar");
  };

  const sendMessage = async (listingId, text) => {
    const thread = chats[listingId];
    if (!thread?.chatId) return;
    const tempId = Date.now();
    setChats(prev => ({ ...prev, [listingId]: { ...prev[listingId], messages: [...prev[listingId].messages, { id: tempId, from: "me", text }] } }));
    const { error } = await supabase.from("messages").insert({ chat_id: thread.chatId, sender_id: userId, text });
    if (error) { console.error("Xabar yuborishda xato:", error.message); setNotice(friendlyError(error, t)); return; }
    callApi("/api/notify-message", { chat_id: thread.chatId }).catch(() => {});
  };

  const filtered = useMemo(() => listings.filter(l => {
    if (l.status !== "approved") return false;
    if (l.isOccupied) return false;
    if (l.city !== filters.city) return false;
    if (filters.rentType !== "Barchasi" && l.rentType !== filters.rentType) return false;
    if (filters.propertyType !== "Barchasi" && l.propertyType !== filters.propertyType) return false;
    if (filters.rooms !== "Barchasi") { if (filters.rooms === "4+" ? l.rooms < 4 : l.rooms !== filters.rooms) return false; }
    if (filters.min && l.price < Number(filters.min)) return false;
    if (filters.max && l.price > Number(filters.max)) return false;
    if (query) {
      const q = query.trim().toLowerCase();
      if (q && !String(l.title || "").toLowerCase().includes(q) && !placeSearchText(l.district).includes(q)) return false;
    }
    // Ijara shakli (butun uy / o'rin)
    if (filters.listingMode !== "Barchasi" && (l.listingMode || "whole") !== filters.listingMode) return false;
    // Bo'sh o'rinlar soni va kim yashaydi — faqat "Sherik bilan" tanlanganda ishlaydi
    // (boshqa rejimda yashirin qolib, natijalarni bekorga yo'qotib qo'ymasligi uchun)
    if (filters.listingMode === "shared" && filters.minFreeSpots !== "Barchasi" && (l.freeSpots || 0) < Number(filters.minFreeSpots)) return false;
    if (filters.listingMode === "shared" && filters.gender !== "Barchasi" && l.genderPref !== filters.gender) return false;
    return true;
  }).sort((a, b) => {
    if (a.boosted !== b.boosted) return b.boosted ? 1 : -1; // Top e'lonlar doim birinchi
    if (filters.sortBy === "cheap") return a.price - b.price;
    if (filters.sortBy === "popular") return b.views - a.views;
    return 0; // "new" — Supabase'dan created_at bo'yicha allaqachon tartiblangan, shu tartib saqlanadi
  }), [listings, filters, query]);

  // Filtr yoki qidiruv o'zgarganda ro'yxatni boshidan ko'rsatamiz
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filters, query]);

  // Ochilgan e'longa o'xshash boshqa e'lonlar (bir xil shahar + tuman yoki xonalar soni mos)
  const similarListings = useMemo(() => {
    if (!selected) return [];
    return listings.filter(l =>
      l.id !== selected.id && l.status === "approved" && l.city === selected.city &&
      l.rentType === selected.rentType && (l.district === selected.district || l.rooms === selected.rooms)
    ).slice(0, 6);
  }, [listings, selected]);

  const toggleFav = (id) => {
    const willAdd = !favs.has(id);
    setFavs(prev => { const next = new Set(prev); willAdd ? next.add(id) : next.delete(id); return next; });
    if (!userId) return;
    if (willAdd) supabase.from("favorites").insert({ user_id: userId, listing_id: id }).then(({ error }) => { if (error) console.error("Sevimliga qo'shishda xato:", error.message); });
    else supabase.from("favorites").delete().eq("user_id", userId).eq("listing_id", id).then(({ error }) => { if (error) console.error("Sevimlidan olib tashlashda xato:", error.message); });
  };
  const myListings = listings.filter(l => l.mine);

  const saveCurrentSearch = async () => {
    if (!verified) { setShowVerify(true); return; }
    const payload = {
      user_id: userId, city: filters.city, rent_type: filters.rentType,
      property_type: filters.propertyType, rooms: String(filters.rooms),
      min_price: filters.min ? Number(filters.min) : null,
      max_price: filters.max ? Number(filters.max) : null,
    };
    const { data, error } = await supabase.from("saved_searches").insert(payload).select().single();
    if (error) { console.error("Qidiruvni saqlashda xato:", error.message); setNotice(t.boostRequestError); return; }
    setSavedSearches(prev => [data, ...prev]);
    setNotice(t.searchSaved);
  };

  const deleteSavedSearch = async (id) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    await supabase.from("saved_searches").delete().eq("id", id);
  };

  // Uy egasi uchun tezkor yangilash: bitta bosish bilan o'rin bo'shadi / band bo'ldi
  const adjustSpot = async (listing, delta) => {
    const rooms = (listing.roomsConfig || []).map(r => ({ ...r }));
    if (!rooms.length) return;

    if (delta > 0) {
      // O'rin bo'shadi — bandi bor birinchi xonadan bittasini bo'shatamiz
      const idx = rooms.findIndex(r => (r.occupied || 0) > 0);
      if (idx === -1) return;
      rooms[idx].occupied = rooms[idx].occupied - 1;
    } else {
      // O'rin band bo'ldi — bo'sh joyi bor birinchi xonaga qo'shamiz
      const idx = rooms.findIndex(r => (r.occupied || 0) < (r.capacity || 0));
      if (idx === -1) return;
      rooms[idx].occupied = (rooms[idx].occupied || 0) + 1;
    }

    const free = countFreeSpots(rooms);
    setListings(ls => ls.map(l => l.id === listing.id ? { ...l, roomsConfig: rooms, freeSpots: free } : l));
    const { error } = await supabase.from("listings").update({ rooms_config: rooms, free_spots: free }).eq("id", listing.id);
    if (error) console.error("O'rinni yangilashda xato:", error.message);
  };

  const toggleOccupied = async (id, current) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, isOccupied: !current } : l));
    const { error } = await supabase.from("listings").update({ is_occupied: !current }).eq("id", id);
    if (error) console.error("Band/bo'sh holatini o'zgartirishda xato:", error.message);
  };

  const handleReport = async (item, reason) => {
    setReports(rs => [...rs, { id: Date.now(), listingId: item.id, listingTitle: item.title, reason }]);
    const { error } = await supabase.from("reports").insert({ listing_id: item.id, reporter_id: userId, reason });
    if (error) { console.error("Shikoyat yuborishda xato:", error.message); setNotice(friendlyError(error, t)); }
  };

  // Pullik Top: so'rov "kutilmoqda" holatida yoziladi.
  // To'lov tasdiqlangach (hozircha admin, keyinchalik Payme/Click avtomatik) e'lon Top bo'ladi.
  const handleBoost = async (pkgId, price, provider = "payme") => {
    const days = pkgId === "30d" ? 30 : 7;
    const { error } = await supabase.from("boosts").insert({ listing_id: boostTarget, amount: price, provider, status: "pending", days });
    setBoostTarget(null);
    if (error) { console.error("Top so'rovida xato:", error.message); setNotice(t.boostRequestError); return; }
    setNotice(t.boostRequestSent);
  };

  const handleUseCredit = async () => {
    if (profile.boostCredits < 1) return;
    const target = boostTarget;
    setBoostTarget(null);
    const { data: ok, error } = await supabase.rpc("use_boost_credit", { p_listing_id: target });
    if (error || !ok) { console.error("Kredit bilan Top qilishda xato:", error?.message); setNotice(t.boostRequestError); return; }
    // Top allaqachon bo'lsa — 7 kun joriy muddat oxiriga qo'shiladi (server ham shunday qiladi)
    const extend = (until) => new Date(Math.max(Date.now(), new Date(until || 0).getTime() || 0) + 7 * 86400000).toISOString();
    setListings(ls => ls.map(l => l.id === target ? { ...l, boosted: true, boostUntil: extend(l.boosted ? l.boostUntil : null) } : l));
    setProfile(p => ({ ...p, boostCredits: p.boostCredits - 1 }));
  };

  const handleVerified = async (confirmedPhone) => {
    const { data: { session } } = await supabase.auth.getSession();
    const newUserId = session?.user?.id;
    if (newUserId) {
      await supabase.from("profiles").upsert({ id: newUserId, phone: confirmedPhone, phone_verified: true }, { onConflict: "id" });
      // Oynada belgilangan rozilik serverda qayd etiladi (yozilmasa — keyingi kirishda qayta so'raladi)
      await recordConsent();
      setLegalOk(true);
      // Agar ?ref=KOD bilan kirgan bo'lsa — ikkala tomonga ham bonus kredit beriladi
      if (refCode) {
        const { data: claimed } = await supabase.rpc("claim_referral", { p_ref_code: refCode });
        if (claimed) console.log("Referal bonusi berildi");
      }
      const { data: profRow } = await supabase.from("profiles").select("referral_code, boost_credits, full_name, is_blocked").eq("id", newUserId).maybeSingle();
      if (profRow) {
        setProfile({ referralCode: profRow.referral_code || "", boostCredits: profRow.boost_credits || 0, fullName: profRow.full_name || "" });
        setAccountBlocked(!!profRow.is_blocked);
      }
      setUserId(newUserId);
      setPhone(confirmedPhone);
      setVerified(true);
      loadNotifyPrefs(newUserId);
      fetchListings(newUserId);
      fetchChats(newUserId);
      fetchFavorites(newUserId);
      fetchSavedSearches(newUserId);
    }
    setShowVerify(false);
  };

  if (activeChat && chats[activeChat]) {
    return (
      <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
        <GlobalStyle />
        <ChatThread chat={chats[activeChat]} onBack={() => setActiveChat(null)} onSend={sendMessage} t={t} />
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
        <GlobalStyle />
        <SettingsView onBack={() => setShowSettings(false)} lang={lang} setLang={setLang} verified={verified} phone={phone}
          onRequestVerify={() => setShowVerify(true)} onLogout={logout} onDeleteAccount={deleteAccount}
          notify={notify}
          onTelegramLinked={() => { setNotify(n => ({ ...n, linked: true })); setNotice(t.telegramLinkedToast); }}
          onTelegramUnlink={() => setNotify(n => ({ ...n, linked: false }))}
          onToggleNotify={setNotifyPref} />
        {showVerify && <VerifyModal t={t} onClose={() => setShowVerify(false)} onVerified={handleVerified} />}
        {notice && (
          <div role="status" aria-live="polite" className="fixed left-4 right-4 px-4 py-3 rounded-xl text-[13px] text-center shadow-2xl"
            style={{ zIndex: 2500, bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)", background: "#1E333C", color: "#F2EDE4", border: "1px solid #3E92B0" }}>
            {notice}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <GlobalStyle />
      <MosaicStrip className="h-1.5" />

      {selected ? (
        <DetailView item={selected} onBack={closeListing} verified={verified} onRequestVerify={() => setShowVerify(true)} isFav={favs.has(selected.id)} onToggleFav={toggleFav} onReport={handleReport} onOpenChat={openChat} onRevealPhone={fetchOwnerPhone} t={t} similar={similarListings} favs={favs} onOpenSimilar={openListing} />
      ) : (
        <>
          {/* Sarlavha + filtr paneli — bitta yopishqoq blok: scroll paytida bir-birining ustiga chiqib qolmaydi */}
          <div className="sticky top-0 z-20">
          <header className="px-4 py-3.5 flex items-center justify-between" style={{ background: "#16262E", borderBottom: "1px solid #22343B", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
            <div className="flex items-baseline gap-0.5">
              <span className="font-serif text-[22px] font-semibold" style={{ color: "#F2EDE4" }}>Uy</span>
              <span className="font-serif text-[22px] font-semibold" style={{ color: "#D4783C" }}>24/7</span>
            </div>
            {tab === "browse" ? (
              <div className="flex items-center gap-2 flex-1 max-w-[180px] ml-3 px-3 py-2 rounded-full" style={box}>
                <Search size={15} color="#93A5AA" />
                <input type="search" enterKeyHint="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} className="bg-transparent outline-none text-[13px] w-full min-w-0" style={{ color: "#F2EDE4" }} />
              </div>
            ) : <div />}
            <div className="flex items-center shrink-0">
              <LangPicker lang={lang} setLang={setLang} label={t.language} />
              <button onClick={() => setShowSettings(true)} aria-label={t.settings} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-2" style={box}><SettingsIcon size={16} color="#F2EDE4" /></button>
            </div>
          </header>
          {tab === "browse" && (
            <FilterBar filters={filters} setFilters={setFilters} resultsCount={filtered.length} onSaveSearch={saveCurrentSearch} viewMode={viewMode} setViewMode={setViewMode} t={t} />
          )}
          </div>

          {/* Hujjatlar yangilangan bo'lsa — bir marta rozilik so'raladi */}
          {verified && legalOk === false && (
            <div className="mx-4 mt-3 rounded-xl p-3 flex items-center gap-2.5" role="status" style={{ background: "#26343A", border: "1px solid #3E5560" }}>
              <ClipboardList size={16} color="#3E92B0" className="shrink-0" />
              <p className="flex-1 min-w-0 text-[12.5px] leading-snug" style={{ color: "#C8D4D6" }}>
                {tl(t, "legalUpdatedText", {
                  terms: <Link to={LEGAL_ROUTES.terms} style={linkStyle}>{t.termsLink}</Link>,
                  privacy: <Link to={LEGAL_ROUTES.privacy} style={linkStyle}>{t.privacyLink}</Link>,
                })}
              </p>
              <button onClick={acceptLegal} className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>{t.legalAcceptBtn}</button>
            </div>
          )}

          {tab === "browse" && (
            <>
              {viewMode === "map" ? (
                <MapListView listings={filtered} onOpen={openListing} favs={favs} onToggleFav={toggleFav} t={t} />
              ) : (
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-28 pt-1">
                  {loadingListings ? (
                    <div className="col-span-full text-center py-20"><p className="text-[14px]" style={{ color: "#93A5AA" }}>{t.loadingText}</p></div>
                  ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-20"><p className="text-[14px]" style={{ color: "#93A5AA" }}>{t.noResults}</p></div>
                  ) : (
                    <>
                      {filtered.slice(0, visibleCount).map(item => <ListingCard key={item.id} item={item} onOpen={openListing} isFav={favs.has(item.id)} onToggleFav={toggleFav} t={t} />)}
                      {filtered.length > visibleCount && (
                        <div className="col-span-full flex justify-center py-3">
                          <button onClick={() => setVisibleCount(n => n + PAGE_SIZE)}
                            className="px-5 py-2.5 rounded-full text-[13.5px] font-medium"
                            style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                            {t.loadMore} ({filtered.length - visibleCount})
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {tab === "favs" && (
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-28 pt-4">
              {listings.filter(l => favs.has(l.id)).length === 0 ? (
                <div className="col-span-full text-center py-20"><Heart size={32} color="#3E5560" className="mx-auto mb-3" /><p className="text-[14px]" style={{ color: "#93A5AA" }}>{t.emptyFavs}</p></div>
              ) : listings.filter(l => favs.has(l.id)).map(item => <ListingCard key={item.id} item={item} onOpen={openListing} isFav onToggleFav={toggleFav} t={t} />)}
            </div>
          )}

          {tab === "chats" && <ChatsListView chats={chats} onOpen={(c) => { setActiveChat(c.listingId); markChatSeen(c.listingId); }} t={t} unreadByChat={unreadByChat} />}

          {tab === "post" && (accountBlocked ? (<div className="p-4 pb-28">
              <div className="rounded-2xl p-5 text-center" style={{ background: "#3A2429", border: "1px solid #6B3A42" }}>
                <Ban size={28} color="#F2C2C2" className="mx-auto mb-3" />
                <h2 className="font-serif text-lg mb-2" style={{ color: "#F2EDE4" }}>{t.accountBlockedTitle}</h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "#E8A8A8" }}>{tf(t, "accountBlockedBody", { email: COMPANY.email })}</p>
              </div>
            </div>) : (requirePhoneToPost && !verified) ? (<div className="p-4 pb-28">
              <div className="rounded-2xl p-5 text-center" style={box}>
                <ShieldCheck size={28} color="#3E92B0" className="mx-auto mb-3" />
                <h2 className="font-serif text-lg mb-2" style={{ color: "#F2EDE4" }}>{t.postNeedsVerifyTitle}</h2>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#93A5AA" }}>{t.postNeedsVerifyBody}</p>
                <button onClick={() => setShowVerify(true)} className="px-5 py-2.5 rounded-xl font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>{t.verifyPhoneBtn}</button>
              </div>
            </div>) : <PostForm userId={userId} onPublish={() => { fetchListings(userId); setTab("profile"); }} t={t} initialFullName={profile.fullName} onFullNameSaved={(name) => setProfile(p => ({ ...p, fullName: name }))} />)}

          {tab === "profile" && (
            <div className="px-4 py-6 pb-28 space-y-4">
              <div className="rounded-2xl p-4 flex items-center gap-3" style={box}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#3E92B0" }}><User size={22} color="#0E1B21" /></div>
                <div className="flex-1">
                  <div className="font-medium text-[15px]" style={{ color: "#F2EDE4" }}>{verified ? formatPhone(phone) : t.guest}</div>
                  <div className="text-[12px]" style={{ color: "#93A5AA" }}>{verified ? t.verified : t.unverified}</div>
                </div>
                {verified && <button onClick={logout} className="flex items-center gap-1 text-[12px]" style={{ color: "#D4783C" }}><LogOut size={13} /> {t.logout}</button>}
              </div>
              {!verified && <button onClick={() => setShowVerify(true)} className="w-full py-3 rounded-xl font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>{t.verifyPhoneBtn}</button>}

              <div className="rounded-2xl p-4" style={box}>
                <div className="text-[13px] font-medium mb-3" style={{ color: "#F2EDE4" }}>{t.myListings} ({myListings.length})</div>
                {myListings.length === 0 ? (
                  <p className="text-[12.5px]" style={{ color: "#93A5AA" }}>{t.noListingsYet}</p>
                ) : (
                  <div className="space-y-2.5">
                    {myListings.map(l => (
                      <div key={l.id} className="p-3 rounded-xl" style={{ background: "#16262E", border: l.isOccupied ? "1px solid #D4783C" : "1px solid #2A424C" }}>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium" style={{ color: "#F2EDE4" }}>{l.title}</span>
                          <div className="flex items-center gap-1.5">
                            {l.isOccupied && <Badge color="#16262E" bg="#D4783C">{t.occupiedBadge}</Badge>}
                            <Badge color={l.status === "approved" ? "#16262E" : "#16262E"} bg={l.status === "approved" ? "#8FD19E" : l.status === "pending" ? "#E8B94A" : "#65787E"}>
                              {l.status === "approved" ? t.approved : l.status === "pending" ? t.pending : t.blocked}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11.5px] flex items-center gap-1" style={{ color: "#93A5AA" }}><Eye size={12} /> {tn(t, "viewsN", l.views)}</span>
                          {l.boosted ? (
                            <span className="text-[11px] flex items-center gap-1 font-medium" style={{ color: "#E8B94A" }}>
                              <Sparkles size={12} /> {t.topActiveLabel}
                              {l.boostUntil && <span style={{ color: "#93A5AA" }}>· {tn(t, "daysLeftN", daysLeft(l.boostUntil))}</span>}
                            </span>
                          ) : (
                            <button onClick={() => setBoostTarget(l.id)} className="text-[11.5px] flex items-center gap-1 px-2.5 py-1 rounded-full font-medium" style={{ background: "#D4783C", color: "#16262E" }}><Sparkles size={11} /> {t.boost}</button>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "#65787E" }}><Heart size={11} /> {tn(t, "favCountN", ownerStats[l.id]?.favCount || 0)}</span>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "#65787E" }}><MessageCircle size={11} /> {tn(t, "chatCountN", ownerStats[l.id]?.chatCount || 0)}</span>
                        </div>
                        {l.status === "blocked" && (
                          <div className="mt-2 p-2.5 rounded-lg" style={{ background: "#3A2429", border: "1px solid #6B3A42" }}>
                            <div className="text-[11px] font-medium mb-0.5" style={{ color: "#F2C2C2" }}>{t.blockedReason}</div>
                            <div className="text-[11.5px]" style={{ color: "#E8A8A8" }}>{l.blockReason || t.noReasonGiven}</div>
                          </div>
                        )}
                        {l.listingMode === "shared" && (
                          <div className="mt-2 p-2.5 rounded-xl" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11.5px]" style={{ color: "#93A5AA" }}>{t.freeSpotsTotal}</span>
                              <span className="text-[15px] font-semibold font-mono" style={{ color: l.freeSpots > 0 ? "#8FD19E" : "#93A5AA" }}>{l.freeSpots}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => adjustSpot(l, -1)} className="py-1.5 rounded-lg text-[11.5px] font-medium"
                                style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                                − {t.spotTakenBtn}
                              </button>
                              <button onClick={() => adjustSpot(l, +1)} className="py-1.5 rounded-lg text-[11.5px] font-medium"
                                style={{ background: "#3E92B0", color: "#0E1B21" }}>
                                + {t.spotFreedBtn}
                              </button>
                            </div>
                          </div>
                        )}
                        <button onClick={() => toggleOccupied(l.id, l.isOccupied)}
                          className="w-full mt-2 py-1.5 rounded-lg text-[11.5px] font-medium flex items-center justify-center gap-1.5"
                          style={{ background: l.isOccupied ? "#3E92B0" : "#1E333C", color: l.isOccupied ? "#0E1B21" : "#F2EDE4", border: l.isOccupied ? "none" : "1px solid #2A424C" }}>
                          <Ban size={12} /> {l.isOccupied ? t.markFreeBtn : t.markOccupiedBtn}
                        </button>
                        {l.rentType === "Kunlik" && (
                          <button onClick={() => setBookingEditorId(l.id)} className="w-full mt-1.5 py-1.5 rounded-lg text-[11.5px] font-medium flex items-center justify-center gap-1.5" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                            <CalendarDays size={12} /> {t.markBookingBtn}
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                          <button onClick={() => setEditingListing(l)} className="py-1.5 rounded-lg text-[11.5px] font-medium flex items-center justify-center gap-1.5" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                            <Pencil size={12} /> {t.editListing}
                          </button>
                          <button onClick={() => setDeletingListing(l)} className="py-1.5 rounded-lg text-[11.5px] font-medium flex items-center justify-center gap-1.5" style={{ background: "transparent", color: "#D4783C", border: "1px solid #D4783C" }}>
                            <Trash2 size={12} /> {t.deleteListing}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {verified && (
                <div className="rounded-2xl p-4" style={box}>
                  <div className="text-[13px] font-medium mb-1 flex items-center gap-1.5" style={{ color: "#F2EDE4" }}><Sparkles size={14} color="#E8B94A" /> {t.referralTitle}</div>
                  <p className="text-[12px] mb-3" style={{ color: "#93A5AA" }}>{t.referralSubtitle}</p>
                  <div className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
                    <span className="font-mono text-[13px]" style={{ color: "#E8B94A" }}>{window.location.origin}/?ref={profile.referralCode}</span>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?ref=${profile.referralCode}`); }} className="shrink-0 ml-2 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>{t.copyBtn}</button>
                  </div>
                  <div className="text-[12.5px]" style={{ color: "#93A5AA" }}>{t.currentCreditsLabel} <b style={{ color: "#F2EDE4" }}>{profile.boostCredits}{t.ta ? " " + t.ta : ""}</b></div>
                </div>
              )}

              {verified && savedSearches.length > 0 && (
                <div className="rounded-2xl p-4" style={box}>
                  <div className="text-[13px] font-medium mb-3" style={{ color: "#F2EDE4" }}>{t.savedSearchesTitle}</div>
                  <div className="space-y-2">
                    {savedSearches.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
                        <span className="text-[12.5px]" style={{ color: "#C8D4D6" }}>
                          {describeSavedSearch(s, t)}
                        </span>
                        <button onClick={() => deleteSavedSearch(s.id)}><Trash2 size={14} color="#D4783C" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showVerify && <VerifyModal t={t} onClose={() => setShowVerify(false)} onVerified={handleVerified} />}
      {boostTarget && <BoostModal onClose={() => setBoostTarget(null)} onBoost={handleBoost} onUseCredit={handleUseCredit} boostCredits={profile.boostCredits} t={t} />}
      {bookingEditorId && <BookingEditorModal listingId={bookingEditorId} onClose={() => setBookingEditorId(null)} t={t} />}

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSaved={(updated) => {
            const { resubmitted, ...rest } = updated;
            setListings(ls => ls.map(x => x.id === rest.id ? { ...x, ...rest } : x));
            if (resubmitted) setNotice(t.resubmittedForReview);
          }}
          t={t}
        />
      )}

      {deletingListing && (
        <DeleteConfirmModal
          listing={deletingListing}
          onClose={() => setDeletingListing(null)}
          onDeleted={(id) => setListings(ls => ls.filter(x => x.id !== id))}
          t={t}
        />
      )}

      {/* Bildirishnoma — e'lon sahifasida ham ko'rinadi (raqam limiti va h.k.), shuning uchun pastki menyudan tashqarida */}
      {notice && (
        <div role="status" aria-live="polite" className="fixed left-4 right-4 px-4 py-3 rounded-xl text-[13px] text-center shadow-2xl"
          style={{ zIndex: 2500, bottom: selected ? "calc(env(safe-area-inset-bottom, 0px) + 170px)" : "calc(env(safe-area-inset-bottom, 0px) + 84px)", background: "#1E333C", color: "#F2EDE4", border: "1px solid #3E92B0" }}>
          {notice}
        </div>
      )}

      {!selected && (
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2.5" style={{ background: "#1A2B33", borderTop: "1px solid #22343B", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}>
          {[{ id: "browse", icon: Search, label: t.navSearch }, { id: "chats", icon: MessageCircle, label: t.navChats }, { id: "post", icon: Plus, label: t.navPost }, { id: "favs", icon: Heart, label: t.navFavs }, { id: "profile", icon: User, label: t.navProfile }].map(x => (
            <button key={x.id} onClick={() => switchTab(x.id)} className="flex flex-col items-center gap-1 px-3 py-1">
              <div className="relative">
                <x.icon size={20} color={tab === x.id ? "#D4783C" : "#65787E"} />
                {x.id === "chats" && totalUnread > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[9.5px] font-bold"
                    style={{ background: "#D4783C", color: "#16262E" }}>
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] font-medium" style={{ color: tab === x.id ? "#D4783C" : "#65787E" }}>{x.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Lora:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
      .font-serif { font-family: 'Fraunces', 'Lora', Georgia, serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      select { -webkit-appearance: none; appearance: none; }
      body { margin: 0; }
    `}</style>
  );
}
