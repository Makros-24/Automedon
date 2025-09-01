import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

// Technology strength data (0-100 scale)
const techData = [
  {
    category: 'Frontend',
    strength: 95,
    fullName: 'Frontend Development'
  },
  {
    category: 'Backend',
    strength: 92,
    fullName: 'Backend Development'
  },
  {
    category: 'Cloud & DevOps',
    strength: 88,
    fullName: 'Cloud & DevOps'
  },
  {
    category: 'Databases',
    strength: 85,
    fullName: 'Database Systems'
  },
  {
    category: 'Architecture',
    strength: 98,
    fullName: 'Architecture & Tools'
  },
  {
    category: 'Mobile',
    strength: 78,
    fullName: 'Mobile Development'
  }
];

export function TechRadarChart() {
  const { ref: chartRef, isInView } = useInViewOnce({ threshold: 0.3, rootMargin: '0px 0px -10% 0px' });

  // Custom dot component with glass morphism effect
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const strength = payload.strength / 100;
    
    return (
      <g>
        {/* Glass morphism outer ring */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={8}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="backdrop-blur-sm"
        />
        
        {/* Main glass dot */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={5}
          fill={`rgba(255, 255, 255, ${0.15 + (strength * 0.2)})`}
          stroke={`rgba(255, 255, 255, ${0.4 + (strength * 0.3)})`}
          strokeWidth={1.5}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="filter drop-shadow-lg backdrop-blur-sm"
          style={{
            filter: `drop-shadow(0 0 ${4 + (strength * 6)}px rgba(255, 255, 255, ${0.3 + (strength * 0.2)}))`
          }}
        />
        
        {/* Inner highlight */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={2}
          fill={`rgba(255, 255, 255, ${0.8 + (strength * 0.2)})`}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        />
      </g>
    );
  };

  return (
    <motion.div
      ref={chartRef}
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Glass morphism container */}
      <div className="relative p-6 rounded-2xl glass glass-hover transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/5 overflow-hidden">
        {/* Accent highlight line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-white blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 rounded-full bg-white blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="text-center">
            <motion.h4 
              className="text-xl font-semibold text-foreground mb-1 group-hover:text-foreground/80 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Technology Expertise
            </motion.h4>
            <motion.p 
              className="text-xs text-foreground/60"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Skill proficiency across core technology areas
            </motion.p>
          </div>

          {/* Radar Chart */}
          <motion.div 
            className="h-72 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={techData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                {/* Grid lines */}
                <PolarGrid 
                  stroke="rgba(255, 255, 255, 0.15)" 
                  strokeWidth={0.5}
                  className="opacity-40"
                />
                
                {/* Category labels */}
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ 
                    fill: 'currentColor', 
                    fontSize: 11,
                    fontWeight: 500
                  }}
                  className="text-foreground/70"
                />
                
                {/* Strength scale */}
                <PolarRadiusAxis 
                  angle={90}
                  domain={[0, 100]}
                  tick={{ 
                    fill: 'currentColor', 
                    fontSize: 8 
                  }}
                  tickCount={4}
                  className="text-foreground/40"
                />
                
                {/* Data visualization */}
                <Radar
                  name="Technology Strength"
                  dataKey="strength"
                  stroke="rgba(255, 255, 255, 0.4)"
                  fill="url(#radarGradient)"
                  strokeWidth={2}
                  fillOpacity={0.15}
                  dot={<CustomDot />}
                  className="filter drop-shadow-sm"
                />
                
                {/* Gradient definition */}
                <defs>
                  <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                    <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
                  </radialGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Floating accent elements */}
          <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white/60 rounded-full opacity-60 animate-pulse" />
          <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </motion.div>
  );
}