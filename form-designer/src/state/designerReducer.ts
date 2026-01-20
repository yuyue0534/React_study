import type { ColSchema, FieldSchema, FormSchema, RowSchema } from "../schema/types";
import { defaultFormSchema } from "../schema/defaults";
import { deepClone } from "../utils/deepClone";
import { uid } from "../utils/id";

export type SelectedNode =
    | { kind: "form" }
    | { kind: "row"; rowId: string }
    | { kind: "col"; rowId: string; colId: string }
    | { kind: "field"; rowId: string; colId: string; fieldId: string };

export type DesignerState = {
    schema: FormSchema;
    selected: SelectedNode;
    mode: "design" | "preview";
};

export type DesignerAction =
    | { type: "SET_SCHEMA"; schema: any } // 支持旧 schema 导入
    | { type: "SET_MODE"; mode: "design" | "preview" }
    | { type: "SELECT"; selected: SelectedNode }
    | { type: "UPDATE_FORM"; patch: Partial<FormSchema> }
    | { type: "ADD_ROW"; row?: RowSchema }
    | { type: "DELETE_ROW"; rowId: string }
    | { type: "ADD_COL"; rowId: string; col?: ColSchema }
    | { type: "DELETE_COL"; rowId: string; colId: string }
    | { type: "UPDATE_ROW"; rowId: string; patch: Partial<RowSchema> }
    | { type: "UPDATE_COL"; rowId: string; colId: string; patch: Partial<ColSchema> }
    | { type: "ADD_FIELD"; rowId: string; colId: string; field: FieldSchema; index?: number }
    | { type: "UPDATE_FIELD"; rowId: string; colId: string; fieldId: string; patch: Partial<FieldSchema> }
    | { type: "DELETE_FIELD"; rowId: string; colId: string; fieldId: string }
    | { type: "MOVE_ROW"; activeRowId: string; overRowId: string }
    | {
        type: "MOVE_FIELD";
        from: { rowId: string; colId: string; index: number };
        to: { rowId: string; colId: string; index: number };
    };

export const initialDesignerState: DesignerState = {
    schema: defaultFormSchema,
    selected: { kind: "form" },
    mode: "design",
};

function arrayMove<T>(arr: T[], from: number, to: number) {
    const next = arr.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

// 旧 schema 兼容：{fields: []} -> rows[ one row one col ]
function migrateSchemaIfNeeded(raw: any): FormSchema {
    if (raw?.schemaVersion === 2 && Array.isArray(raw?.rows)) return raw as FormSchema;

    // v1 兼容
    if (Array.isArray(raw?.fields)) {
        const colId = uid();
        return {
            schemaVersion: 2,
            title: raw.title || "导入表单",
            description: raw.description || "",
            rows: [
                {
                    id: uid(),
                    type: "row",
                    columns: [
                        {
                            id: colId,
                            type: "col",
                            span: 12,
                            children: raw.fields,
                        },
                    ],
                },
            ],
        };
    }

    // fallback
    return defaultFormSchema;
}

function findRow(schema: FormSchema, rowId: string) {
    return schema.rows.find((r) => r.id === rowId);
}
function findCol(schema: FormSchema, rowId: string, colId: string) {
    const row = findRow(schema, rowId);
    return row?.columns.find((c) => c.id === colId);
}

export function designerReducer(state: DesignerState, action: DesignerAction): DesignerState {
    switch (action.type) {
        case "SET_SCHEMA": {
            const schema = deepClone(migrateSchemaIfNeeded(action.schema));
            return { ...state, schema, selected: { kind: "form" }, mode: "design" };
        }

        case "SET_MODE":
            return { ...state, mode: action.mode, selected: action.mode === "preview" ? { kind: "form" } : state.selected };

        case "SELECT":
            return { ...state, selected: action.selected };

        case "UPDATE_FORM": {
            const schema = deepClone(state.schema);
            Object.assign(schema, action.patch);
            return { ...state, schema };
        }

        case "ADD_ROW": {
            const schema = deepClone(state.schema);
            const row = action.row ?? { id: uid(), type: "row", columns: [{ id: uid(), type: "col", span: 12, children: [] }] };
            schema.rows.push(row);
            return { ...state, schema, selected: { kind: "row", rowId: row.id }, mode: "design" };
        }

        case "DELETE_ROW": {
            const schema = deepClone(state.schema);
            schema.rows = schema.rows.filter((r) => r.id !== action.rowId);
            return { ...state, schema, selected: { kind: "form" } };
        }

        case "ADD_COL": {
            const schema = deepClone(state.schema);
            const row = findRow(schema, action.rowId);
            if (!row) return state;
            const col = action.col ?? { id: uid(), type: "col", span: 6, children: [] };
            row.columns.push(col);
            return { ...state, schema, selected: { kind: "col", rowId: row.id, colId: col.id } };
        }

        case "DELETE_COL": {
            const schema = deepClone(state.schema);
            const row = findRow(schema, action.rowId);
            if (!row) return state;
            row.columns = row.columns.filter((c) => c.id !== action.colId);
            return { ...state, schema, selected: { kind: "row", rowId: row.id } };
        }

        case "UPDATE_ROW": {
            const schema = deepClone(state.schema);
            const row = findRow(schema, action.rowId);
            if (!row) return state;
            Object.assign(row, action.patch);
            return { ...state, schema };
        }

        case "UPDATE_COL": {
            const schema = deepClone(state.schema);
            const col = findCol(schema, action.rowId, action.colId);
            if (!col) return state;
            Object.assign(col, action.patch);
            return { ...state, schema };
        }

        case "ADD_FIELD": {
            const schema = deepClone(state.schema);
            const col = findCol(schema, action.rowId, action.colId);
            if (!col) return state;
            const idx = action.index == null ? col.children.length : Math.max(0, Math.min(col.children.length, action.index));
            col.children.splice(idx, 0, action.field);
            return {
                ...state,
                schema,
                selected: { kind: "field", rowId: action.rowId, colId: action.colId, fieldId: action.field.id },
                mode: "design",
            };
        }

        case "UPDATE_FIELD": {
            const schema = deepClone(state.schema);
            const col = findCol(schema, action.rowId, action.colId);
            if (!col) return state;
            const idx = col.children.findIndex((f) => f.id === action.fieldId);
            if (idx >= 0) col.children[idx] = { ...col.children[idx], ...(action.patch as any) };
            return { ...state, schema };
        }

        case "DELETE_FIELD": {
            const schema = deepClone(state.schema);
            const col = findCol(schema, action.rowId, action.colId);
            if (!col) return state;
            col.children = col.children.filter((f) => f.id !== action.fieldId);
            return { ...state, schema, selected: { kind: "col", rowId: action.rowId, colId: action.colId } };
        }

        case "MOVE_ROW": {
            const schema = deepClone(state.schema);
            const from = schema.rows.findIndex((r) => r.id === action.activeRowId);
            const to = schema.rows.findIndex((r) => r.id === action.overRowId);
            if (from >= 0 && to >= 0 && from !== to) schema.rows = arrayMove(schema.rows, from, to);
            return { ...state, schema };
        }

        case "MOVE_FIELD": {
            const schema = deepClone(state.schema);
            const fromCol = findCol(schema, action.from.rowId, action.from.colId);
            const toCol = findCol(schema, action.to.rowId, action.to.colId);
            if (!fromCol || !toCol) return state;

            const item = fromCol.children[action.from.index];
            if (!item) return state;

            // remove first
            fromCol.children.splice(action.from.index, 1);

            // adjust index if same container and after removal
            const insertIndex =
                action.from.rowId === action.to.rowId && action.from.colId === action.to.colId && action.to.index > action.from.index
                    ? action.to.index - 1
                    : action.to.index;

            toCol.children.splice(Math.max(0, Math.min(toCol.children.length, insertIndex)), 0, item);
            return { ...state, schema };
        }

        default:
            return state;
    }
}
