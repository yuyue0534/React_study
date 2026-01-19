import React, { createContext, useContext, useMemo, useReducer } from "react";
import { designerReducer, initialDesignerState, type DesignerAction, type DesignerState } from "./designerReducer";

const Ctx = createContext<{
    state: DesignerState;
    dispatch: React.Dispatch<DesignerAction>;
} | null>(null);

export function DesignerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(designerReducer, initialDesignerState);
    const value = useMemo(() => ({ state, dispatch }), [state]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesigner() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useDesigner must be used within DesignerProvider");
    return ctx;
}
