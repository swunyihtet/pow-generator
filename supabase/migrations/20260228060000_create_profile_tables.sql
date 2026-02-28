-- Migration: Create 'profiles', 'portfolios', 'experience', and 'education' tables
-- Based on 'Proof of Work' architecture

-- 1. Profiles (User Metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  title TEXT, -- e.g., 'AI Tech Visionary'
  tagline TEXT, -- e.g., 'Engineering the future'
  social_links JSONB DEFAULT '{}'::jsonb, -- LinkedIn, Twitter, etc.
  cv_url TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Portfolios (User Configuration)
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  theme_config JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  custom_domain TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Experience (Professional Timeline)
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT[] DEFAULT '{}'::text[], -- Array of bullet points
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Education (Academic Timeline)
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT NOT NULL,
  location TEXT,
  description TEXT,
  gpa TEXT,
  status TEXT,
  achievements TEXT[] DEFAULT '{}'::text[],
  link TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read portfolios" ON public.portfolios FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);

-- Authenticated management
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own portfolio" ON public.portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own experience" ON public.experience FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own education" ON public.education FOR ALL USING (auth.uid() = user_id);
