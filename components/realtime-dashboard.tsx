"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useRealtimeMeetings, useRealtimeNotifications, type Meeting, type Notification } from "@/hooks/use-realtime"

export function RealtimeDashboard() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const { meetings, loading: meetingsLoading } = useRealtimeMeetings(user?.id)
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
  } = useRealtimeNotifications(user?.id)

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please sign in to view your real-time dashboard.</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: Meeting["status"]) => {
    switch (status) {
      case "collecting":
        return <Clock className="h-4 w-4 text-accent-blue" />
      case "scheduled":
        return <CheckCircle className="h-4 w-4 text-accent-green" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "collecting":
        return "bg-accent-blue/20 text-accent-blue"
      case "scheduled":
        return "bg-accent-green/20 text-accent-green"
      case "cancelled":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "meeting_created":
        return <Calendar className="h-4 w-4 text-accent-blue" />
      case "meeting_scheduled":
        return <CheckCircle className="h-4 w-4 text-accent-green" />
      case "availability_updated":
        return <Users className="h-4 w-4 text-accent-purple" />
      case "meeting_cancelled":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Real-time Dashboard</h1>
        <p className="text-muted-foreground">Live updates for your meetings and availability - no refresh needed!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Meetings Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Meetings
                {meetingsLoading && (
                  <div className="w-4 h-4 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
                )}
              </CardTitle>
              <CardDescription>Real-time updates as meetings are created and scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {meetingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No meetings yet. Create your first meeting to see real-time updates!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="border border-border rounded-lg p-4 hover-lift">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                        <Badge className={getStatusColor(meeting.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(meeting.status)}
                            {meeting.status}
                          </div>
                        </Badge>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground mb-2">{meeting.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meeting.duration} min
                        </span>
                        {meeting.scheduled_time && (
                          <span>Scheduled: {new Date(meeting.scheduled_time).toLocaleString()}</span>
                        )}
                        <span>Created: {new Date(meeting.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {notificationsLoading && (
                    <div className="w-4 h-4 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
                  )}
                </div>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Live notifications for meeting updates</CardDescription>
            </CardHeader>
            <CardContent>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full mb-4 bg-transparent">
                  Mark All as Read
                </Button>
              )}

              {notificationsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-3 bg-muted rounded w-full mb-1"></div>
                      <div className="h-2 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-6">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.read ? "border-border bg-background" : "border-accent-blue/30 bg-accent-blue/5"
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            <span className="text-muted-foreground">Real-time connected</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
