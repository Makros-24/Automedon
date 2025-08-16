import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";

export function ProjectsSection() {
  const projects = [
    {
      title: "E-Commerce Microservices Platform",
      description: "Architected and built a scalable microservices platform handling 100K+ daily transactions with real-time inventory management and payment processing.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      technologies: ["Kubernetes", "Node.js", "React", "PostgreSQL", "Redis", "RabbitMQ"],
      achievements: [
        "99.9% uptime with automated failover",
        "40% reduction in response times",
        "Seamless scaling during peak traffic"
      ],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Real-Time Analytics Dashboard",
      description: "Built comprehensive analytics platform processing millions of events daily with interactive visualizations and automated reporting capabilities.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["Python", "FastAPI", "React", "D3.js", "InfluxDB", "Apache Kafka"],
      achievements: [
        "Processes 10M+ events daily",
        "Sub-second query response times",
        "Real-time alerting system"
      ],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "DevOps Automation Suite",
      description: "Developed comprehensive CI/CD pipeline automation reducing deployment times by 75% and eliminating manual deployment errors.",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop",
      technologies: ["Docker", "Kubernetes", "Terraform", "Jenkins", "AWS", "Ansible"],
      achievements: [
        "Zero-downtime deployments",
        "75% faster deployment cycles",
        "Automated infrastructure provisioning"
      ],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Mobile-First Progressive Web App",
      description: "Created responsive PWA with offline capabilities, push notifications, and native app-like experience across all devices.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      technologies: ["React", "TypeScript", "Service Workers", "IndexedDB", "Web Push API"],
      achievements: [
        "Offline-first architecture",
        "90+ Google Lighthouse score",
        "50% increase in user engagement"
      ],
      links: {
        demo: "#",
        github: "#"
      }
    }
  ];

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 glass-subtle rounded-full opacity-10 subtle-float"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 glass-subtle rounded-full opacity-15 subtle-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-4xl text-foreground mb-4">Featured Projects</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto"></div>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              A selection of projects that showcase my expertise in building scalable, 
              high-performance applications and leading engineering initiatives.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="overflow-hidden glass-card glass-hover border-white/20 group"
            >
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 glass-subtle opacity-30"></div>
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="glass-subtle rounded-lg p-3 mb-4 inline-block">
                  <h3 className="text-xl text-foreground">{project.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                
                <div className="mb-4">
                  <div className="glass-subtle rounded-lg p-3 mb-3">
                    <h4 className="text-base text-foreground mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {project.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge 
                      key={techIndex}
                      variant="secondary"
                      className="text-xs glass-button text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="glass-button text-foreground hover:text-background group relative overflow-hidden flex-1"
                  >
                    <span className="relative z-10 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </span>
                    <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="glass-button border-white/20 text-foreground hover:bg-white/10 flex-1"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}