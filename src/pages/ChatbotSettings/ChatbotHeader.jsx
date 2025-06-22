import React from 'react';

const ChatbotHeader = ({ isEditing, submitting, onEdit, onSave, onCancel }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Chatbot Settings</h2>
          <p className="text-neutral-400">Configure your chatbot's behavior and appearance</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Edit Chatbot
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotHeader;