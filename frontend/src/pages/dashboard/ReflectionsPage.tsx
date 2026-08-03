import { useEffect, useState } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

type IconProps = {
  size?: number
  strokeWidth?: number
  style?: any
  className?: string
}

const IconNotes = ({ size = 24, strokeWidth = 2, style, className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <path d="M4 4h10l6 6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="12" y2="9" />
  </svg>
)

const IconPlus = ({ size = 24, strokeWidth = 2, style, className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconTrash = ({ size = 24, strokeWidth = 2, style, className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M9 6V4h6v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const IconX = ({ size = 24, strokeWidth = 2, style, className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconCheck = ({ size = 24, strokeWidth = 2, style, className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function ReflectionsPage() {
  const { profile, loading } = useProfile()
  const [reflections, setReflections] = useState<any[]>([])
  const [archives, setArchives] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ archive: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/reflections/'),
      api.get('/archives/'),
    ]).then(([r, a]) => {
      setReflections(r.data)
      setArchives(a.data)
    }).finally(() => setFetching(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.archive || !form.content) {
      setError('Please select a session and write your reflection.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/reflections/', {
        archive: parseInt(form.archive),
        content: form.content,
      })
      setReflections([res.data, ...reflections])
      setForm({ archive: '', content: '' })
      setShowForm(false)
      setSuccess('Reflection posted successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to post reflection. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/reflections/${id}/`)
      setReflections(reflections.filter((r) => r.id !== id))
    } catch {
      setError('Failed to delete reflection.')
    }
  }

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            My Reflections
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Your thoughts and insights from past sessions.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError('') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--csir-navy)' }}
        >
          {showForm ? <IconX size={16} strokeWidth={1.8} /> : <IconPlus size={16} strokeWidth={1.8} />}
          {showForm ? 'Cancel' : 'New reflection'}
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <IconCheck size={16} strokeWidth={2} />
          {success}
        </div>
      )}

      {/* New reflection form */}
      {showForm && (
        <div className="rounded-xl border p-6 mb-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Share a reflection
          </h2>

          {error && (
            <div className="px-4 py-3 rounded-lg mb-4 text-xs" style={{ background: '#FCEBEB', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Session
            </label>
            <select
              value={form.archive}
              onChange={(e) => setForm({ ...form, archive: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
            >
              <option value="">Select a past session...</option>
              {archives.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.meeting.book?.title} — {new Date(a.meeting.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Your reflection
            </label>
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="What stood out to you? What did you learn or question?"
              className="w-full px-4 py-3 text-sm border rounded-lg outline-none resize-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--csir-navy)' }}
          >
            {submitting ? 'Posting...' : 'Post reflection'}
          </button>
        </div>
      )}

      {/* Reflections list */}
      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading reflections...</p>
      ) : reflections.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <IconNotes size={40} style={{ color: 'var(--csir-blue-light)' }} strokeWidth={1.5} className="mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No reflections yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Share your thoughts on a past session.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reflections.map((r: any) => (
            <div
              key={r.id}
              className="rounded-xl border p-6"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Session tag */}
                  <span
                    className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3"
                    style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
                  >
                    {r.archive?.meeting?.book?.title || 'Session'}
                  </span>

                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {r.content}
                  </p>

                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-ZA', { dateStyle: 'long' })}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 rounded-lg transition hover:bg-red-50 shrink-0"
                  style={{ color: 'var(--color-text-muted)' }}
                  title="Delete reflection"
                >
                  <IconTrash size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}