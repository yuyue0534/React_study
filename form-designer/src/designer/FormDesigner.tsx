import { ComponentPalette } from "./components/ComponentPalette";
import { Canvas } from "./components/Canvas";
import { PropertyEditor } from "./components/PropertyEditor";
import { TopBar } from "./components/TopBar";
import { useDesigner } from "../state/designerContext";
import { FormRenderer } from "../renderer/FormRenderer";

export function FormDesigner() {
    const { state } = useDesigner();

    return (
        <div className="h-[100dvh] w-screen overflow-hidden bg-white flex flex-col">
            <TopBar />

            <div className="grid flex-1 min-h-0 grid-cols-12">
                {/* Left */}
                <div className="col-span-3 min-h-0 min-w-[260px] overflow-hidden">
                    <ComponentPalette />
                </div>

                {/* Center */}
                <div className="col-span-6 min-h-0 overflow-hidden">
                    {state.mode === "design" ? (
                        <Canvas />
                    ) : (
                        <div className="h-full min-h-0 overflow-y-auto bg-slate-50 p-6">
                            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
                                <FormRenderer schema={state.schema} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="col-span-3 min-h-0 min-w-[280px] overflow-hidden">
                    <PropertyEditor />
                </div>
            </div>
        </div>
    );
}
