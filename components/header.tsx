"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-gradient-to-r from-[#8b1d91]/90 via-[#652382]/90 to-[#f28e03]/90 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r/90">
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

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost-purple" size="sm" className="text-white border-white/30 hover:bg-white/10">
                Iniciar Sesión
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="bg-white text-brand-purple hover:bg-white/90">
                Registrarse
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 ring-2 ring-white ring-offset-2'
                }
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-16 border-b border-white/20 bg-gradient-to-r from-[#8b1d91] via-[#652382] to-[#f28e03] p-4 md:hidden shadow-lg">
            <nav className="flex flex-col gap-4">
              <a href="#servicios" className="text-sm font-medium text-white hover:text-white/80" onClick={() => setIsMenuOpen(false)}>
                Servicios
              </a>
              <a href="#caracteristicas" className="text-sm font-medium text-white hover:text-white/80" onClick={() => setIsMenuOpen(false)}>
                Características
              </a>
              <a href="#contacto" className="text-sm font-medium text-white hover:text-white/80" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost-purple" size="sm" className="text-white border-white/30 hover:bg-white/10 w-full">
                      Iniciar Sesión
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm" className="bg-white text-brand-purple hover:bg-white/90 w-full">
                      Registrarse
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center pt-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'w-10 h-10 ring-2 ring-white ring-offset-2'
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
