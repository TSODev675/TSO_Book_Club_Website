import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'

export default function VerifyEmailPage() {
  const { uid, token } = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    api.get(`/auth/verify-email/${uid}/${token}/`)
      .then((res) => {
        setStatus('success')
        setMessage(res.data.detail)
      })
      .catch((err) => {
        const detail = err.response?.data?.detail || 'Invalid or expired link.'
        // treat "already verified" as success
        if (detail.toLowerCase().includes('already verified')) {
          setStatus('success')
          setMessage('Your email is already verified. You can sign in.')
        } else {
          setStatus('error')
          setMessage(detail)
        }
      })
  }, [uid, token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-8">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl animate-pulse" style={{ background: 'var(--csir-blue-bg)' }}>
              📬
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Verifying your email...</h2>
            <p className="text-sm text-gray-400">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl" style={{ background: '#EAF3DE' }}>
              ✅
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Email verified!</h2>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: 'var(--csir-navy)' }}
            >
              Sign in now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl" style={{ background: '#FCEBEB' }}>
              ❌
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Verification failed</h2>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block px-6 py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: 'var(--csir-navy)' }}
            >
              Register again
            </Link>
          </>
        )}
      </div>
    </div>
  )
}