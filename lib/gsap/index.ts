'use client';

import { gsap } from 'gsap';

// Plugins básicos
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Plugins premium ahora gratuitos
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';

// ✅ Registrar todos los plugins UNA SOLA VEZ
if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    ScrollSmoother,
    SplitText,
    DrawSVGPlugin,
    MorphSVGPlugin,
    Flip,
    Draggable
  );
}

// Configuración global
gsap.config({
  nullTargetWarn: false,
  force3D: true,
});

// Exportar todo
export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  Flip,
  Draggable
};