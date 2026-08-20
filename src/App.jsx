import React, { useState, useEffect } from "react";
import {
  Lock, LogOut, TrendingUp, ClipboardList, AlertTriangle,
  CircleCheck, CircleX, Mail, KeyRound, Smartphone
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

const box = { background: "#1E333C", border: "1px solid #2A424C" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "14px", background: "#16262E", color: "#F2EDE4", border: "1px solid #2A424C", outline: "none" };
const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n);

function Badge({ children, color, bg }) {
  return <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium" style={{ color, background: bg }}>{children}</span>;
}

function Shell({ children, title }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:'Fraunces',serif;}`}</style>
      <div className="w-full max-w-sm">
        <div className="flex items-baseline gap-0.5 justify-center mb-6">
          <span className="font-serif text-2xl font-semibold" style={{ color: "#F2EDE4" }}>Uy</span>
          <span className="font-serif text-2xl font-semibold" style={{ color: "#D4783C" }}>24/7</span>
          <span className="text-[12px] ml-2" style={{ color: "#65787E" }}>Admin</span>
        </div>
        <div className="rounded-2xl p-6" style={box}>
          <h1 className="text-[16px] font-medium mb-4 flex items-center gap-2" style={{ color: "#F2EDE4" }}>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("loading"); // loading | login | mfa-enroll | mfa-challenge | denied | authorized
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [enrollData, setEnrollData] = useState(null);
  const [enrollCode, setEnrollCode] = useState("");
  const [challengeFactorId, setChallengeFactorId] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [challengeCode, setChallengeCode] = useState("");

  const checkAfterLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStage("login"); return; }

    await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setStage("denied");
      return;
    }

    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const totpFactor = factorsData?.totp?.find(f => f.status === "verified");

    if (!totpFactor) {
      const { data: enroll, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (error) { setLoginError(error.message); setStage("login"); return; }
      setEnrollData(enroll);
      setStage("mfa-enroll");
      return;
    }

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal.currentLevel === "aal2") {
      setStage("authorized");
    } else {
      const { data: challenge, error } = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (error) { setLoginError(error.message); setStage("login"); return; }
      setChallengeFactorId(totpFactor.id);
      setChallengeId(challenge.id);
      setStage("mfa-challenge");
    }
  };

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStage("login"); return; }
      await checkAfterLogin();
    })();
  }, []);

  const handleLogin = async () => {
    setLoginError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoginError("Email yoki parol noto'g'ri."); setLoading(false); return; }
    await checkAfterLogin();
    setLoading(false);
  };

  const confirmEnroll = async () => {
    setMfaError(""); setLoading(true);
    const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId: enrollData.id });
    if (chErr) { setMfaError(chErr.message); setLoading(false); return; }
    const { error: verErr } = await supabase.auth.mfa.verify({ factorId: enrollData.id, challengeId: challenge.id, code: enrollCode });
    if (verErr) { setMfaError("Kod noto'g'ri, qayta urinib ko'ring."); setLoading(false); return; }
    setStage("authorized"); setLoading(false);
  };

  const confirmChallenge = async () => {
    setMfaError(""); setLoading(true);
    const { error } = await supabase.auth.mfa.verify({ factorId: challengeFactorId, challengeId, code: challengeCode });
    if (error) { setMfaError("Kod noto'g'ri, qayta urinib ko'ring."); setLoading(false); return; }
    setStage("authorized"); setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setEmail(""); setPassword(""); setChallengeCode(""); setEnrollCode("");
    setStage("login");
  };

  if (stage === "loading") {
    return <Shell title="Yuklanmoqda..."><div /></Shell>;
  }

  if (stage === "denied") {
    return (
      <Shell title={<><Lock size={18} color="#D4783C" /> Ruxsat yo'q</>}>
        <p className="text-[13.5px] mb-4" style={{ color: "#93A5AA" }}>Bu hisobda admin huquqi yo'q. Agar bu xato deb hisoblasangiz, bazada <code style={{ color: "#E8B94A" }}>profiles.is_admin</code> ustunini tekshiring.</p>
        <button onClick={() => setStage("login")} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: "#3E92B0", color: "#0E1B21" }}>Orqaga</button>
      </Shell>
    );
  }

  if (stage === "login") {
    return (
      <Shell title={<><Lock size={18} color="#3E92B0" /> Admin kirish</>}>
        {loginError && <p className="text-[12.5px] mb-3" style={{ color: "#D4783C" }}>{loginError}</p>}
        <div className="space-y-3">
          <div>
            <div className="text-[12px] mb-1.5 flex items-center gap-1.5" style={{ color: "#93A5AA" }}><Mail size={12} /> Email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="admin@uy247.uz" />
          </div>
          <div>
            <div className="text-[12px] mb-1.5 flex items-center gap-1.5" style={{ color: "#93A5AA" }}><KeyRound size={12} /> Parol</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <button onClick={handleLogin} disabled={!email || !password || loading} className="w-full py-2.5 rounded-lg font-medium text-[14px] mt-2" style={{ background: (!email || !password || loading) ? "#2A424C" : "#3E92B0", color: "#0E1B21" }}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </div>
      </Shell>
    );
  }

  if (stage === "mfa-enroll") {
    return (
      <Shell title={<><Smartphone size={18} color="#3E92B0" /> 2FA sozlash</>}>
        <p className="text-[13px] mb-3" style={{ color: "#93A5AA" }}>Birinchi marta kiryapsiz — xavfsizlik uchun ikki bosqichli tasdiqlashni sozlang. Google Authenticator yoki shunga o'xshash ilova bilan quyidagi QR kodni skanerlang.</p>
        {enrollData?.totp?.qr_code && (
          <div className="flex justify-center mb-3 p-3 rounded-xl" style={{ background: "#F2EDE4" }}>
            <img src={enrollData.totp.qr_code} alt="QR kod" style={{ width: 180, height: 180 }} />
          </div>
        )}
        <p className="text-[11px] mb-3 text-center" style={{ color: "#65787E" }}>QR ishlamasa, qo'lda kiriting: <br /><code style={{ color: "#E8B94A" }}>{enrollData?.totp?.secret}</code></p>
        {mfaError && <p className="text-[12.5px] mb-2" style={{ color: "#D4783C" }}>{mfaError}</p>}
        <div className="text-[12px] mb-1.5" style={{ color: "#93A5AA" }}>Ilovada chiqqan 6 xonali kod</div>
        <input value={enrollCode} onChange={e => setEnrollCode(e.target.value)} maxLength={6} className="w-full px-3 py-2.5 rounded-lg text-[20px] tracking-[8px] text-center outline-none mb-3 font-mono" style={inputStyle} placeholder="000000" />
        <button onClick={confirmEnroll} disabled={enrollCode.length < 6 || loading} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: (enrollCode.length < 6 || loading) ? "#2A424C" : "#D4783C", color: "#16262E" }}>
          {loading ? "Tekshirilmoqda..." : "Tasdiqlash va yoqish"}
        </button>
      </Shell>
    );
  }

  if (stage === "mfa-challenge") {
    return (
      <Shell title={<><Smartphone size={18} color="#3E92B0" /> Tasdiqlash kodi</>}>
        <p className="text-[13px] mb-3" style={{ color: "#93A5AA" }}>Authenticator ilovangizdagi 6 xonali kodni kiriting.</p>
        {mfaError && <p className="text-[12.5px] mb-2" style={{ color: "#D4783C" }}>{mfaError}</p>}
        <input value={challengeCode} onChange={e => setChallengeCode(e.target.value)} maxLength={6} className="w-full px-3 py-2.5 rounded-lg text-[20px] tracking-[8px] text-center outline-none mb-3 font-mono" style={inputStyle} placeholder="000000" onKeyDown={e => e.key === "Enter" && confirmChallenge()} />
        <button onClick={confirmChallenge} disabled={challengeCode.length < 6 || loading} className="w-full py-2.5 rounded-lg font-medium text-[14px]" style={{ background: (challengeCode.length < 6 || loading) ? "#2A424C" : "#D4783C", color: "#16262E" }}>
          {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
        </button>
      </Shell>
    );
  }

  return <AdminPanel onLogout={logout} />;
}

function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState("stats");
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = async () => {
    setLoading(true);
    setLoadError("");
    const [{ data: l, error: lErr }, { data: r, error: rErr }] = await Promise.all([
      supabase.from("listings").select("*, listing_images(url,position)").order("created_at", { ascending: false }),
      supabase.from("reports").select("*, listings(title)").eq("status", "open").order("created_at", { ascending: false }),
    ]);
    if (lErr) { console.error("E'lonlarni yuklashda xato:", lErr); setLoadError(lErr.message); }
    if (rErr) { console.error("Shikoyatlarni yuklashda xato:", rErr); setLoadError(prev => prev || rErr.message); }
    setListings(l || []);
    setReports((r || []).map(rep => ({ ...rep, listingTitle: rep.listings?.title || "E'lon" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, status } : l));
    await supabase.from("listings").update({ status }).eq("id", id);
    if (status === "approved") {
      const l = listings.find(x => x.id === id);
      if (l) {
        fetch("https://uy247.uz/api/on-listing-approved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listing: {
              id: l.id, title: l.title, city: l.city, district: l.district,
              rooms: l.rooms, area: l.area, price: l.price, rent_type: l.rent_type,
              property_type: l.property_type, imageUrl: l.listing_images?.[0]?.url || null,
            },
          }),
        }).catch(err => console.error("Bildirishnoma yuborishda xato:", err.message));
      }
    }
  };
  const removeListing = async (id) => {
    setListings(ls => ls.filter(l => l.id !== id));
    await supabase.from("listings").delete().eq("id", id);
  };
  const dismissReport = async (id) => {
    setReports(rs => rs.filter(r => r.id !== id));
    await supabase.from("reports").update({ status: "resolved" }).eq("id", id);
  };
  const blockFromReport = async (reportId, listingId) => {
    await setStatus(listingId, "blocked");
    await dismissReport(reportId);
  };

  const pending = listings.filter(l => l.status === "pending").length;
  const approved = listings.filter(l => l.status === "approved").length;
  const blocked = listings.filter(l => l.status === "blocked").length;

  return (
    <div className="min-h-screen pb-10" style={{ background: "#16262E", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:'Fraunces',serif;}`}</style>
      <header className="sticky top-0 z-20 px-4 py-3.5 flex items-center justify-between" style={{ background: "#16262E", borderBottom: "1px solid #22343B" }}>
        <div className="flex items-baseline gap-0.5">
          <span className="font-serif text-lg font-semibold" style={{ color: "#F2EDE4" }}>Uy</span>
          <span className="font-serif text-lg font-semibold" style={{ color: "#D4783C" }}>24/7</span>
          <span className="text-[11px] ml-2" style={{ color: "#65787E" }}>Admin</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "#D4783C" }}><LogOut size={14} /> Chiqish</button>
      </header>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {[["stats", "Statistika", TrendingUp], ["listings", "E'lonlar", ClipboardList], ["reports", `Shikoyatlar (${reports.length})`, AlertTriangle]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium" style={{ background: tab === id ? "#3E92B0" : "#1E333C", color: tab === id ? "#0E1B21" : "#93A5AA", border: "1px solid #2A424C" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {loadError && (
        <div className="mx-4 mb-3 p-3 rounded-xl text-[12.5px]" style={{ background: "#3A2429", border: "1px solid #6B3A42", color: "#F2C2C2" }}>
          Xato: {loadError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-[14px]" style={{ color: "#93A5AA" }}>Yuklanmoqda...</div>
      ) : (
        <>
          {tab === "stats" && (
            <div className="px-4 grid grid-cols-2 gap-3">
              <StatCard icon={ClipboardList} label="Jami e'lonlar" value={listings.length} color="#3E92B0" />
              <StatCard icon={CircleCheck} label="Faol" value={approved} color="#E8B94A" />
              <StatCard icon={AlertTriangle} label="Kutilmoqda" value={pending} color="#D4783C" />
              <StatCard icon={CircleX} label="Bloklangan" value={blocked} color="#93A5AA" />
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
                    <Badge color={l.status === "approved" ? "#16262E" : l.status === "pending" ? "#16262E" : "#F2EDE4"} bg={l.status === "approved" ? "#8FD19E" : l.status === "pending" ? "#E8B94A" : "#65787E"}>
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
                    <button onClick={() => blockFromReport(r.id, r.listing_id)} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#D4783C", color: "#16262E" }}>E'lonni bloklash</button>
                    <button onClick={() => dismissReport(r.id)} className="flex-1 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#2A424C", color: "#F2EDE4" }}>E'tiborsiz qoldirish</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl p-4" style={box}>
      <Icon size={17} color={color} />
      <div className="text-[19px] font-semibold mt-2 font-mono" style={{ color: "#F2EDE4" }}>{value}</div>
      <div className="text-[11.5px] mt-0.5" style={{ color: "#93A5AA" }}>{label}</div>
    </div>
  );
}
