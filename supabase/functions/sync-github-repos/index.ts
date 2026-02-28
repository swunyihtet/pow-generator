import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not set");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials are not set");

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      req.headers.get("Authorization")?.split(" ")[1] || ""
    );

    if (userError || !user) throw new Error("Unauthorized: Invalid session");

    // Fetch user repos from GitHub
    // Note: In production, we'd use the user's specific provider_token from supabase.auth.getSession()
    // passed from the client, but for now we use the system token filtered for this user.
    console.log(`Fetching repos for user ${user.id} from GitHub...`);
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "Proof-of-Work-Portfolio-Sync",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${errorText}`);
    }

    const repos = await response.json();
    console.log(`Found ${repos.length} repos.`);

    const projectsToUpsert = repos.map((repo: any) => ({
      github_repo_id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      last_fetched_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id,
    }));

    // Upsert to Supabase
    const { error: upsertError } = await supabase
      .from("projects")
      .upsert(projectsToUpsert, { onConflict: "github_repo_id" });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true, count: repos.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
