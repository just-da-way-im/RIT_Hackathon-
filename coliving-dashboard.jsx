import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');`;

const CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f172a;
    --paper: #f0f4ff;
    --cream: #e8f0fe;
    --amber: #2563eb;
    --amber-light: #93c5fd;
    --amber-pale: #eff6ff;
    --teal: #1d4ed8;
    --teal-light: #3b82f6;
    --rose: #dc2626;
    --rose-light: #f87171;
    --sage: #0369a1;
    --sage-light: #38bdf8;
    --slate: #334155;
    --muted: #64748b;
    --border: #bfdbfe;
    --shadow: 0 2px 16px rgba(15,14,13,0.08);
    --shadow-lg: 0 8px 40px rgba(15,14,13,0.14);
    --radius: 12px;
    --radius-lg: 20px;
  }
  body { font-family: 'Inter', sans-serif; background: var(--paper); color: var(--ink); min-height: 100vh; }
  h1, h2, h3, h4, h5 { font-family: 'Plus Jakarta Sans', sans-serif; }
  
  .app { min-height: 100vh; }
  
  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }

  /* CARDS */
  .card { background: white; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); }
  .card-amber { background: var(--amber-pale); border-color: #bfdbfe; }
  
  /* INPUTS */
  .input-group { display:flex; flex-direction:column; gap:6px; }
  .input-group label { font-size:13px; font-weight:500; color:var(--slate); font-family:'Syne',sans-serif; letter-spacing:0.04em; text-transform:uppercase; }
  .input-field {
    padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px;
    font-family: 'Inter', sans-serif; font-size: 15px; background: white;
    transition: border-color 0.2s, box-shadow 0.2s; outline: none; color: var(--ink);
  }
  .input-field:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
  .input-field::placeholder { color: var(--muted); }
  
  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px;
    border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
    font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; text-decoration: none;
  }
  .btn-primary { background: var(--ink); color: white; }
  .btn-primary:hover { background: #2a2826; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(15,14,13,0.2); }
  .btn-amber { background: var(--amber); color: white; }
  .btn-amber:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.35); }
  .btn-teal { background: var(--teal); color: white; }
  .btn-teal:hover { background: #1e40af; transform: translateY(-1px); }
  .btn-rose { background: var(--rose); color: white; }
  .btn-rose:hover { background: #b91c1c; }
  .btn-sage { background: var(--sage); color: white; }
  .btn-sage:hover { background: #075985; }
  .btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--slate); }
  .btn-outline:hover { border-color: var(--ink); color: var(--ink); }
  .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 8px; }
  .btn-lg { padding: 16px 32px; font-size: 16px; border-radius: 12px; }
  .btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

  /* BADGES */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:600; font-family:'Syne',sans-serif; }
  .badge-amber { background:var(--amber-pale); color:var(--amber); border:1px solid #93c5fd; }
  .badge-teal { background:#dbeafe; color:var(--teal); border:1px solid #93c5fd; }
  .badge-rose { background:#fee2e2; color:var(--rose); border:1px solid #fca5a5; }
  .badge-sage { background:#e0f2fe; color:var(--sage); border:1px solid #7dd3fc; }
  .badge-muted { background:var(--cream); color:var(--muted); border:1px solid var(--border); }

  /* TABS */
  .tabs { display:flex; gap:4px; background:var(--cream); padding:4px; border-radius:12px; }
  .tab { padding:10px 20px; border-radius:9px; font-family:'Syne',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; border:none; background:transparent; color:var(--muted); }
  .tab.active { background:white; color:var(--ink); box-shadow:0 1px 6px rgba(15,23,42,0.1); }
  .tab:hover:not(.active) { color:var(--slate); }

  /* SIDEBAR NAV */
  .sidebar { width:240px; background:var(--ink); min-height:100vh; padding:24px 16px; display:flex; flex-direction:column; gap:4px; position:fixed; top:0; left:0; z-index:100; }
  .sidebar-logo { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:white; padding:12px 16px 24px; letter-spacing:-0.02em; }
  .sidebar-logo span { color:var(--amber-light); }
  .sidebar-section { font-size:11px; font-weight:600; color:rgba(255,255,255,0.3); letter-spacing:0.1em; text-transform:uppercase; padding:16px 16px 8px; }
  .nav-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:10px; font-size:14px; font-weight:500; color:rgba(255,255,255,0.6); cursor:pointer; transition:all 0.2s; border:none; background:transparent; width:100%; text-align:left; }
  .nav-item:hover { background:rgba(255,255,255,0.08); color:white; }
  .nav-item.active { background:var(--amber); color:white; }
  .nav-icon { font-size:18px; width:22px; text-align:center; }

  /* MAIN CONTENT */
  .main { margin-left:240px; padding:40px; min-height:100vh; }
  .page-header { margin-bottom:32px; }
  .page-title { font-size:32px; font-weight:800; color:var(--ink); letter-spacing:-0.03em; }
  .page-subtitle { font-size:15px; color:var(--muted); margin-top:4px; }

  /* STATS GRID */
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .stat-card { background:white; border-radius:var(--radius); padding:22px; border:1px solid var(--border); }
  .stat-label { font-size:12px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em; font-family:'Syne',sans-serif; }
  .stat-value { font-size:32px; font-weight:800; color:var(--ink); font-family:'Syne',sans-serif; margin:6px 0 4px; letter-spacing:-0.03em; }
  .stat-meta { font-size:13px; color:var(--muted); }

  /* TABLE */
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  th { font-family:'Syne',sans-serif; font-size:12px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.06em; padding:12px 16px; text-align:left; border-bottom:1px solid var(--border); }
  td { padding:14px 16px; border-bottom:1px solid var(--cream); font-size:14px; vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:var(--cream); }

  /* AVATAR */
  .avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; flex-shrink:0; }
  .avatar-lg { width:48px; height:48px; font-size:18px; }

  /* QR */
  .qr-box { background:white; border:2px solid var(--border); border-radius:16px; padding:24px; display:flex; flex-direction:column; align-items:center; gap:12px; }
  .qr-grid { display:grid; grid-template-columns:repeat(9,1fr); gap:2px; }
  .qr-cell { aspect-ratio:1; border-radius:1px; }

  /* CHORES */
  .chore-card { background:white; border-radius:12px; padding:18px; border:1px solid var(--border); display:flex; align-items:center; gap:16px; }
  .chore-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }

  /* STATUS DOT */
  .status-dot { width:9px; height:9px; border-radius:50%; display:inline-block; flex-shrink:0; }
  .dot-green { background:#22c55e; box-shadow:0 0 0 2px rgba(34,197,94,0.25); }
  .dot-amber { background:var(--amber); box-shadow:0 0 0 2px rgba(37,99,235,0.25); }
  .dot-rose { background:var(--rose); box-shadow:0 0 0 2px rgba(220,38,38,0.25); }
  .dot-muted { background:var(--border); }

  /* FORM PAGE */
  .form-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 24px; background:var(--paper); }
  .form-card { background:white; border-radius:var(--radius-lg); padding:48px; box-shadow:var(--shadow-lg); border:1px solid var(--border); width:100%; max-width:520px; }
  .form-logo { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--ink); margin-bottom:8px; }
  .form-logo span { color:var(--amber); }
  .form-title { font-size:28px; font-weight:800; letter-spacing:-0.03em; margin-bottom:6px; }
  .form-subtitle { font-size:15px; color:var(--muted); margin-bottom:32px; }
  .form-grid { display:grid; gap:18px; }
  .form-grid-2 { grid-template-columns:1fr 1fr; }
  .divider { display:flex; align-items:center; gap:12px; color:var(--muted); font-size:13px; margin:20px 0; }
  .divider::before, .divider::after { content:''; flex:1; height:1px; background:var(--border); }

  /* EXPENSE LEDGER */
  .expense-row { display:flex; align-items:center; gap:16px; padding:14px 0; border-bottom:1px solid var(--cream); }
  .expense-row:last-child { border-bottom:none; }
  .expense-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }

  /* PROGRESS */
  .progress-bar { height:8px; background:var(--cream); border-radius:100px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:100px; transition:width 0.6s ease; }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(15,14,13,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn 0.2s; backdrop-filter:blur(4px); }
  .modal { background:white; border-radius:var(--radius-lg); padding:40px; max-width:480px; width:100%; box-shadow:var(--shadow-lg); animation:fadeUp 0.3s; }

  /* TOAST */
  .toast { position:fixed; bottom:32px; right:32px; background:var(--ink); color:white; padding:14px 20px; border-radius:12px; font-size:14px; font-weight:500; box-shadow:var(--shadow-lg); z-index:2000; animation:fadeUp 0.3s; display:flex; align-items:center; gap:10px; }

  /* VIBE CARDS */
  .vibe-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
  .vibe-card { background:white; border-radius:14px; padding:22px; border:2px solid transparent; text-align:center; cursor:pointer; transition:all 0.2s; }
  .vibe-card:hover { border-color:var(--amber); }
  .vibe-card.selected { border-color:var(--amber); background:var(--amber-pale); }
  .vibe-emoji { font-size:40px; margin-bottom:10px; }
  .vibe-name { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; margin-bottom:4px; }
  .vibe-desc { font-size:13px; color:var(--muted); }

  /* INVITE LINK BOX */
  .invite-box { background:var(--cream); border:1.5px dashed var(--border); border-radius:10px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .invite-link { font-family:'Inter',sans-serif; font-size:13px; color:var(--teal); word-break:break-all; }

  /* PAYMENT PROOF */
  .proof-upload { border:2px dashed var(--border); border-radius:12px; padding:32px; text-align:center; cursor:pointer; transition:all 0.2s; }
  .proof-upload:hover { border-color:var(--amber); background:var(--amber-pale); }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width:6px; } 
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:100px; }

  /* RESPONSIVE */
  @media (max-width:900px) {
    .sidebar { display:none; }
    .main { margin-left:0; padding:20px; }
    .stats-grid { grid-template-columns:repeat(2,1fr); }
    .form-grid-2 { grid-template-columns:1fr; }
  }
`;

// ─── DATA STORE (in-memory) ───────────────────────────────────────────────────
const INITIAL_DATA = {
  house: {
    id: "h1",
    name: "Sunrise Villa",
    adminName: "Priya Sharma",
    adminEmail: "priya@email.com",
    adminPhone: "+91 98765 43210",
    address: "42, MG Road, Koramangala, Bengaluru - 560034",
    upiId: "priya.sharma@okicici",
    upiApp: "googlepay",
    monthlyRent: 25000,
    status: "active",
    createdAt: "2024-01-15",
  },
  roommates: [
    { id: "r1", name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 99001 12233", rentShare: 8000, deposit: 16000, status: "active", paymentStatus: "paid", inviteAccepted: true, vibe: "free", color: "#1d4ed8", avatarBg: "#dbeafe" },
    { id: "r2", name: "Sneha Patel", email: "sneha@email.com", phone: "+91 98712 34567", rentShare: 8500, deposit: 17000, status: "active", paymentStatus: "pending", inviteAccepted: true, vibe: "busy", color: "#dc2626", avatarBg: "#fee2e2" },
    { id: "r3", name: "Rohan Das", email: "rohan@email.com", phone: "+91 87654 32109", rentShare: 8500, deposit: 17000, status: "invited", paymentStatus: "unpaid", inviteAccepted: false, vibe: "dnd", color: "#2563eb", avatarBg: "#eff6ff" },
  ],
  expenses: [
    { id: "e1", category: "Electricity", amount: 2400, paidBy: "Priya Sharma", date: "2024-02-10", split: true, icon: "⚡", color: "#eff6ff" },
    { id: "e2", category: "Groceries", amount: 3600, paidBy: "Arjun Mehta", date: "2024-02-12", split: true, icon: "🛒", color: "#dbeafe" },
    { id: "e3", category: "Internet", amount: 1200, paidBy: "Sneha Patel", date: "2024-02-08", split: true, icon: "📶", color: "#dbeafe" },
    { id: "e4", category: "Gas", amount: 900, paidBy: "Priya Sharma", date: "2024-02-14", split: true, icon: "🔥", color: "#fee2e2" },
  ],
  chores: [
    { id: "c1", name: "Kitchen Cleaning", icon: "🍳", assignedTo: "Arjun Mehta", frequency: "Daily", nextDue: "Today", status: "pending" },
    { id: "c2", name: "Bathroom", icon: "🚿", assignedTo: "Sneha Patel", frequency: "Every 2 days", nextDue: "Tomorrow", status: "done" },
    { id: "c3", name: "Sweeping", icon: "🧹", assignedTo: "Rohan Das", frequency: "Daily", nextDue: "Today", status: "pending" },
    { id: "c4", name: "Trash", icon: "🗑️", assignedTo: "Priya Sharma", frequency: "Weekly", nextDue: "Sun", status: "pending" },
    { id: "c5", name: "Laundry Room", icon: "👕", assignedTo: "Arjun Mehta", frequency: "Weekly", nextDue: "Sat", status: "done" },
  ],
  payments: [
    { id: "p1", roommate: "Arjun Mehta", amount: 8000, type: "Rent", date: "2024-02-01", status: "approved", proof: true },
    { id: "p2", roommate: "Arjun Mehta", amount: 16000, type: "Deposit", date: "2024-01-20", status: "approved", proof: true },
    { id: "p3", roommate: "Sneha Patel", amount: 8500, type: "Rent", date: "2024-02-03", status: "pending_review", proof: true },
    { id: "p4", roommate: "Sneha Patel", amount: 17000, type: "Deposit", date: "2024-01-21", status: "approved", proof: true },
    { id: "p5", roommate: "Rohan Das", amount: 8500, type: "Rent", date: null, status: "unpaid", proof: false },
    { id: "p6", roommate: "Rohan Das", amount: 17000, type: "Deposit", date: null, status: "unpaid", proof: false },
  ],
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
const currency = (n) => `₹${n.toLocaleString("en-IN")}`;
const vibeConfig = { free: { label: "Free", emoji: "😊", color: "#22c55e", dot: "dot-green" }, busy: { label: "Busy", emoji: "📚", color: "#2563eb", dot: "dot-amber" }, dnd: { label: "Do Not Disturb", emoji: "🔕", color: "#dc2626", dot: "dot-rose" } };

// ─── MINI QR CODE (visual only) ──────────────────────────────────────────────
function QRCode({ value, size = 120 }) {
  const cells = 9;
  const pattern = Array.from({ length: cells * cells }, (_, i) => {
    const r = Math.floor(i / cells), c = i % cells;
    if ((r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3)) return "finder";
    const hash = ((value.charCodeAt(i % value.length) * 17 + i * 31) % 7);
    return hash > 3 ? "on" : "off";
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells},1fr)`, gap: 2, width: size, height: size }}>
      {pattern.map((cell, i) => (
        <div key={i} style={{ borderRadius: cell === "finder" ? 2 : 1, background: cell === "off" ? "#f0ece6" : "#0f0e0d" }} />
      ))}
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast">✓ {msg}</div>;
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onGoAdmin, onGoRoommate, onGoInvite }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, position: "relative", overflow: "hidden" }}>
      {/* bg decoration */}
      <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)" }} />
      
      <div className="fade-up" style={{ textAlign: "center", maxWidth: 620, position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", borderRadius: 100, padding: "8px 20px", marginBottom: 32 }}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, color: "rgba(255,255,255,0.7)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Co-Living Harmony</span>
        </div>
        
        <h1 style={{ fontFamily: "Plus Jakarta Sans", fontSize: "clamp(42px,7vw,72px)", fontWeight: 800, color: "white", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 20 }}>
          Your shared home,<br /><span style={{ color: "var(--amber-light)" }}>beautifully managed.</span>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
          Rent tracking, chore rotation, expense splitting, and roommate vibes — all in one dashboard built for co-living harmony.
        </p>
        
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-amber btn-lg" onClick={onGoAdmin}>
            🏡 Admin — Create a House
          </button>
          <button className="btn btn-lg" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.2)" }} onClick={onGoRoommate}>
            🙋 I'm a Roommate
          </button>
        </div>
        
        <div style={{ marginTop: 64, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[["🔐", "Secure Invites"], ["💳", "UPI Payments"], ["📊", "Expense Ledger"], ["🔄", "Chore Rotation"]].map(([icon, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "Plus Jakarta Sans", fontWeight: 500 }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN REGISTRATION (4 steps) ────────────────────────────────────────────
const EMPTY_ROOMMATE = { name: "", email: "", phone: "", rentShare: "", deposit: "" };

function AdminRegistration({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", houseName: "", rent: "", agreement: null, upiId: "", upiApp: "googlepay", qrFile: null, qrPreview: null });
  const [roommates, setRoomates] = useState([{ ...EMPTY_ROOMMATE, id: Date.now() }]);
  const [sentEmails, setSentEmails] = useState([]);
  const [sending, setSending] = useState(false);
  const agreementRef = useRef(null);
  const qrRef = useRef(null);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setRM = (id, k, v) => setRoomates(p => p.map(r => r.id === id ? { ...r, [k]: v } : r));
  const addRM = () => setRoomates(p => [...p, { ...EMPTY_ROOMMATE, id: Date.now() }]);
  const removeRM = (id) => setRoomates(p => p.filter(r => r.id !== id));

  const stepLabels = ["Your Info", "House Setup", "Add Roommates", "Send Invites"];
  const canNext1 = form.name && form.email && form.phone;
  const canNext2 = form.houseName && form.rent && form.upiId;
  const canNext3 = roommates.length > 0 && roommates.every(r => r.name && r.email && r.rentShare);

  const [allSent, setAllSent] = useState(false);

  const simulateSend = (validList) => {
    if (!validList || validList.length === 0) {
      setAllSent(true);
      return;
    }
    setSending(true);
    setAllSent(false);
    setSentEmails([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < validList.length) {
        const email = validList[i] && validList[i].email;
        if (email) setSentEmails(p => [...p, email]);
        i++;
      } else {
        clearInterval(interval);
        setSending(false);
        setAllSent(true);
      }
    }, 700);
  };

  const handleNext = () => {
    if (step === 1 && canNext1) setStep(2);
    else if (step === 2 && canNext2) setStep(3);
    else if (step === 3 && canNext3) {
      const valid = roommates.filter(r => r.name && r.email);
      setStep(4);
      simulateSend(valid);
    }
    else if (step === 4) onComplete({ ...form, roommates, rent: parseInt(form.rent) });
  };

  return (
    <div className="form-page" style={{ alignItems: "flex-start", paddingTop: 48 }}>
      <div className="form-card fade-up" style={{ maxWidth: step === 3 ? 620 : 520 }}>
        <div className="form-logo">Co-Living <span>Harmony</span></div>

        {/* Step progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 100, background: s <= step ? "var(--amber)" : "var(--border)", transition: "background 0.35s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
          {stepLabels.map((l, i) => (
            <span key={l} style={{ fontSize: 11, fontFamily: "Plus Jakarta Sans", fontWeight: 600, color: i + 1 === step ? "var(--amber)" : i + 1 < step ? "var(--sage)" : "var(--muted)", letterSpacing: "0.03em" }}>
              {i + 1 < step ? "✓ " : ""}{l}
            </span>
          ))}
        </div>

        {/* ── STEP 1: Admin personal info ── */}
        {step === 1 && (
          <>
            <h2 className="form-title">Create your account</h2>
            <p className="form-subtitle">You'll be the admin of your shared house</p>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input className="input-field" placeholder="Priya Sharma" value={form.name} onChange={e => setF("name", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="input-group">
                  <label>Email</label>
                  <input className="input-field" type="email" placeholder="you@email.com" value={form.email} onChange={e => setF("email", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={e => setF("phone", e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Permanent Address</label>
                <textarea className="input-field" rows={2} placeholder="Your home address..." value={form.address} onChange={e => setF("address", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: House setup ── */}
        {step === 2 && (
          <>
            <h2 className="form-title">Set up your house</h2>
            <p className="form-subtitle">Configure your shared living space & payment details</p>
            <div className="form-grid">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div className="input-group">
                  <label>House Name</label>
                  <input className="input-field" placeholder="e.g. Sunrise Villa" value={form.houseName} onChange={e => setF("houseName", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Monthly Rent (₹)</label>
                  <input className="input-field" type="number" placeholder="25000" value={form.rent} onChange={e => setF("rent", e.target.value)} />
                </div>
              </div>

              {/* ── PAYMENT DETAILS SECTION ── */}
              <div style={{ background:"var(--cream)", borderRadius:14, padding:18, border:"1.5px solid var(--border)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"var(--amber)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💳</div>
                  <div>
                    <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:14 }}>Payment Details</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>Roommates will pay rent to this UPI ID</div>
                  </div>
                </div>

                {/* UPI App selector */}
                <div className="input-group" style={{ marginBottom:14 }}>
                  <label>Preferred UPI App</label>
                  <div style={{ display:"flex", gap:10 }}>
                    {[
                      {
                        id: "googlepay", label: "Google Pay",
                        bg: "#fff",
                        selectedBg: "#e8f0fe",
                        selectedBorder: "#4285F4",
                        icon: (
                          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="24" fill="white"/>
                            <text x="24" y="30" textAnchor="middle" fontSize="22" fontFamily="Arial">G</text>
                            <path d="M24 14 C18.5 14 14 18.5 14 24 C14 29.5 18.5 34 24 34 C29.5 34 34 29.5 34 24 L24 24 Z" fill="#4285F4"/>
                            <path d="M24 14 C29.5 14 34 18.5 34 24 L24 24 Z" fill="#EA4335"/>
                            <path d="M14 24 C14 20.5 15.5 17.5 18 15.5 L24 24 Z" fill="#FBBC05"/>
                            <path d="M18 15.5 C20 13.9 22 13 24 14 L24 24 Z" fill="#34A853"/>
                          </svg>
                        )
                      },
                      {
                        id: "phonepe", label: "PhonePe",
                        bg: "#fff",
                        selectedBg: "#f0ebff",
                        selectedBorder: "#5f259f",
                        icon: (
                          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="24" fill="#5f259f"/>
                            <path d="M16 14h10c4.4 0 8 3.6 8 8s-3.6 8-8 8h-4v4l-6-6V14z" fill="white"/>
                            <circle cx="26" cy="22" r="3" fill="#5f259f"/>
                          </svg>
                        )
                      },
                      {
                        id: "paytm", label: "Paytm",
                        bg: "#fff",
                        selectedBg: "#e6f4ff",
                        selectedBorder: "#00B9F1",
                        icon: (
                          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="24" fill="#00B9F1"/>
                            <rect x="12" y="18" width="10" height="12" rx="2" fill="white"/>
                            <rect x="26" y="18" width="10" height="5" rx="2" fill="white"/>
                            <rect x="26" y="25" width="10" height="5" rx="2" fill="white"/>
                          </svg>
                        )
                      },
                      {
                        id: "other", label: "Other UPI",
                        bg: "#fff",
                        selectedBg: "#eff6ff",
                        selectedBorder: "#6366f1",
                        icon: (
                          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="24" fill="#e0e7ff"/>
                            <circle cx="24" cy="24" r="8" fill="none" stroke="#6366f1" strokeWidth="2.5"/>
                            <path d="M24 20v4l3 3" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                        )
                      },
                    ].map(app => {
                      const active = form.upiApp === app.id;
                      return (
                        <button key={app.id} type="button"
                          onClick={() => setF("upiApp", app.id)}
                          style={{
                            flex:1, padding:"12px 6px 10px", borderRadius:12, cursor:"pointer",
                            border: active ? `2px solid ${app.selectedBorder}` : "1.5px solid var(--border)",
                            background: active ? app.selectedBg : "white",
                            transition:"all 0.18s", display:"flex", flexDirection:"column",
                            alignItems:"center", gap:6, outline:"none",
                            boxShadow: active ? `0 0 0 3px ${app.selectedBorder}22` : "none",
                          }}
                        >
                          {app.icon}
                          <span style={{
                            fontSize:11, fontFamily:"Plus Jakarta Sans", fontWeight:700,
                            color: active ? app.selectedBorder : "var(--slate)",
                            letterSpacing:"0.02em"
                          }}>{app.label}</span>
                          {active && (
                            <span style={{
                              width:6, height:6, borderRadius:"50%",
                              background: app.selectedBorder, display:"block"
                            }}/>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* UPI ID input */}
                <div className="input-group" style={{ marginBottom:14 }}>
                  <label>UPI ID <span style={{ color:"var(--rose)", fontSize:12 }}>*required</span></label>
                  <div style={{ position:"relative" }}>
                    <input
                      className="input-field"
                      placeholder="yourname@okicici / 9876543210@upi"
                      value={form.upiId}
                      onChange={e => setF("upiId", e.target.value)}
                      style={{ paddingRight: form.upiId ? 44 : 16 }}
                    />
                    {form.upiId && (
                      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"var(--sage)", fontSize:18 }}>✓</div>
                    )}
                  </div>
                  {form.upiId && (
                    <div style={{ fontSize:12, color:"var(--teal)", marginTop:4, display:"flex", alignItems:"center", gap:5 }}>
                      <span>🔗</span> Roommates will pay to: <strong>{form.upiId}</strong>
                    </div>
                  )}
                </div>

                {/* QR Code upload */}
                <div className="input-group">
                  <label>UPI QR Code Image <span style={{ color:"var(--muted)", fontSize:12, fontWeight:400, fontFamily:"Inter" }}>— optional but recommended</span></label>
                  <input
                    ref={qrRef}
                    type="file"
                    accept="image/*"
                    style={{ display:"none" }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setF("qrFile", file);
                      const reader = new FileReader();
                      reader.onload = ev => setF("qrPreview", ev.target.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                  {form.qrPreview ? (
                    <div
                      onClick={() => qrRef.current.click()}
                      style={{ display:"flex", alignItems:"center", gap:16, background:"white", border:"2px solid var(--teal)", borderRadius:12, padding:"14px 16px", cursor:"pointer" }}
                    >
                      <img src={form.qrPreview} alt="UPI QR"
                        style={{ width:72, height:72, objectFit:"cover", borderRadius:8, border:"1px solid var(--border)" }} />
                      <div>
                        <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:700, fontSize:14, color:"var(--teal)", marginBottom:4 }}>✅ QR Code uploaded</div>
                        <div style={{ fontSize:12, color:"var(--muted)" }}>{form.qrFile?.name}</div>
                        <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>Click to replace</div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="proof-upload"
                      style={{ padding:"20px 16px" }}
                      onClick={() => qrRef.current.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (!file) return;
                        setF("qrFile", file);
                        const reader = new FileReader();
                        reader.onload = ev => setF("qrPreview", ev.target.result);
                        reader.readAsDataURL(file);
                      }}
                    >
                      <div style={{ fontSize:28, marginBottom:6 }}>📲</div>
                      <div style={{ fontFamily:"Plus Jakarta Sans", fontWeight:600, fontSize:14 }}>Upload your UPI QR Code</div>
                      <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>Screenshot from Google Pay / PhonePe · JPG, PNG</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Agreement upload */}
              <div className="input-group">
                <label>Agreement File <span style={{ color:"var(--muted)", fontSize:12, fontWeight:400, fontFamily:"Inter" }}>— PDF, optional</span></label>
                <input ref={agreementRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
                  onChange={e => { if (e.target.files[0]) setF("agreement", e.target.files[0]); }} />
                <div className="proof-upload"
                  onClick={() => agreementRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") setF("agreement", f); }}
                  style={form.agreement ? { borderColor: "var(--teal)", background: "#dbeafe", padding:"20px 16px" } : { padding:"20px 16px" }}
                >
                  {form.agreement ? (
                    <><div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--teal)" }}>{form.agreement.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{(form.agreement.size/1024).toFixed(1)} KB · Click to replace</div></>
                  ) : (
                    <><div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 14 }}>Upload Agreement PDF</div>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Click to browse or drag & drop</div></>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 3: Add Roommates ── */}
        {step === 3 && (
          <>
            <h2 className="form-title">Add Roommates</h2>
            <p className="form-subtitle">Enter details for each person joining <strong>{form.houseName || "your house"}</strong>. Invite emails will be sent in the next step.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
              {roommates.map((r, idx) => (
                <div key={r.id} style={{ background: "var(--cream)", borderRadius: 14, padding: 18, border: "1.5px solid var(--border)", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--slate)" }}>
                      Roommate {idx + 1}
                    </div>
                    {roommates.length > 1 && (
                      <button onClick={() => removeRM(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rose)", fontSize: 18, lineHeight: 1, padding: "0 2px" }} title="Remove">✕</button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                      <label>Full Name *</label>
                      <input className="input-field" placeholder="Arjun Mehta" value={r.name} onChange={e => setRM(r.id, "name", e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Email *</label>
                      <input className="input-field" type="email" placeholder="arjun@email.com" value={r.email} onChange={e => setRM(r.id, "email", e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <input className="input-field" placeholder="+91 99001 12233" value={r.phone} onChange={e => setRM(r.id, "phone", e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Rent Share (₹) *</label>
                      <input className="input-field" type="number" placeholder="8000" value={r.rentShare} onChange={e => setRM(r.id, "rentShare", e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Security Deposit (₹)</label>
                      <input className="input-field" type="number" placeholder="16000" value={r.deposit} onChange={e => setRM(r.id, "deposit", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" style={{ width: "100%", marginTop: 14, justifyContent: "center" }} onClick={addRM}>
              + Add Another Roommate
            </button>
          </>
        )}

        {/* ── STEP 4: Send invite emails ── */}
        {step === 4 && (
          <>
            <h2 className="form-title">{sending ? "📨 Sending Invites…" : allSent ? "✅ Invites Sent Successfully!" : "Preparing…"}</h2>
            <p className="form-subtitle">
              {sending
                ? "Hold on — sending personalised invite emails to your roommates…"
                : allSent
                  ? `${roommates.filter(r=>r.email).length} invitation${roommates.filter(r=>r.email).length!==1?"s":""} delivered! Each roommate will receive a unique link to accept and join ${form.houseName}.`
                  : ""}
            </p>

            {/* Email preview card */}
            <div style={{ background: "white", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ background: "var(--ink)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📧</span>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, color: "white", fontSize: 13 }}>Invite Email Preview</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Sent from noreply@coliving.app</div>
                </div>
              </div>
              <div style={{ padding: "18px 20px", fontSize: 13, lineHeight: 1.7, color: "var(--slate)" }}>
                <div style={{ marginBottom: 8 }}><strong>Subject:</strong> 🏠 You're invited to join <em>{form.houseName}</em></div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  Hi <strong>[Roommate Name]</strong>,<br /><br />
                  <strong>{form.name}</strong> has invited you to join <strong>{form.houseName}</strong> as a roommate.<br /><br />
                  Your monthly rent share is <strong>₹[rent share]</strong> with a security deposit of <strong>₹[deposit]</strong>.<br /><br />
                  After accepting, please complete your payment via UPI:
                </div>
                {/* UPI payment info in email */}
                <div style={{ margin: "14px 0", background: "var(--amber-pale)", border: "1px solid #93c5fd", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28 }}>💳</div>
                  <div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Pay via UPI</div>
                    <div style={{ fontSize: 13 }}>UPI ID: <strong style={{ color: "var(--amber)", letterSpacing: "0.02em" }}>{form.upiId || "upi-id@bank"}</strong></div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                      {form.upiApp === "googlepay" ? "Google Pay" : form.upiApp === "phonepe" ? "PhonePe" : form.upiApp === "paytm" ? "Paytm" : "Any UPI app"} accepted
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 4 }}>
                  <div style={{ display: "inline-block", background: "var(--amber)", color: "white", padding: "10px 22px", borderRadius: 8, fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13 }}>
                    👉 Accept Invitation
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
                  Or copy this link: https://coliving.app/invite/{form.houseName?.toLowerCase().replace(/\s+/g,"-") || "house"}/[token]
                </div>
              </div>
            </div>

            {/* Per-roommate send status */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {roommates.filter(r => r.name && r.email).map(r => {
                const sent = sentEmails.includes(r.email);
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: sent ? "#dbeafe" : "var(--cream)", borderRadius: 10, border: `1.5px solid ${sent ? "#38bdf8" : "var(--border)"}`, transition: "all 0.4s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: sent ? "var(--sage)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, transition: "background 0.4s", flexShrink: 0 }}>
                      {sent ? "✓" : initials(r.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.email}</div>
                    </div>
                    <div style={{ fontSize: 12, fontFamily: "Plus Jakarta Sans", fontWeight: 600, color: sent ? "var(--sage)" : "var(--muted)" }}>
                      {sent ? "✉ Sent" : sending ? "⏳ Sending…" : "⏳ Queued"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── ALL SENT SUCCESS BANNER ── */}
            {allSent && (
              <div style={{
                marginTop: 20,
                background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
                border: "2px solid #93c5fd",
                borderRadius: 16,
                padding: "22px 24px",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
                animation: "fadeUp 0.5s ease both"
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--sage)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0
                }}>✅</div>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 17, color: "var(--sage)", marginBottom: 6 }}>
                    Invitation requests sent!
                  </div>
                  <div style={{ fontSize: 14, color: "#1e3a5f", lineHeight: 1.65 }}>
                    All <strong>{roommates.filter(r => r.email).length} roommate{roommates.filter(r=>r.email).length!==1?"s":""}</strong> have been emailed their personal invite link for <strong>{form.houseName}</strong>.
                    They can now click the link to create an account, review the agreement, and complete payment.
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    {roommates.filter(r => r.name && r.email).map(r => (
                      <div key={r.id} style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: "white", borderRadius: 100,
                        padding: "5px 12px 5px 6px",
                        border: "1px solid #38bdf8",
                        fontSize: 13
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: "var(--sage)", color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 10
                        }}>{initials(r.name)}</div>
                        <span style={{ fontWeight: 500 }}>{r.name.split(" ")[0]}</span>
                        <span style={{ color: "var(--sage)", fontSize: 12 }}>✉</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          {step > 1 && step < 4 && (
            <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <button
            className="btn btn-amber"
            style={{ flex: 1, justifyContent: "center" }}
            disabled={
              (step === 1 && !canNext1) ||
              (step === 2 && !canNext2) ||
              (step === 3 && !canNext3) ||
              (step === 4 && sending)
            }
            onClick={handleNext}
          >
            {step === 1 && "Continue →"}
            {step === 2 && "Continue →"}
            {step === 3 && `Send ${roommates.filter(r=>r.name&&r.email).length} Invite${roommates.filter(r=>r.name&&r.email).length!==1?"s":""} →`}
            {step === 4 && (sending ? "Sending…" : "🏠 Go to Dashboard")}
          </button>
        </div>

        {step === 1 && (
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
            Already have an account? <span style={{ color: "var(--teal)", cursor: "pointer", fontWeight: 500 }} onClick={() => onComplete(null, true)}>Sign in</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AGREEMENT MODAL ─────────────────────────────────────────────────────────
function AgreementModal({ house, roommate, onClose, onAgree }) {
  const [scrolled, setScrolled] = useState(false);
  const bodyRef = useRef(null);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) setScrolled(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-lg)", animation: "fadeUp 0.3s" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--amber-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📄</div>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 17 }}>Rental Agreement</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{house.name} · Scroll to read fully</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--muted)", lineHeight: 1 }}>✕</button>
        </div>

        {/* Scroll progress bar */}
        <div style={{ height: 3, background: "var(--cream)" }}>
          <div style={{ height: "100%", background: "var(--amber)", width: scrolled ? "100%" : "0%", transition: "width 0.4s ease", borderRadius: 2 }} />
        </div>

        {/* Agreement body */}
        <div ref={bodyRef} onScroll={handleScroll} style={{ overflowY: "auto", padding: "28px 32px", flex: 1, fontSize: 13.5, lineHeight: 1.85, color: "var(--slate)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, color: "var(--ink)", marginBottom: 4 }}>RESIDENTIAL RENTAL AGREEMENT</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>This agreement is entered into on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>

          <div style={{ background: "var(--cream)", borderRadius: 10, padding: "16px 20px", marginBottom: 24, border: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Landlord / Admin", house.adminName], ["Property", house.name], ["Address", house.address], ["Tenant", roommate.name]].map(([k, v]) => (
                <div key={k}><div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{k}</div><div style={{ fontWeight: 600, fontSize: 13 }}>{v}</div></div>
              ))}
            </div>
          </div>

          {[
            ["1. TERM OF TENANCY", `This Agreement commences on the date of signing and shall continue on a month-to-month basis unless terminated by either party with 30 (thirty) days written notice. The tenancy is for residential purposes at ${house.address}.`],
            ["2. RENT & PAYMENT", `The Tenant agrees to pay a monthly rent of ${currency(roommate.rentShare)} (Rupees ${roommate.rentShare.toLocaleString("en-IN")} only) on or before the 5th day of each calendar month. Payment shall be made via UPI to ${house.upiId}. A late fee of ₹500 shall be charged for payments received after the 7th of the month.`],
            ["3. SECURITY DEPOSIT", `The Tenant shall pay a refundable security deposit of ${currency(roommate.deposit)} prior to occupancy. This deposit shall be held by the Landlord to cover any damage to the property beyond normal wear and tear, or unpaid rent. The deposit shall be returned within 30 days of vacating, minus any lawful deductions.`],
            ["4. UTILITIES & SHARED EXPENSES", "All electricity, water, internet, and gas bills shall be shared equally among all residents unless otherwise mutually agreed. The Landlord shall maintain a shared expense ledger accessible to all tenants via the Co-Living Harmony platform."],
            ["5. HOUSE RULES & CONDUCT", "Tenants agree to: (a) Maintain cleanliness and participate in the agreed chore rotation schedule; (b) Refrain from causing disturbances between 10:00 PM and 8:00 AM; (c) Not engage in any illegal activity on the premises; (d) Obtain written permission before bringing in additional occupants or pets; (e) Respect the privacy and property of fellow residents."],
            ["6. MAINTENANCE & REPAIRS", "Tenants are responsible for keeping their personal space and common areas clean. The Landlord shall be responsible for structural repairs and major appliance maintenance. Tenants must report any maintenance issues promptly via the platform. Minor repairs under ₹500 shall be the Tenant's responsibility."],
            ["7. SUBLETTING", "The Tenant shall not sublet or assign this agreement or any part thereof without prior written consent of the Landlord. Unauthorized subletting shall be grounds for immediate termination of this agreement."],
            ["8. TERMINATION", "Either party may terminate this agreement with 30 days written notice. The Landlord may terminate immediately in cases of non-payment of rent, violation of house rules, or illegal activity. Upon termination, the Tenant must vacate the premises and return all keys within 48 hours."],
            ["9. GOVERNING LAW", "This Agreement shall be governed by and construed in accordance with the laws of India and the specific state in which the property is located. Any disputes arising shall first be resolved through mutual discussion, failing which, shall be subject to local jurisdiction."],
            ["10. ENTIRE AGREEMENT", "This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements. Any modifications must be in writing and signed by both parties."],
          ].map(([heading, text]) => (
            <div key={heading} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, color: "var(--ink)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{heading}</div>
              <p style={{ margin: 0 }}>{text}</p>
            </div>
          ))}

          <div style={{ borderTop: "2px dashed var(--border)", paddingTop: 24, marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[["Landlord / Admin", house.adminName, house.adminEmail], ["Tenant", roommate.name, roommate.email]].map(([role, name, email]) => (
              <div key={role}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{role}</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14 }}>{name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{email}</div>
                <div style={{ marginTop: 16, borderTop: "1.5px solid var(--ink)", paddingTop: 4, fontSize: 11, color: "var(--muted)" }}>Signature</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 28px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {!scrolled && (
            <div style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              ↓ Scroll to read the full agreement
            </div>
          )}
          {scrolled && (
            <>
              <div style={{ flex: 1, fontSize: 13, color: "var(--sage)", fontWeight: 600 }}>✓ You've read the full agreement</div>
              <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
              <button className="btn btn-amber" onClick={() => { onAgree(); onClose(); }}>✓ I Agree to the Terms</button>
            </>
          )}
          {!scrolled && <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }} onClick={onClose}>Close</button>}
        </div>
      </div>
    </div>
  );
}

// ─── ROOMMATE INVITE PAGE ─────────────────────────────────────────────────────
function RoommateInvite({ onAccept, onReject }) {
  const [step, setStep] = useState("view"); // view | signup | payment | done
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const proofRef = useRef(null);

  const house = INITIAL_DATA.house;
  const roommate = INITIAL_DATA.roommates[2]; // Rohan (invited)

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProofDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Step indicator ──
  const steps = ["Invite Details", "Create Account", "Pay & Submit"];
  const stepIdx = step === "view" ? 0 : step === "signup" ? 1 : 2;

  const StepBar = () => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i <= stepIdx ? "var(--amber)" : "var(--border)", transition: "background 0.35s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {steps.map((l, i) => (
          <span key={l} style={{ fontSize: 11, fontFamily: "Plus Jakarta Sans", fontWeight: 600, color: i === stepIdx ? "var(--amber)" : i < stepIdx ? "var(--sage)" : "var(--muted)" }}>
            {i < stepIdx ? "✓ " : ""}{l}
          </span>
        ))}
      </div>
    </div>
  );

  // ── Payment step ──
  if (step === "payment") return (
    <div className="form-page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="form-card fade-up" style={{ maxWidth: 560 }}>
        <div className="form-logo">Co-Living <span>Harmony</span></div>
        <StepBar />
        <h2 className="form-title">Complete Payment</h2>
        <p className="form-subtitle">Scan the QR or pay via UPI, then upload your screenshot</p>

        <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
          {[["First Month Rent", roommate.rentShare, "var(--amber-pale)", "#93c5fd"], ["Security Deposit", roommate.deposit, "var(--amber-pale)", "#93c5fd"]].map(([label, amount, bg, border]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", background: bg, borderRadius: 10, border: `1px solid ${border}` }}>
              <span style={{ fontSize: 14, color: "var(--slate)" }}>{label}</span>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18 }}>{currency(amount)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "var(--ink)", borderRadius: 10 }}>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, color: "white" }}>Total Due</span>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: "var(--amber-light)" }}>{currency(roommate.rentShare + roommate.deposit)}</span>
          </div>
        </div>

        {/* UPI QR */}
        <div className="qr-box" style={{ marginBottom: 22 }}>
          <QRCode value={`upi://pay?pa=${house.upiId}&am=${roommate.rentShare + roommate.deposit}&tn=Rent+Deposit`} size={140} />
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, textAlign: "center" }}>
            Pay {currency(roommate.rentShare + roommate.deposit)} to {house.adminName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--cream)", padding: "8px 16px", borderRadius: 100, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 16 }}>💳</span>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, color: "var(--amber)" }}>{house.upiId}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Google Pay · PhonePe · Paytm · Any UPI app</div>
        </div>

        {/* Proof upload */}
        <div className="input-group" style={{ marginBottom: 22 }}>
          <label>Upload Payment Screenshot <span style={{ color: "var(--rose)", fontSize: 12 }}>* required</span></label>
          <input ref={proofRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleProofChange} />
          {proofPreview ? (
            <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid var(--sage)", position: "relative", cursor: "pointer" }} onClick={() => proofRef.current.click()}>
              <img src={proofPreview} alt="Payment proof" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(3,105,161,0.88)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "white", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13 }}>✓ {proofFile.name}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Click to replace</span>
              </div>
            </div>
          ) : (
            <div className="proof-upload" onClick={() => proofRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={handleProofDrop}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Upload Payment Screenshot</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>JPG, PNG · Click or drag & drop</div>
            </div>
          )}
        </div>

        {/* Agreed summary */}
        <div style={{ background: "#dbeafe", borderRadius: 10, padding: "12px 16px", marginBottom: 20, border: "1px solid #93c5fd", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <div style={{ fontSize: 13, color: "var(--teal)" }}>
            <strong>Agreement signed.</strong> You have accepted the rental terms for {house.name}.
          </div>
        </div>

        <button className="btn btn-amber" style={{ width: "100%", justifyContent: "center" }} disabled={!proofFile}
          onClick={() => onAccept({ name: form.name || roommate.name, email: form.email || roommate.email, amount: roommate.rentShare + roommate.deposit, proof: proofFile?.name })}>
          🚀 Submit Payment Proof
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 12 }}>Admin will be notified instantly and verify your payment</p>
      </div>
    </div>
  );

  // ── Signup step ──
  if (step === "signup") return (
    <div className="form-page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="form-card fade-up">
        <div className="form-logo">Co-Living <span>Harmony</span></div>
        <StepBar />
        <h2 className="form-title">Create your account</h2>
        <p className="form-subtitle">Join {house.name} as a roommate</p>
        <div className="form-grid">
          {(() => {
            const isEmailValid = (value) => /\S+@\S+\.\S+/.test(value);
            const isPasswordValid = (value) => value.length >= 8;
            const nameError = !form.name && touched?.name ? "Name is required" : "";
            const emailError = touched?.email && !isEmailValid(form.email) ? "Enter a valid email address" : "";
            const passwordError = touched?.password && !isPasswordValid(form.password) ? "Password must be at least 8 characters" : "";

            return [["Full Name", "name", "text", "Your full name"], ["Email", "email", "email", "you@email.com"], ["Password", "password", "password", "Min. 8 characters"]].map(
              ([label, key, type, ph]) => (
                <div key={key} className="input-group">
                  <label>{label}</label>
                  <input
                    className="input-field"
                    type={type}
                    placeholder={ph}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    onBlur={() => setTouched?.(t => ({ ...t, [key]: true }))}
                  />
                  {key === "name" && nameError && <span style={{ fontSize: 11, color: "var(--rose)" }}>{nameError}</span>}
                  {key === "email" && emailError && <span style={{ fontSize: 11, color: "var(--rose)" }}>{emailError}</span>}
                  {key === "password" && passwordError && <span style={{ fontSize: 11, color: "var(--rose)" }}>{passwordError}</span>}
                </div>
              ),
            );
          })()}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-outline" onClick={() => setStep("view")}>← Back</button>
          <button
            className="btn btn-amber"
            style={{ flex: 1, justifyContent: "center" }}
            disabled={
              !form.name ||
              !/\S+@\S+\.\S+/.test(form.email) ||
              !form.password ||
              form.password.length < 8
            }
            onClick={() => setStep("payment")}
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );

  // ── View/Invite step ──
  return (
    <>
      {showAgreement && (
        <AgreementModal
          house={house}
          roommate={roommate}
          onClose={() => setShowAgreement(false)}
          onAgree={() => setAgreed(true)}
        />
      )}
      <div className="form-page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
        <div className="form-card fade-up" style={{ maxWidth: 560 }}>
          <div className="form-logo">Co-Living <span>Harmony</span></div>
          <StepBar />

          {/* House banner */}
          <div style={{ background: "linear-gradient(135deg, var(--ink) 0%, #1e3a5f 100%)", borderRadius: 14, padding: "20px 22px", marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🏠</div>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, color: "white" }}>{house.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{house.address}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Admin: {house.adminName}</div>
            </div>
          </div>

          <h2 className="form-title" style={{ marginBottom: 6 }}>You're invited! 🎉</h2>
          <p className="form-subtitle"><strong>{house.adminName}</strong> has invited you to join as a roommate. Review your terms and the rental agreement before accepting.</p>

          {/* Terms */}
          <div style={{ background: "var(--cream)", borderRadius: 14, padding: 20, marginBottom: 18, border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 14, fontSize: 12, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Rental Terms</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[["Monthly Rent", currency(roommate.rentShare), "💰"], ["Security Deposit", currency(roommate.deposit), "🔐"]].map(([k, v, icon]) => (
                <div key={k} style={{ background: "white", borderRadius: 10, padding: "14px 16px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--amber-pale)", borderRadius: 8, border: "1px solid #93c5fd" }}>
              <span style={{ fontSize: 13, color: "var(--slate)" }}>First payment due</span>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, color: "var(--amber)" }}>{currency(roommate.rentShare + roommate.deposit)}</span>
            </div>
          </div>

          {/* Agreement section */}
          <div style={{ borderRadius: 12, border: agreed ? "2px solid var(--sage)" : "1.5px solid var(--border)", overflow: "hidden", marginBottom: 20, transition: "border-color 0.3s" }}>
            <div style={{ background: agreed ? "#dbeafe" : "white", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: agreed ? "var(--sage)" : "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "background 0.3s" }}>
                {agreed ? "✅" : "📄"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: agreed ? "var(--sage)" : "var(--ink)" }}>
                  {agreed ? "Agreement Accepted" : "Rental Agreement"}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {agreed ? "You have read and agreed to all terms" : "Read the full rental agreement before accepting"}
                </div>
              </div>
              <button className="btn btn-sm" style={{ background: agreed ? "var(--sage)" : "var(--ink)", color: "white", flexShrink: 0 }} onClick={() => setShowAgreement(true)}>
                {agreed ? "View Again" : "📖 Read Agreement"}
              </button>
            </div>
            {!agreed && (
              <div style={{ background: "#fffbeb", padding: "10px 18px", borderTop: "1px solid #fef08a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 12, color: "#92400e" }}>You must read and agree to the rental agreement before you can accept the invite.</span>
              </div>
            )}
          </div>

          {/* UPI info */}
          <div style={{ background: "var(--cream)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>💳</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>Payment will go to</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--amber)" }}>{house.upiId}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>via UPI</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={onReject}>✕ Decline</button>
            <button className="btn btn-amber" style={{ flex: 2, justifyContent: "center" }} disabled={!agreed} onClick={() => setStep("signup")}>
              {agreed ? "✓ Accept & Continue →" : "Read Agreement First"}
            </button>
          </div>
          {!agreed && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
              Click <strong>"Read Agreement"</strong> above, scroll to the bottom, then click "I Agree" to proceed.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, isAdmin, notifCount }) {
  const adminNav = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "roommates", icon: "👥", label: "Roommates" },
    { id: "payments", icon: "💳", label: "Payments", badge: notifCount },
    { id: "expenses", icon: "📋", label: "Expenses" },
    { id: "chores", icon: "🧹", label: "Chores" },
    { id: "vibes", icon: "😊", label: "Vibe Check" },
  ];
  const roommateNav = [
    { id: "my-overview", icon: "🏠", label: "My Home" },
    { id: "my-payments", icon: "💳", label: "My Payments" },
    { id: "expenses", icon: "📋", label: "Expenses" },
    { id: "chores", icon: "🧹", label: "Chores" },
    { id: "vibes", icon: "😊", label: "Vibe Check" },
  ];
  const nav = isAdmin ? adminNav : roommateNav;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Co-Living<br /><span>Harmony</span> 🏠</div>
      <div className="sidebar-section">{isAdmin ? "Admin" : "Roommate"}</div>
      {nav.map(item => (
        <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => onNav(item.id)} style={{ position: "relative" }}>
          <span className="nav-icon">{item.icon}</span>
          {item.label}
          {item.badge > 0 && (
            <span style={{
              marginLeft: "auto", minWidth: 20, height: 20, borderRadius: 100,
              background: "#ef4444", color: "white", fontSize: 11,
              fontFamily: "Plus Jakarta Sans", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 5px", animation: "pulse 2s infinite"
            }}>{item.badge}</span>
          )}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {/* Bell icon if notifications */}
      {isAdmin && notifCount > 0 && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.15)", borderRadius: 10, marginBottom: 8, border: "1px solid rgba(239,68,68,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, color: "#fca5a5", fontSize: 13 }}>New Payment!</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{notifCount} pending review</div>
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.06)", borderRadius: 10 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{isAdmin ? "Admin" : "Roommate"}</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, color: "white", fontSize: 14 }}>{isAdmin ? "Priya Sharma" : "Arjun Mehta"}</div>
      </div>
    </div>
  );
}

// ─── ADMIN OVERVIEW ───────────────────────────────────────────────────────────
function AdminOverview({ data, onNav, notifications, onDismissNotif }) {
  const totalRent = data.roommates.reduce((s, r) => s + r.rentShare, 0);
  const paidRent = data.roommates.filter(r => r.paymentStatus === "paid").reduce((s, r) => s + r.rentShare, 0);
  const active = data.roommates.filter(r => r.status === "active").length;

  return (
    <div>
      <div className="page-header fade-up">
        <h1 className="page-title">{data.house.name}</h1>
        <p className="page-subtitle">{data.house.address} • <span className="badge badge-teal">🟢 Active</span></p>
      </div>

      {/* ── NOTIFICATION BANNERS ── */}
      {notifications && notifications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }} className="fade-up-1">
          {notifications.map(n => (
            <div key={n.id} style={{
              background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
              borderRadius: 16, padding: "18px 22px",
              display: "flex", alignItems: "center", gap: 16,
              animation: "fadeUp 0.5s ease both",
              boxShadow: "0 4px 24px rgba(37,99,235,0.35)"
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, animation: "pulse 2s infinite" }}>🔔</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 4 }}>
                  New Payment Submitted!
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--amber-light)" }}>{n.roommateName}</strong> has paid <strong style={{ color: "var(--amber-light)" }}>{currency(n.amount)}</strong> (Rent + Deposit) and uploaded payment proof. Awaiting your approval.
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>📧 {n.roommateEmail} · {n.time}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.95)", color: "var(--ink)", fontWeight: 700 }} onClick={() => onNav("payments")}>
                  Review →
                </button>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }} onClick={() => onDismissNotif(n.id)}>
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="stats-grid fade-up-1">
        {[
          { label: "Total Roommates", value: data.roommates.length, meta: `${active} active`, color: "var(--teal)" },
          { label: "Monthly Rent", value: currency(data.house.monthlyRent), meta: "Total house rent", color: "var(--amber)" },
          { label: "Collected This Month", value: currency(paidRent), meta: `${currency(totalRent - paidRent)} pending`, color: "var(--sage)" },
          { label: "Pending Approvals", value: data.payments.filter(p => p.status === "pending_review").length, meta: "Need your review", color: "var(--rose)" },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-meta">{s.meta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card fade-up-2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>Roommates</h3>
            <button className="btn btn-sm btn-amber" onClick={() => onNav("roommates")}>Manage</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.roommates.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{ background: r.avatarBg, color: r.color }}>{initials(r.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{currency(r.rentShare)}/mo</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span className={`status-dot ${r.paymentStatus === "paid" ? "dot-green" : r.paymentStatus === "pending" ? "dot-amber" : "dot-rose"}`} />
                  <span className={`badge ${r.status === "active" ? "badge-teal" : r.status === "invited" ? "badge-amber" : "badge-muted"}`}>
                    {r.status === "active" ? "Active" : r.status === "invited" ? "Invited" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card fade-up-2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>Rent Collection</h3>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, color: "var(--amber)" }}>{Math.round(paidRent/totalRent*100)}%</span>
          </div>
          {data.roommates.map(r => (
            <div key={r.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</span>
                <span style={{ fontSize: 13, color: r.paymentStatus === "paid" ? "var(--sage)" : r.paymentStatus === "pending" ? "var(--amber)" : "var(--rose)", fontWeight: 600 }}>
                  {r.paymentStatus === "paid" ? "Paid ✓" : r.paymentStatus === "pending" ? "Under Review" : "Not Paid"}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: r.paymentStatus === "paid" ? "100%" : r.paymentStatus === "pending" ? "60%" : "0%",
                  background: r.paymentStatus === "paid" ? "var(--sage)" : r.paymentStatus === "pending" ? "var(--amber)" : "var(--rose)"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOMMATES PAGE ───────────────────────────────────────────────────────────
function RoommatesPage({ data, onToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showInvite, setShowInvite] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", rentShare: "", deposit: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="page-header fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Roommates</h1>
          <p className="page-subtitle">Manage your co-living members</p>
        </div>
        <button className="btn btn-amber" onClick={() => setShowAdd(true)}>+ Add Roommate</button>
      </div>

      <div className="card fade-up-1">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Contact</th><th>Rent Share</th><th>Deposit</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
            <tbody>
              {data.roommates.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ background: r.avatarBg, color: r.color }}>{initials(r.name)}</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--slate)" }}>{r.phone}</td>
                  <td style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>{currency(r.rentShare)}</td>
                  <td style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, color: "var(--muted)" }}>{currency(r.deposit)}</td>
                  <td><span className={`badge ${r.status === "active" ? "badge-teal" : r.status === "invited" ? "badge-amber" : "badge-muted"}`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span></td>
                  <td><span className={`badge ${r.paymentStatus === "paid" ? "badge-sage" : r.paymentStatus === "pending" ? "badge-amber" : "badge-rose"}`}>
                    {r.paymentStatus === "paid" ? "Paid" : r.paymentStatus === "pending" ? "Reviewing" : "Unpaid"}
                  </span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm btn-outline" onClick={() => setShowInvite(r)}>🔗 Invite</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Roommate Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Add Roommate</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>They'll receive an invite link via email</p>
            <div className="form-grid" style={{ gap: 16 }}>
              {[["Full Name","name","text","Arjun Mehta"],["Email","email","email","arjun@email.com"],["Phone","phone","tel","+91 99001 12233"]].map(([l,k,t,ph]) => (
                <div key={k} className="input-group"><label>{l}</label><input className="input-field" type={t} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} /></div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Monthly Rent (₹)","rentShare","8000"],["Security Deposit (₹)","deposit","16000"]].map(([l,k,ph]) => (
                  <div key={k} className="input-group"><label>{l}</label><input className="input-field" type="number" placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} /></div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-amber" style={{ flex: 1 }} onClick={() => { setShowAdd(false); onToast("Roommate added & invite sent!"); }}>Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Invite Link for {showInvite.name}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Share this link or QR code with your roommate</p>
            <div className="invite-box" style={{ marginBottom: 20 }}>
              <span className="invite-link">https://coliving.app/invite/house-h1/{showInvite.id}</span>
              <button className="btn btn-sm btn-outline" onClick={() => onToast("Link copied!")}>Copy</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div className="qr-box" style={{ width: "fit-content" }}>
                <QRCode value={`invite:${showInvite.id}`} size={140} />
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Scan to join</span>
              </div>
            </div>
            <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setShowInvite(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
function PaymentsPage({ data, onToast, notifications, onDismissNotif }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? data.payments : data.payments.filter(p => p.status === tab);

  const statusMap = {
    approved: { label: "Approved", badge: "badge-teal" },
    pending_review: { label: "Under Review", badge: "badge-amber" },
    unpaid: { label: "Unpaid", badge: "badge-rose" },
  };

  return (
    <div>
      <div className="page-header fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">Track rent and deposit payments</p>
        </div>
        {notifications && notifications.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fee2e2", padding: "8px 16px", borderRadius: 100, border: "1px solid #fca5a5" }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, color: "#dc2626" }}>{notifications.length} new payment{notifications.length > 1 ? "s" : ""} to review</span>
          </div>
        )}
      </div>

      {/* New payment submissions */}
      {notifications && notifications.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {notifications.map(n => (
            <div key={n.id} className="card fade-up-1" style={{ marginBottom: 14, border: "2px solid #93c5fd", background: "#eff6ff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>💳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 15 }}>{n.roommateName}</span>
                    <span className="badge badge-amber" style={{ animation: "pulse 2s infinite" }}>🆕 New</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--slate)" }}>Submitted payment of <strong>{currency(n.amount)}</strong> with proof screenshot · <span style={{ color: "var(--muted)" }}>{n.time}</span></div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>📧 {n.roommateEmail} · Proof file: <em>{n.proofFile}</em></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-sage" onClick={() => { onDismissNotif(n.id); onToast(`Payment from ${n.roommateName} approved! ✓`); }}>✓ Approve</button>
                  <button className="btn btn-sm btn-rose" onClick={() => { onDismissNotif(n.id); onToast("Payment rejected"); }}>✕ Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tabs fade-up-1" style={{ marginBottom: 24, display: "inline-flex" }}>
        {[["all","All"],["pending_review","Pending Review"],["approved","Approved"],["unpaid","Unpaid"]].map(([v,l]) => (
          <button key={v} className={`tab ${tab===v?"active":""}`} onClick={() => setTab(v)}>{l}</button>
        ))}
      </div>

      <div className="card fade-up-2">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Roommate</th><th>Type</th><th>Amount</th><th>Date</th><th>Proof</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.roommate}</td>
                  <td><span className="badge badge-muted">{p.type}</span></td>
                  <td style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>{currency(p.amount)}</td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{p.date || "—"}</td>
                  <td>{p.proof ? <span style={{ color: "var(--sage)", fontSize: 20 }}>📸</span> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
                  <td><span className={`badge ${statusMap[p.status]?.badge}`}>{statusMap[p.status]?.label}</span></td>
                  <td>
                    {p.status === "pending_review" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-sm btn-sage" onClick={() => onToast("Payment approved!")}>✓ Approve</button>
                        <button className="btn btn-sm btn-rose" onClick={() => onToast("Payment rejected")}>✕</button>
                      </div>
                    )}
                    {p.status === "approved" && <span style={{ fontSize: 13, color: "var(--sage)" }}>✓ Done</span>}
                    {p.status === "unpaid" && <span style={{ fontSize: 13, color: "var(--muted)" }}>Awaiting payment</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── EXPENSES PAGE ────────────────────────────────────────────────────────────
function ExpensesPage({ data, onToast }) {
  const [showAddRequired, setShowAddRequired] = useState(false);
  const [showAddPurchased, setShowAddPurchased] = useState(false);

  const [requiredForm, setRequiredForm] = useState({ name: "", quantity: "" });
  const [purchasedForm, setPurchasedForm] = useState({
    name: "",
    quantity: "",
    totalPrice: "",
    purchasedBy: "",
    billFile: null,
    billPreview: null,
  });

  const [requiredItems, setRequiredItems] = useState(data.requiredItems || []);
  const [purchasedItems, setPurchasedItems] = useState(data.householdPurchases || []);

  const roommatesWithAdmin = [...data.roommates, { id: "admin", name: "Priya Sharma (You)", color: "var(--amber)", avatarBg: "var(--amber-pale)" }];

  const total = purchasedItems.reduce((s, e) => s + e.totalPrice, 0);
  const perHead = roommatesWithAdmin.length ? Math.round(total / roommatesWithAdmin.length) : 0;

  const handleBillChange = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      setPurchasedForm(p => ({ ...p, billFile: file, billPreview: ev.target.result }));
    };
    r.readAsDataURL(file);
  };

  const addRequiredItem = () => {
    if (!requiredForm.name || !requiredForm.quantity) return;
    setRequiredItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: requiredForm.name,
        quantity: requiredForm.quantity,
        addedBy: "You",
      },
    ]);
    setRequiredForm({ name: "", quantity: "" });
    setShowAddRequired(false);
    onToast?.("Required item added to the shared list.");
  };

  const addPurchasedItem = () => {
    const { name, quantity, totalPrice, purchasedBy } = purchasedForm;
    if (!name || !quantity || !totalPrice || !purchasedBy) return;

    const totalNum = Number(totalPrice);
    if (!totalNum || totalNum <= 0 || !roommatesWithAdmin.length) return;

    const share = Math.round(totalNum / roommatesWithAdmin.length);
    const split = roommatesWithAdmin.map(r => ({
      userId: r.id,
      name: r.name,
      status: r.name.startsWith(purchasedBy) ? "Paid" : "Pending",
      amount: share,
    }));

    const item = {
      id: Date.now(),
      name,
      quantity,
      totalPrice: totalNum,
      purchasedBy,
      billPreview: purchasedForm.billPreview,
      split,
      createdAt: new Date().toLocaleString("en-IN"),
    };

    setPurchasedItems(prev => [item, ...prev]);
    setPurchasedForm({
      name: "",
      quantity: "",
      totalPrice: "",
      purchasedBy: "",
      billFile: null,
      billPreview: null,
    });
    setShowAddPurchased(false);
    onToast?.(`Expense added for ${name}. Everyone has been notified of their share.`);
  };

  const markSharePaid = (expenseId, userId) => {
    setPurchasedItems(prev =>
      prev.map(e =>
        e.id !== expenseId
          ? e
          : {
              ...e,
              split: e.split.map(s =>
                s.userId === userId ? { ...s, status: "Paid" } : s,
              ),
            },
      ),
    );
  };

  return (
    <div>
      <div className="page-header fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Household Expenses</h1>
          <p className="page-subtitle">Required items and purchased items with auto-split</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setShowAddRequired(true)}>+ Add Required Item</button>
          <button className="btn btn-amber btn-sm" onClick={() => setShowAddPurchased(true)}>+ Add Purchased Item</button>
        </div>
      </div>

      <div className="stats-grid fade-up-1" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { label: "Total Purchased This Month", value: currency(total), color: "var(--amber)" },
          { label: "Per Person Expense Share", value: currency(perHead), color: "var(--teal)" },
          { label: "Purchased Items", value: purchasedItems.length, color: "var(--slate)" },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.1fr", gap: 24 }}>
        {/* Left: Required & purchased lists */}
        <div className="card fade-up-2">
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 16 }}>Required Items</h3>
          {requiredItems.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>No required items yet. Add what the house needs.</p>
          )}
          {requiredItems.map(item => (
            <div key={item.id} className="expense-row">
              <div className="expense-icon" style={{ background: "var(--cream)" }}>📝</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Qty: {item.quantity} · Added by {item.addedBy}</div>
              </div>
            </div>
          ))}

          <button
            className="btn btn-sm btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => setShowAddRequired(true)}
          >
            + Add required item
          </button>

          <div style={{ height: 1, background: "var(--border)", margin: "18px 0" }} />

          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 16 }}>Purchased Items</h3>
          {purchasedItems.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No purchases recorded yet. Add a purchased item to split the cost.</p>
          )}
          {purchasedItems.map(exp => (
            <div key={exp.id} className="expense-row">
              <div className="expense-icon" style={{ background: "#dcfce7" }}>🧾</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{exp.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  Qty: {exp.quantity} · Bought by {exp.purchasedBy} · {exp.createdAt}
                </div>
                <div style={{ fontSize: 11, color: "var(--teal)", marginTop: 4 }}>
                  Each share: {exp.split?.[0] ? currency(exp.split[0].amount) : "-"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16 }}>{currency(exp.totalPrice)}</div>
                <button
                  className="btn btn-sm btn-outline"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    const details = exp.split.map(s => `${s.name.split(" ")[0]} – ${s.status} ${s.status === "Pending" ? `(${currency(s.amount)})` : ""}`).join("\n");
                    alert(
                      `Expense details:\n\nItem: ${exp.name}\nQuantity: ${exp.quantity}\nTotal: ${currency(exp.totalPrice)}\nPurchased by: ${exp.purchasedBy}\n\nStatus:\n${details}`,
                    );
                  }}
                >
                  View details
                </button>
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => setShowAddPurchased(true)}
          >
            + Add purchased item
          </button>
        </div>

        {/* Right: Monthly rent + who owes what */}
        <div style={{ display: "grid", gap: 16 }}>
          <div className="card fade-up-2">
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 12 }}>Monthly Rent</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Overview of fixed monthly rent for the house and each roommate.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--slate)" }}>Total House Rent</span>
                <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16 }}>
                  {currency(data.house?.monthlyRent || data.summary?.monthlyRent || 25000)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--slate)" }}>Per Roommate Rent Share</span>
                <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16 }}>
                  {currency(data.summary?.roommateRentShare || Math.round((data.house?.monthlyRent || 25000) / (data.roommates.length + 1)))}
                </span>
              </div>
            </div>
          </div>

          <div className="card fade-up-2">
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 20 }}>Who Owes What</h3>
            {roommatesWithAdmin.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="avatar" style={{ background: r.avatarBg, color: r.color }}>{initials(r.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{r.name.split(" ")[0]}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.random()*40+40}%`, background: r.color || "var(--teal)" }} />
                  </div>
                </div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, minWidth: 60, textAlign: "right" }}>
                  {currency(perHead)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Required Item modal */}
      {showAddRequired && (
        <div className="modal-overlay" onClick={() => setShowAddRequired(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Add Required Item</h3>
            <div className="form-grid" style={{ gap: 14 }}>
              <div className="input-group">
                <label>Item name</label>
                <input
                  className="input-field"
                  placeholder="Milk"
                  value={requiredForm.name}
                  onChange={e => setRequiredForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Quantity</label>
                <input
                  className="input-field"
                  placeholder="2 packets / 5 kg"
                  value={requiredForm.quantity}
                  onChange={e => setRequiredForm(p => ({ ...p, quantity: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => setShowAddRequired(false)}>Cancel</button>
              <button className="btn btn-amber" style={{ flex: 1 }} onClick={addRequiredItem} disabled={!requiredForm.name || !requiredForm.quantity}>
                Add to list
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Purchased Item modal */}
      {showAddPurchased && (
        <div className="modal-overlay" onClick={() => setShowAddPurchased(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Add Purchased Item</h3>
            <div className="form-grid" style={{ gap: 14 }}>
              <div className="input-group">
                <label>Item name</label>
                <input
                  className="input-field"
                  placeholder="Milk"
                  value={purchasedForm.name}
                  onChange={e => setPurchasedForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Quantity purchased</label>
                <input
                  className="input-field"
                  placeholder="2 packets"
                  value={purchasedForm.quantity}
                  onChange={e => setPurchasedForm(p => ({ ...p, quantity: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Total price (₹)</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="120"
                  value={purchasedForm.totalPrice}
                  onChange={e => setPurchasedForm(p => ({ ...p, totalPrice: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Purchased by</label>
                <select
                  className="input-field"
                  value={purchasedForm.purchasedBy}
                  onChange={e => setPurchasedForm(p => ({ ...p, purchasedBy: e.target.value }))}
                >
                  <option value="">Select roommate…</option>
                  {roommatesWithAdmin.map(r => (
                    <option key={r.id} value={r.name.split(" ")[0]}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Upload bill image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={e => handleBillChange(e.target.files?.[0])}
                />
                {purchasedForm.billPreview && (
                  <img
                    src={purchasedForm.billPreview}
                    alt="Bill preview"
                    style={{ marginTop: 8, maxHeight: 140, borderRadius: 8, border: "1px solid var(--border)", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => setShowAddPurchased(false)}>Cancel</button>
              <button
                className="btn btn-amber"
                style={{ flex: 1 }}
                onClick={addPurchasedItem}
                disabled={
                  !purchasedForm.name ||
                  !purchasedForm.quantity ||
                  !purchasedForm.totalPrice ||
                  !purchasedForm.purchasedBy
                }
              >
                Add & auto-split
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHORES PAGE ──────────────────────────────────────────────────────────────
function ChoresPage({ data, onToast }) {
  const [chores, setChores] = useState(data.chores);

  // Configurable members, tasks and days for auto-scheduler
  const [members, setMembers] = useState(() => {
    const base = data.roommates.map(r => r.name);
    const adminName = data.house?.adminName || "Priya Sharma";
    const all = adminName ? [...base, adminName] : base;
    return Array.from(new Set(all));
  });
  const [tasks, setTasks] = useState(() => data.chores.map(c => c.name));
  const [days, setDays] = useState(6);
  const [newMember, setNewMember] = useState("");
  const [newTask, setNewTask] = useState("");
  const [schedule, setSchedule] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("coliving-chore-schedule-v1");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.schedule) ? parsed.schedule : [];
    } catch {
      return [];
    }
  });

  const toggleDone = (id) => {
    setChores(p =>
      p.map(c =>
        c.id === id ? { ...c, status: c.status === "done" ? "pending" : "done" } : c,
      ),
    );
  };

  // Simple per-task rotation for the live board
  const rotateBoardOnce = () => {
    setChores(p => {
      const people = data.roommates.map(r => r.name);
      if (!people.length) return p;
      return p.map((c, i) => ({
        ...c,
        assignedTo: people[i % people.length],
      }));
    });
    onToast?.("Chores rotated among roommates!");
  };

  const persistSchedule = (nextSchedule, nextMembers, nextTasks, nextDays) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "coliving-chore-schedule-v1",
        JSON.stringify({
          schedule: nextSchedule,
          members: nextMembers,
          tasks: nextTasks,
          days: nextDays,
        }),
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleGenerate = () => {
    if (!members.length || !tasks.length) {
      onToast?.("Add at least 1 roommate and 1 chore to generate a schedule.");
      return;
    }
    const numDays = Math.max(1, Number(days) || 6);

    // Round-robin rotation: assigned_member = (task_index + day_index) % number_of_members
    const nextSchedule = Array.from({ length: numDays }, (_, dayIndex) => ({
      day: dayIndex + 1,
      rows: tasks.map((taskName, taskIndex) => {
        const memberIndex = (taskIndex + dayIndex) % members.length;
        return {
          taskName,
          memberName: members[memberIndex],
        };
      }),
    }));

    setSchedule(nextSchedule);
    persistSchedule(nextSchedule, members, tasks, numDays);
    onToast?.(`Chore schedule generated for ${numDays} day(s).`);
  };

  const addMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;
    setMembers(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewMember("");
    setSchedule([]);
  };

  const removeMember = (name) => {
    setMembers(prev => prev.filter(m => m !== name));
    setSchedule([]);
  };

  const addTask = () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    setTasks(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewTask("");
    setSchedule([]);
  };

  const removeTask = (name) => {
    setTasks(prev => prev.filter(t => t !== name));
    setSchedule([]);
  };

  const handleDaysChange = (value) => {
    setDays(value);
    setSchedule([]);
  };

  return (
    <div>
      <div className="page-header fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Chores Board</h1>
          <p className="page-subtitle">Auto-rotate chores fairly across roommates</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={rotateBoardOnce}>🔄 Rotate Today&apos;s Assignees</button>
          <button className="btn btn-amber" onClick={() => onToast?.("Reminder sent to all!")}>📢 Remind All</button>
        </div>
      </div>

      {/* Auto-scheduler controls */}
      <div className="card fade-up-1" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 12 }}>Chore Auto-Scheduler</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          Configure roommates and chores once, then generate a multi-day schedule using round-robin rotation.
        </p>

        <div className="form-grid-2" style={{ gap: 16, marginBottom: 16 }}>
          {/* Roommates */}
          <div className="input-group">
            <label>Roommates in rotation</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="input-field"
                placeholder="Add roommate name"
                value={newMember}
                onChange={e => setNewMember(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addMember(); } }}
              />
              <button className="btn btn-outline btn-sm" onClick={addMember}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {members.length === 0 && (
                <span style={{ fontSize: 12, color: "var(--muted)" }}>No roommates added yet.</span>
              )}
              {members.map(name => (
                <span
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "var(--cream)",
                    fontSize: 12,
                  }}
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removeMember(name)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="input-group">
            <label>Chores / tasks</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="input-field"
                placeholder="Add chore name (e.g. Kitchen, Trash)"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTask(); } }}
              />
              <button className="btn btn-outline btn-sm" onClick={addTask}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tasks.length === 0 && (
                <span style={{ fontSize: 12, color: "var(--muted)" }}>No chores added yet.</span>
              )}
              {tasks.map(name => (
                <span
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "#eef2ff",
                    fontSize: 12,
                  }}
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removeTask(name)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-grid-2" style={{ gap: 16, alignItems: "flex-end" }}>
          <div className="input-group" style={{ maxWidth: 220 }}>
            <label>Number of days</label>
            <input
              className="input-field"
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={e => handleDaysChange(e.target.value)}
            />
            <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Default is 6 days. Rotation uses round-robin so chores stay fair, even if tasks &gt; roommates.
            </span>
          </div>

          <div>
            <button className="btn btn-amber" onClick={handleGenerate}>
              ⚙️ Generate Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Generated schedule */}
      {schedule.length > 0 && (
        <div className="card fade-up-2" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 12 }}>
            {schedule.length}-Day Chore Schedule
          </h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
            Each day, every task shifts to the next roommate in line using round-robin rotation.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {schedule.map(day => (
              <div
                key={day.day}
                style={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--cream)",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--slate)",
                    }}
                  >
                    Day {day.day}
                  </span>
                </div>
                <div style={{ borderRadius: 8, overflow: "hidden", background: "white", border: "1px solid var(--border)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "var(--amber-pale)" }}>
                        <th style={{ textAlign: "left", padding: "6px 8px" }}>Task</th>
                        <th style={{ textAlign: "left", padding: "6px 8px" }}>Assigned to</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.rows.map((row, i) => (
                        <tr key={row.taskName + i} style={{ borderTop: "1px solid var(--border)" }}>
                          <td style={{ padding: "6px 8px" }}>{row.taskName}</td>
                          <td style={{ padding: "6px 8px" }}>
                            <span style={{ fontWeight: 500 }}>{row.memberName}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing single-day board for quick status tracking */}
      <div style={{ display: "grid", gap: 14 }} className="fade-up-1">
        {chores.map(c => {
          const roommate = [...data.roommates, { name: "Priya Sharma", color: "var(--amber)", avatarBg: "var(--amber-pale)" }].find(r => r.name === c.assignedTo);
          return (
            <div key={c.id} className="chore-card" style={{ opacity: c.status === "done" ? 0.6 : 1, transition: "opacity 0.2s" }}>
              <div className="chore-icon" style={{ background: c.status === "done" ? "#dbeafe" : "var(--cream)" }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, textDecoration: c.status === "done" ? "line-through" : "none", color: c.status === "done" ? "var(--muted)" : "var(--ink)" }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{c.frequency} · Due: {c.nextDue}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {roommate && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar" style={{ background: roommate.avatarBg || "var(--cream)", color: roommate.color || "var(--slate)", width: 32, height: 32, fontSize: 12 }}>{initials(c.assignedTo)}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--slate)" }}>{c.assignedTo.split(" ")[0]}</span>
                  </div>
                )}
                <button
                  onClick={() => toggleDone(c.id)}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${c.status === "done" ? "var(--sage)" : "var(--border)"}`, background: c.status === "done" ? "var(--sage)" : "white", color: "white", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
                >{c.status === "done" ? "✓" : ""}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VIBE CHECK PAGE ──────────────────────────────────────────────────────────
function VibeCheckPage({ data, isAdmin, onToast }) {
  const [vibes, setVibes] = useState(Object.fromEntries(data.roommates.map(r => [r.id, r.vibe])));
  const [myVibe, setMyVibe] = useState("free");

  return (
    <div>
      <div className="page-header fade-up">
        <h1 className="page-title">Vibe Check 🌡️</h1>
        <p className="page-subtitle">Know who's available and who needs space</p>
      </div>

      {!isAdmin && (
        <div className="card fade-up-1" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 16 }}>Set Your Status</h3>
          <div className="vibe-grid">
            {[["free","😊","Free to chat","I'm around!"], ["busy","📚","Busy","Working or studying"], ["dnd","🔕","Do Not Disturb","Please don't disturb"]].map(([v,e,name,desc]) => (
              <div key={v} className={`vibe-card ${myVibe===v?"selected":""}`} onClick={() => { setMyVibe(v); onToast(`Status set to ${name}!`); }}>
                <div className="vibe-emoji">{e}</div>
                <div className="vibe-name">{name}</div>
                <div className="vibe-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card fade-up-2">
        <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 20 }}>Roommate Statuses</h3>
        <div style={{ display: "grid", gap: 14 }}>
          {[...data.roommates, { id: "admin", name: "Priya Sharma (Admin)", vibe: "free", color: "var(--amber)", avatarBg: "var(--amber-pale)" }].map(r => {
            const vibe = r.id === "admin" ? "free" : vibes[r.id];
            const v = vibeConfig[vibe] || vibeConfig.free;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "var(--cream)", borderRadius: 12 }}>
                <div className="avatar avatar-lg" style={{ background: r.avatarBg || "var(--cream)", color: r.color || "var(--slate)" }}>{initials(r.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16 }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{r.id === "admin" ? "House Admin" : `₹${r.rentShare}/mo`}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", padding: "8px 14px", borderRadius: 100, border: "1.5px solid var(--border)" }}>
                  <span style={{ fontSize: 20 }}>{v.emoji}</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13, color: v.color }}>{v.label}</span>
                </div>
                {isAdmin && r.id !== "admin" && (
                  <select className="input-field" style={{ width: 140, padding: "8px 12px", fontSize: 13 }} value={vibes[r.id]} onChange={e => setVibes(p => ({ ...p, [r.id]: e.target.value }))}>
                    <option value="free">😊 Free</option>
                    <option value="busy">📚 Busy</option>
                    <option value="dnd">🔕 Do Not Disturb</option>
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ROOMMATE MY OVERVIEW ─────────────────────────────────────────────────────
function RoommateOverview({ data, onNav }) {
  const me = data.roommates[0]; // Arjun
  const myPayments = data.payments.filter(p => p.roommate === me.name);
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);
  const myShare = Math.round(totalExpenses / (data.roommates.length + 1));

  return (
    <div>
      <div className="page-header fade-up">
        <h1 className="page-title">Welcome, {me.name.split(" ")[0]} 👋</h1>
        <p className="page-subtitle">{data.house.name} · {data.house.address}</p>
      </div>

      <div className="stats-grid fade-up-1">
        {[
          { label: "My Monthly Rent", value: currency(me.rentShare), color: "var(--amber)" },
          { label: "My Deposit", value: currency(me.deposit), color: "var(--teal)" },
          { label: "Expense Share", value: currency(myShare), color: "var(--slate)" },
          { label: "Rent Status", value: me.paymentStatus === "paid" ? "Paid ✓" : "Pending", color: me.paymentStatus === "paid" ? "var(--sage)" : "var(--rose)" },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 24, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card fade-up-2">
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 16 }}>Pay Rent via UPI</h3>
          <div className="qr-box">
            <QRCode value={`upi://pay?pa=${data.house.upiId}&am=${me.rentShare}&tn=Rent`} size={130} />
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 14, textAlign: "center" }}>
              {currency(me.rentShare)} — February Rent
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{data.house.upiId} · Scan with any UPI app</div>
            <button className="btn btn-amber btn-sm" onClick={() => onNav("my-payments")}>Upload Payment Proof</button>
          </div>
        </div>

        <div className="card fade-up-2">
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 16 }}>House Members</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...data.roommates, { name: "Priya Sharma", id: "admin", color: "var(--amber)", avatarBg: "var(--amber-pale)", isAdmin: true }].map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{ background: r.avatarBg, color: r.color }}>{initials(r.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name} {r.isAdmin && <span className="badge badge-amber" style={{ fontSize: 10 }}>Admin</span>}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{vibeConfig[r.vibe || "free"].emoji}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOMMATE PAYMENTS PAGE ───────────────────────────────────────────────────
function RoommatePayments({ data, onToast }) {
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const proofRef = useRef(null);
  const me = data.roommates[0];

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProofPreview(ev.target.result);
      onToast("Screenshot uploaded! Awaiting admin approval.");
    };
    reader.readAsDataURL(file);
  };

  const handleProofDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProofPreview(ev.target.result);
      onToast("Screenshot uploaded! Awaiting admin approval.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="page-header fade-up">
        <h1 className="page-title">My Payments</h1>
        <p className="page-subtitle">Your rent and deposit history</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card fade-up-1">
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 20 }}>Pay February Rent</h3>
          <div style={{ background: "var(--amber-pale)", border: "1px solid #93c5fd", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Amount Due</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 28 }}>{currency(me.rentShare)}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Due: February 5, 2024</div>
          </div>
          <div className="qr-box" style={{ marginBottom: 20 }}>
            <QRCode value={`upi://pay?pa=${data.house.upiId}&am=${me.rentShare}`} size={130} />
            <div style={{ fontSize: 13, fontFamily: "Plus Jakarta Sans", fontWeight: 600 }}>{data.house.upiId}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Google Pay · PhonePe · Paytm</div>
          </div>
          <div className="input-group">
            <label>Upload Payment Screenshot</label>
            <input
              ref={proofRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProofChange}
            />
            {proofPreview ? (
              <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid var(--sage)", position: "relative", cursor: "pointer" }} onClick={() => proofRef.current.click()}>
                <img src={proofPreview} alt="Payment proof" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(90,124,90,0.88)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "white", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13 }}>✓ {proofFile.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Click to replace</span>
                </div>
              </div>
            ) : (
              <div
                className="proof-upload"
                onClick={() => proofRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleProofDrop}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Upload Screenshot</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>JPG, PNG · Click or drag & drop</div>
              </div>
            )}
          </div>
        </div>

        <div className="card fade-up-2">
          <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 20 }}>Payment History</h3>
          {data.payments.filter(p => p.roommate === me.name).map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--cream)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: p.status === "approved" ? "#dbeafe" : "var(--amber-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {p.status === "approved" ? "✅" : "⏳"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{p.type}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.date || "Pending"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>{currency(p.amount)}</div>
                <span className={`badge ${p.status === "approved" ? "badge-teal" : "badge-amber"}`}>{p.status === "approved" ? "Approved" : "Reviewing"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [activeNav, setActiveNav] = useState("overview");
  const [isAdmin, setIsAdmin] = useState(true);
  const [toast, setToast] = useState(null);
  const [data] = useState(INITIAL_DATA);
  const [notifications, setNotifications] = useState([]);

  const showToast = (msg) => { setToast(msg); };
  const clearToast = () => setToast(null);

  const goAdminDash = () => { setScreen("admin-dash"); setActiveNav("overview"); setIsAdmin(true); };
  const goRoommateDash = () => { setScreen("roommate-dash"); setActiveNav("my-overview"); setIsAdmin(false); };

  const handleRoommatePayment = (paymentData) => {
    const notif = {
      id: Date.now(),
      roommateName: paymentData.name,
      roommateEmail: paymentData.email,
      amount: paymentData.amount,
      proofFile: paymentData.proof || "screenshot.jpg",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " · Just now",
    };
    setNotifications(prev => [notif, ...prev]);
    showToast("✅ Payment submitted! Admin has been notified.");
    goRoommateDash();
  };

  const dismissNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const renderAdminPage = () => {
    switch (activeNav) {
      case "overview": return <AdminOverview data={data} onNav={setActiveNav} notifications={notifications} onDismissNotif={dismissNotif} />;
      case "roommates": return <RoommatesPage data={data} onToast={showToast} />;
      case "payments": return <PaymentsPage data={data} onToast={showToast} notifications={notifications} onDismissNotif={dismissNotif} />;
      case "expenses": return <ExpensesPage data={data} onToast={showToast} />;
      case "chores": return <ChoresPage data={data} onToast={showToast} />;
      case "vibes": return <VibeCheckPage data={data} isAdmin={true} onToast={showToast} />;
      default: return <AdminOverview data={data} onNav={setActiveNav} notifications={notifications} onDismissNotif={dismissNotif} />;
    }
  };

  const renderRoommatePage = () => {
    switch (activeNav) {
      case "my-overview": return <RoommateOverview data={data} onNav={setActiveNav} />;
      case "my-payments": return <RoommatePayments data={data} onToast={showToast} />;
      case "expenses": return <ExpensesPage data={data} onToast={showToast} />;
      case "chores": return <ChoresPage data={data} onToast={showToast} />;
      case "vibes": return <VibeCheckPage data={data} isAdmin={false} onToast={showToast} />;
      default: return <RoommateOverview data={data} onNav={setActiveNav} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {screen === "landing" && (
          <Landing
            onGoAdmin={() => setScreen("admin-reg")}
            onGoRoommate={() => setScreen("invite")}
            onGoInvite={() => setScreen("invite")}
          />
        )}
        {screen === "admin-reg" && (
          <AdminRegistration onComplete={(formData, login) => {
            if (formData || login) goAdminDash();
          }} />
        )}
        {screen === "invite" && (
          <RoommateInvite
            onAccept={handleRoommatePayment}
            onReject={() => setScreen("landing")}
          />
        )}
        {(screen === "admin-dash" || screen === "roommate-dash") && (
          <div style={{ display: "flex" }}>
            <Sidebar active={activeNav} onNav={setActiveNav} isAdmin={isAdmin} notifCount={isAdmin ? notifications.length : 0} />
            <main className="main">
              {/* demo switcher */}
              <div style={{ position: "fixed", top: 20, right: 24, display: "flex", gap: 8, background: "white", padding: "6px 8px", borderRadius: 10, boxShadow: "var(--shadow)", border: "1px solid var(--border)", zIndex: 200 }}>
                <button className={`btn btn-sm ${isAdmin ? "btn-amber" : "btn-outline"}`} onClick={goAdminDash}>🏡 Admin View</button>
                <button className={`btn btn-sm ${!isAdmin ? "btn-teal" : "btn-outline"}`} onClick={goRoommateDash}>🙋 Roommate View</button>
                <button className="btn btn-sm btn-outline" onClick={() => setScreen("landing")}>← Home</button>
              </div>
              {isAdmin ? renderAdminPage() : renderRoommatePage()}
            </main>
          </div>
        )}
        {toast && <Toast msg={toast} onClose={clearToast} />}
      </div>
    </>
  );
}
