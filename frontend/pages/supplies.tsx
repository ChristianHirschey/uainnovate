"use client"

import '../app/globals.css';
import { useState, useEffect } from "react"
import { ShoppingCart, Package, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

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

export default function SupplySuggestions({ fullView = false }: SupplySuggestionsProps) {
  const supabase = createClient();
  
  // Auth-related state
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupplies()
  }, [])

  const fetchSupplies = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/supplies')
      const data = await response.json()
      setSupplies(data)
    } catch (error) {
      console.error('Error fetching supplies:', error)
    } finally {
      setLoading(false)
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
          user_id: null
        }),
      })
      if (response.ok) {
        fetchSupplies()
      }
    } catch (error) {
      console.error('Error restocking supply:', error)
    }
  }

  const getStockStatus = (current: number, max: number, threshold: number) => {
    
    if (current < threshold) {
      return {
        color: "bg-red-500",
        textColor: "text-red-600",
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        label: "Low Stock"
      }
    }
    
    if (current < 2 * threshold) {
      return {
        color: "bg-yellow-500",
        textColor: "text-yellow-600",
        icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
        label: "Medium Stock"
      }
    }
    
    return {
      color: "bg-green-500",
      textColor: "text-green-600",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      label: "Good Stock"
    }
  }

  // Group and sort supplies by priority (low stock first, then all others)
  const groupedSupplies = () => {
    // Create a copy of supplies
    const allSupplies = [...supplies]
    
    // Separate low stock items
    const lowStock = allSupplies.filter(s => s.current_stock < s.threshold)
      .sort((a, b) => {
        // Sort by percentage of stock remaining (ascending)
        const aPercentage = (a.current_stock / a.max_stock)
        const bPercentage = (b.current_stock / b.max_stock)
        return aPercentage - bPercentage
      })
    
    // All other items
    const normalStock = allSupplies.filter(s => s.current_stock >= s.threshold)
      .sort((a, b) => {
        // Sort by percentage of stock remaining (ascending)
        const aPercentage = (a.current_stock / a.max_stock)
        const bPercentage = (b.current_stock / b.max_stock)
        return aPercentage - bPercentage
      })
    
    // Combine with low stock first
    return [...lowStock, ...normalStock]
  }
  
  const sortedSupplies = groupedSupplies()

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

      <Card className="flex-1">
        <CardHeader className="pb-3 border-b mb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Supply Inventory</CardTitle>
              <CardDescription className="mt-1">
                {supplies.filter(s => s.current_stock < s.threshold).length > 0 ? (
                  <span className="text-red-600 font-medium">
                    {supplies.filter(s => s.current_stock < s.threshold).length} items need attention
                  </span>
                ) : (
                  "All inventory levels are normal"
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                Low Stock: {supplies.filter(s => s.current_stock < s.threshold).length}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSupplies}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading supplies...</p>
            </div>
          ) : (
            <ScrollArea className="pr-4 max-h-[600px] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedSupplies.map((supply) => {
                  const status = getStockStatus(supply.current_stock, supply.max_stock, supply.threshold)
                  const percentage = Math.round((supply.current_stock / supply.max_stock) * 100)
                  
                  return (
                    <div 
                      key={supply.id} 
                      className={cn(
                        "p-4 rounded-lg border shadow-sm transition-all hover:shadow-md",
                        supply.current_stock < supply.threshold 
                          ? "border-red-200 bg-red-50/50" 
                          : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h3 className="font-medium">{supply.name}</h3>
                          <div className="flex items-center gap-2">
                            {status.icon}
                            <p className={cn("text-xs font-medium", status.textColor)}>
                              {status.label}
                            </p>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="bg-slate-50">
                          {supply.current_stock} / {supply.max_stock} {supply.unit}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Current: {percentage}%</span>
                          <span>Threshold: {Math.round((supply.threshold / supply.max_stock) * 100)}%</span>
                        </div>
                        
                        <Progress
                          value={percentage}
                          className={cn("h-2", status.color)}
                        />
                      </div>
                      
                      {supply.current_stock < supply.threshold && (
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={async () => {
                              await orderSupply(supply.id); // Call orderSupply
                              const newTab = window.open(supply.purchase_url, "_blank", "noopener,noreferrer"); // Open in a new tab without focus
                              if (newTab) {
                                window.focus(); // Refocus the current tab
                              }
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Order Now (${supply.purchase_price.toFixed(2)})
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
        
        <CardFooter className="border-t bg-slate-50 px-6 py-3">
          <div className="flex w-full justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <span>Total Items: {supplies.length}</span>
            </div>
            
            {supplies.filter(s => s.current_stock < s.threshold).length > 0 && (
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  const lowStockItems = supplies.filter(s => s.current_stock < s.threshold);
                
                  // Open purchase URLs immediately to avoid popup blockers
                  lowStockItems.forEach(item => {
                    if (item.purchase_url) {
                      // Open each purchase URL in a new tab synchronously
                      window.open(item.purchase_url, `_blank_${item.id}`, "noopener,noreferrer");
                    }
                  });
                
                  // Then optionally trigger your async logic afterward (won't block popups)
                  lowStockItems.forEach(async item => {
                    await orderSupply(item.id);
                  });
                }}
                
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order All Low Stock Items
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}