"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/auth-provider'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/signup_login')
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  // Only render children if user is authenticated
  return user ? <>{children}</> : null
}
