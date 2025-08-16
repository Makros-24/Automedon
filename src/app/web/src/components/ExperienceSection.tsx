import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin } from "lucide-react";

export function ExperienceSection() {
  const experiences = [
    {
      title: "Senior Software Architect",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      period: "2021 - Present",
      description: "Lead architecture and engineering teams for enterprise-scale applications serving 1M+ users.",
      achievements: [
        "Designed microservices architecture reducing system latency by 40%",
        "Led migration to cloud-native infrastructure saving $200K annually",
        "Mentored 8 junior developers and established engineering best practices"
      ],
      technologies: ["AWS", "Kubernetes", "Python", "React", "PostgreSQL"]
    },
    {
      title: "Full Stack Team Lead",
      company: "InnovateLabs",
      location: "Austin, TX",
      period: "2018 - 2021",
      description: "Managed development of B2B SaaS platform while contributing to hands-on development.",
      achievements: [
        "Grew development team from 3 to 12 engineers",
        "Implemented CI/CD pipeline reducing deployment time by 75%",
        "Architected real-time analytics system processing 10M+ events daily"
      ],
      technologies: ["Node.js", "React", "MongoDB", "Docker", "Jenkins"]
    },
    {
      title: "Senior Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      period: "2016 - 2018",
      description: "Built core platform features and established scalable development practices for fast-growing startup.",
      achievements: [
        "Developed MVP that secured $5M Series A funding",
        "Optimized database queries improving response times by 60%",
        "Built automated testing suite achieving 90% code coverage"
      ],
      technologies: ["JavaScript", "Vue.js", "Express", "MySQL", "Redis"]
    },
    {
      title: "Software Developer",
      company: "Enterprise Systems Inc.",
      location: "New York, NY",
      period: "2014 - 2016",
      description: "Developed and maintained legacy enterprise applications while modernizing technology stack.",
      achievements: [
        "Migrated monolithic application to modular architecture",
        "Reduced technical debt by 50% through systematic refactoring",
        "Trained team on modern development practices and tools"
      ],
      technologies: ["Java", "Spring", "Angular", "Oracle", "Maven"]
    }
  ];

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-88 h-88 glass-subtle rounded-full opacity-10 subtle-float"></div>
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 glass-subtle rounded-full opacity-15 subtle-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-4xl text-foreground mb-4">Experience</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              A decade of experience building scalable systems and leading engineering teams 
              across various industries and company stages.
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card 
              key={index} 
              className="glass-card glass-hover border-white/20"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="glass-subtle rounded-lg p-4 mb-3 inline-block">
                      <h3 className="text-2xl text-foreground mb-2">{exp.title}</h3>
                      <h4 className="text-xl text-muted-foreground">{exp.company}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <div className="flex items-center text-muted-foreground glass-subtle rounded-lg p-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {exp.period}
                    </div>
                    <div className="flex items-center text-muted-foreground glass-subtle rounded-lg p-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      {exp.location}
                    </div>
                  </div>
                </div>
                
                <div className="glass-subtle rounded-lg p-4 mb-6">
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="glass-subtle rounded-lg p-4 mb-3">
                    <h5 className="text-lg text-foreground mb-3">Key Achievements:</h5>
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start glass-subtle rounded-lg p-3 glass-hover">
                        <div className="w-2 h-2 bg-foreground rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="glass-subtle rounded-lg p-4 mb-3">
                    <h5 className="text-lg text-foreground mb-3">Technologies:</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="outline"
                        className="glass-button border-white/20 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}