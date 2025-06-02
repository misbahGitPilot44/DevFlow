"use client"

import { Check, ChevronDown, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface RepositoryStatusProps {
  effectiveTheme: "dark" | "light"
}

export default function RepositoryStatus({ effectiveTheme }: RepositoryStatusProps) {
  const repositories = [
    {
      name: "devflow-frontend",
      status: "Active",
      progress: 85,
      lastCommit: "2h ago",
      color: "green",
    },
    {
      name: "api-gateway",
      status: "Review",
      progress: 65,
      lastCommit: "5h ago",
      color: "blue",
    },
    {
      name: "devops-pipeline",
      status: "Deploy",
      progress: 92,
      lastCommit: "1h ago",
      color: "purple",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600/20 text-green-400 hover:bg-green-600/30"
      case "Review":
        return "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
      case "Deploy":
        return "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30"
      default:
        return "bg-gray-600/20 text-gray-400"
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-600"
      case "blue":
        return "bg-blue-600"
      case "purple":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <>
      {/* Active Repositories */}
      <Card
        className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2 lg:col-span-4`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
            Active Repositories
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Last Commit</span>
            <Button variant="outline" size="sm" className="h-8 border-gray-700 bg-gray-800/50 text-gray-300">
              <ChevronDown size={14} className="ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {repositories.map((repo, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full ${getIconColor(repo.color)} flex items-center justify-center text-white font-medium`}
              >
                <Check size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {repo.name}
                  </span>
                  <Badge className={getStatusColor(repo.status)}>{repo.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Progress value={repo.progress} className="h-2 flex-1" />
                  <span className="ml-4 text-gray-400 text-sm">{repo.lastCommit}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sprint Progress */}
      <Card
        className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
            Sprint Progress
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
            <MoreVertical size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-4xl font-bold ${effectiveTheme === "dark" ? "text-gray-100" : "text-gray-900"}`}>8</h2>
            <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">+75%</Badge>
            <span className="text-gray-400 text-sm">tasks completed</span>
          </div>
          <div className="mt-6 flex items-end justify-between gap-2 h-20">
            {[60, 80, 95, 70, 85, 90, 100].map((value, i) => (
              <div
                key={i}
                className={`w-full rounded-md ${i >= 4 ? "bg-green-500" : i >= 2 ? "bg-blue-500" : "bg-gray-700"}`}
                style={{ height: `${value}%` }}
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Workload */}
      <Card
        className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
            Team Workload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400">Frontend</span>
                <span className={`ml-auto ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>45%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-gray-400">Backend</span>
                <span className={`ml-auto ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>32%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-400">DevOps</span>
                <span className={`ml-auto ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>23%</span>
              </div>
            </div>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${effectiveTheme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    12
                  </div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
              </div>
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#1f2937" strokeWidth="2"></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset="25"
                  transform="rotate(-90 18 18)"
                ></circle>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
