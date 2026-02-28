import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  github_repo_id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  is_featured: boolean;
  display_order: number;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true })
          .order("stargazers_count", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}
