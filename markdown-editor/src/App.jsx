import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import _ from "lodash";

// ─── Icons (inline SVG components) ───────────────────────────────────
const Icon = ({ d, size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>{typeof d === "string" ? <path d={d} /> : d}</svg>
);
const Icons = {
  Bold: (p) => <Icon {...p} d={<><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></>} />,
  Italic: (p) => <Icon {...p} d={<><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></>} />,
  Strikethrough: (p) => <Icon {...p} d={<><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></>} />,
  Code: (p) => <Icon {...p} d={<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>} />,
  Link: (p) => <Icon {...p} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
  Image: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>} />,
  List: (p) => <Icon {...p} d={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>} />,
  ListOrdered: (p) => <Icon {...p} d={<><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></>} />,
  Quote: (p) => <Icon {...p} d={<><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></>} />,
  Table: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></>} />,
  Check: (p) => <Icon {...p} d={<><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>} />,
  HR: (p) => <Icon {...p} d={<line x1="3" y1="12" x2="21" y2="12"/>} />,
  Search: (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
  Download: (p) => <Icon {...p} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />,
  Sun: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />,
  Moon: (p) => <Icon {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  Maximize: (p) => <Icon {...p} d={<><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>} />,
  Minimize: (p) => <Icon {...p} d={<><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></>} />,
  Sidebar: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></>} />,
  Copy: (p) => <Icon {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />,
  File: (p) => <Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>} />,
  Heading: (p) => <Icon {...p} d={<><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></>} />,
  Math: (p) => <Icon {...p} d={<><path d="M4 20l6-16h4l6 16"/><path d="M7 13h10"/></>} />,
  Undo: (p) => <Icon {...p} d={<><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></>} />,
  Redo: (p) => <Icon {...p} d={<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>} />,
  X: (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />,
  ChevronDown: (p) => <Icon {...p} d={<polyline points="6 9 12 15 18 9"/>} />,
  Eye: (p) => <Icon {...p} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />,
  Edit: (p) => <Icon {...p} d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>} />,
  Columns: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></>} />,
  Save: (p) => <Icon {...p} d={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />,
  Settings: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
};

// ─── Markdown Parser ─────────────────────────────────────────────────
function parseMarkdown(md) {
  if (!md) return "";
  let html = md;

  // Escape HTML (but preserve code blocks)
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang, code: code.replace(/</g, "&lt;").replace(/>/g, "&gt;") });
    return `%%CODEBLOCK_${idx}%%`;
  });

  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(code.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    return `%%INLINECODE_${idx}%%`;
  });

  html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Math blocks: $$...$$ 
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) =>
    `<div class="math-block"><span class="math-label">Math</span><code>${expr.trim()}</code></div>`
  );
  // Inline math: $...$
  html = html.replace(/\$([^\$\n]+)\$/g, (_, expr) =>
    `<span class="math-inline"><code>${expr}</code></span>`
  );

  // Headers
  html = html.replace(/^(#{1,6})\s+(.+)$/gm, (_, h, text) => {
    const level = h.length;
    const id = text.toLowerCase().replace(/[^\w]+/g, "-").replace(/-+$/, "");
    return `<h${level} id="${id}" class="md-h md-h${level}">${text}</h${level}>`;
  });

  // Horizontal rules
  html = html.replace(/^(\*{3,}|-{3,}|_{3,})$/gm, '<hr class="md-hr"/>');

  // Blockquotes
  html = html.replace(/^(?:&gt;|>)\s?(.*)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote class="md-blockquote">/g, "\n");

  // Task lists
  html = html.replace(/^[-*]\s+\[x\]\s+(.*)$/gm,
    '<div class="md-task md-task-done"><span class="md-checkbox checked">✓</span><span class="done-text">$1</span></div>');
  html = html.replace(/^[-*]\s+\[\s?\]\s+(.*)$/gm,
    '<div class="md-task"><span class="md-checkbox">○</span><span>$1</span></div>');

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, align, body) => {
    const headers = header.split("|").filter(c => c.trim());
    const aligns = align.split("|").filter(c => c.trim()).map(c => {
      if (c.trim().startsWith(":") && c.trim().endsWith(":")) return "center";
      if (c.trim().endsWith(":")) return "right";
      return "left";
    });
    const rows = body.trim().split("\n").map(r => r.split("|").filter(c => c.trim()));
    let t = '<div class="md-table-wrap"><table class="md-table"><thead><tr>';
    headers.forEach((h, i) => { t += `<th style="text-align:${aligns[i] || "left"}">${h.trim()}</th>`; });
    t += "</tr></thead><tbody>";
    rows.forEach(r => {
      t += "<tr>";
      r.forEach((c, i) => { t += `<td style="text-align:${aligns[i] || "left"}">${c.trim()}</td>`; });
      t += "</tr>";
    });
    t += "</tbody></table></div>";
    return t;
  });

  // Unordered lists
  html = html.replace(/^[-*+]\s+(.+)$/gm, '<li class="md-ul-item">$1</li>');
  html = html.replace(/((?:<li class="md-ul-item">.*<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="md-ol-item">$1</li>');
  html = html.replace(/((?:<li class="md-ol-item">.*<\/li>\n?)+)/g, '<ol class="md-ol">$1</ol>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<div class="md-image-wrap"><img src="$2" alt="$1" class="md-image"/><span class="md-image-alt">$1</span></div>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="md-link" target="_blank" rel="noopener">$1</a>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    const langLabel = block.lang ? `<span class="code-lang">${block.lang}</span>` : "";
    html = html.replace(`%%CODEBLOCK_${i}%%`,
      `<div class="md-codeblock">${langLabel}<pre><code class="lang-${block.lang}">${block.code}</code></pre></div>`);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE_${i}%%`, `<code class="md-inline-code">${code}</code>`);
  });

  // Paragraphs
  html = html.replace(/\n{2,}/g, '\n</p><p class="md-p">\n');
  html = `<p class="md-p">${html}</p>`;
  html = html.replace(/<p class="md-p">\s*(<(?:h[1-6]|hr|div|ul|ol|blockquote|table))/g, "$1");
  html = html.replace(/(<\/(?:h[1-6]|hr|div|ul|ol|blockquote|table)>)\s*<\/p>/g, "$1");
  html = html.replace(/<p class="md-p">\s*<\/p>/g, "");

  return html;
}

// ─── Extract headings for TOC ────────────────────────────────────────
function extractHeadings(md) {
  const headings = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(md)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/[^\w]+/g, "-").replace(/-+$/, ""),
    });
  }
  return headings;
}

// ─── Word & Char Count ───────────────────────────────────────────────
function countStats(text) {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split("\n").length;
  return { chars, words, lines };
}

// ─── Theme definitions ───────────────────────────────────────────────
const themes = {
  light: {
    name: "日间",
    bg: "#FAFAF8", editorBg: "#FFFFFF", sidebarBg: "#F5F4F0",
    text: "#2C2C2C", textSecondary: "#8A8A8A", textMuted: "#B0B0B0",
    border: "#E8E6E1", accent: "#D4634B", accentLight: "#FDF0ED",
    toolbarBg: "#FFFFFF", toolbarBorder: "#EBE9E4",
    previewBg: "#FFFFFF", codeBg: "#F7F6F3", codeText: "#5E5E5E",
    blockquoteBorder: "#D4634B", blockquoteBg: "#FDF8F7",
    linkColor: "#D4634B", hrColor: "#E8E6E1",
    selectionBg: "#D4634B22", hoverBg: "#F5F4F0",
    tableBorder: "#E8E6E1", tableHeaderBg: "#F7F6F3",
    shadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  dark: {
    name: "夜间",
    bg: "#1A1B1E", editorBg: "#212226", sidebarBg: "#1A1B1E",
    text: "#D4D4D4", textSecondary: "#808080", textMuted: "#555555",
    border: "#2E2F33", accent: "#E8845C", accentLight: "#E8845C18",
    toolbarBg: "#212226", toolbarBorder: "#2E2F33",
    previewBg: "#212226", codeBg: "#2A2B30", codeText: "#B0B0B0",
    blockquoteBorder: "#E8845C", blockquoteBg: "#E8845C0A",
    linkColor: "#E8845C", hrColor: "#2E2F33",
    selectionBg: "#E8845C22", hoverBg: "#2A2B30",
    tableBorder: "#2E2F33", tableHeaderBg: "#2A2B30",
    shadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  sepia: {
    name: "护眼",
    bg: "#F4EDDD", editorBg: "#FAF6EC", sidebarBg: "#EFE8D6",
    text: "#433422", textSecondary: "#8A7A66", textMuted: "#B0A48E",
    border: "#DDD5C3", accent: "#A0522D", accentLight: "#A0522D15",
    toolbarBg: "#FAF6EC", toolbarBorder: "#DDD5C3",
    previewBg: "#FAF6EC", codeBg: "#EFE8D6", codeText: "#6B5B4A",
    blockquoteBorder: "#A0522D", blockquoteBg: "#A0522D0A",
    linkColor: "#A0522D", hrColor: "#DDD5C3",
    selectionBg: "#A0522D22", hoverBg: "#EFE8D6",
    tableBorder: "#DDD5C3", tableHeaderBg: "#EFE8D6",
    shadow: "0 1px 3px rgba(67,52,34,0.08)",
  },
};

// ─── Default document ────────────────────────────────────────────────
const DEFAULT_DOC = `# 📝 Markdown 编辑器

欢迎使用基于 **Abricotine** 设计理念构建的在线 Markdown 编辑器！

## ✨ 特性一览

这个编辑器支持以下核心功能：

### 行内预览与实时渲染

编辑器左侧书写 Markdown，右侧 **实时预览** 渲染结果。支持所有标准 Markdown 和 GFM 语法。

### 文本格式

你可以使用 **粗体**、*斜体*、~~删除线~~ 以及 \`行内代码\` 等格式。

### 链接与图片

[访问 GitHub](https://github.com) 了解更多开源项目。

![示例图片](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop)

## 📊 表格

| 功能 | 状态 | 说明 |
|:------|:------:|------:|
| 实时预览 | ✅ | 即时渲染 |
| 主题切换 | ✅ | 三种主题 |
| 导出功能 | ✅ | HTML/MD |
| 目录导航 | ✅ | 侧边栏 |

## ✅ 待办清单

- [x] 实现 Markdown 解析器
- [x] 添加实时预览功能
- [x] 支持主题切换
- [ ] 添加更多快捷键
- [ ] 支持插件系统

## 💻 代码高亮

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算前10个斐波那契数
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
\`\`\`

## 📐 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## 引用

> 好的设计是尽可能少的设计。
> — Dieter Rams

---

## 🎯 快捷键

使用 \`Ctrl+B\` 加粗、\`Ctrl+I\` 斜体、\`Ctrl+S\` 保存、\`Ctrl+F\` 搜索替换，\`F11\` 进入禅模式。

尽情享受写作吧！ ✍️
`;

// ─── Main Component ──────────────────────────────────────────────────
export default function MarkdownEditor() {
  const [content, setContent] = useState(DEFAULT_DOC);
  const [theme, setTheme] = useState("light");
  const [showSidebar, setShowSidebar] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // split | edit | preview
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showExport, setShowExport] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [notification, setNotification] = useState(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const t = themes[theme];

  // ─── Auto-save ───────
  const debouncedSave = useMemo(
    () => _.debounce(() => setSaveStatus("saved"), 1500),
    []
  );

  useEffect(() => {
    setSaveStatus("saving");
    debouncedSave();
  }, [content, debouncedSave]);

  // ─── Undo/Redo ───────
  const pushUndo = useCallback((prev) => {
    setUndoStack(s => [...s.slice(-50), prev]);
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setRedoStack(s => [...s, content]);
    setContent(prev);
  }, [undoStack, content]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(s => s.slice(0, -1));
    setUndoStack(s => [...s, content]);
    setContent(next);
  }, [redoStack, content]);

  // ─── Text manipulation helpers ───────
  const wrapSelection = useCallback((before, after) => {
    const ta = editorRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = before + (selected || "文本") + (after || before);
    pushUndo(content);
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      const newStart = start + before.length;
      const newEnd = newStart + (selected || "文本").length;
      ta.setSelectionRange(newStart, newEnd);
    });
  }, [content, pushUndo]);

  const insertAtCursor = useCallback((text) => {
    const ta = editorRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    pushUndo(content);
    const newContent = content.substring(0, start) + text + content.substring(start);
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + text.length, start + text.length);
    });
  }, [content, pushUndo]);

  const prependLine = useCallback((prefix) => {
    const ta = editorRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    pushUndo(content);
    const newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }, [content, pushUndo]);

  // ─── Toolbar actions ───────
  const toolbarActions = {
    bold: () => wrapSelection("**", "**"),
    italic: () => wrapSelection("*", "*"),
    strikethrough: () => wrapSelection("~~", "~~"),
    code: () => wrapSelection("`", "`"),
    codeblock: () => wrapSelection("```\n", "\n```"),
    link: () => wrapSelection("[", "](url)"),
    image: () => insertAtCursor("\n![描述](url)\n"),
    ul: () => prependLine("- "),
    ol: () => prependLine("1. "),
    quote: () => prependLine("> "),
    task: () => prependLine("- [ ] "),
    hr: () => insertAtCursor("\n---\n"),
    h1: () => prependLine("# "),
    h2: () => prependLine("## "),
    h3: () => prependLine("### "),
    h4: () => prependLine("#### "),
    math: () => wrapSelection("$", "$"),
    mathBlock: () => insertAtCursor("\n$$\nf(x) = x^2\n$$\n"),
  };

  // ─── Keyboard shortcuts ───────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b": e.preventDefault(); toolbarActions.bold(); break;
          case "i": e.preventDefault(); toolbarActions.italic(); break;
          case "s": e.preventDefault(); setSaveStatus("saved"); notify("已保存"); break;
          case "f": e.preventDefault(); setShowSearch(s => !s); break;
          case "z": e.preventDefault(); e.shiftKey ? handleRedo() : handleUndo(); break;
          case "y": e.preventDefault(); handleRedo(); break;
        }
      }
      if (e.key === "F11") { e.preventDefault(); setZenMode(z => !z); }
      if (e.key === "Escape") {
        setZenMode(false); setShowSearch(false);
        setShowTableBuilder(false); setShowExport(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // ─── Search & Replace ───────
  const handleSearchReplace = useCallback(() => {
    if (!searchTerm) return;
    pushUndo(content);
    const newContent = content.split(searchTerm).join(replaceTerm);
    setContent(newContent);
    notify(`已替换 ${content.split(searchTerm).length - 1} 处`);
  }, [content, searchTerm, replaceTerm, pushUndo]);

  const searchCount = useMemo(() => {
    if (!searchTerm) return 0;
    return (content.match(new RegExp(_.escapeRegExp(searchTerm), "g")) || []).length;
  }, [content, searchTerm]);

  // ─── Table builder ───────
  const insertTable = useCallback(() => {
    const header = "| " + Array.from({ length: tableCols }, (_, i) => `标题${i + 1}`).join(" | ") + " |";
    const sep = "| " + Array.from({ length: tableCols }, () => "------").join(" | ") + " |";
    const rows = Array.from({ length: tableRows }, () =>
      "| " + Array.from({ length: tableCols }, () => "内容").join(" | ") + " |"
    ).join("\n");
    insertAtCursor(`\n${header}\n${sep}\n${rows}\n`);
    setShowTableBuilder(false);
    notify("表格已插入");
  }, [tableCols, tableRows, insertAtCursor]);

  // ─── Export ───────
  const exportHTML = useCallback(() => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Markdown Export</title>
<style>body{max-width:800px;margin:40px auto;padding:0 20px;font-family:-apple-system,sans-serif;line-height:1.8;color:#333}
h1,h2,h3{border-bottom:1px solid #eee;padding-bottom:.3em}code{background:#f5f5f5;padding:2px 6px;border-radius:3px}
pre{background:#f5f5f5;padding:16px;border-radius:6px;overflow-x:auto}blockquote{border-left:4px solid #ddd;margin:0;padding-left:16px;color:#666}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 12px}th{background:#f5f5f5}
img{max-width:100%;border-radius:6px}</style></head>
<body>${parseMarkdown(content)}</body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "document.html"; a.click();
    URL.revokeObjectURL(url);
    notify("已导出 HTML");
  }, [content]);

  const exportMD = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "document.md"; a.click();
    URL.revokeObjectURL(url);
    notify("已导出 Markdown");
  }, [content]);

  const copyHTML = useCallback(() => {
    const html = parseMarkdown(content);
    navigator.clipboard.writeText(html).then(() => notify("HTML 已复制到剪贴板"));
  }, [content]);

  // ─── Notification ───────
  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  // ─── Cursor position tracking ───────
  const handleEditorChange = (e) => {
    pushUndo(content);
    setContent(e.target.value);
    updateCursorPos(e.target);
  };

  const updateCursorPos = (ta) => {
    const pos = ta.selectionStart;
    const lines = ta.value.substring(0, pos).split("\n");
    setCursorPos({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  // ─── TOC ───────
  const headings = useMemo(() => extractHeadings(content), [content]);
  const stats = useMemo(() => countStats(content), [content]);
  const renderedHTML = useMemo(() => parseMarkdown(content), [content]);

  // ─── Scroll to heading ───────
  const scrollToHeading = (id) => {
    const el = previewRef.current?.querySelector(`[id="${CSS.escape(id)}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ─── Toolbar Button ───────
  const TBtn = ({ icon: IconComp, onClick, title, active, children }) => (
    <button onClick={onClick} title={title}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
        padding: "5px 7px", border: "none", borderRadius: 5, cursor: "pointer",
        background: active ? t.accentLight : "transparent", color: active ? t.accent : t.textSecondary,
        transition: "all 0.15s", fontSize: 12, fontWeight: 500,
      }}
      onMouseEnter={e => { if (!active) e.target.style.background = t.hoverBg; }}
      onMouseLeave={e => { if (!active) e.target.style.background = "transparent"; }}
    >
      {IconComp && <IconComp size={15} />}
      {children}
    </button>
  );

  const Divider = () => <div style={{ width: 1, height: 20, background: t.border, margin: "0 2px" }} />;

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", flexDirection: "column",
      background: t.bg, color: t.text, fontFamily: "'Noto Sans SC', 'SF Pro Text', -apple-system, sans-serif",
      overflow: "hidden", transition: "all 0.3s",
    }}>
      {/* ─── Google Fonts ─── */}
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* ─── Notification Toast ─── */}
      {notification && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999, padding: "10px 20px",
          background: t.accent, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          animation: "slideIn 0.3s ease",
        }}>{notification}</div>
      )}

      {/* ─── Toolbar ─── */}
      {!zenMode && (
        <div style={{
          display: "flex", alignItems: "center", padding: "6px 12px", gap: 2,
          background: t.toolbarBg, borderBottom: `1px solid ${t.toolbarBorder}`,
          boxShadow: t.shadow, zIndex: 100, flexWrap: "wrap",
        }}>
          {/* Logo */}
          <div style={{
            fontWeight: 700, fontSize: 14, color: t.accent, marginRight: 10,
            letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ fontSize: 18 }}>◈</span> MdEditor
          </div>

          <Divider />
          <TBtn icon={Icons.Undo} onClick={handleUndo} title="撤销 (Ctrl+Z)" />
          <TBtn icon={Icons.Redo} onClick={handleRedo} title="重做 (Ctrl+Y)" />
          <Divider />

          {/* Heading dropdown */}
          <div style={{ position: "relative" }}>
            <TBtn icon={Icons.Heading} onClick={() => setShowHeadingMenu(!showHeadingMenu)} title="标题">
              <Icons.ChevronDown size={10} />
            </TBtn>
            {showHeadingMenu && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 4,
                background: t.toolbarBg, border: `1px solid ${t.border}`, borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 1000, minWidth: 140,
                padding: 4, overflow: "hidden",
              }}>
                {[1, 2, 3, 4].map(level => (
                  <button key={level} onClick={() => { toolbarActions[`h${level}`](); setShowHeadingMenu(false); }}
                    style={{
                      display: "block", width: "100%", padding: "6px 12px", border: "none",
                      background: "transparent", cursor: "pointer", textAlign: "left",
                      fontSize: 20 - level * 2, fontWeight: 600, color: t.text, borderRadius: 4,
                    }}
                    onMouseEnter={e => e.target.style.background = t.hoverBg}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >H{level} · {"#".repeat(level)} 标题</button>
                ))}
              </div>
            )}
          </div>

          <TBtn icon={Icons.Bold} onClick={toolbarActions.bold} title="粗体 (Ctrl+B)" />
          <TBtn icon={Icons.Italic} onClick={toolbarActions.italic} title="斜体 (Ctrl+I)" />
          <TBtn icon={Icons.Strikethrough} onClick={toolbarActions.strikethrough} title="删除线" />
          <Divider />
          <TBtn icon={Icons.Code} onClick={toolbarActions.code} title="行内代码" />
          <TBtn icon={Icons.Link} onClick={toolbarActions.link} title="链接" />
          <TBtn icon={Icons.Image} onClick={toolbarActions.image} title="图片" />
          <Divider />
          <TBtn icon={Icons.List} onClick={toolbarActions.ul} title="无序列表" />
          <TBtn icon={Icons.ListOrdered} onClick={toolbarActions.ol} title="有序列表" />
          <TBtn icon={Icons.Check} onClick={toolbarActions.task} title="待办事项" />
          <TBtn icon={Icons.Quote} onClick={toolbarActions.quote} title="引用" />
          <Divider />
          <TBtn icon={Icons.Table} onClick={() => setShowTableBuilder(true)} title="插入表格" />
          <TBtn icon={Icons.HR} onClick={toolbarActions.hr} title="分割线" />
          <TBtn icon={Icons.Math} onClick={toolbarActions.math} title="数学公式" />

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right side controls */}
          <TBtn icon={Icons.Search} onClick={() => setShowSearch(s => !s)} title="搜索替换 (Ctrl+F)" />

          {/* View mode */}
          <div style={{ display: "flex", background: t.hoverBg, borderRadius: 6, padding: 2 }}>
            <TBtn icon={Icons.Edit} onClick={() => setViewMode("edit")} title="编辑模式" active={viewMode === "edit"} />
            <TBtn icon={Icons.Columns} onClick={() => setViewMode("split")} title="分屏模式" active={viewMode === "split"} />
            <TBtn icon={Icons.Eye} onClick={() => setViewMode("preview")} title="预览模式" active={viewMode === "preview"} />
          </div>

          <TBtn icon={Icons.Sidebar} onClick={() => setShowSidebar(s => !s)} title="目录侧栏" active={showSidebar} />

          {/* Theme */}
          <div style={{ position: "relative" }}>
            <TBtn icon={theme === "dark" ? Icons.Moon : Icons.Sun} onClick={() => setShowThemeMenu(!showThemeMenu)} title="切换主题">
              <Icons.ChevronDown size={10} />
            </TBtn>
            {showThemeMenu && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4,
                background: t.toolbarBg, border: `1px solid ${t.border}`, borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 1000, minWidth: 120, padding: 4,
              }}>
                {Object.entries(themes).map(([key, th]) => (
                  <button key={key} onClick={() => { setTheme(key); setShowThemeMenu(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px",
                      border: "none", background: theme === key ? t.accentLight : "transparent",
                      cursor: "pointer", color: theme === key ? t.accent : t.text, borderRadius: 4, fontSize: 13,
                    }}
                    onMouseEnter={e => { if (theme !== key) e.target.style.background = t.hoverBg; }}
                    onMouseLeave={e => { if (theme !== key) e.target.style.background = "transparent"; }}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: 7, background: th.accent, border: `2px solid ${th.border}` }} />
                    {th.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <TBtn icon={Icons.Download} onClick={() => setShowExport(true)} title="导出" />
          <TBtn icon={zenMode ? Icons.Minimize : Icons.Maximize} onClick={() => setZenMode(z => !z)} title="禅模式 (F11)" />
        </div>
      )}

      {/* ─── Search & Replace Bar ─── */}
      {showSearch && (
        <div style={{
          display: "flex", alignItems: "center", padding: "8px 16px", gap: 8,
          background: t.toolbarBg, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap",
        }}>
          <Icons.Search size={14} style={{ color: t.textSecondary, flexShrink: 0 }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索..."
            style={{
              padding: "5px 10px", border: `1px solid ${t.border}`, borderRadius: 5,
              background: t.editorBg, color: t.text, fontSize: 13, outline: "none", width: 180,
            }}
            onFocus={e => e.target.style.borderColor = t.accent}
            onBlur={e => e.target.style.borderColor = t.border}
          />
          <input value={replaceTerm} onChange={e => setReplaceTerm(e.target.value)} placeholder="替换..."
            style={{
              padding: "5px 10px", border: `1px solid ${t.border}`, borderRadius: 5,
              background: t.editorBg, color: t.text, fontSize: 13, outline: "none", width: 180,
            }}
            onFocus={e => e.target.style.borderColor = t.accent}
            onBlur={e => e.target.style.borderColor = t.border}
          />
          <span style={{ fontSize: 12, color: t.textSecondary, minWidth: 60 }}>
            {searchCount > 0 ? `${searchCount} 处匹配` : searchTerm ? "无匹配" : ""}
          </span>
          <button onClick={handleSearchReplace}
            style={{
              padding: "5px 14px", background: t.accent, color: "#fff", border: "none",
              borderRadius: 5, fontSize: 12, cursor: "pointer", fontWeight: 500,
            }}>全部替换</button>
          <button onClick={() => setShowSearch(false)}
            style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: t.textSecondary }}>
            <Icons.X size={14} />
          </button>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ─── TOC Sidebar ─── */}
        {showSidebar && !zenMode && (
          <div style={{
            width: 220, flexShrink: 0, background: t.sidebarBg, borderRight: `1px solid ${t.border}`,
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 16px 10px", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.08em", color: t.textSecondary,
            }}>目录导航</div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
              {headings.length === 0 ? (
                <div style={{ padding: "12px 8px", fontSize: 12, color: t.textMuted, fontStyle: "italic" }}>
                  暂无标题
                </div>
              ) : headings.map((h, i) => (
                <button key={i} onClick={() => scrollToHeading(h.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", border: "none",
                    background: "transparent", cursor: "pointer", padding: "5px 8px",
                    paddingLeft: 8 + (h.level - 1) * 14, fontSize: h.level <= 2 ? 13 : 12,
                    fontWeight: h.level <= 2 ? 600 : 400, color: h.level <= 2 ? t.text : t.textSecondary,
                    borderRadius: 4, lineHeight: 1.5, transition: "background 0.15s",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                  onMouseEnter={e => e.target.style.background = t.hoverBg}
                  onMouseLeave={e => e.target.style.background = "transparent"}
                >
                  {h.level <= 2 && <span style={{ color: t.accent, marginRight: 4, fontSize: 8, verticalAlign: "middle" }}>●</span>}
                  {h.text}
                </button>
              ))}
            </div>
            {/* Stats */}
            <div style={{
              padding: "10px 16px", borderTop: `1px solid ${t.border}`,
              fontSize: 11, color: t.textMuted, display: "flex", flexDirection: "column", gap: 3,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>字数</span><span style={{ color: t.textSecondary }}>{stats.words.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>字符</span><span style={{ color: t.textSecondary }}>{stats.chars.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>行数</span><span style={{ color: t.textSecondary }}>{stats.lines.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Editor Pane ─── */}
        {(viewMode === "split" || viewMode === "edit") && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
            borderRight: viewMode === "split" ? `1px solid ${t.border}` : "none",
          }}>
            {!zenMode && (
              <div style={{
                padding: "6px 16px", fontSize: 11, color: t.textMuted,
                borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between",
                alignItems: "center", background: t.sidebarBg,
              }}>
                <span style={{ fontWeight: 500 }}>✏️ 编辑器</span>
                <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
              </div>
            )}
            <textarea
              ref={editorRef}
              value={content}
              onChange={handleEditorChange}
              onClick={e => updateCursorPos(e.target)}
              onKeyUp={e => updateCursorPos(e.target)}
              spellCheck={false}
              style={{
                flex: 1, width: "100%", padding: zenMode ? "60px 15%" : "24px 28px",
                border: "none", outline: "none", resize: "none",
                background: t.editorBg, color: t.text,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                fontSize: zenMode ? 16 : 14, lineHeight: 1.85, tabSize: 2,
                letterSpacing: "0.01em",
              }}
              placeholder="开始书写 Markdown..."
            />
          </div>
        )}

        {/* ─── Preview Pane ─── */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {!zenMode && (
              <div style={{
                padding: "6px 16px", fontSize: 11, color: t.textMuted,
                borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between",
                alignItems: "center", background: t.sidebarBg,
              }}>
                <span style={{ fontWeight: 500 }}>👁️ 预览</span>
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  color: saveStatus === "saved" ? "#4CAF50" : t.accent,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 3,
                    background: saveStatus === "saved" ? "#4CAF50" : t.accent,
                  }} />
                  {saveStatus === "saved" ? "已保存" : "保存中..."}
                </span>
              </div>
            )}
            <div ref={previewRef} style={{
              flex: 1, overflowY: "auto", padding: zenMode ? "60px 15%" : "28px 36px",
              background: t.previewBg,
            }}>
              <style>{`
                .md-preview { font-family: 'Noto Serif SC', 'Georgia', serif; line-height: 1.9; color: ${t.text}; max-width: 100%; }
                .md-preview .md-h { margin: 1.6em 0 0.7em; font-family: 'Noto Sans SC', sans-serif; letter-spacing: -0.01em; }
                .md-preview .md-h1 { font-size: 2em; font-weight: 700; padding-bottom: 0.3em; border-bottom: 2px solid ${t.border}; }
                .md-preview .md-h2 { font-size: 1.55em; font-weight: 600; padding-bottom: 0.25em; border-bottom: 1px solid ${t.border}; }
                .md-preview .md-h3 { font-size: 1.25em; font-weight: 600; }
                .md-preview .md-h4 { font-size: 1.1em; font-weight: 600; color: ${t.textSecondary}; }
                .md-preview .md-p { margin: 0.8em 0; font-size: 15px; }
                .md-preview strong { font-weight: 700; color: ${t.text}; }
                .md-preview em { font-style: italic; }
                .md-preview del { color: ${t.textMuted}; }
                .md-preview .md-link { color: ${t.linkColor}; text-decoration: none; border-bottom: 1px solid ${t.linkColor}40; transition: border 0.2s; }
                .md-preview .md-link:hover { border-bottom-color: ${t.linkColor}; }
                .md-preview .md-inline-code { font-family: 'JetBrains Mono', monospace; font-size: 0.88em; background: ${t.codeBg}; color: ${t.accent}; padding: 2px 7px; border-radius: 4px; }
                .md-preview .md-codeblock { margin: 1.2em 0; background: ${t.codeBg}; border-radius: 10px; overflow: hidden; border: 1px solid ${t.border}; position: relative; }
                .md-preview .md-codeblock .code-lang { position: absolute; top: 8px; right: 12px; font-size: 11px; color: ${t.textMuted}; font-family: 'Noto Sans SC', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; }
                .md-preview .md-codeblock pre { margin: 0; padding: 20px 24px; overflow-x: auto; }
                .md-preview .md-codeblock code { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; color: ${t.codeText}; }
                .md-preview .md-blockquote { margin: 1.2em 0; padding: 12px 20px; border-left: 4px solid ${t.blockquoteBorder}; background: ${t.blockquoteBg}; border-radius: 0 8px 8px 0; font-style: italic; }
                .md-preview .md-ul, .md-preview .md-ol { margin: 0.8em 0; padding-left: 1.8em; }
                .md-preview .md-ul-item, .md-preview .md-ol-item { margin: 0.35em 0; font-size: 15px; }
                .md-preview .md-task { display: flex; align-items: center; gap: 10px; margin: 6px 0; font-size: 15px; }
                .md-preview .md-checkbox { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 5px; border: 2px solid ${t.border}; font-size: 12px; color: transparent; flex-shrink: 0; }
                .md-preview .md-checkbox.checked { background: ${t.accent}; border-color: ${t.accent}; color: #fff; }
                .md-preview .md-task-done .done-text { text-decoration: line-through; color: ${t.textMuted}; }
                .md-preview .md-hr { border: none; height: 2px; background: linear-gradient(to right, transparent, ${t.hrColor}, transparent); margin: 2em 0; }
                .md-preview .md-table-wrap { margin: 1.2em 0; overflow-x: auto; border-radius: 8px; border: 1px solid ${t.tableBorder}; }
                .md-preview .md-table { width: 100%; border-collapse: collapse; font-size: 14px; font-family: 'Noto Sans SC', sans-serif; }
                .md-preview .md-table th { background: ${t.tableHeaderBg}; font-weight: 600; padding: 10px 16px; border-bottom: 2px solid ${t.tableBorder}; }
                .md-preview .md-table td { padding: 9px 16px; border-bottom: 1px solid ${t.tableBorder}; }
                .md-preview .md-table tr:last-child td { border-bottom: none; }
                .md-preview .md-image-wrap { margin: 1.5em 0; text-align: center; }
                .md-preview .md-image { max-width: 100%; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .md-preview .md-image-alt { display: block; margin-top: 8px; font-size: 12px; color: ${t.textMuted}; font-style: italic; }
                .md-preview .math-block { margin: 1.2em 0; padding: 16px 24px; background: ${t.codeBg}; border-radius: 10px; text-align: center; border: 1px solid ${t.border}; position: relative; }
                .md-preview .math-block .math-label { position: absolute; top: 6px; right: 10px; font-size: 10px; color: ${t.textMuted}; font-family: 'Noto Sans SC', sans-serif; }
                .md-preview .math-block code { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: ${t.accent}; background: none; }
                .md-preview .math-inline code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; color: ${t.accent}; background: ${t.codeBg}; padding: 1px 5px; border-radius: 3px; }
              `}</style>
              <div className="md-preview" dangerouslySetInnerHTML={{ __html: renderedHTML }} />
            </div>
          </div>
        )}
      </div>

      {/* ─── Status Bar ─── */}
      {!zenMode && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "4px 16px", background: t.sidebarBg, borderTop: `1px solid ${t.border}`,
          fontSize: 11, color: t.textMuted, gap: 16,
        }}>
          <div style={{ display: "flex", gap: 16 }}>
            <span>Markdown</span>
            <span>{stats.words} 词 · {stats.chars} 字符 · {stats.lines} 行</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>UTF-8</span>
            <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          </div>
        </div>
      )}

      {/* ─── Zen Mode Exit Hint ─── */}
      {zenMode && (
        <div style={{
          position: "fixed", bottom: 20, right: 20,
          padding: "6px 14px", background: t.text + "20", borderRadius: 20,
          fontSize: 11, color: t.textSecondary, zIndex: 10,
        }}>按 ESC 或 F11 退出禅模式</div>
      )}

      {/* ─── Table Builder Modal ─── */}
      {showTableBuilder && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowTableBuilder(false)}>
          <div style={{
            background: t.toolbarBg, borderRadius: 14, padding: 28, minWidth: 340,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${t.border}`,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📊 插入表格</span>
              <button onClick={() => setShowTableBuilder(false)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textSecondary }}><Icons.X size={18} /></button>
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              <label style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>行数</div>
                <input type="number" min="1" max="20" value={tableRows} onChange={e => setTableRows(+e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", border: `1px solid ${t.border}`, borderRadius: 6,
                    background: t.editorBg, color: t.text, fontSize: 14, outline: "none",
                  }} />
              </label>
              <label style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>列数</div>
                <input type="number" min="1" max="10" value={tableCols} onChange={e => setTableCols(+e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", border: `1px solid ${t.border}`, borderRadius: 6,
                    background: t.editorBg, color: t.text, fontSize: 14, outline: "none",
                  }} />
              </label>
            </div>
            {/* Preview grid */}
            <div style={{
              display: "grid", gridTemplateColumns: `repeat(${Math.min(tableCols, 8)}, 1fr)`, gap: 3,
              marginBottom: 20, padding: 12, background: t.codeBg, borderRadius: 8,
            }}>
              {Array.from({ length: Math.min(tableRows + 1, 6) * Math.min(tableCols, 8) }, (_, i) => (
                <div key={i} style={{
                  height: 18, borderRadius: 3,
                  background: i < Math.min(tableCols, 8) ? t.accent + "40" : t.border,
                }} />
              ))}
            </div>
            <button onClick={insertTable} style={{
              width: "100%", padding: "10px", background: t.accent, color: "#fff",
              border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}>插入 {tableRows}×{tableCols} 表格</button>
          </div>
        </div>
      )}

      {/* ─── Export Modal ─── */}
      {showExport && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowExport(false)}>
          <div style={{
            background: t.toolbarBg, borderRadius: 14, padding: 28, minWidth: 360,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${t.border}`,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📤 导出文档</span>
              <button onClick={() => setShowExport(false)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textSecondary }}><Icons.X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "🌐", label: "导出 HTML", desc: "完整的 HTML 文件，包含样式", fn: exportHTML },
                { icon: "📝", label: "导出 Markdown", desc: "原始 .md 文件", fn: exportMD },
                { icon: "📋", label: "复制 HTML", desc: "将渲染后的 HTML 复制到剪贴板", fn: copyHTML },
              ].map((item, i) => (
                <button key={i} onClick={() => { item.fn(); setShowExport(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                    border: `1px solid ${t.border}`, borderRadius: 10, background: t.editorBg,
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.accentLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.editorBg; }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Global Animation Styles ─── */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        textarea::placeholder { color: ${t.textMuted}; }
        textarea::-webkit-scrollbar, div::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track, div::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb, div::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        textarea::-webkit-scrollbar-thumb:hover, div::-webkit-scrollbar-thumb:hover { background: ${t.textMuted}; }
        ::selection { background: ${t.selectionBg}; }
      `}</style>
    </div>
  );
}
