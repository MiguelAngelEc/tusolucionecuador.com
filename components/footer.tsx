import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-white/30 footer-gradient">
      <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
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
            <p className="text-sm text-white/80">
              Tu aliado confiable para todos los trámites oficiales en Ecuador. Profesionalismo y dedicación en cada
              servicio.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white hover:text-brand-purple"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white hover:text-brand-purple"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white hover:text-brand-purple"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white hover:text-brand-purple"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Trámites SRI
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Asesoría Legal
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Constitución Empresas
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Trámites Municipales
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Servicios IESS
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Equipo
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Testimonios
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-white" />
                <span className="text-white/80">Av. Amazonas y Naciones Unidas, Quito, Ecuador</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-white" />
                <a href="tel:+593999999999" className="text-white/80 transition-colors hover:text-white">
                  +593 99 999 9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-white" />
                <a
                  href="mailto:info@tramitesecuador.com"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  info@tramitesecuador.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} Trámites Ecuador. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/80 transition-colors hover:text-white">
                Privacidad
              </a>
              <a href="#" className="text-white/80 transition-colors hover:text-white">
                Términos
              </a>
              <a href="#" className="text-white/80 transition-colors hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
