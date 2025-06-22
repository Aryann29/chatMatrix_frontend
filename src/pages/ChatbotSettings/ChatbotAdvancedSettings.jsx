import React, { useState } from 'react';

const ChatbotAdvancedSettings = ({ isEditing }) => {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const toggleApiKey = () => setApiKeyVisible(!apiKeyVisible);

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <h3 className="text-xl font-semibold text-white mb-4">Advanced Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Public Visibility</h4>
            <p className="text-neutral-400 text-sm">
              Allow your chatbot to be discovered publicly
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              defaultChecked={true} 
              disabled={!isEditing} 
            />
            <div className="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
          </label>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">API Access</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                API Key
              </label>
              <div className="flex space-x-2">
                <input
                  type={apiKeyVisible ? "text" : "password"}
                  value="sk-1234567890abcdef"
                  className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  readOnly
                />
                <button 
                  onClick={toggleApiKey} 
                  className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path 
                      fillRule="evenodd" 
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" 
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button 
                  className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg transition-colors duration-200" 
                  disabled={!isEditing}
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdvancedSettings;