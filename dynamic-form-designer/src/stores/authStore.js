/**
 * 权限状态管理 Store
 * 管理用户角色和权限
 */

import { create } from 'zustand';
import { USER_ROLES, getRolePermissions } from '../constants/roleConfig';
import { getStorage, setStorage } from '../utils/storageUtils';

const STORAGE_KEY = 'user_role';

// 从localStorage加载角色
const loadRoleFromStorage = () => {
  const saved = getStorage(STORAGE_KEY);
  return saved || USER_ROLES.ADMIN;
};

export const useAuthStore = create((set, get) => ({
  // 当前用户角色
  currentRole: loadRoleFromStorage(),
  
  /**
   * 设置用户角色
   */
  setRole: (role) => {
    set({ currentRole: role });
    setStorage(STORAGE_KEY, role);
  },
  
  /**
   * 获取当前角色的权限
   */
  getPermissions: () => {
    const { currentRole } = get();
    return getRolePermissions(currentRole);
  },
  
  /**
   * 检查是否有指定权限
   */
  hasPermission: (permission) => {
    const permissions = get().getPermissions();
    return permissions[permission] || false;
  },
  
  /**
   * 检查是否可以设计
   */
  canDesign: () => {
    return get().hasPermission('canDesign');
  },
  
  /**
   * 检查是否可以编辑
   */
  canEdit: () => {
    return get().hasPermission('canEdit');
  },
  
  /**
   * 检查是否可以预览
   */
  canPreview: () => {
    return get().hasPermission('canPreview');
  },
  
  /**
   * 检查是否可以保存
   */
  canSave: () => {
    return get().hasPermission('canSave');
  },
  
  /**
   * 检查是否可以导入
   */
  canImport: () => {
    return get().hasPermission('canImport');
  },
  
  /**
   * 检查是否可以导出
   */
  canExport: () => {
    return get().hasPermission('canExport');
  },
}));
