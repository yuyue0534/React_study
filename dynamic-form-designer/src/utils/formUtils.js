/**
 * 表单处理工具函数
 * 提供表单结构操作、组件查找、ID生成等功能
 */

import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';

/**
 * 生成唯一ID
 * @param {string} prefix - ID前缀
 * @returns {string} 唯一ID
 */
export const generateId = (prefix = 'node') => {
  return `${prefix}_${nanoid(8)}`;
};

/**
 * 生成字段ID
 * @param {string} componentType - 组件类型
 * @returns {string} 字段ID
 */
export const generateFieldId = (componentType) => {
  return `${componentType}_${nanoid(6)}`;
};

/**
 * 在组件树中查找节点
 * @param {Array} components - 组件树
 * @param {string} nodeId - 节点ID
 * @returns {Object|null} 找到的节点或null
 */
export const findNodeById = (components, nodeId) => {
  for (const component of components) {
    if (component.id === nodeId) {
      return component;
    }
    if (component.children && component.children.length > 0) {
      const found = findNodeById(component.children, nodeId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 在组件树中查找节点的父节点
 * @param {Array} components - 组件树
 * @param {string} nodeId - 节点ID
 * @param {Object|null} parent - 父节点
 * @returns {Object|null} 找到的父节点或null
 */
export const findParentNode = (components, nodeId, parent = null) => {
  for (const component of components) {
    if (component.id === nodeId) {
      return parent;
    }
    if (component.children && component.children.length > 0) {
      const found = findParentNode(component.children, nodeId, component);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 删除节点
 * @param {Array} components - 组件树
 * @param {string} nodeId - 要删除的节点ID
 * @returns {Array} 删除后的组件树
 */
export const deleteNode = (components, nodeId) => {
  const newComponents = cloneDeep(components);
  
  const removeNode = (nodes, id) => {
    const index = nodes.findIndex((node) => node.id === id);
    if (index !== -1) {
      nodes.splice(index, 1);
      return true;
    }
    
    for (const node of nodes) {
      if (node.children) {
        if (removeNode(node.children, id)) {
          return true;
        }
      }
    }
    return false;
  };
  
  removeNode(newComponents, nodeId);
  return newComponents;
};

/**
 * 添加节点到指定位置
 * @param {Array} components - 组件树
 * @param {Object} newNode - 新节点
 * @param {string|null} parentId - 父节点ID,null表示添加到根
 * @param {number} index - 插入位置索引
 * @returns {Array} 添加后的组件树
 */
export const addNode = (components, newNode, parentId = null, index = -1) => {
  const newComponents = cloneDeep(components);
  
  if (parentId === null) {
    // 添加到根节点
    if (index === -1 || index >= newComponents.length) {
      newComponents.push(newNode);
    } else {
      newComponents.splice(index, 0, newNode);
    }
  } else {
    // 添加到指定父节点
    const addToParent = (nodes) => {
      for (const node of nodes) {
        if (node.id === parentId) {
          if (!node.children) {
            node.children = [];
          }
          if (index === -1 || index >= node.children.length) {
            node.children.push(newNode);
          } else {
            node.children.splice(index, 0, newNode);
          }
          return true;
        }
        if (node.children && addToParent(node.children)) {
          return true;
        }
      }
      return false;
    };
    addToParent(newComponents);
  }
  
  return newComponents;
};

/**
 * 移动节点
 * @param {Array} components - 组件树
 * @param {string} nodeId - 要移动的节点ID
 * @param {string|null} targetParentId - 目标父节点ID
 * @param {number} targetIndex - 目标位置索引
 * @returns {Array} 移动后的组件树
 */
export const moveNode = (components, nodeId, targetParentId, targetIndex) => {
  const node = findNodeById(components, nodeId);
  if (!node) return components;
  
  const clonedNode = cloneDeep(node);
  let newComponents = deleteNode(components, nodeId);
  newComponents = addNode(newComponents, clonedNode, targetParentId, targetIndex);
  
  return newComponents;
};

/**
 * 更新节点属性
 * @param {Array} components - 组件树
 * @param {string} nodeId - 节点ID
 * @param {Object} newProps - 新属性
 * @returns {Array} 更新后的组件树
 */
export const updateNodeProps = (components, nodeId, newProps) => {
  const newComponents = cloneDeep(components);
  
  const updateProps = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.props = { ...node.props, ...newProps };
        return true;
      }
      if (node.children && updateProps(node.children)) {
        return true;
      }
    }
    return false;
  };
  
  updateProps(newComponents);
  return newComponents;
};

/**
 * 扁平化组件树(用于表单提交)
 * @param {Array} components - 组件树
 * @returns {Object} 扁平化的表单数据
 */
export const flattenFormData = (components) => {
  const formData = {};
  
  const traverse = (nodes) => {
    nodes.forEach((node) => {
      if (node.type === 'component' && node.props.fieldId) {
        formData[node.props.fieldId] = node.props.defaultValue || '';
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  
  traverse(components);
  return formData;
};

/**
 * 验证表单结构
 * @param {Object} schema - 表单结构
 * @returns {Object} 验证结果 {valid: boolean, errors: Array}
 */
export const validateFormSchema = (schema) => {
  const errors = [];
  
  if (!schema || typeof schema !== 'object') {
    errors.push('表单结构必须是一个对象');
    return { valid: false, errors };
  }
  
  if (!schema.id || !schema.name) {
    errors.push('表单结构缺少必要字段: id或name');
  }
  
  if (!Array.isArray(schema.components)) {
    errors.push('表单结构的components字段必须是数组');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
