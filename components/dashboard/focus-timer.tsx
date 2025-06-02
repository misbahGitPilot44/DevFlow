"use client"

import { useState, useEffect } from "react"
import { Timer, Play, Pause, RotateCcw, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FocusTimerProps {
  effectiveTheme: "dark" | "light"
  updateProgress?: (type: "focus" | "exercise" | "task", value: number) => void
}

export default function FocusTimer({ effectiveTheme, updateProgress }: FocusTimerProps) {
  const [focusTimer, setFocusTimer] = useState({ minutes: 25, seconds: 0, isRunning: false })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (focusTimer.isRunning) {
      interval = setInterval(() => {
        setFocusTimer((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 }
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
          } else {
            return { ...prev, isRunning: false }
          }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [focusTimer.isRunning])

  const toggleTimer = () => {
    setFocusTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }))
  }

  const resetTimer = () => {
    if (updateProgress && focusTimer.minutes < 25) {
      const minutesUsed = 25 - focusTimer.minutes
      updateProgress("focus", minutesUsed)
    }
    setFocusTimer({ minutes: 25, seconds: 0, isRunning: false })
  }

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
          Focus Timer
        </CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
          <MoreVertical size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <Timer className="h-10 w-10 text-orange-400" />
              <div>
                <h3 className={`text-lg font-medium ${effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Pomodoro Session
                </h3>
                <p className="text-orange-400">Deep Work Mode</p>
                <p className="text-gray-400 text-sm">Stay focused & productive</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-orange-400">
              {String(focusTimer.minutes).padStart(2, "0")}:{String(focusTimer.seconds).padStart(2, "0")}
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={toggleTimer} className="bg-orange-500 hover:bg-orange-600">
                {focusTimer.isRunning ? <Pause size={14} /> : <Play size={14} />}
              </Button>
              <Button size="sm" variant="outline" onClick={resetTimer}>
                <RotateCcw size={14} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
