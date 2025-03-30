import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    const { hash } = window.location
    
    if (hash) {
      const supabase = createClient()
      
      // Exchange the auth code for a session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // Redirect to the dashboard after successful authentication
          router.push('/dashboard')
        }
      })
    }
  }, [router])
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Processing authentication...</p>
    </div>
  )
}
