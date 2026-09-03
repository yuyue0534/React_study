import React, { useMemo, useState } from "react";
import { model } from "../model/model.js";
import { pdd } from "../model/project/pdd.js";
import { jd } from "../model/project/jd.js";
import { taobao } from "../model/project/taobao.js";
import { projectExtendModel } from "../model/projectExtendModel.js";

const projects = { pdd, jd, taobao };

const C = {
  bg: "#0F1115",
  panel: "#171A21",
  panelAlt: "#1D212B",
  border: "#272C37",
  text: "#E7E9EE",
  muted: "#8B92A5",
  mutedDim: "#5B6272",
  accent: "#4FD1C5",
  accentDim: "#245E58",
  key: "#7DD3FC",
  str: "#A7E3A0",
  num: "#F0B429",
};
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace" };
const sans = { fontFamily: "Inter, -apple-system, 'Segoe UI', sans-serif" };

function JsonView({ value, indent = 0 }) {
  const pad = { paddingLeft: indent * 14 };
  if (Array.isArray(value)) {
    return (
      <div>
        <span style={{ color: C.mutedDim }}>[</span>
        {value.map((v, i) => (
          <div key={i} style={pad}>
            <JsonView value={v} indent={indent + 1} />
            {i < value.length - 1 && <span style={{ color: C.mutedDim }}>,</span>}
          </div>
        ))}
        <div style={pad}><span style={{ color: C.mutedDim }}>]</span></div>
      </div>
    );
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    return (
      <div>
        <span style={{ color: C.mutedDim }}>{"{"}</span>
        {entries.map(([k, v], i) => (
          <div key={k} style={pad}>
            <span style={{ color: C.key }}>"{k}"</span>
            <span style={{ color: C.mutedDim }}>: </span>
            <JsonView value={v} indent={indent + 1} />
            {i < entries.length - 1 && <span style={{ color: C.mutedDim }}>,</span>}
          </div>
        ))}
        <div style={pad}><span style={{ color: C.mutedDim }}>{"}"}</span></div>
      </div>
    );
  }
  if (typeof value === "string") return <span style={{ color: C.str }}>"{value}"</span>;
  if (typeof value === "number") return <span style={{ color: C.num }}>{value}</span>;
  if (typeof value === "boolean") return <span style={{ color: C.accent }}>{String(value)}</span>;
  return <span style={{ color: C.mutedDim }}>null</span>;
}

export default function MergeDemo() {
  const [key, setKey] = useState("pdd");
  const project = projects[key];
  const merged = useMemo(() => projectExtendModel(model, project), [project]);

  return (
    <div className="p-6" style={{ ...sans }}>
      <div className="flex items-center gap-2 mb-5">
        {Object.keys(projects).map((k) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className="text-sm px-3 py-1.5 rounded"
            style={{
              background: key === k ? C.accentDim : "transparent",
              color: key === k ? C.accent : C.muted,
              border: `1px solid ${key === k ? C.accent + "55" : C.border}`,
            }}
          >
            project/{k}.js
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="model.js（通用模板）" subtitle="继承来源">
          <JsonView value={{ name: model.name, menu: model.menu.map((m) => ({ key: m.key, name: m.name })) }} />
        </Panel>
        <Panel title={`project/${key}.js`} subtitle="局部覆盖 / 扩展 / 删除">
          <JsonView value={project} />
        </Panel>
        <Panel title="projectExtendModel(model, project)" subtitle="合并结果" highlight>
          <JsonView value={{ name: merged.name, menu: merged.menu.map((m) => ({ key: m.key, name: m.name })) }} />
        </Panel>
      </div>

      <div className="mt-4 text-xs leading-relaxed rounded-lg p-3" style={{ color: C.mutedDim, background: C.panel, border: `1px solid ${C.border}`, ...mono }}>
        {key === "pdd" && "只重载了 product 的 name，schemaConfig 完全继承自 model（第三栏里没重复出现这些字段，但打开 model/project/pdd.js 能看到确实没写）。"}
        {key === "jd" && "product 改名 + headerButtons 追加了「批量导入」；coupon 是 model 里没有的 key，被追加到 menu 末尾。"}
        {key === "taobao" && "order 带 _deleted 标记，合并结果里 menu 只剩 product 一项——删除语义生效。"}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, highlight }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${highlight ? C.accent + "55" : C.border}`, background: C.panel }}>
      <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${C.border}`, background: C.panelAlt }}>
        <div className="text-xs font-medium" style={{ color: highlight ? C.accent : C.text }}>{title}</div>
        <div className="text-[10px] mt-0.5" style={{ color: C.mutedDim }}>{subtitle}</div>
      </div>
      <div className="p-3 text-[11px] leading-relaxed overflow-auto" style={{ maxHeight: 420, ...mono }}>
        {children}
      </div>
    </div>
  );
}
