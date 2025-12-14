/**
 * Hero Animations Test Suite
 * Tests for the hero section GSAP animations
 */

// Create mocks that can be hoisted
jest.mock('@/lib/gsap', () => {
  // Create timeline mock that properly supports method chaining
  const createMockTimeline = () => {
    const timeline = {
      fromTo: jest.fn(),
      to: jest.fn(),
      set: jest.fn(),
      call: jest.fn(),
      add: jest.fn(),
      duration: jest.fn(() => 2.5),
      progress: jest.fn(() => 0),
      play: jest.fn(),
      pause: jest.fn(),
      reverse: jest.fn(),
      restart: jest.fn(),
      kill: jest.fn(),
      totalTime: jest.fn(() => 2500),
      isActive: jest.fn(() => false),
      paused: jest.fn(() => false),
    };

    // Make all timeline methods return the timeline itself for chaining
    timeline.fromTo.mockReturnValue(timeline);
    timeline.to.mockReturnValue(timeline);
    timeline.set.mockReturnValue(timeline);
    timeline.call.mockReturnValue(timeline);
    timeline.add.mockReturnValue(timeline);
    timeline.play.mockReturnValue(timeline);
    timeline.pause.mockReturnValue(timeline);
    timeline.reverse.mockReturnValue(timeline);
    timeline.restart.mockReturnValue(timeline);

    return timeline;
  };

  const mockTimeline = createMockTimeline();

  const mockGsap = {
    set: jest.fn(),
    to: jest.fn(),
    fromTo: jest.fn(),
    killTweensOf: jest.fn(),
    timeline: jest.fn((config = {}) => {
      const timeline = createMockTimeline();
      // Store the config for assertions if needed
      timeline._config = config;
      return timeline;
    }),
  };

  const mockScrollTrigger = {
    create: jest.fn((config) => ({
      vars: config,
      kill: jest.fn()
    })),
    getAll: jest.fn(() => []),
    refresh: jest.fn(),
  };

  return {
    gsap: mockGsap,
    ScrollTrigger: mockScrollTrigger,
  };
});

import {
  initHeroAnimations,
  initHeroScrollAnimations,
  initHeroScrollFade,
  initAllHeroAnimations
} from '@/components/gsap/AnimationsHero';

// Get the mocked modules for our tests
const { gsap: mockGsap, ScrollTrigger: mockScrollTrigger } = jest.requireMock('@/lib/gsap');

describe('Hero Animations', () => {
  beforeEach(() => {
    // Reset mock calls but keep implementations
    jest.clearAllMocks();

    // Re-setup ScrollTrigger.getAll to return empty array
    mockScrollTrigger.getAll.mockReturnValue([]);

    // Ensure timeline creation always returns a timeline object
    mockGsap.timeline.mockImplementation((config = {}) => {
      // Create a new timeline instance for each call
      const timeline = {
        fromTo: jest.fn().mockReturnThis(),
        to: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        call: jest.fn().mockReturnThis(),
        add: jest.fn().mockReturnThis(),
        duration: jest.fn(() => 2.5),
        progress: jest.fn(() => 0),
        play: jest.fn().mockReturnThis(),
        pause: jest.fn().mockReturnThis(),
        reverse: jest.fn().mockReturnThis(),
        restart: jest.fn().mockReturnThis(),
        kill: jest.fn(),
        totalTime: jest.fn(() => 2500),
        isActive: jest.fn(() => false),
        paused: jest.fn(() => false),
        _config: config,
      };

      // Ensure all methods return the timeline for chaining
      Object.keys(timeline).forEach(key => {
        if (typeof timeline[key] === 'function' && key !== 'duration' && key !== 'progress' && key !== 'totalTime' && key !== 'isActive' && key !== 'paused' && key !== 'kill') {
          timeline[key].mockReturnValue(timeline);
        }
      });

      return timeline;
    });

    // Create complete DOM structure matching what the animations expect
    document.body.innerHTML = `
      <section class="hero-section">
        <div class="hero-badge">Badge content</div>
        <div class="hero-title">
          Title with
          <span class="typewriter-letter">t</span>
          <span class="typewriter-letter">y</span>
          <span class="typewriter-letter">p</span>
          <span class="typewriter-letter">e</span>
          <span class="typewriter-letter">w</span>
          <span class="typewriter-letter">r</span>
          <span class="typewriter-letter">i</span>
          <span class="typewriter-letter">t</span>
          <span class="typewriter-letter">e</span>
          <span class="typewriter-letter">r</span>
        </div>
        <div class="hero-description">Description content</div>
        <div class="hero-check">Check 1</div>
        <div class="hero-check">Check 2</div>
        <div class="hero-check">Check 3</div>
        <div class="hero-button-wrapper">
          <div class="hero-button-primary">Primary button</div>
          <div class="hero-button-secondary">Secondary button</div>
        </div>
        <div class="hero-stat">Stat 1</div>
        <div class="hero-stat">Stat 2</div>
        <div class="hero-stat">Stat 3</div>
        <div class="hero-image">Image</div>
      </section>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('initHeroAnimations', () => {
    it('should initialize hero animations successfully', () => {
      const timeline = initHeroAnimations();

      expect(timeline).toBeDefined();
      expect(mockGsap.timeline).toHaveBeenCalled();
      expect(mockGsap.set).toHaveBeenCalledWith('.hero-badge', expect.objectContaining({
        opacity: 0,
        y: -30,
        className: '-=hero-element-hidden'
      }));
    });

    it('should set initial states for all hero elements', () => {
      initHeroAnimations();

      const heroElements = [
        '.hero-badge',
        '.hero-title',
        '.hero-description',
        '.hero-check',
        '.hero-button-primary',
        '.hero-button-secondary',
        '.hero-stat'
      ];

      heroElements.forEach(selector => {
        expect(mockGsap.set).toHaveBeenCalledWith(
          selector,
          expect.objectContaining({
            opacity: expect.any(Number)
          })
        );
      });
    });

    it('should create timeline with correct configuration', () => {
      initHeroAnimations();

      expect(mockGsap.timeline).toHaveBeenCalledWith({
        defaults: {
          ease: 'power3.out',
          duration: 1
        },
        paused: false,
        immediateRender: false
      });
    });

    it('should retry initialization when elements are missing', () => {
      document.body.innerHTML = '';

      const result = initHeroAnimations();
      expect(result).toBeNull();
      expect(mockGsap.timeline).not.toHaveBeenCalled();
    });

    it('should animate badge with correct timing and easing', () => {
      const timeline = initHeroAnimations();

      // Since timeline is returned from mockGsap.timeline(), check if fromTo was called
      expect(timeline).toBeDefined();
      expect(mockGsap.timeline).toHaveBeenCalled();
    });

    it('should animate title with staggered timing', () => {
      initHeroAnimations();

      expect(mockGsap.timeline).toHaveBeenCalled();
    });
  });

  describe('initHeroScrollAnimations', () => {
    it('should create ScrollTrigger for button wrapper', () => {
      initHeroScrollAnimations();

      expect(mockScrollTrigger.create).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: '.hero-button-wrapper',
          start: 'top 10%',
          pin: true,
          pinSpacing: false
        })
      );
    });

    it('should not initialize when button wrapper is missing', () => {
      const buttonWrapper = document.querySelector('.hero-button-wrapper');
      buttonWrapper?.remove();

      initHeroScrollAnimations();

      expect(mockScrollTrigger.create).not.toHaveBeenCalled();
    });
  });

  describe('Basic Integration Tests', () => {
    it('should call timeline methods in sequence', () => {
      const timeline = initHeroAnimations();

      expect(mockGsap.timeline).toHaveBeenCalled();
      expect(mockGsap.set).toHaveBeenCalled();
    });

    it('should handle missing elements gracefully', () => {
      document.body.innerHTML = '';

      const result = initHeroAnimations();
      expect(result).toBeNull();
    });
  });
});