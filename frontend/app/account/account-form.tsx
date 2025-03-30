'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function AccountForm() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setEmail(user.email || '')
      }
    }
    fetchUser()
  }, [supabase])

  if (user === null) {
    return <div>Loading user data...</div>
  }

  const userRole = user!.role?.toString().trim().toLowerCase() || ''
  if (userRole !== 'admin') {
    return (
      <div className="unauthorized">
        <p>You are not authorized to view this page.</p>
      </div>
    )
  }

  // Built-in Supabase user: uid comes from user.id and email from user.email.
  async function updateUserEmail(newEmail: string) {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      alert('Email updated successfully!')
    } catch (error: any) {
      console.error('Error updating email:', error.message)
      alert('Error updating email!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="uid">User UID</label>
        <input id="uid" type="text" value={user?.id || ''} disabled />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button
          className="button primary block"
          onClick={() => updateUserEmail(email)}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Email'}
        </button>
      </div>
      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}