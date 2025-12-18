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

    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        chatInput: sanitizedMessage,
        sessionId: sessionId,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ChatApiError(
        `Server error: ${response.statusText}`,
        response.status,
        'HTTP_ERROR'
      );
    }

    const data: ChatResponse = await response.json();

    if (!data || typeof data !== 'object') {
      throw new ChatApiError('Invalid response format', 0, 'INVALID_RESPONSE');
    }

    const botMessage = data.output || data.response;

    if (!botMessage || typeof botMessage !== 'string') {
      throw new ChatApiError('No valid message in response', 0, 'EMPTY_RESPONSE');
    }

    return sanitizeResponse(botMessage);

  } catch (error) {
    if (error instanceof ChatApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ChatApiError('Request timeout: Server took too long to respond', 0, 'TIMEOUT');
      }

      if (error.message.includes('fetch')) {
        throw new ChatApiError('Connection error: Unable to reach chat server', 0, 'NETWORK_ERROR');
      }
    }

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
  try {
    return await makeApiRequest(message, sessionId);
  } catch (error) {
    if (error instanceof ChatApiError && retryCount < DEFAULT_CONFIG.maxRetries) {
      // Only retry on network errors or timeouts
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendMessageToBot(message, sessionId, retryCount + 1);
      }
    }

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