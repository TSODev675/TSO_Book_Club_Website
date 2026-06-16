import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../lib/auth'

const memberLinks = [
  { label: 'Overview', path: '/dashboard', icon: '🏠' },
  { label: 'Meetings', path: '/dashboard/meetings', icon: '📅' },
  { label: 'Books', path: '/dashboard/books', icon: '📚' },
  { label: 'Reflections', path: '/dashboard/reflections', icon: '💬' },
]

const adminLinks = [
  ...memberLinks,
  { label: 'Manage members', path: '/dashboard/members', icon: '👥' },
  { label: 'Manage books', path: '/dashboard/manage-books', icon: '📖' },
  { label: 'Manage meetings', path: '/dashboard/manage-meetings', icon: '🗓️' },
]

interface Props {
  children: React.ReactNode
  isAdmin?: boolean
  username?: string
}

export default function DashboardLayout({ children, isAdmin, username }: Props) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const links = isAdmin ? adminLinks : memberLinks

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F7FA' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col justify-between py-6 px-4 transition-all duration-200"
        style={{
          background: 'var(--csir-navy)',
          width: sidebarOpen ? '220px' : '64px',
          minHeight: '100vh',
          flexShrink: 0,
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>C</span>
            </div>
            {sidebarOpen && <span className="text-white text-sm font-medium truncate">TSO Book Club</span>}
          </div>

          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition"
                  style={{
                    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <span className="text-base flex-shrink-0">{link.icon}</span>
                  {sidebarOpen && <span className="truncate">{link.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          {sidebarOpen && (
            <div className="px-3 mb-3">
              <p className="text-white/40 text-xs truncate">{username}</p>
              {isAdmin && (
                <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                  Admin
                </span>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <span className="flex-shrink-0">🚪</span>
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}