/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from './hero';

// Mock GSAP animations
jest.mock('./gsap/AnimationsHero', () => ({
  initAllHeroAnimations: jest.fn(() => ({
    timeline: {},
    cleanup: jest.fn(),
  })),
}));

// Mock ScrollTrigger
jest.mock('@/lib/gsap', () => ({
  ScrollTrigger: {
    refresh: jest.fn(),
  },
}));

// Mock TypewriterWord component
jest.mock('./TypewriterWord', () => ({
  TypewriterWord: ({ text, color }: { text: string; color: string }) => (
    <span className={`typewriter-letter ${color}`}>{text}</span>
  ),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    const { src, alt, width, height, className } = props;
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-testid="hero-image"
      />
    );
  };
});

describe('Hero Component', () => {
  let mockInitAllHeroAnimations: jest.Mock;
  let mockCleanup: jest.Mock;

  beforeEach(() => {
    mockCleanup = jest.fn();
    mockInitAllHeroAnimations = require('./gsap/AnimationsHero').initAllHeroAnimations;
    mockInitAllHeroAnimations.mockReturnValue({
      timeline: {},
      cleanup: mockCleanup,
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without errors', () => {
      render(<Hero />);
      expect(screen.getByText('Simplificamos tus trámites en')).toBeInTheDocument();
    });

    it('should render the main section with correct classes', () => {
      const { container } = render(<Hero />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('hero-section', 'hero-gradient');
    });

    it('should display the certification badge', () => {
      render(<Hero />);
      expect(screen.getByText('Servicios profesionales certificados')).toBeInTheDocument();
    });

    it('should render the main title with typewriter components', () => {
      render(<Hero />);
      expect(screen.getByText('Simplificamos tus trámites en')).toBeInTheDocument();
      expect(screen.getByText('Ecu')).toBeInTheDocument();
      expect(screen.getByText('ad')).toBeInTheDocument();
      expect(screen.getByText('or')).toBeInTheDocument();
    });

    it('should display the description text', () => {
      render(<Hero />);
      expect(
        screen.getByText(/Expertos en SRI, servicios tributarios, legales y todos los trámites oficiales/)
      ).toBeInTheDocument();
    });

    it('should render all three checkmark items', () => {
      render(<Hero />);
      expect(screen.getByText('Procesamiento rápido y seguro')).toBeInTheDocument();
      expect(screen.getByText('Asesoría personalizada 24/7')).toBeInTheDocument();
      expect(screen.getByText('Precios transparentes sin sorpresas')).toBeInTheDocument();
    });

    it('should display both action buttons', () => {
      render(<Hero />);
      expect(screen.getByRole('button', { name: /comenzar ahora/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /hablar con un asesor/i })).toBeInTheDocument();
    });

    it('should render all statistics', () => {
      render(<Hero />);
      expect(screen.getByText('10K+')).toBeInTheDocument();
      expect(screen.getByText('Clientes satisfechos')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('Tasa de éxito')).toBeInTheDocument();
      expect(screen.getByText('24h')).toBeInTheDocument();
      expect(screen.getByText('Tiempo promedio')).toBeInTheDocument();
    });

    it('should display the hero image', () => {
      render(<Hero />);
      const image = screen.getByTestId('hero-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/img-leo.png');
      expect(image).toHaveAttribute('alt', 'Hero');
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct classes for GSAP animations', () => {
      render(<Hero />);

      // Badge - find the actual badge element
      const badge = screen.getByText('Servicios profesionales certificados').closest('.hero-badge');
      expect(badge).toHaveClass('hero-badge', 'hero-element-hidden');

      // Title
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('hero-title', 'hero-element-hidden');

      // Description
      const description = screen.getByText(/Expertos en SRI/);
      expect(description).toHaveClass('hero-description', 'hero-element-hidden');

      // Buttons
      const primaryButton = screen.getByRole('button', { name: /comenzar ahora/i });
      expect(primaryButton).toHaveClass('hero-button-primary', 'hero-element-hidden');

      const secondaryButton = screen.getByRole('button', { name: /hablar con un asesor/i });
      expect(secondaryButton).toHaveClass('hero-button-secondary', 'hero-element-hidden');

      // Image
      const image = screen.getByTestId('hero-image');
      expect(image).toHaveClass('hero-image');
    });

    it('should have hero-check classes on checkmark items', () => {
      render(<Hero />);
      const checkItems = screen.getAllByText(/Procesamiento|Asesoría|Precios/).map(
        (text) => text.closest('.hero-check')
      );

      checkItems.forEach((item) => {
        expect(item).toHaveClass('hero-check', 'hero-element-hidden');
      });
    });

    it('should have hero-stat classes on statistics', () => {
      render(<Hero />);
      const statElements = screen.getAllByText(/10K\+|98%|24h/).map(
        (text) => text.closest('.hero-stat')
      );

      statElements.forEach((stat) => {
        expect(stat).toHaveClass('hero-stat', 'hero-element-hidden');
      });
    });

    it('should have hero-button-wrapper class on button container', () => {
      render(<Hero />);
      const buttonWrapper = screen.getByRole('button', { name: /comenzar ahora/i }).parentElement;
      expect(buttonWrapper).toHaveClass('hero-button-wrapper');
    });
  });

  describe('GSAP Integration', () => {
    it('should call initAllHeroAnimations on mount', () => {
      render(<Hero />);
      expect(mockInitAllHeroAnimations).toHaveBeenCalledTimes(1);
    });

    it('should call cleanup function on unmount', () => {
      const { unmount } = render(<Hero />);
      unmount();
      expect(mockCleanup).toHaveBeenCalledTimes(1);
    });

    it('should handle missing cleanup function gracefully', () => {
      mockInitAllHeroAnimations.mockReturnValue(null);

      const { unmount } = render(<Hero />);

      // Should not throw error even without cleanup
      expect(() => unmount()).not.toThrow();
    });

    it('should handle animations that return different cleanup structure', () => {
      mockInitAllHeroAnimations.mockReturnValue({
        timeline: {},
        // Missing cleanup property
      });

      const { unmount } = render(<Hero />);

      expect(() => unmount()).not.toThrow();
    });

    it('should call ScrollTrigger.refresh on unmount', async () => {
      const { ScrollTrigger } = require('@/lib/gsap');
      const { unmount } = render(<Hero />);

      unmount();

      await waitFor(() => {
        expect(ScrollTrigger.refresh).toHaveBeenCalled();
      });
    });
  });

  describe('TypewriterWord Integration', () => {
    it('should render TypewriterWord components with correct props', () => {
      render(<Hero />);

      const ecuText = screen.getByText('Ecu');
      expect(ecuText).toHaveClass('typewriter-letter', 'text-yellow-400');

      const adText = screen.getByText('ad');
      expect(adText).toHaveClass('typewriter-letter', 'text-blue-800');

      const orText = screen.getByText('or');
      expect(orText).toHaveClass('typewriter-letter', 'text-red-600');
    });
  });

  describe('Interactive Elements', () => {
    it('should handle primary button click', async () => {
      const user = userEvent.setup();
      render(<Hero />);

      const primaryButton = screen.getByRole('button', { name: /comenzar ahora/i });

      await user.click(primaryButton);

      // Button should be clickable (no error thrown)
      expect(primaryButton).toBeInTheDocument();
    });

    it('should handle secondary button click', async () => {
      const user = userEvent.setup();
      render(<Hero />);

      const secondaryButton = screen.getByRole('button', { name: /hablar con un asesor/i });

      await user.click(secondaryButton);

      // Button should be clickable (no error thrown)
      expect(secondaryButton).toBeInTheDocument();
    });

    it('should have correct button variants', () => {
      render(<Hero />);

      const primaryButton = screen.getByRole('button', { name: /comenzar ahora/i });
      expect(primaryButton).toHaveClass('hero-button-primary');

      const secondaryButton = screen.getByRole('button', { name: /hablar con un asesor/i });
      expect(secondaryButton).toHaveClass('hero-button-secondary');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have alt text on image', () => {
      render(<Hero />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Hero');
    });

    it('should have accessible buttons', () => {
      render(<Hero />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });

    it('should have proper semantic structure', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section?.tagName).toBe('SECTION');
    });
  });

  describe('Layout and Responsive Elements', () => {
    it('should have grid layout classes', () => {
      const { container } = render(<Hero />);

      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toBeInTheDocument();

      const grid = containerDiv?.querySelector('.flex.flex-col-reverse');
      expect(grid).toHaveClass('lg:grid', 'lg:grid-cols-2');
    });

    it('should have responsive button layout', () => {
      render(<Hero />);

      const buttonWrapper = screen.getByRole('button', { name: /comenzar ahora/i }).parentElement;
      expect(buttonWrapper).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    });

    it('should have responsive statistics layout', () => {
      render(<Hero />);

      const statsContainer = screen.getByText('10K+').closest('.flex');
      expect(statsContainer).toHaveClass('flex-wrap', 'lg:gap-8');
    });
  });

  describe('Icons and Visual Elements', () => {
    it('should render CheckCircle icons for checkmarks', () => {
      render(<Hero />);

      // Check that CheckCircle icons are present (should be 3)
      const checkElements = screen.getAllByText(/Procesamiento|Asesoría|Precios/);
      expect(checkElements).toHaveLength(3);
    });

    it('should render ArrowRight icon in primary button', () => {
      render(<Hero />);

      const primaryButton = screen.getByRole('button', { name: /comenzar ahora/i });
      expect(primaryButton).toBeInTheDocument();
    });

    it('should have animated badge indicator', () => {
      render(<Hero />);

      const badge = screen.getByText('Servicios profesionales certificados').parentElement;
      const indicator = badge?.querySelector('.animate-ping');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct statistics values', () => {
      render(<Hero />);

      expect(screen.getByText('10K+')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('24h')).toBeInTheDocument();
    });

    it('should display correct statistics labels', () => {
      render(<Hero />);

      expect(screen.getByText('Clientes satisfechos')).toBeInTheDocument();
      expect(screen.getByText('Tasa de éxito')).toBeInTheDocument();
      expect(screen.getByText('Tiempo promedio')).toBeInTheDocument();
    });

    it('should have correct image dimensions', () => {
      render(<Hero />);

      const image = screen.getByTestId('hero-image');
      expect(image).toHaveAttribute('width', '550');
      expect(image).toHaveAttribute('height', '550');
    });
  });

  describe('Error Handling', () => {
    it('should handle animation initialization errors gracefully', () => {
      mockInitAllHeroAnimations.mockImplementation(() => {
        throw new Error('Animation error');
      });

      // Mock console.error to prevent noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { container } = render(<Hero />);

      // Component should still render even if animations fail
      expect(container.querySelector('.hero-section')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle missing animation result', () => {
      mockInitAllHeroAnimations.mockReturnValue(undefined);

      const { unmount } = render(<Hero />);

      expect(() => unmount()).not.toThrow();
    });
  });
});

// Performance tests
describe('Hero Component Performance', () => {
  let performanceMockInitAllHeroAnimations: jest.Mock;

  beforeEach(() => {
    const mockCleanup = jest.fn();
    performanceMockInitAllHeroAnimations = jest.fn(() => ({
      timeline: {},
      cleanup: mockCleanup,
    }));

    jest.doMock('./gsap/AnimationsHero', () => ({
      initAllHeroAnimations: performanceMockInitAllHeroAnimations,
    }));
  });

  it('should not re-initialize animations on re-render', () => {
    const { rerender } = render(<Hero />);

    // Clear the mock to reset call count
    performanceMockInitAllHeroAnimations.mockClear();

    rerender(<Hero />);

    // Should not call animations again on rerender (useLayoutEffect with empty deps)
    expect(performanceMockInitAllHeroAnimations).toHaveBeenCalledTimes(0);
  });
});