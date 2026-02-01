/**
 * 角色权限配置
 * 定义三种用户角色及其权限
 */

// 用户角色枚举
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

// 角色显示名称
export const ROLE_NAMES = {
  [USER_ROLES.ADMIN]: '超级管理员',
  [USER_ROLES.EDITOR]: '设计编辑者',
  [USER_ROLES.VIEWER]: '仅预览者',
};

// 角色权限配置
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canDesign: true,
    canEdit: true,
    canPreview: true,
    canSave: true,
    canImport: true,
    canExport: true,
    canSwitchRole: true,
  },
  [USER_ROLES.EDITOR]: {
    canDesign: true,
    canEdit: true,
    canPreview: true,
    canSave: true,
    canImport: false,
    canExport: false,
    canSwitchRole: true,
  },
  [USER_ROLES.VIEWER]: {
    canDesign: false,
    canEdit: false,
    canPreview: true,
    canSave: false,
    canImport: false,
    canExport: false,
    canSwitchRole: true,
  },
};

// 检查权限
export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions[permission] : false;
};

// 获取角色的所有权限
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[USER_ROLES.VIEWER];
};

// 角色列表
export const ROLE_LIST = Object.keys(USER_ROLES).map((key) => ({
  value: USER_ROLES[key],
  label: ROLE_NAMES[USER_ROLES[key]],
}));
