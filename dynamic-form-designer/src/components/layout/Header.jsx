/**
 * Header 头部组件
 * 顶部功能栏,包含项目名称、表单名称输入、功能按钮组
 */

import React, { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useFormStore } from '../../stores/formStore';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { USER_ROLES, ROLE_NAMES } from '../../constants/roleConfig';
import {
  exportJsonFile,
  importJsonFile,
  generateExportFilename,
  validateImportData,
} from '../../utils/fileUtils';

const Header = () => {
  const {
    formSchema,
    setFormName,
    saveForm,
    loadFormSchema,
    mode,
    setMode,
    resetForm,
  } = useFormStore();
  
  const { currentRole, setRole, canSave, canImport, canExport } = useAuthStore();
  const { showToast, showLoading, hideLoading, showModal, hideModal } = useUIStore();
  
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  
  // 保存表单
  const handleSave = () => {
    if (!canSave()) {
      showToast('当前角色无保存权限', 'error');
      return;
    }
    
    const success = saveForm();
    if (success) {
      showToast('保存成功', 'success');
    } else {
      showToast('保存失败', 'error');
    }
  };
  
  // 导出表单
  const handleExport = () => {
    if (!canExport()) {
      showToast('当前角色无导出权限', 'error');
      return;
    }
    
    try {
      const filename = generateExportFilename(formSchema.name);
      const success = exportJsonFile(formSchema, filename);
      
      if (success) {
        showToast('导出成功', 'success');
      } else {
        showToast('导出失败', 'error');
      }
    } catch (error) {
      showToast('导出失败: ' + error.message, 'error');
    }
  };
  
  // 导入表单
  const handleImport = async () => {
    if (!canImport()) {
      showToast('当前角色无导入权限', 'error');
      return;
    }
    
    showModal(
      '导入表单',
      '导入新表单将覆盖当前表单,是否继续?',
      async () => {
        hideModal();
        showLoading('正在导入表单...');
        
        try {
          const data = await importJsonFile();
          const validation = validateImportData(data);
          
          if (!validation.valid) {
            showToast('导入失败: ' + validation.errors.join(', '), 'error');
            return;
          }
          
          loadFormSchema(data);
          showToast('导入成功', 'success');
        } catch (error) {
          showToast('导入失败: ' + error.message, 'error');
        } finally {
          hideLoading();
        }
      },
      () => {
        hideModal();
      }
    );
  };
  
  // 切换模式
  const handleToggleMode = () => {
    const newMode = mode === 'design' ? 'preview' : 'design';
    setMode(newMode);
    showToast(
      newMode === 'preview' ? '已切换到预览模式' : '已切换到设计模式',
      'info'
    );
  };
  
  // 切换角色
  const handleRoleChange = (role) => {
    setRole(role);
    setShowRoleMenu(false);
    showToast(`已切换到${ROLE_NAMES[role]}`, 'info');
    
    // 如果切换到仅预览者,自动切换到预览模式
    if (role === USER_ROLES.VIEWER && mode === 'design') {
      setMode('preview');
    }
  };
  
  // 重置表单
  const handleReset = () => {
    showModal(
      '重置表单',
      '重置将清空当前表单的所有内容,是否继续?',
      () => {
        hideModal();
        resetForm();
        showToast('表单已重置', 'success');
      },
      () => {
        hideModal();
      }
    );
  };
  
  return (
    <header className="h-16 bg-white border-b border-dark-200 flex items-center justify-between px-6">
      {/* 左侧: Logo和项目名称 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FD</span>
          </div>
          <span className="font-display font-bold text-lg text-dark-800">
            表单设计器
          </span>
        </div>
        
        <div className="h-6 w-px bg-dark-200" />
        
        {/* 表单名称输入 */}
        <input
          type="text"
          value={formSchema.name}
          onChange={(e) => setFormName(e.target.value)}
          className="px-3 py-1 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-dark-800"
          placeholder="表单名称"
          disabled={mode === 'preview'}
        />
      </div>
      
      {/* 右侧: 功能按钮组 */}
      <div className="flex items-center gap-3">
        {/* 导入按钮 */}
        <Button
          variant="ghost"
          size="small"
          onClick={handleImport}
          disabled={!canImport() || mode === 'preview'}
        >
          导入
        </Button>
        
        {/* 导出按钮 */}
        <Button
          variant="ghost"
          size="small"
          onClick={handleExport}
          disabled={!canExport()}
        >
          导出
        </Button>
        
        {/* 保存按钮 */}
        <Button
          variant="ghost"
          size="small"
          onClick={handleSave}
          disabled={!canSave() || mode === 'preview'}
        >
          保存
        </Button>
        
        {/* 重置按钮 */}
        <Button
          variant="ghost"
          size="small"
          onClick={handleReset}
          disabled={mode === 'preview'}
        >
          重置
        </Button>
        
        <div className="h-6 w-px bg-dark-200" />
        
        {/* 切换模式按钮 */}
        <Button
          variant={mode === 'preview' ? 'primary' : 'secondary'}
          size="small"
          onClick={handleToggleMode}
        >
          {mode === 'preview' ? '返回设计' : '预览'}
        </Button>
        
        <div className="h-6 w-px bg-dark-200" />
        
        {/* 角色切换菜单 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {ROLE_NAMES[currentRole]}
            </span>
          </Button>
          
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-hard border border-dark-200 py-2 z-10">
              {Object.values(USER_ROLES).map((role) => (
                <button
                  key={role}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-dark-50 transition-colors flex items-center justify-between"
                  onClick={() => handleRoleChange(role)}
                >
                  <span className={role === currentRole ? 'text-primary-600 font-medium' : 'text-dark-700'}>
                    {ROLE_NAMES[role]}
                  </span>
                  {role === currentRole && (
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
