'use client';

import { gsap, ScrollTrigger } from '@/lib/gsap';

// ========================================
// 🧹 CLEANUP FUNCTIONS
// ========================================

const cleanupServicesAnimations = () => {
  const elements = [
    '.services-section',
    '.services-title',
    '.services-description',
    '.services-card',
    '.services-icon',
    '.services-content',
    '.services-features',
    '.services-button',
    '.carousel-container',
    '.carousel-slide'
  ].join(', ');

  // Kill all tweens
  gsap.killTweensOf(elements);

  // Clear all GSAP properties
  gsap.set(elements, { clearProps: 'all' });

  // Kill ScrollTriggers relacionados
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === '.services-section' ||
        st.vars.trigger?.toString().includes('services')) {
      st.kill(true);
    }
  });
};

// ========================================
// 🎬 SERVICES ENTRY ANIMATIONS
// ========================================

export const initServicesEntryAnimations = () => {
  const servicesSection = document.querySelector('.services-section');
  const title = document.querySelector('.services-title');
  const description = document.querySelector('.services-description');

  if (!servicesSection || !title || !description) {
    console.warn('Services elements not found for entry animations');
    return null;
  }

  // Limpiar animaciones previas
  cleanupServicesAnimations();

  // ⚡ ESTABLECER ESTADOS INICIALES
  gsap.set('.services-title', { opacity: 0, y: 60, scale: 0.8 });
  gsap.set('.services-description', { opacity: 0, y: 40 });
 

  // Timeline de entrada
  const entryTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.services-section',
      start: 'top 70%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
      onEnter: () => {
        console.log('Services entry animation started');
      }
    }
  });

  // 1️⃣ Título principal con efecto de escala
  entryTimeline.to('.services-title', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: 'power3.out'
  }, 0);

  // 2️⃣ Descripción con delay
  entryTimeline.to('.services-description', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, 0.3);

  return entryTimeline;
};

// ========================================
// 🌊 SERVICES CONTINUOUS ANIMATIONS
// ========================================

export const initServicesContinuousAnimations = () => {
  const servicesSection = document.querySelector('.services-section');
  if (!servicesSection) {
    console.warn('Services section not found for continuous animations');
    return;
  }

};

// ========================================
// 🌫️ SERVICES EXIT ANIMATIONS
// ========================================

export const initServicesExitAnimations = () => {
  const servicesSection = document.querySelector('.services-section');
  if (!servicesSection) {
    console.warn('Services section not found for exit animations');
    return;
  }

  // Timeline de salida
  const exitTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.services-section',
      start: 'bottom 30%',
      end: 'bottom top',
      scrub: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        console.log('Services exit animation started');
      }
    }
  });

  // Desvanecimiento gradual con efectos únicos
  
  exitTimeline.to('.services-title', {
    opacity: 0.2,
    y: -30,
    scale: 0.95,
    duration: 1,
    ease: 'power2.in'
  }, 0.2);

  exitTimeline.to('.services-description', {
    opacity: 0.2,
    y: -20,
    duration: 1,
    ease: 'power2.in'
  }, 0.3);

  return exitTimeline;
};

// ========================================
// 📱 RESPONSIVE ANIMATIONS
// ========================================

export const initServicesResponsiveAnimations = () => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;

  if (isMobile) {
    // Animaciones más suaves para móviles
    gsap.set('.services-card', { y: 40 });
    gsap.to('.services-card', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  } else if (isTablet) {
    // Animaciones medias para tablets
    gsap.set('.services-card', { y: 60, opacity: 0 });
    gsap.to('.services-card', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }
};

// ========================================
// 🚀 MAIN INITIALIZATION
// ========================================

export const initAllServicesAnimations = () => {
  if (typeof window === 'undefined') {
    console.warn('Cannot initialize services animations on server side');
    return null;
  }

  const initialize = () => {
    try {
      const servicesSection = document.querySelector('.services-section');
      const title = document.querySelector('.services-title');

      if (!servicesSection || !title) {
        console.warn('Services elements not ready, retrying...');
        setTimeout(initialize, 100);
        return;
      }

      // 1️⃣ Inicializar animaciones de entrada
      const entryTimeline = initServicesEntryAnimations();

      // 2️⃣ Inicializar animaciones continuas después de la entrada
      if (entryTimeline) {
        entryTimeline.eventCallback('onComplete', () => {
          setTimeout(() => {
            initServicesContinuousAnimations();
          }, 500);
        });
      }

      // 3️⃣ Inicializar animaciones de salida
      setTimeout(() => {
        initServicesExitAnimations();
      }, 1000);

      // 4️⃣ Inicializar animaciones responsivas
      initServicesResponsiveAnimations();

      // 5️⃣ Refrescar ScrollTrigger
      ScrollTrigger.refresh();

      return {
        entryTimeline,
        cleanup: cleanupServicesAnimations
      };

    } catch (error) {
      console.error('Error initializing services animations:', error);
      return null;
    }
  };

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
    return null;
  } else {
    return initialize();
  }
};