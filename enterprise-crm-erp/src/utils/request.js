import axios from 'axios';
import Cookies from 'js-cookie';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1', // 环境变量
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 假设后端标准返回结构: { code: 200, data: ..., message: '' }
    if (res.code !== 200) {
      // 处理特定业务错误
      if (res.code === 401) {
        // Token 失效
        Cookies.remove('access_token');
        window.location.href = '/login';
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data;
  },
  (error) => {
    const msg = error.response?.data?.message || '网络请求失败';
    console.error('API Error:', msg);
    // 这里可以触发全局 Toast 报错
    return Promise.reject(error);
  }
);

export default service;