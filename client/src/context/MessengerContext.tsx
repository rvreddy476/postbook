import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  isGroup?: boolean;
}

interface MessengerContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  activeChats: User[];
  openChat: (user: User) => void;
  closeChat: (userId: string) => void;
}

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export function MessengerProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<User[]>([]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openChat = (user: User) => {
    // Check if already open
    if (activeChats.find(u => u.id === user.id)) return;

    // Max 2 chats
    setActiveChats(prev => {
      const newChats = [...prev, user];
      if (newChats.length > 2) {
        return newChats.slice(newChats.length - 2);
      }
      return newChats;
    });
  };

  const closeChat = (userId: string) => {
    setActiveChats(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <MessengerContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar, activeChats, openChat, closeChat }}>
      {children}
    </MessengerContext.Provider>
  );
}

export function useMessenger() {
  const context = useContext(MessengerContext);
  if (context === undefined) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
}