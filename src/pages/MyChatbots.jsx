import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tokenStorage } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import CreateChatbotModal from '../components/CreateChatbotModal'; // Import the modal component

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyChatbots = () => {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  const fetchChatbots = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = tokenStorage.getToken();
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/chatbots/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatbots(response.data);
    } catch (err) {
      console.error('Error fetching chatbots:', err);
      if (err.response) {
        setError(err.response.data.detail || 'Failed to fetch chatbots.');
      } else {
        setError('Network error or unexpected issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleChatbotCreated = (newChatbotId) => {

    fetchChatbots(); 
    setIsModalOpen(false); 
  
  };

  const handleView = (chatbotId) => {
    navigate(`/dashboard/chatbots/${chatbotId}/chat`);
  };

  const handleEdit = (chatbotId) => {
    navigate(`/dashboard/chatbots/${chatbotId}/edit`);
  };

  const handleDelete = async (chatbotId, chatbotName) => {
    if (window.confirm(`Are you sure you want to delete "${chatbotName}"? This action cannot be undone.`)) {
      try {
        const token = tokenStorage.getToken();
        if (!token) {
          setError("Authentication token missing. Please log in.");
          return;
        }

        await axios.delete(`${API_BASE_URL}/chatbots/${chatbotId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChatbots(chatbots.filter(cb => cb.chatbot_id !== chatbotId)); 
        alert('Chatbot deleted successfully!');
      } catch (err) {
        console.error('Error deleting chatbot:', err);
        if (err.response) {
          setError(err.response.data.detail || 'Failed to delete chatbot.');
        } else {
          setError('Network error or unexpected issue.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="text-white p-8 text-center text-xl">
        <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading your chatbots...
      </div>
    );
  }

  return (
    <div className="text-white p-4 sm:p-8"> 
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Chatbots</h1>

        
        <button   onClick={() => setIsModalOpen(true)} class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
        </svg>
        <span>Create Chatbot</span>
      </button>
   
      </div>

      {error && (
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
      )}

      {chatbots.length === 0 ? (
        <div className="bg-neutral-800 p-8 rounded-lg text-center border border-neutral-700">
          <p className="text-gray-400 text-lg mb-4">You don't have any chatbots yet.</p>
          <button
            onClick={() => setIsModalOpen(true)} 
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
            </svg>
            Create Your First Chatbot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <div key={chatbot.chatbot_id} className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors duration-200 flex flex-col justify-between"> {/* Added flex-col and justify-between for consistent height */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{chatbot.name}</h3>
                      <p className="text-sm text-neutral-400">{chatbot.business_name}</p>
                    </div>
                  </div>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium ml-auto">Active</span> 
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Created:</span>
                    <span className="text-white">
                      {new Date(chatbot.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Updated:</span>
                    <span className="text-white">
                      {new Date(chatbot.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                 
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Messages:</span>
                    <span className="text-white">{chatbot.total_messages || '0'}</span> 
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Impressions:</span>
                    <span className="text-white">{chatbot.total_impressions || '0'}</span> 
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4"> 
                <button
                  onClick={() => handleView(chatbot.chatbot_id)}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                  View
                </button>
               
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateChatbotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChatbotCreated={handleChatbotCreated}
      />
    </div>
  );
};

export default MyChatbots;