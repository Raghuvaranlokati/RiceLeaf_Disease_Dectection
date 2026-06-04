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


    </main>
  );
}
