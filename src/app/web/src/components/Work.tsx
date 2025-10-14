import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useProjects, useWork } from '@/contexts/PortfolioDataContext';
import { ProjectCard } from './projects/ProjectCard';
import { SkeletonGrid } from './ui/loading';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Work() {
  const { projects, loading, error } = useProjects();
  const { work } = useWork();
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  return (
    <motion.section
      id="work"
      className="relative py-20 px-6 overflow-hidden"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 animate-float bg-gradient-to-r from-blue-400/30 to-purple-500/30" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-15 animate-float bg-gradient-to-r from-teal-400/25 to-indigo-500/25" style={{ animationDelay: '4s' }} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            {work?.title || 'Featured Work'}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {work?.description || 'A selection of projects that showcase my expertise in solution architecture, full-stack development, and cloud infrastructure.'}
          </p>
        </motion.div>

        {/* Projects grid */}
        {loading ? (
          <SkeletonGrid className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" columns={3} rows={1} />
        ) : error ? (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <p className="text-lg text-red-500 mb-4">Error loading projects: {error}</p>
          </motion.div>
        ) : projects.length === 0 ? (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <p className="text-lg text-foreground/70">No projects available</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} variants={itemVariants} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
