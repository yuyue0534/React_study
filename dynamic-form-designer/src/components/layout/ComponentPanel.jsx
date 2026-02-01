/**
 * ComponentPanel 组件面板
 * 左侧组件选择面板,包含容器组件和基础组件
 */

import React from 'react';
import { useDrag } from 'react-dnd';
import Tabs from '../ui/Tabs';
import {
  CONTAINER_CONFIGS,
  COMPONENT_CONFIGS,
  DRAG_ITEM_TYPES,
} from '../../constants/componentTypes';
import { getDefaultProps } from '../../constants/defaultProps';

// 可拖拽组件项
const DraggableComponentItem = ({ config, isContainer }) => {
  const [{ isDragging }, drag] = useDrag({
    type: isContainer ? DRAG_ITEM_TYPES.CONTAINER : DRAG_ITEM_TYPES.COMPONENT,
    item: {
      componentType: config.type,
      isContainer,
      defaultProps: getDefaultProps(config.type, isContainer),
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  return (
    <div
      ref={drag}
      className="component-preview"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-lg text-lg font-bold">
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-dark-800">{config.name}</div>
          <div className="text-xs text-dark-500">{config.description}</div>
        </div>
      </div>
    </div>
  );
};

const ComponentPanel = () => {
  const tabs = [
    {
      key: 'containers',
      label: '容器组件',
      content: (
        <div className="p-4 space-y-3">
          {CONTAINER_CONFIGS.map((config) => (
            <DraggableComponentItem
              key={config.type}
              config={config}
              isContainer
            />
          ))}
        </div>
      ),
    },
    {
      key: 'components',
      label: '基础组件',
      content: (
        <div className="p-4 space-y-3">
          {COMPONENT_CONFIGS.map((config) => (
            <DraggableComponentItem
              key={config.type}
              config={config}
              isContainer={false}
            />
          ))}
        </div>
      ),
    },
  ];
  
  return (
    <div className="h-full flex flex-col bg-white border-r border-dark-200">
      <div className="px-4 py-3 border-b border-dark-200">
        <h2 className="font-semibold text-dark-800">组件库</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs tabs={tabs} defaultActiveKey="components" />
      </div>
    </div>
  );
};

export default ComponentPanel;
