'use client';

import { gsap, ScrollTrigger } from '@/lib/gsap';

// ========================================
// 🧹 CLEANUP FUNCTIONS
// ========================================

const cleanupHeroAnimations = () => {
  const elements = [
    '.hero-badge',
    '.hero-title',
    '.hero-description',
    '.hero-check',
    '.hero-button-primary',
    '.hero-button-secondary',
    '.hero-stat',
    '.hero-image',
    '.typewriter-letter'
  ].join(', ');

  // Kill all tweens
  gsap.killTweensOf(elements);
  
  // Clear all GSAP properties
  gsap.set(elements, { clearProps: 'all' });

  // Kill ScrollTriggers relacionados
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === '.hero-section' || 
        st.vars.trigger === '.hero-button-wrapper') {
      st.kill(true);
    }
  });
};

// ========================================
// 🎬 INITIAL ANIMATIONS (Entry)
// ========================================

export const initHeroAnimations = () => {
  // Verificar que los elementos existan
  const heroSection = document.querySelector('.hero-section');
  const badge = document.querySelector('.hero-badge');
  
  if (!heroSection || !badge) {
    console.warn('Hero elements not found');
    return null;
  }

  // Limpiar animaciones previas
  cleanupHeroAnimations();

  // ⚡ ESTABLECER ESTADOS INICIALES INMEDIATAMENTE
  gsap.set('.hero-badge', { opacity: 0, y: -30 });
  gsap.set('.hero-title', { opacity: 0, y: 50 });
  gsap.set('.typewriter-letter', { opacity: 0, scale: 0.5 });
  gsap.set('.hero-description', { opacity: 0, y: 30 });
  gsap.set('.hero-check', { opacity: 0, x: -20 });
  gsap.set('.hero-button-primary', { opacity: 0, y: 20, scale: 0.95 });
  gsap.set('.hero-button-secondary', { opacity: 0, scale: 0, rotation: -10 });
  gsap.set('.hero-stat', { opacity: 0, scale: 0.8 });
  gsap.set('.hero-image', { opacity: 1 });

  // Crear timeline principal
  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out',
      duration: 1
    }
  });

  // 1️⃣ Badge
  tl.to('.hero-badge', 
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 
    0
  );

  // 2️⃣ Título
  tl.to('.hero-title',
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    },
    '-=0.5'
  );

  // 3️⃣ Typewriter letters
  tl.to('.typewriter-letter',
    {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    }, 
    '-=0.3'
  );

  // 4️⃣ Descripción
  tl.to('.hero-description',
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    },
    '-=0.6'
  );

  // 5️⃣ Checkmarks
  tl.to('.hero-check',
    {
      opacity: 1,
      x: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out'
    },
    '-=0.4'
  );

  // 6️⃣ Botón primario
  tl.to('.hero-button-primary',
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out'
    },
    '-=0.4'
  );

  // 7️⃣ Botón secundario con animación elástica
  tl.to('.hero-button-secondary',
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.7)',
    }, 
    '-=0.6'
  );

  // 8️⃣ Animación de respiración del botón secundario (después de que aparezca)
  tl.add(() => {
    gsap.to('.hero-button-secondary', {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, '+=0.2');

  // 9️⃣ Estadísticas
  tl.to('.hero-stat',
    {
      opacity: 1,
      scale: 1,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    },
    '-=1.2'
  );

  return tl;
};

// ========================================
// 📜 SCROLL ANIMATIONS
// ========================================

export const initHeroScrollAnimations = () => {
  const wrapper = document.querySelector('.hero-button-wrapper');
  if (!wrapper) {
    console.warn('Button wrapper not found');
    return;
  }

  // Pin del wrapper de botones
  ScrollTrigger.create({
    trigger: '.hero-button-wrapper',
    start: 'top 10%',
    end: '+=8000',
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
    anticipatePin: 1,
  });

  // Animación de movimiento del botón secundario
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '+=700',
      scrub: 0.1,
      invalidateOnRefresh: true,
    }
  });

  tl.to('.hero-button-secondary', {
    x: 400,
    ease: 'none',
    duration: 5,
  })
  .to('.hero-button-secondary', {
    x: 1035,
    ease: 'none',
    duration: 3,
  });
};

// ========================================
// 🌫️ FADE OUT ON SCROLL
// ========================================

export const initHeroScrollFade = () => {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const fadeElements = '.hero-badge, .hero-title, .hero-description, .hero-check, .hero-button-primary, .hero-stat, .hero-image';

  gsap.fromTo(
    fadeElements,
    {
      opacity: 1,
      y: 0,
    },
    {
      opacity: 0,
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
        
        onEnterBack: () => {
          gsap.to(fadeElements, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        },
        onLeaveBack: () => {
          gsap.set(fadeElements, {
            opacity: 1,
            y: 0,
          });
        },
      }
    }
  );
};

// ========================================
// 🚀 MAIN INITIALIZATION
// ========================================

export const initAllHeroAnimations = () => {
  if (typeof window === 'undefined') {
    console.warn('Cannot initialize animations on server side');
    return null;
  }

  const initialize = () => {
    try {
      const heroSection = document.querySelector('.hero-section');
      const badge = document.querySelector('.hero-badge');
      
      if (!heroSection || !badge) {
        console.warn('Hero elements not ready, waiting...');
        requestAnimationFrame(initialize);
        return;
      }

      // 1️⃣ Primero ejecutar las animaciones iniciales
      const timeline = initHeroAnimations();

      // 2️⃣ Esperar a que termine la animación inicial antes de activar scroll
      if (timeline) {
        timeline.eventCallback('onComplete', () => {
          // Pequeño delay antes de activar scroll animations
          setTimeout(() => {
            initHeroScrollFade();
            initHeroScrollAnimations();
            ScrollTrigger.refresh();
          }, 300);
        });
      }

      return {
        timeline,
        cleanup: cleanupHeroAnimations
      };
      
    } catch (error) {
      console.error('Error initializing hero animations:', error);
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