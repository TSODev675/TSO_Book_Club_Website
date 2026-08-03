import { useEffect, useState } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

type IconProps = {
  size?: number
  strokeWidth?: number
  className?: string
  style?: any
}

const IconArchive = ({ size = 16, className, style }: IconProps) => (
  <span className={className} style={{ display: 'inline-flex', fontSize: size, ...style }}>
    📦
  </span>
)

const IconCalendar = ({ size = 16, className, style }: IconProps) => (
  <span className={className} style={{ display: 'inline-flex', fontSize: size, ...style }}>
    🗓️
  </span>
)

const IconVideo = ({ size = 16, className, style }: IconProps) => (
  <span className={className} style={{ display: 'inline-flex', fontSize: size, ...style }}>
    ▶️
  </span>
)

const IconChevronDown = ({ size = 16, className, style }: IconProps) => (
  <span className={className} style={{ display: 'inline-flex', fontSize: size, ...style }}>
    ▼
  </span>
)

const IconChevronUp = ({ size = 16, className, style }: IconProps) => (
  <span className={className} style={{ display: 'inline-flex', fontSize: size, ...style }}>
    ▲
  </span>
)

const IconNotes = ({ size = 16, className, style }: IconProps) => (
  <span className={className} style={{ display: 'inline-flex', fontSize: size, ...style }}>
    📝
  </span>
)

export default function ArchivePage() {
  const { profile, loading } = useProfile()
  const [archives, setArchives] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    api.get('/archives/')
      .then((r) => setArchives(r.data))
      .finally(() => setFetching(false))
  }, [])

  const toggle = (id: number) => setExpanded(expanded === id ? null : id)

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
          Archive
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Past meetings, notes, and recorded sessions.
        </p>
      </div>

      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading archive...</p>
      ) : archives.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <IconArchive size={40} style={{ color: 'var(--csir-blue-light)' }} strokeWidth={1.5} className="mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No archived meetings yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Past meetings will appear here once archived.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {archives.map((a: any) => (
            <div
              key={a.id}
              className="rounded-xl border overflow-hidden"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              {/* Archive header */}
              <button
                onClick={() => toggle(a.id)}
                className="w-full flex items-center justify-between p-6 text-left transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                    style={{ background: 'var(--csir-blue-bg)' }}
                  >
                    <p className="text-xs font-semibold uppercase" style={{ color: 'var(--csir-navy)' }}>
                      {new Date(a.meeting.date).toLocaleDateString('en-ZA', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold leading-tight" style={{ color: 'var(--csir-navy)', fontFamily: 'var(--font-display)' }}>
                      {new Date(a.meeting.date).getDate()}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-base font-semibold"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                    >
                      {a.meeting.book?.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <IconCalendar size={12} strokeWidth={1.8} />
                        {new Date(a.meeting.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                      </span>
                      {a.reflections?.length > 0 && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          <IconNotes size={12} strokeWidth={1.8} />
                          {a.reflections.length} reflection{a.reflections.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {expanded === a.id
                  ? <IconChevronUp size={18} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
                  : <IconChevronDown size={18} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
                }
              </button>

              {/* Expanded content */}
              {expanded === a.id && (
                <div className="px-6 pb-6 border-t" style={{ borderColor: 'var(--color-border)' }}>

                  {/* Description */}
                  {a.description && (
                    <div className="mt-4 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Session Notes
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {a.description}
                      </p>
                    </div>
                  )}

                  {/* Video link */}
                  {a.video_link && (
                    <a
                      href={a.video_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white mb-4 transition hover:opacity-90"
                      style={{ background: 'var(--csir-navy)' }}
                    >
                      <IconVideo size={15} strokeWidth={1.8} />
                      Watch recording
                    </a>
                  )}

                  {/* Reflections */}
                  {a.reflections?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
                        Member Reflections
                      </p>
                      <div className="flex flex-col gap-3">
                        {a.reflections.map((r: any) => (
                          <div
                            key={r.id}
                            className="rounded-lg p-4 border-l-2"
                            style={{ background: 'var(--csir-blue-bg)', borderLeftColor: 'var(--csir-navy)' }}
                          >
                            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                              "{r.content}"
                            </p>
                            <p className="text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>
                              — {r.member?.first_name || r.member?.username}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}