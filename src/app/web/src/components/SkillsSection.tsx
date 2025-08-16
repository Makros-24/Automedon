import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Languages",
      skills: ["TypeScript", "Python", "Java", "C#", "Go", "JavaScript", "SQL"]
    },
    {
      title: "Frontend",
      skills: ["React", "Next.js", "Vue.js", "Angular", "Tailwind CSS", "SASS", "Redux"]
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express", "FastAPI", "Spring Boot", ".NET", "GraphQL", "REST APIs"]
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "DynamoDB", "Elasticsearch"]
    },
    {
      title: "Cloud & DevOps",
      skills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions"]
    },
    {
      title: "Architecture",
      skills: ["Microservices", "Event-Driven", "CQRS", "Domain-Driven Design", "Clean Architecture"]
    }
  ];

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 glass-subtle rounded-full opacity-10 subtle-float"></div>
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 glass-subtle rounded-full opacity-15 subtle-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-4xl text-foreground mb-4">Technical Skills</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              A comprehensive toolkit built through years of hands-on experience 
              in enterprise software development and system architecture.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <Card 
              key={index} 
              className="glass-card glass-hover border-white/20"
            >
              <div className="p-6">
                <div className="glass-subtle rounded-lg p-3 mb-4 inline-block">
                  <h3 className="text-xl text-foreground">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary"
                      className="glass-button text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}