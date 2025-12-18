import { ChatResponse, ApiError, ChatConfig } from '@/types/chat';
import { CHAT_CONFIG } from '@/lib/chatConfig';

const DEFAULT_CONFIG: ChatConfig = {
  apiEndpoint: CHAT_CONFIG.API_ENDPOINT,
  timeout: CHAT_CONFIG.TIMEOUT,
  maxRetries: CHAT_CONFIG.MAX_RETRIES,
  maxMessages: CHAT_CONFIG.MAX_MESSAGES,
  sessionTimeout: CHAT_CONFIG.SESSION_TIMEOUT,
};

class ChatApiError extends Error implements ApiError {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ChatApiError';
  }
}

function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new ChatApiError('Invalid input: message must be a non-empty string');
  }

  const sanitized = input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (match) => {
      const htmlEntities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
      };
      return htmlEntities[match] || match;
    });

  if (sanitized.length === 0) {
    throw new ChatApiError('Invalid input: message cannot be empty after sanitization');
  }

  if (sanitized.length > 1000) {
    throw new ChatApiError('Invalid input: message too long (max 1000 characters)');
  }

  return sanitized;
}

function sanitizeResponse(response: string): string {
  if (!response || typeof response !== 'string') {
    return 'Error: Invalid response from server';
  }

  return response
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

async function makeApiRequest(
  message: string,
  sessionId: string,
  config: ChatConfig = DEFAULT_CONFIG
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const sanitizedMessage = sanitizeInput(message);

    console.log('🚀 [CHAT] Enviando mensaje a n8n:', {
      endpoint: config.apiEndpoint,
      sessionId,
      message: sanitizedMessage,
      timestamp: new Date().toISOString()
    });

    const requestBody = {
      chatInput: sanitizedMessage,
      sessionId: sessionId,
    };

    console.log('📤 [CHAT] Payload enviado a n8n:', requestBody);

    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    console.log('📡 [CHAT] Respuesta HTTP de n8n:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    });

    if (!response.ok) {
      console.error('❌ [CHAT] Error HTTP de n8n:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new ChatApiError(
        `Server error: ${response.statusText}`,
        response.status,
        'HTTP_ERROR'
      );
    }

    const data: ChatResponse = await response.json();

    console.log('📥 [CHAT] Datos recibidos de n8n:', data);

    if (!data || typeof data !== 'object') {
      console.error('❌ [CHAT] Formato de respuesta inválido de n8n:', data);
      throw new ChatApiError('Invalid response format', 0, 'INVALID_RESPONSE');
    }

    const botMessage = data.output || data.response;

    console.log('💬 [CHAT] Mensaje del bot extraído:', {
      botMessage,
      dataKeys: Object.keys(data),
      messageType: typeof botMessage
    });

    if (!botMessage || typeof botMessage !== 'string') {
      console.error('❌ [CHAT] No se encontró mensaje válido en la respuesta de n8n:', {
        data,
        botMessage,
        output: data.output,
        response: data.response
      });
      throw new ChatApiError('No valid message in response', 0, 'EMPTY_RESPONSE');
    }

    const sanitizedResponse = sanitizeResponse(botMessage);
    console.log('✅ [CHAT] Mensaje procesado exitosamente:', {
      originalMessage: botMessage,
      sanitizedMessage: sanitizedResponse,
      timestamp: new Date().toISOString()
    });

    return sanitizedResponse;

  } catch (error) {
    console.error('❌ [CHAT] Error en comunicación con n8n:', {
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      sessionId,
      timestamp: new Date().toISOString()
    });

    if (error instanceof ChatApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('⏰ [CHAT] Timeout en n8n - El servidor tardó demasiado en responder');
        throw new ChatApiError('Request timeout: Server took too long to respond', 0, 'TIMEOUT');
      }

      if (error.message.includes('fetch')) {
        console.error('🌐 [CHAT] Error de red con n8n - No se pudo conectar al servidor');
        throw new ChatApiError('Connection error: Unable to reach chat server', 0, 'NETWORK_ERROR');
      }
    }

    console.error('💥 [CHAT] Error inesperado con n8n:', error);
    throw new ChatApiError('Unexpected error occurred', 0, 'UNKNOWN_ERROR');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function sendMessageToBot(
  message: string,
  sessionId: string,
  retryCount: number = 0
): Promise<string> {
  console.log('🔄 [CHAT] Iniciando envío de mensaje:', {
    message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
    sessionId,
    retryCount,
    timestamp: new Date().toISOString()
  });

  try {
    const result = await makeApiRequest(message, sessionId);
    console.log('✅ [CHAT] Mensaje enviado exitosamente a n8n');
    return result;
  } catch (error) {
    console.log('🚨 [CHAT] Error al enviar mensaje a n8n:', {
      error: error instanceof Error ? error.message : String(error),
      retryCount,
      maxRetries: DEFAULT_CONFIG.maxRetries
    });

    if (error instanceof ChatApiError && retryCount < DEFAULT_CONFIG.maxRetries) {
      // Only retry on network errors or timeouts
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
        console.log('🔁 [CHAT] Reintentando en', delay, 'ms. Intento', retryCount + 1, 'de', DEFAULT_CONFIG.maxRetries);
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendMessageToBot(message, sessionId, retryCount + 1);
      }
    }

    console.error('💀 [CHAT] Error final - no se reintentará:', error);
    throw error;
  }
}

export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `chat_${timestamp}_${randomPart}`;
}

export function validateSessionId(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }

  // Check format: chat_timestamp_randompart
  const pattern = /^chat_\d{13}_[a-z0-9]{13}$/;
  return pattern.test(sessionId);
}

export function isValidMessage(message: string): boolean {
  try {
    sanitizeInput(message);
    return true;
  } catch {
    return false;
  }
}

export { ChatApiError, DEFAULT_CONFIG };