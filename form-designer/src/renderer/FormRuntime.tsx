import React, { useMemo, useState } from "react";
import type { FieldSchema, FormSchema } from "../schema/types";
import { cn } from "../utils/classnames";
import { usePermissions } from "../auth/RoleContext";


type Values = Record<string, any>;

function collectFields(schema: FormSchema): FieldSchema[] {
    const list: FieldSchema[] = [];
    for (const r of schema.rows) for (const c of r.columns) list.push(...c.children);
    return list;
}

function initialValuesFromSchema(schema: FormSchema): Values {
    const v: Values = {};
    for (const f of collectFields(schema)) {
        if (f.type === "checkbox") v[f.name] = (f as any).defaultValue ?? false;
        else if (f.type === "number") v[f.name] = (f as any).defaultValue ?? 0;
        else v[f.name] = (f as any).defaultValue ?? "";
    }
    return v;
}

function RuntimeField({
    field,
    value,
    setValue,
}: {
    field: FieldSchema;
    value: any;
    setValue: (v: any) => void;
}) {
    const commonLabel = field.label ?? "";
    const requiredMark = field.required ? <span className="text-red-500 ml-1">*</span> : null;

    if (field.type === "divider") return <div className="my-3 border-t border-slate-200" />;

    if (field.type === "section") {
        return (
            <div className="my-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-base font-semibold">{(field as any).title || "分组"}</div>
                {(field as any).description ? <div className="text-sm text-slate-500 mt-1">{(field as any).description}</div> : null}
            </div>
        );
    }

    return (
        <div className={cn("rounded-xl border border-slate-200 bg-white p-4", field.disabled && "opacity-60")}>
            <label className="block text-sm font-medium text-slate-800">
                {commonLabel}
                {requiredMark}
            </label>

            {field.helpText ? <div className="text-xs text-slate-500 mt-1">{field.helpText}</div> : null}

            <div className="mt-2">
                {field.type === "input" && (
                    <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder={(field as any).placeholder}
                        disabled={field.disabled}
                        value={value ?? ""}
                        onChange={(e) => setValue(e.target.value)}
                    />
                )}

                {field.type === "textarea" && (
                    <textarea
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder={(field as any).placeholder}
                        rows={(field as any).rows ?? 4}
                        disabled={field.disabled}
                        value={value ?? ""}
                        onChange={(e) => setValue(e.target.value)}
                    />
                )}

                {field.type === "number" && (
                    <input
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder={(field as any).placeholder}
                        disabled={field.disabled}
                        value={value ?? 0}
                        min={(field as any).min}
                        max={(field as any).max}
                        step={(field as any).step}
                        onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                )}

                {field.type === "date" && (
                    <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        disabled={field.disabled}
                        value={value ?? ""}
                        onChange={(e) => setValue(e.target.value)}
                    />
                )}

                {field.type === "select" && (
                    <select
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        disabled={field.disabled}
                        value={value ?? ""}
                        onChange={(e) => setValue(e.target.value)}
                    >
                        <option value="">{(field as any).placeholder || "请选择"}</option>
                        {(field as any).options.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}

                {field.type === "checkbox" && (
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={!!value}
                            disabled={field.disabled}
                            onChange={(e) => setValue(e.target.checked)}
                        />
                        {field.label || "勾选"}
                    </label>
                )}

                {field.type === "radio" && (
                    <div className="space-y-2">
                        {(field as any).options.map((opt: any) => (
                            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    disabled={field.disabled}
                                    onChange={() => setValue(opt.value)}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function FormRuntime({ schema }: { schema: FormSchema }) {
    const perms = usePermissions();

    const [values, setValues] = useState<Values>(() => initialValuesFromSchema(schema));
    const [open, setOpen] = useState(false);

    // schema 变化时重置初值（保证切换预览反映最新 schema）
    React.useEffect(() => {
        setValues(initialValuesFromSchema(schema));
    }, [schema]);

    const errors = useMemo(() => {
        // 运行态简单必填校验（后续可升级为 rules 引擎）
        const list: string[] = [];
        for (const f of collectFields(schema)) {
            if (!f.required) continue;
            const v = values[f.name];
            const empty = f.type === "checkbox" ? v !== true : v === "" || v == null;
            if (empty) list.push(`${f.label || f.name} 为必填`);
        }
        return list;
    }, [schema, values]);

    return (
        <div className="w-full">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <div className="text-xl font-semibold text-slate-900">{schema.title}</div>
                    {schema.description ? <div className="text-sm text-slate-600 mt-1">{schema.description}</div> : null}
                    {errors.length ? (
                        <div className="mt-2 text-xs text-amber-800">
                            <span className="font-semibold">必填提示：</span>{errors.join("；")}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => setValues(initialValuesFromSchema(schema))}
                    >
                        重置
                    </button>
                    {perms.canExportValues && (<button
                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? "隐藏 values" : "导出 values"}
                    </button>)}
                </div>
            </div>

            <div className="space-y-4">
                {schema.rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-3">
                        {row.columns.map((col) => (
                            <div key={col.id} className={`col-span-${col.span}`}>
                                <div className="space-y-3">
                                    {col.children.map((f) => (
                                        <RuntimeField
                                            key={f.id}
                                            field={f}
                                            value={values[f.name]}
                                            setValue={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {open ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm font-semibold text-slate-900">values JSON</div>
                    <textarea
                        className="mt-2 h-56 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-slate-200"
                        readOnly
                        value={JSON.stringify(values, null, 2)}
                    />
                </div>
            ) : null}
        </div>
    );
}
