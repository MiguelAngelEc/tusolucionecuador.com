"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

export function CTA() {
  const [email, setEmail] = useState("")

  return (
    <section id="contacto" className="bg-primary py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-primary-foreground lg:text-5xl">
            Comienza hoy mismo con tus trámites
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/90">
            Únete a miles de ecuatorianos que confían en nosotros para gestionar sus trámites oficiales
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 sm:w-80"
            />
            <Button size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90">
              Solicitar Asesoría Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="mt-4 text-sm text-primary-foreground/70">
            Al registrarte, aceptas nuestros términos de servicio y política de privacidad
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-lg bg-primary-foreground/10 p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary-foreground">500+</div>
              <div className="mt-1 text-sm text-primary-foreground/80">Trámites mensuales</div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary-foreground">15+</div>
              <div className="mt-1 text-sm text-primary-foreground/80">Años de experiencia</div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary-foreground">99%</div>
              <div className="mt-1 text-sm text-primary-foreground/80">Satisfacción del cliente</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
