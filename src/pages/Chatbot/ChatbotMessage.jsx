// src/pages/ChatbotMessages.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { tokenStorage } from '../../utils/auth';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ChatbotMessages = () => {
  const { chatbotId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch chat sessions based on chatbotId
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    setError(null);
    try {
      const token = tokenStorage.getToken();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoadingSessions(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/sessions/?chatbot_id=${chatbotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let fetchedSessions = [];
      if (response.data && Array.isArray(response.data.sessions)) {
        fetchedSessions = response.data.sessions;
      } else if (response.data && Array.isArray(response.data.results)) {
        fetchedSessions = response.data.results;
      } else if (Array.isArray(response.data)) {
        fetchedSessions = response.data;
      } else {
        console.warn("API response for sessions was not an expected array format:", response.data);
        fetchedSessions = [];
      }

      setSessions(fetchedSessions);
      if (fetchedSessions.length > 0) {
        setSelectedSession(fetchedSessions[0]);
      } else {
        setSelectedSession(null);
      }

    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || `Failed to load chat sessions. Status: ${err.response.status}`);
      } else {
        setError("Network error or unexpected issue. Failed to load chat sessions.");
      }
    } finally {
      setLoadingSessions(false);
    }
  }, [chatbotId]);

  // Function to fetch messages for a specific session
  const fetchMessages = useCallback(async (sessionId) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const token = tokenStorage.getToken();
      if (!token) {
        setError("Authentication required to fetch messages.");
        setLoadingMessages(false);
        return;
      }


      const response = await axios.get(`${API_BASE_URL}/messages/?session_id=${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)

      let fetchedMessages = [];

      if (response.data && Array.isArray(response.data.messages)) {
        fetchedMessages = response.data.messages;
      } else if (response.data && Array.isArray(response.data.results)) { 
        fetchedMessages = response.data.results;
      } else if (Array.isArray(response.data)) { 
        fetchedMessages = response.data;
      } else {
        console.warn("API response for messages was not an expected array format:", response.data);
        fetchedMessages = [];
      }
      setMessages(fetchedMessages);


    } catch (err) {
      console.error("Failed to fetch messages:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || `Failed to load messages for this session. Status: ${err.response.status}`);
      } else {
        setError("Network error or unexpected issue. Failed to load messages for this session.");
      }
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.session_id);
    } else {
      setMessages([]);
    }
  }, [selectedSession, fetchMessages]);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  const openExportModal = () => {
    const modal = document.getElementById('exportModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeExportModal = () => {
    const modal = document.getElementById('exportModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  if (loadingSessions) {
    return <div className="text-white p-6">Loading sessions...</div>;
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-neutral-800 rounded-lg mx-auto max-w-2xl mb-6 text-center">
        <p className="text-lg font-semibold mb-2">Error:</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section id="messages" className="page-section min-h-screen bg-neutral-900 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Messages for {chatbotId}</h2>
            <p className="text-neutral-400">View conversation history and user interactions</p>
          </div>
          <div className="flex space-x-3">
            <select className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>Customer Support Bot</option>
              <option>Healthcare Assistant</option>
              <option>Finance Advisor</option>
            </select>
            <button onClick={openExportModal} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1 bg-neutral-800 rounded-lg border border-neutral-700 flex flex-col">
          <div className="p-4 border-b border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-3">Chat Sessions</h3>
            <input type="text" placeholder="Search sessions..." className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.session_id || session.id}
                className={`p-4 border-b border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors duration-200 ${selectedSession?.session_id === (session.session_id || session.id) ? 'bg-neutral-700/30' : ''}`}
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex items-start space-x-3">
                  <img src={session.user_avatar || "https://avatar.iran.liara.run/public/1"} alt="User" className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium text-sm truncate">{session.user_name || `Session: ${session.session_id?.substring(0, 8)}...`}</p>
                      <span className="text-xs text-neutral-400">{session.created_at ? new Date(session.created_at).toLocaleString() : "N/A"}</span>
                    </div>
                    <p className="text-neutral-400 text-xs truncate">{session.last_message || "No messages yet"}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${session.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-600 text-neutral-400'}`}>
                        {session.status || "N/A"}
                      </span>
                      <span className="text-neutral-500 text-xs">{session.message_count || 0} messages</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && !loadingSessions && !error && (
              <div className="p-4 text-center text-neutral-400">No chat sessions found for this chatbot.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-neutral-800 rounded-lg border border-neutral-700 flex flex-col">
          {selectedSession ? (
            <>
              <div className="p-4 border-b border-neutral-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={selectedSession.user_avatar || "https://avatar.iran.liara.run/public/1"} alt="User" className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="text-white font-semibold">{selectedSession.user_name || `Session ID: ${selectedSession.session_id?.substring(0, 8)}...`}</h3>
                      <p className="text-neutral-400 text-sm">Session started {selectedSession.created_at ? new Date(selectedSession.created_at).toLocaleString() : "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${selectedSession.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-600 text-neutral-400'}`}>
                      {selectedSession.status || "N/A"}
                    </span>
                    <button className="text-neutral-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="text-white text-center">Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.message_id} className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      {/* Avatar for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                          </svg>
                        </div>
                      )}
                      <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                        <div className={`${message.role === 'user' ? 'bg-teal-500' : 'bg-neutral-700'} rounded-lg p-3 max-w-md`}>
                          <p className="text-white text-sm">{message.content}</p>
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <img src={selectedSession.user_avatar || "https://avatar.iran.liara.run/public/1"} alt="User" className="w-8 h-8 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-400 text-center">No messages in this session.</div>
                )}
              </div>

              <div className="p-4 border-t border-neutral-700">
                <div className="flex items-center space-x-3">
                  <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <button className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400">
              Select a session to view messages.
            </div>
          )}
        </div>
      </div>

      <div id="exportModal" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden" aria-modal="true" aria-hidden="true">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Export Messages</h3>
              <button onClick={closeExportModal} className="text-neutral-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Date Range</label>
                <select className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>All time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Format</label>
                <select className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>PDF</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="includeRatings" className="rounded bg-neutral-700 border-neutral-600 text-teal-500 focus:ring-teal-500" />
                <label htmlFor="includeRatings" className="text-neutral-300 text-sm">Include feedback ratings</label>
              </div>
            </div>
            <div className="flex space-x-3 pt-6">
              <button type="button" onClick={closeExportModal} className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors">Cancel</button>
              <button type="button" className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">Export</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotMessages;