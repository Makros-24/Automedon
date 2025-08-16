import { ThemeProvider } from "../components/ThemeProvider";
import { Navigation } from "../components/Navigation";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingNavDots } from "../components/FloatingNavDots";
import { SmoothScrollCanvas } from "../components/SmoothScrollCanvas";
import { ErrorBoundaryWrapper } from "../components/ErrorBoundary";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { ExperienceSection } from "../components/ExperienceSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { EducationSection } from "../components/EducationSection";
import { ContactSection } from "../components/ContactSection";

export default function Home() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="portfolio-ui-theme">
      <div className="relative">
        {/* Enhanced Smooth Scrolling Canvas with Responsive Particles */}
        <ErrorBoundaryWrapper>
          <SmoothScrollCanvas>
          {/* Scroll Progress Indicator */}
          <ScrollProgress />
          
          {/* Original Figma Navigation */}
          <Navigation />
          
          {/* Main Content Sections */}
          <div id="hero" className="smooth-scroll-section">
            <HeroSection />
          </div>
          
          <div id="about" className="smooth-scroll-section">
            <AboutSection />
          </div>
          
          <div id="skills" className="smooth-scroll-section">
            <SkillsSection />
          </div>
          
          <div id="experience" className="smooth-scroll-section">
            <ExperienceSection />
          </div>
          
          <div id="projects" className="smooth-scroll-section">
            <ProjectsSection />
          </div>
          
          <div id="education" className="smooth-scroll-section">
            <EducationSection />
          </div>
          
          <div id="contact" className="smooth-scroll-section">
            <ContactSection />
          </div>
        </SmoothScrollCanvas>
        </ErrorBoundaryWrapper>
        
        {/* Floating Navigation Dots - outside SmoothScrollCanvas for true viewport positioning */}
        <FloatingNavDots />
      </div>
    </ThemeProvider>
  );
}