import type { FormSchema } from "./types";

export function validateSchema(schema: FormSchema): string[] {
    const errors: string[] = [];
    if (!schema.title.trim()) errors.push("表单标题不能为空");

    const nameSet = new Set<string>();
    for (const f of schema.fields) {
        if (!f.id) errors.push("存在字段缺少 id");
        if (!f.name?.trim()) errors.push(`字段(${f.id}) name 不能为空`);
        if (f.name) {
            if (nameSet.has(f.name)) errors.push(`字段 name 重复：${f.name}`);
            nameSet.add(f.name);
        }
        if (f.colSpan != null && (f.colSpan < 1 || f.colSpan > 12)) {
            errors.push(`字段(${f.name}) colSpan 必须在 1-12`);
        }
        if ((f.type === "select" || f.type === "radio") && (!("options" in f) || f.options.length === 0)) {
            errors.push(`字段(${f.name}) 需要至少一个 options`);
        }
    }
    return errors;
}
