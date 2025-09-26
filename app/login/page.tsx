"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, TrendingUp, ArrowLeft, Building, GraduationCap, Coffee, Briefcase } from "lucide-react"
import Link from "next/link"

const demoUsers = [
  {
    id: "team-lead-1",
    name: "Sarah Chen",
    role: "Team Lead",
    organization: "TechCorp Engineering",
    type: "Team Meetings",
    email: "sarah.chen@techcorp.com",
    avatar: "SC",
    description: "Managing weekly standups and sprint planning",
  },
  {
    id: "student-1",
    name: "Marcus Johnson",
    role: "Student",
    organization: "Stanford University",
    type: "Study Groups",
    email: "marcus.johnson@stanford.edu",
    avatar: "MJ",
    description: "Coordinating CS study sessions and project meetings",
  },
  {
    id: "club-organizer-1",
    name: "Emily Rodriguez",
    role: "Club President",
    organization: "Photography Club",
    type: "Club Events",
    email: "emily.rodriguez@club.org",
    avatar: "ER",
    description: "Organizing photo walks and workshops",
  },
  {
    id: "hr-manager-1",
    name: "James Wilson",
    role: "HR Manager",
    organization: "Global Solutions Inc",
    type: "Workplace Scheduling",
    email: "james.wilson@globalsolutions.com",
    avatar: "JW",
    description: "Managing interviews and team meetings",
  },
  {
    id: "event-coordinator-1",
    name: "Lisa Park",
    role: "Event Coordinator",
    organization: "TechConf 2024",
    type: "Conference Networking",
    email: "lisa.park@techconf.com",
    avatar: "LP",
    description: "Facilitating networking sessions and speaker meetings",
  },
  {
    id: "admin-1",
    name: "Alex Thompson",
    role: "Platform Admin",
    organization: "synqr.ai",
    type: "System Management",
    email: "alex.thompson@synqr.ai",
    avatar: "AT",
    description: "Managing platform settings and optimization rules",
  },
]

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoLogin = async (userId: string) => {
    setIsLoading(true)
    setSelectedUser(userId)

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const user = demoUsers.find((u) => u.id === userId)
    if (user) {
      // Store user in localStorage for demo
      localStorage.setItem("synqr-user", JSON.stringify(user))
      router.push("/dashboard")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Team Meetings":
        return <Users className="h-5 w-5" />
      case "Study Groups":
        return <GraduationCap className="h-5 w-5" />
      case "Club Events":
        return <Coffee className="h-5 w-5" />
      case "Workplace Scheduling":
        return <Briefcase className="h-5 w-5" />
      case "Conference Networking":
        return <Building className="h-5 w-5" />
      case "System Management":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Team Meetings":
        return "from-[var(--thermal-1)] to-[var(--thermal-2)]"
      case "Study Groups":
        return "from-[var(--thermal-2)] to-[var(--thermal-3)]"
      case "Club Events":
        return "from-[var(--thermal-3)] to-[var(--thermal-4)]"
      case "Workplace Scheduling":
        return "from-[var(--thermal-4)] to-[var(--thermal-5)]"
      case "Conference Networking":
        return "from-[var(--thermal-1)] to-[var(--thermal-4)]"
      case "System Management":
        return "from-[var(--thermal-2)] to-[var(--thermal-5)]"
      default:
        return "from-[var(--thermal-1)] to-[var(--thermal-2)]"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-4)] flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-4)]">
                synqr.ai
              </span>
            </h1>
            <p className="text-muted-foreground">Choose a demo account to explore different use cases</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoUsers.map((user) => (
              <Card
                key={user.id}
                className={`group hover:shadow-2xl transition-all duration-300 cursor-pointer hover-scale border-border/50 hover:border-primary/50 ${
                  selectedUser === user.id ? "ring-2 ring-primary shadow-xl" : ""
                }`}
                onClick={() => handleDemoLogin(user.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getTypeColor(user.type)} flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{user.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(user.type)}
                        <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground mb-3">
                    <div className="flex justify-between">
                      <span>Organization:</span>
                      <span className="font-medium text-foreground text-right">{user.organization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use Case:</span>
                      <span className="font-medium text-foreground">{user.type}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{user.description}</p>

                  <Button
                    className={`w-full bg-gradient-to-r ${getTypeColor(user.type)} hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all`}
                    disabled={isLoading}
                  >
                    {isLoading && selectedUser === user.id ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging in...
                      </div>
                    ) : (
                      `Login as ${user.role}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-md mx-auto border-border/50">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Custom Login</CardTitle>
                <CardDescription>Enter your credentials for production access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@organization.com"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <Button className="w-full bg-transparent" variant="outline" disabled>
                  Login (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
