"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const previousProgressRef = useRef(0);
  const animationIdRef = useRef<number | undefined>(undefined);

  const updateProgress = useCallback(() => {
    const content = document.querySelector('[style*="translate3d"]') as HTMLElement;
    if (!content) {
      animationIdRef.current = requestAnimationFrame(updateProgress);
      return;
    }

    const transformValue = content.style.transform;
    const match = transformValue.match(/translate3d\(0px,\s*(-?\d+(?:\.\d+)?)px,\s*0px\)/);
    
    if (match) {
      const currentScroll = Math.abs(parseFloat(match[1]));
      const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);
      const progress = maxScroll > 0 ? Math.min(currentScroll / maxScroll, 1) : 0;
      
      // Only update state if progress has actually changed to avoid infinite re-renders
      if (Math.abs(progress - previousProgressRef.current) > 0.001) {
        previousProgressRef.current = progress;
        setScrollProgress(progress);
      }
    }

    animationIdRef.current = requestAnimationFrame(updateProgress);
  }, []);

  useEffect(() => {
    updateProgress();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [updateProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-300 ease-out"
        style={{ 
          width: `${Math.round(scrollProgress * 100)}%`,
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
        }}
      />
    </div>
  );
}