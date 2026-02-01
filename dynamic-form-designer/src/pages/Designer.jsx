/**
 * Designer 表单设计器主页面
 * 整合Header、ComponentPanel、Canvas、PropertyPanel
 */

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from '../components/layout/Header';
import ComponentPanel from '../components/layout/ComponentPanel';
import Canvas from '../components/layout/Canvas';
import PropertyPanel from '../components/layout/PropertyPanel';
import { useAuthStore } from '../stores/authStore';
import { useFormStore } from '../stores/formStore';

const Designer = () => {
  const { canDesign } = useAuthStore();
  const { mode } = useFormStore();
  
  const isDesignMode = mode === 'design';
  const showSidePanels = canDesign() && isDesignMode;
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* 顶部功能栏 */}
        <Header />
        
        {/* 主体区域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧组件面板 */}
          {showSidePanels && (
            <div className="w-64 flex-shrink-0">
              <ComponentPanel />
            </div>
          )}
          
          {/* 中间画布区域 */}
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>
          
          {/* 右侧属性编辑器 */}
          {showSidePanels && (
            <div className="w-80 flex-shrink-0">
              <PropertyPanel />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Designer;
