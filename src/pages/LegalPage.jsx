import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Mail, Phone, Send } from "lucide-react";
import { PAGE_STR, getPageLang } from "./pageStrings";
import { LEGAL_DOCS } from "./legalTexts";
import { COMPANY } from "../lib/company";
import { LEGAL_VERSION, LEGAL_ROUTES, legalDate } from "../lib/legal";

const box = { background: "#1E333C", border: "1px solid #2A424C" };
const LINK = "#3E92B0";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Lora:wght@600;700&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:'Fraunces','Lora',Georgia,serif;}`;

// Sahifa tili: asosiy ilova bilan bir xil manba (uy247_lang)
export function usePageLang() {
  const [lang, setLangState] = useState(getPageLang);
  useEffect(() => { try { document.documentElement.lang = lang; } catch (_) {} }, [lang]);
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("uy247_lang", l); } catch (_) {}
  };
  return [lang, setLang];
}

// Umumiy ramka: sarlavha, orqaga tugmasi, til almashtirgich
export function PageShell({ title, lang, setLang, children }) {
  const navigate = useNavigate();
  const t = PAGE_STR[lang] || PAGE_STR.uz;
  // Qayerdan kelgan bo'lsa — o'sha yerga qaytadi (Sozlamalar, e'lon formasi va h.k.)
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };
  return (
    <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <style>{FONTS}</style>
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
        <button onClick={goBack} aria-label={t.back} className="shrink-0"><ArrowLeft size={19} color="#F2EDE4" /></button>
        <h1 className="font-serif text-[17px] leading-tight flex-1 min-w-0" style={{ color: "#F2EDE4", overflowWrap: "anywhere", hyphens: "auto" }}>{title}</h1>
        <div className="flex rounded-full p-0.5 shrink-0" style={box}>
          {["uz", "ru", "en"].map(l => (
            <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className="px-2.5 py-1 rounded-full text-[11.5px] font-medium uppercase"
              style={{ background: lang === l ? "#3E92B0" : "transparent", color: lang === l ? "#0E1B21" : "#93A5AA" }}>{l}</button>
          ))}
        </div>
      </header>
      <div className="max-w-2xl mx-auto p-5 pb-12 space-y-4" style={{ color: "#C8D4D6" }}>
        {children}
      </div>
    </div>
  );
}

// "[matn](terms)" -> hujjatga havola, "{email}" -> pochta havolasi, "{servers}" -> serverlar davlati
export function RichText({ text, lang = "uz" }) {
  const parts = [];
  const re = /\[([^\]]+)\]\((\w+)\)|\{email\}|\{servers\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[0] === "{email}") parts.push(<a href={`mailto:${COMPANY.email}`} style={{ color: LINK }}>{COMPANY.email}</a>);
    else if (m[0] === "{servers}") parts.push((COMPANY.serverCountries || {})[lang] || (COMPANY.serverCountries || {}).uz || "");
    else parts.push(<Link to={LEGAL_ROUTES[m[2]] || "/"} style={{ color: LINK }}>{m[1]}</Link>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}</>;
}

// Qatorlar: "• " bilan boshlanganlari ketma-ket bo'lsa — bitta ro'yxat
function Paragraphs({ items, lang }) {
  const blocks = [];
  for (const p of items) {
    if (p.startsWith("• ")) {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.list) prev.items.push(p.slice(2));
      else blocks.push({ list: true, items: [p.slice(2)] });
    } else blocks.push({ list: false, text: p });
  }
  return blocks.map((b, i) => b.list ? (
    <ul key={i} className="space-y-1.5 my-2">
      {b.items.map((x, j) => (
        <li key={j} className="flex gap-2"><span aria-hidden="true" style={{ color: "#D4783C" }}>•</span><span className="min-w-0"><RichText text={x} lang={lang} /></span></li>
      ))}
    </ul>
  ) : (
    <p key={i} className="my-2"><RichText text={b.text} lang={lang} /></p>
  ));
}

// Operator rekvizitlari va aloqa (src/lib/company.js)
export function CompanyCard({ lang }) {
  const t = PAGE_STR[lang] || PAGE_STR.uz;
  const rows = [
    [t.reqTin, COMPANY.tin], [t.reqAddress, COMPANY.address], [t.reqDirector, COMPANY.director],
    [t.reqBank, COMPANY.bankName], [t.reqAccount, COMPANY.bankAccount], [t.reqMfo, COMPANY.bankMfo],
  ].filter(([, v]) => v);
  const tg = (COMPANY.telegram || "").replace(/^@/, "");
  return (
    <section className="rounded-xl p-4" style={box} aria-labelledby="company-card-title">
      <h2 id="company-card-title" className="text-[14px] font-medium mb-2" style={{ color: "#F2EDE4" }}>{t.contactsTitle}</h2>
      {COMPANY.name ? (
        <>
          <div className="text-[13.5px] font-medium" style={{ color: "#F2EDE4" }}>{COMPANY.name}</div>
          {rows.length > 0 && (
            <dl className="mt-2 space-y-1 text-[13px]">
              {rows.map(([k, v]) => (
                <div key={k} className="flex gap-2"><dt className="shrink-0" style={{ color: "#93A5AA" }}>{k}:</dt><dd className="min-w-0 break-words">{v}</dd></div>
              ))}
            </dl>
          )}
        </>
      ) : (
        <p className="text-[13px] leading-relaxed" style={{ color: "#93A5AA" }}>{t.reqPending}</p>
      )}
      <div className="mt-3 space-y-2 text-[13.5px]">
        {COMPANY.email && <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2" style={{ color: LINK }}><Mail size={15} /> {COMPANY.email}</a>}
        {COMPANY.phone && <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2" style={{ color: LINK }}><Phone size={15} /> {COMPANY.phone}</a>}
        {tg && <a href={`https://t.me/${tg}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ color: LINK }}><Send size={15} /> @{tg}</a>}
      </div>
    </section>
  );
}

// Boshqa hujjatlarga havolalar
export function DocLinks({ lang, current }) {
  const t = PAGE_STR[lang] || PAGE_STR.uz;
  const items = ["terms", "privacy", "offer"].filter(d => d !== current).map(d => [LEGAL_ROUTES[d], LEGAL_DOCS[d][lang].title]);
  if (current !== "about") items.push([LEGAL_ROUTES.about, t.aboutTitle]);
  return (
    <nav className="rounded-xl p-4" style={box} aria-label={t.otherDocs}>
      <h2 className="text-[14px] font-medium mb-1.5" style={{ color: "#F2EDE4" }}>{t.otherDocs}</h2>
      {items.map(([to, label]) => (
        <Link key={to} to={to} className="flex items-center justify-between py-1.5">
          <span className="text-[13.5px]" style={{ color: "#C8D4D6" }}>{label}</span>
          <ChevronRight size={15} color="#65787E" />
        </Link>
      ))}
    </nav>
  );
}

const scrollTop = () => {
  try { window.scrollTo(0, 0); document.body.scrollTop = 0; document.documentElement.scrollTop = 0; } catch (_) {}
};

// Huquqiy hujjat sahifasi: <LegalPage doc="terms" | "privacy" | "offer" />
export default function LegalPage({ doc }) {
  const [lang, setLang] = usePageLang();
  const t = PAGE_STR[lang] || PAGE_STR.uz;
  const key = LEGAL_DOCS[doc] ? doc : "terms";
  const d = LEGAL_DOCS[key][lang] || LEGAL_DOCS[key].uz;

  useEffect(scrollTop, [key]);
  useEffect(() => { try { document.title = `${d.title} — Uy24/7`; } catch (_) {} }, [d.title]);

  return (
    <PageShell title={d.title} lang={lang} setLang={setLang}>
      <p className="text-[12.5px]" style={{ color: "#65787E" }}>{t.effectiveFrom}: {legalDate(LEGAL_VERSION, lang)}</p>
      <p className="text-[14px] leading-relaxed" style={{ color: "#C8D4D6" }}><RichText text={d.intro} lang={lang} /></p>
      {d.sections.map((s) => (
        <section key={s.h} className="rounded-xl p-4" style={box}>
          <h2 className="text-[14px] font-medium mb-1" style={{ color: "#F2EDE4" }}>{s.h}</h2>
          <div className="text-[13.5px] leading-relaxed"><Paragraphs items={s.p} lang={lang} /></div>
        </section>
      ))}
      <CompanyCard lang={lang} />
      <DocLinks lang={lang} current={key} />
    </PageShell>
  );
}
