const books = [
  { title: 'Atomic Habits', author: 'James Clear', color: 'var(--csir-blue-bg)', textColor: 'var(--csir-navy)' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', color: '#EAF3DE', textColor: '#3B6D11' },
  { title: 'The Lean Startup', author: 'Eric Ries', color: '#FAEEDA', textColor: '#854F0B' },
  { title: 'Deep Work', author: 'Cal Newport', color: '#FBEAF0', textColor: '#993556' },
]

export default function RecentReads() {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <h2 className="text-2xl font-medium text-center text-gray-900 mb-2">Recent reads</h2>
      <p className="text-sm text-center text-gray-500 mb-10">A glimpse of what the club has been exploring</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {books.map((b) => (
          <div key={b.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-24 flex items-center justify-center text-3xl" style={{ background: b.color }}>
              📚
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 leading-tight">{b.title}</p>
              <p className="text-xs text-gray-500 mt-1">{b.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}