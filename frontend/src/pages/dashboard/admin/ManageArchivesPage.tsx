import { useEffect, useState } from 'react'
import {
  Archive, Plus, Pencil, Trash2, X, Check,
  ChevronDown, ChevronUp, Video, Calendar
} from 'lucide-react'
import api from '../../../lib/api'
import DashboardLayout from '../../../components/DashboardLayout'
import { useProfile } from '../../../hooks/useProfile'

interface ArchiveForm {
  meeting_id: string
  description: string
  video_link: string
}

const emptyForm: ArchiveForm = { meeting_id: '', description: '', video_link: '' }

export default function ManageArchivesPage() {
  const { profile, loading } = useProfile()
  const [archives, setArchives] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArchive, setEditingArchive] = useState<any | null>(null)
  const [form, setForm] = useState<ArchiveForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      api.get('/archives/'),
      api.get('/meetings/upcoming/'),
    ]).then(([a, m]) => {
      setArchives(a.data)
      setMeetings(m.data)
    }).finally(() => setFetching(false))
  }, [])

  const openCreate = () => {
    setEditingArchive(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
    setExpanded(null)
  }

  const openEdit = (archive: any) => {
    setEditingArchive(archive)
    setForm({
      meeting_id: archive.meeting?.id?.toString() || '',
      description: archive.description || '',
      video_link: archive.video_link || '',
    })
    setError('')
    setShowForm(true)
    setExpanded(null)
  }

  const handleSubmit = async () => {
    if (!form.meeting_id || !form.description) {
      setError('Meeting and description are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        meeting_id: parseInt(form.meeting_id),
        description: form.description,
        video_link: form.video_link || null,
      }
      if (editingArchive) {
        const res = await api.patch(`/archives/${editingArchive.id}/`, payload)
        setArchives(archives.map((a) => a.id === editingArchive.id ? res.data : a))
        setSuccess('Archive updated successfully.')
      } else {
        const res = await api.post('/archives/', payload)
        setArchives([res.data, ...archives])
        setSuccess('Archive created successfully.')
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingArchive(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save archive.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await api.delete(`/archives/${id}/`)
      setArchives(archives.filter((a) => a.id !== id))
      setSuccess('Archive deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete archive.')
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
            Manage Archives
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Create and manage past meeting archives and session notes.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--csir-navy)' }}
        >
          <Plus size={16} strokeWidth={2} />
          New archive
        </button>
      </div>

      {/* Success / error */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <Check size={15} strokeWidth={2} /> {success}
        </div>
      )}
      {error && !showForm && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#FCEBEB', color: '#991B1B' }}>
          <X size={15} strokeWidth={2} /> {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border p-6 mb-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {editingArchive ? 'Edit archive' : 'Create new archive'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="p-1.5 rounded-lg transition hover:bg-gray-100"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={16} strokeWidth={2} />
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
                Meeting *
              </label>
              <select
                value={form.meeting_id}
                onChange={(e) => setForm({ ...form, meeting_id: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              >
                <option value="">Select a meeting...</option>
                {meetings.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.book?.title} — {new Date(m.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Recording link
              </label>
              <input
                type="url"
                value={form.video_link}
                onChange={(e) => setForm({ ...form, video_link: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Session notes *
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Summarise what was discussed in this session..."
                className="w-full px-4 py-3 text-sm border rounded-lg outline-none resize-none"
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
              <Check size={15} strokeWidth={2} />
              {submitting ? 'Saving...' : editingArchive ? 'Update archive' : 'Create archive'}
            </button>
          </div>
        </div>
      )}

      {/* Archives list */}
      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading archives...</p>
      ) : archives.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <Archive size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--csir-blue-light)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No archives yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Create an archive for a past meeting session.</p>
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
              <div className="flex items-center gap-4 p-5">
                {/* Date badge */}
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--csir-blue-bg)' }}
                >
                  <p className="text-xs font-semibold uppercase leading-none" style={{ color: 'var(--csir-navy)' }}>
                    {new Date(a.meeting?.date).toLocaleDateString('en-ZA', { month: 'short' })}
                  </p>
                  <p className="text-lg font-bold leading-tight" style={{ color: 'var(--csir-navy)', fontFamily: 'var(--font-display)' }}>
                    {new Date(a.meeting?.date).getDate()}
                  </p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                    {a.meeting?.book?.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <Calendar size={12} strokeWidth={1.8} />
                      {new Date(a.meeting?.date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                    </span>
                    {a.reflections?.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}>
                        {a.reflections.length} reflection{a.reflections.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {a.video_link && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--csir-navy)' }}>
                        <Video size={12} strokeWidth={1.8} />
                        Recording
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition"
                    style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
                  >
                    <Pencil size={13} strokeWidth={1.8} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-red-100 disabled:opacity-40"
                    style={{ background: '#FCEBEB', color: '#991B1B' }}
                  >
                    <Trash2 size={13} strokeWidth={1.8} />
                    {deletingId === a.id ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className="p-2 rounded-lg transition hover:bg-gray-100"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {expanded === a.id
                      ? <ChevronUp size={16} strokeWidth={1.8} />
                      : <ChevronDown size={16} strokeWidth={1.8} />
                    }
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expanded === a.id && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Session Notes
                    </p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      {a.description}
                    </p>

                    {a.video_link && (
                      <a
                        href={a.video_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white mb-4 transition hover:opacity-90"
                        style={{ background: 'var(--csir-navy)' }}
                      >
                        <Video size={14} strokeWidth={1.8} />
                        Watch recording
                      </a>
                    )}

                    {a.reflections?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
                          Member Reflections ({a.reflections.length})
                        </p>
                        <div className="flex flex-col gap-2">
                          {a.reflections.map((r: any) => (
                            <div
                              key={r.id}
                              className="rounded-lg p-4 border-l-2"
                              style={{ background: 'var(--csir-blue-bg)', borderLeftColor: 'var(--csir-navy)' }}
                            >
                              <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--color-text-secondary)' }}>
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}