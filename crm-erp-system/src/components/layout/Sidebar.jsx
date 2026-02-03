import { NavLink } from 'react-router-dom'

const menus = [
  { path: '/', label: '📊 仪表盘', end: true },
  { path: '/customers', label: '👥 客户管理' },
  { path: '/sales', label: '🧾 销售管理' },
  { path: '/inventory', label: '📦 库存管理' },
  { path: '/fileConverter', label: '📦 文件转换' }
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-white p-4">
      <h2 className="font-bold text-lg mb-6">CRM / ERP</h2>

      <ul className="space-y-2">
        {menus.map(m => (
          <li key={m.path}>
            <NavLink
              to={m.path}
              end={m.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded transition
                 ${isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
              }
            >
              {m.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
