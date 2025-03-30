"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoList } from "@/components/todo-list"
import { SupplySuggestions } from "@/components/supply-suggestions"
import { Feedback } from "@/components/feedback"
import { QuickActions } from "@/components/quick-actions"
import { Calendar } from "@/components/calendar"
import { Notifications } from "@/components/notifications"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TodoList />
                <QuickActions />
                <Notifications />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SupplySuggestions />
                <Calendar />
              </div>
            </TabsContent>
            <TabsContent value="orders" className="space-y-4">
              <TodoList fullView />
            </TabsContent>
            <TabsContent value="supplies" className="space-y-4">
              <SupplySuggestions fullView />
            </TabsContent>
            <TabsContent value="feedback" className="space-y-4">
              <Feedback />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

