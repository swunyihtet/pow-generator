import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  title: string | null;
  tagline: string | null;
  bio: string | null;
  social_links: any;
  avatar_url: string | null;
  cv_url: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location: string | null;
  description: string | null;
  gpa: string | null;
  status: string | null;
  achievements: string[];
  link: string | null;
}

export function useProfile(username?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        
        // Fetch profile first
        let query = supabase.from("profiles").select("*");
        
        if (username) {
          query = query.eq("username", username);
        } else {
          // Default to first profile or handle accordingly
          // For now, let's just get any profile to display something
          query = query.limit(1);
        }

        const { data: profileData, error: profileError } = await query.single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        if (profileData) {
          // Fetch related data
          const [expRes, eduRes] = await Promise.all([
            supabase
              .from("experience")
              .select("*")
              .eq("user_id", profileData.id)
              .order("display_order", { ascending: true }),
            supabase
              .from("education")
              .select("*")
              .eq("user_id", profileData.id)
              .order("display_order", { ascending: true })
          ]);

          setExperiences(expRes.data || []);
          setEducation(eduRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [username]);

  return { profile, experiences, education, isLoading };
}
