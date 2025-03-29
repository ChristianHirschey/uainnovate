"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Event {
  id: string
  title: string
  date: Date
  time: string
  type: "meeting" | "deadline" | "reminder"
}

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const events: Event[] = [
    {
      id: "1",
      title: "Budget Review Meeting",
      date: new Date(2025, 2, 29),
      time: "10:00 AM",
      type: "meeting",
    },
    {
      id: "2",
      title: "Office Supplies Order Deadline",
      date: new Date(2025, 2, 30),
      time: "5:00 PM",
      type: "deadline",
    },
    {
      id: "3",
      title: "Team Lunch",
      date: new Date(2025, 2, 31),
      time: "12:30 PM",
      type: "meeting",
    },
    {
      id: "4",
      title: "Quarterly Report Due",
      date: new Date(2025, 3, 1),
      time: "9:00 AM",
      type: "deadline",
    },
    {
      id: "5",
      title: "Office Cleaning",
      date: new Date(2025, 3, 2),
      time: "4:00 PM",
      type: "reminder",
    },
  ]

  // Get events for the selected date
  const selectedDateEvents = events.filter(
    (event) =>
      date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  )

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500 hover:bg-blue-600"
      case "deadline":
        return "bg-red-500 hover:bg-red-600"
      case "reminder":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Schedule and upcoming events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-[1fr_250px]">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border rounded-md p-3"
            modifiers={{
              hasEvent: (date) => isDayWithEvent(date),
            }}
            modifiersStyles={{
              hasEvent: { fontWeight: "bold", textDecoration: "underline" },
            }}
          />
          <div>
            <h3 className="mb-2 font-medium">
              {date
                ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : "No date selected"}
            </h3>
            <ScrollArea className="h-[180px] pr-4">
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="rounded-md border p-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">No events scheduled for this day</p>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

