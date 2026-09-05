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
      <span
        dir="ltr"
        className="block text-xl font-bold leading-none tracking-tight tabular-nums text-foreground md:text-2xl"
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
        // Opens downward, into the gap above the CTAs. Upward would land on the
        // last line of the hero description; the button row below has more
        // clear space around it, and the tooltip is pointer-events-none so it
        // never intercepts a click meant for a button.
        <span className="pointer-events-none absolute inset-x-0 top-full z-20 mx-auto mt-2 w-max max-w-[13rem] rounded-xl glass-strong px-3 py-2 text-xs leading-snug text-foreground/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {achievement.description}
        </span>
      ) : null}
    </li>
  );
};
