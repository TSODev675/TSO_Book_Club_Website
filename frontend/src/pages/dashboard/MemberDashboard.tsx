import { useEffect, useState } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

export default function MemberDashboard() {
  const { profile, loading } = useProfile()
  const [meetings, setMeetings] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [reflections, setReflections] = useState<any[]>([])

  useEffect(() => {
    api.get('/meetings/upcoming/').then((r) => setMeetings(r.data.slice(0, 3)))
    api.get('/books/').then((r) => setBooks(r.data.slice(0, 1)))
    api.get('/reflections/').then((r) => setReflections(r.data.slice(0, 5)))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>

  const firstName = profile?.user.first_name || profile?.user.username

  return (
    <DashboardLayout username={profile?.user.username} isAdmin={false}>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Good day, {firstName} 👋</h1>
        <p className="text-sm text-gray-400 mt-1">Here's what's happening in the book club.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 col-span-1">
          <p className="text-xs text-gray-400 mb-1">Member since</p>
          <p className="text-lg font-medium text-gray-900">{profile?.joined_date}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 col-span-1">
          <p className="text-xs text-gray-400 mb-1">Upcoming meetings</p>
          <p className="text-lg font-medium text-gray-900">{meetings.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 col-span-1">
          <p className="text-xs text-gray-400 mb-1">My reflections</p>
          <p className="text-lg font-medium text-gray-900">{reflections.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming meetings */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Upcoming meetings</h2>
          {meetings.length === 0 ? (
            <p className="text-xs text-gray-400">No upcoming meetings scheduled.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {meetings.map((m: any) => (
                <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base" style={{ background: 'var(--csir-blue-bg)' }}>
                    📅
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.book?.title}</p>
                    <p className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}</p>
                    {m.teams_link && (
                      <a href={m.teams_link} target="_blank" rel="noreferrer" className="text-xs mt-0.5 inline-block" style={{ color: 'var(--csir-navy)' }}>
                        Join on Teams →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current book */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Current read</h2>
          {books.length === 0 ? (
            <p className="text-xs text-gray-400">No book currently selected.</p>
          ) : (
            <div className="flex gap-4">
              <div className="w-16 h-20 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: 'var(--csir-blue-bg)' }}>
                📚
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{books[0].title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{books[0].author}</p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">{books[0].description}</p>
              </div>
            </div>
          )}
        </div>

        {/* My reflections */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:col-span-2">
          <h2 className="text-sm font-medium text-gray-900 mb-4">My reflections</h2>
          {reflections.length === 0 ? (
            <p className="text-xs text-gray-400">You haven't posted any reflections yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {reflections.map((r: any) => (
                <div key={r.id} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <p className="text-sm text-gray-700 leading-relaxed">{r.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}