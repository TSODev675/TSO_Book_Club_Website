import { useEffect, useState, type SVGProps } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

const IconCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const IconVideo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="6" width="15" height="12" rx="2" />
    <path d="M18 8l4-2v12l-4-2" />
  </svg>
)

const IconUser = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
  </svg>
)

const IconClock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
)

export default function MeetingsPage() {
  const { profile, loading } = useProfile()
  const [meetings, setMeetings] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get('/meetings/upcoming/')
      .then((r) => setMeetings(r.data))
      .finally(() => setFetching(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={`${profile?.user.first_name} ${profile?.user.last_name}`.trim()}
      isAdmin={profile?.role === 'admin'}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Upcoming Meetings
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          All scheduled book club sessions.
        </p>
      </div>

      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <IconCalendar size={40} style={{ color: 'var(--csir-blue-light)' }} strokeWidth={1.5} className="mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No upcoming meetings</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Check back soon for scheduled sessions.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {meetings.map((m: any) => (
            <div
              key={m.id}
              className="rounded-xl border p-6 flex flex-col md:flex-row md:items-center gap-5"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              {/* Date badge */}
              <div
                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                style={{ background: 'var(--csir-blue-bg)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--csir-navy)' }}>
                  {new Date(m.date).toLocaleDateString('en-ZA', { month: 'short' })}
                </p>
                <p className="text-2xl font-bold leading-tight" style={{ color: 'var(--csir-navy)', fontFamily: 'var(--font-display)' }}>
                  {new Date(m.date).getDate()}
                </p>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  {m.book?.title}
                </p>
                {m.topic && (
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>{m.topic}</p>
                )}
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <IconClock size={13} strokeWidth={1.8} />
                    {new Date(m.date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.facilitator && (
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <IconUser size={13} strokeWidth={1.8} />
                      {m.facilitator.first_name || m.facilitator.username}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              {m.teams_link && (
                <a
                  href={m.teams_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 shrink-0"
                  style={{ background: 'var(--csir-navy)' }}
                >
                  <IconVideo size={16} strokeWidth={1.8} />
                  Join on Teams
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}