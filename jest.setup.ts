/**
 * Jest Setup - Polyfills globales
 */
import { TextEncoder, TextDecoder } from 'util';

// Polyfills necesarios para JSDOM
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// structuredClone polyfill
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };
}