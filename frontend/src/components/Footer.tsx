import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <div className="py-16 px-8 text-center" style={{ background: 'var(--csir-navy)' }}>
        <h2 className="text-2xl font-medium text-white mb-2">Ready to start reading?</h2>
        <p className="text-white/60 text-sm mb-8">Join your colleagues and become part of the TSO Book Club community.</p>
        <Link to="/register" className="inline-block px-8 py-3 rounded-lg text-sm font-medium transition hover:bg-blue-50" style={{ background: 'white', color: 'var(--csir-navy)' }}>
          Join Book Club →
        </Link>
      </div>
      <footer className="px-8 py-4 flex items-center justify-between" style={{ background: 'var(--csir-navy-dark)' }}>
        <p className="text-xs text-white/40">© 2026 CSIR TSO Book Club. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="text-xs text-white/40 hover:text-white/70 transition">Privacy</Link>
          <Link to="/contact" className="text-xs text-white/40 hover:text-white/70 transition">Contact</Link>
        </div>
      </footer>
    </>
  )
}