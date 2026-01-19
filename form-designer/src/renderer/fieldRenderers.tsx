import type { FieldSchema } from "../schema/types";
import { cn } from "../utils/classnames";

export function FieldView({ field }: { field: FieldSchema }) {
    const commonLabel = field.label ?? "";
    const requiredMark = field.required ? <span className="text-red-500 ml-1">*</span> : null;

    if (field.type === "divider") {
        return <div className="my-3 border-t border-slate-200" />;
    }

    if (field.type === "section") {
        return (
            <div className="my-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-base font-semibold">{field.title || "分组"}</div>
                {field.description ? <div className="text-sm text-slate-500 mt-1">{field.description}</div> : null}
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
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        defaultValue={field.defaultValue}
                    />
                )}

                {field.type === "textarea" && (
                    <textarea
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder={field.placeholder}
                        rows={field.rows ?? 4}
                        disabled={field.disabled}
                        defaultValue={field.defaultValue}
                    />
                )}

                {field.type === "number" && (
                    <input
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        defaultValue={field.defaultValue}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                )}

                {field.type === "date" && (
                    <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        disabled={field.disabled}
                        defaultValue={field.defaultValue}
                    />
                )}

                {field.type === "select" && (
                    <select
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                        disabled={field.disabled}
                        defaultValue={field.defaultValue}
                    >
                        <option value="">{field.placeholder || "请选择"}</option>
                        {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}

                {field.type === "checkbox" && (
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" defaultChecked={field.defaultValue} disabled={field.disabled} />
                        {field.label || "勾选"}
                    </label>
                )}

                {field.type === "radio" && (
                    <div className="space-y-2">
                        {field.options.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value}
                                    defaultChecked={field.defaultValue === opt.value}
                                    disabled={field.disabled}
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
