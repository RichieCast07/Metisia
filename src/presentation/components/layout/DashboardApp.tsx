import React, { useState } from "react";
import Sidebar from "./SidebarDashboard";

function VentasPage() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f5f6f8" }}>
      {/* Topbar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #eaecf0",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#1a1d23" }}>
            Ventas
          </div>
          <div style={{ fontSize: 12, color: "#adb5c7", marginTop: 1 }}>Historial de transacciones</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid #eaecf0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {/* Bell icon placeholder */}
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#31B5B5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Syne', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            R2
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            border: `1px solid ${search ? "#31B5B5" : "#eaecf0"}`,
            borderRadius: 10,
            padding: "10px 16px",
            maxWidth: 420,
            transition: "border-color 0.15s",
          }}
        >
          {/* Search icon placeholder */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto o método de pago..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#1a1d23",
              background: "transparent",
              fontFamily: "'DM Sans', sans-serif",
              width: "100%",
            }}
          />
        </div>

        {/* Empty state */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#e8f7f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Cart icon placeholder */}
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#1a1d23" }}>
            Sin ventas
          </div>
          <p style={{ fontSize: 13, color: "#adb5c7", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>
            Las ventas se registran desde el Punto de Venta
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#31B5B5",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: 9,
              cursor: "pointer",
              marginTop: 4,
              transition: "background 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#289898")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#31B5B5")}
          >
            {/* Plus icon placeholder */}
            Ir al Punto de Venta
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardApp() {
  const [activeSection, setActiveSection] = useState("ventas");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; background: #f5f6f8; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar active={activeSection} onNavigate={setActiveSection} />
        {activeSection === "ventas" && <VentasPage />}
        {activeSection !== "ventas" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#adb5c7", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            Sección en desarrollo
          </div>
        )}
      </div>
    </>
  );
}
