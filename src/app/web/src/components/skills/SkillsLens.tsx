import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { processSkillsWithIcons } from '@/utils/technologyIconManager';
import { type SkillCategory as SkillCategoryType } from '@/types';

/** One domain change per wheel gesture, not per wheel event. */
const WHEEL_THROTTLE_MS = 260;

interface SkillsLensProps {
  categories: SkillCategoryType[];
  /**
   * Localized chrome, from `about.domainsLabel` / `about.toolsLabel`. Both keys
   * are optional in the portfolio data, so both fall back to English here.
   */
  domainsLabel?: string;
  toolsLabel?: string;
  /** Domain shown first. Defaults to the first category. */
  initialIndex?: number;
}

/**
 * SkillsLens - the About section's Technologies block.
 *
 * One glass panel instead of nine cards: a domain rail with a gradient
 * highlighter on the inline-start edge, and the selected domain's technologies
 * as full-size marks. The wheel steps between domains while the cursor is over
 * the panel, and releases to the page at either end.
 *
 * The rail is a WAI-ARIA tablist with a roving tabIndex, matching
 * `projects/ProjectTabs.tsx`. Arrow keys move between domains; Left/Right are
 * mirrored under RTL, Up/Down are not - vertical order does not flip.
 */
export const SkillsLens = ({
  categories,
  domainsLabel = 'Domains',
  toolsLabel = 'tools',
  initialIndex = 0,
}: SkillsLensProps) => {
  const { isRTL } = useLanguage();
  const [active, setActive] = useState(initialIndex);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastStep = useRef(0);
  const activeRef = useRef(active);
  const baseId = useId();

  const count = categories.length;
  const index = Math.min(active, count - 1);
  const current = categories[index];

  // The wheel listener is attached once, so it reads the live index from a ref
  // rather than closing over a stale one.
  useEffect(() => {
    activeRef.current = index;
  }, [index]);

  const marks = useMemo(
    () => processSkillsWithIcons(current?.skills ?? [], 'w-[52px] h-[52px] object-contain'),
    [current]
  );

  const selectAt = useCallback(
    (next: number) => {
      if (next < 0 || next > count - 1) return;
      setActive(next);
      tabRefs.current[next]?.focus();
    },
    [count]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    // The rail is vertical from md and a horizontal row below it, so both axes
    // navigate. Only the horizontal one flips with the reading direction.
    const horizontal = isRTL ? -1 : 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectAt(i + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectAt(i - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        selectAt(i + horizontal);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        selectAt(i - horizontal);
        break;
      case 'Home':
        event.preventDefault();
        selectAt(0);
        break;
      case 'End':
        event.preventDefault();
        selectAt(count - 1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const next = activeRef.current + (event.deltaY > 0 ? 1 : -1);
      // At either end the gesture belongs to the page again - do not trap it.
      if (next < 0 || next > count - 1) return;

      event.preventDefault();

      const now = Date.now();
      if (now - lastStep.current < WHEEL_THROTTLE_MS) return;
      lastStep.current = now;
      setActive(next);
    };

    // passive: false, or preventDefault is ignored on a wheel listener.
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [count]);

  if (!current) return null;

  return (
    <div
      ref={panelRef}
      className="glass-strong grid grid-cols-1 overflow-hidden rounded-[28px] md:grid-cols-[274px_minmax(0,1fr)]"
    >
      {/* Rail - vertical from md, a scrollable row on phones */}
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label={domainsLabel}
        className="flex gap-1 overflow-x-auto px-5 py-6 scrollbar-hide md:block md:overflow-visible md:py-8"
      >
        <div className="hidden px-[18px] pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:block">
          {domainsLabel}
        </div>

        {categories.map((category, i) => {
          const isActive = i === index;

          return (
            <button
              key={category.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => handleKeyDown(event, i)}
              className="relative cursor-pointer whitespace-nowrap px-[18px] py-3 text-start text-[16px] leading-tight focus-visible:outline-none md:block md:w-full"
            >
              {isActive && (
                <motion.span
                  layoutId={`${baseId}-highlighter`}
                  className="absolute inset-y-3 start-0 hidden w-[3px] rounded-[3px] bg-gradient-to-b from-blue-400 via-purple-500 to-teal-400 md:block"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              <span
                className={
                  isActive ? 'relative font-bold text-foreground' : 'relative text-muted-foreground'
                }
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Marks */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${index}`}
        className="border-t border-foreground/10 px-6 py-8 md:border-t-0 md:border-s md:px-10"
      >
        <div className="mb-7 flex flex-wrap items-baseline gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {current.name}
          </span>
          <span className="h-px min-w-10 flex-1 bg-foreground/15" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {current.skills.length} {toolsLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-11 gap-y-8">
          {marks.map((skill) => (
            <div
              key={skill.name}
              className="flex w-[100px] flex-col items-center gap-3.5 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              {skill.iconElement}
              <span className="text-[12px] leading-snug text-muted-foreground">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsLens;
