import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// 格式与 MIME 类型映射表
// ─────────────────────────────────────────────
const FORMAT_MAP = {
  pdf: { ext: ".pdf", mime: "application/pdf", label: "PDF", icon: "📄" },
  doc: { ext: ".doc", mime: "application/msword", label: "DOC", icon: "📝" },
  docx: { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "DOCX", icon: "📝" },
  txt: { ext: ".txt", mime: "text/plain", label: "TXT", icon: "📃" },
  md: { ext: ".md", mime: "text/markdown", label: "Markdown", icon: "✍️" },
};

const ALLOWED_EXTENSIONS = Object.keys(FORMAT_MAP);
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// ─────────────────────────────────────────────
// 辅助工具函数
// ─────────────────────────────────────────────
/** 格式化字节为人类可读的字符串 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/** 从文件名中提取扩展名（不含点号，小写） */
function getExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/** 替换文件名的扩展名 */
function replaceExtension(filename, newExt) {
  const parts = filename.split(".");
  parts[parts.length - 1] = newExt.replace(".", "");
  return parts.join(".");
}

/** 生成唯一 ID */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─────────────────────────────────────────────
// Toast 通知组件
// ─────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  const typeStyle = {
    success: { bg: "bg-emerald-500", icon: "✓" },
    error: { bg: "bg-red-500", icon: "✕" },
    info: { bg: "bg-sky-500", icon: "ℹ" },
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: 380 }}>
      {toasts.map((t) => {
        const s = typeStyle[t.type] || typeStyle.info;
        return (
          <div
            key={t.id}
            className={`${s.bg} text-white rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 animate-slideIn`}
            style={{ animation: "slideIn 0.3s cubic-bezier(.4,0,.2,1) forwards" }}
          >
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-sm font-bold">
              {s.icon}
            </span>
            <span className="text-sm leading-snug flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">&times;</button>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// 加载转动图标
// ─────────────────────────────────────────────
function Spinner({ size = "w-4 h-4" }) {
  return (
    <svg className={`${size} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 自定义 Select 下拉组件（美观且统一风格）
// ─────────────────────────────────────────────
function FormatSelect({ value, options, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative" style={{ minWidth: 130 }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
          ${disabled
            ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
            : open
              ? "bg-gray-800 border-sky-400 text-white shadow-[0_0_0_2px_rgba(56,189,248,0.25)]"
              : "bg-gray-800 border-gray-600 text-gray-200 hover:border-gray-400"
          }`}
      >
        <span className="flex items-center gap-1.5">
          {selected ? <>{FORMAT_MAP[selected.value]?.icon} {selected.label}</> : <span className="text-gray-500">选择格式</span>}
        </span>
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="absolute z-40 mt-1.5 w-full min-w-[130px] bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden"
          style={{ animation: "dropDown 0.15s cubic-bezier(.4,0,.2,1) forwards" }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors
                ${opt.value === value ? "bg-sky-500 bg-opacity-20 text-sky-300" : "text-gray-300 hover:bg-gray-700"}`}
            >
              <span>{FORMAT_MAP[opt.value]?.icon}</span>
              <span className="font-medium">{opt.label}</span>
              <span className="ml-auto text-gray-500 text-xs">{FORMAT_MAP[opt.value]?.ext}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 单个文件卡片
// ─────────────────────────────────────────────
function FileCard({ file, onDelete, onConvert, onDownload, onTargetChange }) {
  const { status, originalExt, targetFormat, originalName, size, convertedBlob, error } = file;

  // 目标格式选项：过滤掉自身原始格式
  const options = ALLOWED_EXTENSIONS
    .filter(ext => ext !== originalExt)
    .map(ext => ({ value: ext, label: FORMAT_MAP[ext].label }));

  const statusColor = {
    idle: "border-gray-600",
    uploading: "border-sky-400",
    converting: "border-amber-400",
    success: "border-emerald-500",
    error: "border-red-500",
  };

  const statusBadge = {
    idle: { bg: "bg-gray-700", text: "text-gray-300", label: "等待转换" },
    uploading: { bg: "bg-sky-900", text: "text-sky-300", label: "上传中…" },
    converting: { bg: "bg-amber-900", text: "text-amber-300", label: "转换中…" },
    success: { bg: "bg-emerald-900", text: "text-emerald-300", label: "转换成功" },
    error: { bg: "bg-red-900", text: "text-red-300", label: "转换失败" },
  };

  const badge = statusBadge[status] || statusBadge.idle;

  return (
    <div className={`relative bg-gray-800 border ${statusColor[status]} rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/30`}
      style={{ animation: "fadeSlideUp 0.35s cubic-bezier(.4,0,.2,1) both" }}>
      {/* 左侧格式图标 */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gray-700 flex items-center justify-center text-2xl">
          {FORMAT_MAP[originalExt]?.icon || "📄"}
        </div>

        {/* 文件信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm truncate" style={{ maxWidth: 220 }}>{originalName}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
              {(status === "uploading" || status === "converting") && <Spinner size="w-3 h-3" />}
              {status === "success" && <span>✓</span>}
              {status === "error" && <span>✕</span>}
              {badge.label}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
            <span>原格式: <span className="text-gray-400 font-medium">{FORMAT_MAP[originalExt]?.label || originalExt.toUpperCase()}</span></span>
            <span>大小: <span className="text-gray-400 font-medium">{formatBytes(size)}</span></span>
          </div>

          {/* 错误信息 */}
          {status === "error" && error && (
            <p className="mt-1.5 text-xs text-red-400 bg-red-900 bg-opacity-40 rounded-lg px-2.5 py-1.5">{error}</p>
          )}
        </div>

        {/* 删除按钮 */}
        <button
          onClick={onDelete}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-colors"
          title="删除文件"
        >✕</button>
      </div>

      {/* 下方操作栏 */}
      <div className="mt-3.5 flex items-center gap-2 flex-wrap">
        {/* 目标格式选择 */}
        <FormatSelect
          value={targetFormat}
          options={options}
          onChange={onTargetChange}
          disabled={status === "converting" || status === "uploading"}
        />

        {/* 转换按钮 */}
        {status !== "success" && (
          <button
            onClick={onConvert}
            disabled={!targetFormat || status === "converting" || status === "uploading"}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
              ${!targetFormat || status === "converting" || status === "uploading"
                ? "bg-gray-700 text-gray-600 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/25 active:scale-95"
              }`}
          >
            {status === "converting" ? <span className="flex items-center gap-1.5"><Spinner size="w-3.5 h-3.5" /> 转换中</span> : "转换"}
          </button>
        )}

        {/* 重新转换（成功后可重新选格式转换） */}
        {status === "success" && (
          <button
            onClick={onConvert}
            disabled={!targetFormat}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors active:scale-95"
          >重新转换</button>
        )}

        {/* 下载按钮 */}
        {status === "success" && convertedBlob && (
          <button
            onClick={onDownload}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            下载
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 主应用组件
// ─────────────────────────────────────────────
export default function App() {
  const [files, setFiles] = useState([]);   // 文件列表状态
  const [toasts, setToasts] = useState([]);   // Toast 通知队列
  const [isDragging, setIsDragging] = useState(false); // 拖拽状态
  const [batchFormat, setBatchFormat] = useState(""); // 批量目标格式
  const [zipping, setZipping] = useState(false); // ZIP打包中
  const fileInputRef = useRef(null);
  const jsZipRef = useRef(null);    // JSZip 引用

  // ── 动态加载 JSZip（CDN） ──
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => { jsZipRef.current = window.JSZip; };
    script.onerror = () => addToast("JSZip 加载失败，批量下载功能不可用", "error");
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  // ── Toast 管理 ──
  const addToast = useCallback((message, type = "info") => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── 文件上传校验与处理 ──
  const processFiles = useCallback((rawFiles) => {
    const newFiles = [];
    Array.from(rawFiles).forEach((f) => {
      const ext = getExtension(f.name);
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        addToast(`"${f.name}" — 不支持的格式，仅允许：PDF、Doc、Docx、TXT、Markdown`, "error");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        addToast(`"${f.name}" — 文件大小超过 100MB 限制 (${formatBytes(f.size)})`, "error");
        return;
      }
      // 模拟上传动画（实际为本地读取，加一个短暂延迟）
      const fileId = uid();
      newFiles.push({
        id: fileId,
        originalName: f.name,
        originalExt: ext,
        size: f.size,
        blob: f,
        targetFormat: "",
        status: "uploading",
        convertedBlob: null,
        error: null,
      });
    });

    if (newFiles.length === 0) return;

    setFiles(prev => [...prev, ...newFiles]);

    // 模拟上传完成（延迟 600ms 给用户一个视觉反馈）
    setTimeout(() => {
      setFiles(prev =>
        prev.map(item =>
          newFiles.some(nf => nf.id === item.id) && item.status === "uploading"
            ? { ...item, status: "idle" }
            : item
        )
      );
    }, 600);

    addToast(`成功添加 ${newFiles.length} 个文件`, "success");
  }, [addToast]);

  // ── 拖拽事件处理 ──
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };
  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = ""; // 重置 input，允许重复选择同一文件
  };

  // ── 单文件转换核心逻辑 ──
  const convertFile = useCallback((fileId) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: "converting", error: null } : f));

    // 模拟转换耗时（实际仅是 Blob 复制，加延迟给用户视觉反馈）
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id !== fileId) return f;
        if (!f.targetFormat) {
          return { ...f, status: "error", error: "未选择目标格式" };
        }
        try {
          const target = FORMAT_MAP[f.targetFormat];
          if (!target) return { ...f, status: "error", error: "目标格式映射异常" };

          // ── 核心：仅替换 MIME 和文件名后缀，Blob 数据原封不动 ──
          const newBlob = new Blob([f.blob], { type: target.mime });
          const newName = replaceExtension(f.originalName, target.ext);
          return { ...f, status: "success", convertedBlob: newBlob, convertedName: newName, error: null };
        } catch (err) {
          return { ...f, status: "error", error: `转换异常: ${err.message}` };
        }
      }));
    }, 500);
  }, []);

  // ── 单文件下载 ──
  const downloadFile = useCallback((fileId) => {
    const f = files.find(item => item.id === fileId);
    if (!f || !f.convertedBlob) return;
    const url = URL.createObjectURL(f.convertedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = f.convertedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`已下载 "${f.convertedName}"`, "success");
  }, [files, addToast]);

  // ── 删除文件 ──
  const deleteFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    addToast("文件已删除", "info");
  }, [addToast]);

  // ── 批量操作 ──
  const batchConvert = useCallback(() => {
    if (!batchFormat) { addToast("请先选择批量目标格式", "error"); return; }
    let count = 0;
    files.forEach(f => {
      if (f.originalExt !== batchFormat && f.status !== "converting" && f.status !== "uploading") {
        // 先设置目标格式
        setFiles(prev => prev.map(item =>
          item.id === f.id ? { ...item, targetFormat: batchFormat } : item
        ));
        count++;
      }
    });
    // 延迟一帧再统一触发转换（确保状态更新）
    setTimeout(() => {
      files.forEach(f => {
        if (f.originalExt !== batchFormat && f.status !== "converting" && f.status !== "uploading") {
          convertFile(f.id);
        }
      });
    }, 50);
    if (count > 0) addToast(`正在批量转换 ${count} 个文件为 ${FORMAT_MAP[batchFormat]?.label}`, "info");
    else addToast("无可转换的文件", "info");
  }, [batchFormat, files, convertFile, addToast]);

  const batchDelete = useCallback(() => {
    const count = files.length;
    setFiles([]);
    addToast(`已删除全部 ${count} 个文件`, "info");
  }, [files, addToast]);

  const batchDownload = useCallback(async () => {
    const successFiles = files.filter(f => f.status === "success" && f.convertedBlob);
    if (successFiles.length === 0) { addToast("无转换成功的文件可下载", "error"); return; }
    if (!jsZipRef.current) { addToast("JSZip 未加载，无法批量下载", "error"); return; }

    setZipping(true);
    addToast("正在打包 ZIP…", "info");

    try {
      const zip = new jsZipRef.current();
      for (const f of successFiles) {
        zip.file(f.convertedName, f.convertedBlob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "转换文件合包.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(`ZIP 下载完成，共 ${successFiles.length} 个文件`, "success");
    } catch (err) {
      addToast(`打包失败: ${err.message}`, "error");
    }
    setZipping(false);
  }, [files, addToast]);

  // ── 派生状态 ──
  const successCount = files.filter(f => f.status === "success").length;
  const batchOptions = ALLOWED_EXTENSIONS.map(ext => ({ value: ext, label: FORMAT_MAP[ext].label }));

  // ─────────────────────────────────────────────
  // 渲染
  // ─────────────────────────────────────────────
  return (
    <>
      {/* 全局 CSS 动画 */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(56,189,248,0.5); }
          70%  { box-shadow: 0 0 0 10px rgba(56,189,248,0); }
          100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); }
        }
        .pulse-ring { animation: pulse-ring 2s infinite; }
        /* 滚动条美化 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #4B5563; }
      `}</style>

      {/* Toast 层 */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* 页面根容器 — 深色主题 */}
      <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* ── 顶部渐变横幅 ── */}
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)", borderBottom: "1px solid #1e293b" }}>
          {/* 装饰光斑 */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: "absolute", top: -80, left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -60, right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-3xl">⇄</span>
              <h1 className="text-3xl font-bold text-white tracking-tight">文件格式互转</h1>
            </div>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
              支持 PDF · DOC · DOCX · TXT · Markdown 之间自由互转。<br />
              <span className="text-gray-600 text-xs">注意：本工具仅修改文件后缀名与 MIME 类型，不做内容格式转换。</span>
            </p>
          </div>
        </div>

        {/* ── 主内容区 ── */}
        <div className="max-w-4xl mx-auto px-4 py-6 pb-16">

          {/* ── 上传区域 ── */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 select-none
              ${isDragging
                ? "border-sky-400 bg-sky-500 bg-opacity-5 shadow-lg shadow-sky-500/10 scale-[1.01] pulse-ring"
                : "border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-900/80"
              }`}
            style={{ padding: "40px 24px" }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full"
              style={{ cursor: "pointer" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-none">
              {/* 上传图标 */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                ${isDragging ? "bg-sky-500 bg-opacity-20 scale-110" : "bg-gray-800"}`}>
                <svg className={`w-7 h-7 transition-colors ${isDragging ? "text-sky-400" : "text-gray-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={`font-semibold text-base transition-colors ${isDragging ? "text-sky-300" : "text-gray-300"}`}>
                {isDragging ? "释放鼠标上传文件" : "拖拽文件到此处，或点击选择文件"}
              </p>
              <p className="text-gray-600 text-xs">
                支持格式：PDF、DOC、DOCX、TXT、Markdown &nbsp;·&nbsp; 单文件最大 100MB
              </p>
              {/* 支持格式小标签 */}
              <div className="flex gap-1.5 flex-wrap justify-center mt-1">
                {ALLOWED_EXTENSIONS.map(ext => (
                  <span key={ext} className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 text-xs font-medium border border-gray-700">
                    {FORMAT_MAP[ext].icon} {FORMAT_MAP[ext].label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── 文件列表 ── */}
          <div className="mt-4">
            {files.length === 0 ? (
              /* 空状态 */
              <div className="mt-12 flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-3xl">📭</div>
                <p className="text-gray-600 text-sm">文件列表为空</p>
                <p className="text-gray-700 text-xs max-w-sm">添加文件后，转换结果将在此处展示。支持拖拽或点击上方区域上传。</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {files.map((f, i) => (
                  <div key={f.id} style={{ animationDelay: `${i * 0.04}s` }}>
                    <FileCard
                      file={f}
                      onDelete={() => deleteFile(f.id)}
                      onConvert={() => convertFile(f.id)}
                      onDownload={() => downloadFile(f.id)}
                      onTargetChange={(fmt) => setFiles(prev => prev.map(item => item.id === f.id ? { ...item, targetFormat: fmt } : item))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 批量操作栏（仅有文件时显示） ── */}
          {files.length > 0 && (
            <div className="mt-4 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3"
              style={{ animation: "fadeSlideUp 0.3s cubic-bezier(.4,0,.2,1) both" }}>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">批量操作</span>
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {/* 批量目标格式 */}
                <FormatSelect value={batchFormat} options={batchOptions} onChange={setBatchFormat} />
                {/* 批量转换 */}
                <button
                  onClick={batchConvert}
                  disabled={!batchFormat}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${!batchFormat ? "bg-gray-800 text-gray-600 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-400 text-white active:scale-95 shadow-md shadow-sky-500/20"}`}
                >批量转换</button>
              </div>
              <div className="flex items-center gap-2">
                {/* 批量下载 */}
                <button
                  onClick={batchDownload}
                  disabled={successCount === 0 || zipping}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all
                    ${successCount === 0 || zipping
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-400 text-white active:scale-95 shadow-md shadow-emerald-500/20"
                    }`}
                >
                  {zipping ? <><Spinner size="w-3 h-3" /> 打包中</>
                    : <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      批量下载 ({successCount})
                    </>
                  }
                </button>
                {/* 全部删除 */}
                <button onClick={batchDelete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-400 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-all active:scale-95">
                  全部删除
                </button>
              </div>
            </div>
          )}

          {/* ── 底部说明 ── */}
          <div className="mt-10 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-700 text-xs leading-relaxed max-w-2xl mx-auto">
              ⚠️ 本工具仅修改文件后缀名与对应 MIME 类型，不对文件内容做任何解析或重构。转换后的文件可能无法被目标软件正确识别和打开，仅供文件名称变更使用。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
