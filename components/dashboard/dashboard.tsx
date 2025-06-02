"use client"

import { useState, useEffect } from "react"
import { Bell, Moon, Sun, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TaskManagement from "./task-management"
import WorkoutCamera from "./workout-camera"
import TodoList from "./todo-list"
import FocusTimer from "./focus-timer"
import ExerciseTracker from "./exercise-tracker"
import MusicPlayer from "./music-player"
import ProgressTracking from "./progress-tracking"
import RepositoryStatus from "./repository-status"
import { Timer, Activity } from "lucide-react"

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light" | "auto">("dark")
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark")

  // Progress Tracking State
  const [progressData, setProgressData] = useState<{
    daily: { date: string; focusMinutes: number; exerciseMinutes: number; tasksCompleted: number }[]
    weeklyGoals: { focusMinutes: number; exerciseMinutes: number; tasksCompleted: number }
    currentStreak: number
  }>({
    daily: [],
    weeklyGoals: { focusMinutes: 150, exerciseMinutes: 300, tasksCompleted: 10 },
    currentStreak: 0,
  })

  const [todayProgress, setTodayProgress] = useState({
    focusMinutes: 0,
    exerciseMinutes: 0,
    tasksCompleted: 0,
  })

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Determine effective theme
  const effectiveTheme = theme === "auto" ? systemTheme : theme

  // Load progress data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("userProgress")
    const savedTodayProgress = localStorage.getItem("todayProgress")

    if (savedProgress) {
      try {
        setProgressData(JSON.parse(savedProgress))
      } catch (error) {
        console.error("Error loading progress data:", error)
      }
    }

    if (savedTodayProgress) {
      try {
        const parsed = JSON.parse(savedTodayProgress)
        const today = new Date().toISOString().split("T")[0]

        if (parsed.date === today) {
          setTodayProgress(parsed.progress)
        }
      } catch (error) {
        console.error("Error loading today's progress:", error)
      }
    }
  }, [])

  // Save progress data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("userProgress", JSON.stringify(progressData))
    } catch (error) {
      console.error("Error saving progress data:", error)
    }
  }, [progressData])

  // Save today's progress to localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(
        "todayProgress",
        JSON.stringify({
          date: today,
          progress: todayProgress,
        }),
      )
    } catch (error) {
      console.error("Error saving today's progress:", error)
    }
  }, [todayProgress])

  // Update progress tracking
  const updateTodayProgress = (type: "focus" | "exercise" | "task", value: number) => {
    const today = new Date().toISOString().split("T")[0]

    setTodayProgress((prev) => {
      const updated = { ...prev }
      if (type === "focus") updated.focusMinutes += value
      if (type === "exercise") updated.exerciseMinutes += value
      if (type === "task") updated.tasksCompleted += value

      // Update daily progress data
      setProgressData((prevData) => {
        const newDaily = [...prevData.daily]
        const todayIndex = newDaily.findIndex((d) => d.date === today)

        if (todayIndex >= 0) {
          newDaily[todayIndex] = {
            date: today,
            focusMinutes: updated.focusMinutes,
            exerciseMinutes: updated.exerciseMinutes,
            tasksCompleted: updated.tasksCompleted,
          }
        } else {
          newDaily.push({
            date: today,
            focusMinutes: updated.focusMinutes,
            exerciseMinutes: updated.exerciseMinutes,
            tasksCompleted: updated.tasksCompleted,
          })
        }

        const last7Days = newDaily.slice(-7)
        return { ...prevData, daily: last7Days }
      })

      return updated
    })
  }

  // Navigation function to scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })

      // Add highlight effect
      element.style.transform = "scale(1.02)"
      element.style.transition = "transform 0.3s ease-in-out"
      element.style.boxShadow = "0 0 20px rgba(34, 197, 94, 0.3)"

      setTimeout(() => {
        element.style.transform = "scale(1)"
        element.style.boxShadow = "none"
      }, 1000)
    }
  }

  return (
    <div
      className={`min-h-screen ${effectiveTheme === "dark" ? "bg-[#0d1525] text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 py-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <span className="text-2xl font-semibold text-green-400">DevFlow</span>
          </div>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`px-4 py-2 ${effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800" : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"} rounded-full min-w-[200px] justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    Navigate to Section
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem
                  onClick={() => scrollToSection("task-management")}
                  className="flex items-center gap-2"
                >
                  <Check size={16} className="text-green-500" />
                  Task Management
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("todo-list")} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                  </svg>
                  Todo List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("focus-timer")} className="flex items-center gap-2">
                  <Timer size={16} className="text-orange-500" />
                  Focus Timer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => scrollToSection("exercise-tracker")}
                  className="flex items-center gap-2"
                >
                  <Activity size={16} className="text-cyan-500" />
                  Exercise Tracker
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("music-player")} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-500"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                    <path d="m15.5 3.5-3.5 3.5-3.5-3.5"></path>
                    <path d="m15.5 20.5-3.5-3.5-3.5 3.5"></path>
                  </svg>
                  Music Player
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("workout-camera")} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  Workout Camera
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => scrollToSection("progress-tracking")}
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-500"
                  >
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                  </svg>
                  Progress Tracking
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => scrollToSection("repository-status")}
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-500"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path>
                  </svg>
                  Repository Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400">
                  {theme === "dark" ? (
                    <Moon size={20} />
                  ) : theme === "light" ? (
                    <Sun size={20} />
                  ) : (
                    <div className="relative">
                      <Sun size={20} />
                      <Moon size={12} className="absolute -top-1 -right-1" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun size={16} />
                    Light
                  </div>
                  {theme === "light" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={16} />
                    Dark
                  </div>
                  {theme === "dark" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("auto")} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Sun size={16} />
                      <Moon size={10} className="absolute -top-0.5 -right-0.5" />
                    </div>
                    Auto
                  </div>
                  {theme === "auto" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
            <Avatar className="h-9 w-9 border-2 border-green-500">
              <AvatarImage src="/placeholder.svg?height=36&width=36" />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div id="task-management">
            <TaskManagement effectiveTheme={effectiveTheme} updateProgress={updateTodayProgress} />
          </div>
          <div id="todo-list">
            <TodoList effectiveTheme={effectiveTheme} />
          </div>
          <div id="focus-timer">
            <FocusTimer effectiveTheme={effectiveTheme} updateProgress={updateTodayProgress} />
          </div>
          <div id="exercise-tracker">
            <ExerciseTracker effectiveTheme={effectiveTheme} updateProgress={updateTodayProgress} />
          </div>
          <div id="music-player">
            <MusicPlayer effectiveTheme={effectiveTheme} />
          </div>
          <div id="workout-camera">
            <WorkoutCamera effectiveTheme={effectiveTheme} />
          </div>
          <div id="progress-tracking">
            <ProgressTracking
              effectiveTheme={effectiveTheme}
              progressData={progressData}
              todayProgress={todayProgress}
            />
          </div>
          <div id="repository-status">
            <RepositoryStatus effectiveTheme={effectiveTheme} />
          </div>
        </div>
      </div>
    </div>
  )
}
