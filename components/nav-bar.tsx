"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Menu, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  role: string
  department: string
  avatar: string
}

interface NavBarProps {
  user: User
  currentView: string
  onViewChange: (view: "overview" | "availability" | "schedule" | "admin") => void
  onMenuClick: () => void
}

export function NavBar({ user, currentView, onViewChange, onMenuClick }: NavBarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("synqr-user")
    router.push("/login")
  }

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

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-4)] flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-4)]">
                synqr.ai
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={currentView === "overview" ? "default" : "ghost"}
              onClick={() => onViewChange("overview")}
              size="sm"
              className={
                currentView === "overview" ? `bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0` : ""
              }
            >
              Overview
            </Button>
            <Button
              variant={currentView === "availability" ? "default" : "ghost"}
              onClick={() => onViewChange("availability")}
              size="sm"
              className={
                currentView === "availability" ? `bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0` : ""
              }
            >
              Availability
            </Button>
            <Button
              variant={currentView === "schedule" ? "default" : "ghost"}
              onClick={() => onViewChange("schedule")}
              size="sm"
              className={
                currentView === "schedule" ? `bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0` : ""
              }
            >
              Schedule
            </Button>
            {user.role === "Admin" && (
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => onViewChange("admin")}
                size="sm"
                className={
                  currentView === "admin" ? `bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0` : ""
                }
              >
                Admin
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={`bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0`}>
              {user.role}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(user.role)} text-white text-sm`}>
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.department}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Menu className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
