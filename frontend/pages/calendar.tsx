"use client";

import "../app/globals.css";
import type React from "react";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  Home,
  Calendar as CalendarIcon2,
  Users,
  Settings,
  BarChart,
  MessageSquare,
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
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { createClient } from "@/lib/supabase/client";


export default function CalendarPage() {
  const supabase = createClient();
  const [date, setDate] = useState<Date>(startOfToday());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, [supabase]);

  if (loadingUser) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>No user found. Please sign in.</div>;
  }

  const userRole = user!.role?.toString().trim().toLowerCase() || ''
  if (userRole !== 'admin') {
    return (
      <div className="unauthorized">
        <p>You are not authorized to view this page.</p>
      </div>
    )
  }

  const addEvent = async (event: Event) => {
    try {
      for (const key in event) {
        const typedKey = key as keyof Event;
        console.log(`${key}: ${typeof event[typedKey]}`);
      }
      const response = await fetch("http://localhost:8000/api/calendar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      console.log(response)
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
    <div className="flex h-screen w-full bg-gray-50">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 shadow-sm">
          <button
            className="mr-4 rounded-md p-1 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Calendar</h1>
          <div className="ml-auto flex items-center gap-4">
            <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")} className="hidden md:block">
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
                  <Button variant="outline" className="min-w-[150px] hidden sm:flex">
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
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <AddEventDialog onAddEvent={addEvent} onCancel={() => setIsAddEventOpen(false)} />
            </Dialog>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-4 md:hidden">
            <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
              <TabsList className="w-full">
                <TabsTrigger value="day" className="flex-1">Day</TabsTrigger>
                <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
                <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border shadow">
              {view === "day" && <DayView date={date} events={events} />}
              {view === "week" && <WeekView date={date} events={events} />}
              {view === "month" && <MonthView date={date} events={events} />}
            </div>
          )}
        </main>
      </div>
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

  // Function to calculate overlapping events
  const calculateOverlaps = (events: Event[]) => {
    const overlaps: { [key: string]: number } = {};
    events.forEach((event, index) => {
      overlaps[event.id] = 0;
      for (let i = 0; i < index; i++) {
        const prevEvent = events[i];
        if (
          new Date(event.start) < new Date(prevEvent.end) &&
          new Date(event.end) > new Date(prevEvent.start)
        ) {
          overlaps[event.id]++;
        }
      }
    });
    return overlaps;
  };

  const overlaps = calculateOverlaps(filtered);

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

      {filtered.map((event, index) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const startMins = start.getHours() * 60 + start.getMinutes();
        const endMins = end.getHours() * 60 + end.getMinutes();
        const top = startMins - startHour * 60;
        const height = endMins - startMins;
        const overlapCount = overlaps[event.id];
        const width = `calc(${100 / (overlapCount + 1)}% - 2px)`;
        const left = `calc(${(100 / (overlapCount + 1)) * index}% + 60px)`;

        return (
          <div
            key={event.id}
            className={`absolute rounded-md p-2 text-sm text-black overflow-hidden border shadow ${
              event.type === "meeting" ? "bg-blue-200 border-blue-400" : "bg-yellow-100 border-yellow-300"
            }`}
            style={{ top: `${top}px`, height: `${height}px`, width, left }}
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
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  // Function to calculate overlapping events
  const calculateOverlaps = (events: Event[]) => {
    const overlaps: { [key: string]: number } = {};
    events.forEach((event, index) => {
      overlaps[event.id] = 0;
      for (let i = 0; i < index; i++) {
        const prevEvent = events[i];
        if (
          new Date(event.start) < new Date(prevEvent.end) &&
          new Date(event.end) > new Date(prevEvent.start)
        ) {
          overlaps[event.id]++;
        }
      }
    });
    return overlaps;
  };

  return (
    <div className="relative h-[720px] overflow-auto">
      <div className="grid grid-cols-8 sticky top-0 z-10 bg-white border-b">
        <div className="border-r h-16 flex items-end justify-center pb-2 text-xs text-gray-500 font-medium">
          <span>TIME</span>
        </div>
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`h-16 border-r text-center py-2 flex flex-col justify-between ${
              day.getDate() === new Date().getDate() && 
              day.getMonth() === new Date().getMonth() && 
              day.getFullYear() === new Date().getFullYear() 
                ? "bg-blue-50" 
                : ""
            }`}
          >
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div className={`text-lg font-bold mx-auto flex items-center justify-center h-8 w-8 ${
              day.getDate() === new Date().getDate() && 
              day.getMonth() === new Date().getMonth() && 
              day.getFullYear() === new Date().getFullYear() 
                ? "rounded-full bg-primary text-white" 
                : ""
            }`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8">
        <div className="col-span-1 border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] text-xs text-right pr-2 pt-2 text-gray-500 border-b">
              {hour}:00
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => {
          const dayEvents = events.filter((e) => {
            const d = new Date(e.start);
            return (
              d.getDate() === day.getDate() &&
              d.getMonth() === day.getMonth() &&
              d.getFullYear() === day.getFullYear()
            );
          });

          const overlaps = calculateOverlaps(dayEvents);

          return (
            <div key={dayIndex} className="col-span-1 relative border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] border-b"></div>
              ))}

              {dayEvents.map((event, index) => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const startMins = start.getHours() * 60 + start.getMinutes();
                const endMins = end.getHours() * 60 + end.getMinutes();
                const top = (startMins - startHour * 60);
                const height = Math.max(endMins - startMins, 30); // Ensure a minimum height of 30px
                const overlapCount = overlaps[event.id];
                const width = `calc(${100 / (overlapCount + 1)}% - 2px)`;
                const left = `calc(${(100 / (overlapCount + 1)) * index}% + 1px)`;

                return (
                  <div
                    key={event.id}
                    className={`absolute rounded-md p-1 text-xs overflow-hidden border shadow ${
                      event.type === "meeting" 
                        ? "bg-blue-50 border-blue-200 text-blue-800" 
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                    style={{ top: `${top}px`, height: `${height}px`, width, left }}
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
    <div>
      <div className="sticky top-0 left-0 z-10 bg-white text-sm font-medium px-4 py-2 border-b">
        {format(date, "MMMM yyyy")}
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2 text-gray-600">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const isToday = 
            day.date.getDate() === new Date().getDate() && 
            day.date.getMonth() === new Date().getMonth() && 
            day.date.getFullYear() === new Date().getFullYear();

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
              className={`min-h-[120px] border rounded-md p-1 transition-colors ${
                day.isCurrentMonth 
                  ? isToday 
                    ? "bg-blue-50 ring-1 ring-primary" 
                    : "bg-white hover:bg-gray-50"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              <div className={`text-right p-1 ${isToday ? "font-bold text-primary" : ""}`}>
                {day.date.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded-md truncate border ${
                      event.type === "meeting" 
                        ? "bg-blue-50 border-blue-200 text-blue-800" 
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                  >
                    {format(new Date(event.start), "h:mm a")} - {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center py-1 text-gray-500 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
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