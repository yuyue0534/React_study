/**
 * GroupContainer 分组容器组件
 * 可折叠的分组容器
 */

import React, { useState } from 'react';
import clsx from 'clsx';

const GroupContainer = ({
  children,
  props,
  selected,
  onClick,
  preview = false,
}) => {
  const {
    width,
    height,
    padding,
    margin,
    backgroundColor,
    borderStyle,
    title,
    collapsed: initialCollapsed = false,
  } = props;
  
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  
  return (
    <div
      className={clsx(
        'container-wrapper',
        selected && !preview && 'selected',
        !preview && 'cursor-pointer'
      )}
      style={{
        width,
        height: collapsed ? 'auto' : height,
        padding: 0,
        margin,
        backgroundColor,
        border: borderStyle,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 分组标题 */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-dark-50 border-b border-dark-200 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}
      >
        <span className="font-medium text-dark-700">{title}</span>
        <svg
          className={clsx(
            'w-5 h-5 text-dark-500 transition-transform',
            collapsed && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      
      {/* 分组内容 */}
      {!collapsed && (
        <div style={{ padding }}>
          {children && children.length > 0 ? (
            children
          ) : (
            !preview && (
              <div className="w-full text-center text-dark-400 text-sm py-4">
                拖拽组件到此处
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GroupContainer;
