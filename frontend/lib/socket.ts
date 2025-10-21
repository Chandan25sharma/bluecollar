import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'location' | 'image';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: 'CLIENT' | 'PROVIDER';
    status: 'online' | 'offline' | 'away';
  }>;
  lastMessage?: Message;
  unreadCount: number;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

interface SocketContextData {
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  unreadCount: number;
  sendMessage: (conversationId: string, content: string, type?: string, location?: any) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markAsRead: (conversationId: string, messageIds: string[]) => void;
  setActiveConversation: (conversationId: string | null) => void;
}

// Custom hook for Socket.IO real-time messaging
export const useSocket = (): SocketContextData => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4001', {
      auth: {
        token: token,
      },
      transports: ['websocket'],
      upgrade: true,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to messaging server');
      setIsConnected(true);
      setSocket(newSocket);
      
      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from messaging server:', reason);
      setIsConnected(false);
      
      // Auto-reconnect after 3 seconds if not manually disconnected
      if (reason !== 'io client disconnect') {
        reconnectTimeoutRef.current = setTimeout(() => {
          newSocket.connect();
        }, 3000);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Message event handlers
    newSocket.on('new_message', (message: Message) => {
      console.log('New message received:', message);
      
      // Update conversations with new message
      setConversations(prev => prev.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount: message.isOwn ? conv.unreadCount : conv.unreadCount + 1,
            updatedAt: message.createdAt,
          };
        }
        return conv;
      }));

      // Update unread count if message is not from current user
      if (!message.isOwn) {
        setUnreadCount(prev => prev + 1);
      }
    });

    newSocket.on('message_read', ({ conversationId, messageIds, readBy }) => {
      console.log('Messages marked as read:', { conversationId, messageIds, readBy });
      
      // Update conversation unread count
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: Math.max(0, conv.unreadCount - messageIds.length),
          };
        }
        return conv;
      }));
    });

    newSocket.on('user_online', ({ userId, status }) => {
      console.log('User status update:', { userId, status });
      
      // Update user online status in conversations
      setConversations(prev => prev.map(conv => ({
        ...conv,
        participants: conv.participants.map(participant => 
          participant.id === userId 
            ? { ...participant, status }
            : participant
        ),
      })));
    });

    newSocket.on('typing_start', ({ conversationId, userId, userName }) => {
      // Handle typing indicators (optional feature)
      console.log(`${userName} is typing in conversation ${conversationId}`);
    });

    newSocket.on('typing_stop', ({ conversationId, userId }) => {
      // Handle stop typing indicators (optional feature)
      console.log(`User stopped typing in conversation ${conversationId}`);
    });

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (conversationId: string, content: string, type: string = 'text', location?: any) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }

    const messageData = {
      conversationId,
      content,
      type,
      location,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', messageData);
  };

  const joinConversation = (conversationId: string) => {
    if (!socket || !isConnected) return;
    
    socket.emit('join_conversation', { conversationId });
    setActiveConversation(conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    if (!socket || !isConnected) return;
    
    socket.emit('leave_conversation', { conversationId });
    setActiveConversation(null);
  };

  const markAsRead = (conversationId: string, messageIds: string[]) => {
    if (!socket || !isConnected) return;
    
    socket.emit('mark_as_read', { conversationId, messageIds });
  };

  return {
    socket,
    isConnected,
    conversations,
    activeConversation,
    unreadCount,
    sendMessage,
    joinConversation,
    leaveConversation,
    markAsRead,
    setActiveConversation,
  };
};

export default useSocket;