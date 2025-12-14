import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

// Custom render function that can be extended with providers
const customRender = (ui: ReactElement, options?: RenderOptions): RenderResult => {
  // Wrapper component for providers (can be extended later)
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Mock GSAP animations helper
export const mockGSAPAnimations = () => {
  const mockCleanup = jest.fn();
  const mockTimeline = {};

  const mockInitAllHeroAnimations = jest.fn(() => ({
    timeline: mockTimeline,
    cleanup: mockCleanup,
  }));

  return {
    mockCleanup,
    mockTimeline,
    mockInitAllHeroAnimations,
  };
};

// Helper to mock ScrollTrigger
export const mockScrollTrigger = () => {
  const mockRefresh = jest.fn();
  const mockKill = jest.fn();
  const mockCreate = jest.fn();
  const mockGetAll = jest.fn(() => []);

  return {
    ScrollTrigger: {
      refresh: mockRefresh,
      create: mockCreate,
      getAll: mockGetAll,
    },
    mocks: {
      refresh: mockRefresh,
      kill: mockKill,
      create: mockCreate,
      getAll: mockGetAll,
    },
  };
};

// Helper to create a test environment with common mocks
export const setupTestEnvironment = () => {
  // Mock window.requestAnimationFrame
  global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
  global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  return {
    requestAnimationFrame: global.requestAnimationFrame,
    IntersectionObserver: global.IntersectionObserver,
    ResizeObserver: global.ResizeObserver,
  };
};

// Helper to wait for animations
export const waitForAnimation = (timeout = 100) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

// Helper to check if element has specific GSAP animation classes
export const hasAnimationClasses = (element: Element, classes: string[]) => {
  return classes.every((className) => element.classList.contains(className));
};

// Helper to find elements by GSAP animation class
export const getElementByAnimationClass = (container: Element, className: string) => {
  return container.querySelector(`.${className}`);
};

// Export everything including custom render
export * from '@testing-library/react';
export { customRender as render };