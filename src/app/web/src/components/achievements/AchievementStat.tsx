import { type Achievement as AchievementType } from '@/types';

interface AchievementStatProps {
  achievement: AchievementType;
}

/**
 * One figure in the hero's achievement row.
 *
 * No surface of its own - no card, no glass, no border. It sits directly on the
 * hero, so the only things on screen are the number and its label. Hovering or
 * focusing draws a gradient rule under the number, the same accent the hero
 * already uses beneath the job title, and reveals the description.
 *
 * The figure is focusable so the description is reachable without a pointer,
 * and the text is never aria-hidden, so screen readers get it either way.
 *
 * The focus ring is the global `:focus-visible` rule in globals.css. Do not try
 * to tighten its outline-offset with a utility class here - that rule is
 * unlayered, so it beats anything in Tailwind's `@layer utilities` however
 * specific, and the class silently does nothing.
 */
export const AchievementStat = ({ achievement }: AchievementStatProps) => {
  return (
    <li className="group relative px-1 text-center" tabIndex={0}>
      {/*
        Numbers stay Western digits in every locale, including Arabic ("20K+",
        "80%"). Without dir="ltr" the trailing neutral is reordered by the RTL
        paragraph direction and renders as "+20K" / "%80".
      */}
      {/*
        text-foreground/80 matches the hero's job-title line above, so the
        figures read as part of the same tier rather than shouting louder than
        the heading they support.
      */}
      <span
        dir="ltr"
        className="block text-xl font-bold leading-none tracking-tight tabular-nums text-foreground/80 md:text-2xl"
      >
        {achievement.number}
      </span>

      {/*
        Only the width animates. The gradient itself is static, because
        background-image has no interpolable representation and would snap.
      */}
      <span
        aria-hidden="true"
        className="mx-auto mt-1.5 block h-px w-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 transition-all duration-300 ease-out group-hover:w-6 group-focus-visible:w-6"
      />

      <span className="mt-1.5 block text-[0.7rem] font-medium leading-tight text-foreground/55 md:text-xs">
        {achievement.title}
      </span>

      {achievement.description ? (
        /*
          Opens upward, so the description sits over the hero paragraph instead
          of over the CTA row - the reader's eye is already on the number, and
          reading downward pushed the text into the buttons. It is
          pointer-events-none, so it never intercepts a click either way.

          Centred with left-1/2 + -translate-x-1/2, NOT `inset-x-0 mx-auto`.
          The tooltip (13rem) is always wider than its grid column (~124px), and
          `margin: auto` only centres a box that fits: once it overflows, the
          box is over-constrained and CSS resolves margin-left to 0, letting
          margin-right absorb the excess. That put every tooltip 37.7px right of
          its number. Translating off a 50% offset does not depend on the
          containing block being wide enough.

          max-w-full below lg, because centring a wider box on the first or last
          column pushes it past the viewport, and the hero is overflow-hidden -
          the text was sliced off. A tooltip no wider than its own column always
          fits, whichever column it is on. The row only earns the roomier 13rem
          once the grid is capped at max-w-4xl and the page has grown wider than
          it: below ~850px the outer columns sit too close to the edge.
        */
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-full -translate-x-1/2 rounded-xl glass-strong px-3 py-2 text-xs leading-snug text-foreground/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 lg:max-w-[13rem]">
          {achievement.description}
        </span>
      ) : null}
    </li>
  );
};
