import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const box = { background: "#1E333C", border: "1px solid #2A424C" };

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:'Fraunces',serif;}`}</style>
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center gap-3" style={{ background: "#16262E", borderBottom: "1px solid #22343B" }}>
        <Link to="/"><ArrowLeft size={19} color="#F2EDE4" /></Link>
        <h1 className="font-serif text-lg" style={{ color: "#F2EDE4" }}>Foydalanish qoidalari</h1>
      </header>

      <div className="max-w-2xl mx-auto p-5 space-y-5" style={{ color: "#C8D4D6" }}>
        <p className="text-[13px]" style={{ color: "#65787E" }}>Oxirgi yangilanish: 2026-yil iyul</p>

        <Section title="1. Platforma nimadan iborat">
          Uy24/7 — uy-joy egalari va ijarachilarni to'g'ridan-to'g'ri bog'laydigan platforma. Xizmat faqat ko'chmas mulk egalari (yoki ularning rasmiy vakillari) o'z e'lonlarini joylashi uchun mo'ljallangan. Rieltorlar, vositachilar yoki agentliklar tomonidan e'lon joylash taqiqlanadi.
        </Section>

        <Section title="2. E'lon joylash shartlari">
          E'lon joylayotgan foydalanuvchi mulkka egalik huquqini yoki uni ijaraga berish vakolatini tasdiqlaydi. Noto'g'ri, aldamchi yoki vositachilik maqsadida joylangan e'lonlar admin tomonidan ogohlantirishsiz o'chirilishi va akkaunt bloklanishi mumkin.
        </Section>

        <Section title="3. To'lovlar">
          "Top e'lon" xizmati orqali e'lonni qidiruv natijalarida yuqoriroq ko'rsatish pullik xizmat hisoblanadi. To'lovlar Payme yoki Click orqali amalga oshiriladi. To'langan xizmat muddati tugagach, e'lon oddiy tartibda ko'rsatiladi. Xizmat ko'rsatilgandan so'ng mablag' qaytarilmaydi.
        </Section>

        <Section title="4. Foydalanuvchi ma'lumotlari">
          Telefon raqami faqat identifikatsiya va bog'lanish maqsadida saqlanadi. Platforma foydalanuvchi raqamini uchinchi shaxslarga sotmaydi. Batafsil — Maxfiylik siyosati bilan tanishing.
        </Section>

        <Section title="5. Javobgarlik">
          Platforma faqat egalar va ijarachilarni bog'lash vositasi bo'lib, tomonlar o'rtasidagi shartnoma, to'lov yoki nizolarga bevosita javobgar emas. Bitim shartlarini tekshirish tomonlarning o'z mas'uliyatidadir.
        </Section>

        <Section title="6. Aloqa">
          Savol va shikoyatlar uchun: <a href="mailto:info@uy247.uz" style={{ color: "#3E92B0" }}>info@uy247.uz</a>
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
