import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PAGE_STR, getPageLang } from "./pageStrings";

const box = { background: "#1E333C", border: "1px solid #2A424C" };

export default function TermsPage() {
  const [lang, setLang] = useState(getPageLang);
  const t = PAGE_STR[lang] || PAGE_STR.uz;

  const switchLang = (l) => {
    setLang(l);
    try { localStorage.setItem("uy247_lang", l); } catch (_) {}
  };

  return (
    <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:'Fraunces',serif;}`}</style>
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
        <Link to="/"><ArrowLeft size={19} color="#F2EDE4" /></Link>
        <h1 className="font-serif text-lg flex-1" style={{ color: "#F2EDE4" }}>{t.termsTitle}</h1>
        <div className="flex rounded-full p-0.5" style={box}>
          {["uz", "ru", "en"].map(l => (
            <button key={l} onClick={() => switchLang(l)} className="px-2.5 py-1 rounded-full text-[11.5px] font-medium uppercase"
              style={{ background: lang === l ? "#3E92B0" : "transparent", color: lang === l ? "#0E1B21" : "#93A5AA" }}>{l}</button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-5 space-y-5" style={{ color: "#C8D4D6" }}>
        <p className="text-[13px]" style={{ color: "#65787E" }}>{t.lastUpdated}</p>

        <Section title={t.t1Title}>{t.t1Body}</Section>
        <Section title={t.t2Title}>{t.t2Body}</Section>
        <Section title={t.t3Title}>{t.t3Body}</Section>
        <Section title={t.t4Title}>{t.t4Body}</Section>
        <Section title={t.t5Title}>{t.t5Body}</Section>
        <Section title={t.t6Title}>
          {t.t6Body} <a href="mailto:info@uy247.uz" style={{ color: "#3E92B0" }}>info@uy247.uz</a>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl p-4" style={box}>
      <h2 className="text-[14px] font-medium mb-2" style={{ color: "#F2EDE4" }}>{title}</h2>
      <p className="text-[13.5px] leading-relaxed">{children}</p>
    </div>
  );
}
