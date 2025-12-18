'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Escribe tu mensaje...",
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~4 lines
    textarea.style.height = `${newHeight}px`;
  };

  const isMessageValid = message.trim().length > 0 && message.trim().length <= 1000;

  return (
    <div className={cn('border-t border-gray-200 bg-white p-4', className)}>
      <div className="flex items-end gap-3">
        {/* Text Input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-full border border-gray-300 bg-white px-4 py-3 pr-12',
              'text-sm leading-5 text-gray-900 placeholder-gray-500',
              'focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              'transition-colors duration-200'
            )}
            style={{ maxHeight: '120px' }}
          />

          {/* Character Counter */}
          {message.length > 0 && (
            <div
              className={cn(
                'absolute -top-6 right-2 text-xs',
                message.length > 900 && 'text-orange-500',
                message.length > 1000 && 'text-red-500',
                message.length <= 900 && 'text-gray-400'
              )}
            >
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!isMessageValid || disabled}
          size="icon"
          className={cn(
            'h-12 w-12 rounded-full bg-purple-600 text-white hover:bg-purple-700',
            'disabled:bg-gray-300 disabled:text-gray-500',
            'transition-all duration-200 hover:scale-105 active:scale-95'
          )}
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "¿Qué servicios ofrecen?",
          "Necesito ayuda con el SRI",
          "¿Cuánto cuesta?",
          "¿Cuánto tiempo toma?"
        ].map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => setMessage(suggestion)}
            disabled={disabled}
            className="h-7 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-full"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}