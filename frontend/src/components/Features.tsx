const features = [
  { icon: '📖', title: 'Book library', desc: 'Browse and manage the club\'s curated reading list.' },
  { icon: '📅', title: 'Meetings', desc: 'Schedule and join sessions with Teams links built in.' },
  { icon: '💬', title: 'Reflections', desc: 'Share thoughts and read what colleagues found meaningful.' },
  { icon: '🗂️', title: 'Archive', desc: 'Revisit past meetings, notes, and recorded sessions.' },
]

export default function Features() {
  return (
    <section className="py-16 px-8 bg-white">
      <h2 className="text-2xl font-medium text-center text-gray-900 mb-2">Everything your book club needs</h2>
      <p className="text-sm text-center text-gray-500 mb-10">Built for CSIR professionals, by CSIR professionals</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3" style={{ background: 'var(--csir-blue-bg)' }}>
              {f.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}