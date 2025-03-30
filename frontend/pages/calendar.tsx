"use client"

import '../app/globals.css';
import type React from "react"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { addDays, format, startOfToday } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(startOfToday())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events from endpoint
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/calendar/`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
  
      const { data } = await response.json(); // assuming backend returns { data: [...] }
      const mapped = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start_time,
        end: event.end_time,
        type: event.type,
        estimatedDuration: event.estimated_duration,
        attendees: event.attendees || [],
        notes: event.notes,
      }));
  
      setEvents(mapped);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  // Initial data fetch
  useState(() => {
    fetchEvents()
  })

  const addEvent = async (event: Event) => {
    try {
      // Replace with your actual endpoint
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error("Failed to add event")
      }

      // Refresh events
      fetchEvents()
      setIsAddEventOpen(false)
      toast({
        title: "Success",
        description: "Event added successfully",
      })
    } catch (error) {
      console.error("Error adding event:", error)
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      })

      // For demonstration, add to local state
      setEvents([...events, { ...event, id: String(Date.now()) }])
      setIsAddEventOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(date)
                if (view === "day") newDate.setDate(date.getDate() - 1)
                else if (view === "week") newDate.setDate(date.getDate() - 7)
                else newDate.setMonth(date.getMonth() - 1)
                setDate(newDate)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[150px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(date)
                if (view === "day") newDate.setDate(date.getDate() + 1)
                else if (view === "week") newDate.setDate(date.getDate() + 7)
                else newDate.setMonth(date.getMonth() + 1)
                setDate(newDate)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <AddEventDialog onAddEvent={addEvent} onCancel={() => setIsAddEventOpen(false)} />
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow">
          {view === "day" && <DayView date={date} events={events} />}
          {view === "week" && <WeekView date={date} events={events} />}
          {view === "month" && <MonthView date={date} events={events} />}
        </div>
      )}
    </div>
  )
}

interface Event {
  id: string
  title: string
  description?: string
  start: string
  end: string
  type: "meeting" | "request"
  estimatedDuration: number
  attendees?: string[]
}

function DayView({ date, events }: { date: Date; events: Event[] }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="text-center py-2 font-medium border-b">{format(date, "EEEE, MMMM d, yyyy")}</div>
      <div className="grid grid-cols-[60px_1fr] h-[600px] overflow-y-auto">
        <div className="border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-20 border-b text-xs text-right pr-2 pt-1 text-muted-foreground">
              {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
            </div>
          ))}
        </div>
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="h-20 border-b"></div>
          ))}
          {filteredEvents.map((event) => {
            const startTime = new Date(event.start)
            const endTime = new Date(event.end)
            const startHour = startTime.getHours()
            const startMinute = startTime.getMinutes()
            const endHour = endTime.getHours()
            const endMinute = endTime.getMinutes()

            const top = ((startHour - 8) * 60 + startMinute) * (20 / 60)
            const height = ((endHour - startHour) * 60 + (endMinute - startMinute)) * (20 / 60)

            return (
              <div
                key={event.id}
                className={`absolute left-1 right-1 rounded-md p-2 overflow-hidden ${
                  event.type === "meeting" ? "bg-blue-100 border-blue-300" : "bg-amber-100 border-amber-300"
                } border`}
                style={{ top: `${top}px`, height: `${height}px` }}
              >
                <div className="font-medium text-sm truncate">{event.title}</div>
                <div className="text-xs text-muted-foreground">
                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </div>
                <div className="text-xs mt-1">Est: {event.estimatedDuration} min</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function WeekView({ date, events }: { date: Date; events: Event[] }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  // Get the start of the week (Sunday)
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  // Create an array of the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return day
  })

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
        <div className="border-r"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`text-center py-2 font-medium ${
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear()
                ? "bg-primary/10"
                : ""
            }`}
          >
            <div>{format(day, "EEE")}</div>
            <div>{format(day, "d")}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[60px_repeat(7,1fr)] h-[600px] overflow-y-auto">
        <div className="border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-20 border-b text-xs text-right pr-2 pt-1 text-muted-foreground">
              {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
            </div>
          ))}
        </div>
        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="relative border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b"></div>
            ))}
            {events
              .filter((event) => {
                const eventDate = new Date(event.start)
                return (
                  eventDate.getDate() === day.getDate() &&
                  eventDate.getMonth() === day.getMonth() &&
                  eventDate.getFullYear() === day.getFullYear()
                )
              })
              .map((event) => {
                const startTime = new Date(event.start)
                const endTime = new Date(event.end)
                const startHour = startTime.getHours()
                const startMinute = startTime.getMinutes()
                const endHour = endTime.getHours()
                const endMinute = endTime.getMinutes()

                const top = ((startHour - 8) * 60 + startMinute) * (20 / 60)
                const height = ((endHour - startHour) * 60 + (endMinute - startMinute)) * (20 / 60)

                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 rounded-md p-1 overflow-hidden ${
                      event.type === "meeting" ? "bg-blue-100 border-blue-300" : "bg-amber-100 border-amber-300"
                    } border`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className="font-medium text-xs truncate">{event.title}</div>
                    <div className="text-[10px] text-muted-foreground">{format(startTime, "h:mm a")}</div>
                    <div className="text-[10px]">Est: {event.estimatedDuration}m</div>
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}

function MonthView({ date, events }: { date: Date; events: Event[] }) {
  // Get the first day of the month
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Get the number of days in the month
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  // Create an array of days to display (including days from previous/next month to fill the grid)
  const days = []

  // Add days from previous month
  const prevMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDays - i),
      isCurrentMonth: false,
    })
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(date.getFullYear(), date.getMonth(), i),
      isCurrentMonth: true,
    })
  }

  // Add days from next month
  const remainingDays = 42 - days.length // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(date.getFullYear(), date.getMonth() + 1, i),
      isCurrentMonth: false,
    })
  }

  return (
    <div className="grid grid-cols-7 gap-1 p-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-medium py-2">
          {day}
        </div>
      ))}
      {days.map((day, index) => {
        const dayEvents = events.filter((event) => {
          const eventDate = new Date(event.start)
          return (
            eventDate.getDate() === day.date.getDate() &&
            eventDate.getMonth() === day.date.getMonth() &&
            eventDate.getFullYear() === day.date.getFullYear()
          )
        })

        return (
          <div
            key={index}
            className={`min-h-[100px] border rounded-md p-1 ${
              day.isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground"
            } ${
              day.date.getDate() === new Date().getDate() &&
              day.date.getMonth() === new Date().getMonth() &&
              day.date.getFullYear() === new Date().getFullYear()
                ? "border-primary"
                : "border-border"
            }`}
          >
            <div className="text-right text-sm font-medium p-1">{day.date.getDate()}</div>
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded truncate ${
                    event.type === "meeting" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {format(new Date(event.start), "h:mm a")} - {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AddEventDialog({
  onAddEvent,
  onCancel,
}: {
  onAddEvent: (event: Event) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [type, setType] = useState<"meeting" | "request">("meeting")
  const [estimatedDuration, setEstimatedDuration] = useState("30")
  const [attendees, setAttendees] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const startDate = new Date(date)
    startDate.setHours(startHour, startMinute, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(endHour, endMinute, 0, 0)

    const newEvent: Event = {
      id: String(Date.now()),
      title,
      description,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      type,
      estimatedDuration: Number.parseInt(estimatedDuration),
      attendees: attendees ? attendees.split(",").map((a) => a.trim()) : undefined,
    }

    onAddEvent(newEvent)
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Create a new event or request on your calendar.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start text-left font-normal" id="date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">
              Start Time
            </Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as "meeting" | "request")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="request">Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimated-duration" className="text-right">
              Est. Duration (min)
            </Label>
            <Input
              id="estimated-duration"
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="col-span-3"
              required
              min="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attendees" className="text-right">
              Attendees
            </Label>
            <Input
              id="attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="col-span-3"
              placeholder="Comma separated names"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Event</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
