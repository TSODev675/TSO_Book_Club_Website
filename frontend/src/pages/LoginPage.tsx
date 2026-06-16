import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/token/', form)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      navigate('/dashboard')
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Invalid username or password.'
      setError(detail)
    } finally {
      setLoading(false)
    }
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
            "Reading is to the mind what exercise is to the body."
          </p>
          <p className="text-white/50 text-sm">— Joseph Addison</p>
        </div>
        <p className="text-white/30 text-xs">© 2026 CSIR TSO Book Club</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-16 bg-white">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-8">Sign in to your book club account</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs" style={{ color: 'var(--csir-navy)' }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Not a member yet?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--csir-navy)' }}>
              Join the club
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}