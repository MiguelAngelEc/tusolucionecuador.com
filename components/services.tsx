"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Scale, Briefcase, Building2, ClipboardCheck, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import { initAllServicesAnimations } from "./gsap/AnimationsServices"
import { ScrollTrigger } from "@/lib/gsap"

const services = [
  {
    icon: "./img-logos-service/SRI.png",
    title: "Servicios SRI",
    description: "Declaraciones de impuestos, obtención de RUC, certificados tributarios y más.",
    features: ["Declaración IVA", "Declaración Renta", "Certificados SRI"],
  },
  {
    icon: "./img-logos-service/judicatura.png",
    title: "Asesoría Legal",
    description: "Servicios legales completos con abogados especializados en derecho ecuatoriano.",
    features: ["Contratos", "Litigios", "Consultoría Legal"],
  },
  {
    icon: "./img-logos-service/notaria.png",
    title: "Trámites Notariales",
    description: "Gestión de documentos notariales, poderes, escrituras y certificaciones.",
    features: ["Poderes", "Escrituras", "Certificaciones"],
  },
  {
    icon: "./img-logos-service/empresas.png",
    title: "Constitución de Empresas",
    description: "Creación y registro de compañías con todos los trámites necesarios.",
    features: ["Registro Mercantil", "Estatutos", "Permisos"],
  },
  {
    icon: "./img-logos-service/municipios.png",
    title: "Trámites Municipales",
    description: "Permisos de funcionamiento, patentes municipales y certificados.",
    features: ["Patente", "Bomberos", "Uso de Suelo"],
  },
  {
    icon: "./img-logos-service/IESS.png",
    title: "Trámites IESS",
    description: "Afiliaciones, cese de actividades, solicitudes de información al IESS.",
    features: ["Afiliación", "Cesantía", "Certificados"],
  },
]

export function Services() {
  const cleanupRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(false);

  useLayoutEffect(() => {
    // Prevenir doble inicialización
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    // Pequeño delay para asegurar que el DOM esté completamente renderizado
    const timeoutId = setTimeout(() => {
      try {
        // Inicializar animaciones
        const result = initAllServicesAnimations();

        if (result && typeof result === 'object' && 'cleanup' in result) {
          cleanupRef.current = result.cleanup;
        }
      } catch (error) {
        console.error('Error initializing services animations:', error);
      }
    }, 100);

    // Cleanup al desmontar
    return () => {
      clearTimeout(timeoutId);
      isMountedRef.current = false;

      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      // Refrescar ScrollTrigger después de limpiar
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="servicios" className="services-section bg-muted/30 px-10 py-20 lg:py-32 lg:px-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="services-title text-balance font-serif text-3xl font-bold tracking-tight text-foreground lg:text-5xl">
            Nuestros Servicios Especializados
          </h2>
          <p className="services-description mt-4 text-pretty text-lg text-muted-foreground">
            Ofrecemos una amplia gama de servicios para cubrir todas tus necesidades de trámites en Ecuador
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 m-24">
          {services.map((service, index) => (
            <Card
              key={index}
              className="services-card group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl"
            >
              <CardContent className="services-content p-6">
                <div className="services-icon mb-4 inline-flex h-32 w-32 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                  <Image src={service.icon} alt={service.title} width={300} height={300} className="transition-all group-hover:scale-110" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-foreground">{service.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>

                <ul className="services-features mb-6 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="ghost" className="services-button group/btn w-full justify-between">
                  Ver más detalles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="services-main-button bg-primary text-primary-foreground hover:bg-primary/90">
            Ver Todos los Servicios
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
