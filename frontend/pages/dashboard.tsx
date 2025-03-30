"use client"
import '../app/globals.css';
import { useEffect } from "react"
import { useRouter } from "next/navigation"


import { DashboardLayout } from "@/components/dashboard-layout"
export default function Dashboard() {
    const router = useRouter();
    
    useEffect(() => {
        // Redirect to /qr_request if the screen size is too small
        if (window.innerWidth < 768) {
          router.push('/qr_request');
        }
      }, []);

    return <DashboardLayout />
}