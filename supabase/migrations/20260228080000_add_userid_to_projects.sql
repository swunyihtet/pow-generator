-- Migration: Add user_id to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update existing policies or add new ones to scope by user_id
DROP POLICY IF EXISTS "Allow authenticated upsert access" ON public.projects;

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);
