'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Bot, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize?: () => void;
  onClearChat?: () => void;
  unreadCount?: number;
  isOnline?: boolean;
  className?: string;
}

export function ChatHeader({
  onClose,
  onMinimize,
  onClearChat,
  unreadCount = 0,
  isOnline = true,
  className = '',
}: ChatHeaderProps) {
  const { user, isLoaded } = useUser();

  return (
    <div className={`bg-gradient-to-r from-purple-600 to-purple-800 p-4 rounded-t-2xl ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Side - User/Bot Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {isLoaded && user && user.imageUrl ? (
              <div className="h-10 w-10 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-2 border-white/30">
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || user.firstName || 'Usuario'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            {/* Online Status Indicator */}
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">
                {isLoaded && user ? (
                  `Chat con ${user.firstName || user.fullName || 'Usuario'}`
                ) : (
                  'Asistente Virtual'
                )}
              </h3>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 min-w-5 px-1.5 text-xs bg-red-500 hover:bg-red-500"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <p className="text-sm text-purple-100">
              {isOnline ? 'En línea' : 'Desconectado'} • TuSolucion.com
            </p>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-1">
          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Más opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onClearChat && (
                <DropdownMenuItem
                  onClick={onClearChat}
                  className="text-red-600 focus:text-red-600"
                >
                  Limpiar conversación
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => window.open('mailto:soporte@tusolucion.com', '_blank')}>
                Contactar soporte
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('/terminos', '_blank')}>
                Términos de servicio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Minimize Button */}
          {onMinimize && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMinimize}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Minimizar</span>
            </Button>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar chat</span>
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {!isOnline && (
        <div className="mt-2 rounded-lg bg-orange-500/20 px-3 py-2 text-sm text-orange-100">
          El asistente está temporalmente desconectado. Inténtalo de nuevo en unos momentos.
        </div>
      )}
    </div>
  );
}