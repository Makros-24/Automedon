import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { processSkillsWithIcons } from '@/utils/technologyIconManager';
import { type SkillCategory as SkillCategoryType } from '@/types';

/** One domain change per wheel gesture, not per wheel event. */
const WHEEL_THROTTLE_MS = 260;

/**
 * Chip labels must not wrap, so a long tool name is cut to its first word.
 * Only two names in the current data reach this - "Domain-Driven Design" and
 * "Hexagonal Architecture" - and the full name still reaches screen readers
 * from the sr-only span beside it.
 */
const MAX_CHIP_LABEL = 16;

const shortLabel = (name: string) =>
  name.length > MAX_CHIP_LABEL ? name.split(/[\s/]/)[0] : name;

interface SkillsLensProps {
  categories: SkillCategoryType[];
  /**
   * Localized chrome for the rail, from `about.domainsLabel` /
   * `about.toolsLabel`. Both keys are optional in the portfolio data, so both
   * fall back to English here. The compact layout needs neither - it labels
   * domains with a bare count.
   */
  domainsLabel?: string;
  toolsLabel?: string;
  /** Domain shown first in the rail layout. Defaults to the first category. */
  initialIndex?: number;
}

/**
 * SkillsLens - the About section's Technologies block.
 *
 * Two layouts, switched by CSS rather than by measuring the viewport, so there
 * is no hydration-time guess and no resize listener. Only one is ever in the
 * accessibility tree: `display: none` removes the other from it entirely, so
 * the duplicated content is never announced twice.
 *
 * - below `md`: {@link SkillsLensCompact}, every domain open at once
 * - `md` and up: {@link SkillsLensRail}, one domain at a time
 */
export const SkillsLens = ({
  categories,
  domainsLabel = 'Domains',
  toolsLabel = 'tools',
  initialIndex = 0,
}: SkillsLensProps) => {
  if (categories.length === 0) return null;

  return (
    <>
      <SkillsLensCompact categories={categories} />
      <SkillsLensRail
        categories={categories}
        domainsLabel={domainsLabel}
        toolsLabel={toolsLabel}
        initialIndex={initialIndex}
      />
    </>
  );
};

/**
 * Phone layout - "Lens (Mobile, compact)".
 *
 * No rail and no tabs: all nine domains stacked in one glass panel, separated
 * by hairlines, each tool a small icon-and-label pill. Everything is visible in
 * about a screen and a half, which is why this beats a tab strip on a phone -
 * eight of nine domains are not hidden behind a control.
 */
const SkillsLensCompact = ({ categories }: { categories: SkillCategoryType[] }) => (
  <div className="glass-strong overflow-hidden rounded-[18px] md:hidden">
    {categories.map((category) => (
      <CompactDomain key={category.name} category={category} />
    ))}
  </div>
);

const CompactDomain = ({ category }: { category: SkillCategoryType }) => {
  const chips = useMemo(
    () => processSkillsWithIcons(category.skills, 'w-[20px] h-[20px] object-contain'),
    [category.skills]
  );

  return (
    <div className="border-t border-foreground/10 px-[14px] pb-[16px] pt-[14px]">
      <div className="mb-[11px] flex items-center gap-[8px]">
        <span className="h-[13px] w-[2px] flex-none rounded-[2px] bg-gradient-to-b from-blue-400 via-purple-500 to-teal-400" />
        <span className="min-w-0 flex-1 text-[13px] font-bold leading-tight tracking-[-0.01em]">
          {category.name}
        </span>
        {/* dir=ltr: a bare numeral is bidi-neutral and would otherwise be
            reordered against the hairline in Arabic. */}
        <span dir="ltr" className="flex-none font-mono text-[10px] text-muted-foreground">
          {category.skills.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-[6px]">
        {chips.map((skill) => (
          <div
            key={skill.name}
            className="glass flex items-center gap-[7px] rounded-full py-[5px] pe-[11px] ps-[6px]"
          >
            {skill.iconElement}
            <span className="whitespace-nowrap text-[11.5px] leading-tight" aria-hidden="true">
              {shortLabel(skill.name)}
            </span>
            <span className="sr-only">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Desktop layout - "Lens".
 *
 * A domain rail with a gradient highlighter on the inline-start edge, and the
 * selected domain's technologies as full-size marks. The wheel steps between
 * domains while the cursor is over the panel, and releases to the page at
 * either end.
 *
 * The rail is a WAI-ARIA tablist with a roving tabIndex, matching
 * `projects/ProjectTabs.tsx`. Arrow keys move between domains; Left/Right are
 * mirrored under RTL, Up/Down are not - vertical order does not flip.
 */
const SkillsLensRail = ({
  categories,
  domainsLabel,
  toolsLabel,
  initialIndex,
}: Required<Omit<SkillsLensProps, 'categories'>> & { categories: SkillCategoryType[] }) => {
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
    // The rail is vertical, so Up/Down are the natural axis and do not flip.
    // Left/Right also work, and those do follow the reading direction.
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
      className="glass-strong hidden overflow-hidden rounded-[28px] md:grid md:grid-cols-[274px_minmax(0,1fr)]"
    >
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label={domainsLabel}
        className="px-5 py-8"
      >
        <div className="px-[18px] pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
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
              className="relative block w-full cursor-pointer whitespace-nowrap px-[18px] py-3 text-start text-[16px] leading-tight focus-visible:outline-none"
            >
              {isActive && (
                <motion.span
                  layoutId={`${baseId}-highlighter`}
                  className="absolute inset-y-3 start-0 w-[3px] rounded-[3px] bg-gradient-to-b from-blue-400 via-purple-500 to-teal-400"
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

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${index}`}
        className="border-s border-foreground/10 px-10 py-8"
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
