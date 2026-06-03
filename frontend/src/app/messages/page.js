"use client";

import { useState, useEffect } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchMessages = async (adminPassword) => {
    setStatus({ loading: true, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch messages. Check password.");
      }

      setMessages(data.messages);
      setIsAuthenticated(true);
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error: error.message });
      setIsAuthenticated(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchMessages(password);
  };

  if (!isAuthenticated) {
    return (
      <main className="container" style={{ marginTop: "6rem" }}>
        <h1>Admin Access</h1>
        <p className="subtitle">Enter the admin password to view messages.</p>
        
        <form onSubmit={handleLogin} className="form-container">
          <div className="input-group">
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input" 
              placeholder="Admin Password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={status.loading || !password}
          >
            {status.loading ? <><span className="spinner"></span> Verifying...</> : "Access Messages"}
          </button>
          
          {status.error && (
            <div className="error-message">
              ⚠️ {status.error}
            </div>
          )}
        </form>
      </main>
    );
  }

  return (
    <main className="container" style={{ marginTop: "6rem", maxWidth: "800px" }}>
      <h1>Inbox</h1>
      <p className="subtitle">You have {messages.length} messages.</p>

      <div className="messages-grid">
        {messages.length === 0 ? (
          <div className="no-messages">No messages found.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <span className="message-email">{msg.email}</span>
                <span className="message-date">{new Date(msg.date).toLocaleString()}</span>
              </div>
              <div className="message-subject">Subject: {msg.subject}</div>
              <div className="message-body">{msg.message}</div>
            </div>
          ))
        )}
      </div>
      
      <button 
        className="submit-btn" 
        style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', fontSize: '0.9rem' }} 
        onClick={() => fetchMessages(password)}
      >
        Refresh Inbox
      </button>
    </main>
  );
}
