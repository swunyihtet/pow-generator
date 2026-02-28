import React, { useState } from "react";
import { motion } from "framer-motion";
import { useProjects, Project } from "@/hooks/use-projects";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  RefreshCw,
  Github,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const ProjectSelector = () => {
  const { projects, isLoading, error } = useProjects();
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize local state when projects are loaded
  React.useEffect(() => {
    if (projects) {
      setLocalProjects(projects);
    }
  }, [projects]);

  const handleToggleFeatured = (id: string) => {
    setLocalProjects(prev => 
      prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p)
    );
  };

  const handleOrderChange = (id: string, value: string) => {
    const order = parseInt(value) || 0;
    setLocalProjects(prev => 
      prev.map(p => p.id === id ? { ...p, display_order: order } : p)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update each project one by one for simplicity in this implementation
      // A batch update via RPC would be more efficient for production
      const updates = localProjects.map(p => 
        supabase
          .from("projects")
          .update({ 
            is_featured: p.is_featured, 
            display_order: p.display_order 
          })
          .eq("id", p.id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        console.error("Errors during save:", errors);
        toast.error("Failed to save some project settings");
      } else {
        toast.success("Project settings updated successfully", {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-github-repos", {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      if (error) throw error;
      
      toast.success("GitHub synchronization complete", {
        description: `Synced ${data?.synced_count || 'new'} repositories.`
      });
      
      // Refresh the page or trigger a re-fetch
      window.location.reload();
    } catch (err: any) {
      console.error("Sync error:", err);
      toast.error("Synchronization failed", {
        description: err.message || "Check Edge Function logs"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Querying Project Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl flex flex-col items-center gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-bold">Access Denied</h3>
          <p className="text-sm text-muted-foreground">Failed to retrieve projects from Supabase.</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">Retry Authorization</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-effect p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gradient uppercase tracking-tighter flex items-center gap-3">
            Project Command Center
          </h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Interface Status: Active // System: Ready
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl"
          >
            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Sync GitHub
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="gradient-primary button-glow text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg border-0"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Deploy Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {localProjects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
            <Github className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">No project records found in repository archive.</p>
          </div>
        ) : (
          localProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-2 transition-all duration-300 bg-black/40 backdrop-blur-xl overflow-hidden group ${
                project.is_featured ? "border-primary shadow-glow" : "border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className={`p-3 rounded-2xl ${project.is_featured ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                        <Github className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate uppercase tracking-tight">
                            {project.name}
                          </h3>
                          {project.is_featured && (
                            <Star className="h-4 w-4 fill-primary text-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                          {project.description || "No mission briefing available."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="flex items-center gap-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Featured</Label>
                        <Switch 
                          checked={project.is_featured}
                          onCheckedChange={() => handleToggleFeatured(project.id)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-secondary/70">Order</Label>
                        <div className="relative w-24">
                          <Input 
                            type="number"
                            value={project.display_order}
                            onChange={(e) => handleOrderChange(project.id, e.target.value)}
                            className="h-10 border-white/10 bg-black/20 text-center font-mono font-bold focus:border-secondary rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                        <Star className="h-3 w-3 text-secondary" />
                        <span className="text-xs font-mono font-bold">{project.stargazers_count}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectSelector;