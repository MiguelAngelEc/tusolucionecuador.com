'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChatLogic } from './useChatLogic';

interface ChatWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark' | 'auto';
}

export function ChatWidget({
  className,
  position = 'bottom-right',
  theme = 'auto',
}: ChatWidgetProps) {
  const {
    state,
    openChat,
    closeChat,
    minimizeChat,
    sendMessage,
    clearMessages,
    markAsRead,
    retryLastMessage,
  } = useChatLogic();

  console.log('🎨 [CHAT] ChatWidget renderizado:', {
    isOpen: state.isOpen,
    messagesCount: state.messages.length,
    sessionId: state.sessionId,
    hasUnreadMessages: state.hasUnreadMessages,
    isLoading: state.isLoading,
    isTyping: state.isTyping,
    error: state.error,
    position,
    theme
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mobileMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Improved auto-scroll function with proper timing
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (!state.isOpen) return;

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Try desktop container first, then mobile
        const container = messagesContainerRef.current || mobileMessagesContainerRef.current;
        if (container) {
          const scrollOptions: ScrollToOptions = {
            top: container.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
          };
          container.scrollTo(scrollOptions);
        }
      }, 50); // Small delay to ensure DOM is fully rendered
    });
  }, [state.isOpen]);

  // Auto-scroll when messages change or typing indicator appears
  useEffect(() => {
    if (state.isOpen && (state.messages.length > 0 || state.isTyping)) {
      scrollToBottom();
    }
  }, [state.messages, state.isTyping, state.isOpen, scrollToBottom]);

  // Additional scroll trigger when bot finishes responding (isTyping goes from true to false)
  const prevIsTypingRef = useRef(state.isTyping);
  useEffect(() => {
    if (state.isOpen && prevIsTypingRef.current && !state.isTyping) {
      // Bot just finished typing, scroll to show the response
      setTimeout(() => scrollToBottom(), 100);
    }
    prevIsTypingRef.current = state.isTyping;
  }, [state.isTyping, state.isOpen, scrollToBottom]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (state.isOpen && state.hasUnreadMessages) {
      markAsRead();
    }
  }, [state.isOpen, state.hasUnreadMessages, markAsRead]);

  const handleRetryMessage = () => {
    retryLastMessage();
  };

  const handleSendMessage = useCallback((message: string) => {
    sendMessage(message);
    // Trigger immediate scroll after user sends message
    setTimeout(() => scrollToBottom(), 100);
  }, [sendMessage, scrollToBottom]);

  const welcomeMessage = "¡Hola! 👋 Soy el asistente virtual de TuSolucion.com. ¿En qué puedo ayudarte hoy?";

  // Show welcome message if no messages
  const displayMessages = state.messages.length === 0 ? [
    {
      id: 'welcome',
      text: welcomeMessage,
      sender: 'bot' as const,
      timestamp: new Date(),
      isError: false,
    }
  ] : state.messages;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <>
      {/* Chat Widget */}
      <div
        className={cn(
          'fixed z-50 transition-all duration-300 ease-in-out',
          positionClasses[position],
          className
        )}
      >
        {state.isOpen ? (
          /* Open Chat Window */
          <div className="flex h-[600px] w-96 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <ChatHeader
              onClose={closeChat}
              onMinimize={minimizeChat}
              onClearChat={clearMessages}
              unreadCount={state.hasUnreadMessages ? 1 : 0}
              isOnline={!state.error}
            />

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 bg-gray-50/50 overflow-y-auto">
              <div className="flex flex-col min-h-full">
                {displayMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onRetry={message.isError ? handleRetryMessage : undefined}
                  />
                ))}

                {/* Typing Indicator */}
                <TypingIndicator show={state.isTyping} />

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Error Message */}
            {state.error && (
              <div className="border-t border-red-200 bg-red-50 px-4 py-2">
                <p className="text-sm text-red-600">{state.error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetryMessage}
                  className="mt-1 h-6 text-xs text-red-600 hover:text-red-700"
                >
                  Reintentar
                </Button>
              </div>
            )}

            {/* Input Area */}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={state.isLoading}
              placeholder="Escribe tu mensaje..."
            />
          </div>
        ) : (
          /* Closed Chat Button */
          <div className="relative">
            <Button
              onClick={openChat}
              size="icon"
              className={cn(
                'h-14 w-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700',
                'hover:scale-110 active:scale-95 transition-all duration-200',
                'focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2'
              )}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Abrir chat</span>
            </Button>

            {/* Unread Messages Badge */}
            {state.hasUnreadMessages && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-6 min-w-6 px-2 text-xs bg-red-500 hover:bg-red-500 animate-pulse"
              >
                ¡Nuevo!
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {state.isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden">
          <div className="flex h-full flex-col">
            {/* Mobile Chat */}
            <div className="flex h-full flex-col bg-white">
              <ChatHeader
                onClose={closeChat}
                unreadCount={state.hasUnreadMessages ? 1 : 0}
                isOnline={!state.error}
              />

              <div ref={mobileMessagesContainerRef} className="flex-1 bg-gray-50/50 overflow-y-auto">
                <div className="flex flex-col min-h-full">
                  {displayMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onRetry={message.isError ? handleRetryMessage : undefined}
                    />
                  ))}

                  <TypingIndicator show={state.isTyping} />
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {state.error && (
                <div className="border-t border-red-200 bg-red-50 px-4 py-2">
                  <p className="text-sm text-red-600">{state.error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetryMessage}
                    className="mt-1 h-6 text-xs text-red-600 hover:text-red-700"
                  >
                    Reintentar
                  </Button>
                </div>
              )}

              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={state.isLoading}
                placeholder="Escribe tu mensaje..."
                className="border-t-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}