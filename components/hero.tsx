import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background hero-gradient py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              Servicios profesionales certificados
            </div>

            <div className="space-y-4">
              <h1 className="text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
                Simplificamos tus trámites en Ecuador
              </h1>
              <p className="text-pretty text-lg text-muted-foreground lg:text-xl">
                Expertos en SRI, servicios tributarios, legales y todos los trámites oficiales. Ahorra tiempo y evita
                complicaciones con nuestro equipo profesional.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-foreground">Procesamiento rápido y seguro</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-foreground">Asesoría personalizada 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-foreground">Precios transparentes sin sorpresas</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="ghost-purple">
                Hablar con un Asesor
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">15K+</div>
                <div className="text-sm text-muted-foreground">Clientes satisfechos</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Tasa de éxito</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">24h</div>
                <div className="text-sm text-muted-foreground">Tiempo promedio</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Element */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-[400px] w-full lg:h-[500px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-transparent"></div>
              <div className="absolute right-8 top-8 rounded-xl bg-card p-6 shadow-lg">
                <div className="mb-3 text-sm font-medium text-muted-foreground">Estado del Trámite</div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Aprobado</div>
                    <div className="text-sm text-muted-foreground">RUC actualizado</div>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-full bg-accent" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 rounded-xl bg-card p-6 shadow-lg">
                <div className="mb-2 text-xs font-medium text-muted-foreground">SERVICIOS ACTIVOS</div>
                <div className="mb-1 text-3xl font-bold text-foreground">247</div>
                <div className="text-sm text-accent">+12% este mes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
