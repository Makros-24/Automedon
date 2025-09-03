import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simplified and more stable section highlighting
  useEffect(() => {
    const updateActiveSection = () => {
      const sections = ['hero', 'work', 'about', 'contact'];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const offset = windowHeight * 0.3; // 30% of viewport height as offset

      let currentSection = 'hero';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          
          // Check if this section should be active
          if (scrollPosition + offset >= elementTop) {
            currentSection = sectionId;
          } else {
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Initial check
    updateActiveSection();

    // Throttled scroll handler for better performance
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const navItems = [
    { name: 'Work', href: '#work', id: 'work' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const isActiveSection = (sectionId: string) => {
    return activeSection === sectionId;
  };

  return (
    <motion.header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
    >
      <motion.nav
        className={`relative rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
          isScrolled 
            ? 'glass-strong border border-white/25 dark:border-white/15' 
            : 'bg-transparent border border-transparent'
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))'
            : 'transparent',
          boxShadow: isScrolled 
            ? '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
            : 'none'
        }}
      >
        <div className="relative flex items-center justify-between px-6 py-3">
          {/* Enhanced Avatar Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative group">
              <motion.div 
                className={`relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-white/40 group-hover:ring-offset-4 ${
                  activeSection === 'hero' 
                    ? 'ring-blue-400/60' 
                    : 'ring-white/20'
                }`}
                whileHover={{ 
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D03AQGgMTxGLlkEEw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1702848448399?e=1759968000&v=beta&t=oGRgNz4MoaeXcj6542T5WsF08YBrA8CO8CHrFP9Czek"
                  alt="Mohamed IBEN EL ABED"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 transition-opacity duration-300 group-hover:ring-white/20" />
                
                {/* Subtle glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
              </motion.div>
              
              {/* Floating indicator */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-black shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.div>

          {/* Desktop Navigation with Active States */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative transition-all duration-300 px-4 py-2 rounded-xl group ${
                  isActiveSection(item.id)
                    ? 'text-foreground bg-white/10 backdrop-blur-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                <span className="relative z-10 font-medium">{item.name}</span>
                
                {/* Hover dot indicator */}
                <motion.div
                  className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))'
                  }}
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
                />
                
                {/* Active indicator */}
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))'
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: isActiveSection(item.id) ? 1 : 0,
                    opacity: isActiveSection(item.id) ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-blue-400/75 to-purple-500/75 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.3))'
                  }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>

          {/* Enhanced Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`relative rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'glass-light hover:glass border border-white/10' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </motion.div>
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`md:hidden relative rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'glass-light hover:glass border border-white/10' 
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 glass border-l border-white/10 backdrop-blur-xl"
              >
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>
                    Navigate to different sections of the portfolio
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 pt-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`relative text-left text-lg py-3 px-4 rounded-xl transition-all duration-300 group ${
                        isActiveSection(item.id)
                          ? 'text-foreground bg-white/15 border border-white/20'
                          : 'text-foreground/80 hover:text-foreground hover:bg-white/10'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.name}
                      
                      {/* Hover dot indicator for mobile */}
                      <motion.div
                        className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                        style={{
                          filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))'
                        }}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
                      />
                      
                      {isActiveSection(item.id) && (
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full float-right mt-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}