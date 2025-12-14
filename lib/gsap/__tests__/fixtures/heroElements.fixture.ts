/**
 * Fixture data for hero elements testing
 * Contains expected values, configurations, and test data
 */

/**
 * Expected initial states for all hero elements
 */
export const INITIAL_STATES = {
  '.hero-badge': {
    opacity: 0,
    y: -30,
    className: 'hero-element-hidden'
  },
  '.hero-title': {
    opacity: 0,
    y: 50,
    className: 'hero-element-hidden'
  },
  '.typewriter-letter': {
    opacity: 0,
    scale: 0.5,
    className: 'hero-element-hidden'
  },
  '.hero-description': {
    opacity: 0,
    y: 30,
    className: 'hero-element-hidden'
  },
  '.hero-check': {
    opacity: 0,
    x: -20,
    className: 'hero-element-hidden'
  },
  '.hero-button-primary': {
    opacity: 0,
    y: 20,
    scale: 0.95,
    className: 'hero-element-hidden'
  },
  '.hero-button-secondary': {
    opacity: 0,
    scale: 0,
    rotation: 0,
    className: 'hero-element-hidden'
  },
  '.hero-stat': {
    opacity: 0,
    scale: 0.8,
    className: 'hero-element-hidden'
  },
  '.hero-image': {
    opacity: 1
  }
} as const;

/**
 * Expected final states after animations complete
 */
export const FINAL_STATES = {
  '.hero-badge': {
    opacity: 1,
    y: 0
  },
  '.hero-title': {
    opacity: 1,
    y: 0
  },
  '.typewriter-letter': {
    opacity: 1,
    scale: 1
  },
  '.hero-description': {
    opacity: 1,
    y: 0
  },
  '.hero-check': {
    opacity: 1,
    x: 0
  },
  '.hero-button-primary': {
    opacity: 1,
    y: 0,
    scale: 1
  },
  '.hero-button-secondary': {
    opacity: 1,
    scale: 1,
    rotation: 0
  },
  '.hero-stat': {
    opacity: 1,
    scale: 1
  },
  '.hero-image': {
    opacity: 1
  }
} as const;

/**
 * Animation timing configuration
 */
export const ANIMATION_TIMING = {
  badge: {
    duration: 0.8,
    ease: 'power3.out',
    position: 0
  },
  title: {
    duration: 1,
    ease: 'power3.out',
    position: '-=0.5'
  },
  typewriter: {
    duration: 0.3,
    ease: 'back.out(1.7)',
    position: '-=0.3',
    stagger: 0.1
  },
  description: {
    duration: 0.8,
    ease: 'power3.out',
    position: '-=0.6'
  },
  checks: {
    duration: 0.6,
    ease: 'power3.out',
    position: '-=0.4',
    stagger: 0.15
  },
  buttonPrimary: {
    duration: 0.8,
    ease: 'power3.out',
    position: '-=0.4'
  },
  buttonSecondary: {
    duration: 1,
    ease: 'elastic.out(1, 0.7)',
    position: '-=0.6'
  },
  stats: {
    duration: 0.6,
    ease: 'back.out(1.7)',
    position: '-=0.4',
    stagger: 0.1
  }
} as const;

/**
 * Expected element counts in DOM
 */
export const ELEMENT_COUNTS = {
  '.hero-badge': 1,
  '.hero-title': 1,
  '.hero-description': 1,
  '.hero-check': 3,
  '.hero-button-primary': 1,
  '.hero-button-secondary': 1,
  '.hero-stat': 3,
  '.hero-image': 1,
  '.hero-button-wrapper': 1,
  '.hero-section': 1,
  '.typewriter-letter': 7 // E-c-u-a-d-o-r
} as const;

/**
 * Timeline configuration expected values
 */
export const TIMELINE_CONFIG = {
  defaults: {
    ease: 'power3.out',
    duration: 1
  },
  paused: false,
  immediateRender: false
} as const;

/**
 * Expected total animation duration (calculated from timing overlaps)
 */
export const EXPECTED_TOTAL_DURATION = 2.5; // seconds

/**
 * Secondary button breathing animation config
 */
export const BREATHING_ANIMATION = {
  scale: 1.05,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
} as const;

/**
 * ScrollTrigger configurations
 */
export const SCROLL_TRIGGER_CONFIGS = {
  buttonPin: {
    trigger: '.hero-button-wrapper',
    start: 'top 10%',
    end: '+=8000',
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
    anticipatePin: 1
  },
  buttonMove: {
    trigger: '.hero-section',
    start: 'top top',
    end: '+=700',
    scrub: 0.1,
    invalidateOnRefresh: true
  },
  elementsFade: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    invalidateOnRefresh: true
  }
} as const;

/**
 * Button movement animation stages
 */
export const BUTTON_MOVEMENT_STAGES = [
  {
    x: 400,
    ease: 'none',
    duration: 5
  },
  {
    x: 1035,
    ease: 'none',
    duration: 3
  }
] as const;

/**
 * Fade out animation targets
 */
export const FADE_ELEMENTS = '.hero-badge, .hero-title, .hero-description, .hero-check, .hero-button-primary, .hero-stat, .hero-image';

/**
 * Performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  maxInitializationTime: 100, // ms
  maxAnimationTime: 3000, // ms (total timeline duration + buffer)
  maxCleanupTime: 50, // ms
  maxMemoryUsage: 10 // MB
} as const;

/**
 * Test selectors for different scenarios
 */
export const TEST_SELECTORS = {
  allAnimated: [
    '.hero-badge',
    '.hero-title',
    '.typewriter-letter',
    '.hero-description',
    '.hero-check',
    '.hero-button-primary',
    '.hero-button-secondary',
    '.hero-stat'
  ],
  withStagger: [
    '.hero-check',
    '.hero-stat',
    '.typewriter-letter'
  ],
  singleElements: [
    '.hero-badge',
    '.hero-title',
    '.hero-description',
    '.hero-button-primary',
    '.hero-button-secondary',
    '.hero-image'
  ]
} as const;

/**
 * Error scenarios for testing
 */
export const ERROR_SCENARIOS = {
  missingElements: [
    '.non-existent-element',
    '.hero-missing',
    '.fake-selector'
  ],
  invalidSelectors: [
    '',
    null,
    undefined,
    123,
    []
  ]
} as const;

/**
 * Animation sequence order (for timing verification)
 */
export const ANIMATION_SEQUENCE = [
  { selector: '.hero-badge', startTime: 0 },
  { selector: '.hero-title', startTime: 0.3 }, // -=0.5 from badge end (0.8)
  { selector: '.typewriter-letter', startTime: 0.5 }, // -=0.3 from title start
  { selector: '.hero-description', startTime: 0.7 }, // -=0.6 from title start
  { selector: '.hero-check', startTime: 1.1 }, // -=0.4 from description start
  { selector: '.hero-button-primary', startTime: 1.1 }, // -=0.4 from checks start
  { selector: '.hero-button-secondary', startTime: 0.8 }, // -=0.6 from button primary start
  { selector: '.hero-stat', startTime: 1.1 } // -=0.4 from button primary start
] as const;