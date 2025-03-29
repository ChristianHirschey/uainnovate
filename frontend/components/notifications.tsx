"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

export function Notifications() {
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New order received",
      description: "Office supplies order #3245 needs approval",
      time: "10 minutes ago",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Low supply alert",
      description: "Printer paper is running low",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Meeting reminder",
      description: "Budget review at 2:00 PM in Room 305",
      time: "2 hours ago",
      read: true,
      type: "info",
    },
    {
      id: "4",
      title: "Equipment maintenance",
      description: "Copier service scheduled for tomorrow",
      time: "Yesterday",
      read: true,
      type: "info",
    },
    {
      id: "5",
      title: "Order delivered",
      description: "Office chairs delivery completed",
      time: "Yesterday",
      read: true,
      type: "success",
    },
  ]

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
          <Badge>{notifications.filter((n) => !n.read).length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn("flex gap-2 rounded-lg border p-3", !notification.read && "bg-muted/50")}
              >
                <div className={cn("mt-1 h-2 w-2 rounded-full", getTypeStyles(notification.type))} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    {!notification.read && (
                      <Badge variant="outline" className="h-5 px-1 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

