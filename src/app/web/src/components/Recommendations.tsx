import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { useRecommendations } from '@/contexts/PortfolioDataContext';
import { RecommendationCarousel } from './recommendations/RecommendationCarousel';
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

export function Recommendations() {
  const { recommendations, loading, error } = useRecommendations();
  const { ref: sectionRef, isInView } = useInViewOnce({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  const items = recommendations?.items ?? [];

  /*
   * The `recommendations` key is optional, so portfolio data written before
   * this feature - or a locale that simply has none yet - renders nothing at
   * all rather than an empty section. Returning null also keeps the header's
   * `#recommendations` anchor from pointing at a blank strip of page.
   *
   * `loading` still has to render, or the section would pop in after the fetch
   * resolves and shift everything below it.
   */
  if (!loading && !error && items.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="recommendations"
      // Deliberately shorter than the py-20 used by Work and About: this is
      // supporting evidence between two major sections, not a peer of them.
      className="relative py-16 px-6 overflow-hidden"
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
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 animate-float bg-gradient-to-r from-purple-400/30 to-blue-500/30" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full blur-2xl opacity-15 animate-float bg-gradient-to-r from-teal-400/25 to-blue-500/25" style={{ animationDelay: '3.5s' }} />
      </motion.div>

      {/* Wider than the other sections so several cards ride the track at once,
          which is what makes the drift legible as motion rather than a jump. */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
            {recommendations?.title || 'Recommendations'}
          </h2>
          <p className="text-base text-foreground/70 max-w-2xl mx-auto">
            {recommendations?.description || 'What colleagues and clients have said about working with me.'}
          </p>

          {/*
           * The source link sits on its own line under the description rather
           * than trailing the sentence. Inline, it wrapped mid-phrase at most
           * widths - the label is long enough that it almost never fits on the
           * same line as the tail of the description, so it broke across two
           * lines and read as part of the prose.
           *
           * It stays in the header, not below the track: a standalone CTA down
           * there would be a third control competing with the carousel in a
           * section meant to read quietly.
           */}
          {recommendations?.ctaUrl && (
            <p className="mt-2 text-base">
              <a
                href={recommendations.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/40 hover:decoration-blue-300 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded"
              >
                {recommendations.ctaLabel || 'See them on LinkedIn'}
              </a>
            </p>
          )}
        </motion.div>

        {loading ? (
          <SkeletonGrid className="grid-cols-1" columns={1} rows={1} />
        ) : error ? (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <p className="text-lg text-red-500">Error loading recommendations: {error}</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <RecommendationCarousel
              items={items}
              label={recommendations?.title || 'Recommendations'}
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
