import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useSkillCategories, useAchievements } from '@/contexts/PortfolioDataContext';
import { SkillCategory } from './skills/SkillCategory';
import { Achievement } from './achievements/Achievement';
import { SkeletonGrid, Loading } from './ui/loading';
// import { AnimatedSection } from './animations/AnimatedSection';







export function About() {
  const { skillCategories, loading: skillsLoading, error: skillsError } = useSkillCategories();
  const { achievements, loading: achievementsLoading, error: achievementsError } = useAchievements();
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

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
            {skillsLoading ? (
              <SkeletonGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" columns={3} rows={2} />
            ) : skillsError ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <p className="text-lg text-red-500">Error loading skills: {skillsError}</p>
              </motion.div>
            ) : skillCategories.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <p className="text-lg text-foreground/70">No skills data available</p>
              </motion.div>
            ) : (
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
            )}
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
            {achievementsLoading ? (
              <SkeletonGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" columns={4} rows={1} />
            ) : achievementsError ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <p className="text-lg text-red-500">Error loading achievements: {achievementsError}</p>
              </motion.div>
            ) : achievements.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <p className="text-lg text-foreground/70">No achievements data available</p>
              </motion.div>
            ) : (
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
            )}
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