import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProjectSelector from "@/components/ProjectSelector";
import ProfileEditor from "@/components/ProfileEditor";
import TimelineManager from "@/components/TimelineManager";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  Lock, 
  ChevronLeft, 
  Terminal, 
  Cpu, 
  Activity,
  User,
  LogOut,
  AlertTriangle,
  LayoutGrid,
  FileUser,
  History
} from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        toast.error("Unauthorized Access Detected", {
          description: "Please authenticate to access the command center."
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.info("Session Terminated", {
      description: "Securely logged out of the command center."
    });
  };

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/admin'
      }
    });
    if (error) {
      toast.error("Authentication Failed", {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        <p className="font-mono text-primary text-xs uppercase tracking-[0.3em] animate-pulse">Authenticating Uplink...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full" style={{ 
            backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-effect border-2 border-primary/20 p-10 rounded-3xl shadow-glow relative z-10"
        >
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Restricted Area</h1>
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Access level: Administrator Only</p>
            </div>
            
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start gap-4 text-left">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200/70 font-mono leading-relaxed uppercase tracking-tight">
                System monitoring is active. Unauthorized access attempts are logged and reported to Parvix AI.
              </p>
            </div>

            <Button 
              onClick={handleGitHubLogin}
              className="w-full h-14 gradient-primary button-glow text-white font-black uppercase tracking-widest rounded-2xl"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Authenticate with GitHub
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-white font-bold uppercase tracking-widest text-[10px]"
            >
              <ChevronLeft className="mr-1 h-3 w-3" />
              Return to Public Nexus
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black uppercase tracking-tighter text-white">PoW Center</h1>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 mr-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 truncate max-w-[150px]">
                {session.user.email}
              </span>
            </div>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSignOut}
              className="border-white/10 hover:border-red-500/50 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Systems</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Activity, label: "Live Deployment", value: "v1.5.2" },
                  { icon: Cpu, label: "Neural Engine", value: "Parvix-G3" },
                  { icon: ShieldCheck, label: "Security Protocol", value: "AES-256" },
                  { icon: User, label: "Session TTL", value: "3600s" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white/70">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Control Access
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono uppercase tracking-tight">
                Synchronize your professional metadata with the global nexus. All updates are pushed to the public frontend in real-time.
              </p>
            </div>
          </div>

          {/* Interface Tabs */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                  <FileUser className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                  <History className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                  <LayoutGrid className="h-4 w-4" />
                  Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <ProfileEditor />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <TimelineManager />
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <ProjectSelector />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="py-10 flex justify-center opacity-30">
        <div className="flex items-center gap-8 font-mono text-[8px] uppercase tracking-[0.5em] text-muted-foreground">
          <span>// END_OF_TRANSMISSION</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
          <span>STAY_FOCUSED</span>
        </div>
      </footer>
    </div>
  );
};

export default Admin;