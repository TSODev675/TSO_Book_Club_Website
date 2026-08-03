import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconBooks,
  IconCalendar,
  IconUsers,
  IconNotes,
  IconArrowRight,
  IconArchive,
} from '@tabler/icons-react'
import api from '../../../lib/api'
import DashboardLayout from '../../../components/DashboardLayout'
import { useProfile } from '../../../hooks/useProfile'

export default function AdminDashboard() {
  const { profile, loading } = useProfile()
  const [stats, setStats] = useState({ books: 0, meetings: 0, members: 0, reflections: 0, archives: 0 })
  const [meetings, setMeetings] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      api.get('/books/'),
      api.get('/meetings/upcoming/'),
      api.get('/profiles/'),
      api.get('/reflections/'),
      api.get('/archives/'),
    ]).then(([b, m, p, r, a]) => {
      setStats({
        books: b.data.length,
        meetings: m.data.length,
        members: p.data.length,
        reflections: r.data.length,
        archives: a.data.length,
      })
      setMeetings(m.data.slice(0, 4))
      setBooks(b.data.slice(0, 4))
      setMembers(p.data.slice(0, 5))
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  const statCards = [
    { label: 'Books', value: stats.books, icon: IconBooks, path: '/dashboard/manage-books' },
    { label: 'Upcoming Meetings', value: stats.meetings, icon: IconCalendar, path: '/dashboard/manage-meetings' },
    { label: 'Members', value: stats.members, icon: IconUsers, path: '/dashboard/members' },
    { label: 'Reflections', value: stats.reflections, icon: IconNotes, path: '/dashboard/reflections' },
    { label: 'Archived Sessions', value: stats.archives, icon: IconArchive, path: '/dashboard/archive' },
  ]

  const fullName = `${profile?.user.first_name || ''} ${profile?.user.last_name || ''}`.trim()

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={fullName}
      isAdmin
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Admin Overview
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Manage the TSO Book Club — members, books, and meetings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <Link
            key={s.label}
            to={s.path}
            className="rounded-xl border p-5 transition hover:shadow-md group"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: 'var(--csir-blue-bg)' }}
            >
              <s.icon size={18} strokeWidth={1.8} style={{ color: 'var(--csir-navy)' }} />
            </div>
            <p
              className="text-2xl font-bold mb-0.5"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
            >
              {s.value}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Upcoming meetings */}
        <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Upcoming Meetings
            </h2>
            <Link
              to="/dashboard/manage-meetings"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--csir-navy)' }}
            >
              Manage <IconArrowRight size={13} />
            </Link>
          </div>
          {meetings.length === 0 ? (
            <div className="py-8 text-center">
              <IconCalendar size={32} strokeWidth={1.5} className="mx-auto mb-2" style={{ color: 'var(--csir-blue-light)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No upcoming meetings.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {meetings.map((m: any) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--csir-blue-bg)' }}
                  >
                    <p className="text-xs font-bold leading-none" style={{ color: 'var(--csir-navy)' }}>
                      {new Date(m.date).getDate()}
                    </p>
                    <p className="text-xs uppercase leading-tight" style={{ color: 'var(--csir-navy)' }}>
                      {new Date(m.date).toLocaleDateString('en-ZA', { month: 'short' })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {m.book?.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(m.date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Books */}
        <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Book Library
            </h2>
            <Link
              to="/dashboard/manage-books"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--csir-navy)' }}
            >
              Manage <IconArrowRight size={13} />
            </Link>
          </div>
          {books.length === 0 ? (
            <div className="py-8 text-center">
              <IconBooks size={32} strokeWidth={1.5} className="mx-auto mb-2" style={{ color: 'var(--csir-blue-light)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No books added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {books.map((b: any) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--csir-blue-bg)' }}
                  >
                    <IconBooks size={16} strokeWidth={1.8} style={{ color: 'var(--csir-navy)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {b.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{b.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>Members</h2>
          <Link
            to="/dashboard/members"
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--csir-navy)' }}
          >
            View all <IconArrowRight size={13} />
          </Link>
        </div>
        {members.length === 0 ? (
          <div className="py-8 text-center">
            <IconUsers size={32} strokeWidth={1.5} className="mx-auto mb-2" style={{ color: 'var(--csir-blue-light)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No members yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
                  style={{ background: 'var(--csir-navy)' }}
                >
                  {(p.user.first_name || p.user.username)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {p.user.first_name
                      ? `${p.user.first_name} ${p.user.last_name}`
                      : p.user.username}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    @{p.user.username}
                  </p>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: p.role === 'admin' ? 'var(--csir-navy)' : 'var(--csir-blue-bg)',
                    color: p.role === 'admin' ? 'white' : 'var(--csir-navy)',
                  }}
                >
                  {p.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}