"use client"

import { useState } from "react"
import { Check, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

interface TodoListProps {
  effectiveTheme: "dark" | "light"
}

export default function TodoList({ effectiveTheme }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Review pull requests", completed: false, createdAt: "2025-01-01" },
    { id: "2", text: "Update documentation", completed: true, createdAt: "2025-01-01" },
    { id: "3", text: "Deploy to staging", completed: false, createdAt: "2025-01-02" },
  ])

  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTodos([...todos, todo])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updateTodoText = (id: string, text: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
  }

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2 lg:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
          Quick To-Do List
        </CardTitle>
        <Badge className="bg-blue-600/20 text-blue-400">{todos.filter((t) => !t.completed).length} pending</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a quick task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            className={`${effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"}`}
          />
          <Button size="sm" onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} />
          </Button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-2 p-2 rounded ${effectiveTheme === "dark" ? "hover:bg-gray-800/50" : "hover:bg-gray-100"}`}
            >
              <Button size="sm" variant="ghost" onClick={() => toggleTodo(todo.id)} className="p-1 h-6 w-6">
                <Check size={14} className={todo.completed ? "text-green-500" : "text-gray-400"} />
              </Button>
              <Input
                value={todo.text}
                onChange={(e) => updateTodoText(todo.id, e.target.value)}
                className={`flex-1 border-none bg-transparent p-0 h-auto ${todo.completed ? "line-through text-gray-500" : effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteTodo(todo.id)}
                className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
