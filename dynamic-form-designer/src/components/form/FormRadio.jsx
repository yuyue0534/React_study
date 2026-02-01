/**
 * FormRadio 单选框组组件
 */

import React from 'react';

const FormRadio = ({
  label,
  value,
  onChange,
  required,
  disabled,
  options,
  fieldId,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="space-y-2">
        {options?.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer hover:text-primary-600"
          >
            <input
              type="radio"
              name={fieldId}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
            />
            <span className="text-sm text-dark-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FormRadio;
