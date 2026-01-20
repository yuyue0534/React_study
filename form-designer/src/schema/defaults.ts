import type { ColSchema, FieldSchema, FieldType, FormSchema, RowSchema } from "./types";
import { uid } from "../utils/id";

export const defaultFormSchema: FormSchema = {
    schemaVersion: 2,
    title: "未命名表单",
    description: "",
    rows: [],
};

export function createDefaultField(type: FieldType): FieldSchema {
    const id = uid();
    const base = {
        id,
        type,
        name: `${type}_${id.slice(0, 6)}`,
        label: "未命名字段",
        required: false,
        disabled: false,
    };

    switch (type) {
        case "input":
            return { ...base, type, placeholder: "请输入", defaultValue: "" };
        case "textarea":
            return { ...base, type, placeholder: "请输入", defaultValue: "", rows: 4 };
        case "number":
            return { ...base, type, placeholder: "请输入数字", defaultValue: 0, step: 1 };
        case "select":
            return {
                ...base,
                type,
                placeholder: "请选择",
                defaultValue: "",
                options: [
                    { label: "选项 1", value: "opt1" },
                    { label: "选项 2", value: "opt2" },
                ],
            };
        case "checkbox":
            return { ...base, type, label: "勾选项", defaultValue: false };
        case "radio":
            return {
                ...base,
                type,
                label: "单选项",
                defaultValue: "opt1",
                options: [
                    { label: "选项 1", value: "opt1" },
                    { label: "选项 2", value: "opt2" },
                ],
            };
        case "date":
            return { ...base, type, label: "日期", defaultValue: "" };
        case "divider":
            return { ...base, type, name: `divider_${id.slice(0, 6)}`, label: "" };
        case "section":
            return { ...base, type, name: `section_${id.slice(0, 6)}`, title: "分组标题", description: "" };
        default:
            return base as FieldSchema;
    }
}

export function createDefaultCol(span = 12): ColSchema {
    return {
        id: uid(),
        type: "col",
        span,
        children: [],
    };
}

export function createDefaultRow(): RowSchema {
    // 默认两列（7/5）更常见；你也可以改成 6/6
    const left = createDefaultCol(7);
    const right = createDefaultCol(5);
    return {
        id: uid(),
        type: "row",
        columns: [left, right],
    };
}
