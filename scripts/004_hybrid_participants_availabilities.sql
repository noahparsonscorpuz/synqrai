-- Hybrid participants + availabilities schema

-- 1) Participants table (supports auth users and guests)
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraints via partial indexes
CREATE UNIQUE INDEX IF NOT EXISTS participants_event_user_unique
  ON public.participants (event_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS participants_event_guest_unique
  ON public.participants (event_id, guest_name)
  WHERE guest_name IS NOT NULL AND guest_name <> '';

-- 2) Availabilities table (per participant)
CREATE TABLE IF NOT EXISTS public.availabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  slots JSONB NOT NULL,
  constraints JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Each participant maintains a single current availability row
CREATE UNIQUE INDEX IF NOT EXISTS availabilities_participant_unique
  ON public.availabilities (participant_id);

-- Enable RLS
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;

-- RLS: Participants
-- Allow anyone to read participants for realtime/aggregation (link-based flow)
DROP POLICY IF EXISTS participants_select_all ON public.participants;
CREATE POLICY participants_select_all ON public.participants
  FOR SELECT USING (true);

-- Allow insert for either:
--  - authenticated user creating their own participant (user_id = auth.uid())
--  - guest (no auth) creating participant with guest_name and NULL user_id
DROP POLICY IF EXISTS participants_insert ON public.participants;
CREATE POLICY participants_insert ON public.participants
  FOR INSERT WITH CHECK (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR (user_id IS NULL AND guest_name IS NOT NULL AND char_length(guest_name) > 0)
  );

-- Allow updates/deletes by meeting creator or the participant's user
DROP POLICY IF EXISTS participants_update ON public.participants;
CREATE POLICY participants_update ON public.participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.meetings m
      WHERE m.id = participants.event_id AND m.created_by = auth.uid()
    ) OR participants.user_id = auth.uid()
  );

DROP POLICY IF EXISTS participants_delete ON public.participants;
CREATE POLICY participants_delete ON public.participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.meetings m
      WHERE m.id = participants.event_id AND m.created_by = auth.uid()
    ) OR participants.user_id = auth.uid()
  );

-- RLS: Availabilities
-- Allow read for aggregation/heatmap
DROP POLICY IF EXISTS availabilities_select_all ON public.availabilities;
CREATE POLICY availabilities_select_all ON public.availabilities
  FOR SELECT USING (true);

-- Allow insert/update if the participant belongs to the caller (auth) or guest (no auth)
DROP POLICY IF EXISTS availabilities_insert ON public.availabilities;
CREATE POLICY availabilities_insert ON public.availabilities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.participants p
      WHERE p.id = availabilities.participant_id
        AND (p.user_id = auth.uid() OR p.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS availabilities_update ON public.availabilities;
CREATE POLICY availabilities_update ON public.availabilities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.participants p
      WHERE p.id = availabilities.participant_id
        AND (p.user_id = auth.uid() OR p.user_id IS NULL)
    )
  );

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availabilities;


