/**
 * FormTextarea 多行输入框组件
 * 多行文本输入框
 */

import React from 'react';
import clsx from 'clsx';

const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  width,
  rows,
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
      <textarea
        id={fieldId}
        className={clsx('input-field resize-none', preview && 'bg-white')}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows || 4}
        maxLength={maxLength}
      />
    </div>
  );
};

export default FormTextarea;
