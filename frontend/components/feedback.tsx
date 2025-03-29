"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Update interface to match your API response
interface Request {
  id: string
  type: 'supply' | 'maintenance' | 'suggestion' | 'other'
  description: string
  priority: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  supply_id?: string
  user_id?: string
  created_at: string
  resolved_at?: string
}

export function Feedback() {
  const [requests, setRequests] = useState<Request[]>([])
  const [newRequest, setNewRequest] = useState("")
  const [type, setType] = useState<Request['type']>("suggestion")
  const [filter, setFilter] = useState("all")
  const [priority, setPriority] = useState<Request['priority']>("medium")

  // Fetch all requests when component mounts
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/requests/all')
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const addRequest = async () => {
    if (newRequest.trim()) {
      try {
        const response = await fetch('http://localhost:8000/api/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            description: newRequest,
            priority,
            status: 'open'
          }),
        })

        if (response.ok) {
          // Refresh the requests list
          fetchRequests()
          // Reset form
          setNewRequest("")
          setType("suggestion")
          setPriority("medium")
        }
      } catch (error) {
        console.error('Error creating request:', error)
      }
    }
  }

  const filteredRequests = filter === "all" ? requests : requests.filter((item) => item.type === filter)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Feedback & Requests</CardTitle>
            <CardDescription>Staff feedback and equipment requests</CardDescription>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="supply">Supply</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {filteredRequests.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                <Avatar>
                  <AvatarFallback>{item.type.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">{item.type}</span>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">{item.priority}</span>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">{item.status}</span>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="mt-1 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <div className="flex w-full gap-2">
          <Select 
            value={type} 
            onValueChange={(value) => setType(value as Request['type'])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supply">Supply</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as Request['priority'])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very_low">Very Low</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="very_high">Very High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Add your request..."
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <Button className="self-end" onClick={addRequest}>
          Submit Request
        </Button>
      </CardFooter>
    </Card>
  )
}

