"use client"
import Link from "next/link"
import {
  BarChart3,
  CalendarIcon,
  ClipboardList,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ClipboardList className="h-6 w-6" />
          <span>Admin Portal</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Supplies
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="#" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>
        </nav>
      </ScrollArea>
    </div>
  )
}

