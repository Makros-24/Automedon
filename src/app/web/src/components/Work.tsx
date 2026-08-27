import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useProjects, useSideProjects, useWork } from '@/contexts/PortfolioDataContext';
import { ProjectCard } from './projects/ProjectCard';
import { ProjectTabs, type ProjectTab } from './projects/ProjectTabs';
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

type TabId = 'client' | 'personal';

export function Work() {
  const { projects, loading, error } = useProjects();
  const { sideProjects } = useSideProjects();
  const { work } = useWork();
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  const [activeTab, setActiveTab] = useState<TabId>('client');

  const clientLabel = work?.tabs?.client.label || 'Client Work';
  const personalLabel = work?.tabs?.personal.label || 'Personal Projects';

  // Tabs are only meaningful when there is something to switch between, so they
  // appear solely when both groups have projects. With a single populated group
  // the section renders as one plain grid - no tablist, no empty-tab affordance.
  const hasClientProjects = projects.length > 0;
  const hasSideProjects = sideProjects.length > 0;
  const hasTabs = hasClientProjects && hasSideProjects;

  // Without tabs, follow whichever group actually has content rather than the
  // stored tab state, which the user can no longer change.
  const currentTab: TabId = hasTabs
    ? activeTab
    : hasSideProjects && !hasClientProjects
      ? 'personal'
      : 'client';

  const tabs: ProjectTab[] = [
    { id: 'client', label: clientLabel, count: projects.length },
    { id: 'personal', label: personalLabel, count: sideProjects.length },
  ];

  // Only claim tabpanel semantics when a tablist exists to label the panel;
  // otherwise aria-labelledby would point at an element that is not rendered.
  const panelProps = hasTabs
    ? {
        role: 'tabpanel',
        id: `projects-panel-${currentTab}`,
        'aria-labelledby': `projects-tab-${currentTab}`,
      }
    : {};

  const visibleProjects = currentTab === 'client' ? projects : sideProjects;
  const activeDescription =
    work?.tabs?.[currentTab].description ||
    work?.description ||
    'A selection of projects that showcase my expertise in solution architecture, full-stack development, and cloud infrastructure.';
  const emptyMessage =
    currentTab === 'client'
      ? 'No projects available'
      : 'No personal projects yet';

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
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            {work?.title || 'Projects'}
          </h2>
          <div className="min-h-[3.5rem] sm:min-h-[4rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={currentTab}
                className="text-lg text-foreground/70 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeDescription}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category tabs */}
        {hasTabs && !loading && !error && (
          <motion.div variants={itemVariants}>
            <ProjectTabs
              tabs={tabs}
              value={currentTab}
              onValueChange={(id) => setActiveTab(id as TabId)}
            />
          </motion.div>
        )}

        {/* Projects grid */}
        {loading ? (
          <SkeletonGrid className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" columns={3} rows={1} />
        ) : error ? (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <p className="text-lg text-red-500 mb-4">Error loading projects: {error}</p>
          </motion.div>
        ) : visibleProjects.length === 0 ? (
          <motion.div className="text-center py-12" variants={itemVariants} {...panelProps}>
            <p className="text-lg text-foreground/70">{emptyMessage}</p>
          </motion.div>
        ) : (
          <motion.div
            key={currentTab}
            {...panelProps}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch"
            variants={containerVariants}
          >
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} variants={itemVariants} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
