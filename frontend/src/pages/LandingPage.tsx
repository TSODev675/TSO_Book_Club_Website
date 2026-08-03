import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import RecentReads from '../components/RecentReads'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <RecentReads />
      <Footer />
    </div>
  )
}