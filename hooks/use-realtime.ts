"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface Meeting {
  id: string
  title: string
  description?: string
  duration: number
  created_by: string
  status: "collecting" | "scheduled" | "cancelled"
  scheduled_time?: string
  created_at: string
  updated_at: string
}

export interface Availability {
  id: string
  meeting_id: string
  user_id: string
  available_slots: any[]
  constraints: any
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  meeting_id?: string
  type: "meeting_created" | "meeting_scheduled" | "availability_updated" | "meeting_cancelled"
  title: string
  message: string
  read: boolean
  created_at: string
}

export function useRealtimeMeetings(userId?: string) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    let channel: RealtimeChannel

    const fetchMeetings = async () => {
      const { data, error } = await supabase.from("meetings").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching meetings:", error)
      } else {
        setMeetings(data || [])
      }
      setLoading(false)
    }

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel("meetings-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "meetings",
          },
          (payload) => {
            console.log("[v0] Real-time meeting update:", payload)

            if (payload.eventType === "INSERT") {
              setMeetings((prev) => [payload.new as Meeting, ...prev])
            } else if (payload.eventType === "UPDATE") {
              setMeetings((prev) =>
                prev.map((meeting) => (meeting.id === payload.new.id ? (payload.new as Meeting) : meeting)),
              )
            } else if (payload.eventType === "DELETE") {
              setMeetings((prev) => prev.filter((meeting) => meeting.id !== payload.old.id))
            }
          },
        )
        .subscribe()
    }

    fetchMeetings()
    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, supabase])

  return { meetings, loading }
}

export function useRealtimeAvailability(meetingId?: string) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!meetingId) return

    let channel: RealtimeChannel

    const fetchAvailability = async () => {
      const { data, error } = await supabase.from("availability").select("*").eq("meeting_id", meetingId)

      if (error) {
        console.error("Error fetching availability:", error)
      } else {
        setAvailability(data || [])
      }
      setLoading(false)
    }

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`availability-${meetingId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "availability",
            filter: `meeting_id=eq.${meetingId}`,
          },
          (payload) => {
            console.log("[v0] Real-time availability update:", payload)

            if (payload.eventType === "INSERT") {
              setAvailability((prev) => [...prev, payload.new as Availability])
            } else if (payload.eventType === "UPDATE") {
              setAvailability((prev) =>
                prev.map((avail) => (avail.id === payload.new.id ? (payload.new as Availability) : avail)),
              )
            } else if (payload.eventType === "DELETE") {
              setAvailability((prev) => prev.filter((avail) => avail.id !== payload.old.id))
            }
          },
        )
        .subscribe()
    }

    fetchAvailability()
    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [meetingId, supabase])

  return { availability, loading }
}

export function useRealtimeNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    let channel: RealtimeChannel

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching notifications:", error)
      } else {
        setNotifications(data || [])
        setUnreadCount(data?.filter((n) => !n.read).length || 0)
      }
      setLoading(false)
    }

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`notifications-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("[v0] Real-time notification update:", payload)

            if (payload.eventType === "INSERT") {
              const newNotification = payload.new as Notification
              setNotifications((prev) => [newNotification, ...prev])
              if (!newNotification.read) {
                setUnreadCount((prev) => prev + 1)
              }
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((notif) => {
                  if (notif.id === payload.new.id) {
                    const updated = payload.new as Notification
                    // Update unread count if read status changed
                    if (notif.read !== updated.read) {
                      setUnreadCount((prev) => (updated.read ? prev - 1 : prev + 1))
                    }
                    return updated
                  }
                  return notif
                }),
              )
            }
          },
        )
        .subscribe()
    }

    fetchNotifications()
    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, supabase])

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  }
}
