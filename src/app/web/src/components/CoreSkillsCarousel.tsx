import { motion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { Brain, Clock, UserCheck, MessageSquare, Lightbulb, Target, Puzzle, HandHeart, Users } from 'lucide-react';
import Slider from 'react-slick';
import { useEffect, useState } from 'react';

const coreSkills = [
  {
    icon: Brain,
    title: 'Problem Solving',
    description: 'Expert at breaking down complex challenges into manageable solutions'
  },
  {
    icon: Clock,
    title: 'Time Management',
    description: 'Efficiently prioritize tasks and meet critical project deadlines'
  },
  {
    icon: Users,
    title: 'Team Leadership',
    description: 'Lead cross-functional teams and mentor junior developers'
  },
  {
    icon: UserCheck,
    title: 'Collaboration',
    description: 'Excel in team environments and foster productive partnerships'
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'Translate technical concepts to stakeholders at all levels'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Drive creative solutions and implement cutting-edge technologies'
  },
  {
    icon: Target,
    title: 'Strategic Planning',
    description: 'Align technical decisions with business objectives and goals'
  },
  {
    icon: Puzzle,
    title: 'Systems Thinking',
    description: 'Design holistic solutions considering all system interactions'
  },
  {
    icon: HandHeart,
    title: 'Mentoring',
    description: 'Guide team growth through knowledge sharing and coaching'
  }
];

function CoreSkillCard({ skill, index, slideIndex }: { skill: typeof coreSkills[0]; index: number; slideIndex: number }) {
  const IconComponent = skill.icon;

  return (
    <div className="px-3" data-slide-index={slideIndex}>
      <motion.div
        className="group relative skill-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: 'easeOut' }}
      >
        <div className="relative p-6 rounded-xl glass glass-hover transition-all duration-300 h-full border border-white/10 hover:border-white/20 group-hover:bg-white/8 dark:group-hover:bg-white/5 group-hover:backdrop-blur-lg mx-2">
          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
          
          <div className="flex flex-col items-center text-center space-y-4 h-full min-h-[180px]">
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl glass-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="w-7 h-7 text-foreground/70 stroke-[1.5] group-hover:text-foreground transition-colors duration-300" />
            </div>
            
            {/* Content */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <h4 className="text-lg font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                {skill.title}
              </h4>
              <p className="text-sm text-foreground/60 group-hover:text-foreground/70 leading-relaxed transition-colors duration-300">
                {skill.description}
              </p>
            </div>
          </div>
          
          {/* Background highlight */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>
    </div>
  );
}

export function CoreSkillsCarousel() {
  const { ref: carouselRef, isInView } = useInViewOnce({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  
  useEffect(() => {
    if (!isInView) return;
    
    const updateCardOpacity = () => {
      const carouselContainer = document.querySelector('.carousel-container .slick-list');
      if (!carouselContainer) return;
      
      const containerRect = carouselContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const fadeZone = containerRect.width * 0.4; // Larger fade zone for automatic scrolling
      
      const cards = carouselContainer.querySelectorAll('.skill-card');
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = Math.abs(cardCenter - containerCenter);
        const maxDistance = containerRect.width / 2 + cardRect.width / 2;
        
        let opacity = 1;
        
        // Calculate opacity for continuous automatic scrolling
        if (distanceFromCenter > maxDistance - fadeZone) {
          const fadeProgress = (distanceFromCenter - (maxDistance - fadeZone)) / fadeZone;
          // Smoother fade curve for automatic scrolling
          const easedProgress = Math.sin(fadeProgress * Math.PI / 2);
          opacity = Math.max(0.1, 1 - easedProgress);
        }
        
        // Apply opacity smoothly
        const cardElement = card as HTMLElement;
        cardElement.style.opacity = opacity.toString();
        
        // Subtle scale effect that works with continuous movement
        const scaleEffect = Math.max(0.96, 1 - (distanceFromCenter / maxDistance) * 0.04);
        cardElement.style.transform = `scale(${scaleEffect})`;
      });
    };
    
    // Smooth 60fps updates for automatic scrolling
    let animationId: number;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      // Throttle to 30fps for smoother slower movement
      if (currentTime - lastTime >= 33) {
        updateCardOpacity();
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };
    
    // Start immediately for automatic scrolling
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 100);
    
    // Handle resize
    const handleResize = () => updateCardOpacity();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isInView]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 15000, // Much slower for more gentle feel
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Continuous movement
    cssEase: "linear", // Linear for smooth continuous animation
    pauseOnHover: false, // Never pause - always moving
    pauseOnFocus: false,
    arrows: false,
    variableWidth: false,
    centerMode: false,
    swipe: false, // Disable manual interactions for automatic only
    touchMove: false,
    draggable: false,
    accessibility: false, // Disable to prevent interaction
    adaptiveHeight: false,
    useCSS: true,
    useTransform: true,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          speed: 15000,
          autoplaySpeed: 0,
          cssEase: "linear",
          swipe: false,
          touchMove: false,
          draggable: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 15000,
          autoplaySpeed: 0,
          cssEase: "linear",
          swipe: false,
          touchMove: false,
          draggable: false,
        }
      }
    ]
  };

  return (
    <motion.div
      ref={carouselRef}
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Carousel container without background overlays */}
      <div className="relative overflow-hidden py-4">
        {/* Carousel */}
        <div className="carousel-container">
          <Slider {...settings}>
            {/* Triple the skills array for truly seamless infinite effect */}
            {[...coreSkills, ...coreSkills, ...coreSkills].map((skill, index) => (
              <CoreSkillCard 
                key={`${skill.title}-${index}`} 
                skill={skill} 
                index={index % coreSkills.length}
                slideIndex={index}
              />
            ))}
          </Slider>
        </div>
      </div>


    </motion.div>
  );
}