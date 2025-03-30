"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  message: string
  supply_id: string
  request_id: string
  seen: boolean
  created_at: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notifications/get-all')
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      console.log("Marking notification as read:", id)
      const response = await fetch(`http://localhost:8000/api/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, seen: true } : notification
          )
        )
      }
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-500"
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent alerts and updates</CardDescription>
          </div>
          <Badge>{notifications.filter((n) => !n.seen).length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[285px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn("flex gap-2 rounded-lg border p-3", !notification.seen && "bg-muted/50")}
                onClick={() => markAsRead(notification.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{notification.message}</h4>
                    {!notification.seen && (
                      <Badge variant="outline" className="h-5 px-1 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.created_at}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

