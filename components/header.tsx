"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-gradient-to-r from-[#8b1d91]/90 via-[#8b1f99]/90 via-[#652382]/90 to-[#f28e03]/90 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center justify-center">
            <Image
              src="/logo-tusolucion-ok.png"
              alt="TuSolucion Logo"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#servicios"
            className="text-sm font-medium text-white/80 transition-all hover:text-white hover:underline"
          >
            Servicios
          </a>
          <a
            href="#caracteristicas"
            className="text-sm font-medium text-white/80 transition-all hover:text-white hover:underline"
          >
            Características
          </a>
          <a
            href="#contacto"
            className="text-sm font-medium text-white/80 transition-all hover:text-white hover:underline"
          >
            Contacto
          </a>
        </nav>

        <div className="hidden text-white/80 items-center gap-3 md:flex">
          <Button variant="ghost-purple" size="sm" className="text-white border-white/30 hover:bg-white/10">
            Iniciar Sesión
          </Button>
          <Button size="sm" className="bg-white text-brand-purple hover:bg-white/90">
            Comenzar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-16 border-b border-border bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <a href="#servicios" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Servicios
              </a>
              <a href="#caracteristicas" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Características
              </a>
              <a href="#contacto" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost-purple" size="sm">
                  Iniciar Sesión
                </Button>
                <Button size="sm">Comenzar</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
