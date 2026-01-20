import { createDefaultField } from "../../schema/defaults";
import type { FieldType } from "../../schema/types";
import { useDesigner } from "../../state/designerContext";

const groups: Array<{ title: string; items: Array<{ type: FieldType; label: string }> }> = [
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
    const { dispatch } = useDesigner();

    return (
        <div className="h-full min-h-0 overflow-y-auto border-r border-slate-200 bg-white p-3 pb-6">
            <div className="text-sm font-semibold text-slate-900 mb-3">组件库</div>

            <div className="space-y-4">
                {groups.map((g) => (
                    <div key={g.title}>
                        <div className="text-xs font-semibold text-slate-500 mb-2">{g.title}</div>
                        <div className="grid grid-cols-1 gap-2">
                            {g.items.map((it) => (
                                <button
                                    key={it.type}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50 active:scale-[0.99]"
                                    onClick={() => dispatch({ type: "ADD_FIELD", field: createDefaultField(it.type) })}
                                >
                                    + {it.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-xs text-slate-500">
                提示：点击组件即可添加；画布中支持拖拽排序；右侧面板编辑属性。
            </div>
        </div>
    );
}
