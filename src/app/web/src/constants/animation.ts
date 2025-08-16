/**
 * Animation and performance constants
 */

// Scroll configuration
export const SCROLL_CONFIG = {
  EASE: 0.08,
  HERO_VISIBILITY_THRESHOLD: 0.8, // 80% viewport height
  SECTION_DETECTION_POINT: 0.4, // 40% viewport height
  PROGRESS_UPDATE_THRESHOLD: 0.5, // Only update progress if change > 0.5%
} as const;

// Three.js performance constants
export const THREE_JS_CONFIG = {
  MAX_DEVICE_PIXEL_RATIO: 2,
  PARTICLE_COUNTS: {
    MOBILE: 200,
    TABLET: 400,
    DESKTOP: 710,
  },
  PARTICLE_SIZES: {
    SMALL: 0.8,
    MEDIUM: 1.2,
    LARGE: 1.8,
  },
  ANIMATION_SPEEDS: {
    SLOW: 0.001,
    MEDIUM: 0.002,
    FAST: 0.005,
  },
  RANGES: {
    SMALL: 20,
    MEDIUM: 30,
    LARGE: 40,
  },
} as const;

// Chat configuration
export const CHAT_CONFIG = {
  MAX_INPUT_LENGTH: 500,
  MIN_INPUT_LENGTH: 1,
  RATE_LIMIT: {
    MAX_MESSAGES: 10,
    TIME_WINDOW_MINUTES: 1,
  },
  AI_RESPONSE_DELAY: {
    MIN: 1000,
    MAX: 1800,
  },
} as const;

// Theme transition timings
export const THEME_CONFIG = {
  TRANSITION_DURATION: 300, // ms
  DEBOUNCE_DELAY: 100, // ms
} as const;

// Navigation visibility delays
export const NAV_CONFIG = {
  VISIBILITY_DELAY: 100, // ms
  ANIMATION_DURATION: 700, // ms
} as const;

// Device breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Get particle count based on screen width
 */
export function getParticleCount(width: number): number {
  if (width < BREAKPOINTS.MD) {
    return THREE_JS_CONFIG.PARTICLE_COUNTS.MOBILE;
  } else if (width < BREAKPOINTS.LG) {
    return THREE_JS_CONFIG.PARTICLE_COUNTS.TABLET;
  } else {
    return THREE_JS_CONFIG.PARTICLE_COUNTS.DESKTOP;
  }
}

/**
 * Check if device is mobile based on screen width
 */
export function isMobileDevice(width: number): boolean {
  return width < BREAKPOINTS.MD;
}

/**
 * Get optimal particle range based on screen size
 */
export function getParticleRange(width: number): number {
  if (width < BREAKPOINTS.MD) {
    return THREE_JS_CONFIG.RANGES.SMALL;
  } else if (width < BREAKPOINTS.LG) {
    return THREE_JS_CONFIG.RANGES.MEDIUM;
  } else {
    return THREE_JS_CONFIG.RANGES.LARGE;
  }
}