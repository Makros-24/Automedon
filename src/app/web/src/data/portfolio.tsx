import { Monitor, Server, Cloud, Database, Smartphone, Settings, Award, Code, Globe, Users } from 'lucide-react'
import { type Project, type SkillCategory, type Achievement } from '@/types'

export const projects: Project[] = [
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
]

export const skillCategories: SkillCategory[] = [
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
]

export const achievements: Achievement[] = [
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
]