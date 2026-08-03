import { useNavigate } from 'react-router-dom'
// import logo from '../assets/tso_bookclub_logo.svg'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <div className="text-center px-8 py-24" style={{ background: 'var(--csir-navy)' }}>
      {/* <img src={logo} alt="TSO Book Club Logo" className="ml-2" /> */}
      <span className="inline-block text-xs px-4 py-1 rounded-full mb-6 text-white/80" style={{ background: 'rgba(255,255,255,0.12)' }}>
        📚 CSIR TSO Reading Community
      </span>
      <h1 className="text-4xl font-medium text-white leading-tight mb-4">
        Where great minds <span style={{ color: 'var(--csir-blue-light)' }}>read together</span>
      </h1>
      <p className="text-white/70 text-base max-w-lg mx-auto mb-8 leading-relaxed">
        A curated book club for CSIR professionals. Explore ideas, share reflections, and grow together through the power of reading.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => navigate('/register')}
          className="px-7 py-3 rounded-lg text-sm font-medium transition hover:bg-blue-50"
          style={{ background: 'white', color: 'var(--csir-navy)' }}
        >
          Join the club
        </button>
        <button
          onClick={() => navigate('/login')}
          className="px-7 py-3 rounded-lg text-sm text-white border transition hover:bg-white/10"
          style={{ borderColor: 'rgba(255,255,255,0.4)' }}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}