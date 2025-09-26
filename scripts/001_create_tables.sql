-- Create users table for profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 60, -- in minutes
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'collecting' CHECK (status IN ('collecting', 'scheduled', 'cancelled')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability table
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_slots JSONB NOT NULL, -- Array of time slots
  constraints JSONB DEFAULT '{}', -- User constraints and preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('meeting_created', 'meeting_scheduled', 'availability_updated', 'meeting_cancelled')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for meetings
CREATE POLICY "Users can view meetings they created or are invited to" ON public.meetings
  FOR SELECT USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.availability 
      WHERE availability.meeting_id = meetings.id 
      AND availability.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create meetings" ON public.meetings
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Meeting creators can update their meetings" ON public.meetings
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Meeting creators can delete their meetings" ON public.meetings
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for availability
CREATE POLICY "Users can view availability for meetings they're part of" ON public.availability
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.meetings 
      WHERE meetings.id = availability.meeting_id 
      AND meetings.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own availability" ON public.availability
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own availability" ON public.availability
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own availability" ON public.availability
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
