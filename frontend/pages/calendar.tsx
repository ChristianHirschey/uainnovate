"use client";

import "../app/globals.css";
import type React from "react";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { addDays, format, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(startOfToday());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/calendar/");
      if (!response.ok) throw new Error("Failed to fetch events");
      const { data } = await response.json();
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
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load events.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (event: Event) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error("Failed to add event");
      fetchEvents();
      setIsAddEventOpen(false);
      toast({ title: "Success", description: "Event added!" });
    } catch (error) {
      console.error("Add event error:", error);
      toast({ title: "Error", description: "Could not add event", variant: "destructive" });
      setEvents([...events, { ...event, id: String(Date.now()) }]);
      setIsAddEventOpen(false);
    }
  };

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
            <Button variant="outline" size="icon" onClick={() => shiftDate(-1)}>
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
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={() => shiftDate(1)}>
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
  );

  function shiftDate(direction: number) {
    const newDate = new Date(date);
    if (view === "day") newDate.setDate(date.getDate() + direction);
    else if (view === "week") newDate.setDate(date.getDate() + 7 * direction);
    else newDate.setMonth(date.getMonth() + direction);
    setDate(newDate);
  }
}

function DayView({ date, events }: { date: Date; events: Event[] }) {
    const startHour = 8;
    const endHour = 20;
    const pxPerMinute = 1; // 1px per minute = 60px per hour
  
    const filtered = events.filter((e) => {
      const d = new Date(e.start);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  
    return (
      <div className="relative border-l border-t h-[720px]">
        {Array.from({ length: endHour - startHour }, (_, i) => {
          const hour = startHour + i;
          return (
            <div
              key={hour}
              className="absolute left-0 w-full border-t text-xs text-muted-foreground"
              style={{ top: `${(hour - startHour) * 60}px` }}
            >
              <div className="pl-2">{hour}:00</div>
            </div>
          );
        })}
  
        {filtered.map((event) => {
          const start = new Date(event.start);
          const end = new Date(event.end);
          const startMins = start.getHours() * 60 + start.getMinutes();
          const endMins = end.getHours() * 60 + end.getMinutes();
          const top = startMins - startHour * 60;
          const height = endMins - startMins;
  
          return (
            <div
              key={event.id}
              className={`absolute left-[60px] right-2 rounded-md p-2 text-sm text-black overflow-hidden border shadow ${
                event.type === "meeting" ? "bg-blue-200 border-blue-400" : "bg-yellow-100 border-yellow-300"
              }`}
              style={{ top: `${top}px`, height: `${height}px` }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-xs">{format(start, "h:mm a")} - {format(end, "h:mm a")}</div>
            </div>
          );
        })}
      </div>
    );
  }
  
  function WeekView({ date, events }: { date: Date; events: Event[] }) {
    const startHour = 8;
    const endHour = 20;
    const pxPerMinute = 1;
  
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
  
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  
    return (
      <div className="grid grid-cols-8 h-[720px] relative border">
        <div className="col-span-1 border-r">
          {Array.from({ length: endHour - startHour }, (_, i) => (
            <div key={i} className="h-[60px] text-xs text-right pr-1 border-b">
              {startHour + i}:00
            </div>
          ))}
        </div>
        {days.map((day, i) => {
          const dayEvents = events.filter((e) => {
            const d = new Date(e.start);
            return (
              d.getDate() === day.getDate() &&
              d.getMonth() === day.getMonth() &&
              d.getFullYear() === day.getFullYear()
            );
          });
  
          return (
            <div key={i} className="col-span-1 relative border-r">
              {dayEvents.map((event) => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const startMins = start.getHours() * 60 + start.getMinutes();
                const endMins = end.getHours() * 60 + end.getMinutes();
                const top = startMins - startHour * 60;
                const height = endMins - startMins;
  
                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 rounded-md p-1 text-xs overflow-hidden border shadow ${
                      event.type === "meeting" ? "bg-blue-200 border-blue-400" : "bg-yellow-100 border-yellow-300"
                    }`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-[10px]">{format(start, "h:mm a")}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
  
  function MonthView({ date, events }: { date: Date; events: Event[] }) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
  
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth(), -i);
      days.push({ date: d, isCurrentMonth: false });
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(date.getFullYear(), date.getMonth(), i);
      days.push({ date: d, isCurrentMonth: true });
    }
  
    const extra = 42 - days.length;
    for (let i = 1; i <= extra; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }
  
    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const dayEvents = events.filter((event) => {
            const d = new Date(event.start);
            return (
              d.getDate() === day.date.getDate() &&
              d.getMonth() === day.date.getMonth() &&
              d.getFullYear() === day.date.getFullYear()
            );
          });
  
          return (
            <div
              key={i}
              className={`min-h-[100px] border rounded-md p-1 ${
                day.isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground"
              }`}
            >
              <div className="text-right text-sm font-medium p-1">{day.date.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${
                      event.type === "meeting" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {format(new Date(event.start), "h:mm a")} - {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
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
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right">Start Time</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">End Time</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "meeting" | "request")}>
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
              <Label htmlFor="estimated-duration" className="text-right">Est. Duration</Label>
              <Input id="estimated-duration" type="number" value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendees" className="text-right">Attendees</Label>
              <Input id="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} className="col-span-3" placeholder="Comma separated" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    )
  }
  

interface Event {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: string;
  estimatedDuration: number;
  attendees?: string[];
  notes?: string;
}

// NOTE: DayView, WeekView, and MonthView go below this — already updated for correct positioning
// If you want me to now rewrite those updated views inline here too, say the word and I’ll drop the rest of the file right here.
