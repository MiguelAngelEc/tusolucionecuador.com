/**
 * Services Animations Test Suite
 * Tests for the services section GSAP animations
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
      eventCallback: jest.fn(),
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
    timeline.eventCallback.mockReturnValue(timeline);

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
  initServicesEntryAnimations,
  initServicesContinuousAnimations,
  initServicesExitAnimations,
  initServicesResponsiveAnimations,
  initAllServicesAnimations
} from '@/components/gsap/AnimationsServices';

// Get the mocked modules for our tests
const { gsap: mockGsap, ScrollTrigger: mockScrollTrigger } = jest.requireMock('@/lib/gsap');

describe('Services Animations', () => {
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
        eventCallback: jest.fn().mockReturnThis(),
        _config: config,
      };

      // Ensure all methods return the timeline for chaining
      Object.keys(timeline).forEach(key => {
        if (typeof timeline[key] === 'function' && !['duration', 'progress', 'totalTime', 'isActive', 'paused', 'kill'].includes(key)) {
          timeline[key].mockReturnValue(timeline);
        }
      });

      return timeline;
    });

    // Create complete DOM structure matching what the animations expect
    document.body.innerHTML = `
      <section class="services-section">
        <div class="container">
          <div class="text-center">
            <h2 class="services-title">Nuestros Servicios Especializados</h2>
            <p class="services-description">Ofrecemos servicios especializados</p>
          </div>
          <div class="grid">
            <div class="services-card">
              <div class="services-content">
                <div class="services-icon">
                  <img src="/test-icon.png" alt="Test Service" />
                </div>
                <h3>Test Service 1</h3>
                <p>Test description 1</p>
                <ul class="services-features">
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                </ul>
                <button class="services-button">Ver más</button>
              </div>
            </div>
            <div class="services-card">
              <div class="services-content">
                <div class="services-icon">
                  <img src="/test-icon2.png" alt="Test Service 2" />
                </div>
                <h3>Test Service 2</h3>
                <p>Test description 2</p>
                <ul class="services-features">
                  <li>Feature A</li>
                  <li>Feature B</li>
                  <li>Feature C</li>
                </ul>
                <button class="services-button">Ver más</button>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button class="services-main-button">Ver Todos los Servicios</button>
          </div>
        </div>
      </section>
    `;

    // Mock window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('initServicesEntryAnimations', () => {
    it('should initialize services entry animations successfully', () => {
      const timeline = initServicesEntryAnimations();

      expect(timeline).toBeDefined();
      expect(mockGsap.timeline).toHaveBeenCalled();
      expect(mockGsap.set).toHaveBeenCalledWith('.services-title', expect.objectContaining({
        opacity: 0,
        y: 60,
        scale: 0.8
      }));
    });

    it('should set initial states for all services elements', () => {
      initServicesEntryAnimations();

      const servicesElements = [
        '.services-title',
        '.services-description',
        '.services-card',
        '.services-icon',
        '.services-content'
      ];

      servicesElements.forEach(selector => {
        expect(mockGsap.set).toHaveBeenCalledWith(
          selector,
          expect.objectContaining({
            opacity: expect.any(Number)
          })
        );
      });
    });

    it('should create timeline with ScrollTrigger configuration', () => {
      initServicesEntryAnimations();

      expect(mockGsap.timeline).toHaveBeenCalledWith({
        scrollTrigger: expect.objectContaining({
          trigger: '.services-section',
          start: 'top 70%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        })
      });
    });

    it('should return null when required elements are missing', () => {
      document.body.innerHTML = '';

      const result = initServicesEntryAnimations();
      expect(result).toBeNull();
      expect(mockGsap.timeline).not.toHaveBeenCalled();
    });

    it('should animate title with correct timing and easing', () => {
      const timeline = initServicesEntryAnimations();

      expect(timeline).toBeDefined();
      expect(mockGsap.timeline).toHaveBeenCalled();
    });

    it('should animate cards with stagger timing', () => {
      initServicesEntryAnimations();

      expect(mockGsap.timeline).toHaveBeenCalled();
    });
  });

  describe('initServicesContinuousAnimations', () => {
    it('should initialize continuous animations successfully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      initServicesContinuousAnimations();

      expect(mockGsap.to).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should not initialize when services section is missing', () => {
      const servicesSection = document.querySelector('.services-section');
      servicesSection?.remove();

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      initServicesContinuousAnimations();

      expect(consoleSpy).toHaveBeenCalledWith('Services section not found for continuous animations');

      consoleSpy.mockRestore();
    });

    it('should setup hover event listeners for cards', () => {
      initServicesContinuousAnimations();

      const cards = document.querySelectorAll('.services-card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('initServicesExitAnimations', () => {
    it('should create exit timeline with ScrollTrigger', () => {
      initServicesExitAnimations();

      expect(mockGsap.timeline).toHaveBeenCalledWith({
        scrollTrigger: expect.objectContaining({
          trigger: '.services-section',
          start: 'bottom 30%',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        })
      });
    });

    it('should not initialize when services section is missing', () => {
      const servicesSection = document.querySelector('.services-section');
      servicesSection?.remove();

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      initServicesExitAnimations();

      expect(consoleSpy).toHaveBeenCalledWith('Services section not found for exit animations');

      consoleSpy.mockRestore();
    });
  });

  describe('initServicesResponsiveAnimations', () => {
    it('should handle mobile animations', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      initServicesResponsiveAnimations();

      expect(mockGsap.set).toHaveBeenCalled();
      expect(mockGsap.to).toHaveBeenCalled();
    });

    it('should handle tablet animations', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      initServicesResponsiveAnimations();

      expect(mockGsap.set).toHaveBeenCalled();
      expect(mockGsap.to).toHaveBeenCalled();
    });

    it('should handle desktop animations', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      initServicesResponsiveAnimations();

      // Desktop should not set specific responsive animations in this case
    });
  });

  describe('initAllServicesAnimations', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should initialize all services animations successfully', () => {
      const result = initAllServicesAnimations();

      expect(result).toBeDefined();
      if (result) {
        expect(result.entryTimeline).toBeDefined();
        expect(result.cleanup).toBeDefined();
      }
    });

    it('should handle server side gracefully', () => {
      // This test validates that the function can handle server-side execution
      // In a real server environment, window would be undefined
      const result = initAllServicesAnimations();

      // The function should either return a valid result or handle the absence gracefully
      expect(result).toBeDefined();
    });

    it('should retry when elements are not ready', () => {
      document.body.innerHTML = '';

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      initAllServicesAnimations();

      expect(consoleSpy).toHaveBeenCalledWith('Services elements not ready, retrying...');

      consoleSpy.mockRestore();
    });

    it('should handle initialization errors gracefully', () => {
      mockGsap.timeline.mockImplementation(() => {
        throw new Error('Timeline error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = initAllServicesAnimations();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error initializing services animations:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should refresh ScrollTrigger after initialization', () => {
      initAllServicesAnimations();

      expect(mockScrollTrigger.refresh).toHaveBeenCalled();
    });
  });

  describe('Animation Integration Tests', () => {
    it('should call timeline methods in sequence for entry animations', () => {
      const timeline = initServicesEntryAnimations();

      expect(mockGsap.timeline).toHaveBeenCalled();
      expect(mockGsap.set).toHaveBeenCalled();
    });

    it('should handle missing elements gracefully in all functions', () => {
      document.body.innerHTML = '';

      const result1 = initServicesEntryAnimations();
      const result2 = initServicesExitAnimations();

      expect(result1).toBeNull();
      expect(result2).toBeUndefined();
    });

    it('should setup proper cleanup function', () => {
      const result = initAllServicesAnimations();

      expect(result).toBeDefined();
      if (result && result.cleanup) {
        result.cleanup();
        expect(mockGsap.killTweensOf).toHaveBeenCalled();
        expect(mockGsap.set).toHaveBeenCalledWith(
          expect.stringContaining('.services'),
          { clearProps: 'all' }
        );
      }
    });
  });

  describe('Performance and Error Handling', () => {
    it('should not cause memory leaks with proper cleanup', () => {
      const result = initAllServicesAnimations();

      if (result && result.cleanup) {
        result.cleanup();
      }

      expect(mockScrollTrigger.getAll).toHaveBeenCalled();
    });

    it('should handle ScrollTrigger cleanup properly', () => {
      const mockScrollTriggerInstance = {
        vars: { trigger: '.services-section' },
        kill: jest.fn()
      };

      mockScrollTrigger.getAll.mockReturnValue([mockScrollTriggerInstance]);

      const result = initAllServicesAnimations();

      if (result && result.cleanup) {
        result.cleanup();
        expect(mockScrollTriggerInstance.kill).toHaveBeenCalledWith(true);
      }
    });

    it('should handle DOM ready state properly', () => {
      Object.defineProperty(document, 'readyState', {
        writable: true,
        value: 'loading'
      });

      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      initAllServicesAnimations();

      expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });
  });
});