"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, TrendingUp, Zap } from "lucide-react"

interface Participant {
  id: string
  name: string
  email: string
  avatar: string
  status: "pending" | "responded" | "viewing"
  responseTime?: string
  availabilityHours?: number
}

interface RealTimeTrackerProps {
  meetingId: string
  totalInvited: number
}

export function RealTimeTracker({ meetingId, totalInvited }: RealTimeTrackerProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@company.com",
      avatar: "AJ",
      status: "responded",
      responseTime: "2 minutes ago",
      availabilityHours: 24,
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      avatar: "SC",
      status: "viewing",
      responseTime: "Just now",
    },
    {
      id: "3",
      name: "Marcus Wilson",
      email: "marcus.wilson@company.com",
      avatar: "MW",
      status: "responded",
      responseTime: "5 minutes ago",
      availabilityHours: 18,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      avatar: "ED",
      status: "pending",
    },
  ])

  const [liveStats, setLiveStats] = useState({
    totalResponses: 2,
    averageAvailability: 21,
    responseRate: 50,
    optimalTimeFound: false,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update participant statuses
      setParticipants((prev) =>
        prev.map((p) => {
          if (Math.random() < 0.1) {
            // 10% chance of status change
            if (p.status === "pending" && Math.random() < 0.3) {
              return { ...p, status: "viewing", responseTime: "Just now" }
            }
            if (p.status === "viewing" && Math.random() < 0.5) {
              return {
                ...p,
                status: "responded",
                responseTime: "Just now",
                availabilityHours: Math.floor(Math.random() * 30) + 10,
              }
            }
          }
          return p
        }),
      )

      // Update live stats
      setLiveStats((prev) => ({
        ...prev,
        totalResponses: participants.filter((p) => p.status === "responded").length,
        responseRate: Math.round((participants.filter((p) => p.status === "responded").length / totalInvited) * 100),
        averageAvailability: Math.round(
          participants.filter((p) => p.availabilityHours).reduce((sum, p) => sum + (p.availabilityHours || 0), 0) /
            Math.max(participants.filter((p) => p.availabilityHours).length, 1),
        ),
        optimalTimeFound: participants.filter((p) => p.status === "responded").length >= 3,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [participants, totalInvited])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responded":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "viewing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "pending":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "viewing":
        return <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
      case "responded":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-2)] flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {liveStats.totalResponses}/{totalInvited}
                </p>
                <p className="text-sm text-muted-foreground">Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--thermal-2)] to-[var(--thermal-3)] flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{liveStats.averageAvailability}h</p>
                <p className="text-sm text-muted-foreground">Avg Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--thermal-3)] to-[var(--thermal-4)] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{liveStats.responseRate}%</p>
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  liveStats.optimalTimeFound
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gradient-to-br from-[var(--thermal-4)] to-[var(--thermal-5)]"
                }`}
              >
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{liveStats.optimalTimeFound ? "✓" : "..."}</p>
                <p className="text-sm text-muted-foreground">AI Optimizing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Progress */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Response Progress
          </CardTitle>
          <CardDescription>Live tracking of participant responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collection Progress</span>
              <span>{liveStats.responseRate}% complete</span>
            </div>
            <Progress value={liveStats.responseRate} className="h-2" />
          </div>

          {liveStats.optimalTimeFound && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Optimal time slot identified!</span>
              </div>
              <p className="text-sm text-green-600/80 mt-1">
                AI has found a time that works for {liveStats.totalResponses} participants
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Participant List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Participant Activity
          </CardTitle>
          <CardDescription>Real-time status of all invited participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-2)] text-white">
                        {participant.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">{getStatusIcon(participant.status)}</div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">{participant.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {participant.availabilityHours && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{participant.availabilityHours}h</p>
                      <p className="text-xs text-muted-foreground">available</p>
                    </div>
                  )}
                  <div className="text-right">
                    <Badge className={getStatusColor(participant.status)}>{participant.status}</Badge>
                    {participant.responseTime && (
                      <p className="text-xs text-muted-foreground mt-1">{participant.responseTime}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
