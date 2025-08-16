"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

interface Section {
  id: string;
  name: string;
  color: string;
}

// All sections for reference
const allSections: Section[] = [
  { id: 'hero', name: 'Home', color: 'bg-slate-600' },
  { id: 'about', name: 'About', color: 'bg-blue-600' },
  { id: 'skills', name: 'Skills', color: 'bg-cyan-600' },
  { id: 'experience', name: 'Experience', color: 'bg-emerald-600' },
  { id: 'projects', name: 'Projects', color: 'bg-orange-600' },
  { id: 'education', name: 'Education', color: 'bg-purple-600' },
  { id: 'contact', name: 'Contact', color: 'bg-indigo-600' },
];

// Navigation sections (excluding hero)
const navSections: Section[] = allSections.slice(1);

export function FloatingNavDots() {
  const [activeSection, setActiveSection] = useState(0); // Index for navSections (0 = about, 1 = skills, etc.)
  const [isVisible, setIsVisible] = useState(false); // Start hidden - only show when past hero
  const [hasScolledPastHero, setHasScrolledPastHero] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // Progress through navigation sections only (0-100)
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use refs to track previous values and avoid infinite re-renders
  const previousProgressRef = useRef(0);
  const previousActiveSectionRef = useRef(0);
  const previousVisibilityRef = useRef(false);
  const animationIdRef = useRef<number | undefined>(undefined);
  const isUpdatingRef = useRef(false);

  const scrollToSection = (sectionId: string, index: number) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const content = document.querySelector('[style*="translate3d"]') as HTMLElement;
    if (!content) return;

    const rect = element.getBoundingClientRect();
    const currentTransform = content.style.transform;
    const match = currentTransform.match(/translate3d\(0px,\s*(-?\d+(?:\.\d+)?)px,\s*0px\)/);
    const currentScroll = match ? Math.abs(parseFloat(match[1])) : 0;
    
    const targetScroll = currentScroll + rect.top;
    const maxScroll = content.scrollHeight - window.innerHeight;
    const clampedTarget = Math.max(0, Math.min(targetScroll, maxScroll));

    // Dispatch custom event for smooth scrolling
    window.dispatchEvent(new CustomEvent('smoothScrollTo', { 
      detail: { target: clampedTarget } 
    }));

    setActiveSection(index);
  };

  // Enhanced scroll tracking with hero section detection and progress calculation
  const updateActiveSection = useCallback(() => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const content = document.querySelector('[style*="translate3d"]') as HTMLElement;
    if (!content) {
      // Fallback: try to get scroll position from window if smooth scroll isn't working
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const aboutElement = document.getElementById('about');
      if (aboutElement) {
        const aboutRect = aboutElement.getBoundingClientRect();
        const shouldShow = aboutRect.top < (window.innerHeight * 0.8);
        if (shouldShow !== previousVisibilityRef.current) {
          previousVisibilityRef.current = shouldShow;
          setIsVisible(shouldShow);
          setHasScrolledPastHero(shouldShow);
        }
      }
      isUpdatingRef.current = false;
      return;
    }

    const transformValue = content.style.transform;
    const match = transformValue.match(/translate3d\(0px,\s*(-?\d+(?:\.\d+)?)px,\s*0px\)/);
    
    if (match) {
      const currentScroll = Math.abs(parseFloat(match[1]));
      
      // Check if we've scrolled past the hero section - only show when about section is visible
      const aboutElement = document.getElementById('about');
      
      if (aboutElement) {
        const aboutRect = aboutElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Show navigation when about section is 80% visible in viewport
        // This ensures the dots appear when the about section starts becoming visible
        const currentScrolledPastHero = aboutRect.top < (viewportHeight * 0.8);
        
        // Only update visibility if it has changed
        if (currentScrolledPastHero !== previousVisibilityRef.current) {
          previousVisibilityRef.current = currentScrolledPastHero;
          // Force React state update by using a callback
          setHasScrolledPastHero(() => currentScrolledPastHero);
          setIsVisible(() => currentScrolledPastHero);
        }
        
        // Calculate progress from top of page (0%) to bottom of page (100%)
        if (currentScrolledPastHero) {
          const content = document.querySelector('[style*="translate3d"]') as HTMLElement;
          if (content) {
            // Total scrollable distance
            const maxScroll = content.scrollHeight - window.innerHeight;
            
            // Calculate percentage (0-100)
            const progress = maxScroll > 0 ? 
              Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100)) : 0;
            
            // Only update progress if it has changed significantly
            if (Math.abs(progress - previousProgressRef.current) > 0.5) {
              previousProgressRef.current = progress;
              setScrollProgress(() => progress);
            }
          }
        } else {
          // Reset progress when in hero section
          if (previousProgressRef.current !== 0) {
            previousProgressRef.current = 0;
            setScrollProgress(() => 0);
          }
        }
      }

      // Find the section currently in viewport
      const viewportHeight = window.innerHeight;
      const centerPoint = viewportHeight * 0.4; // Section detection point
      
      let newActiveSection = 0; // Default to first nav section (about)

      for (let i = 0; i < navSections.length; i++) {
        const element = document.getElementById(navSections[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          
          // Check if section center is within viewport detection area
          if (rect.top <= centerPoint && rect.bottom >= centerPoint) {
            newActiveSection = i;
            break;
          }
          
          // Handle first nav section when at top
          if (i === 0 && rect.bottom > centerPoint) { // about section
            newActiveSection = 0;
            break;
          }
          
          // Handle last section when near bottom
          if (i === navSections.length - 1 && rect.top < viewportHeight) {
            newActiveSection = navSections.length - 1;
            break;
          }
        }
      }

      // Only update active section if it has changed
      if (newActiveSection !== previousActiveSectionRef.current) {
        previousActiveSectionRef.current = newActiveSection;
        setActiveSection(() => newActiveSection);
      }
    }
    
    isUpdatingRef.current = false;
    
    // Continue the animation loop
    animationIdRef.current = requestAnimationFrame(updateActiveSection);
  }, []);

  useEffect(() => {
    // Ensure we start hidden in hero section
    setIsVisible(false);
    setHasScrolledPastHero(false);
    setScrollProgress(0);
    setActiveSection(0);
    setIsInitialized(false);
    
    // Start the animation loop immediately
    const startUpdating = () => {
      updateActiveSection();
      setIsInitialized(true);
    };
    
    // Initial call and start the loop
    const timeoutId = setTimeout(startUpdating, 100);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [updateActiveSection]);

  return (
    <>
      {/* Desktop Navigation - Right side vertical */}
      <div 
        className={`fixed z-50 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
        } hidden md:block right-6 top-1/2 -translate-y-1/2`}
      >
      <div className="glass-nav rounded-2xl p-4 border border-white/20 shadow-2xl md:block bg-black/80 backdrop-blur-md">
        <div className="flex flex-col space-y-3">
          {navSections.map((section, index) => {
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id, index)}
                className="group relative flex items-center justify-center"
                aria-label={`Go to ${section.name} section`}
              >
                <div className="flex items-center justify-between w-full gap-4">
                  {/* Always visible section name with consistent sizing */}
                  <div 
                    className={`transition-all duration-300 whitespace-nowrap min-w-[4.5rem] text-left flex-shrink-0 text-sm ${
                      activeSection === index
                        ? `font-medium ${section.color.replace('bg-', 'text-')}`
                        : 'font-normal text-slate-500/60 hover:text-slate-500/80'
                    }`}
                  >
                    {section.name}
                  </div>
                  
                  {/* Main dot */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeSection === index 
                          ? `${section.color} scale-125 shadow-lg` 
                          : 'bg-slate-400/60 hover:bg-slate-400/80 hover:scale-110'
                      }`}
                    />
                    
                    {/* Active indicator rings */}
                    {activeSection === index && (
                      <>
                        <div className="absolute -inset-1 border border-slate-400/40 rounded-full animate-pulse" />
                        <div className="absolute -inset-2 border border-slate-400/20 rounded-full animate-ping" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Desktop Scroll Progress Indicator */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">Progress</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              {Math.round(scrollProgress)}%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-1.5 bg-slate-200/30 dark:bg-slate-700/30 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
          </div>
        </div>

      </div>
    </div>
    
    {/* Mobile Navigation - Bottom horizontal bar */}
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
      } md:hidden`}
    >
      <div className="glass-nav rounded-full px-4 py-2 border border-white/20 shadow-2xl bg-black/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {navSections.map((section, index) => {
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id, index)}
                className="group relative flex flex-col items-center justify-center"
                aria-label={`Go to ${section.name} section`}
              >
                {/* Mobile dot */}
                <div className="relative mb-1">
                  <div 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeSection === index 
                        ? `${section.color} scale-110 shadow-md` 
                        : 'bg-slate-400/60 hover:bg-slate-400/80 hover:scale-105'
                    }`}
                  />
                  
                  {/* Active indicator rings for mobile */}
                  {activeSection === index && (
                    <>
                      <div className="absolute -inset-0.5 border border-slate-400/30 rounded-full animate-pulse" />
                    </>
                  )}
                </div>
                
                {/* Mobile section name with consistent sizing */}
                <div 
                  className={`transition-all duration-300 whitespace-nowrap text-center min-w-[3.5rem] flex-shrink-0 text-xs leading-tight ${
                    activeSection === index
                      ? `font-medium ${section.color.replace('bg-', 'text-')}`
                      : 'font-normal text-slate-500/60'
                  }`}
                >
                  {section.name}
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Mobile Progress Indicator */}
        <div className="mt-1.5 pt-1.5 border-t border-white/20">
          <div className="relative w-full h-0.5 bg-slate-200/30 dark:bg-slate-700/30 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}