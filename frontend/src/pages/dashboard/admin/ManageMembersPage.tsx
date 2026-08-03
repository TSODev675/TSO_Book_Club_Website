import { useEffect, useState } from 'react'
import {
  Users, Shield, User, Mail, Calendar,
  ChevronDown, Check, X, Search
} from 'lucide-react'
import api from '../../../lib/api'
import DashboardLayout from '../../../components/DashboardLayout'
import { useProfile } from '../../../hooks/useProfile'

interface Member {
  id: number
  role: 'admin' | 'member'
  joined_date: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

export default function ManageMembersPage() {
  const { profile, loading } = useProfile()
  const [members, setMembers] = useState<Member[]>([])
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  useEffect(() => {
    api.get('/profiles/')
      .then((r) => setMembers(r.data))
      .finally(() => setFetching(false))
  }, [])

  const filtered = members.filter((m) =>
    m.user.username.toLowerCase().includes(search.toLowerCase()) ||
    m.user.email.toLowerCase().includes(search.toLowerCase()) ||
    `${m.user.first_name} ${m.user.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleChange = async (memberId: number, newRole: 'admin' | 'member') => {
    setUpdatingId(memberId)
    setError('')
    setOpenDropdown(null)
    try {
      await api.patch(`/profiles/${memberId}/`, { role: newRole })
      setMembers(members.map((m) =>
        m.id === memberId ? { ...m, role: newRole } : m
      ))
      setSuccess(`Role updated to ${newRole} successfully.`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to update role. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  const adminCount = members.filter((m) => m.role === 'admin').length
  const memberCount = members.filter((m) => m.role === 'member').length

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={`${profile?.user.first_name} ${profile?.user.last_name}`.trim()}
      isAdmin
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Manage Members
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          View all members and manage their roles.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total members', value: members.length, icon: Users },
          { label: 'Admins', value: adminCount, icon: Shield },
          { label: 'Members', value: memberCount, icon: User },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border p-5 flex items-center gap-4"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--csir-blue-bg)' }}>
              <s.icon size={20} strokeWidth={1.8} style={{ color: 'var(--csir-navy)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Success / error */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <Check size={15} strokeWidth={2} /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#FCEBEB', color: '#991B1B' }}>
          <X size={15} strokeWidth={2} /> {error}
        </div>
      )}

      {/* Search */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border mb-5 w-full md:w-72"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <Search size={15} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none"
          style={{ color: 'var(--color-text-primary)' }}
        />
      </div>

      {/* Members table */}
      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading members...</p>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <Users size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--csir-blue-light)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {search ? 'No members match your search' : 'No members yet'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>

          {/* Table header */}
          <div
            className="grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text-muted)',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div className="col-span-4">Member</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table rows */}
          {filtered.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-12 px-5 py-4 items-center border-b last:border-0 transition hover:bg-gray-50"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              {/* Member */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
                  style={{ background: 'var(--csir-navy)' }}
                >
                  {(m.user.first_name || m.user.username)[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {m.user.first_name
                      ? `${m.user.first_name} ${m.user.last_name}`
                      : m.user.username}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    @{m.user.username}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-3 flex items-center gap-1.5 min-w-0">
                <Mail size={13} strokeWidth={1.8} className="flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  {m.user.email || '—'}
                </p>
              </div>

              {/* Joined */}
              <div className="col-span-2 flex items-center gap-1.5">
                <Calendar size={13} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(m.joined_date).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                </p>
              </div>

              {/* Role badge */}
              <div className="col-span-2">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: m.role === 'admin' ? 'var(--csir-navy)' : 'var(--csir-blue-bg)',
                    color: m.role === 'admin' ? 'white' : 'var(--csir-navy)',
                  }}
                >
                  {m.role === 'admin'
                    ? <Shield size={11} strokeWidth={2} />
                    : <User size={11} strokeWidth={2} />
                  }
                  {m.role}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end relative">
                {m.user.username === profile?.user.username ? (
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>You</span>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === m.id ? null : m.id)}
                      disabled={updatingId === m.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-40"
                      style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
                    >
                      {updatingId === m.id ? 'Saving...' : 'Role'}
                      <ChevronDown size={12} strokeWidth={2} />
                    </button>

                    {openDropdown === m.id && (
                      <div
                        className="absolute right-0 top-8 rounded-lg border shadow-lg z-20 overflow-hidden"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', minWidth: '120px' }}
                      >
                        {(['member', 'admin'] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(m.id, role)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm transition hover:bg-gray-50 text-left"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {m.role === role && (
                              <Check size={13} strokeWidth={2} style={{ color: 'var(--csir-navy)' }} />
                            )}
                            {m.role !== role && <span className="w-[13px]" />}
                            <span className="capitalize">{role}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}