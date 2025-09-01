import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { ExternalLink, Github, Code, Server, Cloud, Database, Smartphone, Settings, FileCode, Layers, Package, Paintbrush, Zap, Cpu, Terminal, GitBranch, Shield, Smartphone as Mobile, Wrench, Box } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const projects = [
  {
    id: 1,
    title: 'Cloud Infrastructure Platform',
    company: 'TechCorp',
    role: 'Lead Solution Architect',
    description: 'Designed and implemented a multi-cloud infrastructure platform serving 10M+ users with 99.99% uptime. Built microservices architecture with auto-scaling capabilities.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Go', 'React'],
    links: {
      live: '#',
      github: '#'
    }
  },
  {
    id: 2,
    title: 'Enterprise Analytics Dashboard',
    company: 'DataViz Inc',
    role: 'Senior Full-Stack Engineer',
    description: 'Built a real-time analytics platform processing 1B+ events daily. Implemented advanced data visualization and machine learning insights for business intelligence.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    technologies: ['React', 'D3.js', 'Python', 'Apache Kafka', 'PostgreSQL', 'Redis'],
    links: {
      live: '#',
      github: '#'
    }
  },
  {
    id: 3,
    title: 'AI-Powered Mobile Application',
    company: 'InnovateAI',
    role: 'Mobile Solution Architect',
    description: 'Architected a cross-platform mobile app with AI/ML capabilities, serving 500K+ active users. Integrated computer vision and natural language processing.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    technologies: ['React Native', 'TensorFlow', 'Node.js', 'MongoDB', 'Azure', 'TypeScript'],
    links: {
      live: '#',
      github: '#'
    }
  }
];

// Technical skill icons mapping (matching About.tsx)
const skillIcons = {
  // Frontend
  'JavaScript': FileCode,
  'TypeScript': Code,
  'React': Zap,
  'Vue.js': Layers,
  'Angular': Package,
  'Next.js': Zap,
  'HTML5': FileCode,
  'CSS3': Paintbrush,
  'Tailwind CSS': Paintbrush,
  'D3.js': Zap,
  
  // Backend
  'Node.js': Server,
  'Python': Terminal,
  'Go': Cpu,
  'Java': Code,
  'REST APIs': Layers,
  'GraphQL': Layers,
  'Microservices': Box,
  'Express.js': Server,
  'TensorFlow': Cpu,
  'Apache Kafka': Database,
  
  // Cloud & DevOps
  'AWS': Cloud,
  'Azure': Cloud,
  'GCP': Cloud,
  'Docker': Package,
  'Kubernetes': Settings,
  'Terraform': Wrench,
  'Jenkins': Settings,
  'GitLab CI': GitBranch,
  'CI/CD': Settings,
  
  // Database
  'PostgreSQL': Database,
  'MongoDB': Database,
  'Redis': Database,
  'DynamoDB': Database,
  'MySQL': Database,
  'Elasticsearch': Database,
  
  // Mobile
  'React Native': Mobile,
  'Flutter': Mobile,
  'iOS': Smartphone,
  'Android': Smartphone,
  'Expo': Mobile,
  
  // Architecture & Tools
  'System Design': Settings,
  'Solution Architecture': Layers,
  'Git': GitBranch,
  'Linux': Terminal,
  'Nginx': Server,
  'Load Balancing': Settings
};

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref: cardRef, isInView } = useInViewOnce({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2, 
        ease: [0.23, 1, 0.32, 1] // Custom cubic-bezier for smooth easing
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      {/* Glass morphism card */}
      <div className="relative overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/10">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Card content */}
        <div className="relative p-6">
          {/* Project image */}
          <div className="relative overflow-hidden rounded-xl mb-6 aspect-video">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Overlay links */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 p-0"
                onClick={() => window.open(project.links.live, '_blank')}
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 p-0"
                onClick={() => window.open(project.links.github, '_blank')}
              >
                <Github className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Project info */}
          <div className="space-y-4">
            {/* Title and Company */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground/60 mt-1">{project.role}</p>
              </div>
              <div className="text-sm font-medium text-foreground/80 bg-white/10 px-3 py-1 rounded-full">
                {project.company}
              </div>
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => {
                const TechIcon = skillIcons[tech as keyof typeof skillIcons] || Code;
                return (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 border border-foreground/8 hover:border-foreground/15 dark:border-white/20 dark:hover:border-white/30 text-foreground/80 hover:text-foreground transition-colors duration-300 flex items-center gap-1.5"
                  >
                    <TechIcon className="w-3.5 h-3.5" />
                    {tech}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {/* Light reflection effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

export function Work() {
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  return (
    <section id="work" className="relative py-20 px-6 overflow-hidden">
      {/* Background Animation */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 animate-float bg-gradient-to-r from-blue-400/30 to-purple-500/30" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-15 animate-float bg-gradient-to-r from-teal-400/25 to-indigo-500/25" style={{ animationDelay: '4s' }} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            Featured Work
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            A selection of projects that showcase my expertise in solution architecture, 
            full-stack development, and cloud infrastructure.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}