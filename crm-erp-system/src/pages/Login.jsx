import { useAuthStore } from '../stores/auth.store'

export default function Login() {
  const login = useAuthStore(s => s.login)

  const handleLogin = () => {
    login('mock-token', { name: '管理员', role: 'SUPER_ADMIN' })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded w-96">
        <h1 className="text-xl font-bold mb-6">企业 CRM/ERP 登录</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-2 rounded"
        >
          登录（模拟）
        </button>
      </div>
    </div>
  )
}
