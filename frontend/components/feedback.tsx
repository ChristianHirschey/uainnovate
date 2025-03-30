"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, PenTool, Package, Lightbulb, HelpCircle } from "lucide-react"

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
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Fetch all requests when component mounts
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/requests/all')
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = filter === "all" ? requests : requests.filter((item) => item.type === filter)

  // Get type icon and color
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'supply':
        return {
          icon: <Package className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-600',
          avatarColor: 'bg-blue-100'
        }
      case 'maintenance':
        return {
          icon: <PenTool className="h-4 w-4" />,
          color: 'bg-orange-100 text-orange-600',
          avatarColor: 'bg-orange-100'
        }
      case 'suggestion':
        return {
          icon: <Lightbulb className="h-4 w-4" />,
          color: 'bg-purple-100 text-purple-600',
          avatarColor: 'bg-purple-100'
        }
      default:
        return {
          icon: <HelpCircle className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-600',
          avatarColor: 'bg-gray-100'
        }
    }
  }

  // Get priority color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'very_high':
        return 'bg-red-100 text-red-600'
      case 'high':
        return 'bg-orange-100 text-orange-600'
      case 'medium':
        return 'bg-yellow-100 text-yellow-600'
      case 'low':
        return 'bg-green-100 text-green-600'
      case 'very_low':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          color: 'bg-red-100 text-red-600'
        }
      case 'in_progress':
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          color: 'bg-yellow-100 text-yellow-600'
        }
      case 'resolved':
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          color: 'bg-green-100 text-green-600'
        }
      case 'closed':
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          color: 'bg-slate-100 text-slate-600'
        }
      default:
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          color: 'bg-gray-100 text-gray-600'
        }
    }
  }

  // Format the priority string
  const formatPriority = (priority: string) => {
    return priority.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
  }

  // Format the status string
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
  }

  return (
    <Card className="col-span-full shadow-md">
      <CardHeader className="border-b bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Feedback & Requests</CardTitle>
            <CardDescription className="mt-1">
              Track staff feedback and equipment maintenance
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
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
            <Button size="sm" variant="outline" onClick={fetchRequests}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pb-2">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge 
            variant={filter === "all" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setFilter("all")}
          >
            All
          </Badge>
          <Badge 
            variant={filter === "supply" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setFilter("supply")}
          >
            <Package className="h-3 w-3 mr-1" />
            Supply
          </Badge>
          <Badge 
            variant={filter === "maintenance" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setFilter("maintenance")}
          >
            <PenTool className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
          <Badge 
            variant={filter === "suggestion" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setFilter("suggestion")}
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Suggestion
          </Badge>
          <Badge 
            variant={filter === "other" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setFilter("other")}
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Other
          </Badge>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-[400px] border rounded-lg bg-slate-50/30">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex justify-center items-center h-[400px] border rounded-lg bg-slate-50/30">
            <div className="text-center p-6">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-2" />
              <p className="text-muted-foreground">No requests found</p>
              <p className="text-xs text-muted-foreground mt-1">Try changing your filter criteria</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[400px] rounded-lg border bg-white">
            <div className="space-y-2 p-1">
              {filteredRequests.map((item) => {
                const typeInfo = getTypeInfo(item.type)
                const priorityColor = getPriorityInfo(item.priority)
                const statusInfo = getStatusInfo(item.status)
                
                return (
                  <div key={item.id} className="flex gap-4 rounded-lg border border-slate-200 p-4 hover:bg-slate-50/50 transition-colors shadow-sm">
                    <Avatar className={`${typeInfo.avatarColor} text-lg shadow-sm`}>
                      <AvatarFallback>{typeInfo.icon}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={`flex items-center ${typeInfo.color} border-0 font-medium shadow-sm`}>
                            {typeInfo.icon}
                            <span className="ml-1 capitalize">{item.type}</span>
                          </Badge>
                          <Badge variant="outline" className={`${priorityColor} border-0 font-medium shadow-sm`}>
                            {formatPriority(item.priority)}
                          </Badge>
                          <Badge variant="outline" className={`flex items-center ${statusInfo.color} border-0 font-medium shadow-sm`}>
                            {statusInfo.icon}
                            {formatStatus(item.status)}
                          </Badge>
                        </div>
                        <time className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed">{item.description}</p>
                      
                      {item.resolved_at && (
                        <div className="mt-3 text-xs bg-green-50 text-green-600 py-1 px-2 rounded inline-flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved: {new Date(item.resolved_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="border-t bg-slate-50/70 px-6 py-3">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-600 border-0">
              Supply: {requests.filter(r => r.type === 'supply').length}
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-600 border-0">
              Maintenance: {requests.filter(r => r.type === 'maintenance').length}
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-600 border-0">
              Suggestions: {requests.filter(r => r.type === 'suggestion').length}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}