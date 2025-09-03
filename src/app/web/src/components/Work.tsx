import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useProjects } from '@/contexts/PortfolioDataContext';
import { ProjectCard } from './projects/ProjectCard';
import { SkeletonGrid, Loading } from './ui/loading';
// import { AnimatedSection } from './animations/AnimatedSection';


export function Work() {
  const { projects, loading, error } = useProjects();
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
        {loading ? (
          <SkeletonGrid className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" columns={3} rows={1} />
        ) : error ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-lg text-red-500 mb-4">Error loading projects: {error}</p>
          </motion.div>
        ) : projects.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-lg text-foreground/70">No projects available</p>
          </motion.div>
        ) : (
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
        )}
      </div>
    </section>
  );
}