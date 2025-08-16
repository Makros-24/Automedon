"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navItems = [
    { label: 'About', href: 'about' },
    { label: 'Skills', href: 'skills' },
    { label: 'Experience', href: 'experience' },
    { label: 'Projects', href: 'projects' },
    { label: 'Education', href: 'education' },
    { label: 'Contact', href: 'contact' },
  ];

  useEffect(() => {
    let animationId: number;
    
    const handleScroll = () => {
      const content = document.querySelector('[style*="translate3d"]') as HTMLElement;
      if (!content) {
        animationId = requestAnimationFrame(handleScroll);
        return;
      }

      const transformValue = content.style.transform;
      const match = transformValue.match(/translate3d\(0px,\s*(-?\d+(?:\.\d+)?)px,\s*0px\)/);
      
      if (match) {
        const currentScrollY = Math.abs(parseFloat(match[1]));
        
        // Determine if we've scrolled enough to show/hide nav
        setIsScrolled(currentScrollY > 50);
        
        // Determine scroll direction and visibility
        if (currentScrollY < 100) {
          // Always show nav when near top
          setIsVisible(true);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - show nav
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
          // Scrolling down and past threshold - hide nav
          setIsVisible(false);
          // Close mobile menu if open when hiding
          setIsMobileMenuOpen(false);
        }
        
        lastScrollY.current = currentScrollY;
      }

      animationId = requestAnimationFrame(handleScroll);
    };

    handleScroll();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
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

    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.dispatchEvent(new CustomEvent('smoothScrollTo', { 
      detail: { target: 0 } 
    }));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'glass-nav border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <button
            onClick={scrollToTop}
            className="text-xl text-foreground hover:text-muted-foreground transition-colors duration-200"
          >
            John Anderson
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
            <div className="glass-button rounded-lg p-1">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="glass-button rounded-lg p-1">
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground glass-button"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 glass-card rounded-b-lg">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}