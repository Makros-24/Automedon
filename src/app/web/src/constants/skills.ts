import { 
  Code, 
  Server, 
  Cloud, 
  Database, 
  Smartphone, 
  Settings, 
  FileCode, 
  Layers, 
  Package, 
  Paintbrush, 
  Zap, 
  Cpu, 
  Terminal, 
  GitBranch, 
  Wrench, 
  Box,
  type LucideIcon
} from 'lucide-react'

// Technical skill icons mapping - centralized for reuse across components
export const skillIcons: Record<string, LucideIcon> = {
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
  'React Native': Smartphone,
  'Flutter': Smartphone,
  'iOS': Smartphone,
  'Android': Smartphone,
  'Expo': Smartphone,
  
  // Architecture & Tools
  'System Design': Settings,
  'Solution Architecture': Layers,
  'Git': GitBranch,
  'Linux': Terminal,
  'Nginx': Server,
  'Load Balancing': Settings
}

// Get icon component for a skill, fallback to Code if not found
export const getSkillIcon = (skillName: string): LucideIcon => {
  return skillIcons[skillName] || Code
}