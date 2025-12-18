import { Message, ChatSession } from '@/types/chat';

const STORAGE_KEYS = {
  SESSION_ID: 'tusolucion_chat_session_id',
  MESSAGES: 'tusolucion_chat_messages',
  SESSION_DATA: 'tusolucion_chat_session',
  LAST_ACTIVITY: 'tusolucion_chat_last_activity',
  PREFERENCES: 'tusolucion_chat_preferences',
} as const;

const MAX_MESSAGES = 50;
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

interface ChatPreferences {
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  minimized: boolean;
}

const DEFAULT_PREFERENCES: ChatPreferences = {
  soundEnabled: false,
  theme: 'auto',
  minimized: false,
};

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function safeGetItem(key: string): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('Error writing to localStorage:', error);
    return false;
  }
}

function safeRemoveItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Error removing from localStorage:', error);
    return false;
  }
}

export function saveSessionId(sessionId: string): boolean {
  return safeSetItem(STORAGE_KEYS.SESSION_ID, sessionId);
}

export function getSessionId(): string | null {
  return safeGetItem(STORAGE_KEYS.SESSION_ID);
}

export function saveMessages(messages: Message[]): boolean {
  try {
    // Keep only the last MAX_MESSAGES
    const messagesToSave = messages.slice(-MAX_MESSAGES);

    const messagesData = messagesToSave.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      timestamp: msg.timestamp.toISOString(),
      isError: msg.isError || false,
    }));

    return safeSetItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesData));
  } catch (error) {
    console.warn('Error saving messages:', error);
    return false;
  }
}

export function getMessages(): Message[] {
  try {
    const stored = safeGetItem(STORAGE_KEYS.MESSAGES);
    if (!stored) return [];

    const messagesData = JSON.parse(stored);

    if (!Array.isArray(messagesData)) return [];

    return messagesData
      .map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        isError: msg.isError || false,
      }))
      .filter((msg: Message) =>
        msg.id &&
        msg.text &&
        (msg.sender === 'user' || msg.sender === 'bot') &&
        msg.timestamp instanceof Date &&
        !isNaN(msg.timestamp.getTime())
      );
  } catch (error) {
    console.warn('Error loading messages:', error);
    return [];
  }
}

export function saveSession(session: ChatSession): boolean {
  try {
    const sessionData = {
      id: session.id,
      createdAt: session.createdAt.toISOString(),
      lastActivity: session.lastActivity.toISOString(),
    };

    const success1 = safeSetItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
    const success2 = saveMessages(session.messages);
    const success3 = updateLastActivity();

    return success1 && success2 && success3;
  } catch (error) {
    console.warn('Error saving session:', error);
    return false;
  }
}

export function getSession(): ChatSession | null {
  try {
    const sessionStr = safeGetItem(STORAGE_KEYS.SESSION_DATA);
    const messages = getMessages();

    if (!sessionStr) return null;

    const sessionData = JSON.parse(sessionStr);

    const session: ChatSession = {
      id: sessionData.id,
      messages,
      createdAt: new Date(sessionData.createdAt),
      lastActivity: new Date(sessionData.lastActivity),
    };

    // Check if session has expired
    if (isSessionExpired(session.lastActivity)) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.warn('Error loading session:', error);
    return null;
  }
}

export function clearSession(): boolean {
  try {
    const success1 = safeRemoveItem(STORAGE_KEYS.SESSION_ID);
    const success2 = safeRemoveItem(STORAGE_KEYS.MESSAGES);
    const success3 = safeRemoveItem(STORAGE_KEYS.SESSION_DATA);
    const success4 = safeRemoveItem(STORAGE_KEYS.LAST_ACTIVITY);

    return success1 || success2 || success3 || success4; // Return true if at least one succeeded
  } catch (error) {
    console.warn('Error clearing session:', error);
    return false;
  }
}

export function updateLastActivity(): boolean {
  return safeSetItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
}

export function getLastActivity(): Date | null {
  try {
    const timestamp = safeGetItem(STORAGE_KEYS.LAST_ACTIVITY);
    if (!timestamp) return null;

    const date = new Date(parseInt(timestamp, 10));
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function isSessionExpired(lastActivity: Date): boolean {
  const now = new Date();
  const timeDiff = now.getTime() - lastActivity.getTime();
  return timeDiff > SESSION_TIMEOUT;
}

export function savePreferences(preferences: Partial<ChatPreferences>): boolean {
  try {
    const currentPrefs = getPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    return safeSetItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
  } catch (error) {
    console.warn('Error saving preferences:', error);
    return false;
  }
}

export function getPreferences(): ChatPreferences {
  try {
    const stored = safeGetItem(STORAGE_KEYS.PREFERENCES);
    if (!stored) return DEFAULT_PREFERENCES;

    const preferences = JSON.parse(stored);
    return { ...DEFAULT_PREFERENCES, ...preferences };
  } catch (error) {
    console.warn('Error loading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function cleanupOldSessions(): boolean {
  try {
    const session = getSession();
    if (session && isSessionExpired(session.lastActivity)) {
      return clearSession();
    }
    return true;
  } catch (error) {
    console.warn('Error cleaning up old sessions:', error);
    return false;
  }
}

export function getStorageInfo() {
  return {
    hasLocalStorage: isLocalStorageAvailable(),
    sessionExists: !!getSession(),
    messageCount: getMessages().length,
    lastActivity: getLastActivity(),
    preferences: getPreferences(),
  };
}

// Initialize cleanup on load
if (typeof window !== 'undefined') {
  // Run cleanup when the module loads
  setTimeout(cleanupOldSessions, 100);

  // Also cleanup on page visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      cleanupOldSessions();
    }
  });
}