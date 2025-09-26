"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, Users, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import { RealTimeTracker } from "@/components/real-time-tracker"

interface MeetingInvite {
  id: string
  title: string
  description: string
  organizer: string
  type: string
  duration: number
  participants: number
  deadline: string
  constraints: string[]
}

// Mock meeting data based on invite ID
const getMeetingData = (id: string): MeetingInvite => {
  const meetings: { [key: string]: MeetingInvite } = {
    "team-standup": {
      id: "team-standup",
      title: "Weekly Team Standup",
      description: "Our regular team sync to discuss progress, blockers, and upcoming priorities",
      organizer: "Sarah Chen",
      type: "Team Meeting",
      duration: 60,
      participants: 8,
      deadline: "2024-01-15",
      constraints: ["Business hours only", "No Fridays after 3 PM", "Minimum 2-hour notice"],
    },
    "study-group": {
      id: "study-group",
      title: "CS 229 Study Session",
      description: "Machine Learning final exam prep - covering supervised learning and neural networks",
      organizer: "Marcus Johnson",
      type: "Study Group",
      duration: 120,
      participants: 6,
      deadline: "2024-01-12",
      constraints: ["Evenings preferred", "Library availability", "Weekend sessions OK"],
    },
    "photo-walk": {
      id: "photo-walk",
      title: "Golden Hour Photography Walk",
      description: "Exploring downtown architecture during golden hour - bring your camera!",
      organizer: "Emily Rodriguez",
      type: "Club Event",
      duration: 180,
      participants: 12,
      deadline: "2024-01-10",
      constraints: ["Weather dependent", "Sunset timing", "Public transport accessible"],
    },
  }

  return meetings[id] || meetings["team-standup"]
}

export default function InvitePage() {
  const params = useParams()
  const [meeting, setMeeting] = useState<MeetingInvite | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [availabilityData, setAvailabilityData] = useState<{ [key: string]: { [key: number]: boolean } }>({})
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [showRealTimeTracker, setShowRealTimeTracker] = useState(false)

  useEffect(() => {
    if (params.id) {
      const meetingData = getMeetingData(params.id as string)
      setMeeting(meetingData)
      setParticipantCount(Math.floor(Math.random() * meetingData.participants) + 1)

      // Initialize availability data
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      const hours = Array.from({ length: 24 }, (_, i) => i)
      const data: { [key: string]: { [key: number]: boolean } } = {}

      days.forEach((day) => {
        data[day] = {}
        hours.forEach((hour) => {
          data[day][hour] = false
        })
      })

      setAvailabilityData(data)
    }
  }, [params.id])

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleCellClick = (day: string, hour: number) => {
    if (isSubmitted) return

    const cellId = `${day}-${hour}`
    const newSelectedCells = new Set(selectedCells)
    const newAvailabilityData = { ...availabilityData }

    if (newSelectedCells.has(cellId)) {
      newSelectedCells.delete(cellId)
      newAvailabilityData[day][hour] = false
    } else {
      newSelectedCells.add(cellId)
      newAvailabilityData[day][hour] = true
    }

    setSelectedCells(newSelectedCells)
    setAvailabilityData(newAvailabilityData)
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return "12 PM"
    return `${hour - 12} PM`
  }

  const handleSubmit = async () => {
    if (!userName || !userEmail) return

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitted(true)
    setShowRealTimeTracker(true) // Show real-time tracker after submission
  }

  const getSelectedHours = () => {
    return selectedCells.size
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-foreground">Loading invitation...</span>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto border-[var(--thermal-2)] mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-3)] flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">Availability Submitted!</CardTitle>
              <CardDescription>Your availability has been recorded and the organizer will be notified</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">You selected</p>
                <p className="text-2xl font-bold text-[var(--thermal-2)]">{getSelectedHours()} hours</p>
                <p className="text-xs text-muted-foreground">of availability</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-[var(--thermal-3)]" />
                <span>AI optimization will find the best time for everyone</span>
              </div>
            </CardContent>
          </Card>

          {showRealTimeTracker && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Live Response Tracking</h2>
                <p className="text-muted-foreground">See how others are responding in real-time</p>
              </div>
              <RealTimeTracker meetingId={meeting.id} totalInvited={meeting.participants} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-4)] flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">You're invited to join</h1>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-4)] mb-4">
            {meeting.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{meeting.description}</p>
        </div>

        {/* Meeting Info */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Meeting Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-[var(--thermal-2)] mb-1">{meeting.duration}min</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-[var(--thermal-3)] mb-1">
                    {participantCount}/{meeting.participants}
                  </div>
                  <div className="text-xs text-muted-foreground">Responses</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-[var(--thermal-4)] mb-1">{meeting.organizer}</div>
                  <div className="text-xs text-muted-foreground">Organizer</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-[var(--thermal-1)] mb-1">{meeting.deadline}</div>
                  <div className="text-xs text-muted-foreground">Deadline</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Scheduling Constraints:</h4>
                <div className="flex flex-wrap gap-2">
                  {meeting.constraints.map((constraint, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {constraint}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Info Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Let us know who you are</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Grid */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Your Availability
                  </CardTitle>
                  <CardDescription>
                    Click on time slots when you're available. Selected: {getSelectedHours()} hours
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI will optimize
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Hour headers */}
                    <div className="grid grid-cols-25 gap-1 mb-2">
                      <div className="text-xs font-medium text-muted-foreground p-2"></div>
                      {hours.map((hour) => (
                        <div key={hour} className="text-xs font-medium text-muted-foreground text-center p-1">
                          {hour % 4 === 0 ? formatHour(hour) : ""}
                        </div>
                      ))}
                    </div>

                    {/* Grid */}
                    {days.map((day) => (
                      <div key={day} className="grid grid-cols-25 gap-1 mb-1">
                        <div className="text-sm font-medium text-foreground p-2 flex items-center min-w-[80px]">
                          {day.slice(0, 3)}
                        </div>
                        {hours.map((hour) => {
                          const cellId = `${day}-${hour}`
                          const isSelected = selectedCells.has(cellId)

                          return (
                            <Tooltip key={hour}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`
                                    h-10 w-full rounded-lg border-2 cursor-pointer transition-all duration-200 hover-scale
                                    ${
                                      isSelected
                                        ? "bg-gradient-to-br from-[var(--thermal-2)] to-[var(--thermal-4)] border-[var(--thermal-3)] shadow-lg"
                                        : "bg-muted border-border hover:border-[var(--thermal-2)]/50"
                                    }
                                    hover:shadow-md
                                  `}
                                  onClick={() => handleCellClick(day, hour)}
                                />
                              </TooltipTrigger>
                              <TooltipContent className="bg-card border-border">
                                <div className="text-center">
                                  <p className="font-medium text-foreground">{day}</p>
                                  <p className="text-sm text-muted-foreground">{formatHour(hour)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {isSelected ? "Available" : "Click to select"}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipProvider>

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Selected {getSelectedHours()} hours of availability</div>
                <Button
                  onClick={handleSubmit}
                  disabled={!userName || !userEmail || getSelectedHours() === 0}
                  className="bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  Submit Availability
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
