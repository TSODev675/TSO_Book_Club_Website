import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between px-8 h-16" style={{ background: 'var(--csir-navy)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>CSIR</span>
        </div>
        <div>
          <p className="text-white text-sm font-medium">TSO Book Club</p>
          <p className="text-white/50 text-xs">Touching lives through innovation</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="text-white text-sm px-5 py-2 rounded-md border border-white/40 hover:bg-white/10 transition"
        >
          I'm a member
        </button>
        <button
          onClick={() => navigate('/register')}
          className="text-sm px-5 py-2 rounded-md font-medium transition hover:bg-blue-50"
          style={{ background: 'white', color: 'var(--csir-navy)' }}
        >
          Join Book Club
        </button>
      </div>
    </nav>
  )
}