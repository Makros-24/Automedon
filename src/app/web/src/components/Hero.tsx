import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Download, Eye, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { AIChatPopup } from './AIChatPopup';
import { usePersonalInfo } from '@/contexts/PortfolioDataContext';
import { Loading, SkeletonText } from './ui/loading';

export function Hero() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { personalInfo, loading, error } = usePersonalInfo();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToWork = () => {
    const workSection = document.querySelector('#work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadResume = () => {
    if (personalInfo?.resumeUrl) {
      // Create download link
      const link = document.createElement('a');
      link.href = personalInfo.resumeUrl;
      link.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Resume not available for download');
    }
  };

  const handleAskAI = () => {
    setIsAIChatOpen(true);
  };

  // Handle loading state
  if (loading) {
    return (
      <motion.section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        style={{ y, opacity }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <Loading size="lg" text="Loading portfolio..." />
        </div>
      </motion.section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <motion.section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        style={{ y, opacity }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <p className="text-lg text-red-500">Error loading portfolio data: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </motion.section>
    );
  }

  // Handle missing data
  if (!personalInfo) {
    return (
      <motion.section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        style={{ y, opacity }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <p className="text-lg text-foreground/70">Portfolio data not available</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Name */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {personalInfo.name}
          </motion.h1>

          {/* Title */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground/80 mb-4">
              {personalInfo.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 rounded-full mx-auto" />
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {personalInfo.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {/* Primary CTA */}
            <Button
              onClick={scrollToWork}
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-8 py-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 w-full md:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View My Work
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            {/* Secondary CTA */}
            <Button
              onClick={handleDownloadResume}
              variant="outline"
              size="lg"
              className="group relative bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 backdrop-blur-sm rounded-full px-8 py-3 transition-all duration-300 w-full md:w-auto"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </span>
            </Button>

            {/* Tertiary CTA */}
            <Button
              onClick={handleAskAI}
              variant="ghost"
              size="lg"
              className="group relative bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/20 hover:border-amber-500/30 backdrop-blur-sm rounded-full px-8 py-3 transition-all duration-300 w-full md:w-auto"
            >
              <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                Ask AI About Me
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={scrollToWork}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex flex-col items-center gap-2 text-foreground/50 hover:text-foreground/80 transition-colors duration-300">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>

      {/* AI Chat Popup */}
      <AIChatPopup 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />
    </motion.section>
  );
}