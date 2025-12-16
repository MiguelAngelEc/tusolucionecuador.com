'use client';

import { gsap } from 'gsap';

export class ModalBackgroundDistortion {
  private static isActive = false;
  private static overlay: HTMLElement | null = null;

  /**
   * Activa la distorsión del fondo cuando se abre el modal
   */
  static activate(): void {
    if (this.isActive) return;

    this.isActive = true;

    // Crear overlay de distorsión
    this.createDistortionOverlay();

    // Aplicar efectos al body/página principal
    this.applyBackgroundDistortion();
  }

  /**
   * Desactiva la distorsión del fondo cuando se cierra el modal
   */
  static deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;

    // Restaurar el fondo original
    this.removeBackgroundDistortion();

    // Eliminar overlay
    this.removeDistortionOverlay();
  }

  /**
   * Crear overlay opaco para el fondo
   */
  private static createDistortionOverlay(): void {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.id = 'modal-background-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      z-index: 45;
      opacity: 0;
      pointer-events: none;
    `;

    document.body.appendChild(this.overlay);

    // Animar entrada del overlay
    gsap.to(this.overlay, {
      duration: 0.4,
      opacity: 1,
      ease: "power2.out"
    });
  }

  /**
   * Aplicar distorsión al contenido principal de la página
   */
  private static applyBackgroundDistortion(): void {
    // Obtener el contenido principal (todo excepto modales)
    const mainContent = document.querySelector('main') || document.body;

    // Aplicar transformaciones de distorsión
    gsap.to(mainContent, {
      duration: 0.6,
      scale: 0.95,
      filter: "blur(3px) brightness(0.5) contrast(0.8)",
      transformOrigin: "center center",
      ease: "power2.out"
    });

    // Distorsión adicional a elementos específicos si existen
    const sections = document.querySelectorAll('section:not([id*="modal"])');
    if (sections.length > 0) {
      gsap.to(sections, {
        duration: 0.8,
        rotationX: 2,
        rotationY: 1,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        ease: "power2.out",
        stagger: 0.1
      });
    }
  }

  /**
   * Restaurar el fondo a su estado original
   */
  private static removeBackgroundDistortion(): void {
    const mainContent = document.querySelector('main') || document.body;

    // Restaurar transformaciones principales
    gsap.to(mainContent, {
      duration: 0.5,
      scale: 1,
      filter: "blur(0px) brightness(1) contrast(1)",
      ease: "power2.out"
    });

    // Restaurar secciones
    const sections = document.querySelectorAll('section:not([id*="modal"])');
    if (sections.length > 0) {
      gsap.to(sections, {
        duration: 0.6,
        rotationX: 0,
        rotationY: 0,
        ease: "power2.out"
      });
    }
  }

  /**
   * Eliminar overlay de distorsión
   */
  private static removeDistortionOverlay(): void {
    if (!this.overlay) return;

    gsap.to(this.overlay, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.in",
      onComplete: () => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
          this.overlay = null;
        }
      }
    });
  }

  /**
   * Limpiar todos los efectos (usar en caso de error)
   */
  static cleanup(): void {
    this.isActive = false;

    // Restaurar todo inmediatamente
    const mainContent = document.querySelector('main') || document.body;
    gsap.set(mainContent, {
      scale: 1,
      filter: "none",
      rotationX: 0,
      rotationY: 0,
      clearProps: "all"
    });

    const sections = document.querySelectorAll('section:not([id*="modal"])');
    gsap.set(sections, {
      rotationX: 0,
      rotationY: 0,
      clearProps: "all"
    });

    // Remover overlay inmediatamente
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
    }

    // Remover cualquier overlay que pudiera existir
    const existingOverlay = document.getElementById('modal-background-overlay');
    if (existingOverlay && existingOverlay.parentNode) {
      existingOverlay.parentNode.removeChild(existingOverlay);
    }
  }

  /**
   * Verificar si la distorsión está activa
   */
  static get isDistortionActive(): boolean {
    return this.isActive;
  }
}