import { useMemo, useState } from "react";
import { useDesigner } from "../../state/designerContext";
import { validateSchema } from "../../schema/validators";
import YAML from "js-yaml";
import {
    downloadText,
    openTextByPicker,
    saveTextByPicker,
    saveTextToDirectory,
    supportsFileSystemAccessAPI,
} from "../../utils/fileIO";
import { usePermissions, useRole } from "../../auth/RoleContext";

export function TopBar() {
    const { state, dispatch } = useDesigner();
    const perms = usePermissions();
    const crole =useRole();

    const [jsonOpen, setJsonOpen] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [format, setFormat] = useState<"json" | "yaml">("json");

    const errors = useMemo(() => validateSchema(state.schema), [state.schema]);

    function serializeSchema(fmt: "json" | "yaml") {
        if (fmt === "yaml") return YAML.dump(state.schema, { noRefs: true, lineWidth: 120 });
        return JSON.stringify(state.schema, null, 2);
    }

    function parseSchemaText(text: string, fileName?: string) {
        const lower = (fileName || "").toLowerCase();
        const looksYaml = lower.endsWith(".yml") || lower.endsWith(".yaml");
        const looksJson = lower.endsWith(".json");
        try {
            if (looksYaml) return YAML.load(text);
            if (looksJson) return JSON.parse(text);
            // 没有扩展名时：先试 JSON，失败再试 YAML
            try {
                return JSON.parse(text);
            } catch {
                return YAML.load(text);
            }
        } catch (e: any) {
            throw new Error(e?.message ?? "解析失败");
        }
    }

    function openImportPanel() {
        const text = serializeSchema(format);
        setJsonText(text);
        setJsonOpen(true);
    }

    function importSchema() {
        try {
            const parsed = parseSchemaText(jsonText);
            dispatch({ type: "SET_SCHEMA", schema: parsed });
            setJsonOpen(false);
        } catch (e: any) {
            alert("JSON 解析失败：" + (e?.message ?? "未知错误"));
        }
    }

    async function importFromFile() {
        try {
            const opened = await openTextByPicker({
                "application/json": [".json"],
                "application/x-yaml": [".yml", ".yaml"],
                "text/yaml": [".yml", ".yaml"],
            });
            if (!opened) {
                alert("当前浏览器不支持文件选择器（File System Access API），请用导入/导出面板粘贴导入。");
                return;
            }
            const parsed = parseSchemaText(opened.text, opened.name);
            dispatch({ type: "SET_SCHEMA", schema: parsed });
        } catch (e: any) {
            alert("从文件导入失败：" + (e?.message ?? "未知错误"));
        }
    }

    async function exportToFile() {
        const text = serializeSchema(format);
        const ext = format === "yaml" ? "yaml" : "json";
        const mime = format === "yaml" ? "text/yaml" : "application/json";
        const suggestedName = `form-schema.${ext}`;

        // 优先：系统保存对话框（可选目标文件夹/文件名）
        if (supportsFileSystemAccessAPI()) {
            const ok = await saveTextByPicker(
                suggestedName,
                text,
                mime,
                format === "yaml"
                    ? { "text/yaml": [".yml", ".yaml"] }
                    : { "application/json": [".json"] }
            );
            if (ok) return;
        }
        // fallback：浏览器下载
        downloadText(suggestedName, text, mime);
    }

    async function exportToFolder() {
        const text = serializeSchema(format);
        const ext = format === "yaml" ? "yaml" : "json";
        const mime = format === "yaml" ? "text/yaml" : "application/json";
        const fileName = `form-schema.${ext}`;
        try {
            const ok = await saveTextToDirectory(fileName, text, mime);
            if (!ok) {
                alert("当前浏览器不支持选择文件夹导出（showDirectoryPicker）。可用“导出为文件”或下载。");
            }
        } catch (e: any) {
            alert("导出到文件夹失败：" + (e?.message ?? "未知错误"));
        }
    }

    return (
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-slate-900">Form Designer</div>
                    <span className="text-xs text-slate-500">Schema v{state.schema.schemaVersion}</span>
                    {errors.length ? (
                        <span className="text-xs rounded-full bg-amber-100 px-2 py-1 text-amber-800">
                            {errors.length} 个校验问题
                        </span>
                    ) : (
                        <span className="text-xs rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">Schema OK</span>
                    )}
                </div>
                <div className="px-4 py-4">role: {crole}</div>

                <div className="flex items-center gap-2">
                    {/* 格式切换 */}
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                        <button
                            className={`rounded-md px-2 py-1 text-sm ${format === "json" ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
                            onClick={() => setFormat("json")}
                        >
                            JSON
                        </button>
                        <button
                            className={`rounded-md px-2 py-1 text-sm ${format === "yaml" ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
                            onClick={() => setFormat("yaml")}
                        >
                            YAML
                        </button>
                    </div>
                    {perms.canPreview && (<button
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => dispatch({ type: "SET_MODE", mode: state.mode === "design" ? "preview" : "design" })}
                    >
                        {state.mode === "design" ? "预览" : "返回设计"}
                    </button>)}

                    {perms.canImportExport && (<button
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={openImportPanel}
                    >
                        导入/导出
                    </button>)}
                    {perms.canImportExport && (<>
                        <button
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                            onClick={importFromFile}
                            title="从文件导入（支持 JSON/YAML）"
                        >
                            从文件导入
                        </button>

                        <button
                            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                            onClick={exportToFile}
                            title="导出为文件（弹出保存对话框，可选文件夹）"
                        >
                            导出为文件
                        </button>

                        <button
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                            onClick={exportToFolder}
                            title="选择文件夹导出（Chrome/Edge 支持）"
                        >
                            导出到文件夹
                        </button>
                    </>)}

                </div>
            </div>

            {jsonOpen && (
                <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-800">Schema JSON</div>
                        <div className="flex gap-2">
                            <button className="rounded-lg bg-white px-3 py-2 text-sm border border-slate-200 hover:bg-slate-50" onClick={() => setJsonOpen(false)}>
                                关闭
                            </button>
                            <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800" onClick={importSchema}>
                                从此 JSON 导入
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="mt-2 h-64 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-slate-200"
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                    />
                    {errors.length ? (
                        <div className="mt-2 text-xs text-amber-800">
                            <div className="font-semibold">当前 Schema 问题：</div>
                            <ul className="list-disc pl-5">
                                {errors.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
