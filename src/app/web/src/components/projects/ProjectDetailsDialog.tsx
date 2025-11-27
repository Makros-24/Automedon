import React from 'react';
import Image from 'next/image';
import { ExternalLink, Github, Building2, Briefcase, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { processProjectTechnologies } from '@/utils/technologyIconManager';
import { getOptimizedImageUrl } from '@/utils/dataLoader';
import { type Project } from '@/types';

interface ProjectDetailsDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDetailsDialog = ({
  project,
  open,
  onOpenChange,
}: ProjectDetailsDialogProps) => {
  // Process technologies with enhanced icons
  const processedTechnologies = React.useMemo(
    () => processProjectTechnologies(project.technologies, 'w-4 h-4'),
    [project.technologies]
  );

  // Get optimized image source
  const imageSrc = getOptimizedImageUrl(project.image, 1400, 600);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] sm:!max-w-[85vw] lg:!max-w-[800px] xl:!max-w-[900px] max-h-[95vh] overflow-hidden bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl p-0 gap-0">
        {/* Accessibility Components - Screen Reader Only */}
        <DialogHeader className="sr-only">
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            Detailed information about {project.title} including role, technologies, and implementation details.
          </DialogDescription>
        </DialogHeader>

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 rounded-full p-2 glass glass-hover transition-all duration-300"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 text-foreground/60 hover:text-foreground transition-colors" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[95vh] scrollbar-hide scroll-smooth">
          {/* Hero Image */}
          <div className="relative w-full h-[250px] sm:h-[320px] overflow-hidden bg-foreground/5 rounded-t-2xl">
            <Image
              src={imageSrc}
              alt={project.title}
              width={800}
              height={320}
              className="w-full h-full object-cover"
              priority
              unoptimized={imageSrc.startsWith('http')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          </div>

          {/* Content Container */}
          <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
            {/* Header */}
            <header className="pt-6 pb-8 sm:pt-8 sm:pb-10">
              {/* Meta Information - Simplified */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-foreground/60">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {project.company}
                </span>
                <span className="text-foreground/30">•</span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {project.role}
                </span>
              </div>

              {/* Project Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {project.title}
              </h1>
            </header>

            {/* Main Content - Card-style spacing */}
            <div className="pb-8 space-y-8 sm:space-y-10">
              {/* Project Overview */}
              <section>
                <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.markdownDescription || project.description}
                  </ReactMarkdown>
                </div>
              </section>

              {/* Technologies - Card-style design with glass effect */}
              <section>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-5">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {processedTechnologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-light glass-hover transition-all duration-300"
                    >
                      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300">
                        {tech.iconElement}
                      </div>
                      <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Call-to-Action - Card-style with glass buttons */}
              {((project.links?.live && project.links.live !== '#') || (project.links?.github && project.links.github !== '#')) && (
                <section className="pt-4 border-t border-white/10 dark:border-white/5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {project.links?.live && project.links.live !== '#' && (
                      <Button
                        onClick={() => window.open(project.links.live, '_blank')}
                        className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-11 text-sm font-medium transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Demo
                      </Button>
                    )}
                    {project.links?.github && project.links.github !== '#' && (
                      <Button
                        onClick={() => window.open(project.links.github, '_blank')}
                        variant="outline"
                        className="flex-1 border border-foreground/20 hover:bg-foreground/5 h-11 text-sm font-medium transition-all"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Source Code
                      </Button>
                    )}
                  </div>
                </section>
              )}
            </div>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
};
