"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, Users, CheckCircle, ArrowRight, Sparkles, Copy } from "lucide-react"
import { RealTimeTracker } from "@/components/real-time-tracker"
import { useRealtimeAvailability } from "@/hooks/use-realtime"
import { createClient as createBrowserSupabase } from "@/lib/supabase/client"

interface MeetingInvite {
  id: string
  title: string
  description?: string
  organizer?: string
  type?: string
  duration: number
  participants?: number
  deadline?: string
  constraints?: any
  start_date?: string
  end_date?: string
}

const fetchMeetingData = async (id: string): Promise<MeetingInvite | null> => {
  // Try API route first
  try {
    const res = await fetch(`/api/meetings/${id}`)
    if (res.ok) {
      const { meeting } = await res.json()
      return {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description ?? undefined,
        duration: meeting.duration,
        constraints: meeting.constraints ?? undefined,
        start_date: meeting.start_date ?? undefined,
        end_date: meeting.end_date ?? undefined,
      }
    }
  } catch {}

  // Fallback: read directly from Supabase (RLS must allow public SELECT)
  try {
    const supabase = createBrowserSupabase()
    const { data, error } = await supabase.from("meetings").select("*").eq("id", id).maybeSingle()
    if (error || !data) return null
    return {
      id: data.id,
      title: data.title,
      description: data.description ?? undefined,
      duration: data.duration,
      constraints: data.constraints ?? undefined,
      start_date: data.start_date ?? undefined,
      end_date: data.end_date ?? undefined,
    }
  } catch {
    return null
  }
}

export default function InvitePage() {
  const params = useParams()
  const [meeting, setMeeting] = useState<MeetingInvite | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [showRealTimeTracker, setShowRealTimeTracker] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragModeRef = useRef<"add" | "remove">("add")
  const [isAuthed, setIsAuthed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState<{ dayIdx: number; slotIdx: number } | null>(null)
  const [participants, setParticipants] = useState<Array<{ id: string; user_id?: string | null; guest_name?: string | null }>>([])
  const [profilesMap, setProfilesMap] = useState<Record<string, string>>({})
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"mine" | "group">("mine")

  // Fixed 15-minute slots
  const slotMinutes = 15 as const
  const slotsPerHour = 60 / slotMinutes
  const totalSlotRows = 24 * slotsPerHour

  const timeWindow = useMemo(() => {
    const start = (meeting as any)?.constraints?.time_window?.start as string | undefined
    const end = (meeting as any)?.constraints?.time_window?.end as string | undefined
    const toMinutes = (t?: string) => {
      if (!t) return undefined
      const [hh, mm] = t.split(":").map((x: string) => parseInt(x, 10))
      return (hh || 0) * 60 + (mm || 0)
    }
    return { startMin: toMinutes(start), endMin: toMinutes(end) }
  }, [meeting])

  const windowRows = useMemo(() => {
    const totalMin = 24 * 60
    // if constraints missing, default to 00:00–24:00
    const s = timeWindow.startMin ?? 0
    const e = timeWindow.endMin ?? totalMin
    const clampedEnd = Math.max(s, Math.min(e, totalMin))
    const startRow = Math.max(0, Math.floor(s / slotMinutes))
    const endRow = Math.min(totalSlotRows, Math.ceil(clampedEnd / slotMinutes)) // exclusive
    return { startRow, endRow }
  }, [timeWindow, totalSlotRows])

  useEffect(() => {
    const load = async () => {
      if (params.id) {
        const meetingData = await fetchMeetingData(params.id as string)
        if (meetingData) {
          setMeeting(meetingData)
          setLoadError(null)
        } else {
          setLoadError("We couldn't load this invitation. The event may not exist or is not publicly readable.")
        }
      }
    }
    load()
  }, [params.id])

  // Determine auth state for the current browser session
  useEffect(() => {
    const check = async () => {
      const supabase = createBrowserSupabase()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthed(!!user)
    }
    check()
  }, [])

  // Build date range (inclusive) based on meeting start/end or fallback to next 7 days
  const dates = useMemo(() => {
    const out: Date[] = []
    if (meeting?.start_date && meeting?.end_date) {
      const start = new Date(meeting.start_date)
      const end = new Date(meeting.end_date)
      let d = new Date(start)
      while (d <= end) {
        out.push(new Date(d))
        d.setDate(d.getDate() + 1)
      }
    } else {
      const today = new Date()
      for (let i = 0; i < 7; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        out.push(d)
      }
    }
    return out
  }, [meeting?.start_date, meeting?.end_date])

  // Slot indexes computed by zoom
  const slotIndexes = useMemo(() => Array.from({ length: slotsPerHour }, (_, i) => i), [slotsPerHour])

  const slotIsoFor = (date: Date, slotIndex: number) => {
    const d = new Date(date)
    const minutesTotal = slotIndex * slotMinutes
    const hours = Math.floor(minutesTotal / 60)
    const minutes = minutesTotal % 60
    d.setHours(hours, minutes, 0, 0)
    return d.toISOString()
  }

  const formatQuarterLabel = (slotIndex: number) => {
    const minutesTotal = slotIndex * slotMinutes
    const h = Math.floor(minutesTotal / 60)
    const remain = minutesTotal % 60
    const m = remain.toString().padStart(2, "0")
    const suffix = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`
    return remain === 0 ? suffix : ""
  }

  const getHeatClass = (count: number, maxCount: number, isSelected: boolean) => {
    if (isSelected) return "bg-gradient-to-br from-[var(--thermal-2)] to-[var(--thermal-4)] border-[var(--thermal-3)] shadow"
    if (count <= 0 || maxCount <= 0) return "bg-muted border-border"
    const ratio = count / Math.max(maxCount, 1)
    if (ratio >= 0.8) return "bg-[var(--thermal-5)] border-[var(--thermal-5)]"
    if (ratio >= 0.6) return "bg-[var(--thermal-4)] border-[var(--thermal-4)]"
    if (ratio >= 0.4) return "bg-[var(--thermal-3)] border-[var(--thermal-3)]"
    if (ratio >= 0.2) return "bg-[var(--thermal-2)] border-[var(--thermal-2)]"
    return "bg-[var(--thermal-1)] border-[var(--thermal-1)]"
  }

  const { availability } = useRealtimeAvailability(meeting?.id)

  // Aggregate realtime counts by slot ISO string
  const slotCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of availability ?? []) {
      const slots: string[] = Array.isArray((row as any).slots) ? (row as any).slots : []
      for (const iso of slots) {
        counts.set(iso, (counts.get(iso) ?? 0) + 1)
      }
    }
    setParticipantCount(availability?.length ?? 0)
    return counts
  }, [availability])

  const maxCountAcrossSlots = useMemo(() => {
    let max = 0
    slotCounts.forEach((v) => { if (v > max) max = v })
    return max
  }, [slotCounts])

  // Fetch participants and profiles for hover name display
  useEffect(() => {
    const load = async () => {
      if (!meeting?.id) return
      const supabase = createBrowserSupabase()
      const { data: parts } = await supabase
        .from("participants")
        .select("id,user_id,guest_name")
        .eq("event_id", meeting.id)
      setParticipants(parts || [])
      const userIds = Array.from(new Set((parts || []).map((p: any) => p.user_id).filter(Boolean)))
      if (userIds.length > 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id,full_name")
          .in("id", userIds)
        const map: Record<string, string> = {}
        ;(profs || []).forEach((p: any) => (map[p.id] = p.full_name || "User"))
        setProfilesMap(map)
      }
    }
    load()
  }, [meeting?.id])

  const getNamesForSlot = (slotIso: string) => {
    const availByPid = new Map<string, string[]>()
    for (const row of availability || []) {
      const slots = Array.isArray((row as any).slots) ? (row as any).slots : []
      if (slots.includes(slotIso)) {
        availByPid.set((row as any).participant_id, slots)
      }
    }
    const names: string[] = []
    for (const p of participants) {
      if (availByPid.has(p.id)) {
        const name = p.guest_name || (p.user_id ? profilesMap[p.user_id] || "User" : "Guest")
        names.push(name)
      }
    }
    return names
  }

  // Precompute all slot rows as JSX to keep hooks ordering stable
  const slotRowsElements = useMemo(() => {
    const rows: JSX.Element[] = []
    for (let slotRow = windowRows.startRow; slotRow < windowRows.endRow; slotRow++) {
      rows.push(
        <div key={`srow-${slotRow}`} className="grid gap-1" style={{ gridTemplateColumns: `60px repeat(${dates.length}, 1fr)` }}>
          <div className="text-xs text-foreground p-1 pr-2 sticky left-0 z-10 bg-background text-right w-[60px]">
            {slotRow % slotsPerHour === 0 ? `${String(Math.floor(slotRow / slotsPerHour)).padStart(2, '0')}:00` : ''}
          </div>
          {dates.map((date, dIdx) => {
            const minutesTotal = slotRow * slotMinutes
            const hours = Math.floor(minutesTotal / 60)
            const minutes = minutesTotal % 60
            const d = new Date(date)
            d.setHours(hours, minutes, 0, 0)
            const slotIso = d.toISOString()
            const isSelected = selectedSlots.has(slotIso)
            const count = slotCounts.get(slotIso) ?? 0
            const baseHeat = getHeatClass(count, maxCountAcrossSlots || 1, false)
            const heatClass = viewMode === "group"
              ? getHeatClass(count, maxCountAcrossSlots || 1, isSelected)
              : `${isSelected ? "bg-gradient-to-br from-[var(--thermal-2)] to-[var(--thermal-4)] border-[var(--thermal-3)] shadow" : "bg-muted border-border"}`
            const names = getNamesForSlot(slotIso)
            const unavailableNames = participants
              .map((p) => p.guest_name || (p.user_id ? profilesMap[p.user_id!] || "User" : "Guest"))
              .filter((n) => n && !names.includes(n as string)) as string[]
            return (
              <Tooltip key={`cell-${dIdx}-${slotRow}`}>
                <TooltipTrigger asChild>
                  <div
                    className={`relative h-4 w-full rounded-sm border transition-all duration-150 ${heatClass} ${viewMode === "group" ? "cursor-default" : "cursor-pointer"} hover:brightness-110`}
                    onMouseDown={() => { if (viewMode === "mine") handlePointerDown(slotIso, dIdx, slotRow) }}
                    onMouseEnter={() => { if (viewMode === "group") setHoveredSlot(slotIso); if (viewMode === "mine") handlePointerEnter(slotIso, dIdx, slotRow) }}
                  />
                </TooltipTrigger>
                {viewMode === "group" && (
                <TooltipContent className="bg-card border-border p-3 w-80">
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground mb-1">
                      {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} at {`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`}
                    </div>
                    <div className="text-sm font-medium mb-2">{(count + (userName && selectedSlots.has(slotIso) ? 1 : 0))} / {(participants.length || (availability?.length || 0))} available</div>
                    {(() => {
                      const displayNames = [...names]
                      if (userName && selectedSlots.has(slotIso) && !displayNames.includes(userName)) displayNames.push(userName)
                      return displayNames
                    })().length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">Available</div>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const dn = [...names]
                            if (userName && selectedSlots.has(slotIso) && !dn.includes(userName)) dn.push(userName)
                            return dn
                          })().slice(0, 20).map((n, idx) => (
                            <span key={`a-${idx}`} className="px-2 py-0.5 rounded bg-[var(--thermal-4)] text-white text-[10px]">{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {unavailableNames.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Unavailable</div>
                        <div className="flex flex-wrap gap-1">
                          {unavailableNames.slice(0, 20).map((n, idx) => (
                            <span key={`u-${idx}`} className="px-2 py-0.5 rounded bg-muted text-foreground text-[10px]">{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </div>
      )
    }
    return rows
  }, [windowRows.startRow, windowRows.endRow, dates, selectedSlots, slotCounts, participants, profilesMap, availability, viewMode, maxCountAcrossSlots, userName])

  const handlePointerDown = (slotIso: string, dayIdx: number, slotIdx: number) => {
    if (isSubmitted) return
    const next = new Set(selectedSlots)
    if (next.has(slotIso)) {
      next.delete(slotIso)
      dragModeRef.current = "remove"
    } else {
      next.add(slotIso)
      dragModeRef.current = "add"
    }
    setSelectedSlots(next)
    setIsDragging(true)
    setDragStart({ dayIdx, slotIdx })
  }

  const handlePointerEnter = (slotIso: string, dayIdx: number, slotIdx: number) => {
    if (!isDragging || isSubmitted) return
    const next = new Set(selectedSlots)
    if (dragStart) {
      const minDay = Math.min(dragStart.dayIdx, dayIdx)
      const maxDay = Math.max(dragStart.dayIdx, dayIdx)
      const minSlot = Math.min(dragStart.slotIdx, slotIdx)
      const maxSlot = Math.max(dragStart.slotIdx, slotIdx)
      for (let d = minDay; d <= maxDay; d++) {
        const date = dates[d]
        for (let s = minSlot; s <= maxSlot; s++) {
          const iso = slotIsoFor(date, s)
          if (dragModeRef.current === "add") next.add(iso)
          else next.delete(iso)
        }
      }
    } else {
      if (dragModeRef.current === "add") next.add(slotIso)
      else next.delete(slotIso)
    }
    setSelectedSlots(next)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return "12 PM"
    return `${hour - 12} PM`
  }

  const handleSubmit = async () => {
    setSubmitError(null)
    if (!meeting) return

    const supabase = createBrowserSupabase()

    // 1) Ensure participant exists
    let pid = participantId
    if (!pid) {
      // Determine auth state
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user && !userName.trim()) {
        setSubmitError("Please enter your name before submitting.")
        return
      }
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: meeting.id,
          guest_name: user ? undefined : userName,
        }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        setSubmitError(text || "Failed to create participant.")
        return
      }
      const { participant } = await res.json()
      pid = participant.id
      setParticipantId(pid)
    }

    const slots = Array.from(selectedSlots)

    // 2) Upsert availability by participant_id
    try {
      const res = await fetch("/api/availabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: pid,
          slots,
          constraints: { submitted_by: userEmail || undefined, name: userName || undefined },
        }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        setSubmitError(text || "Failed to submit availability.")
        return
      }
    } catch (e) {
      setSubmitError("Availability submission error.")
      return
    }

    setIsSubmitted(true)
    setShowRealTimeTracker(true)
  }

  const getSelectedSlotsCount = () => selectedSlots.size
  const selectedMinutes = getSelectedSlotsCount() * 15

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          {loadError ? (
            <span className="text-destructive">{loadError}</span>
          ) : (
            <>
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-foreground">Loading invitation...</span>
            </>
          )}
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
                <p className="text-2xl font-bold text-[var(--thermal-2)]">{selectedSlots.size} slots</p>
                <p className="text-xs text-muted-foreground">(30 minutes each)</p>
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
              <RealTimeTracker meetingId={meeting.id} totalInvited={meeting.participants ?? 0} />
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
          {meeting.description && <p className="text-muted-foreground max-w-2xl mx-auto">{meeting.description}</p>}
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
                <div className="text-2xl font-bold text-[var(--thermal-3)] mb-1">{participantCount}</div>
                  <div className="text-xs text-muted-foreground">Responses</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  {meeting.organizer && (
                    <div className="text-2xl font-bold text-[var(--thermal-4)] mb-1">{meeting.organizer}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Organizer</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  {meeting.deadline && (
                    <div className="text-2xl font-bold text-[var(--thermal-1)] mb-1">{meeting.deadline}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Deadline</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Scheduling Constraints:</h4>
                <div className="flex flex-wrap gap-2">
                  {meeting.constraints?.time_window && (
                    <Badge variant="secondary" className="text-xs">
                      {`Hours: ${meeting.constraints.time_window.start}–${meeting.constraints.time_window.end}`}
                    </Badge>
                  )}
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
              <CardDescription>Let us know who you are.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="jDoe@synqr.ai"
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
                    Click and drag to select 15-min slots. Selected: {getSelectedSlotsCount()} slots ({selectedMinutes} min)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded border p-1 bg-card">
                    <div className="flex gap-1">
                      <Button size="sm" variant={viewMode === "mine" ? "default" : "outline"} onClick={() => setViewMode("mine")}>Edit availability</Button>
                      <Button size="sm" variant={viewMode === "group" ? "default" : "outline"} onClick={() => setViewMode("group")}>Group heatmap</Button>
                    </div>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI will optimize a time that works for everyone!
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="overflow-x-auto">
                  <div className="min-w-[1200px] select-none" onMouseUp={handlePointerUp} onMouseLeave={() => { handlePointerUp(); setHoveredSlot(null) }}>
                    {/* Removed Zoom controls as requested */}

                    {/* Top indicator */}
                    {viewMode === "group" ? (
                      (() => {
                        const total = participants.length || (availability?.length || 0)
                        const persisted = hoveredSlot ? (slotCounts.get(hoveredSlot) || 0) : 0
                        const ephemeralAdd = hoveredSlot && userName && selectedSlots.has(hoveredSlot) ? 1 : 0
                        const c = persisted + ephemeralAdd
                        const pct = total > 0 ? Math.round((c / total) * 100) : 0
                        return (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{c} / {total} available</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-2 w-full rounded bg-muted overflow-hidden">
                              <div className="h-full bg-[var(--thermal-4)]" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <div className="mb-3 text-xs text-muted-foreground">Edit mode: drag to select your availability</div>
                    )}

                    {/* Unified grid: header row */}
                    <div className="grid gap-1 sticky top-0 z-10 bg-background py-1" style={{ gridTemplateColumns: `60px repeat(${dates.length}, 1fr)` }}>
                      <div />
                      {dates.map((date) => (
                        <div key={`hdr-${date.toISOString()}`} className="text-center">
                          <div className="text-[10px] text-muted-foreground leading-none">
                            {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </div>
                          <div className="text-xs text-foreground font-medium mt-1">
                            {date.toLocaleDateString(undefined, { weekday: "short" })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {slotRowsElements}
                  </div>
                </div>
              </TooltipProvider>

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Selected {getSelectedSlotsCount()} slots ({slotMinutes} min each, {selectedMinutes} min total)</div>
                <Button
                  onClick={handleSubmit}
                  disabled={getSelectedSlotsCount() === 0 || (!isAuthed && userName.trim().length === 0)}
                  className="bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  Submit Availability
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              {submitError && (
                <div className="mt-2 text-sm text-destructive">{submitError}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
