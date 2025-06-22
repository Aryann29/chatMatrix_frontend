import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { tokenStorage, authAPI } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Sidebar = () => {
  const location = useLocation();
  const { chatbotId } = useParams();
  const isAuthenticated = tokenStorage.isAuthenticated();

  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [chatbot, setChatbot] = useState(null);
  const [loadingChatbot, setLoadingChatbot] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getToken();
    if (!token) return;

    const fetchUserDetails = async () => {
      try {
        setLoadingUser(true);
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(res.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setUserDetails(null);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchChatbotDetails = async () => {
      if (!chatbotId) {
        setChatbot(null);
        return;
      }

      try {
        setLoadingChatbot(true);
        const res = await axios.get(`${API_BASE_URL}/chatbots/${chatbotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatbot(res.data);
      } catch (err) {
        console.error('Error fetching chatbot details:', err);
        setChatbot(null);
      } finally {
        setLoadingChatbot(false);
      }
    };

    fetchUserDetails();
    fetchChatbotDetails();
  }, [chatbotId]);

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };

  const isExactly = (path) => location.pathname === path;
  const isActive = (path) => location.pathname.startsWith(path);
  const isChatbotSubPageActive = (subPath) =>
    location.pathname.startsWith(`/dashboard/chatbots/${chatbotId}${subPath}`);

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-neutral-900 text-white shadow-lg flex flex-col z-40">
      <div className="flex-shrink-0 flex items-center justify-center h-16 sm:h-20 bg-neutral-800 border-b border-neutral-700">
        <Link to="/" className="text-3xl font-bold text-white">
          ChatMatrix
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {isAuthenticated ? (
          <>


            <Link
              to="/dashboard/my-chatbots"
              className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                isActive('/dashboard/my-chatbots')
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>My Chatbots</span>
            </Link>

            {loadingChatbot && (
              <div className="text-center p-4 text-neutral-400 text-sm">Loading Bot...</div>
            )}

            {chatbotId && chatbot && (
              <div className="pt-4 mt-4 border-t border-neutral-700">
                <h3 className="px-3 py-2 text-sm font-semibold text-neutral-400 uppercase tracking-wider truncate">
                  {chatbot.name || 'Chatbot'}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={`/dashboard/chatbots/${chatbotId}/chat`}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                        isChatbotSubPageActive('/chat')
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                      <span>Chat</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/dashboard/chatbots/${chatbotId}/edit`}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                        isChatbotSubPageActive('/edit')
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z"></path>
                      </svg>
                      <span>Edit Chatbot</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/dashboard/chatbots/${chatbotId}/messages`}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                        isChatbotSubPageActive('/messages')
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4.332-1.141l-4.706 1.254a1 1 0 01-1.292-1.292l1.254-4.706A8.96 8.96 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>Messages</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/dashboard/chatbots/${chatbotId}/settings`}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                        isChatbotSubPageActive('/settings')
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}


          </>
        ) : (
          <div className="space-y-2">{/* Show Login/Register links */}</div>
        )}
      </nav>

      <div className="flex-shrink-0 p-4 border-t border-neutral-700">
        {isAuthenticated && (
          <>
            <div className="flex items-center justify-between text-sm font-medium text-white mb-3">
              <span>
                {loadingUser
                  ? 'Loading...'
                  : userDetails?.username || userDetails?.email || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.707 3.293a1 1 0 010 1.414L11.414 9H17a1 1 0 110 2h-5.586l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
