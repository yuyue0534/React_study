export default function Header() {
  const user = {
    name: '管理员',
    role: '系统管理员'
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 左侧：页面标题 */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">仪表盘</h1>
          <p className="text-sm text-gray-500">欢迎回来，{user.name}</p>
        </div>

        {/* 右侧：用户信息 */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}