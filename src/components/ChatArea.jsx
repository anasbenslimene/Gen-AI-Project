import React, { useRef, useEffect, useState } from 'react';
import { FaPaperPlane, FaBroom, FaRobot } from 'react-icons/fa';
import Message from './Message';
import SuggestedPrompts from './SuggestedPrompts';

export default function ChatArea({ messages, onSendMessage, isTyping, onClearChat, fileReady }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-header">
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500 }}>Course Assistant</h2>
        {messages.length > 0 && (
          <button 
            onClick={onClearChat}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--border-subtle)', 
              color: 'var(--text-secondary)',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <FaBroom /> Clear
          </button>
        )}
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Welcome to EduBot PDF!</h3>
            <p style={{ marginBottom: '30px' }}>
              {fileReady ? "Your document is ready. Ask me anything about it!" : "Upload a PDF document to start asking questions."}
            </p>
            {fileReady && <SuggestedPrompts onSelect={onSendMessage} />}
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
            {isTyping && (
              <div className="message ai">
                <div className="avatar"><FaRobot /></div>
                <div className="message-content" style={{ padding: '10px 15px' }}>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-container">
        {messages.length > 0 && messages.length < 3 && !isTyping && (
           <SuggestedPrompts onSelect={(p) => { setInput(p); }} />
        )}
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            placeholder={fileReady ? "Ask a question about your document..." : "Please upload a PDF first..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!fileReady || isTyping}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!input.trim() || !fileReady || isTyping}
          >
            <FaPaperPlane style={{ marginLeft: '-2px' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
