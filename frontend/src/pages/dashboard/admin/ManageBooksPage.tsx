import { useEffect, useState, type CSSProperties, type PropsWithChildren } from 'react'
import api from '../../../lib/api'
import DashboardLayout from '../../../components/DashboardLayout'
import { useProfile } from '../../../hooks/useProfile'

type IconProps = {
  size?: number
  strokeWidth?: number
  style?: CSSProperties
  className?: string
}

const Icon = ({ size = 16, strokeWidth = 2, style, className, children }: PropsWithChildren<IconProps>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
  >
    {children}
  </svg>
)

const BookOpen = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
    <path d="M12 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V5z" />
  </Icon>
)

const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
)

const Pencil = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18.7 5.3a1 1 0 0 0-1.4 0L7 15.6V19h3.4l10.3-10.3a1 1 0 0 0 0-1.4l-2-2z" />
    <path d="M11 16l-1 1 2.5.5" />
  </Icon>
)

const Trash2 = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 6h18" />
    <path d="M9 6V4h6v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </Icon>
)

const X = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 6 6 18" />
    <path d="M6 6 18 18" />
  </Icon>
)

const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 13l4 4L19 7" />
  </Icon>
)

const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
)

interface Book {
  id: number
  title: string
  author: string
  published_date: string
  description: string
  added_by: any
}

interface BookForm {
  title: string
  author: string
  published_date: string
  description: string
}

const emptyForm: BookForm = { title: '', author: '', published_date: '', description: '' }

export default function ManageBooksPage() {
  const { profile, loading } = useProfile()
  const [books, setBooks] = useState<Book[]>([])
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [form, setForm] = useState<BookForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

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

  const openCreate = () => {
    setEditingBook(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  const openEdit = (book: Book) => {
    setEditingBook(book)
    setForm({
      title: book.title,
      author: book.author,
      published_date: book.published_date,
      description: book.description,
    })
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.published_date) {
      setError('Title, author, and published date are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (editingBook) {
        const res = await api.patch(`/books/${editingBook.id}/`, form)
        setBooks(books.map((b) => b.id === editingBook.id ? res.data : b))
        setSuccess('Book updated successfully.')
      } else {
        const res = await api.post('/books/', form)
        setBooks([res.data, ...books])
        setSuccess('Book added successfully.')
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingBook(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save book.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await api.delete(`/books/${id}/`)
      setBooks(books.filter((b) => b.id !== id))
      setSuccess('Book deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete book.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  )

  return (
    <DashboardLayout
      username={profile?.user.username}
      fullName={`${profile?.user.first_name} ${profile?.user.last_name}`.trim()}
      isAdmin
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Manage Books
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Add, edit, or remove books from the club library.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--csir-navy)' }}
        >
          <Plus size={16} strokeWidth={2} />
          Add book
        </button>
      </div>

      {/* Success / error */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
          <Check size={15} strokeWidth={2} /> {success}
        </div>
      )}
      {error && !showForm && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#FCEBEB', color: '#991B1B' }}>
          <X size={15} strokeWidth={2} /> {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border p-6 mb-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {editingBook ? 'Edit book' : 'Add new book'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="p-1.5 rounded-lg transition hover:bg-gray-100"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg mb-4 text-xs" style={{ background: '#FCEBEB', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Book title"
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Author *
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Author name"
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Published date *
              </label>
              <input
                type="date"
                value={form.published_date}
                onChange={(e) => setForm({ ...form, published_date: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border rounded-lg outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the book..."
              className="w-full px-4 py-3 text-sm border rounded-lg outline-none resize-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', background: 'var(--color-surface)' }}
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition hover:bg-gray-100"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--csir-navy)' }}
            >
              <Check size={15} strokeWidth={2} />
              {submitting ? 'Saving...' : editingBook ? 'Update book' : 'Add book'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border mb-5 w-full md:w-72" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <Search size={15} strokeWidth={1.8} style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none"
          style={{ color: 'var(--color-text-primary)' }}
        />
      </div>

      {/* Books table */}
      {fetching ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading books...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <BookOpen size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--csir-blue-light)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {search ? 'No books match your search' : 'No books added yet'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {search ? 'Try a different search term.' : 'Click "Add book" to get started.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          {/* Table header */}
          <div
            className="grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', borderBottom: `1px solid var(--color-border)` }}
          >
            <div className="col-span-4">Title</div>
            <div className="col-span-3">Author</div>
            <div className="col-span-2">Published</div>
            <div className="col-span-2">Added by</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table rows */}
          {filtered.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-12 px-5 py-4 items-center border-b last:border-0 transition hover:bg-gray-50"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--csir-blue-bg)' }}
                >
                  <BookOpen size={14} strokeWidth={1.8} style={{ color: 'var(--csir-navy)' }} />
                </div>
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {b.title}
                </p>
              </div>
              <div className="col-span-3">
                <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{b.author}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(b.published_date).getFullYear()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  {b.added_by?.username || '—'}
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(b)}
                  className="p-1.5 rounded-lg transition hover:bg-blue-50"
                  style={{ color: 'var(--csir-navy)' }}
                  title="Edit"
                >
                  <Pencil size={14} strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deletingId === b.id}
                  className="p-1.5 rounded-lg transition hover:bg-red-50 disabled:opacity-40"
                  style={{ color: '#991B1B' }}
                  title="Delete"
                >
                  <Trash2 size={14} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}