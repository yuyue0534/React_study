import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

// 模拟登录接口 (实际应在 api/auth.js)
const mockLoginApi = async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-jwt-token-123',
        user: {
          id: 1,
          name: 'Admin User',
          role: credentials.username === 'admin' ? 'admin' : 'sales',
          avatar: 'https://ui-avatars.com/api/?name=Admin',
          department: 'IT Dept'
        }
      });
    }, 800);
  });
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (credentials) => {
        try {
          const data = await mockLoginApi(credentials);
          Cookies.set('access_token', data.token, { expires: 7 }); // 7天过期
          set({ user: data.user, token: data.token, isAuthenticated: true });
          return true;
        } catch (error) {
          return false;
        }
      },
      logout: () => {
        Cookies.remove('access_token');
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user }), // 只持久化用户信息
    }
  )
);

export default useAuthStore;