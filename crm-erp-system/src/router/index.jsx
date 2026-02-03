// src/router/index.jsx
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Sales from '../pages/Sales'
import Inventory from '../pages/Inventory'
import FileConverter from '../pages/FileConverter'
import MainLayout from '../components/layout/MainLayout'
import { useAuthStore } from '../stores/auth.store'

const RequireAuth = ({ children }) => {
  const token = useAuthStore(s => s.token)
  if (!token) {
    window.location.href = '/login'
    return null
  }
  return children
}

export default [
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'customers', element: <Customers /> },
      { path: 'sales', element: <Sales /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'fileConverter', element: <FileConverter /> }
    ]
  }
]
