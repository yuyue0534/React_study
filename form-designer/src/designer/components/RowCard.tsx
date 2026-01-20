import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../utils/classnames";

export function RowCard({
    rowId,
    selected,
    onSelect,
    onDelete,
    disableActions,
    disableDrag,
    children,
}: {
    rowId: string;
    selected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    disableActions?: boolean;
    disableDrag?: boolean;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `row:${rowId}`,
        disabled: !!disableDrag,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "rounded-2xl border bg-white p-3 shadow-sm",
                selected ? "border-slate-900" : "border-slate-200",
                isDragging && "opacity-70"
            )}
            onClick={onSelect}
        >
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Row</div>
                <div className="flex items-center gap-2">
                    {!disableActions && (<button
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        删除行
                    </button>)}
                    {!disableDrag && (<button
                        className="cursor-grab rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                        {...attributes}
                        {...listeners}
                        title="拖拽排序行"
                    >
                        拖拽行
                    </button>)}
                </div>
            </div>

            {children}
        </div>
    );
}
