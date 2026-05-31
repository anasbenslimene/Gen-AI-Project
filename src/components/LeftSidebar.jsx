import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaFilePdf, FaRobot, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function LeftSidebar({ onUpload, fileInfo, isProcessing }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === "application/pdf") {
      onUpload(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  return (
    <div className="sidebar-left">
      <div className="logo-container">
        <FaRobot className="logo-icon" />
        <span className="logo-text">EduBot PDF</span>
      </div>

      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          accept=".pdf" 
          style={{ display: "none" }} 
        />
        {isProcessing ? (
          <>
            <div className="spinner"></div>
            <p className="upload-text">Processing PDF...</p>
          </>
        ) : (
          <>
            <FaCloudUploadAlt className="upload-icon" />
            <p className="upload-text">Drag & Drop your PDF here<br/>or click to browse</p>
          </>
        )}
      </div>

      {fileInfo && (
        <div className="doc-card">
          <div className="doc-card-header">
            <FaFilePdf />
            <span>Document Ready</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>{fileInfo.fileName}</strong>
            <p style={{ margin: '5px 0 0 0' }}>{fileInfo.numPages} pages indexed.</p>
            <p style={{ margin: '5px 0 0 0' }}>{fileInfo.chunksCount} text chunks stored.</p>
          </div>
        </div>
      )}

      <div className="status-indicator">
        <div className={`status-dot ${fileInfo ? 'active' : ''}`}></div>
        <span>{fileInfo ? 'AI Ready to Answer' : 'Waiting for Document'}</span>
      </div>
    </div>
  );
}
