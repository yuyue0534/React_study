/**
 * App 应用根组件
 * 配置路由和全局UI组件
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Designer from './pages/Designer';
import Unauthorized from './pages/Unauthorized';
import Toast from './components/ui/Toast';
import Loading from './components/ui/Loading';
import Modal from './components/ui/Modal';
import { useUIStore } from './stores/uiStore';

// Modal容器组件
const ModalContainer = () => {
  const { modal, hideModal } = useUIStore();
  
  return (
    <Modal
      show={modal.show}
      title={modal.title}
      onConfirm={() => {
        modal.onConfirm?.();
        hideModal();
      }}
      onCancel={() => {
        modal.onCancel?.();
        hideModal();
      }}
    >
      {modal.content}
    </Modal>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* 路由 */}
      <Routes>
        <Route path="/" element={<Designer />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* 全局UI组件 */}
      <Toast />
      <Loading />
      <ModalContainer />
    </BrowserRouter>
  );
}

export default App;
