"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { AvailabilityGrid } from "@/components/availability-grid"
import { ScheduleView } from "@/components/schedule-view"
import { AdminConstraints } from "@/components/admin-constraints"
import { RealtimeDashboard } from "@/components/realtime-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Plus,
  CheckCircle,
  AlertCircle,
  Coffee,
  GraduationCap,
  Building,
} from "lucide-react"

interface User {
  id: string
  name: string
  role: string
  organization: string
  type: string
  email: string
  avatar: string
  description: string
}

interface AssignedEvent {
  id: string
  title: string
  type: string
  date: string
  time: string
  duration: number
  organizer: string
  status: "confirmed" | "pending" | "completed"
  participants: number
  location?: string
}

const getAssignedEvents = (userType: string): AssignedEvent[] => {
  const baseEvents: AssignedEvent[] = [
    {
      id: "1",
      title: "Weekly Team Standup",
      type: "Team Meeting",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: 60,
      organizer: "Sarah Chen",
      status: "confirmed",
      participants: 8,
      location: "Conference Room A",
    },
    {
      id: "2",
      title: "Project Planning Session",
      type: "Team Meeting",
      date: "2024-01-16",
      time: "2:00 PM",
      duration: 90,
      organizer: "Alex Thompson",
      status: "pending",
      participants: 6,
    },
    {
      id: "3",
      title: "CS 229 Study Group",
      type: "Study Group",
      date: "2024-01-12",
      time: "7:00 PM",
      duration: 120,
      organizer: "Marcus Johnson",
      status: "completed",
      participants: 6,
      location: "Library Room 204",
    },
  ]

  // Filter events based on user type
  return baseEvents.filter((event) => {
    switch (userType) {
      case "Team Meetings":
        return event.type === "Team Meeting"
      case "Study Groups":
        return event.type === "Study Group"
      case "Club Events":
        return event.type === "Club Event"
      default:
        return true
    }
  })
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<
    "overview" | "availability" | "schedule" | "events" | "admin" | "realtime"
  >("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [assignedEvents, setAssignedEvents] = useState<AssignedEvent[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setSupabaseUser(authUser)

        // Create a user profile for the authenticated user
        const userProfile: User = {
          id: authUser.id,
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          role: "User",
          organization: authUser.email?.split("@")[1] || "Organization",
          type: "Team Meetings",
          email: authUser.email || "",
          avatar: (authUser.user_metadata?.full_name || authUser.email || "U").substring(0, 2).toUpperCase(),
          description: "Real-time scheduling user",
        }
        setUser(userProfile)
        setAssignedEvents(getAssignedEvents(userProfile.type))
      } else {
        const storedUser = localStorage.getItem("synqr-user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setAssignedEvents(getAssignedEvents(userData.type))
        } else {
          router.push("/auth/login")
        }
      }
    }

    checkAuth()
  }, [router, supabase])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  const getOverviewStats = () => {
    const baseStats = [
      { label: "Available Hours", value: "32", icon: Clock, color: "thermal-1" },
      { label: "Scheduled Events", value: assignedEvents.length.toString(), icon: Calendar, color: "thermal-2" },
      { label: "This Week", value: "12h", icon: TrendingUp, color: "thermal-3" },
      { label: "Response Rate", value: "94%", icon: Users, color: "thermal-4" },
    ]

    if (user.role === "Platform Admin") {
      return [
        { label: "Total Users", value: "156", icon: Users, color: "thermal-1" },
        { label: "Active Events", value: "42", icon: Calendar, color: "thermal-2" },
        { label: "System Uptime", value: "99.9%", icon: TrendingUp, color: "thermal-3" },
        { label: "Optimization Score", value: "92%", icon: Clock, color: "thermal-4" },
      ]
    }

    return baseStats
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Team Meeting":
        return <Users className="h-4 w-4" />
      case "Study Group":
        return <GraduationCap className="h-4 w-4" />
      case "Club Event":
        return <Coffee className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar
          user={user}
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6">
          {currentView === "realtime" && <RealtimeDashboard />}

          {currentView === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name.split(" ")[0]}</h1>
                <p className="text-muted-foreground">
                  {user.organization} • {user.type}
                  {supabaseUser && <span className="ml-2 text-accent-green">• Real-time enabled</span>}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getOverviewStats().map((stat, index) => (
                  <Card key={index} className="hover-scale border-border/50 hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--${stat.color})] to-[var(--thermal-5)] flex items-center justify-center shadow-lg`}
                      >
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Quick Actions</CardTitle>
                    <CardDescription>Common tasks for your role</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setCurrentView("availability")}
                    >
                      <Calendar className="h-5 w-5 text-[var(--thermal-2)]" />
                      <span className="text-foreground">Update Availability</span>
                    </div>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setCurrentView("events")}
                    >
                      <Clock className="h-5 w-5 text-[var(--thermal-3)]" />
                      <span className="text-foreground">View Assigned Events</span>
                    </div>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setCurrentView("schedule")}
                    >
                      <Users className="h-5 w-5 text-[var(--thermal-4)]" />
                      <span className="text-foreground">Create New Meeting</span>
                    </div>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setCurrentView("realtime")}
                    >
                      <TrendingUp className="h-5 w-5 text-accent-green" />
                      <span className="text-foreground">Real-time Dashboard</span>
                    </div>
                    {user.role === "Platform Admin" && (
                      <div
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => setCurrentView("admin")}
                      >
                        <TrendingUp className="h-5 w-5 text-[var(--thermal-1)]" />
                        <span className="text-foreground">System Settings</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Activity</CardTitle>
                    <CardDescription>Latest updates and notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div className="h-2 w-2 rounded-full bg-[var(--thermal-2)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">New event assigned</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div className="h-2 w-2 rounded-full bg-[var(--thermal-3)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Availability updated</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div className="h-2 w-2 rounded-full bg-[var(--thermal-4)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Meeting optimized</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentView === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Your Assigned Events</h1>
                  <p className="text-muted-foreground">Events and meetings you're scheduled to attend</p>
                </div>
                <Button
                  onClick={() => setCurrentView("schedule")}
                  className="bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Meeting
                </Button>
              </div>

              <div className="grid gap-4">
                {assignedEvents.map((event) => (
                  <Card key={event.id} className="border-border/50 hover:border-primary/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--thermal-2)] to-[var(--thermal-4)] flex items-center justify-center">
                            {getTypeIcon(event.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(event.status)}
                          <Badge
                            variant={event.status === "confirmed" ? "default" : "secondary"}
                            className={
                              event.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {event.time} ({event.duration}min)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{event.participants} participants</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Organized by <span className="font-medium text-foreground">{event.organizer}</span>
                        </p>
                        <div className="flex gap-2">
                          {event.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-[var(--thermal-2)] to-[var(--thermal-3)] text-white border-0"
                              >
                                Accept
                              </Button>
                            </>
                          )}
                          {event.status === "confirmed" && (
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {assignedEvents.length === 0 && (
                  <Card className="border-border/50">
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No events assigned yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any scheduled events. Create a meeting or wait for invitations.
                      </p>
                      <Button
                        onClick={() => setCurrentView("schedule")}
                        className="bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Meeting
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {currentView === "availability" && <AvailabilityGrid user={user} />}
          {currentView === "schedule" && <ScheduleView user={user} />}
          {currentView === "admin" && user.role === "Platform Admin" && <AdminConstraints user={user} />}
        </main>
      </div>
    </div>
  )
}
