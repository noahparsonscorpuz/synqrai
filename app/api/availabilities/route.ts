import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { participant_id, slots, constraints } = body as {
    participant_id?: string
    slots?: string[]
    constraints?: any
  }

  if (!participant_id || !Array.isArray(slots)) {
    return NextResponse.json({ error: "participant_id and slots are required" }, { status: 400 })
  }

  // Confirm participant exists and is writeable by this user (RLS also enforces)
  const { data: participant, error: pErr } = await supabase
    .from("participants")
    .select("*")
    .eq("id", participant_id)
    .single()

  if (pErr || !participant) return NextResponse.json({ error: pErr?.message || "Participant not found" }, { status: 404 })

  const { data: existing, error: exErr } = await supabase
    .from("availabilities")
    .select("*")
    .eq("participant_id", participant_id)
    .maybeSingle()

  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 })

  if (existing) {
    const { data: updated, error: upErr } = await supabase
      .from("availabilities")
      .update({ slots, constraints: constraints ?? {} })
      .eq("participant_id", participant_id)
      .select()
      .single()
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
    return NextResponse.json({ availability: updated })
  }

  const { data: inserted, error: insErr } = await supabase
    .from("availabilities")
    .insert({ participant_id, slots, constraints: constraints ?? {} })
    .select()
    .single()

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
  return NextResponse.json({ availability: inserted })
}


