import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { processProjectTechnologies } from '@/utils/technologyIconManager';
import { getOptimizedImageUrl } from '@/utils/dataLoader';
import { type Project } from '@/types';
import { ProjectDetailsDialog } from './ProjectDetailsDialog';

interface ProjectCardProps {
  project: Project;
  variants: Variants;
}

export const ProjectCard = ({ project, variants }: ProjectCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Process technologies with enhanced icons
  const processedTechnologies = React.useMemo(() =>
    processProjectTechnologies(project.technologies, 'w-3 h-3'),
    [project.technologies]
  );

  // Get optimized image source with base64 fallback
  const imageSrc = getOptimizedImageUrl(project.image, 600, 400);

  return (
    <>
      <motion.div
        className="group/card relative h-full min-h-[480px]"
        variants={variants}
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
      >
        {/* Glass morphism card */}
        <div className="relative h-full overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:shadow-black/10 flex flex-col">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

        {/* Card content */}
        <div className="relative p-4 flex flex-col flex-1">
          {/* Project image */}
          <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
            <img
              src={imageSrc}
              alt={`${project.title} project preview`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

            {/* Overlay links */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 p-0"
                onClick={() => window.open(project.links.live, '_blank')}
                aria-label={`View ${project.title} live`}
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 p-0"
                onClick={() => window.open(project.links.github, '_blank')}
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Project info */}
          <div className="space-y-3 flex flex-col flex-1">
            {/* Title and Company */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground group-hover/card:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-xs text-foreground/60 mt-1">{project.role}</p>
              </div>
              <div className="text-xs font-medium text-foreground/80 bg-white/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {project.company}
              </div>
            </div>

            {/* Description with elegant text fade */}
            <div className="flex-1 overflow-hidden flex items-start">
              <p
                className="text-sm text-foreground/70 leading-relaxed line-clamp-5"
                style={{
                  maskImage: 'linear-gradient(180deg, #000 70%, transparent)',
                  WebkitMaskImage: 'linear-gradient(180deg, #000 70%, transparent)'
                }}
              >
                {project.description}
              </p>
            </div>

            {/* See More Button */}
            {(project.description.length > 150 || project.markdownDescription) && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium self-start"
              >
                See more →
              </button>
            )}

            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5 mt-auto min-h-[28px]">
              {processedTechnologies.map((tech) => (
                <Badge
                  key={tech.name}
                  variant="secondary"
                  className="bg-white/10 border border-foreground/8 dark:border-white/20 text-xs text-foreground/80 transition-colors duration-300 flex items-center gap-1 px-2 py-0.5"
                >
                  <span className="group-hover/card:grayscale-0 grayscale transition-all duration-300 ease-out">
                    {tech.iconElement}
                  </span>
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Light reflection effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
      </div>
      </motion.div>

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        project={project}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};