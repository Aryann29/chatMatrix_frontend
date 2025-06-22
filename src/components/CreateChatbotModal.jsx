import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { tokenStorage } from '../utils/auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Your API base URL

const CreateChatbotModal = ({ isOpen, onClose, onChatbotCreated }) => {
  // State for all UI fields
  const [chatbotName, setChatbotName] = useState('');
  const [businessName, setBusinessName] = useState(''); // This will be sent as 'business_name'
  const [businessType, setBusinessType] = useState(''); // UI only, not sent to backend
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(''); // UI only, not sent to backend
  const [llmProvider, setLlmProvider] = useState(''); // UI only, not sent to backend (now dropdown)
  const [selectedFiles, setSelectedFiles] = useState([]); // Knowledge base files

  const [showManualInput, setShowManualInput] = useState(false); // For system prompt textarea visibility
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fileInputRef = useRef(null);
  const modalRef = useRef(null); // Ref for modal content to handle clicks outside

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Handle clicks outside the modal content to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setChatbotName('');
    setBusinessName('');
    setBusinessType('');
    setAboutBusiness('');
    setSystemPrompt('');
    setLlmProvider('');
    setSelectedFiles([]);
    setShowManualInput(false);
    setSubmitting(false);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
    }
  };

  const toggleManualInput = () => {
    setShowManualInput(!showManualInput);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.txt', '.docx', '.md'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const isValidType = validTypes.includes(fileExtension);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        alert(`${file.name} is not a supported file type. Only PDF, TXT, DOCX, MD.`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCreateChatbot = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const token = tokenStorage.getToken();
    if (!token) {
      setError("Authentication token missing. Please log in.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', chatbotName);
    formData.append('business_name', businessName); 
    formData.append('about_business', aboutBusiness);
   
    

    selectedFiles.forEach((file) => {
      formData.append('knowledge_base', file);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbots/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Essential for sending files and form fields
        },
      });
      setSuccess(response.data.message || "Chatbot created successfully!");
      if (onChatbotCreated) {
        onChatbotCreated(response.data.chatbot_id); // Notify parent component
      }
      // Give a moment for success message, then close
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error creating chatbot:', err);
      if (err.response) {
        setError(err.response.data.detail || 'Failed to create chatbot.');
      } else {
        setError('Network error or unexpected issue.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop z-50 flex items-center justify-center p-4"
    >
      {/* Modal Content - Increased max-w-4xl for a larger modal */}
      <div ref={modalRef} className="bg-neutral-800 rounded-lg p-6 w-full max-w-4xl border border-neutral-700 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Create New Chatbot</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {success && (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateChatbot} className="space-y-4">
          {/* Chatbot Name */}
          <div>
            <label htmlFor="chatbotName" className="block text-sm font-medium text-neutral-300 mb-2">
              Chatbot Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="chatbotName"
              name="chatbotName"
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-neutral-400"
              placeholder="Enter your chatbot's name"
            />
          </div>

          {/* Business Type (UI Only) */}
          {/* <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-neutral-300 mb-2">
              Business Type <span className="text-neutral-400 font-normal">(Optional, UI only)</span>
            </label>
            <select
              id="businessType"
              name="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select business type</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Travel">Travel</option>
              <option value="Food & Beverage">Food &amp; Beverage</option>
              <option value="Other">Other</option>
            </select>
          </div> */}

          {/* Business Name (Sent to backend as business_name) */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-neutral-300 mb-2">
              Business Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-neutral-400"
              placeholder="Enter your business name"
            />
          </div>

          {/* About Business */}
          <div>
            <label htmlFor="aboutBusiness" className="block text-sm font-medium text-neutral-300 mb-2">
              About Business <span className="text-red-400">*</span>
            </label>
            <textarea
              id="aboutBusiness"
              name="aboutBusiness"
              value={aboutBusiness}
              onChange={(e) => setAboutBusiness(e.target.value)}
              required
              rows="3"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none placeholder-neutral-400"
              placeholder="Describe your business, its services, target audience, and key information the chatbot should know..."
            ></textarea>
          </div>

          {/* System Prompt (UI Only) */}
          {/* <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              System Prompt <span className="text-neutral-400 font-normal">(Optional, UI only)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleManualInput}
                className="text-sm text-teal-500 hover:text-teal-400 font-medium flex items-center mb-2"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                {showManualInput ? 'Hide System Prompt' : 'Add System Prompt'}
              </button>

              {showManualInput && (
                <div className="mt-1">
                  <textarea
                    id="systemPrompt"
                    name="systemPrompt"
                    rows="4"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y placeholder-neutral-400"
                    placeholder="Enter a custom system prompt to guide the chatbot's personality or responses..."
                  ></textarea>
                </div>
              )}
            </div>
          </div> */}

          {/* LLM Selection (UI Only - now a select box) */}
          {/* <div>
            <label htmlFor="llmProvider" className="block text-sm font-medium text-neutral-300 mb-2">
              Select LLM Provider <span className="text-neutral-400 font-normal">(Optional, UI only)</span>
            </label>
            <select
              id="llmProvider"
              name="llmProvider"
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select LLM provider</option>
              <option value="openai">OpenAI</option>
              <option value="azure">Azure</option>
              <option value="groq">Groq</option>
            </select>
          </div> */}

          {/* Knowledge Base */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Knowledge Base
              <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>

            {/* File Upload Area */}
            <div className="space-y-4">
              <div
                id="fileDropZone"
                className="file-drop-zone border-2 border-dashed border-neutral-600 rounded-lg p-6 text-center hover:border-neutral-500 transition-all duration-200 cursor-pointer"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept=".pdf,.txt,.docx,.md"
                  className="hidden"
                  onChange={handleFileSelect}
                  ref={fileInputRef} // Assign ref here
                />

                <div className="space-y-2">
                  <svg className="w-12 h-12 text-neutral-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <div className="text-neutral-300 font-medium">Drop files here or click to browse</div>
                  <div className="text-sm text-neutral-400">Supported: PDF, TXT, DOCX, MD (Max 10MB each)</div>
                </div>
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div id="selectedFiles">
                  <div className="text-sm font-medium text-neutral-300 mb-2">Selected Files:</div>
                  <div id="filesList" className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={file.name + index} className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <div>
                            <div className="text-white font-medium">{file.name}</div>
                            <div className="text-sm text-neutral-400">{(file.size / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Chatbot'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatbotModal;