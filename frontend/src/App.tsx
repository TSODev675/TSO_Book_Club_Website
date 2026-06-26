import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import DashboardRouter from './pages/DashboardRouter'
import ProtectedRoute from './components/ProtectedRoute'
import ArchivePage from './pages/dashboard/ArchivePage'
import ReflectionsPage from './pages/dashboard/ReflectionsPage'
import MessagesPage from './pages/dashboard/MessagesPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import MeetingsPage from './pages/dashboard/MeetingsPage'
import BooksPage from './pages/dashboard/BooksPage'
import ManageBooksPage from './pages/dashboard/admin/ManageBooksPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/dashboard/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
        <Route path="/dashboard/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
        <Route path="/dashboard/archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
        <Route path="/dashboard/reflections" element={<ProtectedRoute><ReflectionsPage /></ProtectedRoute>} />
        <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> 
        <Route path="/dashboard/admin/manage-books" element={<ProtectedRoute><ManageBooksPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}