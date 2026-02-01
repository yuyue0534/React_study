/**
 * ComponentRenderer 组件渲染器
 * 根据组件类型动态渲染对应的组件
 */

import React from 'react';
import { COMPONENT_TYPES } from '../../constants/componentTypes';
import FormInput from '../form/FormInput';
import FormTextarea from '../form/FormTextarea';
import FormSelect from '../form/FormSelect';
import FormDatePicker from '../form/FormDatePicker';
import FormCheckbox from '../form/FormCheckbox';
import FormRadio from '../form/FormRadio';
import FormButton from '../form/FormButton';
import FormLabel from '../form/FormLabel';

const ComponentRenderer = ({ node, preview = false, onValueChange }) => {
  const { componentType, props } = node;
  
  const handleChange = (value) => {
    onValueChange?.(node.id, value);
  };
  
  switch (componentType) {
    case COMPONENT_TYPES.INPUT:
      return (
        <FormInput
          {...props}
          onChange={handleChange}
          preview={preview}
        />
      );
      
    case COMPONENT_TYPES.TEXTAREA:
      return (
        <FormTextarea
          {...props}
          onChange={handleChange}
          preview={preview}
        />
      );
      
    case COMPONENT_TYPES.SELECT:
      return (
        <FormSelect
          {...props}
          onChange={handleChange}
          preview={preview}
        />
      );
      
    case COMPONENT_TYPES.DATE:
      return (
        <FormDatePicker
          {...props}
          onChange={handleChange}
          preview={preview}
        />
      );
      
    case COMPONENT_TYPES.CHECKBOX:
      return (
        <FormCheckbox
          {...props}
          onChange={handleChange}
        />
      );
      
    case COMPONENT_TYPES.RADIO:
      return (
        <FormRadio
          {...props}
          onChange={handleChange}
        />
      );
      
    case COMPONENT_TYPES.BUTTON:
      return (
        <FormButton {...props} />
      );
      
    case COMPONENT_TYPES.LABEL:
      return (
        <FormLabel {...props} />
      );
      
    default:
      return (
        <div className="text-error p-2">
          未知组件类型: {componentType}
        </div>
      );
  }
};

export default ComponentRenderer;
