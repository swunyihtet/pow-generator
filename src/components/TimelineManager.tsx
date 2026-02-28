import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Loader2,
  Calendar,
  Building2,
  Trophy,
  Save
} from "lucide-react";

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string[];
  display_order: number;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  achievements: string[];
  display_order: number;
}

const TimelineManager = () => {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [expRes, eduRes] = await Promise.all([
        supabase.from("experience").select("*").eq("user_id", user.id).order("display_order", { ascending: true }),
        supabase.from("education").select("*").eq("user_id", user.id).order("display_order", { ascending: true })
      ]);

      if (expRes.error) throw expRes.error;
      if (eduRes.error) throw eduRes.error;

      setExperiences(expRes.data || []);
      setEducation(eduRes.data || []);
    } catch (error: any) {
      toast.error("Data Fetch Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async () => {
    if (!userId) return;
    const newExp = {
      user_id: userId,
      company: "New Company",
      position: "New Position",
      period: "2024 - Present",
      description: [""],
      display_order: experiences.length
    };

    const { data, error } = await supabase.from("experience").insert(newExp).select().single();
    if (error) {
      toast.error("Error adding experience");
    } else {
      setExperiences([...experiences, data]);
      toast.success("Experience record created");
    }
  };

  const addEducation = async () => {
    if (!userId) return;
    const newEdu = {
      user_id: userId,
      degree: "New Degree",
      institution: "New Institution",
      year: "2024",
      achievements: [""],
      display_order: education.length
    };

    const { data, error } = await supabase.from("education").insert(newEdu).select().single();
    if (error) {
      toast.error("Error adding education");
    } else {
      setEducation([...education, data]);
      toast.success("Education record created");
    }
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      setExperiences(experiences.filter(e => e.id !== id));
      toast.success("Record purged");
    }
  };

  const deleteEducation = async (id: string) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      setEducation(education.filter(e => e.id !== id));
      toast.success("Record purged");
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    const { error } = await supabase.from("experience").update(updates).eq("id", id);
    if (error) {
      toast.error("Update failed");
    } else {
      setExperiences(experiences.map(e => e.id === id ? { ...e, ...updates } : e));
    }
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    const { error } = await supabase.from("education").update(updates).eq("id", id);
    if (error) {
      toast.error("Update failed");
    } else {
      setEducation(education.map(e => e.id === id ? { ...e, ...updates } : e));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Card className="glass-effect border-white/10 bg-black/40 shadow-glow overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Timeline Engine</CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase tracking-widest">Manage your professional and academic trajectory</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-xl mb-8">
            <TabsTrigger value="experience" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">Experience</TabsTrigger>
            <TabsTrigger value="education" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission History</h4>
              <Button onClick={addExperience} size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 text-primary h-8 rounded-lg">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Entry
              </Button>
            </div>
            
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 group relative">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => deleteExperience(exp.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity / Company</Label>
                      <Input 
                        value={exp.company} 
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="bg-black/40 border-white/10 focus:border-primary/50 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Designation</Label>
                      <Input 
                        value={exp.position} 
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        className="bg-black/40 border-white/10 focus:border-primary/50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Temporal Window (Period)</Label>
                    <Input 
                      value={exp.period} 
                      onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                      placeholder="e.g. 2022 - PRESENT"
                      className="bg-black/40 border-white/10 focus:border-primary/50 text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mission Brief (Bullets)</Label>
                    <Textarea 
                      value={exp.description.join("\n")} 
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value.split("\n") })}
                      placeholder="Enter each bullet point on a new line"
                      className="bg-black/40 border-white/10 focus:border-primary/50 min-h-[100px] text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Academic Records</h4>
              <Button onClick={addEducation} size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 text-primary h-8 rounded-lg">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Entry
              </Button>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={edu.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 group relative">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => deleteEducation(edu.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Institution</Label>
                      <Input 
                        value={edu.institution} 
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        className="bg-black/40 border-white/10 focus:border-primary/50 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Degree / Certification</Label>
                      <Input 
                        value={edu.degree} 
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        className="bg-black/40 border-white/10 focus:border-primary/50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Completion Year</Label>
                    <Input 
                      value={edu.year} 
                      onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                      className="bg-black/40 border-white/10 focus:border-primary/50 text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Achievements / Details</Label>
                    <Textarea 
                      value={edu.achievements.join("\n")} 
                      onChange={(e) => updateEducation(edu.id, { achievements: e.target.value.split("\n") })}
                      placeholder="Enter each achievement on a new line"
                      className="bg-black/40 border-white/10 focus:border-primary/50 min-h-[100px] text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimelineManager;