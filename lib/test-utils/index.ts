// Export all test utilities from a single entry point
export * from './component-helpers';

// Common test matchers and utilities
export const testIds = {
  heroImage: 'hero-image',
  nextLink: 'next-link',
  nextImage: 'next-image',
} as const;

// Common selectors for testing
export const selectors = {
  hero: {
    section: '.hero-section',
    badge: '.hero-badge',
    title: '.hero-title',
    description: '.hero-description',
    check: '.hero-check',
    buttonPrimary: '.hero-button-primary',
    buttonSecondary: '.hero-button-secondary',
    buttonWrapper: '.hero-button-wrapper',
    stat: '.hero-stat',
    image: '.hero-image',
    typewriterLetter: '.typewriter-letter',
  },
} as const;

// Common test data
export const testData = {
  hero: {
    badgeText: 'Servicios profesionales certificados',
    titleText: 'Simplificamos tus trámites en',
    descriptionText: 'Expertos en SRI, servicios tributarios, legales y todos los trámites oficiales',
    checkItems: [
      'Procesamiento rápido y seguro',
      'Asesoría personalizada 24/7',
      'Precios transparentes sin sorpresas',
    ],
    buttons: {
      primary: 'Comenzar Ahora',
      secondary: 'Hablar con un Asesor',
    },
    stats: {
      clients: '10K+',
      successRate: '98%',
      averageTime: '24h',
      labels: {
        clients: 'Clientes satisfechos',
        successRate: 'Tasa de éxito',
        averageTime: 'Tiempo promedio',
      },
    },
    typewriterWords: [
      { text: 'Ecu', color: 'text-yellow-400' },
      { text: 'ad', color: 'text-blue-800' },
      { text: 'or', color: 'text-red-600' },
    ],
    imageSrc: '/img-leo.png',
    imageAlt: 'Hero',
  },
} as const;