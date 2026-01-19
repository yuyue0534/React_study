import { useMemo, useState } from "react";
import { useDesigner } from "../../state/designerContext";
import { validateSchema } from "../../schema/validators";

export function TopBar() {
    const { state, dispatch } = useDesigner();
    const [jsonOpen, setJsonOpen] = useState(false);
    const [jsonText, setJsonText] = useState("");

    const errors = useMemo(() => validateSchema(state.schema), [state.schema]);

    function exportSchema() {
        const text = JSON.stringify(state.schema, null, 2);
        setJsonText(text);
        setJsonOpen(true);
    }

    function importSchema() {
        try {
            const parsed = JSON.parse(jsonText);
            dispatch({ type: "SET_SCHEMA", schema: parsed });
            setJsonOpen(false);
        } catch (e: any) {
            alert("JSON 解析失败：" + (e?.message ?? "未知错误"));
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

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => dispatch({ type: "SET_MODE", mode: state.mode === "design" ? "preview" : "design" })}
                    >
                        {state.mode === "design" ? "预览" : "返回设计"}
                    </button>

                    <button
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={exportSchema}
                    >
                        导入/导出
                    </button>
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
