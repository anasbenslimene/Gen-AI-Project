import React from 'react';
import { FaBookOpen, FaNetworkWired } from 'react-icons/fa';

export default function RightSidebar({ sources, isTyping }) {
  return (
    <div className="sidebar-right">
      <div className="panel-header">
        <FaNetworkWired />
        <span>RAG Sources</span>
      </div>
      
      <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <p>Retrieved passages used by the AI to generate the answer.</p>
      </div>

      <div className="scroll-area">
        {isTyping ? (
          <div className="loader-container">
            <div className="spinner" style={{ width: '30px', height: '30px', borderWidth: '2px' }}></div>
            <p style={{ fontSize: '0.85rem' }}>Searching document...</p>
          </div>
        ) : sources && sources.length > 0 ? (
          sources.map((source, idx) => (
            <div key={idx} className="source-card">
              <div className="source-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FaBookOpen style={{ color: 'var(--accent-purple)' }} />
                  Page {source.pageNumber}
                </span>
                <span className="source-badge">{source.score}% Match</span>
              </div>
              <div className="source-text">
                {source.text}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
            <FaBookOpen style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.5 }} />
            <p>No sources retrieved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
