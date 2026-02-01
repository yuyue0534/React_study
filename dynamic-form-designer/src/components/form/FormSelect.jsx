/**
 * FormSelect 下拉选择框组件
 */

import React from 'react';
import clsx from 'clsx';

const FormSelect = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  width,
  options,
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
      <select
        id={fieldId}
        className={clsx('input-field', preview && 'bg-white')}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
