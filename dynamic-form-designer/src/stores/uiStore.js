/**
 * UI状态管理 Store
 * 管理UI相关的状态,如Toast提示、Modal弹窗等
 */

import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Toast提示状态
  toast: {
    show: false,
    message: '',
    type: 'info', // 'info' | 'success' | 'warning' | 'error'
  },
  
  // Modal弹窗状态
  modal: {
    show: false,
    title: '',
    content: '',
    onConfirm: null,
    onCancel: null,
  },
  
  // Loading状态
  loading: false,
  loadingText: '加载中...',
  
  /**
   * 显示Toast提示
   */
  showToast: (message, type = 'info', duration = 3000) => {
    set({
      toast: {
        show: true,
        message,
        type,
      },
    });
    
    // 自动隐藏
    setTimeout(() => {
      set((state) => ({
        toast: {
          ...state.toast,
          show: false,
        },
      }));
    }, duration);
  },
  
  /**
   * 隐藏Toast
   */
  hideToast: () => {
    set((state) => ({
      toast: {
        ...state.toast,
        show: false,
      },
    }));
  },
  
  /**
   * 显示Modal弹窗
   */
  showModal: (title, content, onConfirm, onCancel) => {
    set({
      modal: {
        show: true,
        title,
        content,
        onConfirm,
        onCancel,
      },
    });
  },
  
  /**
   * 隐藏Modal
   */
  hideModal: () => {
    set((state) => ({
      modal: {
        ...state.modal,
        show: false,
      },
    }));
  },
  
  /**
   * 显示Loading
   */
  showLoading: (text = '加载中...') => {
    set({
      loading: true,
      loadingText: text,
    });
  },
  
  /**
   * 隐藏Loading
   */
  hideLoading: () => {
    set({
      loading: false,
    });
  },
}));
