"use client"

import '../app/globals.css';
import { useState, useEffect } from "react"
import { Feedback } from "@/components/feedback"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function FeedbackPage() {
  const supabase = createClient();

  // Auth-related state
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [open, setOpen] = useState(false)

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
    <div className="flex w-full">
      <DashboardSidebar open={open} setOpen={setOpen} />
      <div className="flex-1">
        <div>
            <Feedback />
        </div>
      </div>
    </div>
  )
}