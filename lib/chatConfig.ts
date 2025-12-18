export const CHAT_CONFIG = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_CHAT_API_ENDPOINT || 'http://172.29.89.163:5678/webhook/chat-bienvenida',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  MAX_MESSAGES: 50,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT: {
    MAX_MESSAGES_PER_MINUTE: 10,
    MIN_MESSAGE_INTERVAL: 2000, // 2 seconds
  },
} as const;