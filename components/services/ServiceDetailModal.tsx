"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState, useRef } from "react"
import { Loader2, Award } from "lucide-react"
import MarkdownContent from './MarkdownContent'
import Image from "next/image"
import { ModalBackgroundDistortion } from "../gsap/ModalBackgroundDistortion"
import { gsap } from "gsap"

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceSlug: string;
  serviceTitle: string;
  serviceIcon: string;
  professionalImage?: string;
  professionalName?: string;
  professionalTitle?: string;
}

export function ServiceDetailModal({
  isOpen,
  onClose,
  serviceSlug,
  serviceTitle,
  serviceIcon,
  professionalImage,
  professionalName,
  professionalTitle
}: ServiceDetailModalProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && serviceSlug) {
      loadServiceContent();
    }
  }, [isOpen, serviceSlug]);

  // Efecto para animaciones GSAP
  useEffect(() => {
    if (isOpen) {
      ModalBackgroundDistortion.activate();

      // Animación de entrada coordinada
      const tl = gsap.timeline();

      // Configuración inicial - solo si los elementos existen
      if (!modalRef.current || !imageRef.current || !contentRef.current) {
        return;
      }

      gsap.set(modalRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(imageRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0 });

      // Secuencia de animación
      tl.to(modalRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
      })
      .to(imageRef.current, {
        opacity: 1,
        duration: 0.5
      }, "-=0.2")
      .to(contentRef.current, {
        opacity: 1,
        duration: 0.5
      }, "-=0.3")
      .call(() => {
        // Cleanup de propiedades GSAP solo si los elementos existen
        if (imageRef.current && contentRef.current) {
          gsap.set([imageRef.current, contentRef.current], {
            clearProps: "opacity"
          });
        }
      });
    } else {
      ModalBackgroundDistortion.deactivate();
    }

    return () => {
      if (isOpen) {
        ModalBackgroundDistortion.cleanup();
      }
    };
  }, [isOpen]);

  const loadServiceContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/content/services/${serviceSlug}`);
      
      if (!response.ok) {
        throw new Error('No se pudo cargar el contenido del servicio');
      }
      
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error('Error loading service content:', err);
      setError('Error al cargar el contenido. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={modalRef}
        className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] p-0 gap-0 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[95vh] overflow-hidden">
          {/* Columna izquierda - Imagen del profesional */}
          <div
            ref={imageRef}
            className="relative bg-gradient-to-br from-brand-orange/10 to-brand-purple/10 p-6 flex flex-col justify-center items-center order-2 md:order-1 h-full flex-shrink-0"
          >
            <div className="relative">
              {professionalImage && (
                <div className="relative">
                  <Image
                    src={professionalImage}
                    alt={professionalName || "Profesional"}
                    width={280}
                    height={360}
                    style={{ height: "auto" }}
                    className="rounded-xl shadow-lg object-cover aspect-[3/4] w-full max-w-[280px]"
                  />
                  {/* Badge de certificación */}
                  <div className="absolute -top-3 -right-3 bg-brand-orange text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
                    <Award className="h-4 w-4" />
                    <span>Certificado</span>
                  </div>
                </div>
              )}

              {/* Información del profesional */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {professionalName || "Profesional Certificado"}
                </h3>
                <p className="text-brand-purple font-medium mb-4">
                  {professionalTitle || "Especialista"}
                </p>

                {/* Ícono del servicio */}
                <div className="inline-flex h-45 w-45 items-center justify-center rounded-xl">
                  <Image
                    src={serviceIcon}
                    alt={serviceTitle}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Contenido */}
          <div
            ref={contentRef}
            className="flex flex-col h-full order-1 md:order-2"
          >
            <DialogHeader className="px-6 py-4 border-b border-gray-200/50">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-brand-orange"></div>
                {serviceTitle}
              </DialogTitle>
            </DialogHeader>

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-brand-orange mb-4" />
                <span className="text-gray-700 text-lg font-medium">Cargando información...</span>
                <p className="text-gray-600 text-sm mt-2">Obteniendo detalles del servicio</p>
              </div>
            )}

            {error && (
              <div className="flex-1 px-6 py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="mt-2">{error}</p>
                </div>
              </div>
            )}

            {!isLoading && !error && content && (
              <MarkdownContent content={content} className="flex-1" />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
