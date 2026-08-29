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

function AppContent() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    document.documentElement.classList.add(initialTheme);
  }, []);

  return (
    <div className="relative bg-background text-foreground">
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

// PortfolioDataProvider lives in the root layout - mounting a second one here
// would shadow it and fetch the same data twice.
export default function Home() {
  return <AppContent />;
}