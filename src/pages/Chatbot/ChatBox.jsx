// ChatBox.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tokenStorage } from '../../utils/auth';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ChatBox = () => {
  const { chatbotId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [botTypingContent, setBotTypingContent] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTypingContent]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    if (!chatbotId) {
      setError("Chatbot ID is missing from the URL. Cannot send message.");
      return;
    }

    const token = tokenStorage.getToken();
    if (!token) {
      setError("Authentication required. Please log in to chat.");
      return;
    }

    setLoading(true);
    setError(null);

    const userMessage = {
      message_id: Date.now().toString(),
      content: trimmedInput,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setBotTypingContent('');

    try {
      const params = new URLSearchParams();
      params.append('query', trimmedInput);
      if (currentSessionId) params.append('session_id', currentSessionId);

      const response = await axios.post(
        `${API_BASE_URL}/chatbots/${chatbotId}/chat?${params.toString()}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { answer, session_id } = response.data;

      if (session_id && session_id !== currentSessionId) {
        setCurrentSessionId(session_id);
      }

      let i = 0;
      const typingInterval = setInterval(() => {
        setBotTypingContent(answer.slice(0, i));
        i++;
        if (i > answer.length) {
          clearInterval(typingInterval);
          const botMessage = {
            message_id: `${Date.now()}-bot`,
            content: answer || 'No response from bot.',
            role: 'assistant',
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setBotTypingContent('');
        }
      }, 20);

    } catch (err) {
      console.error('Error sending message:', err);
      let errorMessage = 'Failed to get response from chatbot. Please try again.';

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const data = err.response.data;
          errorMessage = `API Error: ${err.response.status} - ${
            typeof data === 'string' ? data :
            data.detail || data.message || data.msg || JSON.stringify(data)
          }`;
        } else if (err.request) {
          errorMessage = "Network Error: Could not connect to the server.";
        } else {
          errorMessage = `Request Error: ${err.message}`;
        }
      } else {
        errorMessage = err.message || 'Unexpected error.';
      }

      setError(errorMessage);
      setMessages((prev) => prev.filter((msg) => msg.message_id !== userMessage.message_id));

    } finally {
      setLoading(false);
    }
  }, [inputValue, currentSessionId, chatbotId]);

  const markdownComponents = {
    p: ({ node, ...props }) => <p className="text-white leading-relaxed" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
    em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
    code: ({ node, inline, className, children, ...props }) =>
      inline ? (
        <code className="bg-gray-800 text-teal-400 px-1 rounded" {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-gray-900 text-teal-400 p-3 rounded overflow-x-auto" {...props}>
          <code>{children}</code>
        </pre>
      ),
    ul: ({ node, ...props }) => <ul className="list-disc list-inside text-white" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-white" {...props} />,
    li: ({ node, ...props }) => <li className="ml-4" {...props} />,
  };

  if (!chatbotId) {
    return (
      <div className="text-red-400 p-8 text-center text-xl">
        Error: Chatbot ID is missing from the URL.
      </div>
    );
  }

  return (
    <section className="page-section min-h-screen bg-neutral-900 p-6 flex flex-col rounded-lg border border-neutral-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !loading && !error && (
          <div className="text-neutral-400 text-center py-10">
            Start a conversation with your chatbot!
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.message_id}
            className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                </svg>
              </div>
            )}
            <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`${message.role === 'user' ? 'bg-teal-500' : 'bg-neutral-700'} rounded-lg p-3 max-w-md`}>
                <ReactMarkdown components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
            {message.role === 'user' && (
              <img
                src="https://avatar.iran.liara.run/public/1"
                alt="User"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
          </div>
        ))}

        {botTypingContent && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <div className="bg-neutral-700 rounded-lg p-3 max-w-md">
                <ReactMarkdown components={markdownComponents}>
                  {botTypingContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-center p-2 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-neutral-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading || !chatbotId}
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            disabled={loading || !inputValue.trim() || !chatbotId}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatBox;