import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useSkillCategories, useAchievements, useAbout } from '@/contexts/PortfolioDataContext';
import { SkillCategory } from './skills/SkillCategory';
import { Achievement } from './achievements/Achievement';
import { SkeletonGrid } from './ui/loading';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function About() {
  const { about } = useAbout();
  const { skillCategories, loading: skillsLoading, error: skillsError } = useSkillCategories();
  const { achievements, loading: achievementsLoading, error: achievementsError } = useAchievements();
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  return (
    <motion.section
      id="about"
      className="relative py-20 px-6 overflow-hidden"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Enhanced Background Animation */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 1.5, delay: 0.4 }}
      >
        <div className="absolute top-1/3 right-1/5 w-72 h-72 rounded-full blur-3xl opacity-8 animate-float bg-gradient-to-r from-blue-400/20 to-purple-500/20" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-56 h-56 rounded-full blur-2xl opacity-12 animate-float bg-gradient-to-r from-teal-400/15 to-indigo-500/15" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-xl opacity-15 animate-float bg-gradient-to-r from-amber-400/20 to-orange-500/20" style={{ animationDelay: '5s' }} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {about?.title || 'About Me'}
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            {about?.description || 'Passionate about creating innovative solutions that bridge the gap between complex technical requirements and elegant user experiences. I specialize in architecting scalable systems that drive business success.'}
          </p>
        </motion.div>

        <motion.div className="space-y-16" variants={containerVariants}>
          {/* Skills & Technologies */}
          <div>
            <motion.h3
              className="text-3xl font-semibold text-foreground mb-12 text-center"
              variants={itemVariants}
            >
              {about?.skillsTitle || 'Technologies'}
            </motion.h3>

            {skillsLoading ? (
              <SkeletonGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" columns={3} rows={2} />
            ) : skillsError ? (
              <motion.div className="text-center py-12" variants={itemVariants}>
                <p className="text-lg text-red-500">Error loading skills: {skillsError}</p>
              </motion.div>
            ) : skillCategories.length === 0 ? (
              <motion.div className="text-center py-12" variants={itemVariants}>
                <p className="text-lg text-foreground/70">No skills data available</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
                variants={containerVariants}
              >
                {skillCategories.map((category) => (
                  <SkillCategory key={category.name} category={category} variants={itemVariants} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Key Achievements */}
          <div>
            <motion.h3
              className="text-3xl font-semibold text-foreground mb-12 text-center"
              variants={itemVariants}
            >
              {about?.achievementsTitle || 'Key Achievements'}
            </motion.h3>
            {achievementsLoading ? (
              <SkeletonGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" columns={4} rows={1} />
            ) : achievementsError ? (
              <motion.div className="text-center py-12" variants={itemVariants}>
                <p className="text-lg text-red-500">Error loading achievements: {achievementsError}</p>
              </motion.div>
            ) : achievements.length === 0 ? (
              <motion.div className="text-center py-12" variants={itemVariants}>
                <p className="text-lg text-foreground/70">No achievements data available</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                {achievements.map((achievement) => (
                  <Achievement key={achievement.title} achievement={achievement} variants={itemVariants} />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
