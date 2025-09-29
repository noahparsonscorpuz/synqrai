-- Allow public read access to meetings for link-based invites
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'meetings' AND policyname = 'Public can read meetings'
  ) THEN
    CREATE POLICY "Public can read meetings" ON public.meetings
      FOR SELECT USING (true);
  END IF;
END $$;


