"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({ loading: false, error: null, success: true });
      setFormData({ email: "", subject: "", message: "" }); // Reset form
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <main className="container" style={{ marginTop: "6rem" }}>
      <h1>Get In Touch</h1>
      <p className="subtitle">Have a question or feedback? Send a message directly to the admin.</p>

      {status.success ? (
        <div className="success-message">
          ✅ Your message has been sent successfully! The admin will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-group">
            <label className="input-label" htmlFor="email">Your Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange}
              className="glass-input" 
              placeholder="hello@example.com"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange}
              className="glass-input" 
              placeholder="What is this regarding?"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="message">Message *</label>
            <textarea 
              id="message" 
              name="message" 
              required 
              value={formData.message} 
              onChange={handleChange}
              className="glass-input" 
              placeholder="Type your message here..."
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={status.loading || !formData.email || !formData.message}
          >
            {status.loading ? <><span className="spinner"></span> Sending...</> : "Send Message"}
          </button>

          {status.error && (
            <div className="error-message">
              ⚠️ {status.error}
            </div>
          )}
        </form>
      )}
    </main>
  );
}
