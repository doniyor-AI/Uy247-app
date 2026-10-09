import React, { useEffect } from "react";
import { PAGE_STR } from "./pageStrings";
import { PageShell, CompanyCard, DocLinks, usePageLang } from "./LegalPage.jsx";
import { COMPANY } from "../lib/company";

const box = { background: "#1E333C", border: "1px solid #2A424C" };

export default function AboutPage() {
  const [lang, setLang] = usePageLang();
  const t = PAGE_STR[lang] || PAGE_STR.uz;
  useEffect(() => { try { document.title = `${t.aboutTitle} — Uy24/7`; } catch (_) {} }, [t.aboutTitle]);

  return (
    <PageShell title={t.aboutTitle} lang={lang} setLang={setLang}>
      <div className="flex items-baseline gap-0.5 justify-center py-2">
        <span className="font-serif text-3xl font-semibold" style={{ color: "#F2EDE4" }}>Uy</span>
        <span className="font-serif text-3xl font-semibold" style={{ color: "#D4783C" }}>24/7</span>
      </div>

      <p className="text-[14px] leading-relaxed text-center" style={{ color: "#C8D4D6" }}>{t.aboutIntro}</p>

      <Section title={t.a1Title}>{t.a1Body}</Section>
      <Section title={t.a2Title}>{t.a2Body}</Section>
      <Section title={t.a3Title}>{t.a3Body}</Section>
      <Section title={t.a4Title}>
        {t.a4Body} <a href={`mailto:${COMPANY.email}`} style={{ color: "#3E92B0" }}>{COMPANY.email}</a>
      </Section>

      <CompanyCard lang={lang} />
      <DocLinks lang={lang} current="about" />
    </PageShell>
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
