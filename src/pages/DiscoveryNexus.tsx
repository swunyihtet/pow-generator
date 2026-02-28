import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Terminal, Sparkles, Github } from "lucide-react";

const DiscoveryNexus = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Cyber-Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full" style={{ 
          backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating Particle Effects (Simulated) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="max-w-4xl w-full text-center relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Terminal className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/70">Protocol v2.0 // Active</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-gradient leading-[0.9]">
            Proof <br /> of Work
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed pt-4">
            Transform your GitHub trajectory into a <br />
            <span className="text-white">high-performance digital identity.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button 
            onClick={() => navigate("/admin")}
            size="lg"
            className="w-full sm:w-auto h-16 px-10 gradient-primary button-glow text-white font-black uppercase tracking-[0.2em] rounded-2xl border-0"
          >
            <ShieldCheck className="mr-3 h-5 w-5" />
            Initialize Admin
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => window.open('https://github.com/swunyihtet/proof-of-work', '_blank')}
            className="w-full sm:w-auto h-16 px-10 border-white/10 hover:border-primary/50 bg-white/5 hover:bg-primary/5 font-bold uppercase tracking-[0.2em] rounded-2xl"
          >
            <Github className="mr-3 h-5 w-5" />
            Join the Nexus
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12"
        >
          {[
            { label: "Dynamic Curation", desc: "Sync missions directly from GitHub source." },
            { label: "Neural Identity", desc: "AI-optimized professional narrative mapping." },
            { label: "Persistence Layer", desc: "Full control over your digital archive." }
          ].map((feature, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">{feature.label}</h4>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Footer */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4 opacity-20">
        <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent"></div>
        <div className="flex gap-8 font-mono text-[8px] uppercase tracking-[1em] text-muted-foreground">
          <span>// DECENTRALIZED_WORK_VERIFICATION</span>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryNexus;
