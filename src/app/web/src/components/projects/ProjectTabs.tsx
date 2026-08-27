import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ProjectTab {
  id: string;
  label: string;
  count: number;
}

interface ProjectTabsProps {
  tabs: ProjectTab[];
  value: string;
  onValueChange: (id: string) => void;
}

/**
 * Accessible segmented control for switching between project groups.
 *
 * Implements the WAI-ARIA tabs pattern with a roving tabIndex: only the active
 * tab is reachable with Tab, and arrow keys move between tabs (mirrored in RTL).
 * The active pill is a shared `layoutId` element, so motion animates it between
 * triggers by measuring real DOM positions - which works in both directions.
 */
export const ProjectTabs = ({ tabs, value, onValueChange }: ProjectTabsProps) => {
  const { isRTL } = useLanguage();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectAt = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    onValueChange(tab.id);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    // In RTL the visual order is reversed, so ArrowRight should walk backwards.
    const step = isRTL ? -1 : 1;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        selectAt((index + step + tabs.length) % tabs.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        selectAt((index - step + tabs.length) % tabs.length);
        break;
      case 'Home':
        event.preventDefault();
        selectAt(0);
        break;
      case 'End':
        event.preventDefault();
        selectAt(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-center mb-12">
      <div
        role="tablist"
        aria-label="Project categories"
        className="inline-flex items-center gap-1 p-1 rounded-2xl glass-light"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === value;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`projects-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`projects-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onValueChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground/90'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="projects-tab-pill"
                  className="absolute inset-0 rounded-xl glass"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>

              <span
                className={`relative z-10 rounded-full px-1.5 py-0.5 text-xs tabular-nums transition-colors duration-300 ${
                  isActive
                    ? 'bg-foreground/10 text-foreground/80'
                    : 'bg-foreground/5 text-foreground/50'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
