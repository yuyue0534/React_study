export type FieldType =
    | "input"
    | "textarea"
    | "number"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "divider"
    | "section";

export type OptionItem = { label: string; value: string };

// ---------- Field ----------
export type BaseField = {
    id: string;
    type: FieldType;
    name: string; // 提交 key（建议唯一）
    label?: string;
    helpText?: string;
    required?: boolean;
    disabled?: boolean;
};

export type InputField = BaseField & {
    type: "input";
    placeholder?: string;
    defaultValue?: string;
};

export type TextareaField = BaseField & {
    type: "textarea";
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
};

export type NumberField = BaseField & {
    type: "number";
    placeholder?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
};

export type SelectField = BaseField & {
    type: "select";
    placeholder?: string;
    defaultValue?: string;
    options: OptionItem[];
};

export type CheckboxField = BaseField & {
    type: "checkbox";
    defaultValue?: boolean;
};

export type RadioField = BaseField & {
    type: "radio";
    defaultValue?: string;
    options: OptionItem[];
};

export type DateField = BaseField & {
    type: "date";
    defaultValue?: string; // YYYY-MM-DD
};

export type DividerField = BaseField & {
    type: "divider";
};

export type SectionField = BaseField & {
    type: "section";
    title?: string;
    description?: string;
};

export type FieldSchema =
    | InputField
    | TextareaField
    | NumberField
    | SelectField
    | CheckboxField
    | RadioField
    | DateField
    | DividerField
    | SectionField;

// ---------- Layout Containers ----------
export type ColSchema = {
    id: string;
    type: "col";
    span: number; // 1-12
    children: FieldSchema[];
};

export type RowSchema = {
    id: string;
    type: "row";
    columns: ColSchema[];
};

export type FormSchema = {
    schemaVersion: number;
    title: string;
    description?: string;
    rows: RowSchema[];
};
