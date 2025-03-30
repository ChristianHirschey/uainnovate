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
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"

export function DashboardLayout() {
  const supabase = createClient();
  
  // Auth-related state
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, [supabase]);
  
  // Render a loading indicator while user data is loading.
  if (loadingUser) {
    return <div>Loading user data...</div>;
  }
  
  // If no user is found, prompt sign in.
  if (!user) {
    return <div>No user found. Please sign in.</div>;
  }
  
  // Check admin rights. Adjust this check if you store admin info differently.
  const userRole = user!.role?.toString().trim().toLowerCase() || "";
  if (userRole !== "admin") {
    return (
      <div className="unauthorized">
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <TodoList />
                <SupplySuggestions />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Notifications />
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

