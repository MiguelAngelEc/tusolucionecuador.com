'use client';

import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  show: boolean;
  className?: string;
}

export function TypingIndicator({ show, className }: TypingIndicatorProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        'flex gap-3 p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
        className
      )}
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        <Bot className="h-4 w-4" />
      </div>

      {/* Typing Animation */}
      <div className="flex max-w-[85%] flex-col gap-2">
        <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500 mr-2">Escribiendo</span>
            <div className="flex gap-1">
              <div
                className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}