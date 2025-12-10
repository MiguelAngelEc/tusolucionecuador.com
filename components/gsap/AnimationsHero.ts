'use client';

import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Animaciones para el componente Hero
 * Incluye animaciones de entrada para todos los elementos principales
 */
export const initHeroAnimations = () => {
  // Timeline principal para coordinar todas las animaciones
  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out',
      duration: 1
    }
  });

  // Animación del badge "Servicios profesionales certificados"
  tl.from('.hero-badge', {
    opacity: 0,
    y: -30,
    duration: 0.8
  });

  // Animación del título principal (sin la palabra que tendrá el efecto typewriter)
  tl.from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1
  }, '-=0.5'); // Comienza 0.5s antes de que termine la animación anterior

  // Efecto de máquina de escribir para las letras de "Ecuador"
  // Primero ocultamos todas las letras
  gsap.set('.typewriter-letter', { opacity: 0, scale: 0.5 });
  
  // Luego las animamos una por una con efecto de máquina de escribir
  tl.to('.typewriter-letter', {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    stagger: 0.1, // Cada letra aparece 0.1s después de la anterior
    ease: 'back.out(1.7)', // Efecto de rebote suave
  }, '-=0.3'); // Comienza un poco antes de que termine la animación del título

  // Animación de la descripción
  tl.from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8
  }, '-=0.6');

  // Animación de los checkmarks (uno por uno)
  tl.from('.hero-check', {
    opacity: 0,
    x: -20,
    stagger: 0.15, // Retraso entre cada elemento
    duration: 0.6
  }, '-=0.4');

  // Animación de las estadísticas
  tl.from('.hero-stat', {
    opacity: 0,
    scale: 0.8,
    stagger: 0.1,
    duration: 0.6
  }, '-=0.4');

  return tl;
};

/**
 * Animación de fade-out al hacer scroll
 * El hero-section se desvanece gradualmente mientras el usuario hace scroll hacia abajo
 */
export const initHeroScrollFade = () => {
  const heroSection = document.querySelector('.hero-section');
  
  if (!heroSection) return;

  gsap.to('.hero-section', {
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top', // Comienza cuando el top del hero toca el top del viewport
      end: 'bottom top', // Termina cuando el bottom del hero toca el top del viewport
      scrub: true, // Sincroniza la animación con el scroll (suave)
      // markers: true, // Descomenta para ver los marcadores de debug
    }
  });
};

/**
 * Inicializa todas las animaciones del Hero
 */
export const initAllHeroAnimations = () => {
  // Esperar a que el DOM esté listo
  if (typeof window === 'undefined') return;

  const timeline = initHeroAnimations();
  
  // Inicializar la animación de scroll fade
  initHeroScrollFade();
  
  return timeline;
};
