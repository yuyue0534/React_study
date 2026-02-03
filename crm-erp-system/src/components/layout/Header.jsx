import { useLocation, useNavigate } from 'react-router-dom'
import { routeMeta } from '../../router/routeMeta'

export default function Header({ tabs, activePath, onTabClick, onTabClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const user = {
    name: '管理员',
    role: '系统管理员'
  }

  const breadcrumb = location.pathname
    .split('/')
    .filter(Boolean)
    .reduce((acc, cur, idx, arr) => {
      const path = '/' + arr.slice(0, idx + 1).join('/')
      acc.push({ path, title: routeMeta[path] })
      return acc
    }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      {/* 顶部信息 */}
      <div className="flex items-center justify-between h-16 px-6">
        {/* 左侧 */}
        <div>
          {/* 面包屑 */}
          <div className="text-sm text-gray-500 mb-1">
            {breadcrumb.map((b, i) => (
              <span key={b.path}>
                {b.title}
                {i < breadcrumb.length - 1 && ' / '}
              </span>
            ))}
          </div>

          <h1 className="text-xl font-semibold text-gray-900">
            {routeMeta[location.pathname]}
          </h1>
        </div>

        {/* 右侧 */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>

          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            {user.name.charAt(0)}
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            退出
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-6 space-x-2 bg-gray-50 border-t">
        {tabs.map(tab => (
          <div
            key={tab.path}
            className={`flex items-center px-3 py-1 rounded-t cursor-pointer
              ${activePath === tab.path
                ? 'bg-white border border-b-0'
                : 'text-gray-500 hover:text-black'
              }`}
            onClick={() => onTabClick(tab.path)}
          >
            <span>{tab.title}</span>
            <span
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={e => {
                e.stopPropagation()
                onTabClose(tab.path)
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </header>
  )
}
