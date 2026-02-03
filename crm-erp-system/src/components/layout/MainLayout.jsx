import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { routeMeta } from '../../router/routeMeta'

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [tabs, setTabs] = useState([])

  // 新路由 → 加 Tab
  useEffect(() => {
    const path = location.pathname
    if (!routeMeta[path]) return

    setTabs(prev => {
      if (prev.find(t => t.path === path)) return prev
      return [...prev, { path, title: routeMeta[path] }]
    })
  }, [location.pathname])

  const handleTabClick = path => {
    navigate(path)
  }

  const handleTabClose = path => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.path === path)
      const newTabs = prev.filter(t => t.path !== path)

      if (location.pathname === path) {
        const next = newTabs[idx - 1] || newTabs[0]
        next && navigate(next.path)
      }

      return newTabs
    })
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header
          tabs={tabs}
          activePath={location.pathname}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
        />
        <main className="p-6 bg-gray-50 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
