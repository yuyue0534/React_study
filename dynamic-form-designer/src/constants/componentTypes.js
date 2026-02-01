/**
 * 组件类型常量定义
 * 包含容器组件和基础组件的类型枚举
 */

// 容器组件类型
export const CONTAINER_TYPES = {
  ROW: 'row',
  COLUMN: 'column',
  GROUP: 'group',
};

// 基础组件类型
export const COMPONENT_TYPES = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  DATE: 'date',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  BUTTON: 'button',
  LABEL: 'label',
};

// 所有组件类型
export const ALL_TYPES = {
  ...CONTAINER_TYPES,
  ...COMPONENT_TYPES,
};

// 容器组件配置
export const CONTAINER_CONFIGS = [
  {
    type: CONTAINER_TYPES.ROW,
    name: '行容器',
    icon: '━',
    description: '水平排列组件',
  },
  {
    type: CONTAINER_TYPES.COLUMN,
    name: '列容器',
    icon: '┃',
    description: '垂直排列组件',
  },
  {
    type: CONTAINER_TYPES.GROUP,
    name: '分组容器',
    icon: '▣',
    description: '可折叠的分组',
  },
];

// 基础组件配置
export const COMPONENT_CONFIGS = [
  {
    type: COMPONENT_TYPES.INPUT,
    name: '单行输入',
    icon: '⎯',
    description: '单行文本输入框',
  },
  {
    type: COMPONENT_TYPES.TEXTAREA,
    name: '多行输入',
    icon: '▭',
    description: '多行文本输入框',
  },
  {
    type: COMPONENT_TYPES.SELECT,
    name: '下拉选择',
    icon: '▼',
    description: '下拉选择框',
  },
  {
    type: COMPONENT_TYPES.DATE,
    name: '日期选择',
    icon: '📅',
    description: '日期选择器',
  },
  {
    type: COMPONENT_TYPES.CHECKBOX,
    name: '复选框',
    icon: '☑',
    description: '多选复选框',
  },
  {
    type: COMPONENT_TYPES.RADIO,
    name: '单选框',
    icon: '◉',
    description: '单选按钮组',
  },
  {
    type: COMPONENT_TYPES.BUTTON,
    name: '按钮',
    icon: '▢',
    description: '操作按钮',
  },
  {
    type: COMPONENT_TYPES.LABEL,
    name: '文本标签',
    icon: 'T',
    description: '静态文本',
  },
];

// 拖拽项类型
export const DRAG_ITEM_TYPES = {
  COMPONENT: 'component',
  CONTAINER: 'container',
};
