import { useState } from 'react';
import { GeminiChatMessage } from '../types/workflow.types';

export const useChat = () => {
  const [messages, setMessages] = useState<GeminiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! Let’s turn your idea into an intelligent workflow.',
    },
  ]);

  const appendMessage = (message: GeminiChatMessage) => {
    setMessages((prev: GeminiChatMessage[]) => [...prev, message]);
  };

  const reset = () => {
    setMessages((prev: GeminiChatMessage[]) => prev.slice(0, 1));
  };

  return { messages, appendMessage, reset };
};
