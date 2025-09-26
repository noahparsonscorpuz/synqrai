"use client"
import { MeetingCreator } from "./meeting-creator"

interface User {
  id: string
  name: string
  role: string
  organization: string
  type: string
}

interface ScheduleViewProps {
  user: User
}

export function ScheduleView({ user }: ScheduleViewProps) {
  return <MeetingCreator user={user} />
}
