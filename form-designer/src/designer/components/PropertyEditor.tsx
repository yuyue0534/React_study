import { useMemo } from "react";
import { useDesigner } from "../../state/designerContext";
import type { OptionItem } from "../../schema/types";
import { cn } from "../../utils/classnames";
import { uid } from "../../utils/id";
import { usePermissions } from "../../auth/RoleContext";

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
    const perms = usePermissions();
    const schema = state.schema;

    // 当前选中节点定位
    const selectedRow = useMemo(() => {
        if (state.selected.kind === "row" || state.selected.kind === "col" || state.selected.kind === "field") {
            return schema.rows.find((r) => r.id === state.selected.rowId) ?? null;
        }
        return null;
    }, [state.selected, schema.rows]);

    const selectedCol = useMemo(() => {
        if ((state.selected.kind === "col" || state.selected.kind === "field") && selectedRow) {
            return selectedRow.columns.find((c) => c.id === state.selected.colId) ?? null;
        }
        return null;
    }, [state.selected, selectedRow]);

    const selectedField = useMemo(() => {
        if (state.selected.kind === "field" && selectedCol) {
            return selectedCol.children.find((f) => f.id === state.selected.fieldId) ?? null;
        }
        return null;
    }, [state.selected, selectedCol]);

    return (
        <div className="h-full border-l border-slate-200 bg-white p-3 overflow-auto">
            <div className="text-sm font-semibold text-slate-900 mb-3">属性面板</div>

            {/* 表单级属性 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600 mb-2">表单</div>
                <div className="space-y-2">
                    <Input
                        label="标题"
                        value={schema.title}
                        onChange={(v) => perms.canEditProps && dispatch({ type: "UPDATE_FORM", patch: { title: v } })}
                    />
                    <Textarea
                        label="描述"
                        value={schema.description || ""}
                        onChange={(v) => perms.canEditProps && dispatch({ type: "UPDATE_FORM", patch: { description: v } })}
                    />
                </div>
            </div>

            <div className="my-3 border-t border-slate-200" />

            {/* Row 面板 */}
            {state.selected.kind === "row" && selectedRow ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">Row</div>
                        <button
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                            onClick={() => dispatch({ type: "ADD_COL", rowId: selectedRow.id, col: { id: uid(), type: "col", span: 6, children: [] } })}
                        >
                            + 添加列
                        </button>
                    </div>
                    <div className="text-xs text-slate-500">rowId: <span className="font-mono">{selectedRow.id}</span></div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-semibold text-slate-600 mb-2">列列表（可在列面板改 span）</div>
                        <div className="space-y-2">
                            {selectedRow.columns.map((c) => (
                                <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                                    <div className="text-xs text-slate-700">
                                        colId: <span className="font-mono">{c.id.slice(0, 8)}</span> · span={c.span} · fields={c.children.length}
                                    </div>
                                    <button
                                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                                        onClick={() => dispatch({ type: "DELETE_COL", rowId: selectedRow.id, colId: c.id })}
                                        disabled={selectedRow.columns.length <= 1}
                                        title={selectedRow.columns.length <= 1 ? "至少保留 1 列" : "删除列"}
                                    >
                                        删除
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-[11px] text-slate-500">提示：同一行列宽总和建议 ≤ 12（校验会提示）</div>
                    </div>

                    <button
                        className={cn(
                            "w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700",
                            "hover:bg-red-100"
                        )}
                        onClick={() => dispatch({ type: "DELETE_ROW", rowId: selectedRow.id })}
                    >
                        删除该行
                    </button>
                </div>
            ) : null}

            {/* Col 面板 */}
            {state.selected.kind === "col" && selectedRow && selectedCol ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3">
                    <div className="text-sm font-semibold text-slate-900">Col</div>
                    <div className="text-xs text-slate-500">
                        rowId: <span className="font-mono">{selectedRow.id.slice(0, 8)}</span> · colId:{" "}
                        <span className="font-mono">{selectedCol.id.slice(0, 8)}</span>
                    </div>

                    <label className="block">
                        <div className="text-xs font-semibold text-slate-600 mb-1">span（1-12）</div>
                        <input
                            type="number"
                            min={1}
                            max={12}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={selectedCol.span}
                            disabled={!perms.canLayout}
                            onChange={(e) => perms.canLayout && dispatch({ type: "UPDATE_COL", rowId: selectedRow.id, colId: selectedCol.id, patch: { span: Number(e.target.value || 12) } })}
                        />
                    </label>

                    <div className="text-xs text-slate-500">该列字段数：{selectedCol.children.length}</div>

                    {perms.canLayout && perms.canDelete && (<button
                        className={cn(
                            "w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700",
                            "hover:bg-red-100"
                        )}
                        onClick={() => dispatch({ type: "DELETE_COL", rowId: selectedRow.id, colId: selectedCol.id })}
                        disabled={selectedRow.columns.length <= 1}
                        title={selectedRow.columns.length <= 1 ? "至少保留 1 列" : "删除列"}
                    >
                        删除该列
                    </button>)}
                </div>
            ) : null}

            {/* Field 面板（沿用你原逻辑） */}
            {state.selected.kind === "field" && selectedRow && selectedCol && selectedField ? (
                <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold text-slate-600 mb-2">字段</div>
                        <div className="space-y-2">
                            <div className="text-xs text-slate-500">
                                id: <span className="font-mono">{selectedField.id}</span> / type:{" "}
                                <span className="font-mono">{selectedField.type}</span>
                            </div>

                            <Input
                                label="name（提交 key）"
                                value={selectedField.name}
                                onChange={(v) =>
                                    dispatch({
                                        type: "UPDATE_FIELD",
                                        rowId: selectedRow.id,
                                        colId: selectedCol.id,
                                        fieldId: selectedField.id,
                                        patch: { name: v },
                                    })
                                }
                            />

                            {selectedField.type !== "divider" && selectedField.type !== "section" ? (
                                <Input
                                    label="label"
                                    value={selectedField.label ?? ""}
                                    onChange={(v) =>
                                        dispatch({
                                            type: "UPDATE_FIELD",
                                            rowId: selectedRow.id,
                                            colId: selectedCol.id,
                                            fieldId: selectedField.id,
                                            patch: { label: v },
                                        })
                                    }
                                />
                            ) : null}

                            {selectedField.type === "section" ? (
                                <>
                                    <Input
                                        label="分组标题"
                                        value={(selectedField as any).title ?? ""}
                                        onChange={(v) =>
                                            dispatch({
                                                type: "UPDATE_FIELD",
                                                rowId: selectedRow.id,
                                                colId: selectedCol.id,
                                                fieldId: selectedField.id,
                                                patch: { title: v } as any,
                                            })
                                        }
                                    />
                                    <Textarea
                                        label="分组描述"
                                        value={(selectedField as any).description ?? ""}
                                        onChange={(v) =>
                                            dispatch({
                                                type: "UPDATE_FIELD",
                                                rowId: selectedRow.id,
                                                colId: selectedCol.id,
                                                fieldId: selectedField.id,
                                                patch: { description: v } as any,
                                            })
                                        }
                                    />
                                </>
                            ) : null}

                            <Textarea
                                label="helpText"
                                value={selectedField.helpText ?? ""}
                                onChange={(v) =>
                                    dispatch({
                                        type: "UPDATE_FIELD",
                                        rowId: selectedRow.id,
                                        colId: selectedCol.id,
                                        fieldId: selectedField.id,
                                        patch: { helpText: v },
                                    })
                                }
                            />

                            {"placeholder" in selectedField ? (
                                <Input
                                    label="placeholder"
                                    value={(selectedField as any).placeholder ?? ""}
                                    onChange={(v) =>
                                        dispatch({
                                            type: "UPDATE_FIELD",
                                            rowId: selectedRow.id,
                                            colId: selectedCol.id,
                                            fieldId: selectedField.id,
                                            patch: { placeholder: v } as any,
                                        })
                                    }
                                />
                            ) : null}

                            {"rows" in selectedField ? (
                                <label className="block">
                                    <div className="text-xs font-semibold text-slate-600 mb-1">rows</div>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                        value={(selectedField as any).rows ?? 4}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "UPDATE_FIELD",
                                                rowId: selectedRow.id,
                                                colId: selectedCol.id,
                                                fieldId: selectedField.id,
                                                patch: { rows: Number(e.target.value || 4) } as any,
                                            })
                                        }
                                    />
                                </label>
                            ) : null}

                            {selectedField.type === "number" ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {(["min", "max", "step"] as const).map((k) => (
                                        <label key={k} className="block">
                                            <div className="text-xs font-semibold text-slate-600 mb-1">{k}</div>
                                            <input
                                                type="number"
                                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                                value={(selectedField as any)[k] ?? ""}
                                                onChange={(e) => {
                                                    const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                    dispatch({
                                                        type: "UPDATE_FIELD",
                                                        rowId: selectedRow.id,
                                                        colId: selectedCol.id,
                                                        fieldId: selectedField.id,
                                                        patch: { [k]: v } as any,
                                                    });
                                                }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            <div className="grid grid-cols-1 gap-2">
                                <Switch
                                    label="required"
                                    checked={!!selectedField.required}
                                    onChange={(v) =>
                                        dispatch({
                                            type: "UPDATE_FIELD",
                                            rowId: selectedRow.id,
                                            colId: selectedCol.id,
                                            fieldId: selectedField.id,
                                            patch: { required: v },
                                        })
                                    }
                                />
                                <Switch
                                    label="disabled"
                                    checked={!!selectedField.disabled}
                                    onChange={(v) =>
                                        dispatch({
                                            type: "UPDATE_FIELD",
                                            rowId: selectedRow.id,
                                            colId: selectedCol.id,
                                            fieldId: selectedField.id,
                                            patch: { disabled: v },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {(selectedField.type === "select" || selectedField.type === "radio") && (
                        <OptionsEditor
                            options={(selectedField as any).options ?? []}
                            onChange={(opts) =>
                                dispatch({
                                    type: "UPDATE_FIELD",
                                    rowId: selectedRow.id,
                                    colId: selectedCol.id,
                                    fieldId: selectedField.id,
                                    patch: { options: opts } as any,
                                })
                            }
                        />
                    )}

                    <button
                        className={cn(
                            "w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700",
                            "hover:bg-red-100"
                        )}
                        onClick={() =>
                            dispatch({ type: "DELETE_FIELD", rowId: selectedRow.id, colId: selectedCol.id, fieldId: selectedField.id })
                        }
                    >
                        删除该字段
                    </button>
                </div>
            ) : null}

            {/* 空态 */}
            {state.selected.kind === "form" ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                    选择 Row / Col / 字段以编辑属性
                </div>
            ) : null}
        </div>
    );
}
