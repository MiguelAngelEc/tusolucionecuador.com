export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

export interface ChatResponse {
  output?: string;
  response?: string;
  status?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export interface ChatState {
  isOpen: boolean;
  isLoading: boolean;
  isTyping: boolean;
  messages: Message[];
  sessionId: string;
  hasUnreadMessages: boolean;
  error: string | null;
}

export interface ChatConfig {
  apiEndpoint: string;
  timeout: number;
  maxRetries: number;
  maxMessages: number;
  sessionTimeout: number;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export interface ChatContextType {
  state: ChatState;
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  markAsRead: () => void;
  retryLastMessage: () => Promise<void>;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export interface ChatHeaderProps {
  onClose: () => void;
  onMinimize?: () => void;
  unreadCount?: number;
}

export interface TypingIndicatorProps {
  show: boolean;
}

export interface ChatWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark' | 'auto';
}

export type ChatEventType =
  | 'chat_opened'
  | 'chat_closed'
  | 'chat_minimized'
  | 'message_sent'
  | 'message_received'
  | 'error_occurred'
  | 'session_started'
  | 'session_ended';

export interface ChatAnalyticsEvent {
  type: ChatEventType;
  timestamp: Date;
  sessionId: string;
  messageCount?: number;
  errorType?: string;
  userAgent?: string;
}