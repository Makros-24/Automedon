import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { useFooter } from '@/contexts/PortfolioDataContext';

export function Footer() {
  // Reads the shared provider rather than fetching independently. The previous
  // private fetch called getPortfolioData() with no argument, so the footer was
  // permanently pinned to English and never followed a language switch.
  const { footer: footerData, loading } = useFooter();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (loading || !footerData || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 100px 0px'
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading, footerData]);

  const shouldAnimate = !loading && footerData && isVisible;

  if (loading) {
    return (
      <footer ref={sectionRef} className="text-center mt-16 pt-8">
        <div className="animate-pulse h-4 bg-foreground/20 rounded w-1/2 mx-auto"></div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  return (
    <motion.footer
      ref={sectionRef}
      className="text-center mt-6 py-8"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity: shouldAnimate ? 1 : 0,
        y: shouldAnimate ? 0 : 30,
        scale: shouldAnimate ? 1 : 0.95
      }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
    >
      <p className="text-sm text-foreground/60">
        © {footerData.copyrightYear} {footerData.copyrightName}. {footerData.madeWithText}
      </p>
    </motion.footer>
  );
}