"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../contact/page.module.css";

export default function Messages() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${password}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Invalid password or unauthorized");
      }
      
      const data = await res.json();
      setMessages(data.messages || []);
      setIsAuthenticated(true);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMsg(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container">
        <Link href="/" className="connect-btn">← Back to Home</Link>
        <h1>Admin Login</h1>
        <p className="subtitle">Enter password to view messages</p>
        
        <form className={styles.contactForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter ADMIN_PASSWORD"
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
            {status === "loading" ? "Checking..." : "Login"}
          </button>
          {status === "error" && <p className={styles.errorMsg}>{errorMsg}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/" className="connect-btn">← Back to Home</Link>
      <h1>Inbox ({messages.length})</h1>
      <p className="subtitle">Temporary messages store (Resets on server sleep)</p>
      
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {messages.length === 0 ? (
          <div className="result-card" style={{ textAlign: 'center' }}>No messages yet!</div>
        ) : (
          messages.slice().reverse().map((msg) => (
            <div key={msg.id} className="result-card" style={{ marginBottom: '15px', textAlign: 'left' }}>
              <div className="disease-name" style={{ fontSize: '1.2rem' }}>{msg.subject}</div>
              <div style={{ color: '#aed581', marginBottom: '10px', fontSize: '0.9rem' }}>
                From: {msg.email} &bull; {new Date(msg.date).toLocaleString()}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
