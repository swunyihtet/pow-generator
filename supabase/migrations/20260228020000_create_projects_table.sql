-- Migration: Create 'projects' table for GitHub sync
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  github_repo_id BIGINT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  stargazers_count INT DEFAULT 0,
  language TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Allow public read access to projects" ON public.projects
  FOR SELECT USING (true);

-- Allow authenticated (internal) upsert access
CREATE POLICY "Allow authenticated upsert access" ON public.projects
  FOR ALL USING (auth.role() = 'authenticated');
