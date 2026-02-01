/**
 * FormCheckbox 复选框组件
 */

import React from 'react';

const FormCheckbox = ({
  label,
  value = [],
  onChange,
  required,
  disabled,
  options,
  fieldId,
}) => {
  const handleChange = (optionValue, checked) => {
    if (checked) {
      onChange?.([...value, optionValue]);
    } else {
      onChange?.(value.filter((v) => v !== optionValue));
    }
  };
  
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
              type="checkbox"
              name={fieldId}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-dark-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FormCheckbox;
