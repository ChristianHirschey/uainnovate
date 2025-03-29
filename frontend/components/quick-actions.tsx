"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Mail, PlusCircle, Printer, CalendarIcon, UserPlus } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
      label: "New Order",
      onClick: () => alert("Create new order"),
    },
    {
      icon: <Printer className="h-4 w-4 mr-2" />,
      label: "Print Report",
      onClick: () => alert("Print report"),
    },
    {
      icon: <CalendarIcon className="h-4 w-4 mr-2" />,
      label: "Schedule Meeting",
      onClick: () => alert("Schedule meeting"),
    },
    {
      icon: <UserPlus className="h-4 w-4 mr-2" />,
      label: "Add Staff",
      onClick: () => alert("Add staff member"),
    },
    {
      icon: <FileText className="h-4 w-4 mr-2" />,
      label: "Create Document",
      onClick: () => alert("Create document"),
    },
    {
      icon: <Mail className="h-4 w-4 mr-2" />,
      label: "Send Email",
      onClick: () => alert("Send email"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used admin actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="justify-start h-auto py-3" onClick={action.onClick}>
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

