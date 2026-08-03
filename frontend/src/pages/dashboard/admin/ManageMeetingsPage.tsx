import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import DashboardLayout from '../../../components/DashboardLayout'
import { useProfile } from '../../../hooks/useProfile'

interface Meeting {
  id: number
  book: any
  date: string
  topic: string
  facilitator: any
  teams_link: string
  created_by: any
}

interface MeetingForm {
  book_id: string
  date: string
  topic: string
  facilitator_id: string
  teams_link: string
}

const emptyForm: MeetingForm = {
  book_id: '', date: '', topic: '', facilitator_id: '', teams_link: ''
}

export default function ManageMeetingsPage() {
  const { profile, loading } = useProfile()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [form, setForm] = useState<MeetingForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      api.get('/meetings/upcoming/'),
      api.get('/books/'),
      api.get('/profiles/'),
    ]).then(([m, b, p]) => {
      setMeetings(m.data)
      setBooks(b.data)
      setMembers(p.data)
    }).finally(() => setFetching(false))
  }, [])

  const openCreate = () => {
    setEditingMeeting(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  const openEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setForm({
      book_id: meeting.book?.id?.toString() || '',
      date: new Date(meeting.date).toISOString().slice(0, 16),
      topic: meeting.topic || '',
      facilitator_id: meeting.facilitator?.id?.toString() || '',
      teams_link: meeting.teams_link || '',
    })
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.book_id || !form.date) {
      setError('Book and date are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        book_id: parseInt(form.book_id),
        date: form.date,
        topic: form.topic,
        facilitator_id: form.facilitator_id ? parseInt(form.facilitator_id) : null,
        teams_link: form.teams_link || null,
      }
      if (editingMeeting) {
        const res = await api.patch(`/meetings/${editingMeeting.id}/`, payload)
        setMeetings(meetings.map((m) => m.id === editingMeeting.id ? res.data : m))
        setSuccess('Meeting updated successfully.')
      } else {
        const res = await api.post('/meetings/', payload)
        setMeetings([res.data, ...meetings])
        setSuccess('Meeting scheduled successfully.')
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingMeeting(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save meeting.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await api.delete(`/meetings/${id}/`)
      setMeetings(meetings.filter((m) => m.id !== id))
      setSuccess('Meeting deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete meeting.')
    } finally {
      setDeletingId(null)
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
      isAdmin
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Manage Meetings
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Schedule, edit, or cancel book club sessions.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--csir-navy)' }}
        >
          <span aria-hidden="true" className="text-lg">+</span>
          Schedule meeting
        </button>
      </div>

      {/* Success / error */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <span aria-hidden="true" className="text-base">✓</span> {success}
        </div>
      )}
      {error && !showForm && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#FCEBEB', color: '#991B1B' }}>
          <span aria-hidden="true" className="text-base">×</span> {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border p-6 mb-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {editingMeeting ? 'Edit meeting' : 'Schedule new meeting'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="p-1.5 rounded-lg transition hover:bg-gray-100"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span aria-hidden="true" className="text-base">×</span>
            </button>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg mb-4 text-xs" style={{ background: '#FCEBEB', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Book *
              </label>
              <select
                value={form.book_id}
                onChange={(e) => setForm({ ...form, book_id: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              >
                <option value="">Select a book...</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Facilitator
              </label>
              <select
                value={form.facilitator_id}
                onChange={(e) => setForm({ ...form, facilitator_id: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              >
                <option value="">Select a facilitator...</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.first_name ? `${m.user.first_name} ${m.user.last_name}` : m.user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Teams Link
              </label>
              <input
                type="url"
                value={form.teams_link}
                onChange={(e) => setForm({ ...form, teams_link: e.target.value })}
                placeholder="https://teams.microsoft.com/..."
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Topic / Discussion notes
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="What will be discussed?"
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition hover:bg-gray-100"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--csir-navy)' }}
            >
              <span aria-hidden="true" className="text-base">✓</span>
              {submitting ? 'Saving...' : editingMeeting ? 'Update meeting' : 'Schedule meeting'}
            </button>
          </div>
        </div>
      )}

      {/* Meetings list */}
      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="mx-auto mb-3 text-4xl" style={{ color: 'var(--csir-blue-light)' }}>📅</div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No meetings scheduled</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Click "Schedule meeting" to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {meetings.map((m) => (
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
                    <span aria-hidden="true">⏰</span>
                    {new Date(m.date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.facilitator && (
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span aria-hidden="true">👤</span>
                      {m.facilitator.first_name || m.facilitator.username}
                    </span>
                  )}
                  {m.teams_link && (
                    <a
                      href={m.teams_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: 'var(--csir-navy)' }}
                    >
                      <span aria-hidden="true">📹</span>
                      Teams link
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(m)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition"
                  style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
                >
                  <span aria-hidden="true">✏️</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  disabled={deletingId === m.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-red-100 disabled:opacity-40"
                  style={{ background: '#FCEBEB', color: '#991B1B' }}
                >
                  <span aria-hidden="true">🗑️</span>
                  {deletingId === m.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}