import { useProfile } from '../hooks/useProfile'
import MemberDashboard from './dashboard/MemberDashboard'
import AdminDashboard from './dashboard/admin/AdminDashboard'

export default function DashboardRouter() {
  const { profile, loading } = useProfile()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Loading...
    </div>
  )

  if (profile?.role === 'admin') return <AdminDashboard />
  return <MemberDashboard />
}