import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-16 px-8 text-center" style={{ background: 'var(--csir-navy)' }}>
        <h1 className="text-3xl font-medium text-white mb-2">Get in touch</h1>
        <p className="text-white/60 text-sm">Have a question or suggestion? We'd love to hear from you.</p>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-16">
        {submitted ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background: 'var(--csir-blue-bg)' }}>
              ✅
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Message sent!</h2>
            <p className="text-sm text-gray-500">We'll get back to you at <strong>{form.email}</strong> as soon as possible.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
                  style={{ '--tw-ring-color': 'var(--csir-navy)' } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@csir.co.za"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-900"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
                rows={5}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 resize-none text-gray-900"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: 'var(--csir-navy)' }}
            >
              Send message
            </button>

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a href="mailto:tsobookclub@gmail.com" className="text-xs font-medium" style={{ color: 'var(--csir-navy)' }}>
                  tsobookclub@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-xs font-medium text-gray-700">CSIR Campus, Pretoria</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Response time</p>
                <p className="text-xs font-medium text-gray-700">Within 5 business days</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}