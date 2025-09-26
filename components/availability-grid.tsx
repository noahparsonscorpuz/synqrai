"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, Save, RotateCcw } from "lucide-react"

interface User {
  id: string
  name: string
  role: string
}

interface AvailabilityGridProps {
  user: User
}

// Generate sample availability data with thermal intensity
const generateAvailabilityData = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const data: { [key: string]: { [key: number]: number } } = {}

  days.forEach((day) => {
    data[day] = {}
    hours.forEach((hour) => {
      // Generate thermal intensity (0-5, where 0 = not available, 1-5 = availability levels)
      const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0
      data[day][hour] = intensity
    })
  })

  return data
}

export function AvailabilityGrid({ user }: AvailabilityGridProps) {
  const [availabilityData, setAvailabilityData] = useState(generateAvailabilityData())
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [isEditing, setIsEditing] = useState(false)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getThermalColor = (intensity: number) => {
    if (intensity === 0) return "bg-muted border-border"

    const colors = [
      "bg-[var(--thermal-1)] border-[var(--thermal-1)]", // Level 1
      "bg-[var(--thermal-2)] border-[var(--thermal-2)]", // Level 2
      "bg-[var(--thermal-3)] border-[var(--thermal-3)]", // Level 3
      "bg-[var(--thermal-4)] border-[var(--thermal-4)]", // Level 4
      "bg-[var(--thermal-5)] border-[var(--thermal-5)]", // Level 5
    ]

    return colors[intensity - 1] || colors[0]
  }

  const getIntensityLabel = (intensity: number) => {
    const labels = ["Not Available", "Low Availability", "Moderate", "Good", "High", "Peak Availability"]
    return labels[intensity] || "Unknown"
  }

  const handleCellClick = (day: string, hour: number) => {
    if (!isEditing) return

    const cellId = `${day}-${hour}`
    const newSelectedCells = new Set(selectedCells)

    if (newSelectedCells.has(cellId)) {
      newSelectedCells.delete(cellId)
    } else {
      newSelectedCells.add(cellId)
    }

    setSelectedCells(newSelectedCells)
  }

  const updateSelectedCells = (intensity: number) => {
    const newData = { ...availabilityData }

    selectedCells.forEach((cellId) => {
      const [day, hourStr] = cellId.split("-")
      const hour = Number.parseInt(hourStr)
      newData[day][hour] = intensity
    })

    setAvailabilityData(newData)
    setSelectedCells(new Set())
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return "12 PM"
    return `${hour - 12} PM`
  }

  const getTotalAvailableHours = () => {
    let total = 0
    Object.values(availabilityData).forEach((dayData) => {
      Object.values(dayData).forEach((intensity) => {
        if (intensity > 0) total++
      })
    })
    return total
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Availability Grid</h1>
          <p className="text-muted-foreground">Manage your availability using the thermal heatmap interface</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Clock className="h-4 w-4 mr-2" />
            {getTotalAvailableHours()} hours available
          </Badge>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className={
              isEditing ? "bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0" : ""
            }
          >
            {isEditing ? "Exit Edit Mode" : "Edit Availability"}
          </Button>
        </div>
      </div>

      {isEditing && selectedCells.size > 0 && (
        <Card className="border-[var(--thermal-2)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Update Selected Cells</CardTitle>
            <CardDescription>
              {selectedCells.size} cell{selectedCells.size !== 1 ? "s" : ""} selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {[0, 1, 2, 3, 4, 5].map((intensity) => (
                <Button
                  key={intensity}
                  size="sm"
                  variant="outline"
                  onClick={() => updateSelectedCells(intensity)}
                  className={`${getThermalColor(intensity)} text-white hover:opacity-80`}
                >
                  {getIntensityLabel(intensity)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Availability Heatmap
              </CardTitle>
              <CardDescription>Click cells to select, then choose availability level</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAvailabilityData(generateAvailabilityData())}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
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
                      const intensity = availabilityData[day][hour]
                      const cellId = `${day}-${hour}`
                      const isSelected = selectedCells.has(cellId)

                      return (
                        <Tooltip key={hour}>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                h-10 w-full rounded-lg border-2 cursor-pointer transition-all duration-200 hover-scale
                                ${getThermalColor(intensity)}
                                ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""}
                                ${isEditing ? "hover:ring-2 hover:ring-white/50 hover:ring-offset-1" : ""}
                                ${intensity > 0 ? "shadow-lg" : ""}
                              `}
                              onClick={() => handleCellClick(day, hour)}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-card border-border">
                            <div className="text-center">
                              <p className="font-medium text-foreground">{day}</p>
                              <p className="text-sm text-muted-foreground">{formatHour(hour)}</p>
                              <p className="text-xs text-muted-foreground">{getIntensityLabel(intensity)}</p>
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

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Availability Legend</h4>
            <div className="flex items-center gap-4 flex-wrap">
              {[0, 1, 2, 3, 4, 5].map((intensity) => (
                <div key={intensity} className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded border ${getThermalColor(intensity)}`} />
                  <span className="text-xs text-muted-foreground">{getIntensityLabel(intensity)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
