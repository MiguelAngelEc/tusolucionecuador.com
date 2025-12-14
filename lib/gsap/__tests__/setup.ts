/**
 * Test setup and configuration for GSAP animations
 */
import { beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

// ✅ POLYFILLS NECESARIOS PARA JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// ✅ Mock de requestAnimationFrame y cancelAnimationFrame
let animationFrameId = 0;
const animationFrameCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  const id = ++animationFrameId;
  animationFrameCallbacks.set(id, callback);
  setTimeout(() => {
    const cb = animationFrameCallbacks.get(id);
    if (cb) {
      cb(Date.now());
      animationFrameCallbacks.delete(id);
    }
  }, 16); // ~60fps
  return id;
};

global.cancelAnimationFrame = (id: number): void => {
  animationFrameCallbacks.delete(id);
};

// ✅ Setup antes de todos los tests
beforeAll(() => {
  // Configuración global del entorno de testing
});

// ✅ Setup antes de cada test
beforeEach(() => {
  // Limpiar mocks antes de cada test
  jest.clearAllMocks();
});

// ✅ Cleanup después de cada test
afterEach(() => {
  // Limpiar animaciones y timers
  animationFrameCallbacks.clear();
  jest.clearAllTimers();
});

// ✅ Cleanup después de todos los tests
afterAll(() => {
  // Limpieza final
});