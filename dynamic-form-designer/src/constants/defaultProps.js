/**
 * 组件默认属性配置
 * 定义各类组件的初始属性值
 */

import { CONTAINER_TYPES, COMPONENT_TYPES } from './componentTypes';

// 容器组件默认属性
export const CONTAINER_DEFAULT_PROPS = {
  [CONTAINER_TYPES.ROW]: {
    name: '行容器',
    width: '100%',
    height: 'auto',
    padding: '16px',
    margin: '0',
    backgroundColor: 'transparent',
    borderStyle: '1px solid #e5e7eb',
    gap: '8px',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  [CONTAINER_TYPES.COLUMN]: {
    name: '列容器',
    width: '100%',
    height: 'auto',
    padding: '16px',
    margin: '0',
    backgroundColor: 'transparent',
    borderStyle: '1px solid #e5e7eb',
    gap: '8px',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  [CONTAINER_TYPES.GROUP]: {
    name: '分组容器',
    width: '100%',
    height: 'auto',
    padding: '16px',
    margin: '0',
    backgroundColor: '#f9fafb',
    borderStyle: '1px solid #d1d5db',
    collapsed: false,
    title: '分组标题',
  },
};

// 基础组件默认属性
export const COMPONENT_DEFAULT_PROPS = {
  [COMPONENT_TYPES.INPUT]: {
    name: '输入框',
    fieldId: '',
    label: '输入框标签',
    placeholder: '请输入内容',
    defaultValue: '',
    required: false,
    disabled: false,
    width: '100%',
    maxLength: 100,
  },
  [COMPONENT_TYPES.TEXTAREA]: {
    name: '多行输入框',
    fieldId: '',
    label: '多行输入框标签',
    placeholder: '请输入内容',
    defaultValue: '',
    required: false,
    disabled: false,
    width: '100%',
    rows: 4,
    maxLength: 500,
  },
  [COMPONENT_TYPES.SELECT]: {
    name: '下拉选择框',
    fieldId: '',
    label: '下拉选择框标签',
    placeholder: '请选择',
    defaultValue: '',
    required: false,
    disabled: false,
    width: '100%',
    options: [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
      { label: '选项3', value: 'option3' },
    ],
  },
  [COMPONENT_TYPES.DATE]: {
    name: '日期选择器',
    fieldId: '',
    label: '日期选择器标签',
    placeholder: '请选择日期',
    defaultValue: '',
    required: false,
    disabled: false,
    width: '100%',
    format: 'YYYY-MM-DD',
  },
  [COMPONENT_TYPES.CHECKBOX]: {
    name: '复选框',
    fieldId: '',
    label: '复选框标签',
    defaultValue: [],
    required: false,
    disabled: false,
    options: [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
      { label: '选项3', value: 'option3' },
    ],
  },
  [COMPONENT_TYPES.RADIO]: {
    name: '单选框组',
    fieldId: '',
    label: '单选框组标签',
    defaultValue: '',
    required: false,
    disabled: false,
    options: [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
      { label: '选项3', value: 'option3' },
    ],
  },
  [COMPONENT_TYPES.BUTTON]: {
    name: '按钮',
    label: '按钮文本',
    type: 'primary',
    disabled: false,
    width: 'auto',
  },
  [COMPONENT_TYPES.LABEL]: {
    name: '文本标签',
    label: '这是一段文本',
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#374151',
  },
};

// 获取组件默认属性
export const getDefaultProps = (componentType, isContainer = false) => {
  if (isContainer) {
    return { ...CONTAINER_DEFAULT_PROPS[componentType] };
  }
  return { ...COMPONENT_DEFAULT_PROPS[componentType] };
};
