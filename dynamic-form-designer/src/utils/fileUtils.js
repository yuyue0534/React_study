/**
 * 文件导入导出工具函数
 * 提供JSON文件的导出和导入功能
 */

/**
 * 导出JSON文件
 * @param {Object} data - 要导出的数据
 * @param {string} filename - 文件名(不含扩展名)
 * @returns {boolean} 是否导出成功
 */
export const exportJsonFile = (data, filename) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('导出JSON文件失败:', error);
    return false;
  }
};

/**
 * 导入JSON文件
 * @returns {Promise<Object>} 返回解析后的JSON对象
 */
export const importJsonFile = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        reject(new Error('未选择文件'));
        return;
      }
      
      if (!file.name.endsWith('.json')) {
        reject(new Error('文件格式错误,请选择JSON文件'));
        return;
      }
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        resolve(data);
      } catch (error) {
        reject(new Error('JSON文件解析失败,请检查文件格式'));
      }
    };
    
    input.click();
  });
};

/**
 * 生成导出文件名
 * @param {string} formName - 表单名称
 * @returns {string} 文件名
 */
export const generateExportFilename = (formName) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  const sanitizedFormName = formName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  
  return `${sanitizedFormName}_${year}${month}${day}_${hours}${minutes}`;
};

/**
 * 验证导入的JSON数据
 * @param {any} data - 导入的数据
 * @returns {Object} 验证结果 {valid: boolean, errors: Array}
 */
export const validateImportData = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('导入数据格式错误');
    return { valid: false, errors };
  }
  
  if (!data.id || typeof data.id !== 'string') {
    errors.push('缺少有效的表单ID');
  }
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('缺少有效的表单名称');
  }
  
  if (!Array.isArray(data.components)) {
    errors.push('表单组件数据格式错误');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
