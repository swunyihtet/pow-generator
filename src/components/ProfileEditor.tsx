import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Briefcase, Globe, Twitter, Linkedin, Github, Save, Loader2, Upload, FileText, Image as ImageIcon } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  title: string | null;
  tagline: string | null;
  bio: string | null;
  social_links: any;
  avatar_url: string | null;
  cv_url: string | null;
  theme_config: any;
}

const ProfileEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist yet, create a default one
          const newProfile = {
            id: user.id,
            username: user.email?.split("@")[0] || `user_${Math.floor(Math.random() * 1000)}`,
            full_name: "",
            title: "",
            tagline: "",
            bio: "",
            social_links: { twitter: "", linkedin: "", github: "", website: "" },
            theme_config: { overclock: false }
          };
          const { data: createdData, error: createError } = await supabase
            .from("profiles")
            .insert(newProfile)
            .select()
            .single();
          
          if (createError) throw createError;
          setProfile(createdData);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      toast.error("Error fetching profile", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv') => {
    try {
      const file = event.target.files?.[0];
      if (!file || !profile) return;

      // Validation
      if (type === 'avatar') {
        if (!file.type.startsWith('image/')) {
          toast.error("Invalid file type", { description: "Please upload an image for your avatar." });
          return;
        }
        setUploadingAvatar(true);
      } else {
        if (file.type !== 'application/pdf' && !file.type.includes('msword') && !file.type.includes('officedocument')) {
          toast.error("Invalid file type", { description: "Please upload a PDF or document for your CV." });
          return;
        }
        setUploadingCV(true);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setProfile({
        ...profile,
        [type === 'avatar' ? 'avatar_url' : 'cv_url']: publicUrl
      });

      toast.success(`${type === 'avatar' ? 'Avatar' : 'CV'} uploaded`, { 
        description: "File successfully stored in your neural storage." 
      });

    } catch (error: any) {
      toast.error("Upload failed", { 
        description: error.message.includes('bucket not found') 
          ? "Storage system offline. Please contact administrator." 
          : error.message 
      });
    } finally {
      setUploadingAvatar(false);
      setUploadingCV(false);
      // Reset input
      if (event.target) event.target.value = '';
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          title: profile.title,
          tagline: profile.tagline,
          bio: profile.bio,
          social_links: profile.social_links,
          avatar_url: profile.avatar_url,
          cv_url: profile.cv_url,
          theme_config: profile.theme_config,
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast.success("Profile updated", { description: "Your digital identity has been synchronized." });
    } catch (error: any) {
      toast.error("Update failed", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updateSocial = (key: string, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      social_links: {
        ...profile.social_links,
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <Card className="glass-effect border-white/10 bg-black/40 shadow-glow overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight">Identity Hub</CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase tracking-widest">Configure your public-facing persona</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Avatar Asset</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={profile.avatar_url || ""} 
                    onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                    placeholder="https://example.com/avatar.png"
                    className="bg-white/5 border-white/10 focus:border-primary/50 pl-10 h-11 rounded-xl"
                  />
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={avatarInputRef} 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'avatar')}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 shrink-0"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-primary" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">CV / Documentation</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={profile.cv_url || ""} 
                    onChange={(e) => setProfile({...profile, cv_url: e.target.value})}
                    placeholder="https://drive.google.com/..."
                    className="bg-white/5 border-white/10 focus:border-primary/50 pl-10 h-11 rounded-xl"
                  />
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={cvInputRef} 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'cv')}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 shrink-0"
                  onClick={() => cvInputRef.current?.click()}
                  disabled={uploadingCV}
                >
                  {uploadingCV ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-primary" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
              <Input 
                value={profile.full_name || ""} 
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                placeholder="Major Kusanagi"
                className="bg-white/5 border-white/10 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Title / Role</Label>
              <Input 
                value={profile.title || ""} 
                onChange={(e) => setProfile({...profile, title: e.target.value})}
                placeholder="Full-Stack Cyber-Engineer"
                className="bg-white/5 border-white/10 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mission Tagline</Label>
            <Input 
              value={profile.tagline || ""} 
              onChange={(e) => setProfile({...profile, tagline: e.target.value})}
              placeholder="Engineering the future of decentralized intelligence."
              className="bg-white/5 border-white/10 focus:border-primary/50 h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Bio / Transmission</Label>
            <Textarea 
              value={profile.bio || ""} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              placeholder="Brief summary of your capabilities and background..."
              className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[120px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Personalization</h4>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Default Public Mode</Label>
                <p className="text-[9px] text-muted-foreground uppercase font-mono tracking-tight">Set high-intensity orange as your public default</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black uppercase tracking-tighter ${profile.theme_config?.overclock ? 'text-primary' : 'text-muted-foreground'}`}>Overclock</span>
                <Switch 
                  checked={profile.theme_config?.overclock || false}
                  onCheckedChange={(val) => setProfile({...profile, theme_config: {...profile.theme_config, overclock: val}})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile.social_links?.github || ""} 
                  onChange={(e) => updateSocial("github", e.target.value)}
                  placeholder="github.com/username"
                  className="bg-white/5 border-white/10 focus:border-primary/50 pl-10 h-10 rounded-xl text-xs"
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile.social_links?.linkedin || ""} 
                  onChange={(e) => updateSocial("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="bg-white/5 border-white/10 focus:border-primary/50 pl-10 h-10 rounded-xl text-xs"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile.social_links?.twitter || ""} 
                  onChange={(e) => updateSocial("twitter", e.target.value)}
                  placeholder="twitter.com/username"
                  className="bg-white/5 border-white/10 focus:border-primary/50 pl-10 h-10 rounded-xl text-xs"
                />
              </div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={profile.social_links?.website || ""} 
                  onChange={(e) => updateSocial("website", e.target.value)}
                  placeholder="portfolio.io"
                  className="bg-white/5 border-white/10 focus:border-primary/50 pl-10 h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={saving}
              className="gradient-primary button-glow text-white font-bold uppercase tracking-widest px-8 rounded-xl"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Synchronize Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;