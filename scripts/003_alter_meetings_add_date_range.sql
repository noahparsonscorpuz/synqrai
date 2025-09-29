-- Alter meetings to support date ranges and constraints
ALTER TABLE public.meetings
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS constraints JSONB DEFAULT '{}';

-- Optional: simple check to ensure end_date >= start_date when both present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'meetings_date_range_valid'
  ) THEN
    ALTER TABLE public.meetings
      ADD CONSTRAINT meetings_date_range_valid
      CHECK (
        start_date IS NULL
        OR end_date IS NULL
        OR end_date >= start_date
      );
  END IF;
END $$;



