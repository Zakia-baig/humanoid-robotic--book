import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  // Scroll to bottom of messages (instant for faster response)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when chatbot is visible
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();

    // Sanitize input to prevent XSS
    const sanitizedMessage = userMessage.replace(/[<>]/g, (match) => {
      return match === '<' ? '&lt;' : '&gt;';
    });

    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    const newMessage = {
      id: Date.now(),
      text: sanitizedMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // Send message to backend API with timeout for faster response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: sanitizedMessage }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Sanitize bot response to prevent XSS
      let sanitizedResponse = data.reply.replace(/[<>]/g, (match) => {
        return match === '<' ? '&lt;' : '&gt;';
      });

      // Check if the response indicates content not found and make it more explicit
      if (sanitizedResponse.includes("couldn't find specific information") ||
          sanitizedResponse.includes("outside the scope") ||
          sanitizedResponse.includes("not found in the book") ||
          sanitizedResponse.includes("not covered in the Humanoid Robotics Book")) {
        sanitizedResponse = "This question is not covered in the Humanoid Robotics Book.";
      }

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: sanitizedResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Check if it's a timeout error
      if (error.name === 'AbortError') {
        // Add timeout error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Request timed out. Please try again with a shorter question.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, there was an error connecting to the book chatbot. Please try again.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // No toggle functionality - chatbot remains visible at all times

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">🤖 Book Assistant</div>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="chatbot-welcome">
            <p>Hello! I'm your Humanoid Robotics Book assistant.</p>
            <p>Ask me questions about humanoid robotics based on the book content only.</p>
            <p>I can answer questions about physical AI, ROS2, Gazebo, Isaac, and Vision Language Action models.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chatbot-message ${message.sender}-message`}
            >
              <div className="message-content">
                {message.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="chatbot-message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about the book..."
          className="chatbot-input"
          rows="1"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="chatbot-send-btn"
        >
          Send
        </button>
      </div>

      {/* Green panel below the chat widget */}
      <div className="chatbot-info-panel">
        <p>Answers based on book content only | Ask about humanoid robotics!</p>
      </div>
    </div>
  );
};

export default Chatbot;