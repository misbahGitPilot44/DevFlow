"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Activity, Footprints, MapPin, Flame, Heart, Play, Pause, RotateCcw, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExerciseTrackerProps {
  effectiveTheme: "dark" | "light"
  updateProgress?: (type: "focus" | "exercise" | "task", value: number) => void
}

export default function ExerciseTracker({ effectiveTheme, updateProgress }: ExerciseTrackerProps) {
  const [selectedExercise, setSelectedExercise] = useState<"walking" | "running" | "cycling" | null>(null)
  const [exerciseTimer, setExerciseTimer] = useState({ hours: 0, minutes: 0, seconds: 0, isRunning: false })
  const [exerciseMetrics, setExerciseMetrics] = useState({
    steps: 0,
    distance: 0,
    calories: 0,
    heartRate: 0,
  })
  const [showExerciseSelection, setShowExerciseSelection] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (exerciseTimer.isRunning) {
      interval = setInterval(() => {
        setExerciseTimer((prev) => {
          const newSeconds = prev.seconds + 1
          if (newSeconds >= 60) {
            const newMinutes = prev.minutes + 1
            if (newMinutes >= 60) {
              return { hours: prev.hours + 1, minutes: 0, seconds: 0, isRunning: true }
            }
            return { ...prev, minutes: newMinutes, seconds: 0 }
          }
          return { ...prev, seconds: newSeconds }
        })

        if (selectedExercise) {
          setExerciseMetrics((prev) => ({
            steps: prev.steps + Math.floor(Math.random() * 3),
            distance: prev.distance + Math.random() * 0.01,
            calories: prev.calories + Math.floor(Math.random() * 2),
            heartRate: 120 + Math.floor(Math.random() * 40),
          }))
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [exerciseTimer.isRunning, selectedExercise])

  const startExercise = (exercise: "walking" | "running" | "cycling") => {
    setSelectedExercise(exercise)
    setShowExerciseSelection(false)
    setExerciseTimer({ hours: 0, minutes: 0, seconds: 0, isRunning: true })
    setExerciseMetrics({ steps: 0, distance: 0, calories: 0, heartRate: 0 })
  }

  const stopExercise = () => {
    setExerciseTimer((prev) => ({ ...prev, isRunning: false }))
  }

  const resetExercise = () => {
    if (updateProgress && (exerciseTimer.minutes > 0 || exerciseTimer.hours > 0)) {
      const totalMinutes = exerciseTimer.hours * 60 + exerciseTimer.minutes
      updateProgress("exercise", totalMinutes)
    }

    setSelectedExercise(null)
    setShowExerciseSelection(true)
    setExerciseTimer({ hours: 0, minutes: 0, seconds: 0, isRunning: false })
    setExerciseMetrics({ steps: 0, distance: 0, calories: 0, heartRate: 0 })
  }

  const getExerciseIcon = (exercise: string) => {
    switch (exercise) {
      case "walking":
        return Footprints
      case "running":
        return Activity
      case "cycling":
        return Activity
      default:
        return Activity
    }
  }

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
          Exercise Tracker
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
            <ImageIcon size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
            <Activity size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showExerciseSelection ? (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm mb-4">Choose your workout</p>

            <div className="space-y-2">
              <Button
                onClick={() => startExercise("walking")}
                className="w-full h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white justify-start px-4"
              >
                <Footprints size={24} className="mr-3" />
                <span className="text-lg font-medium">WALKING</span>
              </Button>

              <Button
                onClick={() => startExercise("running")}
                className="w-full h-16 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white justify-start px-4"
              >
                <Activity size={24} className="mr-3" />
                <span className="text-lg font-medium">RUNNING</span>
              </Button>

              <Button
                onClick={() => startExercise("cycling")}
                className="w-full h-16 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white justify-start px-4"
              >
                <Activity size={24} className="mr-3" />
                <span className="text-lg font-medium">CYCLING</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedExercise &&
                  React.createElement(getExerciseIcon(selectedExercise), {
                    size: 20,
                    className: "text-green-400",
                  })}
                <span className="text-lg font-medium text-green-400 uppercase">{selectedExercise}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={
                    exerciseTimer.isRunning
                      ? stopExercise
                      : () => setExerciseTimer((prev) => ({ ...prev, isRunning: true }))
                  }
                  className="bg-green-500 hover:bg-green-600"
                >
                  {exerciseTimer.isRunning ? <Pause size={14} /> : <Play size={14} />}
                </Button>
                <Button size="sm" variant="outline" onClick={resetExercise}>
                  <RotateCcw size={14} />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-4">
                {String(exerciseTimer.hours).padStart(2, "0")}:{String(exerciseTimer.minutes).padStart(2, "0")}:
                {String(exerciseTimer.seconds).padStart(2, "0")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Footprints size={16} className="text-cyan-400" />
                  <span className="text-sm text-gray-400">Steps</span>
                </div>
                <div className="text-xl font-bold text-white">{exerciseMetrics.steps}</div>
              </div>

              <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-400">Km</span>
                </div>
                <div className="text-xl font-bold text-white">{exerciseMetrics.distance.toFixed(1)}</div>
              </div>

              <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-sm text-gray-400">Kcal</span>
                </div>
                <div className="text-xl font-bold text-white">{exerciseMetrics.calories}</div>
              </div>

              <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={16} className="text-red-400" />
                  <span className="text-sm text-gray-400">Bpm</span>
                </div>
                <div className="text-xl font-bold text-white">{exerciseMetrics.heartRate}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
