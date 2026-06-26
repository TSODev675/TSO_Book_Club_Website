import { useEffect, useState } from 'react'
import api from '../../lib/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useProfile } from '../../hooks/useProfile'

const IconBook = ({ size = 24, strokeWidth = 1.5, style, className }: { size?: number; strokeWidth?: number; style?: any; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 19.5V5.25a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14.25" />
    <path d="M4 6.75h16" />
    <path d="M8 5.25v14.25" />
  </svg>
)

const IconUser = ({ size = 24, strokeWidth = 1.5, style, className }: { size?: number; strokeWidth?: number; style?: any; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    <path d="M6 20.5c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5" />
  </svg>
)

const IconCalendar = ({ size = 24, strokeWidth = 1.5, style, className }: { size?: number; strokeWidth?: number; style?: any; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
)

const IconSearch = ({ size = 24, strokeWidth = 1.5, style, className }: { size?: number; strokeWidth?: number; style?: any; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

export default function BooksPage() {
  const { profile, loading } = useProfile()
  const [books, setBooks] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/books/')
      .then((r) => setBooks(r.data))
      .finally(() => setFetching(false))
  }, [])

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  )

  const bookColors = [
    { bg: '#E8EFFE', text: '#1B3A7A' },
    { bg: '#EAF3DE', text: '#3B6D11' },
    { bg: '#FAEEDA', text: '#854F0B' },
    { bg: '#FBEAF0', text: '#993556' },
    { bg: '#EDE9FE', text: '#5B21B6' },
    { bg: '#FEF3C7', text: '#92400E' },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={`${profile?.user.first_name} ${profile?.user.last_name}`.trim()}
      isAdmin={profile?.role === 'admin'}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Book Library
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            The club's curated reading collection.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border w-full md:w-64" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <IconSearch size={16} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--color-text-primary)' }}
          />
        </div>
      </div>

      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading books...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <IconBook size={40} style={{ color: 'var(--csir-blue-light)' }} strokeWidth={1.5} className="mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {search ? 'No books match your search' : 'No books added yet'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {search ? 'Try a different search term.' : 'Check back soon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b: any, i: number) => {
            const color = bookColors[i % bookColors.length]
            return (
              <div
                key={b.id}
                className="rounded-xl border overflow-hidden transition hover:shadow-md"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                {/* Book cover */}
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ background: color.bg }}
                >
                  <IconBook size={48} strokeWidth={1.2} style={{ color: color.text }} />
                </div>

                {/* Book info */}
                <div className="p-5">
                  <h3
                    className="text-base font-semibold leading-snug mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                  >
                    {b.title}
                  </h3>

                  <div className="flex items-center gap-1.5 mb-3">
                    <IconUser size={13} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{b.author}</p>
                  </div>

                  {b.description && (
                    <p
                      className="text-xs leading-relaxed line-clamp-3 mb-3"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {b.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <IconCalendar size={13} strokeWidth={1.8} />
                      {new Date(b.published_date).getFullYear()}
                    </span>
                    {b.added_by && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}>
                        Added by {b.added_by.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}