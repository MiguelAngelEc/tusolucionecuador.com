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
    this.createDistortionOverlay();
  }

  /**
   * Desactiva la distorsión del fondo cuando se cierra el modal
   */
  static deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.removeDistortionOverlay();
  }

  /**
   * Crear overlay con backdrop-filter para efecto visual sin interferir con elementos fixed
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
      backdrop-filter: blur(8px) brightness(0.7);
      z-index: 45;
      opacity: 0;
      pointer-events: none;
    `;

    document.body.appendChild(this.overlay);

    gsap.to(this.overlay, {
      duration: 0.4,
      opacity: 1,
      ease: "power2.out"
    });
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

    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
    }

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