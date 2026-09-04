import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Recommendation } from '@/types';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationCarouselProps {
  items: Recommendation[];
  label: string;
}

/** Pixels per second of drift. Brisk enough to read as motion, slow enough to read. */
const SPEED = 60;

/** Drag distance, in px, past which a pointer gesture is a scroll and not a click. */
const DRAG_THRESHOLD = 5;

/**
 * Copies of the item list laid end to end.
 *
 * Three, not two, and the resting position is the middle copy. Two copies only
 * loops forwards: browsers clamp `scrollLeft` at 0, so a backwards wheel or
 * drag hits a hard end that no handler can intercept - the scroll event fires
 * after the clamp. Parking in the middle leaves a full set of runway either
 * way, and the wrap keeps it there.
 */
const COPIES = 3;

/**
 * Infinite drift carousel for recommendations.
 *
 * The track holds the items twice over. Auto-scroll advances `scrollLeft` a few
 * pixels per frame and wraps by exactly one set once it passes the halfway
 * mark - so the seam never lands anywhere visible and the loop has no ends to
 * reach. The second copy is `aria-hidden`, otherwise every recommendation would
 * be announced twice.
 *
 * Navigation is scroll, drag, or the dots. There are deliberately no arrow
 * buttons: with the track already drifting they were two more controls
 * competing with the content.
 *
 * Motion pauses on hover, on focus, and while dragging, and never starts at all
 * under `prefers-reduced-motion`. Text that moves for more than five seconds
 * needs a pause mechanism under WCAG 2.2.2, and hovering to read is the most
 * natural one there is.
 */
export const RecommendationCarousel = ({ items, label }: RecommendationCarouselProps) => {
  const { isRTL } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /*
   * Width of one copy of the list, cached.
   *
   * `scrollWidth` is a layout-forcing read. Taking it inside the animation loop
   * meant two synchronous layouts every frame, which is what made the drift
   * stutter rather than glide. It only changes when the track resizes, so the
   * observer below is the only thing that needs to recompute it.
   */
  const setWidth = useRef(0);

  /*
   * Sub-pixel position accumulator.
   *
   * At these speeds a frame advances well under a pixel. Reading `scrollLeft`
   * back each frame and adding to it loses that fraction to rounding, so the
   * track sat still for several frames and then jumped - the other half of the
   * clunkiness. Keeping the true position here and writing it out each frame
   * preserves the fraction. Null means "re-seed from the DOM".
   */
  const position = useRef<number | null>(null);

  // Repeated for the seam-free wrap. Keys carry the copy index because the same
  // recommendation id now appears once per copy.
  const loop = Array.from({ length: COPIES }, () => items).flat();

  /**
   * Keep the scroll position inside the middle copy, folding by exactly one set
   * when it leaves. RTL scrollLeft runs 0 -> negative, hence the fork.
   */
  const wrap = useCallback(
    (el: HTMLDivElement) => {
      const set = setWidth.current;
      if (set <= 0) return;

      if (isRTL) {
        if (el.scrollLeft > -set) el.scrollLeft -= set;
        else if (el.scrollLeft <= -2 * set) el.scrollLeft += set;
      } else {
        if (el.scrollLeft < set) el.scrollLeft += set;
        else if (el.scrollLeft >= 2 * set) el.scrollLeft -= set;
      }
    },
    [isRTL]
  );

  // Measure once, park in the middle copy so there is a full set of runway in
  // both directions, and re-do both whenever the track actually resizes.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measureAndPark = () => {
      setWidth.current = el.scrollWidth / COPIES;
      if (setWidth.current <= 0) return;
      el.scrollLeft = isRTL ? -setWidth.current : setWidth.current;
      position.current = el.scrollLeft;
    };

    measureAndPark();
    // Card widths settle after fonts and images resolve, so the first
    // measurement can be stale.
    const observer = new ResizeObserver(measureAndPark);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isRTL, items.length]);

  /** Which real recommendation is currently at the start of the viewport. */
  const syncActive = useCallback(
    (el: HTMLDivElement) => {
      const itemWidth = setWidth.current / items.length;
      if (itemWidth <= 0) return;
      setActive(Math.round(Math.abs(el.scrollLeft) / itemWidth) % items.length);
    },
    [items.length]
  );

  // Auto-drift.
  useEffect(() => {
    if (paused) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Anything the reader did happened while paused, so unpausing is exactly
    // when the accumulator needs to pick up wherever they left the track.
    position.current = null;

    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      const el = trackRef.current;
      const elapsed = now - last;
      last = now;

      if (el) {
        if (position.current === null) position.current = el.scrollLeft;

        // Content travels against the reading direction, so it enters from the
        // side the reader's eye starts on.
        position.current += (isRTL ? -1 : 1) * SPEED * (elapsed / 1000);
        el.scrollLeft = position.current;

        wrap(el);
        // The wrap may have moved it by a whole set; follow it.
        position.current = el.scrollLeft;

        syncActive(el);
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [paused, isRTL, wrap, syncActive]);

  // Drag to scroll. Pointer events cover mouse, touch and pen in one path.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: event.clientX, startScroll: el.scrollLeft, moved: false };
    setPaused(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;

    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      drag.current.moved = true;
      // Capture only once the gesture is definitely a drag, so a plain click on
      // a link inside a card still reaches it.
      el.setPointerCapture(event.pointerId);
    }

    el.scrollLeft = drag.current.startScroll - delta;
    wrap(el);
    syncActive(el);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    drag.current.active = false;
  };

  // A drag that ends over a link would otherwise fire that link's click.
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;

    const set = setWidth.current;
    const itemWidth = set / items.length;
    // Aim at the middle copy - that is where the resting position lives, so
    // jumping there keeps the runway in both directions intact.
    el.scrollTo({
      left: (isRTL ? -1 : 1) * (set + index * itemWidth),
      behavior: 'smooth',
    });
    // The smooth scroll runs outside the accumulator, so make it re-seed.
    position.current = null;
    setActive(index);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // In RTL the visual order is reversed, so ArrowRight walks backwards.
    const step = isRTL ? -1 : 1;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        goTo((active + step + items.length) % items.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        goTo((active - step + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        goTo(0);
        break;
      case 'End':
        event.preventDefault();
        goTo(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/*
        The edge mask fades cards out rather than letting them collide with the
        section boundary, which is what makes the drift read as continuous
        instead of as items popping in and out.
      */}
      <div
        className="relative"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div
          ref={trackRef}
          /*
           * The vertical padding is not spacing - it is headroom, and the two
           * values are asymmetric because what needs the room is asymmetric.
           *
           * The track scrolls on X, so `overflow-y` resolves to `auto` and the
           * scrollport clips at the padding box. The mask below clips at the
           * same edge. Anything a card paints outside that box is cut with a
           * hard straight line, which is what put a visible edge under the row
           * in both themes.
           *
           * What has to fit, measured from the card's own edge (a blur radius
           * reaches half its length beyond the shadow box):
           *
           *              rest: 0 8px 32px      hover: 0 12px 40px
           *   below      8 + 16 = 24px         12 + 20 = 32px
           *   above      16 - 8 =  8px         20 - 12 = 8px, +4px lift = 12px
           *
           * At 1rem = 14px here, `pb-10` = 35px and `pt-5` = 17.5px, so the
           * shadow has faded to nothing before it reaches the edge in every
           * state. The old symmetric `py-4` gave 14px: never enough below,
           * and only barely enough above - hence a hard line under the row and
           * a fainter one over it.
           */
          className="flex gap-4 overflow-x-auto overscroll-x-contain pt-5 pb-10 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          /*
           * Wrapping here, and not only in the animation loop, is what makes a
           * wheel or trackpad scroll infinite too. Without it the track drifts
           * endlessly on its own but hits a hard end the moment the reader
           * scrolls it themselves - and it is paused while they do, so the loop
           * is not running to catch it.
           */
          onScroll={(event) => {
            wrap(event.currentTarget);
            syncActive(event.currentTarget);
          }}
        >
          {loop.map((item, index) => {
            const copy = Math.floor(index / items.length);
            const position = index % items.length;
            // Only the middle copy - the one the resting position sits in - is
            // exposed. The outer copies exist purely to make the wrap seamless,
            // and announcing them would repeat every recommendation three times.
            const isCanonical = copy === 1;

            return (
              <div
                key={`${item.id}-${copy}`}
                aria-hidden={isCanonical ? undefined : true}
                role={isCanonical ? 'group' : undefined}
                aria-roledescription={isCanonical ? 'slide' : undefined}
                aria-label={isCanonical ? `${position + 1} of ${items.length}` : undefined}
                className="shrink-0 w-[280px] sm:w-[320px]"
              >
                <RecommendationCard recommendation={item} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots only - the arrows were bulk next to a track that moves on its own.
          `mt-2` rather than `mt-6`: the track's `pb-10` shadow headroom already
          sits between the cards and the dots, so the old margin now stacks on
          top of it and pushes the dots adrift. */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {items.map((item, index) => {
          const isActive = index === active;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to recommendation ${index + 1} of ${items.length}`}
              aria-current={isActive}
              /*
               * Every dot keeps the same box whether or not it is active, so
               * the row never reflows as the highlight moves - an earlier
               * version resized the button itself and shifted every dot after
               * it sideways on each advance.
               *
               * `after` widens the hit area to 18px without adding layout: at
               * 10px the dots were below any sane touch target.
               */
              className="group relative w-2.5 h-2.5 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 after:absolute after:-inset-1 after:content-['']"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />

              {/*
                The highlight is one element that travels between dots rather
                than a class swap on each. A class swap cannot animate at all
                here: the active state is a `background-image` gradient, and
                background-image is not an interpolatable property, so the
                change landed instantly however long the transition was.
                A shared `layoutId` makes motion measure the real DOM positions
                and tween between them - the same treatment ProjectTabs uses
                for its active pill.
              */}
              {isActive && (
                <motion.span
                  layoutId="recommendation-dot"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
