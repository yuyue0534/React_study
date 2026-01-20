import type { FormSchema, FieldSchema } from "./types";

function walkFields(schema: FormSchema): FieldSchema[] {
    const list: FieldSchema[] = [];
    for (const r of schema.rows) {
        for (const c of r.columns) {
            list.push(...c.children);
        }
    }
    return list;
}

export function validateSchema(schema: FormSchema): string[] {
    const errors: string[] = [];
    if (!schema.title.trim()) errors.push("表单标题不能为空");

    // row/col 基础校验
    schema.rows.forEach((r, ri) => {
        if (!r.columns.length) errors.push(`第 ${ri + 1} 行没有任何列`);
        let sum = 0;
        r.columns.forEach((c, ci) => {
            if (c.span < 1 || c.span > 12) errors.push(`第 ${ri + 1} 行第 ${ci + 1} 列 span 必须在 1-12`);
            sum += c.span;
        });
        if (sum > 12) errors.push(`第 ${ri + 1} 行列宽总和超过 12（当前 ${sum}）`);
    });

    // field name 唯一性等
    const fields = walkFields(schema);
    const nameSet = new Set<string>();
    for (const f of fields) {
        if (!f.id) errors.push("存在字段缺少 id");
        if (!f.name?.trim()) errors.push(`字段(${f.id}) name 不能为空`);
        if (f.name) {
            if (nameSet.has(f.name)) errors.push(`字段 name 重复：${f.name}`);
            nameSet.add(f.name);
        }
        if ((f.type === "select" || f.type === "radio") && (!("options" in f) || f.options.length === 0)) {
            errors.push(`字段(${f.name}) 需要至少一个 options`);
        }
    }
    return errors;
}
