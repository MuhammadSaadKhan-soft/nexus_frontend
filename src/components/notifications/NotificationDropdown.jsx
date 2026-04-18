import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const iconMap = {
  order: '📦', promo: '🏷️', system: '⚙️', ai: '✦', default: '🔔',
};

export default function NotificationDropdown({ onClose }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className="notif-dropdown">
      <div className="notif-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={markAllRead}>Mark all read</button>
        )}
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <span>🔔</span>
            <p>All caught up!</p>
          </div>
        ) : (
          notifications.slice(0, 10).map(n => (
            <div
              key={n._id}
              className={`notif-item ${!n.read ? 'unread' : ''}`}
              onClick={() => !n.read && markRead(n._id)}
            >
              <span className="notif-icon">{iconMap[n.type] || iconMap.default}</span>
              <div className="notif-content">
                <p className="notif-title">{n.title}</p>
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{formatTime(n.createdAt)}</span>
              </div>
              {!n.read && <div className="notif-unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString();
}
