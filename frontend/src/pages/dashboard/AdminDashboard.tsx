import { useEffect, useState } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

export default function AdminDashboard() {
  const { profile, loading } = useProfile()
  const [stats, setStats] = useState({ books: 0, meetings: 0, members: 0, reflections: 0 })
  const [meetings, setMeetings] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      api.get('/books/'),
      api.get('/meetings/upcoming/'),
      api.get('/profiles/'),
      api.get('/reflections/'),
    ]).then(([b, m, p, r]) => {
      setStats({ books: b.data.length, meetings: m.data.length, members: p.data.length, reflections: r.data.length })
      setMeetings(m.data.slice(0, 3))
      setBooks(b.data.slice(0, 3))
    })
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>

  return (
    <DashboardLayout username={profile?.user.username} isAdmin>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Admin dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Manage the TSO Book Club.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Books', value: stats.books, icon: '📚' },
          { label: 'Upcoming meetings', value: stats.meetings, icon: '📅' },
          { label: 'Members', value: stats.members, icon: '👥' },
          { label: 'Reflections', value: stats.reflections, icon: '💬' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xl mb-1">{s.icon}</p>
            <p className="text-2xl font-medium text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming meetings */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Upcoming meetings</h2>
            <a href="/dashboard/manage-meetings" className="text-xs" style={{ color: 'var(--csir-navy)' }}>Manage →</a>
          </div>
          {meetings.length === 0 ? (
            <p className="text-xs text-gray-400">No upcoming meetings.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {meetings.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--csir-blue-bg)' }}>
                    📅
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.book?.title}</p>
                    <p className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Books */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Book library</h2>
            <a href="/dashboard/manage-books" className="text-xs" style={{ color: 'var(--csir-navy)' }}>Manage →</a>
          </div>
          {books.length === 0 ? (
            <p className="text-xs text-gray-400">No books added yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {books.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base" style={{ background: 'var(--csir-blue-bg)' }}>
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.title}</p>
                    <p className="text-xs text-gray-400">{b.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}