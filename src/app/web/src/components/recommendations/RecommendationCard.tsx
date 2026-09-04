import { motion } from 'motion/react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { getAvatarSource } from '@/utils/avatarHelper';
import { type Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

/**
 * Derive initials for the avatar fallback. Kept to two characters so the circle
 * stays legible at any card width.
 */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const avatarSrc = getAvatarSource(recommendation.avatar);
  const initials = getInitials(recommendation.name);

  /*
   * The card shows a hand-picked sentence rather than the opening of the full
   * text, so it stays compact inside the drifting track. `highlight` is an exact
   * excerpt of `quote`, so nothing is attributed to the recommender that they
   * did not write. Without one, the opening lines are clamped instead.
   */
  const highlight = recommendation.highlight?.trim();
  const shownQuote = highlight || recommendation.quote;

  const meta = [recommendation.relationship, recommendation.date]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.div
      className="group/card relative h-full"
      whileHover={{
        y: -4,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      <div className="relative h-full overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 group-hover/card:shadow-xl group-hover/card:shadow-black/10 flex flex-col">
        {/* Animated gradient wash, matching ProjectCard */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

        {/*
         * A watermark rather than a row of its own. In the flow it cost the
         * card a full line of height - icon plus gap - for something purely
         * decorative, which on a card this small was the single biggest
         * non-content expense.
         *
         * Kept small deliberately. Out of the flow it costs no height at any
         * size, but a large glyph still competes with the quote it is meant to
         * sit behind, which is the opposite of what a watermark is for.
         *
         * `insetInlineEnd` rather than a Tailwind inset: logical CSS follows
         * `dir` natively, and this project's Tailwind build does not emit the
         * `rtl:` variant, so a direction-specific utility would silently do
         * nothing. `rtl-flip` (globals.css) mirrors the glyph itself.
         */}
        <Quote
          aria-hidden="true"
          className="absolute top-3 w-5 h-5 text-foreground/[0.07] pointer-events-none rtl-flip"
          style={{ insetInlineEnd: '0.75rem' }}
        />

        <div className="relative p-4 sm:p-5 flex flex-col flex-1 gap-3">
          {/*
           * Quotes are stored verbatim in every locale - translating words
           * attributed to a named person would misrepresent what they wrote.
           * An English quote therefore renders inside the Arabic RTL page, and
           * two attributes handle that:
           *
           * - `dir="auto"` resolves direction from the first strong character
           *   rather than inheriting the page's.
           * - `text-start` is load-bearing, not decoration: globals.css sets
           *   `text-align: right` on [dir="rtl"] and text-align inherits, so
           *   without it the quote resolves to LTR yet still sits flushed right.
           */}
          <blockquote
            dir="auto"
            className="text-start text-sm text-foreground/85 leading-relaxed flex-1 line-clamp-6"
          >
            {shownQuote}
          </blockquote>

          {/*
           * A gradient hairline rather than a border: a hard rule cut the card
           * in two, and at this size the attribution reads as part of the same
           * block. Fading it out at both ends keeps the separation felt without
           * drawing a line across the card.
           */}
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
          />

          <footer className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-foreground/10">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt=""
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  // Only inline data: URLs skip the optimizer; remote images go
                  // through it so they are served same-origin (next.config.js).
                  unoptimized={avatarSrc.startsWith('data:')}
                />
              ) : (
                // next/image rejects an empty src, so the fallback cannot just
                // be a blank <Image> - see the same handling in Header.tsx.
                <div
                  aria-hidden="true"
                  className="w-full h-full glass-light flex items-center justify-center text-[10px] font-semibold text-foreground/60"
                >
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-start" dir="auto">
              {/*
               * The name itself carries the link when there is one. A separate
               * icon button was one more control on a card that is meant to be
               * quiet.
               */}
              {recommendation.linkedinUrl ? (
                <a
                  href={recommendation.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs font-semibold text-foreground truncate hover:text-blue-400 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded"
                >
                  {recommendation.name}
                </a>
              ) : (
                <p className="text-xs font-semibold text-foreground truncate">
                  {recommendation.name}
                </p>
              )}

              {/* LinkedIn headlines run long and are often pipe-separated
                  credential lists, so one line with a truncate at this size. */}
              <p className="text-[11px] text-foreground/60 truncate">
                {[recommendation.title, recommendation.company].filter(Boolean).join(' · ')}
              </p>
              {meta && (
                <p className="text-[10px] text-foreground/40 truncate">{meta}</p>
              )}
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};
