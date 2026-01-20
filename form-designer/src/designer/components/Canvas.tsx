import { useMemo, useRef } from "react";
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
    closestCenter,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDesigner } from "../../state/designerContext";
import { RowCard } from "./RowCard";
import { FieldCard } from "./FieldCard";
import { cn } from "../../utils/classnames";
import { usePermissions } from "../../auth/RoleContext";

// 解析 id：row:<rowId> 或 field:<rowId>:<colId>:<fieldId>
function parseId(id: string) {
    if (id.startsWith("row:")) return { kind: "row" as const, rowId: id.slice(4) };
    if (id.startsWith("col:")) {
        const [, rowId, colId] = id.split(":");
        return { kind: "col" as const, rowId, colId };
    }
    if (id.startsWith("field:")) {
        const [, rowId, colId, fieldId] = id.split(":");
        return { kind: "field" as const, rowId, colId, fieldId };
    }
    return { kind: "unknown" as const };
}

export function Canvas() {
    const { state, dispatch } = useDesigner();
    const perms = usePermissions();
    const rows = state.schema.rows;

    // 记录拖拽开始时 field 的来源 index（避免每次 find）
    const activeFieldRef = useRef<{
        rowId: string;
        colId: string;
        index: number;
    } | null>(null);

    const rowItems = useMemo(() => rows.map((r) => `row:${r.id}`), [rows]);

    function getColChildren(rowId: string, colId: string) {
        const row = rows.find((r) => r.id === rowId);
        const col = row?.columns.find((c) => c.id === colId);
        return col?.children ?? [];
    }

    function handleDragStart(e: DragStartEvent) {
        const a = parseId(String(e.active.id));
        if (a.kind === "field") {
            const children = getColChildren(a.rowId, a.colId);
            const index = children.findIndex((x) => x.id === a.fieldId);
            activeFieldRef.current = { rowId: a.rowId, colId: a.colId, index };
        } else {
            activeFieldRef.current = null;
        }
    }

    function handleDragOver(e: DragOverEvent) {
        const active = parseId(String(e.active.id));
        const overRaw = e.over?.id ? String(e.over.id) : null;
        if (!overRaw) return;

        const over = parseId(overRaw);

        // 处理 field 跨列“悬停即移动”（体验更像 Notion）
        if (active.kind === "field") {
            const from = activeFieldRef.current;
            if (!from) return;

            // over 可能是 field 或 col 容器
            if (over.kind === "field") {
                // 目标位置在另一个 field 上
                const toChildren = getColChildren(over.rowId, over.colId);
                const overIndex = toChildren.findIndex((x) => x.id === over.fieldId);
                if (overIndex < 0) return;

                // 若发生跨列/跨行或在同列不同位置 -> MOVE_FIELD
                if (from.rowId !== over.rowId || from.colId !== over.colId || from.index !== overIndex) {
                    dispatch({
                        type: "MOVE_FIELD",
                        from: { rowId: from.rowId, colId: from.colId, index: from.index },
                        to: { rowId: over.rowId, colId: over.colId, index: overIndex },
                    });

                    // 更新 ref（因为 schema 已变）
                    activeFieldRef.current = { rowId: over.rowId, colId: over.colId, index: overIndex };
                }
            }

            if (over.kind === "col") {
                // 悬停在空列/列容器上 -> 插入到末尾
                const toChildren = getColChildren(over.rowId, over.colId);
                const targetIndex = toChildren.length;

                if (from.rowId !== over.rowId || from.colId !== over.colId || from.index !== targetIndex) {
                    dispatch({
                        type: "MOVE_FIELD",
                        from: { rowId: from.rowId, colId: from.colId, index: from.index },
                        to: { rowId: over.rowId, colId: over.colId, index: targetIndex },
                    });
                    activeFieldRef.current = { rowId: over.rowId, colId: over.colId, index: targetIndex };
                }
            }
        }
    }

    function handleDragEnd(e: DragEndEvent) {
        const active = parseId(String(e.active.id));
        const overRaw = e.over?.id ? String(e.over.id) : null;

        // 行排序：row -> row
        if (active.kind === "row" && overRaw) {
            const over = parseId(overRaw);
            if (over.kind === "row" && over.rowId !== active.rowId) {
                dispatch({ type: "MOVE_ROW", activeRowId: active.rowId, overRowId: over.rowId });
            }
        }

        activeFieldRef.current = null;
    }

    return (
        <div className="h-full bg-slate-50 p-4 overflow-auto">
            <div className="mb-3">
                <div className="text-sm font-semibold text-slate-900">画布（Row/Col 布局）</div>
                <div className="text-xs text-slate-500 mt-1">行数：{rows.length}</div>
            </div>

            {rows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                    从左侧添加「行容器（Row）」开始
                </div>
            ) : (
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={perms.canReorder ? handleDragStart : undefined}
                    onDragOver={perms.canReorder ? handleDragOver : undefined}
                    onDragEnd={perms.canReorder ? handleDragEnd : undefined}
                >
                    {/* 行排序 */}
                    <SortableContext items={rowItems} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {rows.map((row) => {
                                const rowSelected = state.selected.kind === "row" && state.selected.rowId === row.id;

                                return (
                                    <RowCard
                                        key={row.id}
                                        rowId={row.id}
                                        selected={rowSelected}
                                        onSelect={() => dispatch({ type: "SELECT", selected: { kind: "row", rowId: row.id } })}
                                        onDelete={() => perms.canDelete && perms.canLayout && dispatch({ type: "DELETE_ROW", rowId: row.id })}
                                        disableActions={!perms.canLayout || !perms.canDelete}
                                        disableDrag={!perms.canReorder || !perms.canLayout}
                                    >
                                        {/* Row 内 columns（12 栅格） */}
                                        <div className="grid grid-cols-12 gap-3">
                                            {row.columns.map((col) => {
                                                const colSelected =
                                                    state.selected.kind === "col" &&
                                                    state.selected.rowId === row.id &&
                                                    state.selected.colId === col.id;

                                                const fieldItems = col.children.map((f) => `field:${row.id}:${col.id}:${f.id}`);

                                                return (
                                                    <div
                                                        key={col.id}
                                                        className={cn(
                                                            `col-span-${col.span}`,
                                                            "rounded-2xl border p-3 bg-slate-50",
                                                            colSelected ? "border-slate-900" : "border-slate-200"
                                                        )}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch({ type: "SELECT", selected: { kind: "col", rowId: row.id, colId: col.id } });
                                                        }}
                                                        // 列容器作为 droppable 目标（空列也能接收）
                                                        data-col-droppable
                                                        id={`col:${row.id}:${col.id}` as any}
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <div className="text-xs font-semibold text-slate-600">
                                                                Col <span className="font-mono">span={col.span}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-500">{col.children.length} fields</div>
                                                        </div>

                                                        {/* 列内字段排序 */}
                                                        <SortableContext items={fieldItems} strategy={verticalListSortingStrategy}>
                                                            <div className="space-y-3 min-h-[24px]">
                                                                {col.children.map((f) => {
                                                                    const fieldSelected =
                                                                        state.selected.kind === "field" &&
                                                                        state.selected.rowId === row.id &&
                                                                        state.selected.colId === col.id &&
                                                                        state.selected.fieldId === f.id;

                                                                    return (
                                                                        <FieldCard
                                                                            key={f.id}
                                                                            rowId={row.id}
                                                                            colId={col.id}
                                                                            field={f}
                                                                            selected={fieldSelected}
                                                                            onSelect={() =>
                                                                                dispatch({
                                                                                    type: "SELECT",
                                                                                    selected: { kind: "field", rowId: row.id, colId: col.id, fieldId: f.id },
                                                                                })
                                                                            }
                                                                            onDelete={() => dispatch({ type: "DELETE_FIELD", rowId: row.id, colId: col.id, fieldId: f.id })}
                                                                        />
                                                                    );
                                                                })}

                                                                {/* 空列提示 */}
                                                                {col.children.length === 0 ? (
                                                                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center text-xs text-slate-500">
                                                                        把字段拖到这里
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </SortableContext>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </RowCard>
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
