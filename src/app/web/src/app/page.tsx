'use client';

import { useEffect } from 'react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Work } from '@/components/Work';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { PortfolioDataProvider } from '@/contexts/PortfolioDataContext';

function AppContent() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    document.documentElement.classList.add(initialTheme);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Work />
          <About />
          <Contact />
		  <Footer />
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

export default function Home() {
  return (
    <PortfolioDataProvider>
      <AppContent />
    </PortfolioDataProvider>
  );
}