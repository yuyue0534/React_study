import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDesigner } from "../../state/designerContext";
import { FieldCard } from "./FieldCard";

export function Canvas() {
    const { state, dispatch } = useDesigner();
    const fields = state.schema.fields;

    return (
        <div className="h-full min-h-0 overflow-y-auto bg-slate-50 p-4 pb-6">
            <div className="mb-3">
                <div className="text-sm font-semibold text-slate-900">画布</div>
                <div className="text-xs text-slate-500 mt-1">当前字段数：{fields.length}</div>
            </div>

            {fields.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                    从左侧「组件库」添加字段开始
                </div>
            ) : (
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => {
                        const activeId = String(e.active.id);
                        const overId = e.over?.id ? String(e.over.id) : null;
                        if (overId && overId !== activeId) dispatch({ type: "MOVE_FIELD", activeId, overId });
                    }}
                >
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {fields.map((f) => (
                                <FieldCard
                                    key={f.id}
                                    field={f}
                                    selected={state.selectedFieldId === f.id}
                                    onSelect={() => dispatch({ type: "SELECT_FIELD", fieldId: f.id })}
                                    onDelete={() => dispatch({ type: "DELETE_FIELD", fieldId: f.id })}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
