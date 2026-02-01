/**
 * Canvas 画布组件
 * 中间画布区域,支持拖拽放置、排序、选中等交互
 */

import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';
import { useFormStore } from '../../stores/formStore';
import { DRAG_ITEM_TYPES } from '../../constants/componentTypes';
import ComponentRenderer from '../renderer/ComponentRenderer';
import ContainerRenderer from '../renderer/ContainerRenderer';

// 可拖拽的节点包装器
const DraggableNode = ({ node, preview, onValueChange }) => {
  const { selectedNodeId, selectNode, deleteComponent } = useFormStore();
  const isSelected = selectedNodeId === node.id;
  
  const handleClick = (e) => {
    if (preview) return;
    e.stopPropagation();
    selectNode(node.id);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个组件吗?')) {
      deleteComponent(node.id);
    }
  };
  
  // 容器组件
  if (node.type === 'container') {
    const children = node.children?.map((child) => (
      <DroppableNode
        key={child.id}
        node={child}
        parentId={node.id}
        preview={preview}
        onValueChange={onValueChange}
      />
    ));
    
    return (
      <div className="relative group">
        <ContainerRenderer
          node={node}
          selected={isSelected}
          onClick={handleClick}
          preview={preview}
        >
          {children}
        </ContainerRenderer>
        
        {/* 删除按钮 */}
        {!preview && isSelected && (
          <button
            type="button"
            className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
            onClick={handleDelete}
          >
            ×
          </button>
        )}
      </div>
    );
  }
  
  // 基础组件
  return (
    <div
      className={clsx(
        'relative group',
        !preview && 'component-preview',
        isSelected && !preview && 'selected'
      )}
      onClick={handleClick}
    >
      <ComponentRenderer
        node={node}
        preview={preview}
        onValueChange={onValueChange}
      />
      
      {/* 删除按钮 */}
      {!preview && isSelected && (
        <button
          type="button"
          className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
          onClick={handleDelete}
        >
          ×
        </button>
      )}
    </div>
  );
};

// 可放置的节点包装器
const DroppableNode = ({ node, parentId, preview, onValueChange }) => {
  const { addComponent } = useFormStore();
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [DRAG_ITEM_TYPES.COMPONENT, DRAG_ITEM_TYPES.CONTAINER],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      
      // 只有容器组件可以接受子组件
      if (node.type === 'container') {
        addComponent(
          item.componentType,
          item.isContainer,
          node.id,
          -1
        );
      }
    },
    canDrop: () => node.type === 'container',
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });
  
  if (node.type === 'container') {
    return (
      <div
        ref={drop}
        className={clsx(
          canDrop && isOver && 'drag-over',
          'transition-all duration-200'
        )}
      >
        <DraggableNode
          node={node}
          preview={preview}
          onValueChange={onValueChange}
        />
      </div>
    );
  }
  
  return (
    <DraggableNode
      node={node}
      preview={preview}
      onValueChange={onValueChange}
    />
  );
};

const Canvas = () => {
  const { formSchema, addComponent, mode, unselectNode } = useFormStore();
  const preview = mode === 'preview';
  
  // 预览模式下的表单值状态
  const [formValues, setFormValues] = useState({});
  
  const handleValueChange = (nodeId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [nodeId]: value,
    }));
  };
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [DRAG_ITEM_TYPES.COMPONENT, DRAG_ITEM_TYPES.CONTAINER],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      
      addComponent(
        item.componentType,
        item.isContainer,
        null,
        -1
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });
  
  const handleCanvasClick = () => {
    if (!preview) {
      unselectNode();
    }
  };
  
  return (
    <div
      ref={drop}
      className={clsx(
        'h-full overflow-auto custom-scrollbar bg-dark-50 p-6',
        canDrop && isOver && !preview && 'bg-primary-50'
      )}
      onClick={handleCanvasClick}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-soft p-8 min-h-[600px]">
        {/* 表单标题 */}
        <div className="mb-6 pb-4 border-b border-dark-200">
          <h1 className="text-2xl font-bold text-dark-800">
            {formSchema.name}
          </h1>
          {preview && (
            <p className="text-sm text-dark-500 mt-1">
              预览模式 - 填写表单数据
            </p>
          )}
        </div>
        
        {/* 组件列表 */}
        {formSchema.components.length > 0 ? (
          <div className="space-y-4">
            {formSchema.components.map((node) => (
              <DroppableNode
                key={node.id}
                node={node}
                parentId={null}
                preview={preview}
                onValueChange={handleValueChange}
              />
            ))}
          </div>
        ) : (
          !preview && (
            <div className="flex flex-col items-center justify-center py-16 text-dark-400">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-medium mb-2">开始设计你的表单</p>
              <p className="text-sm">从左侧组件库拖拽组件到此处</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Canvas;
