import React, { useState } from "react";

export default function ChartContainer({ title, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ position: "relative", border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div style={{ position: "relative" }}>
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 24,
              userSelect: "none",
            }}
          >
            &#9776; {/* hamburger icon */}
          </button>
          {menuOpen && (
            <ul
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 8,
                listStyle: "none",
                margin: 0,
                minWidth: 140,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                zIndex: 10,
              }}
            >
              <li style={{ padding: "6px 12px", cursor: "pointer" }}>Hide</li>
              <li style={{ padding: "6px 12px", cursor: "pointer" }}>Delete</li>
              {/* <li style={{ padding: "6px 12px", cursor: "pointer" }}>Option 3</li> */}
            </ul>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
