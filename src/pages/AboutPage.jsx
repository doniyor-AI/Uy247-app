import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, MessageCircle, Ban } from "lucide-react";

const box = { background: "#1E333C", border: "1px solid #2A424C" };

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:'Fraunces',serif;}`}</style>
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B" }}>
        <Link to="/"><ArrowLeft size={19} color="#F2EDE4" /></Link>
        <h1 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>Biz haqimizda</h1>
      </header>

      <div className="max-w-2xl mx-auto p-5 space-y-5">
        <div className="flex items-baseline gap-0.5">
          <span className="font-serif text-3xl font-semibold" style={{ color: "#F2EDE4" }}>Uy</span>
          <span className="font-serif text-3xl font-semibold" style={{ color: "#D4783C" }}>24/7</span>
        </div>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "#C8D4D6" }}>
          Uy24/7 — O'zbekistonda uy-joy ijarasini oddiy va ishonchli qiladigan platforma. Biz uy egalari va ijarachilarni hech qanday vositachisiz to'g'ridan-to'g'ri bog'laymiz.
        </p>

        <div className="grid gap-3">
          <Feature icon={Ban} title="Faqat egalar" text="Rieltor va vositachilar e'lon joylay olmaydi — har bir e'lon egasi tomonidan tasdiqlanadi." />
          <Feature icon={ShieldCheck} title="Tasdiqlangan raqamlar" text="Har bir foydalanuvchi telefon raqami orqali tasdiqlanadi, bu soxta e'lonlarni kamaytiradi." />
          <Feature icon={MessageCircle} title="Xavfsiz muloqot" text="Ichki chat orqali raqamingizni oshkor qilmasdan yozishishingiz mumkin." />
        </div>

        <div className="rounded-xl p-4" style={box}>
          <h2 className="text-[14px] font-medium mb-1.5" style={{ color: "#F2EDE4" }}>Aloqa</h2>
          <p className="text-[13.5px]" style={{ color: "#93A5AA" }}>info@uy247.uz</p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl p-4 flex gap-3" style={box}>
      <Icon size={20} color="#3E92B0" className="shrink-0 mt-0.5" />
      <div>
        <div className="text-[13.5px] font-medium mb-0.5" style={{ color: "#F2EDE4" }}>{title}</div>
        <div className="text-[13px]" style={{ color: "#93A5AA" }}>{text}</div>
      </div>
    </div>
  );
}
