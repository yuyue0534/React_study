/**
 * 表单状态管理 Store
 * 使用Zustand管理表单结构、组件配置等状态
 */

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  generateId,
  generateFieldId,
  findNodeById,
  deleteNode,
  addNode,
  moveNode,
  updateNodeProps,
} from '../utils/formUtils';
import { getStorage, setStorage } from '../utils/storageUtils';

const STORAGE_KEY = 'form_schema';

// 初始表单结构
const createInitialFormSchema = () => ({
  id: generateId('form'),
  name: '未命名表单',
  version: '1.0.0',
  createTime: Date.now(),
  updateTime: Date.now(),
  components: [],
});

// 从localStorage加载表单
const loadFormFromStorage = () => {
  const saved = getStorage(STORAGE_KEY);
  return saved || createInitialFormSchema();
};

export const useFormStore = create((set, get) => ({
  // 表单基本信息
  formSchema: loadFormFromStorage(),
  
  // 当前选中的节点ID
  selectedNodeId: null,
  
  // 编辑模式: 'design' | 'preview'
  mode: 'design',
  
  /**
   * 设置表单名称
   */
  setFormName: (name) => {
    set((state) => {
      const newSchema = {
        ...state.formSchema,
        name,
        updateTime: Date.now(),
      };
      setStorage(STORAGE_KEY, newSchema);
      return { formSchema: newSchema };
    });
  },
  
  /**
   * 添加组件/容器
   */
  addComponent: (componentType, isContainer, parentId = null, index = -1) => {
    const id = generateId(isContainer ? 'container' : 'comp');
    const fieldId = isContainer ? undefined : generateFieldId(componentType);
    
    const newNode = {
      id,
      type: isContainer ? 'container' : 'component',
      componentType,
      props: {
        fieldId,
      },
      children: isContainer ? [] : undefined,
      parentId,
    };
    
    set((state) => {
      const newComponents = addNode(
        state.formSchema.components,
        newNode,
        parentId,
        index
      );
      
      const newSchema = {
        ...state.formSchema,
        components: newComponents,
        updateTime: Date.now(),
      };
      
      setStorage(STORAGE_KEY, newSchema);
      
      return {
        formSchema: newSchema,
        selectedNodeId: id,
      };
    });
    
    return id;
  },
  
  /**
   * 删除组件/容器
   */
  deleteComponent: (nodeId) => {
    set((state) => {
      const newComponents = deleteNode(state.formSchema.components, nodeId);
      
      const newSchema = {
        ...state.formSchema,
        components: newComponents,
        updateTime: Date.now(),
      };
      
      setStorage(STORAGE_KEY, newSchema);
      
      return {
        formSchema: newSchema,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    });
  },
  
  /**
   * 移动组件/容器
   */
  moveComponent: (nodeId, targetParentId, targetIndex) => {
    set((state) => {
      const newComponents = moveNode(
        state.formSchema.components,
        nodeId,
        targetParentId,
        targetIndex
      );
      
      const newSchema = {
        ...state.formSchema,
        components: newComponents,
        updateTime: Date.now(),
      };
      
      setStorage(STORAGE_KEY, newSchema);
      
      return { formSchema: newSchema };
    });
  },
  
  /**
   * 更新组件属性
   */
  updateComponentProps: (nodeId, newProps) => {
    set((state) => {
      const newComponents = updateNodeProps(
        state.formSchema.components,
        nodeId,
        newProps
      );
      
      const newSchema = {
        ...state.formSchema,
        components: newComponents,
        updateTime: Date.now(),
      };
      
      setStorage(STORAGE_KEY, newSchema);
      
      return { formSchema: newSchema };
    });
  },
  
  /**
   * 选中节点
   */
  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },
  
  /**
   * 取消选中
   */
  unselectNode: () => {
    set({ selectedNodeId: null });
  },
  
  /**
   * 获取选中的节点
   */
  getSelectedNode: () => {
    const { formSchema, selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return findNodeById(formSchema.components, selectedNodeId);
  },
  
  /**
   * 切换模式
   */
  setMode: (mode) => {
    set({ mode });
    if (mode === 'preview') {
      set({ selectedNodeId: null });
    }
  },
  
  /**
   * 保存表单
   */
  saveForm: () => {
    const { formSchema } = get();
    setStorage(STORAGE_KEY, formSchema);
    return true;
  },
  
  /**
   * 加载表单Schema
   */
  loadFormSchema: (schema) => {
    set({
      formSchema: {
        ...schema,
        updateTime: Date.now(),
      },
      selectedNodeId: null,
    });
    
    const { formSchema } = get();
    setStorage(STORAGE_KEY, formSchema);
  },
  
  /**
   * 重置表单
   */
  resetForm: () => {
    const newSchema = createInitialFormSchema();
    set({
      formSchema: newSchema,
      selectedNodeId: null,
    });
    setStorage(STORAGE_KEY, newSchema);
  },
  
  /**
   * 获取表单Schema(用于导出)
   */
  getFormSchema: () => {
    return get().formSchema;
  },
}));
