import { useEffect, useState } from 'react'
// Small local icon components to avoid dependency on @tabler/icons-react
const Icon = ({ children, size = 16, style }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
)
const IconUser = (props: any) => (
  <Icon {...props}><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></Icon>
)
const IconMail = (props: any) => (
  <Icon {...props}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></Icon>
)
const IconCalendar = (props: any) => (
  <Icon {...props}><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></Icon>
)
const IconShield = (props: any) => (
  <Icon {...props}><path d="M12 3l7 4v5c0 5-3.8 9.7-7 10-3.2-.3-7-5-7-10V7l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/></Icon>
)
const IconEdit = (props: any) => (
  <Icon {...props}><path d="M3 21l3-1 11-11 1-3-3 1L4 20z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></Icon>
)
const IconCheck = (props: any) => (
  <Icon {...props}><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></Icon>
)
const IconX = (props: any) => (
  <Icon {...props}><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></Icon>
)
const IconLock = (props: any) => (
  <Icon {...props}><rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></Icon>
)
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

export default function ProfilePage() {
  const { profile, loading } = useProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.user.first_name || '',
        last_name: profile.user.last_name || '',
        email: profile.user.email || '',
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await api.patch(`/users/${profile?.user.id}/`, form)
      setEditing(false)
      setSuccess('Profile updated successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordForm.old_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setError('Please fill in all password fields.')
      return
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match.')
      return
    }
    if (passwordForm.new_password.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    setSavingPassword(true)
    setError('')
    try {
      await api.post('/auth/change-password/', {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      })
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' })
      setShowPasswordForm(false)
      setSuccess('Password changed successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  const fullName = `${profile?.user.first_name || ''} ${profile?.user.last_name || ''}`.trim() || profile?.user.username

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={fullName}
      isAdmin={profile?.role === 'admin'}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          My Profile
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Manage your account details and password.
        </p>
      </div>

      {/* Success / error */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <IconCheck size={16} strokeWidth={2} /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#FCEBEB', color: '#991B1B' }}>
          <IconX size={16} strokeWidth={2} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Avatar card */}
        <div className="rounded-xl border p-6 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white"
            style={{ background: 'var(--csir-navy)', fontFamily: 'var(--font-display)' }}
          >
            {(profile?.user.first_name || profile?.user.username || '?')[0].toUpperCase()}
          </div>
          <h2 className="text-lg font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            {fullName}
          </h2>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>@{profile?.user.username}</p>
          <span
            className="inline-block text-xs font-medium px-3 py-1 rounded-full"
            style={{
              background: profile?.role === 'admin' ? 'var(--csir-navy)' : 'var(--csir-blue-bg)',
              color: profile?.role === 'admin' ? 'white' : 'var(--csir-navy)',
            }}
          >
            {profile?.role === 'admin' ? '⭐ Admin' : 'Member'}
          </span>

          <div className="mt-5 pt-5 border-t text-left" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <IconCalendar size={14} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Member since</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {profile?.joined_date ? new Date(profile.joined_date).toLocaleDateString('en-ZA', { dateStyle: 'medium' }) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconShield size={14} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Verification</p>
                <p className="text-sm font-medium" style={{ color: '#3B6D11' }}>
                  ✓ Verified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* Personal info */}
          <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Personal Information
              </h2>
              <button
                onClick={() => { setEditing(!editing); setError('') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{
                  background: editing ? '#FCEBEB' : 'var(--csir-blue-bg)',
                  color: editing ? '#991B1B' : 'var(--csir-navy)',
                }}
              >
                {editing ? <IconX size={13} strokeWidth={2} /> : <IconEdit size={13} strokeWidth={2} />}
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'First name', key: 'first_name', icon: IconUser },
                { label: 'Last name', key: 'last_name', icon: IconUser },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                      style={{ borderColor: 'var(--csir-navy)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        {form[key as keyof typeof form] || '—'}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Email address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                    style={{ borderColor: 'var(--csir-navy)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                    <IconMail size={14} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{form.email || '—'}</p>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-5 pt-5 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--csir-navy)' }}
                >
                  <IconCheck size={15} strokeWidth={2} />
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            )}
          </div>

          {/* Change password */}
          <div className="rounded-xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Change Password
              </h2>
              <button
                onClick={() => { setShowPasswordForm(!showPasswordForm); setError('') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{
                  background: showPasswordForm ? '#FCEBEB' : 'var(--csir-blue-bg)',
                  color: showPasswordForm ? '#991B1B' : 'var(--csir-navy)',
                }}
              >
                {showPasswordForm ? <IconX size={13} strokeWidth={2} /> : <IconLock size={13} strokeWidth={2} />}
                {showPasswordForm ? 'Cancel' : 'Change'}
              </button>
            </div>

            {!showPasswordForm ? (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Keep your account secure with a strong password.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Current password', key: 'old_password' },
                  { label: 'New password', key: 'new_password' },
                  { label: 'Confirm new password', key: 'confirm_password' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                      {label}
                    </label>
                    <input
                      type="password"
                      value={passwordForm[key as keyof typeof passwordForm]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
                    />
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--csir-navy)' }}
                  >
                    <IconCheck size={15} strokeWidth={2} />
                    {savingPassword ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
