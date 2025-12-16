/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Services } from './services';

// Mock GSAP animations
jest.mock('@/components/gsap/AnimationsServices', () => ({
  initAllServicesAnimations: jest.fn(() => ({
    entryTimeline: {},
    cleanup: jest.fn(),
  })),
}));

// Mock ScrollTrigger
jest.mock('@/lib/gsap', () => ({
  ScrollTrigger: {
    refresh: jest.fn(),
  },
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
        data-testid="service-icon"
      />
    );
  };
});

describe('Services Component', () => {
  let mockInitAllServicesAnimations: jest.Mock;
  let mockCleanup: jest.Mock;

  beforeEach(() => {
    mockCleanup = jest.fn();
    mockInitAllServicesAnimations = require('@/components/gsap/AnimationsServices').initAllServicesAnimations;
    mockInitAllServicesAnimations.mockReturnValue({
      entryTimeline: {},
      cleanup: mockCleanup,
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without errors', () => {
      render(<Services />);
      expect(screen.getByText('Nuestros Servicios Especializados')).toBeInTheDocument();
    });

    it('should render the main section with correct classes', () => {
      const { container } = render(<Services />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('services-section', 'bg-muted/30');
    });

    it('should display the main title and description', () => {
      render(<Services />);
      expect(screen.getByText('Nuestros Servicios Especializados')).toBeInTheDocument();
      expect(screen.getByText(/Ofrecemos una amplia gama de servicios/)).toBeInTheDocument();
    });

    it('should render all six service cards', () => {
      render(<Services />);

      // Check for service titles
      expect(screen.getByText('Servicios SRI')).toBeInTheDocument();
      expect(screen.getByText('Asesoría Legal')).toBeInTheDocument();
      expect(screen.getByText('Trámites Notariales')).toBeInTheDocument();
      expect(screen.getByText('Constitución de Empresas')).toBeInTheDocument();
      expect(screen.getByText('Trámites Municipales')).toBeInTheDocument();
      expect(screen.getByText('Trámites IESS')).toBeInTheDocument();
    });

    it('should render service descriptions', () => {
      render(<Services />);

      expect(screen.getByText(/Declaraciones de impuestos, obtención de RUC/)).toBeInTheDocument();
      expect(screen.getByText(/Servicios legales completos con abogados/)).toBeInTheDocument();
      expect(screen.getByText(/Gestión de documentos notariales/)).toBeInTheDocument();
    });

    it('should render service features for each card', () => {
      render(<Services />);

      // SRI features
      expect(screen.getByText('Declaración IVA')).toBeInTheDocument();
      expect(screen.getByText('Declaración Renta')).toBeInTheDocument();
      expect(screen.getByText('Certificados SRI')).toBeInTheDocument();

      // Legal features
      expect(screen.getByText('Contratos')).toBeInTheDocument();
      expect(screen.getByText('Litigios')).toBeInTheDocument();
      expect(screen.getByText('Consultoría Legal')).toBeInTheDocument();
    });

    it('should display service icons', () => {
      render(<Services />);
      const icons = screen.getAllByTestId('service-icon');
      expect(icons).toHaveLength(6);
    });

    it('should render card action buttons', () => {
      render(<Services />);
      const detailButtons = screen.getAllByText('Ver más detalles');
      expect(detailButtons).toHaveLength(6);
    });

    it('should render the main action button', () => {
      render(<Services />);
      expect(screen.getByRole('button', { name: /ver todos los servicios/i })).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct classes for GSAP animations', () => {
      render(<Services />);

      // Title
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('services-title');

      // Description
      const description = screen.getByText(/Ofrecemos una amplia gama de servicios/);
      expect(description).toHaveClass('services-description');

      // Cards
      const cards = document.querySelectorAll('.services-card');
      expect(cards).toHaveLength(6);
      cards.forEach(card => {
        expect(card).toHaveClass('services-card');
      });

      // Main button
      const mainButton = screen.getByRole('button', { name: /ver todos los servicios/i });
      expect(mainButton).toHaveClass('services-main-button');
    });

    it('should have services-content classes on card content', () => {
      render(<Services />);
      const contents = document.querySelectorAll('.services-content');
      expect(contents).toHaveLength(6);
    });

    it('should have services-icon classes on service icons', () => {
      render(<Services />);
      const icons = document.querySelectorAll('.services-icon');
      expect(icons).toHaveLength(6);
    });

    it('should have services-features classes on feature lists', () => {
      render(<Services />);
      const featureLists = document.querySelectorAll('.services-features');
      expect(featureLists).toHaveLength(6);
    });

    it('should have services-button classes on card buttons', () => {
      render(<Services />);
      const cardButtons = document.querySelectorAll('.services-button');
      expect(cardButtons).toHaveLength(6);
    });
  });

  describe('GSAP Integration', () => {
    it('should call initAllServicesAnimations on mount', async () => {
      render(<Services />);

      // Wait for the setTimeout in the component (100ms delay)
      await waitFor(() => {
        expect(mockInitAllServicesAnimations).toHaveBeenCalledTimes(1);
      }, { timeout: 200 });
    });

    it('should call cleanup function on unmount', async () => {
      const { unmount } = render(<Services />);

      // Wait for the initialization to complete first
      await waitFor(() => {
        expect(mockInitAllServicesAnimations).toHaveBeenCalledTimes(1);
      }, { timeout: 200 });

      unmount();
      expect(mockCleanup).toHaveBeenCalledTimes(1);
    });

    it('should handle missing cleanup function gracefully', () => {
      mockInitAllServicesAnimations.mockReturnValue(null);

      const { unmount } = render(<Services />);

      // Should not throw error even without cleanup
      expect(() => unmount()).not.toThrow();
    });

    it('should handle animations that return different cleanup structure', () => {
      mockInitAllServicesAnimations.mockReturnValue({
        entryTimeline: {},
        // Missing cleanup property
      });

      const { unmount } = render(<Services />);

      expect(() => unmount()).not.toThrow();
    });

    it('should call ScrollTrigger.refresh on unmount', async () => {
      const { ScrollTrigger } = require('@/lib/gsap');
      const { unmount } = render(<Services />);

      unmount();

      await waitFor(() => {
        expect(ScrollTrigger.refresh).toHaveBeenCalled();
      });
    });
  });

  describe('Interactive Elements', () => {
    it('should handle card button clicks', async () => {
      const user = userEvent.setup();
      render(<Services />);

      const cardButtons = screen.getAllByText('Ver más detalles');

      await user.click(cardButtons[0]);

      // Button should be clickable (no error thrown)
      expect(cardButtons[0]).toBeInTheDocument();
    });

    it('should handle main button click', async () => {
      const user = userEvent.setup();
      render(<Services />);

      const mainButton = screen.getByRole('button', { name: /ver todos los servicios/i });

      await user.click(mainButton);

      // Button should be clickable (no error thrown)
      expect(mainButton).toBeInTheDocument();
    });

    it('should have correct button variants', () => {
      render(<Services />);

      const cardButtons = screen.getAllByText('Ver más detalles');
      cardButtons.forEach(button => {
        expect(button).toHaveClass('services-button');
      });

      const mainButton = screen.getByRole('button', { name: /ver todos los servicios/i });
      expect(mainButton).toHaveClass('services-main-button');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Services />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();

      const serviceHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(serviceHeadings).toHaveLength(6);
    });

    it('should have alt text on service icons', () => {
      render(<Services />);

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('should have accessible buttons', () => {
      render(<Services />);

      const allButtons = screen.getAllByRole('button');
      allButtons.forEach(button => {
        expect(button).toBeEnabled();
      });
    });

    it('should have proper semantic structure', () => {
      const { container } = render(<Services />);

      const section = container.querySelector('section');
      expect(section?.tagName).toBe('SECTION');
      expect(section).toHaveAttribute('id', 'servicios');
    });
  });

  describe('Layout and Responsive Elements', () => {
    it('should have grid layout classes', () => {
      const { container } = render(<Services />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid', 'gap-6', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should have responsive container layout', () => {
      const { container } = render(<Services />);

      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toHaveClass('container', 'mx-auto');
    });

    it('should have proper spacing classes', () => {
      const { container } = render(<Services />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-20', 'lg:py-32');
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct service titles', () => {
      render(<Services />);

      const expectedTitles = [
        'Servicios SRI',
        'Asesoría Legal',
        'Trámites Notariales',
        'Constitución de Empresas',
        'Trámites Municipales',
        'Trámites IESS'
      ];

      expectedTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('should display correct feature counts per service', () => {
      render(<Services />);

      const featureLists = document.querySelectorAll('.services-features');
      featureLists.forEach(list => {
        const features = list.querySelectorAll('li');
        expect(features).toHaveLength(3); // Each service has 3 features
      });
    });

    it('should have correct image paths', () => {
      render(<Services />);

      const images = screen.getAllByTestId('service-icon');
      const expectedPaths = [
        './img-logos-service/SRI.png',
        './img-logos-service/judicatura.png',
        './img-logos-service/notaria.png',
        './img-logos-service/empresas.png',
        './img-logos-service/municipios.png',
        './img-logos-service/IESS.png'
      ];

      images.forEach((img, index) => {
        expect(img).toHaveAttribute('src', expectedPaths[index]);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle animation initialization errors gracefully', () => {
      mockInitAllServicesAnimations.mockImplementation(() => {
        throw new Error('Animation error');
      });

      // Mock console.error to prevent noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { container } = render(<Services />);

      // Component should still render even if animations fail
      expect(container.querySelector('.services-section')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should handle missing animation result', () => {
      mockInitAllServicesAnimations.mockReturnValue(undefined);

      const { unmount } = render(<Services />);

      expect(() => unmount()).not.toThrow();
    });
  });
});

// Performance tests
describe('Services Component Performance', () => {
  let performanceMockInitAllServicesAnimations: jest.Mock;

  beforeEach(() => {
    const mockCleanup = jest.fn();
    performanceMockInitAllServicesAnimations = jest.fn(() => ({
      entryTimeline: {},
      cleanup: mockCleanup,
    }));

    jest.doMock('@/components/gsap/AnimationsServices', () => ({
      initAllServicesAnimations: performanceMockInitAllServicesAnimations,
    }));
  });

  it('should not re-initialize animations on re-render', () => {
    const { rerender } = render(<Services />);

    // Clear the mock to reset call count
    performanceMockInitAllServicesAnimations.mockClear();

    rerender(<Services />);

    // Should not call animations again on rerender (useLayoutEffect with empty deps)
    expect(performanceMockInitAllServicesAnimations).toHaveBeenCalledTimes(0);
  });
});