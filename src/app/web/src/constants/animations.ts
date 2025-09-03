// Animation presets for consistent motion design
export const animationPresets = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  },

  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // Slide animations
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },

  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },

  // Hover animations
  hoverLift: {
    whileHover: { 
      y: -5, 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  },

  hoverScale: {
    whileHover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  },

  // Stagger animations
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}

// Easing functions
export const easingFunctions = {
  smooth: [0.23, 1, 0.32, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  sharp: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.46, 0.45, 0.94]
}

// Duration constants
export const animationDurations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
  verySlow: 1.0
}