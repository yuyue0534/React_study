import React, { useState } from "react";
import ConfigDrivenAdminDemo from "./components/ConfigDrivenAdminDemo.jsx";
import MergeDemo from "./components/MergeDemo.jsx";

const C = {
  bg: "#0F1115",
  panel: "#171A21",
  border: "#272C37",
  text: "#E7E9EE",
  muted: "#8B92A5",
  accent: "#4FD1C5",
  accentDim: "#245E58",
};

export default function App() {
  const [tab, setTab] = useState("demo");

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div className="flex items-center gap-1 px-4" style={{ background: C.panel, borderBottom: `1px solid ${C.border}` }}>
        <TabButton active={tab === "demo"} onClick={() => setTab("demo")}>
          核心链路 · ConfigDrivenAdminDemo.jsx
        </TabButton>
        <TabButton active={tab === "merge"} onClick={() => setTab("merge")}>
          project 继承 model
        </TabButton>
      </div>

      {tab === "demo" ? <ConfigDrivenAdminDemo /> : <MergeDemo />}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-sm px-4 py-3"
      style={{
        color: active ? "#4FD1C5" : C.muted,
        borderBottom: `2px solid ${active ? C.accent : "transparent"}`,
        background: "transparent",
      }}
    >
      {children}
    </button>
  );
}
