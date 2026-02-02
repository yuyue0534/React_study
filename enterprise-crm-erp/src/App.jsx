import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from '@/stores/useAuthStore';

// 懒加载页面
const Login = React.lazy(() => import('@/pages/auth/Login'));
const MainLayout = React.lazy(() => import('@/components/layout/MainLayout'));
const Dashboard = React.lazy(() => import('@/pages/dashboard/Dashboard'));
const CustomerList = React.lazy(() => import('@/pages/crm/CustomerList'));

// React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 鉴权路由包装器
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">系统加载中...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<CustomerList />} />
              {/* 其他路由: Sales, Inventory, Settings */}
              <Route path="*" element={<div className="p-10 text-center">404 - 页面未找到或正在开发中</div>} />
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;