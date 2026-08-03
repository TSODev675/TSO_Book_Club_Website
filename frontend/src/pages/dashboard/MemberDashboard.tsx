import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'
import AddToCalendar from '../../components/AddToCalendar'

const IconCalendar = ({ size = 20, style, strokeWidth = 1.8 }: { size?: number; style?: CSSProperties; strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const IconNotes = ({ size = 20, style, strokeWidth = 1.8 }: { size?: number; style?: CSSProperties; strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    <path d="M21 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10l6-6V6a2 2 0 0 0-2-2z" />
    <path d="M14 2v6h6" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
  </svg>
)

const IconArrowRight = ({ size = 20, style, strokeWidth = 1.8 }: { size?: number; style?: CSSProperties; strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
)

const IconVideo = ({ size = 20, style, strokeWidth = 1.8 }: { size?: number; style?: CSSProperties; strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    <rect x="3" y="6" width="15" height="12" rx="2" ry="2" />
    <path d="M16 10l6-4v12l-6-4" />
  </svg>
)

export default function MemberDashboard() {
  const { profile, loading } = useProfile()
  const [meetings, setMeetings] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [reflections, setReflections] = useState<any[]>([])

  useEffect(() => {
    api.get('/meetings/upcoming/').then((r) => setMeetings(r.data.slice(0, 3)))
    api.get('/books/').then((r) => setBooks(r.data.slice(0, 1)))
    api.get('/reflections/').then((r) => setReflections(r.data.slice(0, 3)))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  const firstName = profile?.user.first_name || profile?.user.username

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={`${profile?.user.first_name} ${profile?.user.last_name}`.trim()}
      isAdmin={false}
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Good day, {firstName}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Here's what's happening in the TSO Book Club.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Member since', value: profile?.joined_date, icon: IconCalendar },
          { label: 'Upcoming meetings', value: meetings.length, icon: IconCalendar },
          { label: 'My reflections', value: reflections.length, icon: IconNotes },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-5 border flex items-center gap-4" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--csir-blue-bg)' }}>
              <s.icon size={20} style={{ color: 'var(--csir-navy)' }} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
              <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Upcoming meetings */}
        <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>Upcoming Meetings</h2>
            <Link to="/dashboard/meetings" className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>
              View all <IconArrowRight size={13} />
            </Link>
          </div>
          {meetings.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No upcoming meetings scheduled.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {meetings.map((m: any) => (
                <div key={m.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--csir-blue-bg)' }}>
                    <IconCalendar size={18} style={{ color: 'var(--csir-navy)' }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{m.book?.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(m.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                    </p>
                    {m.teams_link && (
                      <a href={m.teams_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs mt-1 font-medium" style={{ color: 'var(--csir-navy)' }}>
                        <IconVideo size={12} /> Join on Teams
                      </a>
                    )}
                    <AddToCalendar
                      title={`TSO Book Club — ${m.book?.title}`}
                      date={m.date}
                      teamsLink={m.teams_link}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current book */}
        <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>Current Read</h2>
            <Link to="/dashboard/books" className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>
              View all <IconArrowRight size={13} />
            </Link>
          </div>
          {books.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No book currently selected.</p>
          ) : (
            <div className="flex gap-4">
              <div className="w-16 h-20 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl" style={{ background: 'var(--csir-blue-bg)' }}>
                📚
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>{books[0].title}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{books[0].author}</p>
                <p className="text-xs mt-2 leading-relaxed line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>{books[0].description}</p>
              </div>
            </div>
          )}
        </div>

        {/* My reflections */}
        <div className="rounded-xl border p-6 md:col-span-2" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>My Reflections</h2>
            <Link to="/dashboard/reflections" className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>
              View all <IconArrowRight size={13} />
            </Link>
          </div>
          {reflections.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>You haven't posted any reflections yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reflections.map((r: any) => (
                <div key={r.id} className="pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{r.content}</p>
                  <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}