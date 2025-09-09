import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Contact } from '../api/contacts';

interface WebSocketMessage {
  id: number;
  processed_rows: number;
  failed_rows: number;
  total_rows: number;
  status: string;
}

export const useImportProgress = (userId: number) => {
  const [progress, setProgress] = useState<WebSocketMessage | null>(null);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        setConnected(true);
        
        client.subscribe(`/topic/imports/${userId}`, (message) => {
          try {
            const body = JSON.parse(message.body);
            console.log('Import progress update:', body);
            setProgress(body);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userId]);

  return { progress, connected };
};

export const useWebSocket = (url: string, topics: string[]) => {
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS(url);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        
        topics.forEach(topic => {
          client.subscribe(topic, (message) => {
            try {
              const body = JSON.parse(message.body);
              setMessages(prev => ({
                ...prev,
                [topic]: body
              }));
            } catch (error) {
              console.error('Failed to parse message:', error);
            }
          });
        });
      },
      onDisconnect: () => {
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [url, topics]);

  return { messages, connected };
};

export interface ContactUpdateMessage {
  type: 'CONTACT_CREATED' | 'CONTACT_UPDATED' | 'CONTACT_DELETED' | 'BULK_UPDATE';
  contact?: Contact;
  contactIds?: number[];
  changes?: Record<string, any>;
  userId: number;
}

export const useContactUpdates = (userId: number, onContactUpdate?: (message: ContactUpdateMessage) => void) => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Contact updates WebSocket connected');
        setConnected(true);
        
        client.subscribe(`/topic/contacts/${userId}`, (message) => {
          try {
            const body = JSON.parse(message.body) as ContactUpdateMessage;
            console.log('Contact update received:', body);
            if (onContactUpdate) {
              onContactUpdate(body);
            }
          } catch (error) {
            console.error('Failed to parse contact update message:', error);
          }
        });
      },
      onDisconnect: () => {
        console.log('Contact updates WebSocket disconnected');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('Contact updates STOMP error:', frame);
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userId, onContactUpdate]);

  return { connected };
};