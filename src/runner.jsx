import { useMemo, useState } from "react";
import RoommateInvitePreview from "../roommate-invite-preview.jsx";
import ColivingDashboard from "../coliving-dashboard.jsx";

export function Runner() {
  const [view, setView] = useState("invite");
  const View = useMemo(
    () => (view === "dashboard" ? ColivingDashboard : RoommateInvitePreview),
    [view],
  );

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          display: "flex",
          gap: 8,
          background: "rgba(255,255,255,0.9)",
          padding: 8,
          borderRadius: 12,
          border: "1px solid rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(6px)",
        }}
      >
        <button
          onClick={() => setView("invite")}
          style={{
            border: "1px solid rgba(15, 23, 42, 0.18)",
            background: view === "invite" ? "#0f172a" : "white",
            color: view === "invite" ? "white" : "#0f172a",
            padding: "8px 12px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Roommate invite
        </button>
        <button
          onClick={() => setView("dashboard")}
          style={{
            border: "1px solid rgba(15, 23, 42, 0.18)",
            background: view === "dashboard" ? "#0f172a" : "white",
            color: view === "dashboard" ? "white" : "#0f172a",
            padding: "8px 12px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Dashboard
        </button>
      </div>
      <View />
    </>
  );
}

