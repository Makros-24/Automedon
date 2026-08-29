import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Building2, Briefcase, X } from 'lucide-react';
// lucide-react v1 dropped brand icons; this is a local rebuild.
import { GithubIcon as Github } from '@/components/icons/brands';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
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
import { useLanguage } from '@/contexts/LanguageContext';
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
  // Get current language for markdown loading
  const { language } = useLanguage();

  /*
   * Identifies the markdown the dialog currently wants, or null when there is
   * nothing to load. Deriving the loading and content state from this key means
   * closing the dialog no longer needs a synchronous setState to reset it, and
   * reopening shows the already-fetched content without a loading flash.
   */
  const markdownKey =
    open && project.markdownFileName
      ? `${project.markdownFileName}::${language}`
      : null;

  // `content: null` records a failed attempt, which falls back to the short
  // description below - the previous explicit error flag was never rendered.
  const [loaded, setLoaded] = useState<{ key: string; content: string | null } | null>(null);

  const hasCurrentMarkdown = markdownKey !== null && loaded?.key === markdownKey;
  const markdownContent = hasCurrentMarkdown ? loaded.content : null;
  const isLoadingMarkdown = markdownKey !== null && !hasCurrentMarkdown;

  // Process technologies with enhanced icons
  const processedTechnologies = React.useMemo(
    () => processProjectTechnologies(project.technologies, 'w-4 h-4'),
    [project.technologies]
  );

  // Get optimized image source
  const imageSrc = getOptimizedImageUrl(project.image, 1400, 600);

  // Fetch markdown content when dialog opens or language changes
  useEffect(() => {
    if (markdownKey === null) return;

    // Stops a slow response for a previous project or language from landing
    // after the dialog has moved on.
    let cancelled = false;

    const fetchMarkdown = async () => {
      try {
        const response = await fetch(
          `/api/markdown/${project.markdownFileName}?lang=${language}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load markdown: ${response.status}`);
        }

        const content = await response.text();
        if (!cancelled) setLoaded({ key: markdownKey, content });
      } catch (error) {
        if (cancelled) return;
        console.error('Markdown fetch error:', error);
        setLoaded({ key: markdownKey, content: null });
      }
    };

    fetchMarkdown();

    return () => {
      cancelled = true;
    };
  }, [markdownKey, project.markdownFileName, language]);

  // Determine what content to display
  const displayContent = markdownContent || project.description;

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
              unoptimized={imageSrc.startsWith('data:')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          </div>

          {/* Content Container */}
          <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
            {/* Header */}
            <header className="pt-6 pb-8 sm:pt-8 sm:pb-10">
              {/* Meta Information - Simplified */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-foreground/60">
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

              {/* Technologies - Card-style design with glass effect */}
              <section>
                <div className="flex flex-wrap gap-2 mb-4">
                  {processedTechnologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="group inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg glass-light glass-hover transition-all duration-300"
                    >
                      <div className="flex-shrink-0 transition-all duration-300">
                        {tech.iconElement}
                      </div>
                      <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Project Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {project.title}
              </h1>
            </header>

            {/* Main Content - Card-style spacing */}
            <div className="pb-8 space-y-8 sm:space-y-10">
              {/* Project Overview */}
              <section>
                {isLoadingMarkdown ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                      <p className="text-sm text-foreground/60">Loading project details...</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {displayContent}
                    </ReactMarkdown>
                  </div>
                )}
              </section>

              {/* Call-to-Action - Card-style with glass buttons */}
              {((project.links?.live && project.links.live !== '#') || (project.links?.github && project.links.github !== '#')) && (
                <section className="pt-4 border-t border-white/10 dark:border-white/5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {project.links?.live && project.links.live !== '#' && (
                      <Button
                        onClick={() => window.open(project.links?.live, '_blank')}
                        className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-11 text-sm font-medium transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Demo
                      </Button>
                    )}
                    {project.links?.github && project.links.github !== '#' && (
                      <Button
                        onClick={() => window.open(project.links?.github, '_blank')}
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
