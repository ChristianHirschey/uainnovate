"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FeedbackItem {
  id: string
  text: string
  author: {
    name: string
    avatar?: string
    initials: string
  }
  date: string
  category: string
}

export function Feedback() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: "1",
      text: "The new coffee machine is amazing! Thank you for ordering it.",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      date: "2023-03-15",
      category: "facilities",
    },
    {
      id: "2",
      text: "Could we get more ergonomic chairs for the meeting room? The current ones are uncomfortable for long meetings.",
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      date: "2023-03-10",
      category: "equipment",
    },
    {
      id: "3",
      text: "The printer on the 2nd floor keeps jamming. Can we get it serviced?",
      author: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "ER",
      },
      date: "2023-03-08",
      category: "maintenance",
    },
  ])
  const [newFeedback, setNewFeedback] = useState("")
  const [category, setCategory] = useState("general")
  const [filter, setFilter] = useState("all")

  const addFeedback = () => {
    if (newFeedback.trim()) {
      setFeedbackItems([
        {
          id: Date.now().toString(),
          text: newFeedback,
          author: {
            name: "You",
            initials: "YO",
          },
          date: new Date().toISOString().split("T")[0],
          category,
        },
        ...feedbackItems,
      ])
      setNewFeedback("")
      setCategory("general")
    }
  }

  const filteredFeedback = filter === "all" ? feedbackItems : feedbackItems.filter((item) => item.category === filter)

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
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                <Avatar>
                  <AvatarImage src={item.author.avatar} alt={item.author.name} />
                  <AvatarFallback>{item.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.author.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">{item.category}</span>
                      <time className="text-xs text-muted-foreground">{item.date}</time>
                    </div>
                  </div>
                  <p className="mt-1 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <div className="flex w-full gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Add your feedback or request..."
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <Button className="self-end" onClick={addFeedback}>
          Submit Feedback
        </Button>
      </CardFooter>
    </Card>
  )
}

