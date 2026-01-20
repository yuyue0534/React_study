import type { FormSchema } from "../schema/types";
import { FieldView } from "./fieldRenderers";

export function FormRenderer({ schema }: { schema: FormSchema }) {
    return (
        <div className="w-full">
            <div className="mb-4">
                <div className="text-xl font-semibold text-slate-900">{schema.title}</div>
                {schema.description ? <div className="text-sm text-slate-600 mt-1">{schema.description}</div> : null}
            </div>

            <div className="space-y-4">
                {schema.rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-3">
                        {row.columns.map((col) => (
                            <div key={col.id} className={`col-span-${col.span}`}>
                                <div className="space-y-3">
                                    {col.children.map((f) => (
                                        <FieldView key={f.id} field={f} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
