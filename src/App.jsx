import React, { useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ChatArea from './components/ChatArea';
import RightSidebar from './components/RightSidebar';
import { processPDF } from './services/pdfProcessor';
import { searchChunks } from './utils/ragEngine';
import { generateAnswer } from './services/geminiService';

export default function App() {
  const [fileInfo, setFileInfo] = useState(null);
  const [pdfChunks, setPdfChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const [currentSources, setCurrentSources] = useState([]);

  const handleUpload = async (file) => {
    setIsProcessing(true);
    try {
      const result = await processPDF(file);
      setPdfChunks(result.chunks);
      setFileInfo({
        fileName: result.fileName,
        numPages: result.numPages,
        chunksCount: result.chunks.length
      });
      // Clear previous chat
      setMessages([]);
      setCurrentSources([]);
    } catch (error) {
      alert("Error processing PDF. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text) => {
    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    
    try {
      // 1. Retrieve relevant chunks
      const relevantChunks = searchChunks(text, pdfChunks, 3);
      setCurrentSources(relevantChunks);
      
      // 2. Generate answer
      let answer;
      if (relevantChunks.length > 0) {
        answer = await generateAnswer(text, relevantChunks);
      } else {
        answer = "I couldn't find any relevant information in the uploaded document to answer your question.";
      }
      
      // 3. Add AI message
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: `**Error:** ${error.message || "Failed to generate answer. Please check your API key."}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentSources([]);
  };

  return (
    <div className="app-container">
      <LeftSidebar 
        onUpload={handleUpload} 
        fileInfo={fileInfo} 
        isProcessing={isProcessing} 
      />
      
      <ChatArea 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isTyping={isTyping} 
        onClearChat={handleClearChat}
        fileReady={!!fileInfo}
      />
      
      <RightSidebar 
        sources={currentSources} 
        isTyping={isTyping} 
      />
    </div>
  );
}
