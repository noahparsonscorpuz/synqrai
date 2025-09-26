"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Settings,
  Zap,
  Users,
  Clock,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"

interface User {
  id: string
  name: string
  role: string
}

interface AdminConstraintsProps {
  user: User
}

interface SystemConstraint {
  id: string
  name: string
  description: string
  value: number | boolean | string
  type: "number" | "boolean" | "string" | "range"
  min?: number
  max?: number
  unit?: string
  category: "scheduling" | "optimization" | "system" | "users"
}

const defaultConstraints: SystemConstraint[] = [
  {
    id: "max-session-length",
    name: "Maximum Session Length",
    description: "Maximum duration for a single session",
    value: 4,
    type: "range",
    min: 1,
    max: 8,
    unit: "hours",
    category: "scheduling",
  },
  {
    id: "min-break-time",
    name: "Minimum Break Time",
    description: "Required break between consecutive sessions",
    value: 30,
    type: "range",
    min: 15,
    max: 120,
    unit: "minutes",
    category: "scheduling",
  },
  {
    id: "max-weekly-hours",
    name: "Maximum Weekly Hours",
    description: "Maximum hours per resident per week",
    value: 40,
    type: "range",
    min: 20,
    max: 60,
    unit: "hours",
    category: "scheduling",
  },
  {
    id: "enable-auto-optimization",
    name: "Auto Optimization",
    description: "Automatically optimize schedules when changes occur",
    value: true,
    type: "boolean",
    category: "optimization",
  },
  {
    id: "optimization-frequency",
    name: "Optimization Frequency",
    description: "How often to run automatic optimization",
    value: 24,
    type: "range",
    min: 1,
    max: 168,
    unit: "hours",
    category: "optimization",
  },
  {
    id: "max-concurrent-users",
    name: "Max Concurrent Users",
    description: "Maximum number of simultaneous users",
    value: 100,
    type: "range",
    min: 10,
    max: 500,
    unit: "users",
    category: "system",
  },
  {
    id: "session-reminder-time",
    name: "Session Reminder Time",
    description: "Send reminders before sessions",
    value: 60,
    type: "range",
    min: 15,
    max: 240,
    unit: "minutes",
    category: "users",
  },
]

export function AdminConstraints({ user }: AdminConstraintsProps) {
  const [constraints, setConstraints] = useState<SystemConstraint[]>(defaultConstraints)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationStatus, setOptimizationStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null)

  const updateConstraint = (id: string, value: number | boolean | string) => {
    setConstraints((prev) => prev.map((constraint) => (constraint.id === id ? { ...constraint, value } : constraint)))
  }

  const runOptimization = async () => {
    setIsOptimizing(true)
    setOptimizationStatus("running")

    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsOptimizing(false)
    setOptimizationStatus("completed")
    setLastOptimization(new Date())

    // Reset status after 5 seconds
    setTimeout(() => {
      setOptimizationStatus("idle")
    }, 5000)
  }

  const resetConstraints = () => {
    setConstraints(defaultConstraints)
  }

  const getConstraintsByCategory = (category: string) => {
    return constraints.filter((c) => c.category === category)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "scheduling":
        return <Clock className="h-5 w-5" />
      case "optimization":
        return <Zap className="h-5 w-5" />
      case "system":
        return <Settings className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "scheduling":
        return "from-[var(--thermal-1)] to-[var(--thermal-2)]"
      case "optimization":
        return "from-[var(--thermal-2)] to-[var(--thermal-3)]"
      case "system":
        return "from-[var(--thermal-3)] to-[var(--thermal-4)]"
      case "users":
        return "from-[var(--thermal-4)] to-[var(--thermal-5)]"
      default:
        return "from-[var(--thermal-1)] to-[var(--thermal-2)]"
    }
  }

  const getStatusIcon = () => {
    switch (optimizationStatus) {
      case "running":
        return (
          <div className="h-4 w-4 border-2 border-[var(--thermal-3)] border-t-transparent rounded-full animate-spin" />
        )
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Console</h1>
          <p className="text-muted-foreground">
            Manage system constraints, run optimization, and configure platform settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            System Health: 98%
          </Badge>
        </div>
      </div>

      {/* Optimization Control */}
      <Card className="border-[var(--thermal-2)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--thermal-3)]" />
                Schedule Optimization
              </CardTitle>
              <CardDescription>Run AI-powered optimization to improve scheduling efficiency</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm text-muted-foreground capitalize">
                {optimizationStatus === "running" ? "Optimizing..." : optimizationStatus}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Button
                  onClick={runOptimization}
                  disabled={isOptimizing}
                  className="bg-gradient-to-r from-[var(--thermal-2)] to-[var(--thermal-4)] hover:from-[var(--thermal-3)] hover:to-[var(--thermal-5)] text-white border-0"
                >
                  {isOptimizing ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Optimization
                    </>
                  )}
                </Button>

                {lastOptimization && (
                  <div className="text-sm text-muted-foreground">Last run: {lastOptimization.toLocaleString()}</div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Efficiency Gain:</span>
                  <span className="ml-2 font-medium text-[var(--thermal-3)]">+12%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Conflicts Resolved:</span>
                  <span className="ml-2 font-medium text-[var(--thermal-3)]">8</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Utilization:</span>
                  <span className="ml-2 font-medium text-[var(--thermal-3)]">94%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Constraints Configuration */}
      <Tabs defaultValue="scheduling" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {["scheduling", "optimization", "system", "users"].map((category) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <div
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center`}
                      >
                        {getCategoryIcon(category)}
                      </div>
                      {category} Constraints
                    </CardTitle>
                    <CardDescription>Configure {category} parameters and limits</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetConstraints}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getConstraintsByCategory(category).map((constraint) => (
                    <div key={constraint.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">{constraint.name}</Label>
                          <p className="text-sm text-muted-foreground">{constraint.description}</p>
                        </div>
                        <div className="text-right">
                          {constraint.type === "boolean" ? (
                            <Badge variant={constraint.value ? "default" : "secondary"}>
                              {constraint.value ? "Enabled" : "Disabled"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              {constraint.value} {constraint.unit}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {constraint.type === "boolean" ? (
                          <Switch
                            checked={constraint.value as boolean}
                            onCheckedChange={(checked) => updateConstraint(constraint.id, checked)}
                          />
                        ) : constraint.type === "range" ? (
                          <div className="flex-1 space-y-2">
                            <Slider
                              value={[constraint.value as number]}
                              onValueChange={([value]) => updateConstraint(constraint.id, value)}
                              min={constraint.min}
                              max={constraint.max}
                              step={1}
                              className="flex-1"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                {constraint.min} {constraint.unit}
                              </span>
                              <span>
                                {constraint.max} {constraint.unit}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Input
                            value={constraint.value as string}
                            onChange={(e) => updateConstraint(constraint.id, e.target.value)}
                            className="w-32"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Real-time system performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="font-medium">47 / 100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">System Load</span>
              <span className="font-medium text-[var(--thermal-2)]">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Database Queries/min</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="font-medium text-[var(--thermal-3)]">142ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>Latest configuration updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <div className="h-2 w-2 rounded-full bg-[var(--thermal-2)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Max session length updated</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <div className="h-2 w-2 rounded-full bg-[var(--thermal-3)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Auto optimization enabled</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <div className="h-2 w-2 rounded-full bg-[var(--thermal-4)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">System constraints reset</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
