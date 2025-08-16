import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { GraduationCap, Award, Calendar } from "lucide-react";

export function EducationSection() {
  const education = [
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      period: "2012 - 2014",
      location: "Stanford, CA",
      description: "Specialized in Distributed Systems and Software Architecture",
      achievements: ["GPA: 3.8/4.0", "Graduate Teaching Assistant", "Published 2 research papers"]
    },
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "University of California, Berkeley",
      period: "2008 - 2012",
      location: "Berkeley, CA",
      description: "Magna Cum Laude graduate with focus on Software Engineering principles",
      achievements: ["GPA: 3.7/4.0", "Dean's List (6 semesters)", "ACM Programming Contest Finalist"]
    }
  ];

  const certifications = [
    {
      name: "AWS Solutions Architect Professional",
      issuer: "Amazon Web Services",
      year: "2023"
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      year: "2022"
    },
    {
      name: "Google Cloud Professional Architect",
      issuer: "Google Cloud",
      year: "2022"
    },
    {
      name: "Scrum Master Certified (SMC)",
      issuer: "Scrum Alliance",
      year: "2021"
    }
  ];

  return (
    <section id="education" className="py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 glass-subtle rounded-full opacity-12 subtle-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 glass-subtle rounded-full opacity-8 subtle-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-4xl text-foreground mb-4">Education & Certifications</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto"></div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <div className="flex items-center mb-8 glass-card rounded-xl p-4">
              <div className="glass-subtle rounded-full p-3 mr-3">
                <GraduationCap className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-2xl text-foreground">Education</h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card 
                  key={index} 
                  className="glass-card glass-hover border-white/20"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="glass-subtle rounded-lg p-3 mb-3 inline-block">
                          <h4 className="text-lg text-foreground mb-2">{edu.degree}</h4>
                          <h5 className="text-base text-muted-foreground">{edu.institution}</h5>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-muted-foreground mb-1 glass-subtle rounded-lg p-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {edu.period}
                        </div>
                        <div className="text-sm text-muted-foreground glass-subtle rounded-lg p-2">{edu.location}</div>
                      </div>
                    </div>
                    
                    <div className="glass-subtle rounded-lg p-3 mb-4">
                      <p className="text-muted-foreground">{edu.description}</p>
                    </div>
                    
                    <div>
                      <div className="glass-subtle rounded-lg p-3 mb-2">
                        <h6 className="text-sm text-foreground">Achievements:</h6>
                      </div>
                      <div className="space-y-1">
                        {edu.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-start glass-subtle rounded-lg p-2 glass-hover">
                            <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Certifications */}
          <div>
            <div className="flex items-center mb-8 glass-card rounded-xl p-4">
              <div className="glass-subtle rounded-full p-3 mr-3">
                <Award className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-2xl text-foreground">Certifications</h3>
            </div>
            
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <Card 
                  key={index} 
                  className="glass-card glass-hover border-white/20"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="glass-subtle rounded-lg p-3 mb-2 inline-block">
                          <h4 className="text-base text-foreground mb-2">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        </div>
                        <Badge 
                          variant="outline"
                          className="text-xs glass-button border-white/20 text-muted-foreground"
                        >
                          Certified {cert.year}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground glass-subtle rounded-lg p-2">
                        {cert.year}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}