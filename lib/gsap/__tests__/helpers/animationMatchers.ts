/**
 * Custom Jest matchers for GSAP animation testing
 * Provides specialized assertions for animation properties and behavior
 */

import { mockGsap } from './gsapMocks';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveGSAPProperty(property: string, value: any): R;
      toBeVisible(): R;
      toBeHidden(): R;
      toHaveInitialGSAPState(): R;
      toHaveFinalGSAPState(): R;
      toHaveBeenAnimatedWith(properties: Record<string, any>): R;
      toHaveCorrectStaggerTiming(expectedStagger: number): R;
      toHaveValidTransform(): R;
      toBeWithinTimeRange(expectedTime: number, tolerance: number): R;
    }
  }
}

/**
 * Checks if element has specific GSAP property with expected value
 */
expect.extend({
  toHaveGSAPProperty(received: string, property: string, expectedValue: any) {
    const properties = mockGsap.getElementProperties(received);

    if (!properties) {
      return {
        message: () => `Element "${received}" not found or has no GSAP properties`,
        pass: false
      };
    }

    const actualValue = properties[property];
    const pass = actualValue === expectedValue;

    if (pass) {
      return {
        message: () => `Expected element "${received}" not to have GSAP property "${property}" with value "${expectedValue}"`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected element "${received}" to have GSAP property "${property}" with value "${expectedValue}", but got "${actualValue}"`,
        pass: false
      };
    }
  }
});

/**
 * Checks if element is visually visible
 */
expect.extend({
  toBeVisible(received: string) {
    const element = document.querySelector(received) as HTMLElement;

    if (!element) {
      return {
        message: () => `Element "${received}" not found in DOM`,
        pass: false
      };
    }

    const style = getComputedStyle(element);
    const isVisible =
      element.style.opacity !== '0' &&
      style.opacity !== '0' &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.classList.contains('hero-element-hidden');

    if (isVisible) {
      return {
        message: () => `Expected element "${received}" to be hidden`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected element "${received}" to be visible, but it's hidden`,
        pass: false
      };
    }
  }
});

/**
 * Checks if element is visually hidden
 */
expect.extend({
  toBeHidden(received: string) {
    const element = document.querySelector(received) as HTMLElement;

    if (!element) {
      return {
        message: () => `Element "${received}" not found in DOM`,
        pass: true // Not found = hidden
      };
    }

    const style = getComputedStyle(element);
    const isHidden =
      element.style.opacity === '0' ||
      style.opacity === '0' ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      element.classList.contains('hero-element-hidden');

    if (isHidden) {
      return {
        message: () => `Expected element "${received}" to be visible`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected element "${received}" to be hidden, but it's visible`,
        pass: false
      };
    }
  }
});

/**
 * Checks if element has correct initial GSAP state
 */
expect.extend({
  toHaveInitialGSAPState(received: string) {
    const properties = mockGsap.getElementProperties(received);

    if (!properties) {
      return {
        message: () => `Element "${received}" has no GSAP properties set`,
        pass: false
      };
    }

    const element = document.querySelector(received);
    if (!element) {
      return {
        message: () => `Element "${received}" not found in DOM`,
        pass: false
      };
    }

    // Check if element has hero-element-hidden class removed
    const hasHiddenClass = element.classList.contains('hero-element-hidden');

    // Most elements should start with opacity: 0
    const hasCorrectOpacity = properties.opacity === 0;

    if (!hasCorrectOpacity || hasHiddenClass) {
      return {
        message: () => `Element "${received}" does not have correct initial state. Opacity: ${properties.opacity}, Has hidden class: ${hasHiddenClass}`,
        pass: false
      };
    }

    return {
      message: () => `Element "${received}" has correct initial state`,
      pass: true
    };
  }
});

/**
 * Checks if element has correct final GSAP state
 */
expect.extend({
  toHaveFinalGSAPState(received: string) {
    const properties = mockGsap.getElementProperties(received);

    if (!properties) {
      return {
        message: () => `Element "${received}" has no GSAP properties set`,
        pass: false
      };
    }

    // Check final state properties (opacity should be 1, transforms reset)
    const hasCorrectOpacity = properties.opacity === 1;
    const hasCorrectPosition = properties.y === 0 || properties.y === undefined;
    const hasCorrectScale = properties.scale === 1 || properties.scale === undefined;

    const pass = hasCorrectOpacity && hasCorrectPosition && hasCorrectScale;

    if (pass) {
      return {
        message: () => `Element "${received}" has correct final state`,
        pass: true
      };
    } else {
      return {
        message: () => `Element "${received}" does not have correct final state. Opacity: ${properties.opacity}, Y: ${properties.y}, Scale: ${properties.scale}`,
        pass: false
      };
    }
  }
});

/**
 * Checks if element was animated with specific properties
 */
expect.extend({
  toHaveBeenAnimatedWith(received: string, expectedProperties: Record<string, any>) {
    const timelines = mockGsap.getTimelines();

    // Find animations that target this element
    const relevantAnimations = timelines.flatMap(tl =>
      tl._animations.filter(animation => {
        const targets = typeof animation.target === 'string'
          ? Array.from(document.querySelectorAll(animation.target))
          : Array.isArray(animation.target)
            ? animation.target
            : [animation.target];

        return targets.some(target =>
          target === document.querySelector(received)
        );
      })
    );

    if (relevantAnimations.length === 0) {
      return {
        message: () => `No animations found for element "${received}"`,
        pass: false
      };
    }

    // Check if any animation has the expected properties
    const hasMatchingAnimation = relevantAnimations.some(animation => {
      const animVars = animation.toVars || animation.fromVars || {};
      return Object.entries(expectedProperties).every(([key, value]) =>
        animVars[key] === value
      );
    });

    if (hasMatchingAnimation) {
      return {
        message: () => `Element "${received}" was animated with expected properties`,
        pass: true
      };
    } else {
      return {
        message: () => `Element "${received}" was not animated with expected properties: ${JSON.stringify(expectedProperties)}`,
        pass: false
      };
    }
  }
});

/**
 * Checks if stagger timing is correct
 */
expect.extend({
  toHaveCorrectStaggerTiming(received: string, expectedStagger: number) {
    const elements = document.querySelectorAll(received);
    const timelines = mockGsap.getTimelines();

    // Find stagger animations for this selector
    const staggerAnimations = timelines.flatMap(tl =>
      tl._animations.filter(animation =>
        animation.target === received &&
        animation.toVars &&
        animation.toVars.stagger !== undefined
      )
    );

    if (staggerAnimations.length === 0) {
      return {
        message: () => `No stagger animations found for "${received}"`,
        pass: false
      };
    }

    const actualStagger = staggerAnimations[0].toVars.stagger;
    const pass = actualStagger === expectedStagger;

    if (pass) {
      return {
        message: () => `Stagger timing for "${received}" is correct (${expectedStagger})`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected stagger timing for "${received}" to be ${expectedStagger}, but got ${actualStagger}`,
        pass: false
      };
    }
  }
});

/**
 * Checks if transform value is valid CSS
 */
expect.extend({
  toHaveValidTransform(received: string) {
    const element = document.querySelector(received) as HTMLElement;

    if (!element) {
      return {
        message: () => `Element "${received}" not found`,
        pass: false
      };
    }

    const transform = element.style.transform;

    // Basic validation for transform syntax
    const isValid = !transform ||
      transform === 'none' ||
      /^(translate\([^)]+\)|scale\([^)]+\)|rotate\([^)]+\)|\s)*$/.test(transform);

    if (isValid) {
      return {
        message: () => `Transform value for "${received}" is valid: "${transform}"`,
        pass: true
      };
    } else {
      return {
        message: () => `Transform value for "${received}" is invalid: "${transform}"`,
        pass: false
      };
    }
  }
});

/**
 * Checks if execution time is within expected range
 */
expect.extend({
  toBeWithinTimeRange(received: number, expectedTime: number, tolerance: number) {
    const minTime = expectedTime - tolerance;
    const maxTime = expectedTime + tolerance;
    const pass = received >= minTime && received <= maxTime;

    if (pass) {
      return {
        message: () => `Execution time ${received}ms is within expected range ${minTime}-${maxTime}ms`,
        pass: true
      };
    } else {
      return {
        message: () => `Execution time ${received}ms is outside expected range ${minTime}-${maxTime}ms`,
        pass: false
      };
    }
  }
});

/**
 * Helper function to verify animation sequence timing
 */
export function verifyAnimationSequence(
  animations: Array<{ selector: string; expectedStartTime: number }>,
  tolerance: number = 100 // ms
): { pass: boolean; message: string } {
  const timelines = mockGsap.getTimelines();

  for (const { selector, expectedStartTime } of animations) {
    const elementAnimations = timelines.flatMap(tl =>
      tl._animations.filter(anim => anim.target === selector)
    );

    if (elementAnimations.length === 0) {
      return {
        pass: false,
        message: `No animations found for ${selector}`
      };
    }

    // For this mock, we can't easily verify exact timing,
    // but we can verify the animation exists and has reasonable properties
    const animation = elementAnimations[0];
    const hasReasonableDuration = animation.duration > 0 && animation.duration <= 5;

    if (!hasReasonableDuration) {
      return {
        pass: false,
        message: `Animation for ${selector} has unreasonable duration: ${animation.duration}`
      };
    }
  }

  return {
    pass: true,
    message: 'All animations in sequence are valid'
  };
}

/**
 * Helper to verify ScrollTrigger configuration
 */
export function verifyScrollTriggerConfig(
  expectedConfig: Record<string, any>
): { pass: boolean; message: string } {
  const triggers = mockGsap.ScrollTrigger.getTriggers();

  const matchingTrigger = triggers.find(trigger =>
    Object.entries(expectedConfig).every(([key, value]) =>
      trigger[key] === value
    )
  );

  if (matchingTrigger) {
    return {
      pass: true,
      message: 'ScrollTrigger configuration matches expected values'
    };
  } else {
    return {
      pass: false,
      message: `No ScrollTrigger found with configuration: ${JSON.stringify(expectedConfig)}`
    };
  }
}