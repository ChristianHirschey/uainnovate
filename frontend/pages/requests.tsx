"use client"

import '../app/globals.css';
import { useState, useEffect } from "react"
import { Feedback } from "@/components/feedback"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function FeedbackPage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/feedbacks')
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full">
      <DashboardSidebar open={open} setOpen={setOpen} />
      <div className="flex-1">
        <div>
            <Feedback />
        </div>
      </div>
    </div>
  )
}