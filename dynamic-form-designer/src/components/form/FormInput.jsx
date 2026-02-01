/**
 * FormInput 输入框组件
 * 单行文本输入框
 */

import React from 'react';
import clsx from 'clsx';

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  width,
  maxLength,
  fieldId,
  preview = false,
}) => {
  return (
    <div className="mb-4" style={{ width }}>
      {label && (
        <label htmlFor={fieldId} className="input-label">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        id={fieldId}
        type="text"
        className={clsx('input-field', preview && 'bg-white')}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
      />
    </div>
  );
};

export default FormInput;
