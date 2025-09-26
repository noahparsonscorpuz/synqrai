"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Settings, X, BarChart3, Grid3X3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  role: string
  department: string
}

interface SidebarProps {
  user: User
  currentView: string
  onViewChange: (view: "overview" | "availability" | "schedule" | "admin") => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ user, currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Resident":
        return "from-[var(--thermal-1)] to-[var(--thermal-2)]"
      case "Practitioner":
        return "from-[var(--thermal-2)] to-[var(--thermal-3)]"
      case "Admin":
        return "from-[var(--thermal-3)] to-[var(--thermal-4)]"
      default:
        return "from-[var(--thermal-1)] to-[var(--thermal-2)]"
    }
  }

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Dashboard and stats",
    },
    {
      id: "availability",
      label: "Availability",
      icon: Grid3X3,
      description: "Heatmap grid view",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      description: "Calendar and sessions",
    },
    ...(user.role === "Admin"
      ? [
          {
            id: "admin",
            label: "Admin",
            icon: Settings,
            description: "System management",
          },
        ]
      : []),
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-sidebar border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold text-sm`}
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3",
                  currentView === item.id && `bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0`,
                )}
                onClick={() => {
                  onViewChange(item.id as any)
                  onClose()
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium">12h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-medium">8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>
    </>
  )
}
