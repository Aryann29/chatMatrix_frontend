import React from 'react'
const ChatbotPreviewAndStats = ({ chatbotName }) => {
  return (
    <div className="space-y-6">

      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Embed Code</h3>
        <div className="space-y-3">
          <p className="text-neutral-400 text-sm">Copy this code to embed your chatbot on your website</p>
          <div className="relative">
            <textarea
              rows="6"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              readOnly
              value={`<script src="https://chatsass.com/embed.js"></script>\n<div id="chatsass-widget" data-bot-id="cs-bot-123" data-theme="dark"></div>`}
            ></textarea>
            <button onClick={() => navigator.clipboard.writeText(`<script src="https://chatsass.com/embed.js"></script>\n<div id="chatsass-widget" data-bot-id="cs-bot-123" data-theme="dark"></div>`)} className="absolute top-2 right-2 bg-neutral-600 hover:bg-neutral-500 text-white p-1 rounded transition-colors duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
              </svg>
            </button>
          </div>
          <button onClick={() => {navigator.clipboard.writeText(`<script src="https://chatsass.com/embed.js"></script>\n<div id="chatsass-widget" data-bot-id="cs-bot-123" data-theme="dark"></div>`); alert('Embed code copied!');}} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg transition-colors duration-200">Copy Code</button>
        </div>
      </div>

    </div>
  );
};

export default ChatbotPreviewAndStats
