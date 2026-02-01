/**
 * 本地存储工具函数
 * 封装localStorage操作,支持JSON序列化/反序列化
 */

const STORAGE_PREFIX = 'form_designer_';

/**
 * 保存数据到localStorage
 * @param {string} key - 存储键名
 * @param {any} value - 存储值
 * @returns {boolean} 是否保存成功
 */
export const setStorage = (key, value) => {
  try {
    const fullKey = STORAGE_PREFIX + key;
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(fullKey, serializedValue);
    return true;
  } catch (error) {
    console.error('保存到localStorage失败:', error);
    return false;
  }
};

/**
 * 从localStorage读取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 读取的值或默认值
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const fullKey = STORAGE_PREFIX + key;
    const serializedValue = localStorage.getItem(fullKey);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('从localStorage读取失败:', error);
    return defaultValue;
  }
};

/**
 * 从localStorage删除数据
 * @param {string} key - 存储键名
 * @returns {boolean} 是否删除成功
 */
export const removeStorage = (key) => {
  try {
    const fullKey = STORAGE_PREFIX + key;
    localStorage.removeItem(fullKey);
    return true;
  } catch (error) {
    console.error('从localStorage删除失败:', error);
    return false;
  }
};

/**
 * 清空所有相关存储
 * @returns {boolean} 是否清空成功
 */
export const clearStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('清空localStorage失败:', error);
    return false;
  }
};

/**
 * 检查存储是否可用
 * @returns {boolean} 是否可用
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
