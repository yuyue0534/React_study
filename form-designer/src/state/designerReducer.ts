import type { FormSchema, FieldSchema } from "../schema/types";
import { defaultFormSchema } from "../schema/defaults";
import { deepClone } from "../utils/deepClone";

export type DesignerState = {
    schema: FormSchema;
    selectedFieldId: string | null;
    mode: "design" | "preview";
};

export type DesignerAction =
    | { type: "SET_SCHEMA"; schema: FormSchema }
    | { type: "SET_MODE"; mode: "design" | "preview" }
    | { type: "SELECT_FIELD"; fieldId: string | null }
    | { type: "ADD_FIELD"; field: FieldSchema }
    | { type: "UPDATE_FIELD"; fieldId: string; patch: Partial<FieldSchema> }
    | { type: "DELETE_FIELD"; fieldId: string }
    | { type: "MOVE_FIELD"; activeId: string; overId: string }
    | { type: "UPDATE_FORM"; patch: Partial<FormSchema> };

export const initialDesignerState: DesignerState = {
    schema: defaultFormSchema,
    selectedFieldId: null,
    mode: "design",
};

function arrayMove<T>(arr: T[], from: number, to: number) {
    const next = arr.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

export function designerReducer(state: DesignerState, action: DesignerAction): DesignerState {
    switch (action.type) {
        case "SET_SCHEMA":
            return { ...state, schema: deepClone(action.schema), selectedFieldId: null };

        case "SET_MODE":
            return { ...state, mode: action.mode, selectedFieldId: action.mode === "preview" ? null : state.selectedFieldId };

        case "SELECT_FIELD":
            return { ...state, selectedFieldId: action.fieldId };

        case "ADD_FIELD": {
            const schema = deepClone(state.schema);
            schema.fields.push(action.field);
            return { ...state, schema, selectedFieldId: action.field.id, mode: "design" };
        }

        case "UPDATE_FIELD": {
            const schema = deepClone(state.schema);
            const idx = schema.fields.findIndex((f) => f.id === action.fieldId);
            if (idx >= 0) schema.fields[idx] = { ...schema.fields[idx], ...(action.patch as any) };
            return { ...state, schema };
        }

        case "DELETE_FIELD": {
            const schema = deepClone(state.schema);
            schema.fields = schema.fields.filter((f) => f.id !== action.fieldId);
            const selectedFieldId = state.selectedFieldId === action.fieldId ? null : state.selectedFieldId;
            return { ...state, schema, selectedFieldId };
        }

        case "MOVE_FIELD": {
            const schema = deepClone(state.schema);
            const from = schema.fields.findIndex((f) => f.id === action.activeId);
            const to = schema.fields.findIndex((f) => f.id === action.overId);
            if (from >= 0 && to >= 0 && from !== to) schema.fields = arrayMove(schema.fields, from, to);
            return { ...state, schema };
        }

        case "UPDATE_FORM": {
            const schema = deepClone(state.schema);
            Object.assign(schema, action.patch);
            return { ...state, schema };
        }

        default:
            return state;
    }
}
