import { createDefaultField, createDefaultRow } from "../../schema/defaults";
import type { FieldType } from "../../schema/types";
import { useDesigner } from "../../state/designerContext";
import { usePermissions } from "../../auth/RoleContext";


const fieldGroups: Array<{ title: string; items: Array<{ type: FieldType; label: string }> }> = [
    {
        title: "基础输入",
        items: [
            { type: "input", label: "单行输入" },
            { type: "textarea", label: "多行输入" },
            { type: "number", label: "数字" },
            { type: "date", label: "日期" },
        ],
    },
    {
        title: "选择类",
        items: [
            { type: "select", label: "下拉选择" },
            { type: "radio", label: "单选" },
            { type: "checkbox", label: "复选" },
        ],
    },
    {
        title: "结构",
        items: [
            { type: "section", label: "分组" },
            { type: "divider", label: "分割线" },
        ],
    },
];

export function ComponentPalette() {
    const { state, dispatch } = useDesigner();
    const perms = usePermissions();

    // 添加字段默认投放位置：优先当前选中的 col，否则第一行第一列，否则自动创建一行
    function addField(type: FieldType) {
        const f = createDefaultField(type);

        if (state.schema.rows.length === 0) {
            const row = createDefaultRow();
            row.columns[0].children.push(f);
            dispatch({ type: "ADD_ROW", row });
            // ADD_ROW 已选中 row，这里再选中 field
            dispatch({
                type: "SELECT",
                selected: { kind: "field", rowId: row.id, colId: row.columns[0].id, fieldId: f.id },
            });
            return;
        }

        if (state.selected.kind === "col") {
            dispatch({ type: "ADD_FIELD", rowId: state.selected.rowId, colId: state.selected.colId, field: f });
            return;
        }
        if (state.selected.kind === "field") {
            dispatch({ type: "ADD_FIELD", rowId: state.selected.rowId, colId: state.selected.colId, field: f });
            return;
        }

        // fallback -> 第一行第一列
        const rowId = state.schema.rows[0].id;
        const colId = state.schema.rows[0].columns[0].id;
        dispatch({ type: "ADD_FIELD", rowId, colId, field: f });
    }

    return (
        <div className="h-full min-h-0 overflow-y-auto border-r border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold text-slate-900 mb-3">组件库</div>

            <div className="space-y-4">
                <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">布局</div>
                    <button
                        disabled={!perms.canLayout}
                        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50 active:scale-[0.99] ${!perms.canLayout ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => perms.canLayout && dispatch({ type: "ADD_ROW", row: createDefaultRow() })}
                    >
                        + 行容器（Row）
                    </button>
                    <div className="mt-2 text-xs text-slate-500">提示：行内包含多列（Col），字段可拖入任意列</div>
                </div>

                {fieldGroups.map((g) => (
                    <div key={`group:${g.title}`}>
                        <div className="text-xs font-semibold text-slate-500 mb-2">{g.title}</div>
                        <div className="grid grid-cols-1 gap-2">
                            {g.items.map((it) => (
                                <button key={`${g.title}:${it.type}`}
                                    disabled={!perms.canAddField}
                                    className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50 active:scale-[0.99] ${!perms.canAddField ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => perms.canAddField && addField(it.type)}
                                >
                                    + {it.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-xs text-slate-500">
                支持：行排序 / 列内排序 / 跨列移动 / 预览可填写并导出 values
            </div>
        </div>
    );
}
