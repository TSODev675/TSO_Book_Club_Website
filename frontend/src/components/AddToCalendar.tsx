import { Calendar } from 'lucide-react'

interface Props {
  title: string
  date: string
  duration?: number // minutes, default 60
  description?: string
  location?: string
  teamsLink?: string
}

export default function AddToCalendar({
  title,
  date,
  duration = 60,
  description = '',
  location = 'Microsoft Teams',
  teamsLink = '',
}: Props) {

  const formatDate = (dateStr: string) => {
    return new Date(dateStr)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')
  }

  const generateICS = () => {
    const start = formatDate(date)
    const end = formatDate(
      new Date(new Date(date).getTime() + duration * 60000).toISOString()
    )

    const desc = teamsLink
      ? `${description}\\n\\nJoin on Teams: ${teamsLink}`
      : description

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TSO Book Club//CSIR//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${location}`,
      `URL:${teamsLink}`,
      `STATUS:CONFIRMED`,
      `SEQUENCE:0`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateOutlookLink = () => {
    const start = new Date(date).toISOString()
    const end = new Date(
      new Date(date).getTime() + duration * 60000
    ).toISOString()

    const params = new URLSearchParams({
      subject: title,
      startdt: start,
      enddt: end,
      body: teamsLink ? `Join on Teams: ${teamsLink}` : description,
      location: location,
    })

    window.open(`https://outlook.office.com/calendar/deeplink/compose?${params}`, '_blank')
  }

  const generateGoogleLink = () => {
    const start = formatDate(date)
    const end = formatDate(
      new Date(new Date(date).getTime() + duration * 60000).toISOString()
    )

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${start}/${end}`,
      details: teamsLink ? `Join on Teams: ${teamsLink}` : description,
      location: location,
    })

    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
  }

  return (
    <div className="relative group inline-block">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
        style={{ background: 'var(--csir-blue-bg)', color: 'var(--csir-navy)' }}
      >
        <Calendar size={15} strokeWidth={1.8} />
        Add to calendar
      </button>

      {/* Dropdown */}
      <div
        className="absolute left-0 top-10 rounded-lg border shadow-lg z-20 overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', minWidth: '180px' }}
      >
        <button
          onClick={generateICS}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm transition hover:bg-gray-50 text-left border-b"
          style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-base">📅</span>
          Teams / Outlook (.ics)
        </button>
        <button
          onClick={generateOutlookLink}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm transition hover:bg-gray-50 text-left border-b"
          style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-base">📧</span>
          Outlook Web
        </button>
        <button
          onClick={generateGoogleLink}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm transition hover:bg-gray-50 text-left"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <span className="text-base">🗓️</span>
          Google Calendar
        </button>
      </div>
    </div>
  )
}