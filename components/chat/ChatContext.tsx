'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ChatContextType } from '@/types/chat';
import { useChatLogic } from './useChatLogic';

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatLogic = useChatLogic();

  return (
    <ChatContext.Provider value={chatLogic}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}