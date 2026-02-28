import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lock, Terminal, Shield, Cpu, Database, Globe, Layers, Loader2 } from "lucide-react";
import { useProjects, Project as SupabaseProject } from "@/hooks/use-projects";

interface Project {
  title: string;
  description: string;
  type: "professional" | "personal";
  company?: string;
  technologies: string[];
  link?: string;
  details?: string;
}

const MissionArchive = ({ userId }: { userId?: string }) => {
  const { projects: githubProjects, isLoading } = useProjects(userId);

  const staticProjects: Project[] = [
    {
      title: "Core Banking System Migration",
      company: "KBZ Bank",
      description: "Critical infrastructure migration to Tanzu-based cloud architecture.",
      type: "professional",
      technologies: ["VMware Tanzu", "Java", "Oracle", "Cloud Infrastructure"],
      details: "Orchestrated the migration of core banking services ensuring zero downtime and strict regulatory compliance. Coordinated across DBMS, Network, and Security functions."
    },
    {
      title: "ERP Customization & Implementation",
      company: "SYSTEMATiC Co., Ltd",
      description: "Full-cycle delivery of custom ERP solutions for enterprise clients.",
      type: "professional",
      technologies: ["ERP", "Project Coordination", "Business Analysis"],
      details: "Led implementation for G&G, MIB, and Lucky Diamond Myanmar. Streamlined business processes and enhanced operational efficiency."
    }
  ];

  // Map Supabase projects to UI structure
  const dynamicProjects: Project[] = githubProjects
    .filter(gp => gp.is_featured)
    .map(gp => ({
      title: gp.name,
      description: gp.description || "No description provided.",
      type: "personal",
      technologies: gp.language ? [gp.language] : [],
      link: gp.html_url,
      details: `GitHub Stats: ${gp.stargazers_count} stars. Verified repository from developer profile.`
    }));

  const allProjects = [...staticProjects, ...dynamicProjects];

  if (isLoading && githubProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Accessing Encrypted Projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-gradient uppercase tracking-tighter"
        >
          Mission Archive
        </motion.h2>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
          Chronicle of Operations // Access Level: Restricted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};


const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isProfessional = project.type === "professional";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className={`h-full border-2 transition-all duration-500 overflow-hidden relative group ${
        isProfessional 
          ? "border-primary/20 bg-black/40 backdrop-blur-xl" 
          : "border-secondary/20 bg-slate-950 font-mono"
      } ${isHovered ? (isProfessional ? "border-primary shadow-glow" : "border-secondary shadow-[0_0_20px_rgba(14,165,233,0.3)]") : ""}`}>
        
        {/* Card Header Decoration */}
        <div className={`absolute top-0 left-0 w-full h-1 ${
          isProfessional ? "bg-primary/30" : "bg-secondary/30"
        }`} />

        <CardContent className="p-6 pt-8">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${isProfessional ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
              {isProfessional ? <Shield className="h-5 w-5" /> : <Terminal className="h-5 w-5" />}
            </div>
            <Badge variant="outline" className={`text-[10px] uppercase tracking-tighter ${
              isProfessional ? "border-primary/50 text-primary" : "border-secondary/50 text-secondary"
            }`}>
              {isProfessional ? `[DECRYPTED_ARCHIVE]` : `[R&D_LAB_BETA]`}
            </Badge>
          </div>

          <h3 className={`text-xl font-bold mb-2 uppercase tracking-tight text-white drop-shadow-md`}>
            {project.title}
          </h3>

          {project.company && (
            <p className="text-xs font-black text-muted-foreground mb-4 flex items-center gap-2">
              <Globe className="h-3 w-3" />
              {project.company.toUpperCase()}
            </p>
          )}

          {/* Project Description with Decryption Effect */}
          <div className="relative mb-6">
            {isProfessional ? (
              <div className="relative">
                <p className={`text-sm leading-relaxed transition-all duration-700 ${
                  isHovered ? "opacity-100 blur-0" : "opacity-40 blur-[4px] select-none"
                }`}>
                  {project.description}
                </p>
                {!isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary animate-pulse uppercase tracking-[0.2em]">
                      <Lock className="h-3 w-3" />
                      Hover to Decrypt
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-secondary/80">
                  <span className="text-secondary opacity-50">$</span> tail -f mission_briefing.log
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, i) => (
              <span 
                key={i} 
                className={`text-[9px] px-2 py-0.5 rounded border ${
                  isProfessional 
                    ? "border-primary/30 text-primary bg-primary/5" 
                    : "border-secondary/30 text-secondary bg-secondary/5 font-mono"
                }`}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Hover Reveal Content */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border/30 pt-4"
              >
                <div className={`p-3 rounded-lg ${isProfessional ? "bg-primary/5" : "bg-secondary/5"}`}>
                  <p className={`text-xs leading-relaxed ${isProfessional ? "text-foreground/80" : "text-secondary/70 font-mono"}`}>
                    {isProfessional ? "" : "> "}
                    {project.details}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Decorative corner elements */}
        <div className="absolute bottom-0 right-0 p-1">
          <div className={`w-4 h-4 border-r-2 border-b-2 ${isProfessional ? "border-primary/30" : "border-secondary/30"}`} />
        </div>
      </Card>
    </motion.div>
  );
};

export default MissionArchive;
