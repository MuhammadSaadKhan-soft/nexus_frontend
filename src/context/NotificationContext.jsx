import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationAPI } from '../api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const { user } = useAuth();

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user) return;

    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NOTIFICATION') {
        const notif = data.payload;
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        addToast(notif);
      }
    };

    // Load existing notifications
    notificationAPI.getAll()
      .then(res => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      })
      .catch(console.error);

    return () => ws.close();
  }, [user]);

  const addToast = useCallback((notification) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, ...notification }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const pushToast = useCallback((message, type = 'info') => {
    addToast({ message, type, title: type.charAt(0).toUpperCase() + type.slice(1) });
  }, [addToast]);

  const markRead = useCallback(async (id) => {
    await notificationAPI.markRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, toasts, unreadCount, connected,
      markRead, markAllRead, dismissToast, pushToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
