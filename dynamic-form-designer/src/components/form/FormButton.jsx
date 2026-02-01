/**
 * FormButton 表单按钮组件
 */

import React from 'react';
import Button from '../ui/Button';

const FormButton = ({
  label,
  type = 'primary',
  disabled,
  width,
  onClick,
}) => {
  return (
    <div className="mb-4">
      <Button
        variant={type}
        disabled={disabled}
        onClick={onClick}
        style={{ width }}
      >
        {label}
      </Button>
    </div>
  );
};

export default FormButton;
