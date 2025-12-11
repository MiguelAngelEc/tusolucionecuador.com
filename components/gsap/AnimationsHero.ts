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

  // Animacion de boton
  gsap.set('.hero-button-secondary', {
    opacity: 0,
    scale: 0,
    rotation: 0,
  });

  // Luego anima HACIA el estado visible
  tl.to('.hero-button-secondary', {
    opacity: 1,        
    scale: 1,          
    rotation: 0,       
    duration: 1,
    ease: 'elastic.out(1, 0.7)',
  }, '-=0.6');

  // Efecto de respiración (se ejecuta DESPUÉS del timeline)
  tl.add(() => {
    gsap.to('.hero-button-secondary', {
      opacity: 1,
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  // Animación de las estadísticas
  tl.from('.hero-stat', {
    opacity: 0,
    scale: 0.8,
    stagger: 0.1,
    duration: 0.6
  }, '-=0.4');

  return tl;
};

// ✨ Nueva función para el movimiento al hacer scroll
export const initHeroScrollAnimations = () => {
  // Pin el contenedor, no el botón directamente
  ScrollTrigger.create({
    trigger: '.hero-button-wrapper',
    start: '10% 10%',
    end: '+=8000',
    pin: true,
    pinSpacing: false,
  });

  // Movimiento del botón dentro del contenedor
  gsap.to('.hero-button-secondary', {
    x: 400,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '+=500',
      scrub: 0.1,
    }
  });
};

/**
 * Animación de fade-out al hacer scroll
 */
export const initHeroScrollFade = () => {
  const heroElements = document.querySelector('.hero-badge');
  
  if (!heroElements) return;

  gsap.to('.hero-badge, .hero-title, .hero-description, .hero-check, .hero-button-primary, .hero-stat', {
    opacity: 0,
    y: -50,
    immediateRender: false, // ✅ No aplica los valores inmediatamente
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top', 
      end: 'bottom top', 
      scrub: true,
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
  initHeroScrollAnimations();
  
  return timeline;
};
