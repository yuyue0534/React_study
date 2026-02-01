/**
 * FormLabel 文本标签组件
 */

import React from 'react';

const FormLabel = ({
  label,
  fontSize,
  fontWeight,
  color,
}) => {
  return (
    <div
      className="mb-4"
      style={{
        fontSize,
        fontWeight,
        color,
      }}
    >
      {label}
    </div>
  );
};

export default FormLabel;
