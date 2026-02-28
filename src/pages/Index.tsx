import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EducationCard } from "@/components/EducationCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import SkillsTab from "@/components/SkillsTab";
import MissionArchive from "@/components/MissionArchive";
import { supabase } from "@/integrations/supabase/client";
import { Download, MapPin, Calendar, Building, GraduationCap, Mail, Phone, Github, Linkedin, Twitter, ExternalLink, Briefcase, Users, Trophy, Sparkles, Code, Server, Database, Cloud, Settings } from "lucide-react";


const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleHireMe = () => {
    setActiveTab("contact");
  };

  const handleDownloadCV = () => {
  // Google Drive direct download link
  const link = document.createElement('a');
  link.href = 'https://drive.google.com/uc?export=download&id=1M-5zqGhs7VKYDyBYnlK-IAhHKSuwvUYX'; // your file ID
  link.download = 'Swun_Yi_Htet_CV.pdf'; // suggested filename
  document.body.appendChild(link); // optional, ensures it works in some browsers
  link.click();
  document.body.removeChild(link); // cleanup
};

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Persist to Supabase Table
      const { error: dbError } = await supabase
        .from('portfolio_1')
        .insert([
          { 
            name: contactForm.name, 
            email: contactForm.email, 
            message: contactForm.message 
          }
        ]);

      if (dbError) throw dbError;

      // 2. Notify Parvix (AI Power Genius)
      const messageText = `🚀 NEW PORTFOLIO MESSAGE:\n\n👤 Name: ${contactForm.name}\n📧 Email: ${contactForm.email}\n📝 Message: ${contactForm.message}`;
      
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: messageText })
        });
      } catch (notifyError) {
        console.warn('Notification failed, but data was saved:', notifyError);
      }

      toast({
        title: "Transmission successful!",
        description: "Your data packet has been received and stored. I will respond shortly.",
      });

      setContactForm({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error('Transmission Error:', error);
      toast({
        title: "Uplink Failed",
        description: "There was an error saving your message. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/swun-yi-htet/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/swunyihtet", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/swanyihtat", label: "Twitter" },
    { icon: Mail, href: "mailto:swunyihtet@gmail.com", label: "Email" },
  ];

  const experiences = [
  {
    company: "KBZ Head-Office, Technology Function, PMO",
    position: "Project Coordinator",
    period: "May 2024 - Present",
    description: [
      "Prepare project charters, business requirement documents, and project contracts in line with business and technical needs.",
      "Lead and coordinate infrastructure projects such as Core Banking System Migration and SAP Migration.",
      "Collaborate with DBMS, Data Center & Cloud, Network, SOC, and other cross-functional teams.",
      "Facilitate communication between business and technical teams, translating requirements into actionable plans.",
      "Ensure alignment with project goals through UAT execution and infrastructure readiness."
    ]
  },
  {
    company: "SYSTEMATiC Co., Ltd, Business Development Team",
    position: "Project Coordinator",
    period: "Feb 2023 - May 2024",
    description: [
      "Coordinate full-cycle delivery of custom software projects (HR, ERP, POS) from initiation to completion.",
      "Ensure alignment with business requirements and maintain high client satisfaction.",
      "Lead ERP customization and implementation for clients including G&G, MIB, and Lucky Diamond Myanmar.",
      "Direct public website development projects such as Myanmar Metro Bank’s official site.",
      "Oversee creation of a Hospital Management System for San Thaw Dar Eye Clinic, improving efficiency and service quality."
    ]
  },
  {
    company: "Partner Associates Int'l Co., Ltd, PMO",
    position: "Project Coordinator",
    period: "Aug 2022 - Mar 2023",
    description: [
      "Collaborate with system engineers, software developers, infrastructure and network engineers, and IT operations to support project delivery.",
      "Manage project administration tasks including tool administration, facilities coordination, and project communication.",
      "Oversee ISO 9001:2015 & ISO 27001:2022 implementation and auditing processes."
    ]
  },
  {
    company: "Global Technology Companies Group (GlobalNet)",
    position: "Internee",
    period: "Dec 2018 - Feb 2019",
    description: [
      "Monitor network traffic and analyze data center conditions.",
      "Assist enterprise clients by scheduling appointments, introducing services, and maintaining client relationships."
    ]
  }
];


const education = [
  {
    degree: "Bachelor of Computer Engineering & Information Technology",
    institution: "Yangon Technological University (COE)",
    year: "2014 - 2019",
    location: "Yangon, Myanmar",
    description: "Focused on computer engineering principles, information technology systems, and software development.",
    gpa: "4.1/5.0",
    status: "Graduated",
    achievements: [
      "Completed final year project on computer engineering & IT systems",
      "Strong foundation in both hardware and software integration"
    ]
  },
  {
  degree: "Project Management Professional (PMP) Exam Prep",
  institution: "SAYA MYO’S PM SCHOOL",
  year: "Aug 2025 - Sep 2025",
  location: "Yangon, Myanmar",
  description: "Completed an intensive PMP preparation course focused on project planning, budgeting, and strategic decision-making aligned with PMI standards.",
  status: "Completed",
  achievements: [
    "Gained strong understanding of key project management processes and frameworks.",
    "Applied budgeting and cost-control methods to practical project scenarios.",
    "Enhanced leadership and analytical skills for effective project coordination."
  ]
},
  {
    degree: "Financial Management Course",
    institution: "Strategy First Institute",
    year: "2016",
    location: "Yangon, Myanmar",
    description: "Covered core financial planning, budgeting, and strategic decision-making skills.",
    status: "Completed",
    achievements: [
      "Built solid understanding of financial planning and control",
      "Applied budgeting concepts to practical case studies"
    ]
  },
  {
    degree: "Customer Service Management Course",
    institution: "PS Business School",
    year: "2022",
    location: "Yangon, Myanmar",
    description: "Specialized in effective customer relationship management and service excellence.",
    gpa: "Certified",
    status: "Completed",
    achievements: [
      "Trained in handling customer interactions with service excellence",
      "Enhanced skills in communication and conflict resolution"
    ]
  },
  {
    degree: "Business Analysis & Process Management",
    institution: "Coursera",
    year: "2024",
    location: "Online",
    description: "Gained expertise in business process modeling, gap analysis, and requirement gathering.",
    gpa: "Certified",
    status: "Completed",
    achievements: [
      "Completed professional certification",
      "Applied business process modeling techniques in case studies"
    ],
    link: "https://www.coursera.org/account/accomplishments/records/64GTHBU4QG5W"
  },
  {
    degree: "Career Essentials in Project Management",
    institution: "Microsoft and LinkedIn",
    year: "2024",
    location: "Online",
    description: "Learned project initiation, planning, execution, and stakeholder management.",
    gpa: "Certified",
    status: "Completed",
    achievements: [
      "Completed LinkedIn Career Essentials series",
      "Learned practical project management tools and workflows"
    ],
    link: "https://www.linkedin.com/learning/certificates/dca284f42be9b63f5af569698d77baf5b985bf6c17bab411d96b0f55f298a61c"
  },
  {
    degree: "Managing Project Stakeholders",
    institution: "Project Management Institute",
    year: "2024",
    location: "Online",
    description: "Focused on effective stakeholder engagement and communication strategies.",
    gpa: "Certified",
    status: "Completed",
    achievements: [
      "Mastered stakeholder communication strategies",
      "Learned advanced stakeholder analysis techniques"
    ],
    link: "https://www.linkedin.com/learning/certificates/e26cf8f48da2dbc4bb48283bf62a353b6c8c005f73315bf00eda4dc186dc49f3"
  },
  {
    degree: "Project Management Foundations",
    institution: "Project Management Institute",
    year: "2024",
    location: "Online",
    description: "Covered the fundamentals of project management frameworks, tools, and best practices.",
    gpa: "Certified",
    status: "Completed",
    achievements: [
      "Learned PMBOK-aligned fundamentals",
      "Built solid understanding of project planning and execution"
    ],
    link: "https://www.linkedin.com/learning/certificates/270ba9531254fe31e884ef72408ab31f1f0cf11911cfa5b1a727a6c949581cf0"
  }
];

  return (
    <div className="min-h-screen relative">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header with Navigation */}
        <header className="glass-effect sticky top-0 z-50 border-b border-border/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/fav.ico"
                  alt="Portfolio Logo"
                  className="h-8 w-8 rounded-xl shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className="text-xl font-bold text-gradient focus:outline-none"
                  aria-label="Go to Home"
                >
                  Portfolio
                </button>
              </div>
              
              {/* Navigation Tabs */}
              <TabsList className="hidden md:flex gap-2 bg-background/40 backdrop-blur-xl p-1 rounded-2xl border border-white/10">
                <TabsTrigger value="home" className="px-6 py-2 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] transition-all">Home</TabsTrigger>
                <TabsTrigger value="experiences" className="px-6 py-2 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] transition-all">Experience</TabsTrigger>
                <TabsTrigger value="projects" className="px-6 py-2 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] transition-all">Projects</TabsTrigger>
                <TabsTrigger value="skills" className="px-6 py-2 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] transition-all">Skills</TabsTrigger>
                <TabsTrigger value="education" className="px-6 py-2 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] transition-all">Education</TabsTrigger>
                <TabsTrigger value="contact" className="px-6 py-2 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] transition-all">Contact</TabsTrigger>
              </TabsList>
              
              <ThemeToggle />
            </div>
            
            {/* Mobile Navigation */}
            <TabsList className="md:hidden grid grid-cols-6 w-full gap-2 mt-5 bg-background/40 backdrop-blur-xl p-1 rounded-2xl border border-white/10">
              <TabsTrigger className="text-[10px] font-bold uppercase tracking-tighter" value="home">Home</TabsTrigger>
              <TabsTrigger className="text-[10px] font-bold uppercase tracking-tighter" value="experiences">Exp</TabsTrigger>
              <TabsTrigger className="text-[10px] font-bold uppercase tracking-tighter" value="projects">Proj</TabsTrigger>
              <TabsTrigger className="text-[10px] font-bold uppercase tracking-tighter" value="skills">Skills</TabsTrigger>
              <TabsTrigger className="text-[10px] font-bold uppercase tracking-tighter" value="education">Edu</TabsTrigger>
              <TabsTrigger className="text-[10px] font-bold uppercase tracking-tighter" value="contact">Comms</TabsTrigger>
            </TabsList>
          </div>
        </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Hexagonal Pattern Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="0.5"
                  opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20, letterSpacing: "-0.05em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black mb-6 text-gradient leading-tight tracking-tight uppercase"
            >
              Swun Yi Htet
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <p className="text-xl md:text-3xl text-foreground font-bold tracking-widest uppercase">
                AI Tech Visionary & Project Genius
              </p>
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">

          {/* Home Tab */}
          <TabsContent value="home">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              {/* Digital ID Card Section */}
              <div className="flex justify-center lg:justify-start">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: -50, rotateY: -30 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Digital ID Card */}
                  <div className="relative bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-3xl rounded-3xl p-8 border border-primary/30 shadow-2xl hover:shadow-glow transition-all duration-700 hover:scale-105 digital-id-glow group overflow-hidden">
                    
                    {/* Scanning Line Effect */}
                    <motion.div 
                      className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-20"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-pulse opacity-60"></div>
                    
                    {/* Profile Photo */}
                    <div className="relative flex justify-center mb-6 z-10">
                      {/* Profile Image */}
                      <motion.div 
                        className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img 
                          src="/lovable-uploads/5b781891-c13e-4d98-91df-abd9dfaf6af4.png" 
                          alt="Swun Yi Htet - Digital Profile"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </motion.div>
                    </div>

                    {/* Name and Tagline */}
                    <motion.div 
                      className="text-center mb-6 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h2 className="text-3xl font-black text-gradient mb-2 tracking-tighter uppercase">Swun Yi Htet</h2>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Badge variant="outline" className="border-primary/50 text-primary text-[10px] tracking-widest uppercase">Lead Architect</Badge>
                        <Badge variant="outline" className="border-secondary/50 text-secondary text-[10px] tracking-widest uppercase">AI Specialist</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-bold flex items-center justify-center gap-2 italic">
                        "Engineering the future through intelligence."
                      </p>
                    </motion.div>

                  </div>
                </motion.div>
              </div>

              {/* Content Section */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div>
                  <div className="text-lg leading-relaxed text-foreground/80 space-y-6">
                    <p className="border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                      Welcome to the nexus of innovation. 
                      I am <span className="text-primary font-black uppercase tracking-wider">Swun Yi Htet</span>, an <span className="text-secondary font-bold">IT Project Maestro</span> orchestrating the convergence of business strategy and high-tech infrastructure.
                    </p>
                    <p className="pl-7">
                      With over 4 years of experience navigating the complexities of large-scale tech migrations and software ecosystems, I specialize in transforming abstract visions into high-performance digital realities.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={handleHireMe}
                    size="lg"
                    className="gradient-primary button-glow text-white border-0 px-8 py-6 text-lg font-black rounded-2xl shadow-lg hover:shadow-glow uppercase tracking-widest"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Initialize Protocol
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleDownloadCV}
                    className="px-8 py-6 text-lg font-bold border-secondary/50 hover:border-secondary transition-all duration-300 hover:scale-105 hover:bg-secondary/10 rounded-2xl uppercase tracking-widest"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Extract Data (CV)
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex space-x-6">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 border border-border/50 hover:border-primary/50 rounded-2xl bg-card/20 backdrop-blur-sm"
                        onClick={() => window.open(social.href, '_blank')}
                      >
                        <social.icon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

          {/* Stats Dashboard */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="card-modern hover-lift text-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500 group-hover:rotate-[360deg]"
                  >
                    <Briefcase className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="text-4xl font-black mb-2 text-gradient tracking-tighter">4+ YEARS</h3>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Project Mastery</p>
                </CardContent>
              </Card>
              <Card className="card-modern hover-lift text-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all duration-500 group-hover:rotate-[360deg]"
                  >
                    <Trophy className="h-10 w-10 text-secondary" />
                  </motion.div>
                  <h3 className="text-4xl font-black mb-2 text-gradient tracking-tighter">25+ MISSIONS</h3>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Success Rate: 100%</p>
                </CardContent>
              </Card>
              <Card className="card-modern hover-lift text-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-500 group-hover:rotate-[360deg]"
                  >
                    <Users className="h-10 w-10 text-accent" />
                  </motion.div>
                  <h3 className="text-4xl font-black mb-2 text-gradient tracking-tighter">ELITE TEAMS</h3>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Global Collaboration</p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          
         {/* Experiences Tab */}
<TabsContent value="experiences">
  <div className="space-y-12">
    <motion.h2 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="text-5xl font-black text-gradient text-center mb-12 uppercase tracking-tighter"
    >
      Professional Timeline
    </motion.h2>
    <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8 space-y-12">
      {experiences.map((exp, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8"
        >
          {/* Timeline Dot */}
          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary shadow-glow border-2 border-background" />
          
          <Card className="hover-lift border-primary/20 bg-card/20 backdrop-blur-xl group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Briefcase className="h-20 w-20 text-primary" />
            </div>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-black text-primary uppercase tracking-tight">{exp.position}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 font-bold text-foreground/70">
                    <Building className="h-4 w-4 text-secondary" />
                    {exp.company}
                  </CardDescription>
                </div>
                <Badge
                  className="w-fit bg-primary/20 text-primary border-primary/40 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
                >
                  <Calendar className="h-3 w-3 mr-2" />
                  {exp.period}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {exp.description.map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3 text-muted-foreground group/item"
                    whileHover={{ x: 10 }}
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary group-hover/item:bg-primary transition-colors shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <SkillsTab />
          </TabsContent>

          {/* Mission Archive (Projects) Tab */}
          <TabsContent value="projects">
            <MissionArchive />
          </TabsContent>

           {/* Education Tab */}
                    <TabsContent value="education" className="animate-fade-in">
                      <div className="space-y-8">
                        <div className="text-center space-y-4 mb-12">
                          <h2 className="text-4xl font-bold text-gradient">Educational Background</h2>
                          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            My academic journey and continuous learning path 
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                          {education.map((edu, index) => (
                            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                              <EducationCard
                                degree={edu.degree}
                                institution={edu.institution}
                                year={edu.year}
                                location={edu.location}
                                description={edu.description}
                                gpa={edu.gpa}
                                status={edu.status}
                                achievements={edu.achievements}
                                link={edu.link}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="max-w-4xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5_font-black text-gradient text-center mb-12 uppercase tracking-tighter"
              >
                Establish Uplink
              </motion.h2>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-3 border-primary/20 bg-card/20 backdrop-blur-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl font-bold uppercase tracking-tight">Secure Transmission</CardTitle>
                    <CardDescription className="font-medium">
                      Encrypted communication channel for high-priority inquiries.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Identity</label>
                          <Input 
                            placeholder="Full Name" 
                            required 
                            className="h-12 border-primary/20 focus:border-primary bg-background/20 backdrop-blur-sm rounded-xl"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Digital Address</label>
                          <Input 
                            type="email" 
                            placeholder="Email" 
                            required 
                            className="h-12 border-secondary/20 focus:border-secondary bg-background/20 backdrop-blur-sm rounded-xl"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Payload</label>
                        <Textarea 
                          placeholder="Your Message..." 
                          className="min-h-[180px] border-accent/20 focus:border-accent bg-background/20 backdrop-blur-sm rounded-xl resize-none" 
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-14 gradient-primary button-glow text-white border-0 font-black uppercase tracking-[0.3em] rounded-xl shadow-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "TRANSMITTING..." : "SEND PACKET"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-secondary/20 bg-card/20 backdrop-blur-2xl">
                    <CardContent className="p-8 space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Direct Access</h4>
                        <div className="space-y-4">
                          <motion.a 
                            href="mailto:swunyihtet@gmail.com" 
                            className="flex items-center gap-4 group p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/40 transition-all"
                            whileHover={{ x: 10 }}
                          >
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                              <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Email</p>
                              <p className="text-sm font-bold truncate">swunyihtet@gmail.com</p>
                            </div>
                          </motion.a>
                          <motion.a 
                            href="tel:+959987443032" 
                            className="flex items-center gap-4 group p-4 rounded-2xl bg-secondary/5 border border-secondary/10 hover:border-secondary/40 transition-all"
                            whileHover={{ x: 10 }}
                          >
                            <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                              <Phone className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-secondary/70">Comms</p>
                              <p className="text-sm font-bold">+95 9 987 443 032</p>
                            </div>
                          </motion.a>
                          <motion.div 
                            className="flex items-center gap-4 group p-4 rounded-2xl bg-accent/5 border border-accent/10 hover:border-accent/40 transition-all"
                            whileHover={{ x: 10 }}
                          >
                            <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-accent/70">Base</p>
                              <p className="text-sm font-bold">Yangon, Myanmar</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
};

export default Index;
// Cache bust: Tue Feb 24 07:20:37 UTC 2026
// Author sync: Tue Feb 24 07:24:21 UTC 2026
