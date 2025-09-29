import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: meetings, error } = await supabase
    .from("meetings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ meetings })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, duration, start_date, end_date, constraints } = body
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }
  if (start_date && end_date) {
    const start = new Date(start_date)
    const end = new Date(end_date)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }
    // Limit to 31-day window
    const maxMs = 31 * 24 * 60 * 60 * 1000
    if (end.getTime() - start.getTime() > maxMs) {
      return NextResponse.json({ error: "Date range cannot exceed 31 days" }, { status: 400 })
    }
  }

  const { data: meeting, error } = await supabase
    .from("meetings")
    .insert({
      title,
      description,
      duration,
      start_date: start_date ?? null,
      end_date: end_date ?? null,
      constraints: constraints ?? {},
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create notification for meeting creation
  await supabase.from("notifications").insert({
    user_id: user.id,
    meeting_id: meeting.id,
    type: "meeting_created",
    title: "Meeting Created",
    message: `You created "${title}"`,
  })

  return NextResponse.json({ meeting })
}
