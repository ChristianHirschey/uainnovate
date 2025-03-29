"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SupplyItem {
  id: string
  name: string
  level: number
  threshold: number
  unit: string
  lastOrdered: string
}

interface SupplySuggestionsProps {
  fullView?: boolean
}

export function SupplySuggestions({ fullView = false }: SupplySuggestionsProps) {
  const [supplies, setSupplies] = useState<SupplyItem[]>([
    {
      id: "1",
      name: "Printer Paper",
      level: 15,
      threshold: 20,
      unit: "reams",
      lastOrdered: "2023-03-15",
    },
    {
      id: "2",
      name: "Ink Cartridges",
      level: 2,
      threshold: 5,
      unit: "cartridges",
      lastOrdered: "2023-03-01",
    },
    {
      id: "3",
      name: "Sticky Notes",
      level: 8,
      threshold: 10,
      unit: "packs",
      lastOrdered: "2023-02-20",
    },
    {
      id: "4",
      name: "Pens",
      level: 25,
      threshold: 30,
      unit: "boxes",
      lastOrdered: "2023-01-10",
    },
    {
      id: "5",
      name: "Notebooks",
      level: 12,
      threshold: 15,
      unit: "items",
      lastOrdered: "2023-02-05",
    },
    {
      id: "6",
      name: "Staples",
      level: 3,
      threshold: 5,
      unit: "boxes",
      lastOrdered: "2023-01-25",
    },
    {
      id: "7",
      name: "Paper Clips",
      level: 4,
      threshold: 10,
      unit: "boxes",
      lastOrdered: "2023-02-15",
    },
    {
      id: "8",
      name: "Highlighters",
      level: 8,
      threshold: 20,
      unit: "packs",
      lastOrdered: "2023-03-05",
    },
  ])

  const orderSupply = (id: string) => {
    // In a real app, this would trigger an order process
    alert(`Ordering more of item ${id}`)
  }

  const getLevelColor = (level: number, threshold: number) => {
    const percentage = (level / threshold) * 100
    if (percentage <= 30) return "bg-red-500"
    if (percentage <= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const lowSupplies = supplies.filter((supply) => supply.level < supply.threshold)

  return (
    <Card className={cn(fullView ? "col-span-full" : "")}>
      <CardHeader>
        <CardTitle>Supply Suggestions</CardTitle>
        <CardDescription>Items that need to be reordered soon</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={cn("pr-4", fullView ? "h-[400px]" : "h-[200px]")}>
          <div className="space-y-4">
            {(fullView ? supplies : lowSupplies).map((supply) => (
              <div key={supply.id} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{supply.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {supply.level} of {supply.threshold} {supply.unit} remaining
                    </p>
                  </div>
                  {supply.level < supply.threshold && (
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
                  value={(supply.level / supply.threshold) * 100}
                  className={cn("h-2", getLevelColor(supply.level, supply.threshold))}
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

