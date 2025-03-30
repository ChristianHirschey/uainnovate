"use client"

import '../app/globals.css';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signup_login')
  }
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p className="mb-2">You are logged in as: <span className="font-medium">{user?.email}</span></p>
          <p className="mb-2">User ID: <span className="font-medium">{user?.id}</span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <Button onClick={() => router.push('/calendar')} className="h-24">Calendar</Button>
            <Button onClick={() => router.push('/reports')} className="h-24">Reports</Button>
            <Button onClick={() => router.push('/requests')} className="h-24">Requests</Button>
            <Button onClick={() => router.push('/supplies')} className="h-24">Supplies</Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
