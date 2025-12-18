'use client';

import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCcw, Bot, User } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
// import { es } from 'date-fns/locale';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

export function ChatMessage({
  message,
  onRetry,
  showAvatar = true,
  showTimestamp = true,
}: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';
  const isError = message.isError;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 transition-all duration-200 hover:bg-gray-50/50',
        isUser && 'flex-row-reverse',
        'animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
      )}
    >
      {/* Avatar */}
      {showAvatar && (
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isBot && 'bg-purple-100 text-purple-600',
            isUser && 'bg-gray-100 text-gray-600'
          )}
        >
          {isBot ? (
            <Bot className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-2',
          isUser && 'items-end'
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
            isBot && !isError && 'bg-white border border-gray-200 text-gray-800',
            isUser && 'bg-purple-600 text-white',
            isError && 'bg-red-50 border border-red-200 text-red-800'
          )}
        >
          <p className="whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Retry Button for Error Messages */}
          {isError && onRetry && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reintentar
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && (
          <span
            className={cn(
              'text-xs text-gray-500 px-1',
              isUser && 'text-right'
            )}
          >
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}