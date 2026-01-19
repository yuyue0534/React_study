import { ComponentPalette } from "./components/ComponentPalette";
import { Canvas } from "./components/Canvas";
import { PropertyEditor } from "./components/PropertyEditor";
import { TopBar } from "./components/TopBar";
import { useDesigner } from "../state/designerContext";
import { FormRenderer } from "../renderer/FormRenderer";

export function FormDesigner() {
    const { state } = useDesigner();

    return (
        <div className="h-screen w-screen overflow-hidden bg-white">
            <TopBar />

            <div className="grid h-[calc(100vh-56px)] grid-cols-12">
                {/* Left */}
                <div className="col-span-3 min-w-[260px]">
                    <ComponentPalette />
                </div>

                {/* Center */}
                <div className="col-span-6">
                    {state.mode === "design" ? (
                        <Canvas />
                    ) : (
                        <div className="h-full overflow-auto bg-slate-50 p-6">
                            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
                                <FormRenderer schema={state.schema} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="col-span-3 min-w-[280px]">
                    <PropertyEditor />
                </div>
            </div>
        </div>
    );
}
