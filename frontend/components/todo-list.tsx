"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Todo {
  id: string
  text: string
  completed: boolean
  category: "orders" | "supplies" | "general"
  priority: "high" | "medium" | "low"
}

interface TodoListProps {
  fullView?: boolean
}

export function TodoList({ fullView = false }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      text: "Process new office supply order",
      completed: false,
      category: "orders",
      priority: "high",
    },
    {
      id: "2",
      text: "Follow up on printer repair",
      completed: false,
      category: "general",
      priority: "medium",
    },
    {
      id: "3",
      text: "Order more paper for copier",
      completed: false,
      category: "supplies",
      priority: "high",
    },
    {
      id: "4",
      text: "Schedule meeting room for quarterly review",
      completed: true,
      category: "general",
      priority: "medium",
    },
    {
      id: "5",
      text: "Approve catering order for Friday's lunch",
      completed: false,
      category: "orders",
      priority: "low",
    },
    {
      id: "6",
      text: "Check inventory of office chairs",
      completed: false,
      category: "supplies",
      priority: "low",
    },
  ])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          category: "general",
          priority: "medium",
        },
      ])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const renderTodoItem = (todo: Todo) => (
    <div key={todo.id} className="flex items-center justify-between gap-2 rounded-md border p-2 hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleTodo(todo.id)}>
          {todo.completed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
          <span className="sr-only">{todo.completed ? "Mark as incomplete" : "Mark as complete"}</span>
        </Button>
        <span className={cn("text-sm", todo.completed && "line-through text-muted-foreground")}>{todo.text}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("text-xs", getPriorityColor(todo.priority))}>
          {todo.priority}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )

  return (
    <Card className={cn(fullView ? "col-span-full" : "")}>
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
        <CardDescription>Manage your tasks and orders</CardDescription>
      </CardHeader>
      <CardContent>
        {fullView ? (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="supplies">Supplies</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">{todos.map(renderTodoItem)}</div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="orders">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {todos.filter((todo) => todo.category === "orders").map(renderTodoItem)}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="supplies">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {todos.filter((todo) => todo.category === "supplies").map(renderTodoItem)}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="general">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {todos.filter((todo) => todo.category === "general").map(renderTodoItem)}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {todos
                .filter((todo) => !todo.completed)
                .slice(0, 5)
                .map(renderTodoItem)}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter>
        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            addTodo()
          }}
        >
          <Input placeholder="Add a new task..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

