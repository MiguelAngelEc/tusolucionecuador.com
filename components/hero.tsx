'use client';

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useLayoutEffect } from "react"
import { initAllHeroAnimations } from "./gsap/AnimationsHero"
import { ScrollTrigger } from "@/lib/gsap"
import { TypewriterWord } from "./TypewriterWord"
import { useRef } from "react"
import { useChat } from "@/components/chat"

export function Hero() {
  const cleanupRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(false);
  const { openChat } = useChat();

  useLayoutEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    const timeoutId = setTimeout(() => {
      try {
        const result = initAllHeroAnimations();

        if (result && typeof result === 'object' && 'cleanup' in result) {
          cleanupRef.current = result.cleanup;
        }
      } catch (error) {
        console.error('❌ Error initializing hero animations:', error);
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      isMountedRef.current = false;

      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-background hero-gradient hero-section">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col-reverse gap-12 lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8 p-6 lg:p-10">
            <div className="hero-badge inline-flex items-center gap-2 self-start rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-900"></span>
              </span>
              Servicios profesionales certificados
            </div>

            <div className="space-y-4">
              <h1 className="hero-title text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
                Simplificamos tus trámites en {' '}
                <TypewriterWord text="Ecu" color="text-yellow-400"/>
                <TypewriterWord text="ad" color="text-blue-800"/>
                <TypewriterWord text="or" color="text-red-600"/>
              </h1>
              <p className="hero-description text-pretty text-lg text-muted-foreground lg:text-xl">
                Expertos en SRI, servicios tributarios, legales y todos los trámites oficiales. Ahorra tiempo y evita
                complicaciones con nuestro equipo profesional.
              </p>
            </div>

            <div className="space-y-3">
              <div className="hero-check flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-foreground">Procesamiento rápido y seguro</span>
              </div>
              <div className="hero-check flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-foreground">Asesoría personalizada 24/7</span>
              </div>
              <div className="hero-check flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-foreground">Precios transparentes sin sorpresas</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row hero-button-wrapper z-50">
              <Button size="lg" className="hero-button-primary">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="ghost-purple"
                className="hero-button-secondary z-50"
                onClick={openChat}
              >
                Hablar con un Asesor
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 lg:gap-8">
              <div className="hero-stat">
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Clientes satisfechos</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="hero-stat">
                <div className="text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Tasa de éxito</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="hero-stat">
                <div className="text-3xl font-bold text-foreground">24h</div>
                <div className="text-sm text-muted-foreground">Tiempo promedio</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Element */}
          <div className="hidden lg:block relative items-center justify-center bg-background py-8 lg:py-0">
            <Image src="/img-leo.png" alt="Hero" width={550} height={550} className="max-w-full h-auto mt-4 hero-image" />
          </div>
        </div>
      </div>
    </section>
  )
}
