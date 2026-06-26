import { useEffect, useState } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

const IconMessage = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size ?? 24}
    height={props.size ?? 24}
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IconSend = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size ?? 24}
    height={props.size ?? 24}
    {...props}
  >
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
  </svg>
)

const IconX = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size ?? 24}
    height={props.size ?? 24}
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
)

const IconPlus = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size ?? 24}
    height={props.size ?? 24}
    {...props}
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)

const IconCheck = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size ?? 24}
    height={props.size ?? 24}
    {...props}
  >
    <path d="m20 6-11 11-5-5" />
  </svg>
)

const IconChecks = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.strokeWidth ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size ?? 24}
    height={props.size ?? 24}
    {...props}
  >
    <path d="m20 6-11 11-5-5" />
    <path d="m20 6-9 9-3-3" />
  </svg>
)

export default function MessagesPage() {
  const { profile, loading } = useProfile()
  const [messages, setMessages] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ recipient_id: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox')

  useEffect(() => {
    Promise.all([
      api.get('/messages/inbox/'),
      api.get('/users/'),
    ]).then(([m, u]) => {
      setMessages(m.data)
      setUsers(u.data)
    }).finally(() => setFetching(false))
  }, [])

  const handleTabChange = async (tab: 'inbox' | 'sent') => {
    setActiveTab(tab)
    setFetching(true)
    try {
      if (tab === 'inbox') {
        const res = await api.get('/messages/inbox/')
        setMessages(res.data)
      } else {
        const res = await api.get('/messages/')
        setMessages(res.data.filter((m: any) => m.sender.username === profile?.user.username))
      }
    } finally {
      setFetching(false)
    }
  }

  const handleMarkRead = async (id: number) => {
    try {
      await api.patch(`/messages/${id}/read/`)
      setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m))
    } catch {
      console.error('Failed to mark as read')
    }
  }

  const handleSubmit = async () => {
    if (!form.recipient_id || !form.content) {
      setError('Please select a recipient and write a message.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/messages/', {
        recipient_id: parseInt(form.recipient_id),
        content: form.content,
      })
      setForm({ recipient_id: '', content: '' })
      setShowForm(false)
      setSuccess('Message sent successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  const unreadCount = messages.filter((m) => !m.is_read && activeTab === 'inbox').length

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
            Messages
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'Your inbox and sent messages.'}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError('') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--csir-navy)' }}
        >
          {showForm ? <IconX size={16} strokeWidth={1.8} /> : <IconPlus size={16} strokeWidth={1.8} />}
          {showForm ? 'Cancel' : 'New message'}
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <IconCheck size={16} strokeWidth={2} />
          {success}
        </div>
      )}

      {/* Compose form */}
      {showForm && (
        <div className="rounded-xl border p-6 mb-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            New message
          </h2>

          {error && (
            <div className="px-4 py-3 rounded-lg mb-4 text-xs" style={{ background: '#FCEBEB', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              To
            </label>
            <select
            value={form.recipient_id}
            onChange={(e) => setForm({ ...form, recipient_id: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
            >
            <option value="">Select a recipient...</option>
            {users
                .filter((u) => {
                    if (profile?.role === 'admin') {
                        return u.username !== profile?.user.username
                    } else {
                        return u.role === 'admin'
                    }
                })
                .map((u: any) => (
                <option key={u.id} value={u.id}>
                    {u.first_name ? `${u.first_name} ${u.last_name}` : u.username}
                </option>
                ))}
            </select>
          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Message
            </label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your message..."
              className="w-full px-4 py-3 text-sm border rounded-lg outline-none resize-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--csir-navy)' }}
          >
            <IconSend size={15} strokeWidth={1.8} />
            {submitting ? 'Sending...' : 'Send message'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ background: 'var(--color-border)' }}>
        {(['inbox', 'sent'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className="px-5 py-2 rounded-md text-sm font-medium transition capitalize"
            style={{
              background: activeTab === tab ? 'var(--color-surface)' : 'transparent',
              color: activeTab === tab ? 'var(--csir-navy)' : 'var(--color-text-muted)',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab}
            {tab === 'inbox' && unreadCount > 0 && (
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full text-white"
                style={{ background: 'var(--csir-navy)' }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages list */}
      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <IconMessage size={40} style={{ color: 'var(--csir-blue-light)' }} strokeWidth={1.5} className="mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {activeTab === 'inbox' ? 'Your inbox is empty' : 'No sent messages'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {activeTab === 'inbox' ? 'Messages from other members will appear here.' : 'Messages you send will appear here.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m: any) => (
            <div
              key={m.id}
              className="rounded-xl border p-5 transition"
              style={{
                background: 'var(--color-surface)',
                borderColor: !m.is_read && activeTab === 'inbox' ? 'var(--csir-navy)' : 'var(--color-border)',
                borderLeftWidth: !m.is_read && activeTab === 'inbox' ? '3px' : '1px',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
                    style={{ background: 'var(--csir-navy)' }}
                  >
                    {activeTab === 'inbox'
                      ? (m.sender.first_name || m.sender.username)[0].toUpperCase()
                      : (m.recipient.first_name || m.recipient.username)[0].toUpperCase()
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {activeTab === 'inbox'
                          ? m.sender.first_name ? `${m.sender.first_name} ${m.sender.last_name}` : m.sender.username
                          : `To: ${m.recipient.first_name ? `${m.recipient.first_name} ${m.recipient.last_name}` : m.recipient.username}`
                        }
                      </p>
                      {!m.is_read && activeTab === 'inbox' && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
                        >
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {m.content}
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(m.created_at).toLocaleDateString('en-ZA', { dateStyle: 'medium' })} ·{' '}
                      {new Date(m.created_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Mark read */}
                {!m.is_read && activeTab === 'inbox' && (
                  <button
                    onClick={() => handleMarkRead(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80 flex-shrink-0"
                    style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
                    title="Mark as read"
                  >
                    <IconChecks size={14} strokeWidth={1.8} />
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}