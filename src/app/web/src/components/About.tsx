import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { Award, Code, Globe, Users, Monitor, Server, Cloud, Database, Smartphone, Settings, FileCode, Layers, Package, Paintbrush, Zap, Cpu, Terminal, GitBranch, Shield, Smartphone as Mobile, Wrench, Box } from 'lucide-react';
import { Badge } from './ui/badge';
import { TechRadarChart } from './TechRadarChart';
import { CoreSkillsCarousel } from './CoreSkillsCarousel';

// Technical skill icons mapping
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
  
  // Backend
  'Node.js': Server,
  'Python': Terminal,
  'Go': Cpu,
  'Java': Code,
  'REST APIs': Layers,
  'GraphQL': Layers,
  'Microservices': Box,
  'Express.js': Server,
  
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

// Comprehensive skills and technologies combined
const skillCategories = [
  { 
    name: 'Frontend Development', 
    icon: Monitor, 
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS']
  },
  { 
    name: 'Backend Development', 
    icon: Server, 
    skills: ['Node.js', 'Python', 'Go', 'Java', 'REST APIs', 'GraphQL', 'Microservices', 'Express.js']
  },
  { 
    name: 'Cloud & DevOps', 
    icon: Cloud, 
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab CI', 'CI/CD']
  },
  { 
    name: 'Database Systems', 
    icon: Database, 
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB', 'MySQL', 'Elasticsearch']
  },
  { 
    name: 'Mobile Development', 
    icon: Smartphone, 
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Expo']
  },
  { 
    name: 'Architecture & Tools', 
    icon: Settings, 
    skills: ['System Design', 'Solution Architecture', 'Git', 'Linux', 'Nginx', 'Load Balancing']
  }
];

const achievements = [
  {
    icon: <Users className="w-6 h-6" />,
    number: '50+',
    title: 'Projects Delivered',
    description: 'Successfully architected and delivered complex enterprise solutions'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    number: '10M+',
    title: 'Users Served',
    description: 'Built scalable systems serving millions of users globally'
  },
  {
    icon: <Award className="w-6 h-6" />,
    number: '99.99%',
    title: 'System Uptime',
    description: 'Maintained high availability across critical infrastructure'
  },
  {
    icon: <Code className="w-6 h-6" />,
    number: '8+',
    title: 'Years Experience',
    description: 'Deep expertise in full-stack development and architecture'
  }
];



function SkillCategory({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  const { ref: cardRef, isInView } = useInViewOnce({ threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
  const IconComponent = category.icon;

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ 
        duration: 0.9, 
        delay: index * 0.15, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <div className="relative p-6 rounded-2xl glass transition-all duration-300 h-full border border-white/10 hover:border-white/20 group-hover:bg-white/8 dark:group-hover:bg-white/5 group-hover:backdrop-blur-lg flex flex-col">
        <div className="flex flex-col flex-1 space-y-5">
          {/* Icon and title section */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl glass-light flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <IconComponent className="w-6 h-6 text-foreground/70 stroke-[1.5] group-hover:text-foreground transition-colors duration-300" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors duration-300">
                {category.name}
              </h4>
              <div className="relative">
                <div className="w-20 h-0.5 bg-gradient-to-r from-foreground/40 via-foreground/60 to-transparent rounded-full" />
                {/* Hover highlight line */}
                <motion.div
                  className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                  initial={{ width: 0 }}
                  whileHover={{ width: "80px" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
          
          {/* Skills section */}
          <div className="flex flex-wrap gap-2 flex-1 content-start">
            {category.skills.map((skill, skillIndex) => {
              const SkillIcon = skillIcons[skill as keyof typeof skillIcons] || Code;
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: (index * 0.1) + (skillIndex * 0.03) }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 border border-foreground/8 hover:border-foreground/15 dark:border-white/20 dark:hover:border-white/30 text-foreground/80 hover:text-foreground transition-colors duration-300 px-3 py-1 text-sm font-normal cursor-default flex items-center gap-1.5"
                  >
                    <SkillIcon className="w-3.5 h-3.5" />
                    {skill}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Achievement({ achievement, index }: { achievement: typeof achievements[0]; index: number }) {
  const { ref: cardRef, isInView } = useInViewOnce({ threshold: 0.3, rootMargin: '0px 0px -10% 0px' });

  return (
    <motion.div
      ref={cardRef}
      className="text-center group"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ 
        y: -3,
        scale: 1.05,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <div className="relative p-6 rounded-2xl glass glass-hover transition-all duration-300 group-hover:bg-white/5">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl glass-light flex items-center justify-center">
          <div className="text-foreground/70">
            {achievement.icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground mb-2">
          {achievement.number}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{achievement.title}</h3>
        <p className="text-sm text-foreground/70">{achievement.description}</p>
      </div>
    </motion.div>
  );
}



export function About() {
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

  return (
    <section id="about" className="relative py-20 px-6 overflow-hidden">
      {/* Enhanced Background Animation */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      >
        <div className="absolute top-1/3 right-1/5 w-72 h-72 rounded-full blur-3xl opacity-8 animate-float bg-gradient-to-r from-blue-400/20 to-purple-500/20" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-56 h-56 rounded-full blur-2xl opacity-12 animate-float bg-gradient-to-r from-teal-400/15 to-indigo-500/15" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-xl opacity-15 animate-float bg-gradient-to-r from-amber-400/20 to-orange-500/20" style={{ animationDelay: '5s' }} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            About Me
          </motion.h2>
          <motion.p 
            className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            Passionate about creating innovative solutions that bridge the gap between complex technical 
            requirements and elegant user experiences. I specialize in architecting scalable systems 
            that drive business success.
          </motion.p>
        </motion.div>

        <motion.div 
          className="space-y-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Skills & Technologies */}
          <div>
            <motion.h3
              className="text-3xl font-semibold text-foreground mb-12 text-center"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
            >
              Technologies
            </motion.h3>
            
            {/* Technology Radar Chart - Hidden */}
            {/* <motion.div 
              className="mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
            >
              <TechRadarChart />
            </motion.div> */}
            
            {/* Detailed Skill Categories */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {skillCategories.map((category, index) => (
                <SkillCategory key={category.name} category={category} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Key Achievements */}
          <div>
            <motion.h3
              className="text-3xl font-semibold text-foreground mb-12 text-center"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 1.4, ease: 'easeOut' }}
            >
              Key Achievements
            </motion.h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              {achievements.map((achievement, index) => (
                <Achievement key={achievement.title} achievement={achievement} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Core Skills - Hidden */}
          {/* <div>
            <motion.h3
              className="text-3xl font-semibold text-foreground mb-12 text-center"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 1.8, ease: 'easeOut' }}
            >
              Core Skills
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 2, ease: 'easeOut' }}
            >
              <CoreSkillsCarousel />
            </motion.div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}