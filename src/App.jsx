import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search, Heart, Plus, User, MapPin, Phone, X, Check,
  SlidersHorizontal, ChevronRight, ChevronLeft, BedDouble, MessageSquare,
  Maximize2, ShieldCheck, Building2, ArrowLeft, Flag,
  ImagePlus, Trash2, Settings as SettingsIcon, Globe, Lock,
  Bell, LogOut, TrendingUp, Users, ClipboardList, AlertTriangle,
  Sparkles, Eye, CircleCheck, CircleX, ShieldAlert, MessageCircle, Send, Camera,
  ArrowUpDown, Home, Building, Store, Share2, Ban, Map, List, CalendarDays
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { loadYmaps, TASHKENT_CENTER, YANDEX_MAPS_API_KEY } from "./lib/yandexMaps";

/* ---------------------------------------------------------
   Uy24/7 — rieltorsiz uy-joy ijara platformasi (demo prototip)
   v3: + Ichki chat (raqamni oshkor qilmasdan yozishish)
       + Haqiqiy rasm yuklash (qurilmadan tanlash va ko'rish)
--------------------------------------------------------- */

const CITIES = ["Toshkent shahri", "Samarqand", "Buxoro", "Farg'ona", "Andijon", "Namangan"];
const DISTRICTS = { "Toshkent shahri": ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Mirobod", "Yakkasaroy", "Shayxontohur"] };
const AMENITIES_LIST = ["Wi-Fi", "Konditsioner", "Mashina turargohi", "Lift", "Muzlatgich", "Kir yuvish mashinasi"];
const ADMIN_PASSWORD = "admin2026";

const STR = {
  uz: {
    navSearch: "Qidirish", navFavs: "Sevimli", navPost: "E'lon berish", navProfile: "Profil",
    settings: "Sozlamalar", security: "Xavfsizlik", language: "Til", notifications: "Bildirishnomalar",
    myListings: "Mening e'lonlarim", adminPanel: "Admin panel", logout: "Chiqish",
    save: "Saqlash", cancel: "Bekor qilish", approve: "Tasdiqlash", reject: "Rad etish",
    block: "Bloklash", delete: "O'chirish", boost: "Top qilish", views: "ko'rishlar",
    stats: "Statistika", listingsTab: "E'lonlar", reportsTab: "Shikoyatlar",
    pending: "Kutilmoqda", approved: "Faol", blocked: "Bloklangan",
    guest: "Mehmon", unverified: "Tasdiqlanmagan", verified: "Tasdiqlangan",
    navChats: "Xabarlar", chatWith: "Egasi bilan chat", writeMessage: "Xabar yozing...",
    noChats: "Hozircha xabarlar yo'q. Yoqqan e'longa kirib, chat orqali yozing.",
    chatCta: "Chat orqali yozish", chatHint: "Raqamingiz oshkor qilinmaydi",
  },
  ru: {
    navSearch: "Поиск", navFavs: "Избранное", navPost: "Разместить", navProfile: "Профиль",
    settings: "Настройки", security: "Безопасность", language: "Язык", notifications: "Уведомления",
    myListings: "Мои объявления", adminPanel: "Админ-панель", logout: "Выйти",
    save: "Сохранить", cancel: "Отмена", approve: "Одобрить", reject: "Отклонить",
    block: "Заблокировать", delete: "Удалить", boost: "Продвинуть", views: "просмотров",
    stats: "Статистика", listingsTab: "Объявления", reportsTab: "Жалобы",
    pending: "На проверке", approved: "Активно", blocked: "Заблокировано",
    guest: "Гость", unverified: "Не подтверждён", verified: "Подтверждён",
    navChats: "Сообщения", chatWith: "Чат с владельцем", writeMessage: "Напишите сообщение...",
    noChats: "Пока нет сообщений. Откройте объявление и напишите через чат.",
    chatCta: "Написать в чате", chatHint: "Ваш номер не показывается",
  },
  en: {
    navSearch: "Search", navFavs: "Favorites", navPost: "Post listing", navProfile: "Profile",
    settings: "Settings", security: "Security", language: "Language", notifications: "Notifications",
    myListings: "My listings", adminPanel: "Admin panel", logout: "Log out",
    save: "Save", cancel: "Cancel", approve: "Approve", reject: "Reject",
    block: "Block", delete: "Delete", boost: "Boost", views: "views",
    stats: "Stats", listingsTab: "Listings", reportsTab: "Reports",
    pending: "Pending", approved: "Active", blocked: "Blocked",
    guest: "Guest", unverified: "Unverified", verified: "Verified",
    navChats: "Messages", chatWith: "Chat with owner", writeMessage: "Write a message...",
    noChats: "No messages yet. Open a listing and start a chat.",
    chatCta: "Message via chat", chatHint: "Your number stays hidden",
  },
};

const PROPERTY_TYPES = [
  { id: "kvartira", label: "Kvartira", Icon: Building },
  { id: "hovli", label: "Hovli / xususiy uy", Icon: Home },
  { id: "ofis", label: "Ofis / tijorat", Icon: Store },
];
const typeLabel = (id) => PROPERTY_TYPES.find(t => t.id === id)?.label || "Kvartira";
const typeIcon = (id) => PROPERTY_TYPES.find(t => t.id === id)?.Icon || Building;

const SORT_OPTIONS = [
  { id: "new", label: "Yangi qo'shilgan" },
  { id: "cheap", label: "Eng arzoni" },
  { id: "popular", label: "Eng ommabop" },
];

const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n);
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

function PriceTag({ price, rentType }) {
  return (
    <div className="relative inline-flex items-baseline gap-1 pl-3 pr-4 py-1.5" style={{ background: "#E8B94A", clipPath: "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)" }}>
      <span className="font-mono font-semibold text-[15px]" style={{ color: "#16262E" }}>{fmt(price)}</span>
      <span className="text-[11px] font-medium" style={{ color: "#4A3812" }}>so'm/{rentType === "Kunlik" ? "kun" : "oy"}</span>
    </div>
  );
}

function Gallery({ images, hue, height = "h-64" }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className={`${height} relative flex items-center justify-center`} style={{ background: `linear-gradient(135deg, hsl(${hue} 45% 28%), hsl(${hue + 30} 40% 18%))` }}>
        <Building2 size={64} color="rgba(242,237,228,0.3)" strokeWidth={1.2} />
      </div>
    );
  }
  return (
    <div className={`${height} relative overflow-hidden`} style={{ background: "#0E1B21" }}>
      <img src={images[idx]} alt="" className="w-full h-full object-cover" />
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

function ListingCard({ item, onOpen, isFav, onToggleFav }) {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98] relative" style={box} onClick={() => onOpen(item)}>
      {item.boosted && (
        <div className="absolute top-0 right-0 z-10 px-3 py-1 text-[10.5px] font-semibold flex items-center gap-1" style={{ background: "#D4783C", color: "#16262E", clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%)" }}>
          <Sparkles size={11} /> TOP
        </div>
      )}
      <div className="h-40 relative flex items-center justify-center overflow-hidden" style={item.images?.length ? { background: "#0E1B21" } : { background: `linear-gradient(135deg, hsl(${item.hue} 45% 28%), hsl(${item.hue + 30} 40% 18%))` }}>
        {item.images?.length ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" /> : <Building2 size={40} color="rgba(242,237,228,0.35)" strokeWidth={1.3} />}
        {item.verified && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: "rgba(22,38,46,0.85)", color: "#E8B94A" }}>
            <ShieldCheck size={13} /> Tasdiqlangan egasi
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleFav(item.id); }} className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.75)" }}>
          <Heart size={16} fill={isFav ? "#D4783C" : "none"} color={isFav ? "#D4783C" : "#F2EDE4"} />
        </button>
      </div>
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <PriceTag price={item.price} rentType={item.rentType} />
          <span className="flex items-center gap-1 text-[11px]" style={{ color: "#65787E" }}>
            {React.createElement(typeIcon(item.propertyType), { size: 13 })} {typeLabel(item.propertyType)}
          </span>
        </div>
        <h3 className="font-serif text-[16px] leading-snug" style={{ color: "#F2EDE4" }}>{item.title}</h3>
        <div className="flex items-center gap-1 text-[13px]" style={{ color: "#93A5AA" }}><MapPin size={13} /> {item.district}, {item.city}</div>
        <div className="flex items-center gap-3 text-[13px] pt-1" style={{ color: "#93A5AA" }}>
          <span className="flex items-center gap-1"><BedDouble size={14} /> {item.rooms} xona</span>
          <span className="flex items-center gap-1"><Maximize2 size={14} /> {item.area} m²</span>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ filters, setFilters, resultsCount, onSaveSearch, viewMode, setViewMode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-[60px] z-20 px-4 pt-3 pb-2" style={{ background: "#16262E" }}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="shrink-0 flex rounded-full p-0.5" style={box}>
          <button onClick={() => setViewMode("list")} className="px-2.5 py-2 rounded-full flex items-center" style={{ background: viewMode === "list" ? "#3E92B0" : "transparent" }}><List size={14} color={viewMode === "list" ? "#0E1B21" : "#93A5AA"} /></button>
          <button onClick={() => setViewMode("map")} className="px-2.5 py-2 rounded-full flex items-center" style={{ background: viewMode === "map" ? "#3E92B0" : "transparent" }}><Map size={14} color={viewMode === "map" ? "#0E1B21" : "#93A5AA"} /></button>
        </div>
        <select value={filters.city} onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))} className="shrink-0 px-3 py-2 rounded-full text-[13px] font-medium outline-none" style={{ ...box, color: "#F2EDE4" }}>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="shrink-0 flex rounded-full p-0.5" style={box}>
          {["Barchasi", "Kunlik", "Oylik"].map(t => (
            <button key={t} onClick={() => setFilters(f => ({ ...f, rentType: t }))} className="px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors" style={{ background: filters.rentType === t ? "#3E92B0" : "transparent", color: filters.rentType === t ? "#0E1B21" : "#93A5AA" }}>{t}</button>
          ))}
        </div>
        <div className="shrink-0 flex rounded-full p-0.5" style={box}>
          <button onClick={() => setFilters(f => ({ ...f, propertyType: "Barchasi" }))} className="px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors" style={{ background: filters.propertyType === "Barchasi" ? "#3E92B0" : "transparent", color: filters.propertyType === "Barchasi" ? "#0E1B21" : "#93A5AA" }}>Barchasi</button>
          {PROPERTY_TYPES.map(pt => (
            <button key={pt.id} onClick={() => setFilters(f => ({ ...f, propertyType: pt.id }))} className="px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors flex items-center gap-1" style={{ background: filters.propertyType === pt.id ? "#3E92B0" : "transparent", color: filters.propertyType === pt.id ? "#0E1B21" : "#93A5AA" }}>
              <pt.Icon size={12} /> {pt.label.split(" / ")[0]}
            </button>
          ))}
        </div>
        <select value={filters.sortBy} onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))} className="shrink-0 px-3 py-2 rounded-full text-[13px] font-medium outline-none flex items-center" style={{ ...box, color: "#F2EDE4" }}>
          {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <button onClick={() => setOpen(o => !o)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium" style={{ background: open ? "#D4783C" : "#1E333C", color: open ? "#16262E" : "#F2EDE4", border: "1px solid #2A424C" }}>
          <SlidersHorizontal size={14} /> Ko'proq
        </button>
      </div>
      {open && (
        <div className="mt-3 p-3.5 rounded-xl space-y-3" style={box}>
          <div>
            <div className="text-[12px] mb-1.5" style={{ color: "#93A5AA" }}>Narx oralig'i (so'm)</div>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="dan" value={filters.min} onChange={(e) => setFilters(f => ({ ...f, min: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
              <span style={{ color: "#93A5AA" }}>—</span>
              <input type="number" placeholder="gacha" value={filters.max} onChange={(e) => setFilters(f => ({ ...f, max: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div>
            <div className="text-[12px] mb-1.5" style={{ color: "#93A5AA" }}>Xonalar soni</div>
            <div className="flex gap-2">
              {["Barchasi", 1, 2, 3, "4+"].map(r => (
                <button key={r} onClick={() => setFilters(f => ({ ...f, rooms: r }))} className="px-3 py-1.5 rounded-lg text-[13px]" style={{ background: filters.rooms === r ? "#3E92B0" : "#16262E", color: filters.rooms === r ? "#0E1B21" : "#F2EDE4", border: "1px solid #2A424C" }}>{r}</button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="text-[12px] pt-2 flex items-center justify-between" style={{ color: "#93A5AA" }}>
        <span className="flex items-center gap-1"><ArrowUpDown size={11} /> {resultsCount} ta e'lon topildi</span>
        <button onClick={onSaveSearch} className="flex items-center gap-1 font-medium" style={{ color: "#3E92B0" }}><Bell size={12} /> Qidiruvni saqlash</button>
      </div>
    </div>
  );
}

function VerifyModal({ onClose, onVerified }) {
  const [step, setStep] = useState(1);
  const [phoneInput, setPhoneInput] = useState("");
  const [code, setCode] = useState("");
  const [flowType, setFlowType] = useState("phone_change"); // yoki "sms" (qaytgan foydalanuvchi)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError(e.message || "Kod yuborishda xatolik. Raqamni tekshirib qayta urinib ko'ring.");
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
      setError(e.message || "Kod noto'g'ri yoki muddati o'tgan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>{step === 1 ? "Raqamni tasdiqlash" : "SMS kodni kiriting"}</h3>
          <button onClick={onClose}><X size={20} color="#93A5AA" /></button>
        </div>
        {error && <p className="text-[12.5px] mb-3" style={{ color: "#D4783C" }}>{error}</p>}
        {step === 1 ? (
          <>
            <p className="text-[13px] mb-3" style={{ color: "#93A5AA" }}>Egasi telefon raqamini ko'rish uchun raqamingizni tasdiqlang. Bu — soxta so'rovlardan himoya qiladi.</p>
            <input placeholder="+998901234567" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none mb-3" style={inputStyle} />
            <button onClick={sendCode} disabled={phoneInput.length < 9 || loading} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: (phoneInput.length < 9 || loading) ? "#2A424C" : "#3E92B0", color: "#0E1B21" }}>{loading ? "Yuborilmoqda..." : "Kod yuborish"}</button>
          </>
        ) : (
          <>
            <p className="text-[13px] mb-3" style={{ color: "#93A5AA" }}>{normalizedPhone()} raqamiga yuborilgan 6 xonali kodni kiriting.</p>
            <input placeholder="000000" value={code} maxLength={6} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-[20px] tracking-[8px] text-center outline-none mb-3 font-mono" style={inputStyle} />
            <button onClick={confirmCode} disabled={code.length < 6 || loading} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: (code.length < 6 || loading) ? "#2A424C" : "#D4783C", color: "#16262E" }}>{loading ? "Tekshirilmoqda..." : "Tasdiqlash"}</button>
          </>
        )}
      </div>
    </div>
  );
}

function ReportModal({ onClose, onSubmit }) {
  const reasons = ["Bu rieltor/vositachi", "Narx noto'g'ri ko'rsatilgan", "Firibgarlik shubhasi", "E'lon o'chirilgan/band"];
  const [reason, setReason] = useState(reasons[0]);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg flex items-center gap-2" style={{ color: "#F2EDE4" }}><Flag size={17} color="#D4783C" /> Shubhali deb belgilash</h3>
          <button onClick={onClose}><X size={20} color="#93A5AA" /></button>
        </div>
        <div className="space-y-2 mb-4">
          {reasons.map(r => (
            <label key={r} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer" style={{ background: reason === r ? "#26343A" : "transparent", border: "1px solid #2A424C" }}>
              <input type="radio" checked={reason === r} onChange={() => setReason(r)} />
              <span className="text-[13.5px]" style={{ color: "#F2EDE4" }}>{r}</span>
            </label>
          ))}
        </div>
        <button onClick={() => onSubmit(reason)} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: "#D4783C", color: "#16262E" }}>Yuborish</button>
        <p className="text-[11.5px] mt-2 text-center" style={{ color: "#65787E" }}>Shikoyat admin tomonidan 24 soat ichida ko'rib chiqiladi.</p>
      </div>
    </div>
  );
}

function BoostModal({ onClose, onBoost, onUseCredit, boostCredits }) {
  const packages = [
    { id: "7d", label: "7 kun", price: 25000, desc: "Qidiruv natijalarida yuqorida chiqadi" },
    { id: "30d", label: "30 kun", price: 80000, desc: "Eng ko'p tanlanadigan variant" },
  ];
  const [selected, setSelected] = useState("7d");
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg flex items-center gap-2" style={{ color: "#F2EDE4" }}><Sparkles size={17} color="#E8B94A" /> Top e'lon qilish</h3>
          <button onClick={onClose}><X size={20} color="#93A5AA" /></button>
        </div>
        {boostCredits > 0 && (
          <button onClick={() => onUseCredit()} className="w-full flex items-center justify-between p-3.5 rounded-xl mb-3" style={{ background: "#26343A", border: "1.5px solid #E8B94A" }}>
            <span className="text-[13.5px] font-medium flex items-center gap-2" style={{ color: "#E8B94A" }}><Sparkles size={15} /> Bepul kredit bilan (7 kun)</span>
            <span className="text-[12px]" style={{ color: "#93A5AA" }}>{boostCredits} ta qoldi</span>
          </button>
        )}
        <div className="space-y-2.5 mb-4">
          {packages.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} className="w-full text-left p-3.5 rounded-xl flex items-center justify-between" style={{ background: selected === p.id ? "#26343A" : "#16262E", border: selected === p.id ? "1.5px solid #E8B94A" : "1px solid #2A424C" }}>
              <div>
                <div className="text-[14px] font-medium" style={{ color: "#F2EDE4" }}>{p.label}</div>
                <div className="text-[12px]" style={{ color: "#93A5AA" }}>{p.desc}</div>
              </div>
              <div className="font-mono text-[14px] font-semibold" style={{ color: "#E8B94A" }}>{fmt(p.price)}</div>
            </button>
          ))}
        </div>
        <div className="text-[12px] mb-2" style={{ color: "#93A5AA" }}>To'lov usuli</div>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => onBoost(selected, packages.find(p => p.id === selected).price)} className="py-2.5 rounded-lg font-medium text-[13.5px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>Payme orqali</button>
          <button onClick={() => onBoost(selected, packages.find(p => p.id === selected).price)} className="py-2.5 rounded-lg font-medium text-[13.5px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>Click orqali</button>
        </div>
      </div>
    </div>
  );
}

function DetailView({ item, onBack, verified, onRequestVerify, isFav, onToggleFav, onReport, onOpenChat, t, similar, favs, onOpenSimilar }) {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);
  const smsBody = encodeURIComponent(`Assalomu alaykum! Uy24/7 saytida "${item.title}" e'loningizga qiziqdim.`);

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
    <div className="pb-32">
      <div className="relative">
        <Gallery images={item.images} hue={item.hue} />
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center z-10" style={{ background: "rgba(22,38,46,0.8)" }}><ArrowLeft size={18} color="#F2EDE4" /></button>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button onClick={share} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: "rgba(22,38,46,0.8)" }}>
            <Share2 size={16} color="#F2EDE4" />
            {copied && <span className="absolute top-11 right-0 whitespace-nowrap px-2 py-1 rounded-lg text-[11px]" style={{ background: "#E8B94A", color: "#16262E" }}>Havola nusxalandi</span>}
          </button>
          <button onClick={() => setShowReport(true)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.8)" }}><Flag size={16} color="#F2EDE4" /></button>
          <button onClick={() => onToggleFav(item.id)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(22,38,46,0.8)" }}><Heart size={17} fill={isFav ? "#D4783C" : "none"} color={isFav ? "#D4783C" : "#F2EDE4"} /></button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <PriceTag price={item.price} rentType={item.rentType} />
          <span className="flex items-center gap-1 text-[12px]" style={{ color: "#65787E" }}>
            {React.createElement(typeIcon(item.propertyType), { size: 14 })} {typeLabel(item.propertyType)}
          </span>
        </div>
        <div>
          <h1 className="font-serif text-2xl" style={{ color: "#F2EDE4" }}>{item.title}</h1>
          <div className="flex items-center gap-1 text-[14px] mt-1" style={{ color: "#93A5AA" }}><MapPin size={14} /> {item.district}, {item.city}</div>
        </div>
        <div className="flex items-center gap-3 text-[12.5px]" style={{ color: "#93A5AA" }}>
          <span className="flex items-center gap-1"><Eye size={13} /> {item.views} marta ko'rilgan</span>
          {item.verified && <span className="flex items-center gap-1.5 font-medium" style={{ color: "#E8B94A" }}><ShieldCheck size={14} /> Tasdiqlangan egasi</span>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["Xonalar", `${item.rooms} ta`], ["Maydon", `${item.area} m²`], ["Qavat", item.floor]].map(([l, v]) => (
            <div key={l} className="rounded-xl p-3 text-center" style={box}><div className="text-[11px]" style={{ color: "#93A5AA" }}>{l}</div><div className="text-[15px] font-medium mt-0.5" style={{ color: "#F2EDE4" }}>{v}</div></div>
          ))}
        </div>
        <div><div className="text-[13px] font-medium mb-1.5" style={{ color: "#F2EDE4" }}>Tavsif</div><p className="text-[14px] leading-relaxed" style={{ color: "#93A5AA" }}>{item.desc}</p></div>
        <div>
          <div className="text-[13px] font-medium mb-2" style={{ color: "#F2EDE4" }}>Qulayliklar</div>
          <div className="flex flex-wrap gap-2">{item.amenities.map(a => <span key={a} className="px-3 py-1.5 rounded-full text-[12px]" style={{ ...box, color: "#93A5AA" }}>{a}</span>)}</div>
        </div>
        <YandexMapStatic lat={item.lat} lng={item.lng} />
        {item.rentType === "Kunlik" && <BookingCalendarView listingId={item.id} />}
      </div>

      {similar && similar.length > 0 && (
        <div className="pb-2">
          <div className="px-4 text-[13px] font-medium mb-2.5" style={{ color: "#F2EDE4" }}>Shunga o'xshash e'lonlar</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
            {similar.map(s => (
              <div key={s.id} className="shrink-0 w-44">
                <ListingCard item={s} onOpen={onOpenSimilar} isFav={favs?.has(s.id)} onToggleFav={onToggleFav} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, #16262E 75%, transparent)" }}>
        {verified ? (
          <div className="space-y-2">
            <button onClick={() => onOpenChat(item)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-[15px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>
              <MessageCircle size={17} /> {t.chatCta}
            </button>
            {item.ownerPhone && (
              <div className="grid grid-cols-2 gap-2.5">
                <a href={`tel:${item.ownerPhone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-[13px]" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}><Phone size={14} /> Qo'ng'iroq</a>
                <a href={`sms:${item.ownerPhone}?body=${smsBody}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-[13px]" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}><MessageSquare size={14} /> SMS</a>
              </div>
            )}
            <p className="text-center text-[11px]" style={{ color: "#65787E" }}>{t.chatHint}</p>
          </div>
        ) : (
          <button onClick={onRequestVerify} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-[15px]" style={{ background: "#D4783C", color: "#16262E" }}><Phone size={17} /> Egasi bilan bog'lanish</button>
        )}
      </div>

      {showReport && !reported && (
        <ReportModal onClose={() => setShowReport(false)} onSubmit={(reason) => { onReport(item, reason); setReported(true); setShowReport(false); }} />
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
      <header className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3" style={{ background: "#1A2B33", borderBottom: "1px solid #22343B" }}>
        <button onClick={onBack}><ArrowLeft size={19} color="#F2EDE4" /></button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `hsl(${chat.hue} 45% 28%)` }}>
          <Building2 size={16} color="rgba(242,237,228,0.7)" />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-medium truncate" style={{ color: "#F2EDE4" }}>{chat.listingTitle}</div>
          <div className="text-[11px] flex items-center gap-1" style={{ color: "#93A5AA" }}><Lock size={10} /> {t.chatHint}</div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto pb-24">
        <div className="text-center text-[11.5px] py-2" style={{ color: "#65787E" }}>Suhbat Uy24/7 ilovasi ichida, raqamlar oshkor qilinmaydi</div>
        {chat.messages.map(m => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-snug"
              style={m.from === "me"
                ? { background: "#3E92B0", color: "#0E1B21", borderBottomRightRadius: 4 }
                : { background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C", borderBottomLeftRadius: 4 }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 flex items-center gap-2" style={{ background: "#1A2B33", borderTop: "1px solid #22343B" }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder={t.writeMessage} className="flex-1 px-3.5 py-2.5 rounded-full text-[13.5px] outline-none" style={{ background: "#16262E", color: "#F2EDE4", border: "1px solid #2A424C" }} />
        <button onClick={submit} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#D4783C" }}>
          <Send size={16} color="#16262E" />
        </button>
      </div>
    </div>
  );
}

function ChatsListView({ chats, onOpen, t }) {
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
              <div className="text-[13.5px] font-medium truncate" style={{ color: "#F2EDE4" }}>{c.listingTitle}</div>
              <div className="text-[12px] truncate" style={{ color: "#93A5AA" }}>{last ? (last.from === "me" ? "Siz: " : "") + last.text : ""}</div>
            </div>
            <ChevronRight size={16} color="#65787E" />
          </button>
        );
      })}
    </div>
  );
}

function PostForm({ onPublish, userId }) {
  const [form, setForm] = useState({ title: "", propertyType: "kvartira", city: CITIES[0], district: DISTRICTS["Toshkent shahri"][0], rooms: 1, area: "", floor: "", rentType: "Oylik", price: "", amenities: [], desc: "", ownerConfirm: false, lat: null, lng: null });
  const [images, setImages] = useState([]); // { file, url, name }
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const toggleAmenity = (a) => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 8 - images.length);
    const next = files.map(file => ({ file, url: URL.createObjectURL(file), name: file.name }));
    setImages(prev => [...prev, ...next]);
    e.target.value = "";
  };
  const removeImage = (i) => setImages(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); });

  const valid = form.title && form.area && form.price && form.ownerConfirm && images.length >= 3 && !submitting;

  const submit = async () => {
    if (!userId) { setError("Seans topilmadi, sahifani yangilab qayta urinib ko'ring."); return; }
    setSubmitting(true);
    setError("");
    try {
      // 1) E'lonni yaratish (pending holatda)
      const { data: listingRow, error: insertErr } = await supabase.from("listings").insert({
        owner_id: userId, title: form.title, city: form.city, district: form.district,
        property_type: form.propertyType, rooms: Number(form.rooms), area: Number(form.area), floor: form.floor,
        rent_type: form.rentType, price: Number(form.price), amenities: form.amenities,
        description: form.desc, status: "pending", lat: form.lat, lng: form.lng,
      }).select().single();
      if (insertErr) throw insertErr;

      // 2) Rasmlarni Storage'ga yuklash
      const uploadedUrls = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = img.file.name.split(".").pop() || "jpg";
        const path = `${userId}/${listingRow.id}/${Date.now()}_${i}.${ext}`;
        const { error: upErr } = await supabase.storage.from("listing-images").upload(path, img.file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("listing-images").getPublicUrl(path);
        uploadedUrls.push(pub.publicUrl);
      }

      // 3) Rasm URL'larini bazaga yozish
      if (uploadedUrls.length) {
        const rows = uploadedUrls.map((url, position) => ({ listing_id: listingRow.id, url, position }));
        const { error: imgErr } = await supabase.from("listing_images").insert(rows);
        if (imgErr) throw imgErr;
      }

      setDone(true);
      onPublish();
    } catch (e) {
      console.error(e);
      setError(e.message || "Xatolik yuz berdi, qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#E8B94A" }}><Check size={28} color="#16262E" /></div>
        <h2 className="font-serif text-xl mb-2" style={{ color: "#F2EDE4" }}>E'lon yuborildi!</h2>
        <p className="text-[14px]" style={{ color: "#93A5AA" }}>E'loningiz admin tomonidan tekshirilmoqda (odatda 1 soat ichida). Tasdiqlangach qidiruvda ko'rinadi. Holatini "Profil → Mening e'lonlarim"da kuzatib boring.</p>
      </div>
    );
  }
  return (
    <div className="p-4 pb-28 space-y-5">
      <div className="rounded-xl p-3.5 flex items-start gap-2.5" style={{ background: "#26343A", border: "1px solid #3E5560" }}>
        <ShieldCheck size={18} color="#3E92B0" className="shrink-0 mt-0.5" />
        <p className="text-[12.5px] leading-snug" style={{ color: "#C8D4D6" }}>Bu platformada faqat <b>uy egalari</b> e'lon joylashi mumkin. Rieltor yoki vositachi ekanligi aniqlansa, e'lon o'chiriladi va akkaunt bloklanadi.</p>
      </div>
      {error && (
        <div className="rounded-xl p-3.5" style={{ background: "#3A2429", border: "1px solid #6B3A42" }}>
          <p className="text-[12.5px]" style={{ color: "#F2C2C2" }}>{error}</p>
        </div>
      )}
      <Field label="E'lon sarlavhasi"><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Masalan: Yunusobodda yorug' 2 xonali" style={inputStyle} /></Field>

      <Field label="Uy turi">
        <div className="grid grid-cols-3 gap-2">
          {PROPERTY_TYPES.map(pt => (
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
        <Field label="Shahar"><select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={inputStyle}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Tuman"><select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} style={inputStyle}>{(DISTRICTS[form.city] || ["Markaz"]).map(d => <option key={d}>{d}</option>)}</select></Field>
      </div>
      <Field label="Aniq manzil (xaritada belgilang)">
        <YandexMapPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm(f => ({ ...f, lat, lng }))} />
        <p className="text-[11px] mt-1.5" style={{ color: "#65787E" }}>{form.lat ? "Belgilandi — o'zgartirish uchun xaritaga bosing" : "Xaritaga bosib yoki markerni sudrab, uyingiz joylashuvini belgilang"}</p>
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Xonalar"><input type="number" min={1} value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))} style={inputStyle} /></Field>
        <Field label="Maydon (m²)"><input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} style={inputStyle} /></Field>
        <Field label="Qavat"><input placeholder="3/9" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} style={inputStyle} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ijara turi">
          <div className="flex rounded-lg p-0.5" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
            {["Oylik", "Kunlik"].map(t => <button key={t} type="button" onClick={() => setForm(f => ({ ...f, rentType: t }))} className="flex-1 py-2 rounded-md text-[13px] font-medium" style={{ background: form.rentType === t ? "#3E92B0" : "transparent", color: form.rentType === t ? "#0E1B21" : "#93A5AA" }}>{t}</button>)}
          </div>
        </Field>
        <Field label="Narx (so'm)"><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="4200000" style={inputStyle} /></Field>
      </div>
      <Field label="Qulayliklar">
        <div className="flex flex-wrap gap-2">{AMENITIES_LIST.map(a => <button key={a} type="button" onClick={() => toggleAmenity(a)} className="px-3 py-1.5 rounded-full text-[12.5px]" style={{ background: form.amenities.includes(a) ? "#D4783C" : "#16262E", color: form.amenities.includes(a) ? "#16262E" : "#93A5AA", border: "1px solid #2A424C" }}>{a}</button>)}</div>
      </Field>
      <Field label="Tavsif"><textarea rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Uyingiz haqida qisqacha yozing..." style={{ ...inputStyle, resize: "none" }} /></Field>
      <Field label={`Rasmlar (kamida 3 ta) — ${images.length} ta qo'shildi`}>
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <div key={img.url} className="w-16 h-16 rounded-lg overflow-hidden relative">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#D4783C" }}><Trash2 size={11} color="#16262E" /></button>
            </div>
          ))}
          {images.length < 8 && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1" style={{ border: "1.5px dashed #3E5560", color: "#93A5AA" }}>
              <Camera size={18} /><span className="text-[10px]">Qo'shish</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: "#65787E" }}>Telefon galereyasidan yoki kameradan tanlashingiz mumkin</p>
      </Field>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.ownerConfirm} onChange={e => setForm(f => ({ ...f, ownerConfirm: e.target.checked }))} className="mt-0.5 w-4 h-4 shrink-0" />
        <span className="text-[13px]" style={{ color: "#C8D4D6" }}>Men ushbu ko'chmas mulk egasiman (yoki egasining rasmiy vakiliman), <b>rieltor emasman</b> va <Link to="/qoidalar" target="_blank" style={{ color: "#3E92B0" }} onClick={e => e.stopPropagation()}>platforma qoidalariga</Link> roziman.</span>
      </label>
      <button disabled={!valid} onClick={submit} className="w-full py-3.5 rounded-xl font-medium text-[15px]" style={{ background: valid ? "#3E92B0" : "#2A424C", color: valid ? "#0E1B21" : "#65787E" }}>{submitting ? "Yuklanmoqda..." : "E'lonni joylash"}</button>
    </div>
  );
}

function Field({ label, children }) {
  return <div><div className="text-[12px] mb-1.5" style={{ color: "#93A5AA" }}>{label}</div>{children}</div>;
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background: on ? "#3E92B0" : "#2A424C" }}>
      <div className="w-4.5 h-4.5 rounded-full absolute top-[3px] transition-all" style={{ width: 18, height: 18, background: "#F2EDE4", left: on ? 22 : 3 }} />
    </button>
  );
}

function SettingsView({ onBack, lang, setLang, verified, security, setSecurity, onDeleteAccount }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = STR[lang];
  return (
    <div className="pb-10">
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B" }}>
        <button onClick={onBack}><ArrowLeft size={19} color="#F2EDE4" /></button>
        <h2 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>{t.settings}</h2>
      </header>
      <div className="p-4 space-y-5">
        <Section icon={Globe} title={t.language}>
          <div className="flex gap-2">
            {[["uz", "O'zbekcha"], ["ru", "Русский"], ["en", "English"]].map(([code, label]) => (
              <button key={code} onClick={() => setLang(code)} className="flex-1 py-2.5 rounded-lg text-[13px] font-medium" style={{ background: lang === code ? "#3E92B0" : "#16262E", color: lang === code ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>{label}</button>
            ))}
          </div>
        </Section>

        <Section icon={Lock} title={t.security}>
          <div className="space-y-3">
            <Row label="Telefon holati">
              <Badge color={verified ? "#16262E" : "#F2EDE4"} bg={verified ? "#E8B94A" : "#2A424C"}>{verified ? t.verified : t.unverified}</Badge>
            </Row>
            <Row label="Ikki bosqichli tasdiqlash (2FA)"><Toggle on={security.twoFactor} onClick={() => setSecurity(s => ({ ...s, twoFactor: !s.twoFactor }))} /></Row>
            <Row label="Har bir kirishda ogohlantirish"><Toggle on={security.loginAlerts} onClick={() => setSecurity(s => ({ ...s, loginAlerts: !s.loginAlerts }))} /></Row>
            <div className="pt-1 text-[12px]" style={{ color: "#65787E" }}>Faol seans: shu qurilma — hozir onlayn</div>
          </div>
        </Section>

        <Section icon={Bell} title={t.notifications}>
          <div className="space-y-3">
            <Row label="SMS orqali xabar"><Toggle on={security.smsNotif} onClick={() => setSecurity(s => ({ ...s, smsNotif: !s.smsNotif }))} /></Row>
            <Row label="Push bildirishnoma"><Toggle on={security.pushNotif} onClick={() => setSecurity(s => ({ ...s, pushNotif: !s.pushNotif }))} /></Row>
            <Row label="Yangi 'Top' takliflar"><Toggle on={security.promoNotif} onClick={() => setSecurity(s => ({ ...s, promoNotif: !s.promoNotif }))} /></Row>
          </div>
        </Section>

        <Section icon={ShieldAlert} title="Xavfli hudud">
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="w-full py-2.5 rounded-lg text-[13.5px] font-medium" style={{ background: "transparent", color: "#D4783C", border: "1px solid #D4783C" }}>{t.delete} — {"Profilni o'chirish"}</button>
          ) : (
            <div className="space-y-2">
              <p className="text-[12.5px]" style={{ color: "#93A5AA" }}>Aniq o'chirmoqchimisiz? Barcha e'lonlar va ma'lumotlar yo'qoladi.</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setConfirmDelete(false)} className="py-2 rounded-lg text-[13px]" style={{ background: "#2A424C", color: "#F2EDE4" }}>{t.cancel}</button>
                <button onClick={onDeleteAccount} className="py-2 rounded-lg text-[13px] font-medium" style={{ background: "#D4783C", color: "#16262E" }}>{t.delete}</button>
              </div>
            </div>
          )}
        </Section>

        <Section icon={ClipboardList} title="Huquqiy">
          <div className="space-y-2">
            <Link to="/qoidalar" target="_blank" className="flex items-center justify-between py-1"><span className="text-[13px]" style={{ color: "#C8D4D6" }}>Foydalanish qoidalari</span><ChevronRight size={15} color="#65787E" /></Link>
            <Link to="/biz-haqimizda" target="_blank" className="flex items-center justify-between py-1"><span className="text-[13px]" style={{ color: "#C8D4D6" }}>Biz haqimizda</span><ChevronRight size={15} color="#65787E" /></Link>
          </div>
        </Section>
      </div>
    </div>
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
  return <div className="flex items-center justify-between"><span className="text-[13px]" style={{ color: "#C8D4D6" }}>{label}</span>{children}</div>;
}

function AdminPanel({ onBack, listings, reports, setReports, revenue, setStatus, removeListing }) {
  const [tab, setTab] = useState("stats");
  const pending = listings.filter(l => l.status === "pending").length;
  const approved = listings.filter(l => l.status === "approved").length;
  const blocked = listings.filter(l => l.status === "blocked").length;

  const dismissReport = async (id) => {
    setReports(rs => rs.filter(r => r.id !== id));
    await supabase.from("reports").update({ status: "resolved" }).eq("id", id);
  };

  return (
    <div className="pb-10 min-h-screen">
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B" }}>
        <button onClick={onBack}><ArrowLeft size={19} color="#F2EDE4" /></button>
        <h2 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>Admin panel</h2>
      </header>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {[["stats", "Statistika", TrendingUp], ["listings", "E'lonlar", ClipboardList], ["reports", `Shikoyatlar (${reports.length})`, AlertTriangle]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium" style={{ background: tab === id ? "#3E92B0" : "#1E333C", color: tab === id ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="px-4 grid grid-cols-2 gap-3">
          <StatCard icon={ClipboardList} label="Jami e'lonlar" value={listings.length} color="#3E92B0" />
          <StatCard icon={CircleCheck} label="Faol" value={approved} color="#E8B94A" />
          <StatCard icon={AlertTriangle} label="Kutilmoqda" value={pending} color="#D4783C" />
          <StatCard icon={CircleX} label="Bloklangan" value={blocked} color="#93A5AA" />
          <StatCard icon={Users} label="Foydalanuvchilar" value={128} color="#3E92B0" />
          <StatCard icon={TrendingUp} label="Oylik daromad" value={`${fmt(revenue)} so'm`} color="#E8B94A" wide />
        </div>
      )}

      {tab === "listings" && (
        <div className="px-4 space-y-2.5">
          {listings.map(l => (
            <div key={l.id} className="rounded-xl p-3.5" style={box}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[14px] font-medium" style={{ color: "#F2EDE4" }}>{l.title}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#93A5AA" }}>{l.district}, {l.city} · {fmt(l.price)} so'm</div>
                </div>
                <Badge
                  color={l.status === "approved" ? "#16262E" : l.status === "pending" ? "#16262E" : "#F2EDE4"}
                  bg={l.status === "approved" ? "#8FD19E" : l.status === "pending" ? "#E8B94A" : "#65787E"}
                >
                  {l.status === "approved" ? "Faol" : l.status === "pending" ? "Kutilmoqda" : "Bloklangan"}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                {l.status !== "approved" && <button onClick={() => setStatus(l.id, "approved")} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>Tasdiqlash</button>}
                {l.status !== "blocked" && <button onClick={() => setStatus(l.id, "blocked")} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#2A424C", color: "#F2EDE4" }}>Bloklash</button>}
                <button onClick={() => removeListing(l.id)} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "transparent", color: "#D4783C", border: "1px solid #D4783C" }}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="px-4 space-y-2.5">
          {reports.length === 0 ? (
            <div className="text-center py-16"><p className="text-[13.5px]" style={{ color: "#93A5AA" }}>Hozircha shikoyatlar yo'q.</p></div>
          ) : reports.map(r => (
            <div key={r.id} className="rounded-xl p-3.5" style={box}>
              <div className="text-[13.5px] font-medium" style={{ color: "#F2EDE4" }}>{r.listingTitle}</div>
              <div className="text-[12.5px] mt-1" style={{ color: "#D4783C" }}>{r.reason}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setStatus(r.listingId, "blocked"); dismissReport(r.id); }} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#D4783C", color: "#16262E" }}>E'lonni bloklash</button>
                <button onClick={() => dismissReport(r.id)} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#2A424C", color: "#F2EDE4" }}>E'tiborsiz qoldirish</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, wide }) {
  return (
    <div className={`rounded-2xl p-4 ${wide ? "col-span-2" : ""}`} style={box}>
      <Icon size={17} color={color} />
      <div className="text-[19px] font-semibold mt-2 font-mono" style={{ color: "#F2EDE4" }}>{value}</div>
      <div className="text-[11.5px] mt-0.5" style={{ color: "#93A5AA" }}>{label}</div>
    </div>
  );
}

const WEEKDAYS_UZ = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
const MONTHS_UZ = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

function toDateStr(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

function MonthGrid({ viewDate, bookedSet, onToggle }) {
  const year = viewDate.getFullYear(), monthIndex = viewDate.getMonth();
  const first = new Date(year, monthIndex, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Dushanbadan boshlanadi
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="text-center text-[13px] font-medium mb-2.5" style={{ color: "#F2EDE4" }}>{MONTHS_UZ[monthIndex]} {year}</div>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {WEEKDAYS_UZ.map(d => <div key={d} className="text-center text-[10px]" style={{ color: "#65787E" }}>{d}</div>)}
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
function BookingCalendarView({ listingId }) {
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
        <div className="text-[13px] font-medium flex items-center gap-1.5" style={{ color: "#F2EDE4" }}><Ban size={14} color="#D4783C" /> Band kunlar</div>
        <MonthNav viewDate={viewDate} setViewDate={setViewDate} />
      </div>
      <MonthGrid viewDate={viewDate} bookedSet={bookedSet} />
      <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: "#65787E" }}>
        <span className="w-3 h-3 rounded" style={{ background: "#D4783C" }} /> Band <span className="ml-2 w-3 h-3 rounded" style={{ border: "1px solid #2A424C" }} /> Bo'sh
      </div>
    </div>
  );
}

// Uy egasi uchun: band kunlarni belgilash/bekor qilish
function BookingEditorModal({ listingId, onClose }) {
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
          <h3 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>Band kunlarni belgilash</h3>
          <button onClick={onClose}><X size={20} color="#93A5AA" /></button>
        </div>
        <p className="text-[12px] mb-3" style={{ color: "#93A5AA" }}>Kunlarga bosib, band/bo'sh holatini belgilang.</p>
        <MonthNav viewDate={viewDate} setViewDate={setViewDate} />
        <MonthGrid viewDate={viewDate} bookedSet={localBooked} onToggle={toggle} />
        <button onClick={save} disabled={saving} className="w-full mt-4 py-2.5 rounded-lg font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
      </div>
    </div>
  );
}

function MapUnavailable() {
  return (
    <div className="rounded-xl p-4 flex items-center gap-2.5" style={{ background: "#26343A", border: "1px solid #3E5560" }}>
      <Map size={18} color="#65787E" className="shrink-0" />
      <p className="text-[12px]" style={{ color: "#93A5AA" }}>Xarita hozircha sozlanmagan (Yandex Maps kaliti kiritilmagan).</p>
    </div>
  );
}

// PostForm uchun: bosib/sudrab manzilni belgilash
function YandexMapPicker({ lat, lng, onChange }) {
  const ref = useRef(null);
  const objs = useRef({});
  const [failed, setFailed] = useState(!YANDEX_MAPS_API_KEY);

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY) return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !ref.current) return;
      const center = [lat || TASHKENT_CENTER[0], lng || TASHKENT_CENTER[1]];
      const map = new ymaps.Map(ref.current, { center, zoom: 14, controls: ["zoomControl"] });
      const placemark = new ymaps.Placemark(center, {}, { draggable: true, preset: "islands#orangeDotIcon" });
      placemark.events.add("dragend", () => {
        const c = placemark.geometry.getCoordinates();
        onChange(c[0], c[1]);
      });
      map.events.add("click", (e) => {
        const c = e.get("coords");
        placemark.geometry.setCoordinates(c);
        onChange(c[0], c[1]);
      });
      map.geoObjects.add(placemark);
      objs.current = { map, placemark };
    }).catch(() => setFailed(true));
    return () => { cancelled = true; if (objs.current.map) objs.current.map.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return <MapUnavailable />;
  return <div ref={ref} style={{ width: "100%", height: 220, borderRadius: 12, overflow: "hidden", background: "#16262E" }} />;
}

// Qidiruv natijalarini xaritada ko'rsatish
function YandexMapListView({ listings, onOpen }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [failed, setFailed] = useState(!YANDEX_MAPS_API_KEY);

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY) return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !ref.current) return;
      const withCoords = listings.filter(l => l.lat && l.lng);
      const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : TASHKENT_CENTER;
      const map = new ymaps.Map(ref.current, { center, zoom: 11, controls: ["zoomControl"] });
      withCoords.forEach(l => {
        const pm = new ymaps.Placemark([l.lat, l.lng],
          { balloonContentHeader: l.title, balloonContentBody: `${fmt(l.price)} so'm` },
          { preset: "islands#orangeDollarIcon" });
        pm.events.add("click", () => onOpen(l));
        map.geoObjects.add(pm);
      });
      mapRef.current = map;
    }).catch(() => setFailed(true));
    return () => { cancelled = true; if (mapRef.current) mapRef.current.destroy(); };
  }, [listings]);

  if (failed) return <div className="px-4"><MapUnavailable /></div>;
  return <div ref={ref} style={{ width: "100%", height: "calc(100vh - 210px)" }} />;
}

// E'lon sahifasida joylashuvni ko'rsatish (statik, sudralmaydi)
function YandexMapStatic({ lat, lng }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [failed, setFailed] = useState(!YANDEX_MAPS_API_KEY);

  useEffect(() => {
    if (!YANDEX_MAPS_API_KEY || !lat || !lng) return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !ref.current) return;
      const map = new ymaps.Map(ref.current, { center: [lat, lng], zoom: 15, controls: [] });
      map.behaviors.disable(["drag", "scrollZoom"]);
      map.geoObjects.add(new ymaps.Placemark([lat, lng], {}, { preset: "islands#orangeDotIcon" }));
      mapRef.current = map;
    }).catch(() => setFailed(true));
    return () => { cancelled = true; if (mapRef.current) mapRef.current.destroy(); };
  }, [lat, lng]);

  if (!lat || !lng || failed) return null;
  return (
    <div>
      <div className="text-[13px] font-medium mb-2" style={{ color: "#F2EDE4" }}>Manzil</div>
      <div ref={ref} style={{ width: "100%", height: 160, borderRadius: 12, overflow: "hidden", background: "#16262E" }} />
    </div>
  );
}

function AdminLoginModal({ onClose, onSuccess }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(10,17,20,0.7)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5" style={{ background: "#1E333C" }}>
        <div className="flex justify-between items-center mb-4"><h3 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>Admin kirish</h3><button onClick={onClose}><X size={20} color="#93A5AA" /></button></div>
        <input type="password" placeholder="Admin paroli" value={pass} onChange={(e) => { setPass(e.target.value); setError(false); }} className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none mb-1.5" style={inputStyle} />
        <div className="text-[11px] mb-3" style={{ color: "#65787E" }}>Demo parol: {ADMIN_PASSWORD}</div>
        {error && <div className="text-[12.5px] mb-2" style={{ color: "#D4783C" }}>Parol noto'g'ri.</div>}
        <button onClick={() => pass === ADMIN_PASSWORD ? onSuccess() : setError(true)} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>Kirish</button>
      </div>
    </div>
  );
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
  const [filters, setFilters] = useState({ city: CITIES[0], rentType: "Barchasi", propertyType: "Barchasi", sortBy: "new", min: "", max: "", rooms: "Barchasi" });
  const [selected, setSelected] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [verified, setVerified] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("uz");
  const [showSettings, setShowSettings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState([]);
  const [revenue, setRevenue] = useState(340000);
  const [boostTarget, setBoostTarget] = useState(null);
  const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true, smsNotif: true, pushNotif: true, promoNotif: false });
  const [chats, setChats] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [refCode] = useState(() => new URLSearchParams(window.location.search).get("ref"));
  const [profile, setProfile] = useState({ referralCode: "", boostCredits: 0 });
  const [ownerStats, setOwnerStats] = useState({});
  const [savedSearches, setSavedSearches] = useState([]);
  const [bookingEditorId, setBookingEditorId] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const t = STR[lang];

  const switchTab = (id) => { setTab(id); setSelected(null); navigate(TAB_PATHS[id]); };

  // Tugma bosilganda e'lonni ochish: bir zumda ko'rsatish (agar ro'yxatda bo'lsa) + havolani yangilash
  const openListing = (item) => { setSelected(item); navigate(`/elon/${item.id}`); incrementView(item); };
  const closeListing = () => { setSelected(null); navigate(TAB_PATHS[tab] || "/"); };

  // Bazadagi qatorni ilova ishlatadigan shaklga o'giradi
  const mapRow = (row, myId) => {
    const imgs = (row.listing_images || []).slice().sort((a, b) => (a.position || 0) - (b.position || 0)).map(i => i.url);
    let hash = 0;
    for (const ch of String(row.id)) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
    return {
      id: row.id, title: row.title, city: row.city, district: row.district,
      rooms: row.rooms, area: row.area, floor: row.floor, rentType: row.rent_type,
      price: row.price, amenities: row.amenities || [], desc: row.description,
      verified: row.verified, status: row.status, views: row.views || 0,
      boosted: row.boosted, mine: row.owner_id === myId, images: imgs, hue: hash,
      ownerPhone: null, ownerId: row.owner_id, propertyType: row.property_type || "kvartira",
      lat: row.lat ? Number(row.lat) : null, lng: row.lng ? Number(row.lng) : null,
      isOccupied: !!row.is_occupied,
    };
  };

  const fetchListings = async (myId) => {
    setLoadingListings(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(url, position)")
      .order("boosted", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) { console.error("E'lonlarni yuklashda xato:", error.message); setLoadingListings(false); return []; }
    const mapped = (data || []).map(r => mapRow(r, myId));
    setListings(mapped);
    setLoadingListings(false);
    return mapped;
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
      .select("*, listing_images(url, position)")
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
        const { data: profRow } = await supabase.from("profiles").select("referral_code, boost_credits").eq("id", myId).maybeSingle();
        if (profRow) setProfile({ referralCode: profRow.referral_code || "", boostCredits: profRow.boost_credits || 0 });
        // Agar bu foydalanuvchi avval telefonini tasdiqlagan bo'lsa — eslab qolamiz
        if (session.user.phone && session.user.phone_confirmed_at) {
          setVerified(true);
          setPhone("+" + session.user.phone);
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
          return { ...prev, [entry.listingId]: { ...entry, messages: [...entry.messages, { id: m.id, from: "owner", text: m.text }] } };
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
        chatId: c.id, listingId: c.listing_id, listingTitle: c.listings?.title || "E'lon", hue: hash,
        messages: (c.messages || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map(m => ({ id: m.id, from: m.sender_id === myId ? "me" : "owner", text: m.text })),
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
        if (error) { console.error("Chat ochishda xato:", error.message); return; }
        existing = created;
      }
      setChats(prev => ({ ...prev, [item.id]: { chatId: existing.id, listingId: item.id, listingTitle: item.title, hue: item.hue, messages: [] } }));
    }
    setActiveChat(item.id);
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
    if (error) console.error("Xabar yuborishda xato:", error.message);
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
    if (query && !l.title.toLowerCase().includes(query.toLowerCase()) && !l.district.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (a.boosted !== b.boosted) return b.boosted ? 1 : -1; // Top e'lonlar doim birinchi
    if (filters.sortBy === "cheap") return a.price - b.price;
    if (filters.sortBy === "popular") return b.views - a.views;
    return 0; // "new" — Supabase'dan created_at bo'yicha allaqachon tartiblangan, shu tartib saqlanadi
  }), [listings, filters, query]);

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
    if (error) { console.error("Qidiruvni saqlashda xato:", error.message); return; }
    setSavedSearches(prev => [data, ...prev]);
  };

  const deleteSavedSearch = async (id) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    await supabase.from("saved_searches").delete().eq("id", id);
  };

  const toggleOccupied = async (id, current) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, isOccupied: !current } : l));
    const { error } = await supabase.from("listings").update({ is_occupied: !current }).eq("id", id);
    if (error) console.error("Band/bo'sh holatini o'zgartirishda xato:", error.message);
  };

  const handleReport = async (item, reason) => {
    setReports(rs => [...rs, { id: Date.now(), listingId: item.id, listingTitle: item.title, reason }]);
    const { error } = await supabase.from("reports").insert({ listing_id: item.id, reporter_id: userId, reason });
    if (error) console.error("Shikoyat yuborishda xato:", error.message);
  };

  const handleBoost = async (pkgId, price) => {
    const days = pkgId === "30d" ? 30 : 7;
    const boostUntil = new Date(Date.now() + days * 86400000).toISOString();
    const { error } = await supabase.from("listings").update({ boosted: true, boost_until: boostUntil }).eq("id", boostTarget);
    if (error) { console.error("Top qilishda xato:", error.message); setBoostTarget(null); return; }
    await supabase.from("boosts").insert({ listing_id: boostTarget, amount: price, provider: "payme", status: "paid", days });
    setListings(ls => ls.map(l => l.id === boostTarget ? { ...l, boosted: true } : l));
    setRevenue(r => r + price);
    setBoostTarget(null);
  };

  const handleUseCredit = async () => {
    if (profile.boostCredits < 1) return;
    const boostUntil = new Date(Date.now() + 7 * 86400000).toISOString();
    const { error } = await supabase.from("listings").update({ boosted: true, boost_until: boostUntil }).eq("id", boostTarget);
    if (error) { console.error("Kredit bilan Top qilishda xato:", error.message); return; }
    await supabase.from("profiles").update({ boost_credits: profile.boostCredits - 1 }).eq("id", userId);
    await supabase.from("boosts").insert({ listing_id: boostTarget, amount: 0, provider: "credit", status: "paid", days: 7 });
    setListings(ls => ls.map(l => l.id === boostTarget ? { ...l, boosted: true } : l));
    setProfile(p => ({ ...p, boostCredits: p.boostCredits - 1 }));
    setBoostTarget(null);
  };

  const adminSetStatus = async (id, status) => {
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (error) { console.error("Holatni yangilashda xato:", error.message); return; }
    setListings(ls => ls.map(l => l.id === id ? { ...l, status } : l));
    if (status === "approved") {
      const l = listings.find(x => x.id === id);
      if (l) {
        fetch("/api/on-listing-approved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listing: {
              id: l.id, title: l.title, city: l.city, district: l.district,
              rooms: l.rooms, area: l.area, price: l.price, rent_type: l.rentType,
              property_type: l.propertyType, imageUrl: l.images?.[0] || null,
            },
          }),
        }).catch(err => console.error("Bildirishnoma yuborishda xato:", err.message));
      }
    }
  };

  const adminRemoveListing = async (id) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) { console.error("O'chirishda xato:", error.message); return; }
    setListings(ls => ls.filter(l => l.id !== id));
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
        <SettingsView onBack={() => setShowSettings(false)} lang={lang} setLang={setLang} verified={verified} security={security} setSecurity={setSecurity}
          onDeleteAccount={() => { setVerified(false); setPhone(""); setShowSettings(false); }} />
      </div>
    );
  }

  if (showAdmin) {
    return (
      <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
        <GlobalStyle />
        <AdminPanel onBack={() => setShowAdmin(false)} listings={listings} reports={reports} setReports={setReports} revenue={revenue} setStatus={adminSetStatus} removeListing={adminRemoveListing} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <GlobalStyle />
      <MosaicStrip className="h-1.5" />

      {selected ? (
        <DetailView item={selected} onBack={closeListing} verified={verified} onRequestVerify={() => setShowVerify(true)} isFav={favs.has(selected.id)} onToggleFav={toggleFav} onReport={handleReport} onOpenChat={openChat} t={t} similar={similarListings} favs={favs} onOpenSimilar={openListing} />
      ) : (
        <>
          <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center justify-between" style={{ background: "#16262E", borderBottom: "1px solid #22343B" }}>
            <div className="flex items-baseline gap-0.5">
              <span className="font-serif text-[22px] font-semibold" style={{ color: "#F2EDE4" }}>Uy</span>
              <span className="font-serif text-[22px] font-semibold" style={{ color: "#D4783C" }}>24/7</span>
            </div>
            {tab === "browse" ? (
              <div className="flex items-center gap-2 flex-1 max-w-[180px] ml-3 px-3 py-2 rounded-full" style={box}>
                <Search size={15} color="#93A5AA" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Qidirish..." className="bg-transparent outline-none text-[13px] w-full" style={{ color: "#F2EDE4" }} />
              </div>
            ) : <div />}
            <button onClick={() => setShowSettings(true)} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-2" style={box}><SettingsIcon size={16} color="#F2EDE4" /></button>
          </header>

          {tab === "browse" && (
            <>
              <FilterBar filters={filters} setFilters={setFilters} resultsCount={filtered.length} onSaveSearch={saveCurrentSearch} viewMode={viewMode} setViewMode={setViewMode} />
              {viewMode === "map" ? (
                <YandexMapListView listings={filtered} onOpen={openListing} />
              ) : (
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-28 pt-1">
                  {loadingListings ? (
                    <div className="col-span-full text-center py-20"><p className="text-[14px]" style={{ color: "#93A5AA" }}>Yuklanmoqda...</p></div>
                  ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-20"><p className="text-[14px]" style={{ color: "#93A5AA" }}>Bu filtrlar bo'yicha e'lon topilmadi. Filtrni o'zgartirib ko'ring.</p></div>
                  ) : filtered.map(item => <ListingCard key={item.id} item={item} onOpen={openListing} isFav={favs.has(item.id)} onToggleFav={toggleFav} />)}
                </div>
              )}
            </>
          )}

          {tab === "favs" && (
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-28 pt-4">
              {listings.filter(l => favs.has(l.id)).length === 0 ? (
                <div className="col-span-full text-center py-20"><Heart size={32} color="#3E5560" className="mx-auto mb-3" /><p className="text-[14px]" style={{ color: "#93A5AA" }}>Sevimlilar bo'sh. Yoqqan e'lonlarni yurak belgisi bilan saqlang.</p></div>
              ) : listings.filter(l => favs.has(l.id)).map(item => <ListingCard key={item.id} item={item} onOpen={openListing} isFav onToggleFav={toggleFav} />)}
            </div>
          )}

          {tab === "chats" && <ChatsListView chats={chats} onOpen={(c) => setActiveChat(c.listingId)} t={t} />}

          {tab === "post" && <PostForm userId={userId} onPublish={() => { fetchListings(userId); setTab("profile"); }} />}

          {tab === "profile" && (
            <div className="px-4 py-6 pb-28 space-y-4">
              <div className="rounded-2xl p-4 flex items-center gap-3" style={box}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#3E92B0" }}><User size={22} color="#0E1B21" /></div>
                <div className="flex-1">
                  <div className="font-medium text-[15px]" style={{ color: "#F2EDE4" }}>{verified ? phone : t.guest}</div>
                  <div className="text-[12px]" style={{ color: "#93A5AA" }}>{verified ? t.verified : t.unverified}</div>
                </div>
                {verified && <button onClick={() => setVerified(false)} className="flex items-center gap-1 text-[12px]" style={{ color: "#D4783C" }}><LogOut size={13} /> {t.logout}</button>}
              </div>
              {!verified && <button onClick={() => setShowVerify(true)} className="w-full py-3 rounded-xl font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>Raqamni tasdiqlash</button>}

              <div className="rounded-2xl p-4" style={box}>
                <div className="text-[13px] font-medium mb-3" style={{ color: "#F2EDE4" }}>{t.myListings} ({myListings.length})</div>
                {myListings.length === 0 ? (
                  <p className="text-[12.5px]" style={{ color: "#93A5AA" }}>Hali e'lon joylamagansiz.</p>
                ) : (
                  <div className="space-y-2.5">
                    {myListings.map(l => (
                      <div key={l.id} className="p-3 rounded-xl" style={{ background: "#16262E", border: l.isOccupied ? "1px solid #D4783C" : "1px solid #2A424C" }}>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium" style={{ color: "#F2EDE4" }}>{l.title}</span>
                          <div className="flex items-center gap-1.5">
                            {l.isOccupied && <Badge color="#16262E" bg="#D4783C">Band</Badge>}
                            <Badge color={l.status === "approved" ? "#16262E" : "#16262E"} bg={l.status === "approved" ? "#8FD19E" : l.status === "pending" ? "#E8B94A" : "#65787E"}>
                              {l.status === "approved" ? t.approved : l.status === "pending" ? t.pending : t.blocked}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11.5px] flex items-center gap-1" style={{ color: "#93A5AA" }}><Eye size={12} /> {l.views} {t.views}</span>
                          {l.boosted ? (
                            <span className="text-[11px] flex items-center gap-1 font-medium" style={{ color: "#E8B94A" }}><Sparkles size={12} /> TOP faol</span>
                          ) : (
                            <button onClick={() => setBoostTarget(l.id)} className="text-[11.5px] flex items-center gap-1 px-2.5 py-1 rounded-full font-medium" style={{ background: "#D4783C", color: "#16262E" }}><Sparkles size={11} /> {t.boost}</button>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "#65787E" }}><Heart size={11} /> {ownerStats[l.id]?.favCount || 0} sevimliga qo'shgan</span>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "#65787E" }}><MessageCircle size={11} /> {ownerStats[l.id]?.chatCount || 0} kishi yozgan</span>
                        </div>
                        <button onClick={() => toggleOccupied(l.id, l.isOccupied)}
                          className="w-full mt-2 py-1.5 rounded-lg text-[11.5px] font-medium flex items-center justify-center gap-1.5"
                          style={{ background: l.isOccupied ? "#3E92B0" : "#1E333C", color: l.isOccupied ? "#0E1B21" : "#F2EDE4", border: l.isOccupied ? "none" : "1px solid #2A424C" }}>
                          <Ban size={12} /> {l.isOccupied ? "Bo'sh deb belgilash (qidiruvda qayta ko'rinadi)" : "Band deb belgilash (vaqtincha yashirish)"}
                        </button>
                        {l.rentType === "Kunlik" && (
                          <button onClick={() => setBookingEditorId(l.id)} className="w-full mt-1.5 py-1.5 rounded-lg text-[11.5px] font-medium flex items-center justify-center gap-1.5" style={{ background: "#1E333C", color: "#F2EDE4", border: "1px solid #2A424C" }}>
                            <CalendarDays size={12} /> Band kunlarni belgilash
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {verified && (
                <div className="rounded-2xl p-4" style={box}>
                  <div className="text-[13px] font-medium mb-1 flex items-center gap-1.5" style={{ color: "#F2EDE4" }}><Sparkles size={14} color="#E8B94A" /> Do'stingizni taklif qiling</div>
                  <p className="text-[12px] mb-3" style={{ color: "#93A5AA" }}>Har bir taklif qilingan do'stingiz ro'yxatdan o'tsa — ikkalangizga ham bepul "Top e'lon" krediti beriladi.</p>
                  <div className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
                    <span className="font-mono text-[13px]" style={{ color: "#E8B94A" }}>{window.location.origin}/?ref={profile.referralCode}</span>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?ref=${profile.referralCode}`); }} className="shrink-0 ml-2 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: "#3E92B0", color: "#0E1B21" }}>Nusxalash</button>
                  </div>
                  <div className="text-[12.5px]" style={{ color: "#93A5AA" }}>Joriy bonus kredit: <b style={{ color: "#F2EDE4" }}>{profile.boostCredits} ta</b></div>
                </div>
              )}

              {verified && savedSearches.length > 0 && (
                <div className="rounded-2xl p-4" style={box}>
                  <div className="text-[13px] font-medium mb-3" style={{ color: "#F2EDE4" }}>Saqlangan qidiruvlar</div>
                  <div className="space-y-2">
                    {savedSearches.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "#16262E", border: "1px solid #2A424C" }}>
                        <span className="text-[12.5px]" style={{ color: "#C8D4D6" }}>
                          {s.city} · {s.rent_type} · {s.rooms} xona{s.min_price || s.max_price ? ` · ${fmt(s.min_price || 0)}–${fmt(s.max_price || 0)}` : ""}
                        </span>
                        <button onClick={() => deleteSavedSearch(s.id)}><Trash2 size={14} color="#D4783C" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setShowAdminLogin(true)} className="w-full py-3 rounded-xl font-medium text-[13.5px] flex items-center justify-center gap-2" style={{ background: "transparent", color: "#93A5AA", border: "1px dashed #2A424C" }}>
                <Lock size={14} /> {t.adminPanel}
              </button>
            </div>
          )}
        </>
      )}

      {showVerify && (
        <VerifyModal
          onClose={() => setShowVerify(false)}
          onVerified={async (confirmedPhone) => {
            const { data: { session } } = await supabase.auth.getSession();
            const newUserId = session?.user?.id;
            if (newUserId) {
              await supabase.from("profiles").upsert({ id: newUserId, phone: confirmedPhone, phone_verified: true }, { onConflict: "id" });
              // Agar ?ref=KOD bilan kirgan bo'lsa — ikkala tomonga ham bonus kredit beriladi
              if (refCode) {
                const { data: claimed } = await supabase.rpc("claim_referral", { p_ref_code: refCode });
                if (claimed) console.log("Referal bonusi berildi");
              }
              const { data: profRow } = await supabase.from("profiles").select("referral_code, boost_credits").eq("id", newUserId).maybeSingle();
              if (profRow) setProfile({ referralCode: profRow.referral_code || "", boostCredits: profRow.boost_credits || 0 });
              setUserId(newUserId);
              setPhone(confirmedPhone);
              setVerified(true);
              fetchListings(newUserId);
              fetchChats(newUserId);
              fetchFavorites(newUserId);
              fetchSavedSearches(newUserId);
            }
            setShowVerify(false);
          }}
        />
      )}
      {boostTarget && <BoostModal onClose={() => setBoostTarget(null)} onBoost={handleBoost} onUseCredit={handleUseCredit} boostCredits={profile.boostCredits} />}
      {bookingEditorId && <BookingEditorModal listingId={bookingEditorId} onClose={() => setBookingEditorId(null)} />}
      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} onSuccess={() => { setIsAdmin(true); setShowAdminLogin(false); setShowAdmin(true); }} />}

      {!selected && (
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2.5" style={{ background: "#1A2B33", borderTop: "1px solid #22343B" }}>
          {[{ id: "browse", icon: Search, label: t.navSearch }, { id: "chats", icon: MessageCircle, label: t.navChats }, { id: "post", icon: Plus, label: t.navPost }, { id: "favs", icon: Heart, label: t.navFavs }, { id: "profile", icon: User, label: t.navProfile }].map(x => (
            <button key={x.id} onClick={() => switchTab(x.id)} className="flex flex-col items-center gap-1 px-3 py-1">
              <x.icon size={20} color={tab === x.id ? "#D4783C" : "#65787E"} />
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
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
      .font-serif { font-family: 'Fraunces', serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      select { -webkit-appearance: none; appearance: none; }
      body { margin: 0; }
    `}</style>
  );
}
