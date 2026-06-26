import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  Home, Calendar, Book, Archive, MessageCircle,
  User, FileText, LogOut, Users, BookMarked,
  CalendarPlus, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { logout } from '../lib/auth'

const memberLinks = [
  { label: 'Overview', path: '/dashboard', icon: Home, end: true },
  { label: 'Upcoming Meetings', path: '/dashboard/meetings', icon: Calendar },
  { label: 'Current Book', path: '/dashboard/books', icon: Book },
  { label: 'Archive', path: '/dashboard/archive', icon: Archive },
  { label: 'Reflections', path: '/dashboard/reflections', icon: FileText },
  { label: 'Messages', path: '/dashboard/messages', icon: MessageCircle },
  { label: 'My Profile', path: '/dashboard/profile', icon: User },
]

const adminLinks = [
  { label: 'Overview', path: '/dashboard/admin', icon: Home, end: true },
  { label: 'Upcoming Meetings', path: '/dashboard/meetings', icon: Calendar },
  { label: 'Current Book', path: '/dashboard/books', icon: Book },
  { label: 'Archive', path: '/dashboard/archive', icon: Archive },
  { label: 'Reflections', path: '/dashboard/reflections', icon: FileText },
  { label: 'Messages', path: '/dashboard/messages', icon: MessageCircle },
  { label: 'My Profile', path: '/dashboard/profile', icon: User },
  { label: 'Manage Books', path: '/dashboard/manage-books', icon: BookMarked },
  { label: 'Manage Meetings', path: '/dashboard/manage-meetings', icon: CalendarPlus },
  { label: 'Manage Members', path: '/dashboard/members', icon: Users },
]

interface Props {
  children: React.ReactNode
  isAdmin?: boolean
  username?: string
  fullName?: string
}

export default function DashboardLayout({ children, isAdmin, username, fullName }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const links = isAdmin ? adminLinks : memberLinks

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>

      {/* Sidebar */}
      <aside
        className="flex flex-col justify-between py-6 transition-all duration-300 relative"
        style={{
          background: 'var(--csir-navy)',
          width: collapsed ? '68px' : '240px',
          minHeight: '100vh',
          flexShrink: 0,
        }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 mb-6">
            <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-semibold" style={{ color: 'var(--csir-navy)' }}>C</span>
            </div>
            {!collapsed && (
              <div>
                <p className="text-white text-sm font-semibold leading-tight">TSO Book Club</p>
                <p className="text-white/40 text-xs">CSIR</p>
              </div>
            )}
          </div>

          {/* Section label */}
          {!collapsed && (
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-5 mb-2">
              {isAdmin ? 'Admin' : 'Member'}
            </p>
          )}

          {/* Nav links */}
          <nav className="flex flex-col gap-0.5 px-3">
            {links.map((link, i) => {
              // divider before admin-only links
              const isAdminSection = isAdmin && i === 7
              return (
                <div key={link.path}>
                  {isAdminSection && !collapsed && (
                    <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mt-4 mb-2">
                      Manage
                    </p>
                  )}
                  {isAdminSection && collapsed && (
                    <div className="border-t border-white/10 my-2 mx-3" />
                  )}
                  <NavLink
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                        isActive
                          ? 'bg-white/15 text-white font-medium'
                          : 'text-white/55 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    <link.icon size={18} strokeWidth={1.8} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{link.label}</span>}
                  </NavLink>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="px-3">
          {!collapsed && (
            <div className="px-3 mb-3 pb-3 border-b border-white/10">
              <p className="text-white text-sm font-medium truncate">{fullName || username}</p>
              <p className="text-white/40 text-xs truncate">{username}</p>
              {isAdmin && (
                <span
                  className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                >
                  Admin
                </span>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition text-white/50 hover:text-white hover:bg-white/10"
          >
            <LogOut size={18} strokeWidth={1.8} className="flex-shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full border flex items-center justify-center transition"
          style={{ background: 'var(--csir-navy)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
        >
          {collapsed
            ? <ChevronRight size={12} />
            : <ChevronLeft size={12} />
          }
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 h-14 border-b"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div />
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: 'var(--csir-navy)' }}
            >
              {(fullName || username || '?')[0].toUpperCase()}
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {fullName || username}
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}