"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      
      setStatus("success");
      setFormData({ email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMsg(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="container">
      <Link href="/" className="connect-btn">← Back to Home</Link>
      
      <h1>Contact Admin</h1>
      <p className="subtitle">Send a message to Raghuvaran</p>

      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Your Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john@example.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Subject</label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            required 
            value={formData.subject} 
            onChange={handleChange} 
            placeholder="How can I help you?"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            required 
            rows="5" 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Sending..." : status === "success" ? "Message Sent! ✓" : "Send Message"}
        </button>

        {status === "error" && <p className={styles.errorMsg}>{errorMsg}</p>}
      </form>
    </main>
  );
}
