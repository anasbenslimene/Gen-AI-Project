import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaUser, FaRobot } from 'react-icons/fa';

export default function Message({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className="avatar">
        {isUser ? <FaUser /> : <FaRobot />}
      </div>
      <div className="message-content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
