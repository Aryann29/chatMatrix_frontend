import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Register';
import MyChatbots from './pages/MyChatbots';
import ChatbotDetailLayout from './layouts/ChatbotDetailLayout';
import EditChatbotPage from './pages/ChatbotSettings/ChatbotEdit';
import MessagesPage from './pages/Chatbot/ChatbotMessage';
import MainLayout from './layouts/MainLayout';
import ChatBox from './pages/Chatbot/ChatBox';
import ChatbotSettings from './pages/Chatbot/ChatbotSettings';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<MainLayout />}>
            {/* <Route index element={<Dashboard />} /> */}
            <Route path="my-chatbots" element={<MyChatbots />} />
            <Route path="settings" element={<MyChatbots />} />

            <Route path="chatbots/:chatbotId" element={<ChatbotDetailLayout />}>
              <Route path="edit" element={<EditChatbotPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="settings" element={<ChatbotSettings />} />
              <Route path="chat" element={<ChatBox />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
                <h1 className="text-3xl">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
