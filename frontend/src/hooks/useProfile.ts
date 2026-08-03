import { useEffect, useState } from 'react'
import api from '../lib/api'

interface Profile {
  id: number
  role: 'admin' | 'member'
  joined_date: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/profiles/me/')
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading }
}