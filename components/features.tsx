import { Shield, Clock, Users, Award, HeadphonesIcon, FileCheck } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Seguridad Garantizada",
    description: "Tus datos están protegidos con los más altos estándares de seguridad",
  },
  {
    icon: Clock,
    title: "Respuesta Rápida",
    description: "Procesamos tus trámites en el menor tiempo posible",
  },
  {
    icon: Users,
    title: "Equipo Experto",
    description: "Profesionales certificados con años de experiencia",
  },
  {
    icon: Award,
    title: "Calidad Certificada",
    description: "Servicios respaldados por certificaciones oficiales",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte 24/7",
    description: "Asistencia continua para resolver tus dudas",
  },
  {
    icon: FileCheck,
    title: "Seguimiento en Línea",
    description: "Monitorea el estado de tus trámites en tiempo real",
  },
]

export function Features() {
  return (
  <section id="caracteristicas"
  className="relative border-white/30 bg-gradient-to-r from-[#8b1d91]/90 to-[#652382]/90 backdrop-blur p-20 lg:p-32 overflow-hidden"
>
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    
    <div className="container mx-auto px-4 lg:px-8 text-white relative z-10">
        <div className="container mx-auto px-4 lg:px-8 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground lg:text-5xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Nos diferenciamos por nuestro compromiso con la excelencia y la satisfacción del cliente
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent">
                    <feature.icon className="h-6 w-6 text-accent transition-colors group-hover:text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
