import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: June 2026</p>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-3">1. Information we collect</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We collect information you provide directly when you register for the TSO Book Club, including your name, email address, and CSIR employee details. We also collect data about your interactions with the platform such as books read, reflections posted, and meetings attended.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-3">2. How we use your information</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your information is used solely to operate the TSO Book Club platform — to manage your account, send meeting reminders, and display your reflections to other members. We do not sell, share, or distribute your personal information to any third parties outside of CSIR.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-3">3. Data storage</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            All data is stored securely on CSIR-managed infrastructure. We use industry-standard encryption for data in transit and at rest. Your password is never stored in plain text.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-3">4. Your rights</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time. To make a request, contact the book club administrator at the email address below. Account deletion removes all your data from our systems within 30 days.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-3">5. Cookies</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use minimal cookies necessary for authentication and session management only. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-3">6. Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For any privacy-related concerns, reach out to us at{' '}
            <a href="mailto:tsobookclub@csir.co.za" className="underline" style={{ color: 'var(--csir-navy)' }}>
              tsobookclub@csir.co.za
            </a>.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  )
}