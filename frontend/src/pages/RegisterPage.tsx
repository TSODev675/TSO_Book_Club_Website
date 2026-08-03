import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

interface FormData {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  password2: string
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', username: '', email: '', password: '', password2: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    const { first_name, last_name, username, email, password, password2 } = form
    if (!first_name || !last_name || !username || !email || !password || !password2) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register/', form)
      setSuccess(true)
    } catch (err: any) {
      const data = err.response?.data
      const msg = data
        ? Object.values(data).flat().join(' ')
        : 'Registration failed. Please try again.'
      setError(msg as string)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl" style={{ background: 'var(--csir-blue-bg)' }}>
            📬
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
          </p>
          <Link to="/login" className="text-sm font-medium" style={{ color: 'var(--csir-navy)' }}>
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12" style={{ background: 'var(--csir-navy)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
            <span className="text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>CSIR</span>
          </div>
          <span className="text-white text-sm font-medium">TSO Book Club</span>
        </div>
        <div>
          <p className="text-3xl font-medium text-white leading-snug mb-4">
            "A reader lives a thousand lives before he dies."
          </p>
          <p className="text-white/50 text-sm">— George R.R. Martin</p>
        </div>
        <p className="text-white/30 text-xs">© 2026 CSIR TSO Book Club</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-16 bg-white">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Join the club</h1>
          <p className="text-sm text-gray-400 mb-8">Create your TSO Book Club account</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">First name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Last name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="jane_doe"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@csir.co.za"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm password</label>
            <input
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--csir-navy)' }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already a member?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--csir-navy)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}