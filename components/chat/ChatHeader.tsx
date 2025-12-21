'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Bot, Settings, Trash2, FileText, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
    <div className={`bg-gradient-to-r from-[#8b1d91]/90 to-[#652382]/90 backdrop-blur p-4 rounded-t-2xl ${className}`}>
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
                className="h-8 w-8 text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-white/30"
                aria-label="Opciones del chat"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Opciones del chat</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border border-gray-200 rounded-lg p-1">
              {onClearChat && (
                <>
                  <DropdownMenuItem
                    onClick={onClearChat}
                    className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 rounded-md transition-colors duration-150 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="font-medium">Limpiar conversación</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-gray-200" />
                </>
              )}
              <DropdownMenuItem
                onClick={() => window.open('mailto:soporte@tusolucion.com', '_blank')}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-brand-purple-light hover:text-brand-purple focus:bg-brand-purple-light focus:text-brand-purple rounded-md transition-colors duration-150 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span className="font-medium">Contactar soporte</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open('/terminos', '_blank')}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-brand-orange/10 hover:text-brand-orange focus:bg-brand-orange/10 focus:text-brand-orange rounded-md transition-colors duration-150 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span className="font-medium">Términos de servicio</span>
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