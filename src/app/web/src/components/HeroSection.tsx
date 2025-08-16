"use client";

import { useState } from 'react';
import { Button } from "./ui/button";
import { ArrowDown, Download, MessageCircle } from "lucide-react";
import { ChatPopup } from "./ChatPopup";

export function HeroSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollToNext = () => {
    const element = document.getElementById('about');
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

    window.dispatchEvent(new CustomEvent('smoothScrollTo', { 
      detail: { target: clampedTarget } 
    }));
  };

  return (
    <>
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Subtle Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 glass-subtle rounded-full opacity-30 subtle-float"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 glass-subtle rounded-full opacity-20 subtle-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 glass-subtle rounded-full opacity-25 subtle-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Scroll Arrow - Lower z-index to appear behind chat button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-5">
          <div className="animate-bounce glass rounded-full p-3">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="space-y-8">
            <div className="glass-card rounded-3xl p-12">
              <h1 className="text-5xl md:text-7xl text-foreground mb-4">
                John Anderson
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
                Senior Software Architect & Full-Stack Developer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Passionate about building scalable solutions and leading engineering teams. 
                10+ years of experience in enterprise software development and system architecture.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={scrollToNext}
                size="lg"
                className="glass-button text-foreground hover:text-background group relative overflow-hidden"
              >
                <span className="relative z-10">View My Work</span>
                <ArrowDown className="ml-2 h-4 w-4 relative z-10 group-hover:animate-bounce" />
                <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass-button border-white/20 text-foreground hover:bg-white/10"
              >
                Download Resume
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Chat Button - Higher z-index to appear above arrow */}
            <div className="flex justify-center relative z-20">
              <Button 
                onClick={() => setIsChatOpen(true)}
                variant="outline"
                size="lg"
                className="glass-button border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask AI About My Background
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Popup */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}