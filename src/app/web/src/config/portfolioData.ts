/**
 * Portfolio configuration data
 * This file contains all the personal information used throughout the application
 */

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  summary: string;
  linkedIn?: string;
  github?: string;
  website?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tools' | 'other';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

// Personal Information
export const personalInfo: PersonalInfo = {
  name: "John Anderson",
  title: "Senior Software Architect",
  email: "john.anderson@email.com",
  location: "San Francisco, CA",
  summary: "Passionate software architect with 10+ years of experience in designing and implementing scalable enterprise solutions. Expertise in cloud architecture, microservices, and leading high-performing engineering teams.",
  linkedIn: "https://linkedin.com/in/johnanderson",
  github: "https://github.com/johnanderson",
  website: "https://johnanderson.dev"
};

// Skills Data
export const skills: Skill[] = [
  // Frontend
  { name: "React", level: 95, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Next.js", level: 85, category: "frontend" },
  { name: "Vue.js", level: 80, category: "frontend" },
  { name: "JavaScript", level: 95, category: "frontend" },
  
  // Backend
  { name: "Node.js", level: 90, category: "backend" },
  { name: "Python", level: 85, category: "backend" },
  { name: "Java", level: 80, category: "backend" },
  { name: "Go", level: 75, category: "backend" },
  
  // Database
  { name: "PostgreSQL", level: 85, category: "database" },
  { name: "MongoDB", level: 80, category: "database" },
  { name: "Redis", level: 75, category: "database" },
  
  // Cloud
  { name: "AWS", level: 90, category: "cloud" },
  { name: "Docker", level: 85, category: "cloud" },
  { name: "Kubernetes", level: 80, category: "cloud" },
  
  // Tools
  { name: "Git", level: 95, category: "tools" },
  { name: "Jenkins", level: 80, category: "tools" },
  { name: "Terraform", level: 75, category: "tools" }
];

// Experience Data
export const experiences: Experience[] = [
  {
    id: "exp1",
    company: "TechCorp Solutions",
    position: "Senior Software Architect",
    startDate: "2020-01",
    endDate: "Present",
    description: "Lead architecture decisions for enterprise-scale applications serving millions of users.",
    achievements: [
      "Designed microservices architecture that improved system scalability by 300%",
      "Led a team of 8 engineers in successful digital transformation initiatives",
      "Reduced system downtime by 40% through improved monitoring and alerting"
    ],
    technologies: ["React", "Node.js", "AWS", "Kubernetes", "TypeScript"]
  },
  {
    id: "exp2",
    company: "Innovation Labs",
    position: "Full Stack Developer",
    startDate: "2018-03",
    endDate: "2019-12",
    description: "Developed and maintained multiple client-facing web applications.",
    achievements: [
      "Built responsive web applications using React and Node.js",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Mentored junior developers and established coding standards"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"]
  }
];

// Projects Data
export const projects: Project[] = [
  {
    id: "proj1",
    title: "E-commerce Platform",
    description: "Scalable e-commerce platform with microservices architecture",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
    features: [
      "User authentication and authorization",
      "Real-time inventory management",
      "Payment processing integration",
      "Advanced search and filtering"
    ],
    liveUrl: "https://demo-ecommerce.com",
    githubUrl: "https://github.com/johnanderson/ecommerce-platform"
  },
  {
    id: "proj2",
    title: "Task Management System",
    description: "Real-time collaborative task management application",
    technologies: ["Vue.js", "Python", "MongoDB", "WebSocket"],
    features: [
      "Real-time collaboration",
      "Drag and drop interface",
      "Team management",
      "Progress tracking"
    ],
    liveUrl: "https://taskmaster-demo.com",
    githubUrl: "https://github.com/johnanderson/task-manager"
  },
  {
    id: "proj3",
    title: "Data Analytics Dashboard",
    description: "Interactive dashboard for business intelligence",
    technologies: ["React", "D3.js", "Python", "FastAPI"],
    features: [
      "Interactive charts and graphs",
      "Real-time data updates",
      "Custom report generation",
      "Data export functionality"
    ],
    liveUrl: "https://analytics-dash.com",
    githubUrl: "https://github.com/johnanderson/analytics-dashboard"
  }
];

// Education Data
export const education: Education[] = [
  {
    id: "edu1",
    institution: "Stanford University",
    degree: "Master of Science",
    field: "Computer Science",
    startDate: "2016-09",
    endDate: "2018-06",
    gpa: "3.8",
    achievements: [
      "Specialized in Distributed Systems",
      "Research in Machine Learning applications"
    ]
  },
  {
    id: "edu2",
    institution: "UC Berkeley",
    degree: "Bachelor of Science",
    field: "Software Engineering",
    startDate: "2012-09",
    endDate: "2016-05",
    gpa: "3.7",
    achievements: [
      "Summa Cum Laude",
      "Dean's List for 6 semesters"
    ]
  }
];

// Chat responses configuration
export const chatResponses = {
  skills: "🚀 John's technical arsenal includes React, TypeScript, Node.js, Python, and AWS. He specializes in system architecture, microservices, and cloud technologies with over 10 years of hands-on experience!",
  experience: "💼 John has 10+ years as a Senior Software Architect, where he's led engineering teams and designed scalable systems for enterprise applications. His leadership has driven successful digital transformations across multiple industries.",
  projects: "🏗️ His standout projects include a high-performance E-commerce Platform with microservices architecture, a real-time Task Management System, and a Data Analytics Dashboard with ML integration. Each project showcases his ability to deliver scalable solutions!",
  education: "🎓 John holds an MS in Computer Science from Stanford University and a BS in Software Engineering from UC Berkeley. He also maintains multiple cloud certifications and stays current with emerging technologies.",
  contact: "📧 You can reach John at john.anderson@email.com or connect with him on LinkedIn. He's always open to discussing exciting opportunities and innovative projects!",
  hello: "👋 Hello! Great to meet you! I'm here to help you learn more about John's impressive technical background, leadership experience, or standout projects. What interests you most?",
  architecture: "🏛️ John excels in system architecture! He's designed scalable microservices systems, implemented event-driven architectures, and led digital transformation initiatives. His architectural decisions have supported millions of users.",
  leadership: "👥 As a Senior Software Architect, John has successfully led cross-functional teams of 8+ engineers, mentored junior developers, and established coding standards that improved team productivity by 40%. His collaborative leadership style inspires excellence!",
  default: "✨ I'm here to help! I can share insights about John's technical skills, professional experience, leadership style, project achievements, or educational background. What specific area would you like to explore?"
};