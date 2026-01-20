export type RolePermission =
    | "superadmin"
    | "admin"
    | "ops"
    | "hr"
    | "sales"
    | "investigator"
    | "user";

export type Permissions = {
    canDesign: boolean;
    canLayout: boolean;
    canEditProps: boolean;
    canAddField: boolean;
    canDelete: boolean;
    canReorder: boolean;
    canImportExport: boolean;
    canPreview: boolean;
    canExportValues: boolean;
};

export const ROLE_PERMISSIONS: Record<RolePermission, Permissions> = {
    superadmin: {
        canDesign: true,
        canLayout: true,
        canEditProps: true,
        canAddField: true,
        canDelete: true,
        canReorder: true,
        canImportExport: true,
        canPreview: true,
        canExportValues: true,
    },
    ops: {
        canDesign: true,
        canLayout: true,
        canEditProps: true,
        canAddField: true,
        canDelete: true,
        canReorder: true,
        canImportExport: true,
        canPreview: true,
        canExportValues: true,
    },
    admin: {
        canDesign: true,
        canLayout: true,
        canEditProps: true,
        canAddField: true,
        canDelete: true,
        canReorder: true,
        canImportExport: true,
        canPreview: true,
        canExportValues: true,
    },
    hr: {
        canDesign: true,
        canLayout: false,      // 不允许动布局（Row/Col）
        canEditProps: true,
        canAddField: true,
        canDelete: true,
        canReorder: true,      // 允许在列内/跨列整理字段（如你想更严可设 false）
        canImportExport: true,
        canPreview: true,
        canExportValues: true,
    },
    sales: {
        canDesign: false,
        canLayout: false,
        canEditProps: false,
        canAddField: false,
        canDelete: false,
        canReorder: false,
        canImportExport: false,
        canPreview: true,
        canExportValues: false,
    },
    investigator: {
        canDesign: false,
        canLayout: false,
        canEditProps: false,
        canAddField: false,
        canDelete: false,
        canReorder: false,
        canImportExport: false,
        canPreview: true,
        canExportValues: true, // 调查员可导出填写结果
    },
    user: {
        canDesign: false,
        canLayout: false,
        canEditProps: false,
        canAddField: false,
        canDelete: false,
        canReorder: false,
        canImportExport: true,
        canPreview: true,
        canExportValues: false,
    },
};
