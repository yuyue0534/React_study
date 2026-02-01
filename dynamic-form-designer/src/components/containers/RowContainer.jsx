/**
 * RowContainer 行容器组件
 * 水平排列子组件
 */

import React from 'react';
import clsx from 'clsx';

const RowContainer = ({
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
    gap,
    justifyContent,
    alignItems,
  } = props;
  
  return (
    <div
      className={clsx(
        'container-wrapper',
        selected && !preview && 'selected',
        !preview && 'cursor-pointer'
      )}
      style={{
        width,
        height,
        padding,
        margin,
        backgroundColor,
        border: borderStyle,
        display: 'flex',
        flexDirection: 'row',
        gap,
        justifyContent,
        alignItems,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
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
  );
};

export default RowContainer;
