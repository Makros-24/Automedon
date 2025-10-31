import React from 'react';
import { ExternalLink, Github, Building2, Briefcase, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="!max-w-[95vw] sm:!max-w-[85vw] lg:!max-w-[800px] xl:!max-w-[900px] max-h-[95vh] overflow-hidden bg-background border-foreground/10 p-0 gap-0">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 rounded-full p-2 bg-background/90 hover:bg-background border border-foreground/10 backdrop-blur-sm transition-all duration-200"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 text-foreground/60 hover:text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[95vh]">
          {/* Hero Image */}
          <div className="relative w-full h-[250px] sm:h-[320px] overflow-hidden bg-foreground/5">
            <img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          </div>

          {/* Content Container */}
          <article className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
            {/* Header */}
            <header className="pt-8 pb-10 sm:pt-12 sm:pb-14">
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

            {/* Main Content - Increased spacing */}
            <div className="pb-12 space-y-12 sm:space-y-16">
              {/* Project Overview */}
              <section>
                <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.markdownDescription || project.description}
                  </ReactMarkdown>
                </div>
              </section>

              {/* Technologies - More minimal design */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 pb-3 border-b border-foreground/10">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {processedTechnologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-foreground/[0.08] hover:border-foreground/[0.15] transition-all duration-200"
                    >
                      <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-200">
                        {tech.iconElement}
                      </div>
                      <span className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Call-to-Action - More minimal */}
              <section className="pt-6 border-t border-foreground/10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.open(project.links.live, '_blank')}
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-11 text-sm font-medium transition-all"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Demo
                  </Button>
                  <Button
                    onClick={() => window.open(project.links.github, '_blank')}
                    variant="outline"
                    className="flex-1 border border-foreground/20 hover:bg-foreground/5 h-11 text-sm font-medium transition-all"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </div>
              </section>
            </div>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
};
