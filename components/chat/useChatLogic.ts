'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatState, Message } from '@/types/chat';
import {
  sendMessageToBot,
  generateSessionId,
  ChatApiError
} from '@/lib/chatApi';
import {
  saveMessages,
  getMessages,
  saveSessionId,
  getSessionId,
  updateLastActivity,
  clearSession,
  savePreferences,
  getPreferences,
} from '@/lib/chatStorage';

const INITIAL_STATE: ChatState = {
  isOpen: false,
  isLoading: false,
  isTyping: false,
  messages: [],
  sessionId: '',
  hasUnreadMessages: false,
  error: null,
};

export function useChatLogic() {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Rate limiting
  const lastMessageTime = useRef<number>(0);
  const messageCount = useRef<number>(0);
  const rateLimitResetTime = useRef<number>(0);

  // Initialize chat state on mount
  useEffect(() => {
    const initializeChat = () => {
      try {
        // Load existing session
        let sessionId = getSessionId();
        if (!sessionId) {
          sessionId = generateSessionId();
          saveSessionId(sessionId);
        }

        // Load existing messages
        const messages = getMessages();

        // Load preferences
        const preferences = getPreferences();

        setState(prev => ({
          ...prev,
          sessionId,
          messages,
          isOpen: preferences.minimized ? false : prev.isOpen,
        }));
      } catch (error) {
        console.warn('Failed to initialize chat state:', error);
        // Create new session on error
        const newSessionId = generateSessionId();
        saveSessionId(newSessionId);
        setState(prev => ({ ...prev, sessionId: newSessionId }));
      }
    };

    initializeChat();
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      saveMessages(state.messages);
      updateLastActivity();
    }
  }, [state.messages]);

  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const isRateLimited = useCallback((): boolean => {
    const now = Date.now();

    // Reset counter every minute
    if (now > rateLimitResetTime.current) {
      messageCount.current = 0;
      rateLimitResetTime.current = now + 60000; // 1 minute
    }

    // Check if too many messages in short time
    if (messageCount.current >= 10) {
      return true;
    }

    // Check if too frequent (max 1 message per 2 seconds)
    if (now - lastMessageTime.current < 2000) {
      return true;
    }

    return false;
  }, []);

  const openChat = useCallback(() => {
    updateState({
      isOpen: true,
      hasUnreadMessages: false,
      error: null
    });
    savePreferences({ minimized: false });
  }, [updateState]);

  const closeChat = useCallback(() => {
    updateState({ isOpen: false });
    savePreferences({ minimized: false });
  }, [updateState]);

  const minimizeChat = useCallback(() => {
    updateState({ isOpen: false });
    savePreferences({ minimized: true });
  }, [updateState]);

  const markAsRead = useCallback(() => {
    updateState({ hasUnreadMessages: false });
  }, [updateState]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [], error: null }));
    clearSession();

    // Generate new session
    const newSessionId = generateSessionId();
    saveSessionId(newSessionId);
    setState(prev => ({ ...prev, sessionId: newSessionId }));
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      hasUnreadMessages: prev.isOpen ? false : true,
    }));

    return newMessage;
  }, []);

  const updateLastMessage = useCallback((updates: Partial<Message>) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map((msg, index) =>
        index === prev.messages.length - 1 ? { ...msg, ...updates } : msg
      ),
    }));
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || state.isLoading) {
      return;
    }

    // Rate limiting check
    if (isRateLimited()) {
      updateState({
        error: 'Demasiados mensajes. Por favor espera un momento antes de enviar otro mensaje.',
      });
      return;
    }

    // Update rate limiting counters
    lastMessageTime.current = Date.now();
    messageCount.current += 1;

    // Clear any previous errors
    updateState({ error: null, isLoading: true });

    // Add user message
    addMessage({ text: text.trim(), sender: 'user' });

    try {
      // Show typing indicator
      updateState({ isTyping: true });

      // Send to bot
      const response = await sendMessageToBot(text.trim(), state.sessionId);

      // Add bot response
      addMessage({ text: response, sender: 'bot' });

    } catch (error) {
      console.error('Chat error:', error);

      let errorMessage = 'Ha ocurrido un error. Por favor inténtalo de nuevo.';

      if (error instanceof ChatApiError) {
        switch (error.code) {
          case 'TIMEOUT':
            errorMessage = 'La conexión ha tardado demasiado. Por favor inténtalo de nuevo.';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
            break;
          case 'HTTP_ERROR':
            errorMessage = 'Error del servidor. Por favor inténtalo más tarde.';
            break;
          default:
            errorMessage = error.message;
        }
      }

      // Add error message
      addMessage({
        text: errorMessage,
        sender: 'bot',
        isError: true
      });

      updateState({ error: errorMessage });

    } finally {
      updateState({
        isLoading: false,
        isTyping: false
      });
    }
  }, [state.sessionId, state.isLoading, isRateLimited, updateState, addMessage]);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...state.messages]
      .reverse()
      .find(msg => msg.sender === 'user');

    if (lastUserMessage) {
      // Remove the last error message
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => !msg.isError),
        error: null,
      }));

      await sendMessage(lastUserMessage.text);
    }
  }, [state.messages, sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    openChat,
    closeChat,
    minimizeChat,
    sendMessage,
    clearMessages,
    markAsRead,
    retryLastMessage,
  };
}