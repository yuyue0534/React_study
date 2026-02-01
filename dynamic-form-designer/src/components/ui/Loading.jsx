/**
 * Loading 加载组件
 * 全局加载遮罩组件
 */

import React from 'react';
import { useUIStore } from '../../stores/uiStore';

const Loading = () => {
  const { loading, loadingText } = useUIStore();
  
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-hard px-8 py-6 flex flex-col items-center gap-4">
        {/* 加载动画 */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
        </div>
        
        {/* 加载文本 */}
        <p className="text-dark-700 font-medium">{loadingText}</p>
      </div>
    </div>
  );
};

export default Loading;
