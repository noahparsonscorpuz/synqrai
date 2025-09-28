import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const meetingId = request.nextUrl.searchParams.get("meetingId")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!meetingId) return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("meeting_id", meetingId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ availability: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { meeting_id, available_slots, constraints } = body
  if (!meeting_id || !Array.isArray(available_slots)) {
    return NextResponse.json({ error: "meeting_id and available_slots are required" }, { status: 400 })
  }

  const { data: upserted, error } = await supabase
    .from("availability")
    .upsert(
      {
        meeting_id,
        user_id: user.id,
        available_slots,
        constraints: constraints ?? {},
      },
      { onConflict: "meeting_id,user_id" },
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify meeting creator about availability update
  const { data: meeting } = await supabase.from("meetings").select("*").eq("id", meeting_id).single()
  if (meeting) {
    await supabase.from("notifications").insert({
      user_id: meeting.created_by,
      meeting_id,
      type: "availability_updated",
      title: "Availability Updated",
      message: `A participant updated availability for "${meeting.title}"`,
    })
  }

  return NextResponse.json({ availability: upserted })
}


