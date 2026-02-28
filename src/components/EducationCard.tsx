import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EducationCardProps {
  degree: string;
  institution: string;
  year: string;
  description: string;
  achievements?: string[];
  gpa?: string;
  status?: string;
  location?: string;
  link?: string; // ✅ added link prop
}

export function EducationCard({
  degree,
  institution,
  year,
  description,
  achievements = [],
  gpa,
  status,
  location,
  link
}: EducationCardProps) {
  return (
    <Card className="card-modern hover-lift group relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-2 h-full gradient-primary opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground mb-2 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                {degree}
                <p className="text-base font-medium text-muted-foreground mt-1">{institution}</p>
              </div>
            </CardTitle>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-300"
            >
              <Calendar className="h-3 w-3 mr-1" />
              {year}
            </Badge>
            {location && (
              <Badge variant="outline" className="text-xs border-border/50">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        
        {(gpa || status) && (
          <div className="flex gap-2 flex-wrap">
            {gpa && (
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                GPA: {gpa}
              </Badge>
            )}
            {status && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                {status}
              </Badge>
            )}
          </div>
        )}

        {achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Notable Achievements:</h4>
            <ul className="space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {link && (
          <div className="pt-4">
            <Button asChild variant="outline" size="sm">
              <a href={link} target="_blank" rel="noopener noreferrer">
                View Certificate
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
