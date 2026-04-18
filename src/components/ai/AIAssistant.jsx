import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../api';
import { useCart } from '../../context/CartContext';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI shopping assistant. Ask me anything — product recommendations, size guides, or deal alerts! ✦' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { items } = useCart();

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(input, { cartItems: items });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      {/* Chat Panel */}
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar">✦</div>
              <div>
                <p className="ai-name">Nexus AI</p>
                <p className="ai-status">Shopping Assistant • Online</p>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role}`}>
                {msg.role === 'assistant' && <div className="ai-msg-avatar">✦</div>}
                <div className="ai-msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <div className="ai-msg-avatar">✦</div>
                <div className="ai-msg-bubble ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-input-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="ai-input"
              disabled={loading}
            />
            <button type="submit" className="ai-send-btn" disabled={!input.trim() || loading}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button className="ai-fab" onClick={() => setOpen(!open)} aria-label="AI Assistant">
        {open ? (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <span className="fab-ai-icon">✦</span>
        )}
        {!open && <span className="fab-pulse" />}
      </button>
    </div>
  );
}
