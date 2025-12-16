"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MarkdownRenderer } from "./MarkdownRenderer"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceSlug: string;
  serviceTitle: string;
  serviceIcon: string;
}

export function ServiceDetailModal({ isOpen, onClose, serviceSlug, serviceTitle, serviceIcon }: ServiceDetailModalProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && serviceSlug) {
      loadServiceContent();
    }
  }, [isOpen, serviceSlug]);

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
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 gap-0 bg-gradient-to-r bg-white/90  border-0 shadow-2xl rounded-xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-[#8b1d91]/90 to-[#f28e03]/90 ">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              {serviceTitle}
            </DialogTitle>
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10">
              <Image
                src={serviceIcon}
                alt={serviceTitle}
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(85vh-80px)] px-6 py-4 bg-white/90 backdrop-blur-xl">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 bg-white/90 rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <span className="text-foreground/70 text-lg font-medium">Cargando información...</span>
              <p className="text-foreground/50 text-sm mt-2">Obteniendo detalles del servicio</p>
            </div>
          )}

          {error && (
            <div className="bg-white border border-destructive/20 rounded-lg p-6 text-destructive bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-2">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && content && (
            <MarkdownRenderer content={content} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
