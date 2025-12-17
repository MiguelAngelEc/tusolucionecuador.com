"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

interface LogoItem {
  src: string
  alt: string
}

const serviceLogos: LogoItem[] = [
  {
    src: '/img-logos-service/SRI.png',
    alt: 'SRI'
  },
  {
    src: '/img-logos-service/judicatura.png',
    alt: 'Judicatura'
  },
  {
    src: '/img-logos-service/notaria.png',
    alt: 'Notaría'
  },
  {
    src: '/img-logos-service/empresas.png',
    alt: 'Empresas'
  },
  {
    src: '/img-logos-service/municipios.png',
    alt: 'Municipios'
  },
  {
    src: '/img-logos-service/IESS.png',
    alt: 'IESS'
  }
]

export function ServiceLogosCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween>()

  useEffect(() => {
    if (carouselRef.current) {
      const carousel = carouselRef.current
      const slides = carousel.querySelectorAll('.carousel-slide')

      // Duplicar slides para movimiento continuo
      const slideWidth = (slides[0] as HTMLElement)?.offsetWidth || 0
      const totalWidth = slideWidth * serviceLogos.length

      // Crear animación continua de derecha a izquierda
      animationRef.current = gsap.to('.carousel-track', {
        x: -totalWidth,
        duration: 20, // 20 segundos para completar el ciclo
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      })

      // Animación de entrada
      gsap.fromTo('.carousel-container',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [])

  // Duplicar los logos para crear efecto continuo
  const duplicatedLogos = [...serviceLogos, ...serviceLogos]

  return (
    <div className="mt-12">
      <div
        ref={carouselRef}
        className="carousel-container mx-auto overflow-hidden"
      >
        <div className="carousel-track flex">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="carousel-slide flex-shrink-0 px-8"
              style={{ width: '200px' }}
            >
              <div className="flex items-center justify-center h-24">
                <div className="relative h-24 w-40 transition-all duration-300 hover:scale-110">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                    sizes="150px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}