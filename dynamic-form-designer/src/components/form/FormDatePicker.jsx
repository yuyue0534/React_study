/**
 * FormDatePicker 日期选择器组件
 */

import React from 'react';
import clsx from 'clsx';

const FormDatePicker = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  width,
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
        type="date"
        className={clsx('input-field', preview && 'bg-white')}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default FormDatePicker;
