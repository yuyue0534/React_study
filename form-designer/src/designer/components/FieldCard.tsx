import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FieldSchema } from "../../schema/types";
import { cn } from "../../utils/classnames";

export function FieldCard({
    field,
    selected,
    onSelect,
    onDelete,
}: {
    field: FieldSchema;
    selected: boolean;
    onSelect: () => void;
    onDelete: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const title =
        field.type === "section"
            ? `分组：${field.title || "未命名"}`
            : field.type === "divider"
                ? "分割线"
                : `${field.label || "未命名字段"}（${field.type}）`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "rounded-xl border bg-white p-3 shadow-sm",
                selected ? "border-slate-900" : "border-slate-200",
                isDragging && "opacity-70"
            )}
            onClick={onSelect}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                        name: <span className="font-mono">{field.name}</span>
                        {field.required ? <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-amber-800">必填</span> : null}
                        {field.disabled ? <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-slate-700">禁用</span> : null}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        删除
                    </button>

                    <button
                        className="cursor-grab rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                        {...attributes}
                        {...listeners}
                        title="拖拽排序"
                    >
                        拖拽
                    </button>
                </div>
            </div>

            {field.helpText ? <div className="mt-2 text-xs text-slate-600">提示：{field.helpText}</div> : null}
        </div>
    );
}
