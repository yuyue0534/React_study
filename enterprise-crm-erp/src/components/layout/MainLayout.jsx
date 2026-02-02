import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, Package, Settings, LogOut, Menu } from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 mb-1 rounded-lg transition-colors group ${
        isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
  </NavLink>
);

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  
  // 菜单配置，实际可移动到 config/menus.js
  const menus = [
    { to: '/', icon: LayoutDashboard, label: '仪表盘', roles: ['admin', 'sales', 'stock'] },
    { to: '/customers', icon: Users, label: '客户管理', roles: ['admin', 'sales'] },
    { to: '/orders', icon: ShoppingCart, label: '销售订单', roles: ['admin', 'sales'] },
    { to: '/inventory', icon: Package, label: '库存管理', roles: ['admin', 'stock'] },
    { to: '/settings', icon: Settings, label: '系统设置', roles: ['admin'] },
  ];

  const filteredMenus = menus.filter(m => m.roles.includes(user?.role || 'admin'));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <span className={`text-xl font-bold text-primary-600 ${collapsed ? 'hidden' : 'block'}`}>
            Enterprise ERP
          </span>
          {collapsed && <span className="text-xl font-bold text-primary-600">E</span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
          {filteredMenus.map((menu) => (
            <SidebarItem key={menu.to} {...menu} collapsed={collapsed} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            {!collapsed && '安全退出'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">欢迎, <b>{user?.name}</b></span>
            <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto w-full">
            <React.Suspense fallback={<div className="p-4">Loading Module...</div>}>
              <Outlet />
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;