"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressTrackingProps {
  effectiveTheme: "dark" | "light"
  progressData: {
    daily: { date: string; focusMinutes: number; exerciseMinutes: number; tasksCompleted: number }[]
    weeklyGoals: { focusMinutes: number; exerciseMinutes: number; tasksCompleted: number }
    currentStreak: number
  }
  todayProgress: {
    focusMinutes: number
    exerciseMinutes: number
    tasksCompleted: number
  }
}

export default function ProgressTracking({ effectiveTheme, progressData, todayProgress }: ProgressTrackingProps) {
  const calculateStreak = () => {
    const sortedData = progressData.daily.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0

    for (const day of sortedData) {
      if (day.focusMinutes > 0 || day.exerciseMinutes > 0 || day.tasksCompleted > 0) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2 lg:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
          Daily Progress
        </CardTitle>
        <Badge className="bg-purple-600/20 text-purple-400">{calculateStreak()} day streak</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{todayProgress.focusMinutes}</div>
              <div className="text-xs text-gray-400">Focus Min</div>
              <Progress
                value={getProgressPercentage(todayProgress.focusMinutes, progressData.weeklyGoals.focusMinutes / 7)}
                className="h-1 mt-1"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{todayProgress.exerciseMinutes}</div>
              <div className="text-xs text-gray-400">Exercise Min</div>
              <Progress
                value={getProgressPercentage(
                  todayProgress.exerciseMinutes,
                  progressData.weeklyGoals.exerciseMinutes / 7,
                )}
                className="h-1 mt-1"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{todayProgress.tasksCompleted}</div>
              <div className="text-xs text-gray-400">Tasks Done</div>
              <Progress
                value={getProgressPercentage(todayProgress.tasksCompleted, progressData.weeklyGoals.tasksCompleted / 7)}
                className="h-1 mt-1"
              />
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">7-Day Activity</h4>
            <div className="flex items-end justify-between gap-2 h-20">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const dateStr = date.toISOString().split("T")[0]

                const dayData = progressData.daily.find((d) => d.date === dateStr)
                const totalActivity =
                  (dayData?.focusMinutes || 0) + (dayData?.exerciseMinutes || 0) + (dayData?.tasksCompleted || 0) * 10
                const maxActivity = 100
                const height = Math.min((totalActivity / maxActivity) * 100, 100)

                const isToday = dateStr === new Date().toISOString().split("T")[0]

                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full rounded-md transition-all duration-300 ${
                        height > 70
                          ? "bg-green-500"
                          : height > 40
                            ? "bg-blue-500"
                            : height > 0
                              ? "bg-yellow-500"
                              : "bg-gray-700"
                      } ${isToday ? "ring-2 ring-purple-400" : ""}`}
                      style={{ height: `${Math.max(height, 8)}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">
                      {date.toLocaleDateString("en", { weekday: "short" })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="mt-4 p-3 rounded-lg bg-gray-800/30">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Weekly Goals</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Focus Time</span>
                <span className="text-xs text-orange-400">
                  {progressData.daily.reduce((sum, day) => sum + (day.focusMinutes || 0), 0)} /{" "}
                  {progressData.weeklyGoals.focusMinutes} min
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Exercise</span>
                <span className="text-xs text-green-400">
                  {progressData.daily.reduce((sum, day) => sum + (day.exerciseMinutes || 0), 0)} /{" "}
                  {progressData.weeklyGoals.exerciseMinutes} min
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Tasks</span>
                <span className="text-xs text-blue-400">
                  {progressData.daily.reduce((sum, day) => sum + (day.tasksCompleted || 0), 0)} /{" "}
                  {progressData.weeklyGoals.tasksCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
