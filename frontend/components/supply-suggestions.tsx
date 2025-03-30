"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Supply {
  id: string
  name: string
  current_stock: number
  max_stock: number
  threshold: number
  unit: string
  purchase_url?: string
  purchase_price: number
  created_at: string
  updated_at: string
}

interface SupplySuggestionsProps {
  fullView?: boolean
}

export function SupplySuggestions({ fullView = false }: SupplySuggestionsProps) {
  const [supplies, setSupplies] = useState<Supply[]>([])

  useEffect(() => {
    fetchSupplies()
  }, [])

  const fetchSupplies = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/supplies')
      const data = await response.json()
      setSupplies(data)
    } catch (error) {
      console.error('Error fetching supplies:', error)
    }
  }

  const orderSupply = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/supplies/${id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          user_id: null // Add user_id if you have user authentication
        }),
      })
      if (response.ok) {
        fetchSupplies() // Refresh the list
      }
    } catch (error) {
      console.error('Error restocking supply:', error)
    }
  }

  const getLevelColor = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100
    if (percentage <= 30) return "bg-red-500"
    if (percentage <= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const lowSupplies = supplies.filter((supply) => supply.current_stock < supply.threshold)

  return (
    <Card className={cn(fullView ? "col-span-full" : "")}>
      <CardHeader>
        <CardTitle>Supply Suggestions</CardTitle>
        <CardDescription>Items that need to be reordered soon</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={cn("pr-4", fullView ? "h-[400px]" : "h-[285px]")}>
          <div className="space-y-4">
            {(fullView ? supplies : lowSupplies).map((supply) => (
              <div key={supply.id} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{supply.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {supply.current_stock} of {supply.max_stock} {supply.unit} remaining
                    </p>
                  </div>
                  {supply.current_stock < supply.threshold && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => orderSupply(supply.id)}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Order
                    </Button>
                  )}
                </div>
                <Progress
                  value={(supply.current_stock / supply.max_stock) * 100}
                  className={cn("h-2", getLevelColor(supply.current_stock, supply.threshold))}
                />
              </div>
            ))}
            {lowSupplies.length === 0 && !fullView && (
              <p className="text-center text-sm text-muted-foreground">All supplies are at adequate levels</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

