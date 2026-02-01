/**
 * Unauthorized 权限不足页面
 * 当用户无权访问时显示
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-hard p-8 text-center">
        <div className="w-20 h-20 bg-error bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-dark-800 mb-2">
          权限不足
        </h1>
        
        <p className="text-dark-600 mb-6">
          抱歉,您当前的角色无权访问此页面。
          <br />
          请联系管理员获取相应权限。
        </p>
        
        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
