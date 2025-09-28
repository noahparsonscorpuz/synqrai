import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Naive scheduling: find the first hour slot that maximizes number of participants available.
// available_slots expected shape: array of ISO strings or slot keys; we will accept any strings and treat equality.

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { meeting_id } = body
  if (!meeting_id) return NextResponse.json({ error: "meeting_id is required" }, { status: 400 })

  // Only meeting creator can finalize scheduling
  const { data: meeting, error: meetingErr } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", meeting_id)
    .single()

  if (meetingErr) return NextResponse.json({ error: meetingErr.message }, { status: 500 })
  if (meeting.created_by !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // Fetch availability entries
  const { data: availabilities, error: availErr } = await supabase
    .from("availability")
    .select("available_slots")
    .eq("meeting_id", meeting_id)

  if (availErr) return NextResponse.json({ error: availErr.message }, { status: 500 })

  // Tally slot frequencies
  const slotCount = new Map<string, number>()
  for (const row of availabilities ?? []) {
    const slots: string[] = Array.isArray(row.available_slots) ? row.available_slots : []
    for (const slot of slots) {
      slotCount.set(slot, (slotCount.get(slot) ?? 0) + 1)
    }
  }

  if (slotCount.size === 0) {
    return NextResponse.json({ error: "No availability to schedule" }, { status: 400 })
  }

  // Pick the slot with max count
  let bestSlot: string | null = null
  let bestCount = -1
  for (const [slot, count] of slotCount.entries()) {
    if (count > bestCount) {
      bestSlot = slot
      bestCount = count
    }
  }

  // Update meeting as scheduled
  const { data: updated, error: updateErr } = await supabase
    .from("meetings")
    .update({ status: "scheduled", scheduled_time: bestSlot })
    .eq("id", meeting_id)
    .select()
    .single()

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // Notify creator and participants (creator will get meeting_scheduled; participants via future expansion)
  await supabase.from("notifications").insert({
    user_id: meeting.created_by,
    meeting_id,
    type: "meeting_scheduled",
    title: "Meeting Scheduled",
    message: `"${meeting.title}" scheduled at ${bestSlot}`,
  })

  return NextResponse.json({ meeting: updated, chosen_slot: bestSlot, votes: bestCount })
}


