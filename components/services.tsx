"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Scale, Calculator, Briefcase, Building2, ClipboardCheck, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Calculator,
    title: "Servicios SRI",
    description: "Declaraciones de impuestos, obtención de RUC, certificados tributarios y más.",
    features: ["Declaración IVA", "Declaración Renta", "Certificados SRI"],
  },
  {
    icon: Scale,
    title: "Asesoría Legal",
    description: "Servicios legales completos con abogados especializados en derecho ecuatoriano.",
    features: ["Contratos", "Litigios", "Consultoría Legal"],
  },
  {
    icon: FileText,
    title: "Trámites Notariales",
    description: "Gestión de documentos notariales, poderes, escrituras y certificaciones.",
    features: ["Poderes", "Escrituras", "Certificaciones"],
  },
  {
    icon: Briefcase,
    title: "Constitución de Empresas",
    description: "Creación y registro de compañías con todos los trámites necesarios.",
    features: ["Registro Mercantil", "Estatutos", "Permisos"],
  },
  {
    icon: Building2,
    title: "Trámites Municipales",
    description: "Permisos de funcionamiento, patentes municipales y certificados.",
    features: ["Patente", "Bomberos", "Uso de Suelo"],
  },
  {
    icon: ClipboardCheck,
    title: "Trámites IESS",
    description: "Afiliaciones, cese de actividades, solicitudes de información al IESS.",
    features: ["Afiliación", "Cesantía", "Certificados"],
  },
]

export function Services() {
  return (
    <section id="servicios" className="bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground lg:text-5xl">
            Nuestros Servicios Especializados
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Ofrecemos una amplia gama de servicios para cubrir todas tus necesidades de trámites en Ecuador
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                  <service.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-foreground">{service.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>

                <ul className="mb-6 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="ghost" className="group/btn w-full justify-between">
                  Ver más detalles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Ver Todos los Servicios
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
