import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { event_id, guest_name } = body as { event_id?: string; guest_name?: string }
  if (!event_id) return NextResponse.json({ error: "event_id is required" }, { status: 400 })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If authenticated, ensure a participant row with (event_id, user_id)
  if (user) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", event_id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (data) return NextResponse.json({ participant: data })

    const { data: inserted, error: insErr } = await supabase
      .from("participants")
      .insert({ event_id, user_id: user.id })
      .select()
      .single()

    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
    return NextResponse.json({ participant: inserted })
  }

  // Guest flow: require guest_name, unique per event
  if (!guest_name || guest_name.trim().length === 0) {
    return NextResponse.json({ error: "guest_name is required for guests" }, { status: 400 })
  }

  const { data: existing, error: exErr } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", event_id)
    .eq("guest_name", guest_name)
    .maybeSingle()

  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 })
  if (existing) return NextResponse.json({ participant: existing })

  const { data: guest, error: gErr } = await supabase
    .from("participants")
    .insert({ event_id, guest_name })
    .select()
    .single()

  if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 })
  return NextResponse.json({ participant: guest })
}


