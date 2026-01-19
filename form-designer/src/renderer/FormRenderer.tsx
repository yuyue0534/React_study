import type { FormSchema } from "../schema/types";
import { FieldView } from "./fieldRenderers";

export function FormRenderer({ schema }: { schema: FormSchema }) {
    return (
        <div className="w-full">
            <div className="mb-4">
                <div className="text-xl font-semibold text-slate-900">{schema.title}</div>
                {schema.description ? <div className="text-sm text-slate-600 mt-1">{schema.description}</div> : null}
            </div>

            <div className="grid grid-cols-12 gap-3">
                {schema.fields.map((f) => (
                    <div key={f.id} className={`col-span-${Math.min(12, Math.max(1, f.colSpan ?? 12))}`}>
                        <FieldView field={f} />
                    </div>
                ))}
            </div>
        </div>
    );
}
