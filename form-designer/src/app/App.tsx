import { DesignerProvider } from "../state/designerContext";
import { FormDesigner } from "../designer/FormDesigner";
import { RoleProvider } from "../auth/RoleContext";
import type { RolePermission } from "../auth/permissions";

export default function App() {
    // 👇 只改这里就能切权限：superadmin/admin/hr/sales/investigator/user/ops
    const rolePermission: RolePermission = "user";
    return (
        <RoleProvider role={rolePermission}>
            <DesignerProvider>
                <FormDesigner />
            </DesignerProvider>
        </RoleProvider>
    );
}
