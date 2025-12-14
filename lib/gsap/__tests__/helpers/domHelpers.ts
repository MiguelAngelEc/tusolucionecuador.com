/**
 * DOM Helper utilities for GSAP animation testing
 * Provides functions to create, manipulate and verify DOM elements
 * in a controlled testing environment
 */

/**
 * Creates a complete hero section DOM structure for testing
 */
export function createHeroDOM(): HTMLElement {
  const heroSection = document.createElement('section');
  heroSection.className = 'hero-section relative overflow-hidden bg-background hero-gradient';

  heroSection.innerHTML = `
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex flex-col-reverse gap-12 lg:grid lg:grid-cols-2 lg:gap-16">
        <!-- Left Content -->
        <div class="flex flex-col justify-center space-y-8 p-6 lg:p-10">
          <div class="hero-badge hero-element-hidden inline-flex items-center gap-2 self-start rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-violet-900"></span>
            </span>
            Servicios profesionales certificados
          </div>

          <div class="space-y-4">
            <h1 class="hero-title hero-element-hidden text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
              Simplificamos tus trámites en
              <span class="inline-block">
                <span class="typewriter-letter hero-element-hidden text-yellow-400">E</span>
                <span class="typewriter-letter hero-element-hidden text-yellow-400">c</span>
                <span class="typewriter-letter hero-element-hidden text-yellow-400">u</span>
              </span>
              <span class="inline-block">
                <span class="typewriter-letter hero-element-hidden text-blue-800">a</span>
                <span class="typewriter-letter hero-element-hidden text-blue-800">d</span>
              </span>
              <span class="inline-block">
                <span class="typewriter-letter hero-element-hidden text-red-600">o</span>
                <span class="typewriter-letter hero-element-hidden text-red-600">r</span>
              </span>
            </h1>
            <p class="hero-description hero-element-hidden text-pretty text-lg text-muted-foreground lg:text-xl">
              Expertos en SRI, servicios tributarios, legales y todos los trámites oficiales. Ahorra tiempo y evita
              complicaciones con nuestro equipo profesional.
            </p>
          </div>

          <div class="space-y-3">
            <div class="hero-check hero-element-hidden flex items-center gap-3">
              <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-foreground">Procesamiento rápido y seguro</span>
            </div>
            <div class="hero-check hero-element-hidden flex items-center gap-3">
              <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-foreground">Asesoría personalizada 24/7</span>
            </div>
            <div class="hero-check hero-element-hidden flex items-center gap-3">
              <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-foreground">Precios transparentes sin sorpresas</span>
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row hero-button-wrapper z-50">
            <button class="hero-button-primary hero-element-hidden">
              Comenzar Ahora
              <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button class="hero-button-secondary hero-element-hidden z-50">
              Hablar con un Asesor
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-6 pt-4 lg:gap-8">
            <div class="hero-stat hero-element-hidden">
              <div class="text-3xl font-bold text-foreground">10K+</div>
              <div class="text-sm text-muted-foreground">Clientes satisfechos</div>
            </div>
            <div class="h-12 w-px bg-border"></div>
            <div class="hero-stat hero-element-hidden">
              <div class="text-3xl font-bold text-foreground">98%</div>
              <div class="text-sm text-muted-foreground">Tasa de éxito</div>
            </div>
            <div class="h-12 w-px bg-border"></div>
            <div class="hero-stat hero-element-hidden">
              <div class="text-3xl font-bold text-foreground">24h</div>
              <div class="text-sm text-muted-foreground">Tiempo promedio</div>
            </div>
          </div>
        </div>

        <!-- Right Content - Visual Element -->
        <div class="relative flex items-center justify-center bg-background py-8 lg:py-0">
          <img src="/img-leo.png" alt="Hero" width="550" height="550" class="max-w-full h-auto mt-4 hero-image" />
        </div>
      </div>
    </div>
  `;

  return heroSection;
}

/**
 * Appends hero DOM to document body and returns cleanup function
 */
export function mountHeroDOM(): () => void {
  const heroElement = createHeroDOM();
  document.body.appendChild(heroElement);

  return () => {
    if (heroElement.parentNode) {
      heroElement.parentNode.removeChild(heroElement);
    }
  };
}

/**
 * Verifies that all expected hero elements exist in the DOM
 */
export function verifyHeroElementsExist(): {
  allExist: boolean;
  missing: string[];
  existing: string[];
} {
  const expectedSelectors = [
    '.hero-badge',
    '.hero-title',
    '.hero-description',
    '.hero-check',
    '.hero-button-primary',
    '.hero-button-secondary',
    '.hero-stat',
    '.hero-image',
    '.hero-button-wrapper',
    '.hero-section',
    '.typewriter-letter'
  ];

  const missing: string[] = [];
  const existing: string[] = [];

  expectedSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      missing.push(selector);
    } else {
      existing.push(selector);
    }
  });

  return {
    allExist: missing.length === 0,
    missing,
    existing
  };
}

/**
 * Gets the current visual state of an element
 */
export function getElementVisualState(selector: string): {
  opacity: number;
  transform: string;
  display: string;
  visibility: string;
  hasHiddenClass: boolean;
} {
  const element = document.querySelector(selector) as HTMLElement;

  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  const computedStyle = getComputedStyle(element);

  return {
    opacity: parseFloat(element.style.opacity || computedStyle.opacity || '1'),
    transform: element.style.transform || computedStyle.transform || 'none',
    display: element.style.display || computedStyle.display || '',
    visibility: element.style.visibility || computedStyle.visibility || 'visible',
    hasHiddenClass: element.classList.contains('hero-element-hidden')
  };
}

/**
 * Checks if element is visually hidden
 */
export function isElementHidden(selector: string): boolean {
  try {
    const state = getElementVisualState(selector);
    return state.opacity === 0 ||
           state.display === 'none' ||
           state.visibility === 'hidden' ||
           state.hasHiddenClass;
  } catch {
    return true; // Element doesn't exist, so it's "hidden"
  }
}

/**
 * Checks if element is visually visible
 */
export function isElementVisible(selector: string): boolean {
  return !isElementHidden(selector);
}

/**
 * Gets count of elements matching selector
 */
export function getElementCount(selector: string): number {
  return document.querySelectorAll(selector).length;
}

/**
 * Simulates scroll to specific position
 */
export function simulateScroll(scrollTop: number): void {
  Object.defineProperty(window, 'pageYOffset', { value: scrollTop, writable: true });
  Object.defineProperty(window, 'scrollY', { value: scrollTop, writable: true });

  // Dispatch scroll event
  const scrollEvent = new Event('scroll', { bubbles: true });
  window.dispatchEvent(scrollEvent);
}

/**
 * Gets all elements with animation classes
 */
export function getAnimatedElements(): Element[] {
  const animatedSelectors = [
    '.hero-badge',
    '.hero-title',
    '.hero-description',
    '.hero-check',
    '.hero-button-primary',
    '.hero-button-secondary',
    '.hero-stat',
    '.typewriter-letter'
  ];

  return animatedSelectors.flatMap(selector =>
    Array.from(document.querySelectorAll(selector))
  );
}

/**
 * Verifies element has expected CSS class
 */
export function elementHasClass(selector: string, className: string): boolean {
  const element = document.querySelector(selector);
  return element ? element.classList.contains(className) : false;
}

/**
 * Adds event listener for animation events
 */
export function onAnimationEvent(
  element: Element,
  eventType: string,
  callback: (event: Event) => void
): () => void {
  element.addEventListener(eventType, callback);

  return () => {
    element.removeEventListener(eventType, callback);
  };
}

/**
 * Creates a minimal DOM structure for testing specific elements
 */
export function createMinimalTestDOM(selectors: string[]): HTMLElement {
  const container = document.createElement('div');
  container.className = 'test-container';

  selectors.forEach(selector => {
    const element = document.createElement('div');
    element.className = selector.replace('.', '');
    element.textContent = `Test element for ${selector}`;
    container.appendChild(element);
  });

  return container;
}

/**
 * Memory usage tracking helper
 */
export function getMemoryUsage(): { used: number; total: number } {
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize / 1024 / 1024, // MB
      total: memory.totalJSHeapSize / 1024 / 1024 // MB
    };
  }

  return { used: 0, total: 0 };
}

/**
 * Performance timing helper
 */
export function measureExecutionTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  return {
    result,
    time: end - start
  };
}