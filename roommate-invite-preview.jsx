import { useState, useRef, useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f172a; --paper: #f0f4ff; --cream: #e8f0fe;
    --amber: #2563eb; --amber-light: #93c5fd; --amber-pale: #eff6ff;
    --teal: #1d4ed8; --teal-light: #3b82f6;
    --rose: #dc2626; --sage: #0369a1; --sage-light: #38bdf8;
    --slate: #334155; --muted: #64748b; --border: #bfdbfe;
    --shadow: 0 2px 16px rgba(15,14,13,0.08);
    --shadow-lg: 0 8px 40px rgba(15,14,13,0.14);
    --radius: 12px; --radius-lg: 20px;
  }
  body { font-family: 'Inter', sans-serif; background: var(--paper); color: var(--ink); min-height: 100vh; }
  h1,h2,h3,h4,h5 { font-family: 'Plus Jakarta Sans', sans-serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .card { background:white; border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow); border:1px solid var(--border); }
  .input-group { display:flex; flex-direction:column; gap:6px; }
  .input-group label { font-size:13px; font-weight:600; color:var(--slate); font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:0.04em; text-transform:uppercase; }
  .input-field { padding:12px 16px; border:1.5px solid var(--border); border-radius:10px; font-family:'Inter',sans-serif; font-size:15px; background:white; transition:border-color 0.2s,box-shadow 0.2s; outline:none; color:var(--ink); }
  .input-field:focus { border-color:var(--amber); box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
  .btn { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.2s; border:none; }
  .btn-primary { background:var(--ink); color:white; }
  .btn-amber { background:var(--amber); color:white; }
  .btn-amber:hover { background:#1d4ed8; transform:translateY(-1px); box-shadow:0 4px 16px rgba(37,99,235,0.35); }
  .btn-rose { background:var(--rose); color:white; }
  .btn-rose:hover { background:#b91c1c; }
  .btn-outline { background:transparent; border:1.5px solid var(--border); color:var(--slate); }
  .btn-outline:hover { border-color:var(--ink); color:var(--ink); }
  .btn-sm { padding:8px 16px; font-size:13px; border-radius:8px; }
  .btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }
  .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:600; font-family:'Plus Jakarta Sans',sans-serif; }
  .badge-amber { background:var(--amber-pale); color:var(--amber); border:1px solid #93c5fd; }
  .form-page { min-height:100vh; display:flex; align-items:flex-start; justify-content:center; padding:40px 24px; background:var(--paper); }
  .form-card { background:white; border-radius:var(--radius-lg); padding:48px; box-shadow:var(--shadow-lg); border:1px solid var(--border); width:100%; max-width:560px; }
  .form-logo { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; font-weight:800; color:var(--ink); margin-bottom:24px; }
  .form-logo span { color:var(--amber); }
  .form-title { font-size:28px; font-weight:800; letter-spacing:-0.03em; margin-bottom:6px; }
  .form-subtitle { font-size:15px; color:var(--muted); margin-bottom:28px; }
  .form-grid { display:grid; gap:18px; }
  .qr-box { background:white; border:2px solid var(--border); border-radius:16px; padding:24px; display:flex; flex-direction:column; align-items:center; gap:12px; }
  .proof-upload { border:2px dashed var(--border); border-radius:12px; padding:32px; text-align:center; cursor:pointer; transition:all 0.2s; }
  .proof-upload:hover { border-color:var(--amber); background:var(--amber-pale); }
  .modal-overlay { position:fixed; inset:0; background:rgba(15,14,13,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn 0.2s; backdrop-filter:blur(4px); }
  .toast { position:fixed; bottom:32px; right:32px; background:var(--ink); color:white; padding:14px 20px; border-radius:12px; font-size:14px; font-weight:500; box-shadow:var(--shadow-lg); z-index:2000; animation:fadeUp 0.3s; display:flex; align-items:center; gap:10px; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:100px; }
  .nav-tabs { display:flex; gap:4px; background:var(--cream); padding:4px; border-radius:12px; margin-bottom:24px; }
  .nav-tab { padding:10px 20px; border-radius:9px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; border:none; background:transparent; color:var(--muted); }
  .nav-tab.active { background:white; color:var(--ink); box-shadow:0 1px 6px rgba(15,14,13,0.1); }
  .success-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px; background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%); }
`;

const HOUSE = {
  name: "Sunrise Villa",
  adminName: "Priya Sharma",
  adminEmail: "priya@email.com",
  address: "42, MG Road, Koramangala, Bengaluru - 560034",
  upiId: "priya.sharma@okicici",
  monthlyRent: 25000,
};
const ROOMMATE = { name: "Rohan Das", email: "rohan@email.com", rentShare: 8500, deposit: 17000 };

const currency = (n) => `₹${n.toLocaleString("en-IN")}`;
const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

function QRCode({ value, size = 120 }) {
  const cells = 9;
  const pattern = Array.from({ length: cells * cells }, (_, i) => {
    const r = Math.floor(i / cells), c = i % cells;
    if ((r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3)) return "finder";
    return ((value.charCodeAt(i % value.length) * 17 + i * 31) % 7) > 3 ? "on" : "off";
  });
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cells},1fr)`, gap:2, width:size, height:size }}>
      {pattern.map((cell, i) => (
        <div key={i} style={{ borderRadius:cell==="finder"?2:1, background:cell==="off"?"#e8f0fe":"#0f172a" }} />
      ))}
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return <div className="toast">✅ {msg}</div>;
}

// ── Agreement Modal ──────────────────────────────────────────────
function AgreementModal({ onClose, onAgree }) {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) setScrolled(true);
  };
  const clauses = [
    ["1. TERM OF TENANCY", `This Agreement commences on the date of signing and continues on a month-to-month basis unless terminated by either party with 30 days written notice. The tenancy is for residential purposes at ${HOUSE.address}.`],
    ["2. RENT & PAYMENT", `The Tenant agrees to pay a monthly rent of ${currency(ROOMMATE.rentShare)} on or before the 5th day of each month. Payment shall be made via UPI to ${HOUSE.upiId}. A late fee of ₹500 applies after the 7th.`],
    ["3. SECURITY DEPOSIT", `The Tenant shall pay a refundable security deposit of ${currency(ROOMMATE.deposit)} prior to occupancy. It covers unpaid rent or damages beyond normal wear and tear, returned within 30 days of vacating after deductions.`],
    ["4. UTILITIES & SHARED EXPENSES", "All electricity, water, internet, and gas bills are shared equally among residents. The Landlord maintains a shared expense ledger accessible to all tenants via the Co-Living Harmony platform."],
    ["5. HOUSE RULES & CONDUCT", "Tenants agree to: (a) Maintain cleanliness and participate in the chore rotation; (b) No disturbances between 10 PM–8 AM; (c) No illegal activity; (d) Written permission required for additional occupants or pets; (e) Respect fellow residents' privacy and property."],
    ["6. MAINTENANCE & REPAIRS", "Tenants keep personal space and common areas clean. Landlord handles structural repairs and major appliances. Minor repairs under ₹500 are the Tenant's responsibility."],
    ["7. SUBLETTING", "No subletting without prior written consent of the Landlord. Unauthorized subletting is grounds for immediate termination."],
    ["8. TERMINATION", "Either party may terminate with 30 days written notice. Landlord may terminate immediately for non-payment, rule violations, or illegal activity. Tenant must vacate and return keys within 48 hours."],
    ["9. GOVERNING LAW", "This Agreement is governed by the laws of India and the specific state of the property. Disputes shall be resolved through mutual discussion first, then local jurisdiction."],
    ["10. ENTIRE AGREEMENT", "This Agreement supersedes all prior negotiations or representations. Any modifications must be in writing and signed by both parties."],
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:620, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"var(--shadow-lg)", animation:"fadeUp 0.3s" }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"22px 28px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"var(--amber-pale)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📄</div>
            <div>
              <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:17 }}>Rental Agreement</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>{HOUSE.name} · Scroll to the bottom to agree</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"var(--muted)" }}>✕</button>
        </div>
        {/* progress bar */}
        <div style={{ height:3, background:"var(--cream)", flexShrink:0 }}>
          <div style={{ height:"100%", background:"var(--amber)", width:scrolled?"100%":"10%", transition:"width 0.4s ease", borderRadius:2 }} />
        </div>
        {/* body */}
        <div onScroll={handleScroll} style={{ overflowY:"auto", padding:"28px 32px", flex:1, fontSize:13.5, lineHeight:1.85, color:"var(--slate)" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:20, color:"var(--ink)", marginBottom:4 }}>RESIDENTIAL RENTAL AGREEMENT</div>
            <div style={{ color:"var(--muted)", fontSize:12 }}>Entered on {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <div style={{ background:"var(--cream)", borderRadius:10, padding:"16px 20px", marginBottom:24, border:"1px solid var(--border)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["Landlord",HOUSE.adminName],["Property",HOUSE.name],["Address",HOUSE.address],["Tenant",ROOMMATE.name]].map(([k,v])=>(
                <div key={k}><div style={{ fontSize:11, color:"var(--muted)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>{k}</div><div style={{ fontWeight:600, fontSize:13 }}>{v}</div></div>
              ))}
            </div>
          </div>
          {clauses.map(([heading,text])=>(
            <div key={heading} style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:13, color:"var(--ink)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>{heading}</div>
              <p style={{ margin:0 }}>{text}</p>
            </div>
          ))}
          <div style={{ borderTop:"2px dashed var(--border)", paddingTop:24, marginTop:8, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {[["Landlord",HOUSE.adminName,HOUSE.adminEmail],["Tenant",ROOMMATE.name,ROOMMATE.email]].map(([role,name,email])=>(
              <div key={role}>
                <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>{role}</div>
                <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:14 }}>{name}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{email}</div>
                <div style={{ marginTop:16, borderTop:"1.5px solid var(--ink)", paddingTop:4, fontSize:11, color:"var(--muted)" }}>Signature</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
          {!scrolled ? (
            <>
              <span style={{ fontSize:12, color:"var(--amber)", fontWeight:600 }}>↓ Scroll to read the full agreement</span>
              <button className="btn btn-outline btn-sm" style={{ marginLeft:"auto" }} onClick={onClose}>Close</button>
            </>
          ) : (
            <>
              <span style={{ flex:1, fontSize:13, color:"var(--sage)", fontWeight:600 }}>✓ You've read the full agreement</span>
              <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
              <button className="btn btn-amber" onClick={()=>{ onAgree(); onClose(); }}>✓ I Agree to the Terms</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Invite Details ────────────────────────────────────────
function StepInvite({ onNext, onDecline }) {
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      {showAgreement && <AgreementModal onClose={()=>setShowAgreement(false)} onAgree={()=>setAgreed(true)} />}
      <div className="form-page" style={{ paddingTop:40 }}>
        <div className="form-card fade-up">
          <div className="form-logo">Co-Living <span>Harmony</span></div>

          {/* House banner */}
          <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)", borderRadius:14, padding:"20px 22px", marginBottom:24, display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ width:52, height:52, borderRadius:12, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🏠</div>
            <div>
              <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:20, color:"white" }}>{HOUSE.name}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:3 }}>{HOUSE.address}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Admin: {HOUSE.adminName}</div>
            </div>
          </div>

          <h2 className="form-title">You're invited! 🎉</h2>
          <p className="form-subtitle"><strong>{HOUSE.adminName}</strong> has invited you to join as a roommate. Review your terms and the rental agreement before accepting.</p>

          {/* Terms */}
          <div style={{ background:"var(--cream)", borderRadius:14, padding:20, marginBottom:18, border:"1px solid var(--border)" }}>
            <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, marginBottom:14, fontSize:12, color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Your Rental Terms</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              {[["Monthly Rent",currency(ROOMMATE.rentShare),"💰"],["Security Deposit",currency(ROOMMATE.deposit),"🔐"]].map(([k,v,icon])=>(
                <div key={k} style={{ background:"white", borderRadius:10, padding:"14px 16px", border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:18, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{k}</div>
                  <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:22, color:"var(--ink)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", background:"var(--amber-pale)", borderRadius:8, border:"1px solid #93c5fd" }}>
              <span style={{ fontSize:13, color:"var(--slate)" }}>First payment due</span>
              <span style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:13, color:"var(--amber)" }}>{currency(ROOMMATE.rentShare+ROOMMATE.deposit)}</span>
            </div>
          </div>

          {/* Agreement */}
          <div style={{ borderRadius:12, border:agreed?"2px solid var(--sage)":"1.5px solid var(--border)", overflow:"hidden", marginBottom:20, transition:"border-color 0.3s" }}>
            <div style={{ background:agreed?"#dbeafe":"white", padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:agreed?"var(--sage)":"var(--cream)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, transition:"background 0.3s" }}>
                {agreed?"✅":"📄"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:14, color:agreed?"var(--sage)":"var(--ink)" }}>
                  {agreed?"Agreement Accepted":"Rental Agreement"}
                </div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>
                  {agreed?"You have read and agreed to all terms":"Read the full rental agreement before accepting"}
                </div>
              </div>
              <button className="btn btn-sm" style={{ background:agreed?"var(--sage)":"var(--ink)", color:"white", flexShrink:0 }} onClick={()=>setShowAgreement(true)}>
                {agreed?"View Again":"📖 Read Agreement"}
              </button>
            </div>
            {!agreed && (
              <div style={{ background:"#fffbeb", padding:"10px 18px", borderTop:"1px solid #fef08a", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14 }}>⚠️</span>
                <span style={{ fontSize:12, color:"#92400e" }}>You must read and agree to the rental agreement before accepting.</span>
              </div>
            )}
          </div>

          {/* UPI info */}
          <div style={{ background:"var(--cream)", borderRadius:10, padding:"12px 16px", marginBottom:20, border:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:20 }}>💳</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"var(--muted)", marginBottom:2 }}>Payment will go to</div>
              <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:14, color:"var(--amber)" }}>{HOUSE.upiId}</div>
            </div>
            <div style={{ fontSize:12, color:"var(--muted)" }}>via UPI</div>
          </div>

          <div style={{ display:"flex", gap:12 }}>
            <button className="btn btn-rose" style={{ flex:1 }} onClick={onDecline}>✕ Decline</button>
            <button className="btn btn-amber" style={{ flex:2, justifyContent:"center" }} disabled={!agreed} onClick={onNext}>
              {agreed?"✓ Accept & Continue →":"Read Agreement First"}
            </button>
          </div>
          {!agreed && <p style={{ textAlign:"center", fontSize:12, color:"var(--muted)", marginTop:10 }}>Click <strong>"Read Agreement"</strong> above, scroll fully, then click "I Agree".</p>}
        </div>
      </div>
    </>
  );
}

// ── Step 2: Create Account ────────────────────────────────────────
function StepSignup({ onNext, onBack }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [touched, setTouched] = useState({ name:false, email:false, password:false });

  const isEmailValid = (value) => /\S+@\S+\.\S+/.test(value);
  const isPasswordValid = (value) => value.length >= 8;

  const nameError = !form.name && touched.name ? "Name is required" : "";
  const emailError = touched.email && !isEmailValid(form.email) ? "Enter a valid email address" : "";
  const passwordError = touched.password && !isPasswordValid(form.password) ? "Password must be at least 8 characters" : "";

  const canContinue = form.name && isEmailValid(form.email) && isPasswordValid(form.password);
  return (
    <div className="form-page" style={{ paddingTop:40 }}>
      <div className="form-card fade-up">
        <div className="form-logo">Co-Living <span>Harmony</span></div>
        <h2 className="form-title">Create your account</h2>
        <p className="form-subtitle">Join {HOUSE.name} as a roommate</p>
        <div className="form-grid">
          {[["Full Name","name","text","Rohan Das"],["Email Address","email","email","you@email.com"],["Password","password","password","Min. 8 characters"]].map(([label,key,type,ph])=>(
            <div key={key} className="input-group">
              <label>{label}</label>
              <input
                className="input-field"
                type={type}
                placeholder={ph}
                value={form[key]}
                onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                onBlur={()=>setTouched(t=>({...t,[key]:true}))}
              />
              {key==="name" && nameError && <span style={{ fontSize:11, color:"var(--rose)" }}>{nameError}</span>}
              {key==="email" && emailError && <span style={{ fontSize:11, color:"var(--rose)" }}>{emailError}</span>}
              {key==="password" && passwordError && <span style={{ fontSize:11, color:"var(--rose)" }}>{passwordError}</span>}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:12, marginTop:24 }}>
          <button className="btn btn-outline" onClick={onBack}>← Back</button>
          <button className="btn btn-amber" style={{ flex:1, justifyContent:"center" }} disabled={!canContinue} onClick={()=>onNext(form)}>
            Continue to Payment →
          </button>
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:"var(--muted)", marginTop:14 }}>Already have an account? <span style={{ color:"var(--teal)", cursor:"pointer", fontWeight:600 }}>Sign in</span></p>
      </div>
    </div>
  );
}

// ── Step 3: Payment ───────────────────────────────────────────────
function StepPayment({ userName, onSubmit, onBack }) {
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const proofRef = useRef(null);
  const total = ROOMMATE.rentShare + ROOMMATE.deposit;

  const handleFile = (file) => {
    if (!file) return;
    setProofFile(file);
    const r = new FileReader();
    r.onload = (ev) => setProofPreview(ev.target.result);
    r.readAsDataURL(file);
  };

  return (
    <div className="form-page" style={{ paddingTop:40 }}>
      <div className="form-card fade-up" style={{ maxWidth:560 }}>
        <div className="form-logo">Co-Living <span>Harmony</span></div>
        <h2 className="form-title">Complete Payment</h2>
        <p className="form-subtitle">Scan the QR or pay via UPI, then upload your screenshot</p>

        {/* Amount breakdown */}
        <div style={{ display:"grid", gap:10, marginBottom:24 }}>
          {[["First Month Rent",ROOMMATE.rentShare],["Security Deposit",ROOMMATE.deposit]].map(([label,amt])=>(
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", background:"var(--amber-pale)", borderRadius:10, border:"1px solid #93c5fd" }}>
              <span style={{ fontSize:14, color:"var(--slate)" }}>{label}</span>
              <span style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:18 }}>{currency(amt)}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", background:"var(--ink)", borderRadius:10 }}>
            <span style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:15, color:"white" }}>Total Due</span>
            <span style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:22, color:"var(--amber-light)" }}>{currency(total)}</span>
          </div>
        </div>

        {/* QR */}
        <div className="qr-box" style={{ marginBottom:22 }}>
          <QRCode value={`upi://pay?pa=${HOUSE.upiId}&am=${total}&tn=Rent+Deposit`} size={140} />
          <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:14, textAlign:"center" }}>Pay {currency(total)} to {HOUSE.adminName}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--cream)", padding:"8px 16px", borderRadius:100, border:"1px solid var(--border)" }}>
            <span style={{ fontSize:16 }}>💳</span>
            <span style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:13, color:"var(--amber)" }}>{HOUSE.upiId}</span>
          </div>
          <div style={{ fontSize:12, color:"var(--muted)" }}>Google Pay · PhonePe · Paytm · Any UPI</div>
        </div>

        {/* Proof upload */}
        <div className="input-group" style={{ marginBottom:20 }}>
          <label>Upload Payment Screenshot <span style={{ color:"var(--rose)", fontSize:12, fontWeight:400, fontFamily:"Inter", textTransform:"none" }}>* required</span></label>
          <input ref={proofRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          {proofPreview ? (
            <div style={{ borderRadius:12, overflow:"hidden", border:"2px solid var(--sage)", position:"relative", cursor:"pointer" }} onClick={()=>proofRef.current.click()}>
              <img src={proofPreview} alt="proof" style={{ width:"100%", maxHeight:200, objectFit:"cover", display:"block" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(3,105,161,0.9)", padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ color:"white", fontFamily:"Plus Jakarta Sans", fontWeight:600, fontSize:13 }}>✓ {proofFile.name}</span>
                <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>Click to replace</span>
              </div>
            </div>
          ) : (
            <div className="proof-upload" onClick={()=>proofRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); handleFile(e.dataTransfer.files[0]);}}>
              <div style={{ fontSize:36, marginBottom:10 }}>📸</div>
              <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:15, marginBottom:4 }}>Upload Payment Screenshot</div>
              <div style={{ fontSize:13, color:"var(--muted)" }}>JPG, PNG · Click or drag & drop</div>
            </div>
          )}
        </div>

        {/* Agreement confirmed */}
        <div style={{ background:"#dbeafe", borderRadius:10, padding:"12px 16px", marginBottom:20, border:"1px solid #93c5fd", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>✅</span>
          <div style={{ fontSize:13, color:"var(--teal)" }}><strong>Agreement signed.</strong> You have accepted the rental terms for {HOUSE.name}.</div>
        </div>

        <div style={{ display:"flex", gap:12 }}>
          <button className="btn btn-outline" onClick={onBack}>← Back</button>
          <button className="btn btn-amber" style={{ flex:1, justifyContent:"center" }} disabled={!proofFile} onClick={()=>onSubmit({proofFile})}>
            🚀 Submit Payment Proof
          </button>
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:"var(--muted)", marginTop:12 }}>Admin will be notified instantly and verify your payment</p>
      </div>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────
function SuccessScreen({ userName }) {
  return (
    <div className="success-screen">
      <div style={{ textAlign:"center", maxWidth:480, animation:"fadeUp 0.6s ease" }}>
        <div style={{ fontSize:72, marginBottom:24, animation:"pulse 2s infinite" }}>🎉</div>
        <h1 style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:36, color:"var(--ink)", letterSpacing:"-0.03em", marginBottom:12 }}>You're all set!</h1>
        <p style={{ fontSize:17, color:"var(--slate)", lineHeight:1.7, marginBottom:32 }}>
          Payment proof submitted successfully. <strong>{HOUSE.adminName}</strong> has been notified and will verify your payment shortly.
        </p>
        <div style={{ background:"white", borderRadius:20, padding:28, marginBottom:32, boxShadow:"0 4px 24px rgba(37,99,235,0.12)", border:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:13, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20 }}>What happens next</div>
          {[
            ["🔍","Admin reviews your payment","Usually within a few hours"],
            ["✅","Payment gets approved","You'll receive a confirmation"],
            ["🏠","Access your dashboard","Manage rent, chores & more"],
          ].map(([icon,title,sub])=>(
            <div key={title} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:"1px solid var(--cream)" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"var(--amber-pale)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:600, fontSize:14 }}>{title}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"linear-gradient(135deg,#1e3a5f,#1d4ed8)", borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:28 }}>🔔</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, color:"white", fontSize:14, marginBottom:4 }}>Admin notified!</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>Priya Sharma received an instant notification about your payment submission for {HOUSE.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step Progress Bar ─────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Invite Details","Create Account","Pay & Submit"];
  const idx = step === "invite" ? 0 : step === "signup" ? 1 : 2;
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:500, background:"white", borderBottom:"1px solid var(--border)", padding:"14px 24px", display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:15, color:"var(--ink)", whiteSpace:"nowrap" }}>Co-Living <span style={{ color:"var(--amber)" }}>Harmony</span></div>
      <div style={{ flex:1, display:"flex", gap:6 }}>
        {steps.map((_,i)=>(
          <div key={i} style={{ flex:1, height:4, borderRadius:100, background:i<=idx?"var(--amber)":"var(--border)", transition:"background 0.35s" }} />
        ))}
      </div>
      <div style={{ fontSize:12, color:"var(--muted)", fontFamily:"Plus Jakarta Sans", fontWeight:600, whiteSpace:"nowrap" }}>
        Step {idx+1} of {steps.length}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("invite"); // invite | signup | payment | success | declined
  const [userInfo, setUserInfo] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  if (screen === "declined") return (
    <div style={{ minHeight:"100vh", background:"var(--ink)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20, padding:40, textAlign:"center" }}>
      <style>{CSS}</style>
      <div style={{ fontSize:64 }}>😔</div>
      <h2 style={{ fontFamily:"Plus Jakarta Sans", fontWeight:800, fontSize:28, color:"white" }}>Invitation Declined</h2>
      <p style={{ color:"rgba(255,255,255,0.6)", fontSize:16 }}>You've declined the invitation to join {HOUSE.name}.</p>
      <button className="btn btn-outline" style={{ color:"white", borderColor:"rgba(255,255,255,0.3)" }} onClick={()=>setScreen("invite")}>← Go back</button>
    </div>
  );

  if (screen === "success") return (
    <>
      <style>{CSS}</style>
      <SuccessScreen userName={userInfo?.name || ROOMMATE.name} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      {screen !== "invite" && <StepBar step={screen} />}
      <div style={{ paddingTop: screen !== "invite" ? 56 : 0 }}>
        {screen === "invite" && (
          <StepInvite
            onNext={()=>setScreen("signup")}
            onDecline={()=>setScreen("declined")}
          />
        )}
        {screen === "signup" && (
          <StepSignup
            onNext={(info)=>{ setUserInfo(info); setScreen("payment"); }}
            onBack={()=>setScreen("invite")}
          />
        )}
        {screen === "payment" && (
          <StepPayment
            userName={userInfo?.name}
            onSubmit={()=>{ showToast("Payment submitted! Admin notified."); setScreen("success"); }}
            onBack={()=>setScreen("signup")}
          />
        )}
      </div>
      {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}
    </>
  );
}
