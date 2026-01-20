import React, { createContext, useContext, useMemo } from "react";
import { ROLE_PERMISSIONS, type RolePermission } from "./permissions";

const RoleCtx = createContext<{ role: RolePermission } | null>(null);

export function RoleProvider({ role, children }: { role: RolePermission; children: React.ReactNode }) {
    const value = useMemo(() => ({ role }), [role]);
    return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export function useRole() {
    const ctx = useContext(RoleCtx);
    if (!ctx) throw new Error("useRole must be used within RoleProvider");
    return ctx.role;
}

export function usePermissions() {
    const role = useRole();
    return ROLE_PERMISSIONS[role];
}
