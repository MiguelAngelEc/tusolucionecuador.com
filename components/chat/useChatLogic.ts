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
        console.log('🚀 [CHAT] Inicializando sistema de chat...');

        // Load existing session
        let sessionId = getSessionId();
        if (!sessionId) {
          sessionId = generateSessionId();
          saveSessionId(sessionId);
          console.log('🆔 [CHAT] Nueva sesión creada:', sessionId);
        } else {
          console.log('🆔 [CHAT] Sesión existente cargada:', sessionId);
        }

        // Load existing messages
        const messages = getMessages();
        console.log('📚 [CHAT] Mensajes cargados:', messages.length, 'mensajes');

        // Load preferences
        const preferences = getPreferences();
        console.log('⚙️ [CHAT] Preferencias cargadas:', preferences);

        console.log('🔧 [CHAT] Configuración de n8n:', {
          endpoint: process.env.NEXT_PUBLIC_CHAT_API_ENDPOINT || 'http://172.29.89.163:5678/webhook/chat-bienvenida',
          environment: process.env.NODE_ENV
        });

        setState(prev => ({
          ...prev,
          sessionId,
          messages,
          isOpen: preferences.minimized ? false : prev.isOpen,
        }));

        console.log('✅ [CHAT] Chat inicializado correctamente');
      } catch (error) {
        console.error('❌ [CHAT] Error al inicializar chat:', error);
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

    console.log('💬 [CHAT] Añadiendo mensaje al chat:', {
      sender: newMessage.sender,
      text: newMessage.text.substring(0, 100) + (newMessage.text.length > 100 ? '...' : ''),
      isError: newMessage.isError,
      messageId: newMessage.id,
      timestamp: newMessage.timestamp
    });

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
    console.log('📝 [CHAT] Usuario envía mensaje:', {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      sessionId: state.sessionId,
      isLoading: state.isLoading,
      timestamp: new Date().toISOString()
    });

    if (!text.trim() || state.isLoading) {
      console.log('❌ [CHAT] Mensaje rechazado - texto vacío o chat cargando');
      return;
    }

    // Rate limiting check
    if (isRateLimited()) {
      console.log('⚠️ [CHAT] Mensaje rechazado - límite de velocidad alcanzado');
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
      console.log('⌨️ [CHAT] Mostrando indicador de escribiendo...');

      // Send to bot
      console.log('🤖 [CHAT] Enviando mensaje a n8n...');
      const response = await sendMessageToBot(text.trim(), state.sessionId);

      console.log('📨 [CHAT] Respuesta recibida de n8n:', {
        response: response.substring(0, 200) + (response.length > 200 ? '...' : ''),
        responseLength: response.length,
        timestamp: new Date().toISOString()
      });

      // Add bot response
      addMessage({ text: response, sender: 'bot' });

    } catch (error) {
      console.error('❌ [CHAT] Error en el flujo de chat:', {
        error,
        errorType: error instanceof ChatApiError ? 'ChatApiError' : 'Other',
        errorCode: error instanceof ChatApiError ? error.code : 'N/A',
        sessionId: state.sessionId,
        timestamp: new Date().toISOString()
      });

      let errorMessage = 'Ha ocurrido un error. Por favor inténtalo de nuevo.';

      if (error instanceof ChatApiError) {
        switch (error.code) {
          case 'TIMEOUT':
            errorMessage = 'La conexión ha tardado demasiado. Por favor inténtalo de nuevo.';
            console.log('⏰ [CHAT] Error de timeout detectado');
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
            console.log('🌐 [CHAT] Error de red detectado');
            break;
          case 'HTTP_ERROR':
            errorMessage = 'Error del servidor. Por favor inténtalo más tarde.';
            console.log('🔧 [CHAT] Error HTTP detectado');
            break;
          default:
            errorMessage = error.message;
            console.log('❓ [CHAT] Error desconocido de ChatAPI:', error.message);
        }
      } else {
        console.log('💥 [CHAT] Error no relacionado con ChatAPI:', error);
      }

      // Add error message
      addMessage({
        text: errorMessage,
        sender: 'bot',
        isError: true
      });

      updateState({ error: errorMessage });

    } finally {
      console.log('🏁 [CHAT] Finalizando envío de mensaje');
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