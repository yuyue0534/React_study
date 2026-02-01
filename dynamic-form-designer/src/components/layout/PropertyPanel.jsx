/**
 * PropertyPanel 属性编辑面板
 * 右侧属性编辑器,根据选中组件动态显示属性表单
 */

import React from 'react';
import { useFormStore } from '../../stores/formStore';
import { CONTAINER_TYPES, COMPONENT_TYPES } from '../../constants/componentTypes';

// 容器属性编辑表单
const ContainerPropsForm = ({ node }) => {
  const { updateComponentProps } = useFormStore();
  const { props } = node;
  
  const handleChange = (key, value) => {
    updateComponentProps(node.id, { [key]: value });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="input-label">容器名称</label>
        <input
          type="text"
          className="input-field"
          value={props.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      
      {node.componentType === CONTAINER_TYPES.GROUP && (
        <div>
          <label className="input-label">分组标题</label>
          <input
            type="text"
            className="input-field"
            value={props.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
      )}
      
      <div>
        <label className="input-label">宽度</label>
        <input
          type="text"
          className="input-field"
          value={props.width || ''}
          onChange={(e) => handleChange('width', e.target.value)}
          placeholder="例如: 100%, 500px"
        />
      </div>
      
      <div>
        <label className="input-label">高度</label>
        <input
          type="text"
          className="input-field"
          value={props.height || ''}
          onChange={(e) => handleChange('height', e.target.value)}
          placeholder="例如: auto, 300px"
        />
      </div>
      
      <div>
        <label className="input-label">内边距</label>
        <input
          type="text"
          className="input-field"
          value={props.padding || ''}
          onChange={(e) => handleChange('padding', e.target.value)}
          placeholder="例如: 16px"
        />
      </div>
      
      <div>
        <label className="input-label">外边距</label>
        <input
          type="text"
          className="input-field"
          value={props.margin || ''}
          onChange={(e) => handleChange('margin', e.target.value)}
          placeholder="例如: 0"
        />
      </div>
      
      <div>
        <label className="input-label">背景色</label>
        <input
          type="text"
          className="input-field"
          value={props.backgroundColor || ''}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          placeholder="例如: #ffffff, transparent"
        />
      </div>
      
      <div>
        <label className="input-label">边框样式</label>
        <input
          type="text"
          className="input-field"
          value={props.borderStyle || ''}
          onChange={(e) => handleChange('borderStyle', e.target.value)}
          placeholder="例如: 1px solid #e5e7eb"
        />
      </div>
      
      {node.componentType !== CONTAINER_TYPES.GROUP && (
        <>
          <div>
            <label className="input-label">间距</label>
            <input
              type="text"
              className="input-field"
              value={props.gap || ''}
              onChange={(e) => handleChange('gap', e.target.value)}
              placeholder="例如: 8px"
            />
          </div>
          
          <div>
            <label className="input-label">主轴对齐</label>
            <select
              className="input-field"
              value={props.justifyContent || ''}
              onChange={(e) => handleChange('justifyContent', e.target.value)}
            >
              <option value="flex-start">起始对齐</option>
              <option value="center">居中对齐</option>
              <option value="flex-end">末尾对齐</option>
              <option value="space-between">两端对齐</option>
              <option value="space-around">环绕对齐</option>
            </select>
          </div>
          
          <div>
            <label className="input-label">交叉轴对齐</label>
            <select
              className="input-field"
              value={props.alignItems || ''}
              onChange={(e) => handleChange('alignItems', e.target.value)}
            >
              <option value="stretch">拉伸</option>
              <option value="flex-start">起始对齐</option>
              <option value="center">居中对齐</option>
              <option value="flex-end">末尾对齐</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

// 基础组件属性编辑表单
const ComponentPropsForm = ({ node }) => {
  const { updateComponentProps } = useFormStore();
  const { props } = node;
  
  const handleChange = (key, value) => {
    updateComponentProps(node.id, { [key]: value });
  };
  
  const handleOptionChange = (index, key, value) => {
    const newOptions = [...(props.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleChange('options', newOptions);
  };
  
  const handleAddOption = () => {
    const newOptions = [...(props.options || [])];
    newOptions.push({ label: '新选项', value: `option${newOptions.length + 1}` });
    handleChange('options', newOptions);
  };
  
  const handleRemoveOption = (index) => {
    const newOptions = [...(props.options || [])];
    newOptions.splice(index, 1);
    handleChange('options', newOptions);
  };
  
  const showOptions = [
    COMPONENT_TYPES.SELECT,
    COMPONENT_TYPES.CHECKBOX,
    COMPONENT_TYPES.RADIO,
  ].includes(node.componentType);
  
  const showFieldConfig = ![
    COMPONENT_TYPES.BUTTON,
    COMPONENT_TYPES.LABEL,
  ].includes(node.componentType);
  
  return (
    <div className="space-y-4">
      <div>
        <label className="input-label">组件名称</label>
        <input
          type="text"
          className="input-field"
          value={props.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      
      {showFieldConfig && (
        <>
          <div>
            <label className="input-label">字段标识 (唯一)</label>
            <input
              type="text"
              className="input-field font-mono text-sm"
              value={props.fieldId || ''}
              onChange={(e) => handleChange('fieldId', e.target.value)}
              placeholder="用于表单提交"
            />
          </div>
          
          <div>
            <label className="input-label">标签文本</label>
            <input
              type="text"
              className="input-field"
              value={props.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
          </div>
        </>
      )}
      
      {node.componentType === COMPONENT_TYPES.BUTTON && (
        <div>
          <label className="input-label">按钮文本</label>
          <input
            type="text"
            className="input-field"
            value={props.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </div>
      )}
      
      {node.componentType === COMPONENT_TYPES.LABEL && (
        <>
          <div>
            <label className="input-label">文本内容</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={props.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
            />
          </div>
          
          <div>
            <label className="input-label">字体大小</label>
            <input
              type="text"
              className="input-field"
              value={props.fontSize || ''}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              placeholder="例如: 14px, 1rem"
            />
          </div>
          
          <div>
            <label className="input-label">字体粗细</label>
            <select
              className="input-field"
              value={props.fontWeight || ''}
              onChange={(e) => handleChange('fontWeight', e.target.value)}
            >
              <option value="normal">正常</option>
              <option value="medium">中等</option>
              <option value="semibold">半粗</option>
              <option value="bold">粗体</option>
            </select>
          </div>
          
          <div>
            <label className="input-label">颜色</label>
            <input
              type="text"
              className="input-field"
              value={props.color || ''}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder="例如: #374151"
            />
          </div>
        </>
      )}
      
      {showFieldConfig && (
        <>
          {![COMPONENT_TYPES.CHECKBOX, COMPONENT_TYPES.RADIO].includes(node.componentType) && (
            <div>
              <label className="input-label">占位符</label>
              <input
                type="text"
                className="input-field"
                value={props.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="input-label">默认值</label>
            <input
              type="text"
              className="input-field"
              value={props.defaultValue || ''}
              onChange={(e) => handleChange('defaultValue', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={props.required || false}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="required" className="text-sm text-dark-700 cursor-pointer">
              必填项
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disabled"
              checked={props.disabled || false}
              onChange={(e) => handleChange('disabled', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="disabled" className="text-sm text-dark-700 cursor-pointer">
              禁用状态
            </label>
          </div>
          
          <div>
            <label className="input-label">宽度</label>
            <input
              type="text"
              className="input-field"
              value={props.width || ''}
              onChange={(e) => handleChange('width', e.target.value)}
              placeholder="例如: 100%, 300px"
            />
          </div>
        </>
      )}
      
      {node.componentType === COMPONENT_TYPES.TEXTAREA && (
        <div>
          <label className="input-label">行数</label>
          <input
            type="number"
            className="input-field"
            value={props.rows || 4}
            onChange={(e) => handleChange('rows', parseInt(e.target.value, 10))}
            min={2}
            max={20}
          />
        </div>
      )}
      
      {showOptions && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="input-label mb-0">选项配置</label>
            <button
              type="button"
              className="text-xs btn-primary px-2 py-1"
              onClick={handleAddOption}
            >
              添加选项
            </button>
          </div>
          
          <div className="space-y-2">
            {props.options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  placeholder="选项标签"
                />
                <input
                  type="text"
                  className="input-field flex-1 font-mono text-sm"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  placeholder="选项值"
                />
                <button
                  type="button"
                  className="btn-danger px-2"
                  onClick={() => handleRemoveOption(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyPanel = () => {
  const { selectedNodeId, getSelectedNode } = useFormStore();
  const selectedNode = getSelectedNode();
  
  if (!selectedNodeId || !selectedNode) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-dark-200">
        <div className="px-4 py-3 border-b border-dark-200">
          <h2 className="font-semibold text-dark-800">属性编辑器</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-dark-400 p-6 text-center">
          <div>
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <p className="text-sm">请选中画布中的组件或容器</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-white border-l border-dark-200">
      <div className="px-4 py-3 border-b border-dark-200">
        <h2 className="font-semibold text-dark-800">属性编辑器</h2>
        <p className="text-xs text-dark-500 mt-1">
          {selectedNode.type === 'container' ? '容器属性' : '组件属性'}
        </p>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        {selectedNode.type === 'container' ? (
          <ContainerPropsForm node={selectedNode} />
        ) : (
          <ComponentPropsForm node={selectedNode} />
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
