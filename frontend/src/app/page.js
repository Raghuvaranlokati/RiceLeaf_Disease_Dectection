"use client";

import { useState, useRef, useEffect } from "react";
import "./globals.css";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError(null);
    setResult(null);
    
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (isLoading) {
      setLoadingTime(0);
      timerRef.current = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading]);

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setLoadingTime(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || "Prediction failed. Please try again.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="container" style={{ marginTop: "6rem" }}>
      <h1>Rice Leaf Disease Detector</h1>
      <p className="subtitle">Identify diseases instantly using deep learning.</p>

      {!preview ? (
        <div 
          className={`upload-zone ${isDragActive ? "active" : ""}`}
          onClick={triggerFileInput}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="file-input"
          />
          <span className="upload-icon">🌾</span>
          <h3>Drag & Drop leaf image</h3>
          <p>or click to browse from device</p>
        </div>
      ) : (
        <div className="preview-container">
          <img src={preview} alt="Leaf Preview" className="image-preview" />
          
          <button 
            className="predict-btn" 
            onClick={result ? resetForm : handlePredict}
            disabled={isLoading || loadingTime >= 300}
          >
            {isLoading ? (
              <><span className="spinner"></span> Running Analysis...</>
            ) : result ? (
              "Analyze Another Leaf"
            ) : (
              "Start Prediction"
            )}
          </button>
          
          {isLoading && loadingTime >= 5 && loadingTime < 300 && (
            <div className="funny-message">
              <p>My backend is sleeping 😴💤!</p>
              <p>It will take 1 - 3 mins to wake up because I am using it freely.</p>
              <div className="timer-display">
                {Math.floor(loadingTime / 60).toString().padStart(2, '0')}:
                {(loadingTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}

          {isLoading && loadingTime >= 300 && (
            <div className="error-message timeout-message">
              <p>Not responding! 😢</p>
              <p>Please connect with the admin by mailing <a href="mailto:raghuvaranlokati@gmail.com">raghuvaranlokati@gmail.com</a></p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="result-card">
          <div className="result-title">Detected Condition</div>
          <div className="disease-name">{result.disease}</div>
          
          {result.breakdown && (
            <div>
              <div className="breakdown-title">Confidence Breakdown</div>
              {Object.entries(result.breakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([name, val]) => (
                  <div key={name} className="breakdown-row">
                    <div className="breakdown-label">
                      <span>{name}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="confidence-bar-bg">
                      <div 
                        className={`confidence-bar-fill ${name === result.disease ? "" : "secondary"}`} 
                        style={{ width: `${val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      <footer className="footer" style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        Love by <a href="https://github.com/raghuvaranlokati" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Raghuvaran</a>
        <a href="https://github.com/raghuvaranlokati" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </footer>
    </main>
  );
}
