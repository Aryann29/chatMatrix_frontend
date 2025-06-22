import React from 'react';

const ChatbotBasicInfo = ({ chatbotData, isEditing, onChange }) => {
  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Chatbot Name
          </label>
          <input
            type="text"
            name="name"
            value={chatbotData.name}
            onChange={onChange}
            readOnly={!isEditing}
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              isEditing 
                ? 'border-neutral-600' 
                : 'border-neutral-700 cursor-not-allowed'
            }`}
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Business Type
          </label>
          <select
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              isEditing 
                ? 'border-neutral-600' 
                : 'border-neutral-700 cursor-not-allowed'
            }`}
            disabled={!isEditing}
          >
            <option>E-commerce</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Finance</option>
            <option>Travel</option>
            <option>Other</option>
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            About Business
          </label>
          <textarea
            rows="4"
            name="about_business"
            value={chatbotData.about_business}
            onChange={onChange}
            readOnly={!isEditing}
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y ${
              isEditing 
                ? 'border-neutral-600' 
                : 'border-neutral-700 cursor-not-allowed'
            }`}
            placeholder="Describe your business and what your chatbot should help with..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            System Prompt 
          </label>
          <textarea
            name="system_prompt"
            value={chatbotData.system_prompt}
            onChange={onChange}
            readOnly={!isEditing}
            rows="6"
            className={`w-full px-3 py-2 rounded-md bg-neutral-700 text-white border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 resize-y ${
              isEditing 
                ? 'border-neutral-600' 
                : 'border-neutral-700 cursor-not-allowed'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotBasicInfo;