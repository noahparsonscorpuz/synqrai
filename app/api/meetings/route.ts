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
  const { title, description, duration } = body

  const { data: meeting, error } = await supabase
    .from("meetings")
    .insert({
      title,
      description,
      duration,
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
