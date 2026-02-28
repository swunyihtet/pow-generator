import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Brain, 
  Network, 
  Lock, 
  Binary,
  Layers,
  Activity,
  Terminal,
  Code
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/hooks/use-projects";

const baseModules = [
  {
    id: "01",
    title: "PROJECT_ORCHESTRATION",
    standard: ["PMP Frameworks", "Business Requirement Documents (BRDs)", "Stakeholder Alignment"],
    elite: ["Crisis Recovery Logic", "Dynamic Resource Reallocation", "Quantum Mitigation Strategies", "Risk Matrix Neural Mapping", "Critical Path Hyper-Optimization"],
    icon: Network,
  },
  {
    id: "02",
    title: "INFRASTRUCTURE_MIGRATION",
    standard: ["Core Banking Systems", "SAP Integration", "Cloud Architecture (AWS/Azure)"],
    elite: ["Zero-Downtime Strategy", "Legacy-to-Cloud Warp Path", "Automated Resilience Protocols", "Tanzu Cluster Harmonization", "Data Sharding Synchro-Stream"],
    icon: Layers,
  },
  {
    id: "03",
    title: "AI_INTEGRATION_LABS",
    standard: ["LLM Prompt Engineering", "Workflow Automation", "RAG Systems"],
    elite: ["Autonomous Agent Orchestration", "Neural Process Optimization", "Cognitive Mesh Networks", "Self-Evolving Agent Frameworks", "Multi-Modal Logic Chains"],
    icon: Brain,
  },
  {
    id: "04",
    title: "SYSTEM_OPERATIONS",
    standard: ["ISO 9001/27001 Compliance", "SOC Monitoring", "IT Governance"],
    elite: ["Predictive Threat Analysis", "Heuristic Vulnerability Scanning", "Self-Healing Infrastructure", "Zero-Trust Architecture Alpha", "Active Counter-Incursion Logic"],
    icon: ShieldAlert,
  },
  {
    id: "05",
    title: "STRATEGIC_COGNITION",
    standard: ["Business Modeling", "Gap Analysis", "Market Research"],
    elite: ["Market Disruption Strategy", "Game-Theoretic Forecasting", "Exponential Growth Modeling", "Scenario Warp-Modeling", "Cross-Industry Synthesis"],
    icon: Binary,
  },
];

const SkillsTab = ({ defaultOverclock = false }: { defaultOverclock?: boolean }) => {
  const [overclock, setOverclock] = useState(defaultOverclock);
  const { projects } = useProjects();

  useEffect(() => {
    setOverclock(defaultOverclock);
  }, [defaultOverclock]);
  const [dynamicTech, setDynamicTech] = useState<string[]>([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      // Extract unique languages/tech from synced projects
      const tech = Array.from(new Set(projects.map(p => p.language).filter(Boolean))) as string[];
      setDynamicTech(tech);
    }
  }, [projects]);

  const modules = [
    ...baseModules,
    // Add dynamic TECH_STACK module if we have data
    ...(dynamicTech.length > 0 ? [{
      id: "06",
      title: "LIVE_TECH_STACK",
      standard: dynamicTech.slice(0, 3),
      elite: dynamicTech.slice(3, 8).length > 0 ? dynamicTech.slice(3, 8) : ["Continuous Integration", "Cloud Native Ops"],
      icon: Code,
    }] : []),
  ];

  const themeColor = overclock ? "orange" : "cyan";
  const accentColor = overclock ? "text-orange-500" : "text-cyan-400";
  const borderColor = overclock ? "border-orange-500/50" : "border-cyan-500/30";

  return (
    <div className={`min-h-[80vh] p-4 md:p-8 transition-colors duration-1000 ${overclock ? 'bg-[#1a0f00]' : 'bg-[#000a12]'}`}>
      {/* System Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border-2 ${borderColor} bg-black/40`}>
            <Cpu className={`h-8 w-8 ${accentColor} ${overclock ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h2 className={`text-4xl font-black tracking-tighter uppercase ${overclock ? 'text-orange-500' : 'text-cyan-400'}`}>
              System Modules
            </h2>
            <div className="flex items-center gap-2">
              <Activity className={`h-3 w-3 ${overclock ? 'text-orange-400' : 'text-cyan-400'}`} />
              <span className={`text-[10px] font-mono tracking-widest uppercase opacity-70 ${overclock ? 'text-orange-300' : 'text-cyan-300'}`}>
                {overclock ? "STATUS: EXTREME_PERFORMANCE" : "STATUS: OPTIMAL_STABILITY"}
              </span>
            </div>
          </div>
        </div>

        {/* Overclock Toggle */}
        <div className={`flex items-center space-x-4 p-4 rounded-2xl border ${borderColor} bg-black/40 backdrop-blur-xl transition-all duration-500 ${overclock ? 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' : ''}`}>
          <Label 
            htmlFor="overclock-mode" 
            className={`font-mono text-sm font-bold tracking-tighter ${overclock ? 'text-orange-500' : 'text-cyan-400'}`}
          >
            {overclock ? "OVERCLOCK ACTIVE" : "STANDARD MODE"}
          </Label>
          <Switch
            id="overclock-mode"
            checked={overclock}
            onCheckedChange={setOverclock}
            className={`data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-cyan-900`}
          />
          <Zap className={`h-5 w-5 ${overclock ? 'text-orange-500 animate-bounce' : 'text-cyan-900'}`} />
        </div>
      </div>

      {/* Motherboard Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        <AnimatePresence mode="popLayout">
          {modules.map((module, idx) => (
            <motion.div
              key={module.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { 
                  delay: idx * 0.1,
                  duration: overclock ? 0.3 : 0.6 
                }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              <Card className={`h-full border-2 bg-black/60 backdrop-blur-xl overflow-hidden group transition-all duration-500 ${borderColor} ${overclock ? 'hover:border-orange-400' : 'hover:border-cyan-400'}`}>
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`text-3xl font-mono font-black opacity-20 ${overclock ? 'text-orange-500' : 'text-cyan-500'}`}>
                      {module.id}
                    </div>
                    <module.icon className={`h-8 w-8 ${accentColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  <h3 className={`text-xl font-black mb-6 tracking-tighter uppercase ${overclock ? 'text-white' : 'text-cyan-50'}`}>
                    {module.title}
                  </h3>

                  <div className="space-y-6">
                    {/* Standard Skills */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-1 flex-1 bg-gradient-to-r from-transparent ${overclock ? 'via-orange-900' : 'via-cyan-950'} to-transparent`} />
                        <span className={`text-[10px] font-mono tracking-widest uppercase opacity-50 ${overclock ? 'text-orange-300' : 'text-cyan-300'}`}>Standard</span>
                        <div className={`h-1 flex-1 bg-gradient-to-r from-transparent ${overclock ? 'via-orange-900' : 'via-cyan-950'} to-transparent`} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {module.standard.map((skill, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className={`bg-black/40 font-mono text-[10px] border-white/5 ${overclock ? 'text-orange-200/70' : 'text-cyan-200/70'}`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Elite Skills */}
                    <motion.div 
                      className="space-y-3"
                      animate={{ 
                        opacity: overclock ? 1 : 0.3,
                        filter: overclock ? 'blur(0px)' : 'blur(1px)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-1 flex-1 bg-gradient-to-r from-transparent ${overclock ? 'via-orange-500' : 'via-cyan-900/50'} to-transparent`} />
                        <span className={`text-[10px] font-mono tracking-widest uppercase font-black ${overclock ? 'text-orange-400' : 'text-cyan-700'}`}>Elite</span>
                        <div className={`h-1 flex-1 bg-gradient-to-r from-transparent ${overclock ? 'via-orange-500' : 'via-cyan-900/50'} to-transparent`} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {module.elite.map((skill, i) => (
                          <Badge 
                            key={i} 
                            className={`font-mono text-[10px] border-0 transition-all duration-700 ${
                              overclock 
                                ? 'bg-orange-500 text-black font-black shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
                                : 'bg-cyan-950/30 text-cyan-900 cursor-not-allowed'
                            }`}
                          >
                            {overclock ? skill : "LOCKED"}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillsTab;
