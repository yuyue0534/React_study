/**
 * Modal 弹窗组件
 * 通用的模态对话框组件
 */

import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
  show,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消',
  showCancel = true,
}) => {
  // 阻止背景滚动
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-lg shadow-hard max-w-md w-full mx-4 animate-slide-in">
        {/* 标题 */}
        <div className="px-6 py-4 border-b border-dark-200">
          <h3 className="text-lg font-semibold text-dark-800">{title}</h3>
        </div>
        
        {/* 内容 */}
        <div className="px-6 py-4 text-dark-600">
          {children}
        </div>
        
        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-dark-200 flex justify-end gap-3">
          {showCancel && (
            <Button variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
