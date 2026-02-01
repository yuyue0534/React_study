/**
 * ContainerRenderer 容器渲染器
 * 根据容器类型动态渲染对应的容器
 */

import React from 'react';
import { CONTAINER_TYPES } from '../../constants/componentTypes';
import RowContainer from '../containers/RowContainer';
import ColumnContainer from '../containers/ColumnContainer';
import GroupContainer from '../containers/GroupContainer';

const ContainerRenderer = ({
  node,
  children,
  selected,
  onClick,
  preview = false,
}) => {
  const { componentType, props } = node;
  
  switch (componentType) {
    case CONTAINER_TYPES.ROW:
      return (
        <RowContainer
          props={props}
          selected={selected}
          onClick={onClick}
          preview={preview}
        >
          {children}
        </RowContainer>
      );
      
    case CONTAINER_TYPES.COLUMN:
      return (
        <ColumnContainer
          props={props}
          selected={selected}
          onClick={onClick}
          preview={preview}
        >
          {children}
        </ColumnContainer>
      );
      
    case CONTAINER_TYPES.GROUP:
      return (
        <GroupContainer
          props={props}
          selected={selected}
          onClick={onClick}
          preview={preview}
        >
          {children}
        </GroupContainer>
      );
      
    default:
      return (
        <div className="text-error p-2">
          未知容器类型: {componentType}
        </div>
      );
  }
};

export default ContainerRenderer;
