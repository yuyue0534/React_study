import { useMemo } from "react";
import { useDesigner } from "../../state/designerContext";
import type { OptionItem } from "../../schema/types";
import { cn } from "../../utils/classnames";

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
            <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
            <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
            />
        </label>
    );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-sm text-slate-800">{label}</div>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        </label>
    );
}

function OptionsEditor({
    options,
    onChange,
}: {
    options: OptionItem[];
    onChange: (opts: OptionItem[]) => void;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-800">选项</div>
                <button
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                    onClick={() => onChange([...options, { label: `选项 ${options.length + 1}`, value: `opt${options.length + 1}` }])}
                >
                    + 添加
                </button>
            </div>

            <div className="mt-3 space-y-2">
                {options.map((opt, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                        <input
                            className="col-span-5 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={opt.label}
                            onChange={(e) => {
                                const next = options.slice();
                                next[idx] = { ...next[idx], label: e.target.value };
                                onChange(next);
                            }}
                            placeholder="label"
                        />
                        <input
                            className="col-span-5 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={opt.value}
                            onChange={(e) => {
                                const next = options.slice();
                                next[idx] = { ...next[idx], value: e.target.value };
                                onChange(next);
                            }}
                            placeholder="value"
                        />
                        <button
                            className="col-span-2 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                            onClick={() => onChange(options.filter((_, i) => i !== idx))}
                        >
                            删除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PropertyEditor() {
    const { state, dispatch } = useDesigner();
    const selected = useMemo(
        () => state.schema.fields.find((f) => f.id === state.selectedFieldId) ?? null,
        [state.schema.fields, state.selectedFieldId]
    );

    return (
        <div className="h-full border-l border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold text-slate-900 mb-3">属性面板</div>

            {/* 表单级属性（即使未选中字段也可编辑） */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600 mb-2">表单</div>
                <div className="space-y-2">
                    <Input
                        label="标题"
                        value={state.schema.title}
                        onChange={(v) => dispatch({ type: "UPDATE_FORM", patch: { title: v } })}
                    />
                    <Textarea
                        label="描述"
                        value={state.schema.description || ""}
                        onChange={(v) => dispatch({ type: "UPDATE_FORM", patch: { description: v } })}
                    />
                </div>
            </div>

            <div className="my-3 border-t border-slate-200" />

            {!selected ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                    选择画布中的字段以编辑属性
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold text-slate-600 mb-2">字段</div>
                        <div className="space-y-2">
                            <div className="text-xs text-slate-500">
                                id: <span className="font-mono">{selected.id}</span> / type:{" "}
                                <span className="font-mono">{selected.type}</span>
                            </div>

                            <Input
                                label="name（提交 key）"
                                value={selected.name}
                                onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { name: v } })}
                            />

                            {/* divider/section 的 label 逻辑不同 */}
                            {selected.type !== "divider" && selected.type !== "section" ? (
                                <Input
                                    label="label"
                                    value={selected.label ?? ""}
                                    onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { label: v } })}
                                />
                            ) : null}

                            {selected.type === "section" ? (
                                <>
                                    <Input
                                        label="分组标题"
                                        value={(selected as any).title ?? ""}
                                        onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { title: v } as any })}
                                    />
                                    <Textarea
                                        label="分组描述"
                                        value={(selected as any).description ?? ""}
                                        onChange={(v) =>
                                            dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { description: v } as any })
                                        }
                                    />
                                </>
                            ) : null}

                            <Textarea
                                label="helpText"
                                value={selected.helpText ?? ""}
                                onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { helpText: v } })}
                            />

                            <label className="block">
                                <div className="text-xs font-semibold text-slate-600 mb-1">colSpan（1-12）</div>
                                <input
                                    type="number"
                                    min={1}
                                    max={12}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={selected.colSpan ?? 12}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "UPDATE_FIELD",
                                            fieldId: selected.id,
                                            patch: { colSpan: Number(e.target.value || 12) } as any,
                                        })
                                    }
                                />
                            </label>

                            {/* placeholder */}
                            {"placeholder" in selected ? (
                                <Input
                                    label="placeholder"
                                    value={(selected as any).placeholder ?? ""}
                                    onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { placeholder: v } as any })}
                                />
                            ) : null}

                            {/* rows */}
                            {"rows" in selected ? (
                                <label className="block">
                                    <div className="text-xs font-semibold text-slate-600 mb-1">rows</div>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                        value={(selected as any).rows ?? 4}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "UPDATE_FIELD",
                                                fieldId: selected.id,
                                                patch: { rows: Number(e.target.value || 4) } as any,
                                            })
                                        }
                                    />
                                </label>
                            ) : null}

                            {/* number */}
                            {selected.type === "number" ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {(["min", "max", "step"] as const).map((k) => (
                                        <label key={k} className="block">
                                            <div className="text-xs font-semibold text-slate-600 mb-1">{k}</div>
                                            <input
                                                type="number"
                                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                                value={(selected as any)[k] ?? ""}
                                                onChange={(e) => {
                                                    const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                    dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { [k]: v } as any });
                                                }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            <div className="grid grid-cols-1 gap-2">
                                <Switch
                                    label="required"
                                    checked={!!selected.required}
                                    onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { required: v } })}
                                />
                                <Switch
                                    label="disabled"
                                    checked={!!selected.disabled}
                                    onChange={(v) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { disabled: v } })}
                                />
                            </div>
                        </div>
                    </div>

                    {(selected.type === "select" || selected.type === "radio") && (
                        <OptionsEditor
                            options={(selected as any).options ?? []}
                            onChange={(opts) => dispatch({ type: "UPDATE_FIELD", fieldId: selected.id, patch: { options: opts } as any })}
                        />
                    )}

                    <button
                        className={cn(
                            "w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700",
                            "hover:bg-red-100"
                        )}
                        onClick={() => dispatch({ type: "DELETE_FIELD", fieldId: selected.id })}
                    >
                        删除该字段
                    </button>
                </div>
            )}
        </div>
    );
}
