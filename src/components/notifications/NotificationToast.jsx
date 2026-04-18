import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const toastIcons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

export default function NotificationToast() {
  const { toasts, dismissToast } = useNotifications();
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          <span className="toast-icon">{toastIcons[toast.type] || '🔔'}</span>
          <div className="toast-body">
            {toast.title && <p className="toast-title">{toast.title}</p>}
            <p className="toast-message">{toast.message}</p>
          </div>
          <button className="toast-close" onClick={() => dismissToast(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
