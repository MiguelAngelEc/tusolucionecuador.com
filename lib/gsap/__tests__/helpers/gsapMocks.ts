/**
 * GSAP Mocks for Testing
 * Provides functional mocks for GSAP and ScrollTrigger that simulate
 * real behavior while being controllable and inspectable in tests
 */

interface GSAPElement {
  element: Element;
  properties: Record<string, any>;
  initialProperties: Record<string, any>;
}

interface MockTimeline {
  duration(): number;
  progress(): number;
  progress(value: number): MockTimeline;
  play(): MockTimeline;
  pause(): MockTimeline;
  reverse(): MockTimeline;
  restart(): MockTimeline;
  kill(): void;
  totalTime(): number;
  totalTime(value: number): MockTimeline;
  isActive(): boolean;
  paused(): boolean;
  paused(value: boolean): MockTimeline;
  fromTo(target: any, fromVars: any, toVars: any, position?: any): MockTimeline;
  to(target: any, vars: any, position?: any): MockTimeline;
  set(target: any, vars: any): MockTimeline;
  call(callback: Function, params?: any[], scope?: any): MockTimeline;
  _animations: Array<{
    target: any;
    fromVars?: any;
    toVars: any;
    position: number;
    duration: number;
    delay: number;
    ease: string;
  }>;
}

class MockGSAPInstance {
  private elements: Map<Element, GSAPElement> = new Map();
  private timelines: MockTimeline[] = [];
  private killedTargets: Set<any> = new Set();

  /**
   * Mock gsap.set() - Sets initial properties on elements
   */
  set = jest.fn((targets: any, vars: any): any => {
    const elements = this.normalizeTargets(targets);

    elements.forEach(element => {
      if (!this.elements.has(element)) {
        this.elements.set(element, {
          element,
          properties: {},
          initialProperties: {}
        });
      }

      const gsapElement = this.elements.get(element)!;

      // Handle className removal
      if (vars.className && vars.className.startsWith('-=')) {
        const classToRemove = vars.className.replace('-=', '');
        element.classList.remove(classToRemove);
      }

      // Set properties
      Object.entries(vars).forEach(([key, value]) => {
        if (key !== 'className') {
          gsapElement.properties[key] = value;

          // Apply visual properties to element style
          if (key === 'opacity') {
            (element as HTMLElement).style.opacity = String(value);
          }
          if (key === 'x') {
            const y = gsapElement.properties.y || 0;
            (element as HTMLElement).style.transform = `translate(${value}px, ${y}px)`;
          }
          if (key === 'y') {
            const x = gsapElement.properties.x || 0;
            (element as HTMLElement).style.transform = `translate(${x}px, ${value}px)`;
          }
          if (key === 'scale') {
            (element as HTMLElement).style.transform += ` scale(${value})`;
          }
        }
      });
    });

    return this;
  });

  /**
   * Mock gsap.to() - Animates elements to target values
   */
  to = jest.fn((targets: any, vars: any): any => {
    const elements = this.normalizeTargets(targets);

    elements.forEach(element => {
      if (!this.elements.has(element)) {
        this.elements.set(element, {
          element,
          properties: {},
          initialProperties: {}
        });
      }

      const gsapElement = this.elements.get(element)!;

      // Simulate animation by immediately setting final values
      setTimeout(() => {
        Object.entries(vars).forEach(([key, value]) => {
          if (key !== 'duration' && key !== 'ease' && key !== 'delay' && key !== 'stagger' && key !== 'repeat' && key !== 'yoyo') {
            gsapElement.properties[key] = value;

            // Apply to element
            if (key === 'opacity') {
              (element as HTMLElement).style.opacity = String(value);
            }
            if (key === 'x') {
              const y = gsapElement.properties.y || 0;
              (element as HTMLElement).style.transform = `translate(${value}px, ${y}px)`;
            }
            if (key === 'y') {
              const x = gsapElement.properties.x || 0;
              (element as HTMLElement).style.transform = `translate(${x}px, ${value}px)`;
            }
            if (key === 'scale') {
              (element as HTMLElement).style.transform += ` scale(${value})`;
            }
          }
        });
      }, vars.delay || 0);
    });

    return this;
  });

  /**
   * Mock gsap.fromTo() - Animates elements from initial to target values
   */
  fromTo = jest.fn((targets: any, fromVars: any, toVars: any): any => {
    // First set the from values
    this.set(targets, fromVars);
    // Then animate to target values
    return this.to(targets, toVars);
  });

  /**
   * Mock gsap.killTweensOf() - Kills animations on targets
   */
  killTweensOf = jest.fn((targets: any): void => {
    const elements = this.normalizeTargets(targets);
    elements.forEach(element => {
      this.killedTargets.add(element);
    });
  });

  /**
   * Mock gsap.timeline() - Creates a new timeline
   */
  timeline = jest.fn((vars: any = {}): MockTimeline => {
    const timeline: MockTimeline = {
      _animations: [],

      duration: jest.fn(() => 2.5), // Default total duration
      progress: jest.fn((value?: number) => {
        if (value !== undefined) {
          return timeline;
        }
        return 0;
      }),
      play: jest.fn(() => timeline),
      pause: jest.fn(() => timeline),
      reverse: jest.fn(() => timeline),
      restart: jest.fn(() => timeline),
      kill: jest.fn(() => {}),
      totalTime: jest.fn((value?: number) => {
        if (value !== undefined) {
          return timeline;
        }
        return 2500; // 2.5 seconds in milliseconds
      }),
      isActive: jest.fn(() => false),
      paused: jest.fn((value?: boolean) => {
        if (value !== undefined) {
          return timeline;
        }
        return vars.paused || false;
      }),

      fromTo: jest.fn((target: any, fromVars: any, toVars: any, position?: any) => {
        timeline._animations.push({
          target,
          fromVars,
          toVars,
          position: position || 0,
          duration: toVars.duration || 1,
          delay: toVars.delay || 0,
          ease: toVars.ease || 'power3.out'
        });

        // Execute the animation
        this.fromTo(target, fromVars, toVars);
        return timeline;
      }),

      to: jest.fn((target: any, vars: any, position?: any) => {
        timeline._animations.push({
          target,
          toVars: vars,
          position: position || 0,
          duration: vars.duration || 1,
          delay: vars.delay || 0,
          ease: vars.ease || 'power3.out'
        });

        // Execute the animation
        this.to(target, vars);
        return timeline;
      }),

      set: jest.fn((target: any, vars: any) => {
        timeline._animations.push({
          target,
          toVars: vars,
          position: 0,
          duration: 0,
          delay: 0,
          ease: 'none'
        });

        this.set(target, vars);
        return timeline;
      }),

      call: jest.fn((callback: Function, params?: any[], scope?: any) => {
        // Execute callback immediately for testing
        setTimeout(() => {
          callback.apply(scope, params || []);
        }, 0);
        return timeline;
      })
    };

    this.timelines.push(timeline);
    return timeline;
  });

  /**
   * Helper to normalize targets (string selectors or elements)
   */
  private normalizeTargets(targets: any): Element[] {
    if (typeof targets === 'string') {
      return Array.from(document.querySelectorAll(targets));
    }
    if (targets instanceof Element) {
      return [targets];
    }
    if (Array.isArray(targets)) {
      return targets;
    }
    return [];
  }

  /**
   * Test helper methods
   */
  getElementProperties(target: any): Record<string, any> | null {
    const elements = this.normalizeTargets(target);
    if (elements.length === 0) return null;
    return this.elements.get(elements[0])?.properties || null;
  }

  getTimelines(): MockTimeline[] {
    return this.timelines;
  }

  getKilledTargets(): Set<any> {
    return this.killedTargets;
  }

  reset(): void {
    this.elements.clear();
    this.timelines.length = 0;
    this.killedTargets.clear();
    jest.clearAllMocks();
  }
}

/**
 * Mock ScrollTrigger
 */
class MockScrollTrigger {
  private triggers: Array<{
    trigger: string;
    start: string;
    end: string;
    pin?: boolean;
    pinSpacing?: boolean;
    scrub?: number | boolean;
    invalidateOnRefresh?: boolean;
    anticipatePin?: number;
    onEnterBack?: Function;
    onLeaveBack?: Function;
    timeline?: any;
  }> = [];

  create = jest.fn((config: any) => {
    const trigger = {
      ...config,
      kill: jest.fn((clearProps: boolean = false) => {
        const index = this.triggers.findIndex(t => t === trigger);
        if (index !== -1) {
          this.triggers.splice(index, 1);
        }
      })
    };

    this.triggers.push(trigger);
    return trigger;
  });

  getAll = jest.fn(() => {
    return this.triggers.map(trigger => ({
      ...trigger,
      vars: trigger
    }));
  });

  refresh = jest.fn(() => {});

  getTriggers(): any[] {
    return this.triggers;
  }

  reset(): void {
    this.triggers.length = 0;
    jest.clearAllMocks();
  }
}

// Create instances
export const mockGsap = new MockGSAPInstance();
export const mockScrollTrigger = new MockScrollTrigger();

// Export the mock objects with the same interface as real GSAP
export const gsapMock = {
  ...mockGsap,
  ScrollTrigger: mockScrollTrigger
};

/**
 * Jest mock setup function
 */
export function setupGSAPMocks(): void {
  jest.doMock('@/lib/gsap', () => ({
    gsap: mockGsap,
    ScrollTrigger: mockScrollTrigger
  }));
}

/**
 * Reset all mocks
 */
export function resetGSAPMocks(): void {
  mockGsap.reset();
  mockScrollTrigger.reset();
}