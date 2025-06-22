import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { tokenStorage } from '../../utils/auth';
import ChatbotKnowledgeBase from './ChatbotKnowledgeBase';
import ChatbotPreviewAndStats from './ChatbotPreviewAndStats';
import ChatbotBasicInfo from './ChatbotBasicInfo';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import SuccessAlert from '../../components/SuccessAlert';
import ChatbotHeader from './ChatbotHeader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatbotEdit = () => {
  const { chatbotId } = useParams();
  const [chatbotData, setChatbotData] = useState({
    name: '',
    business_name: '',
    about_business: '',
    system_prompt: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); // ✅ NEW: Track upload progress

  const fetchChatbotDetailsAndFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = tokenStorage.getToken();
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const chatbotResponse = await axios.get(`${API_BASE_URL}/chatbots/${chatbotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChatbotData({
        name: chatbotResponse.data.name || '',
        business_name: chatbotResponse.data.business_name || '',
        about_business: chatbotResponse.data.about_business || '',
        system_prompt: chatbotResponse.data.system_prompt || '',
      });

      try {
        const filesResponse = await axios.get(`${API_BASE_URL}/chatbots/${chatbotId}/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUploadedDocuments(filesResponse.data);
      } catch (fileError) {
        console.warn('Could not fetch chatbot files:', fileError);
        setUploadedDocuments([]);
      }
    } catch (err) {
      console.error('Error fetching chatbot details or files:', err);
      setError(err.response?.data?.detail || 'Failed to fetch chatbot details.');
    } finally {
      setLoading(false);
    }
  }, [chatbotId]);

  useEffect(() => {
    if (chatbotId) {
      fetchChatbotDetailsAndFiles();
    }
  }, [chatbotId, fetchChatbotDetailsAndFiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChatbotData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ NEW: Validate files before upload
  const validateFiles = (files) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    for (let file of files) {
      if (file.size > maxSize) {
        throw new Error(`File "${file.name}" is too large. Maximum size is 10MB.`);
      }
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.md')) {
        throw new Error(`File "${file.name}" has unsupported format. Please upload PDF, TXT, DOCX, or MD files.`);
      }
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const token = tokenStorage.getToken();
    if (!token) {
      setError("Authentication token missing. Please log in.");
      setSubmitting(false);
      return;
    }

    try {
      // ✅ Validate files if any are selected
      if (selectedFiles.length > 0) {
        validateFiles(selectedFiles);
      }

      const formData = new FormData();
      formData.append('name', chatbotData.name);
      formData.append('business_name', chatbotData.business_name);
      formData.append('about_business', chatbotData.about_business);
      if (chatbotData.system_prompt) {
        formData.append('system_prompt', chatbotData.system_prompt);
      }

      // ✅ Add selected files
      selectedFiles.forEach(file => {
        formData.append('knowledge_base', file);
      });

      const response = await axios.put(`${API_BASE_URL}/chatbots/${chatbotId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        // ✅ Track upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
        // ✅ Increase timeout for large file uploads
        timeout: 300000, // 5 minutes
      });

      setSuccess(response.data.message || 'Chatbot updated successfully!');
      setIsEditing(false);
      setSelectedFiles([]);
      setUploadProgress(0);
      await fetchChatbotDetailsAndFiles(); // ✅ Refresh data
    } catch (err) {
      console.error('Error updating chatbot:', err);
      if (err.message.includes('File')) {
        setError(err.message); // Show validation error
      } else {
        setError(err.response?.data?.detail || 'Failed to update chatbot.');
      }
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    // ✅ Reset form data to original values
    fetchChatbotDetailsAndFiles();
  };

  const handleDeleteDocument = async (file_id) => {
    try {
      const token = tokenStorage.getToken();
      if (!token) {
        setError("Authentication token missing. Please log in.");
        return;
      }

      // ✅ Add confirmation dialog
      if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/chatbots/${chatbotId}/files/${file_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUploadedDocuments(prev =>
        prev.filter(doc => doc.id !== file_id)
      );
      setSuccess('Document deleted successfully!');
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.response?.data?.detail || 'Failed to delete document.');
    }
  };

  // ✅ NEW: Remove selected file
  const handleRemoveSelectedFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  if (loading) return <LoadingSpinner />;
  if (error && !submitting) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;

  return (
    <section id="chatbot-settings" className="page-section min-h-screen bg-neutral-900 p-6">
      <ChatbotHeader
        isEditing={isEditing}
        submitting={submitting}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <SuccessAlert success={success} />
      {error && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">{error}</div>
      )}

      {submitting && uploadProgress > 0 && (
        <div className="bg-neutral-800 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Uploading files...</span>
            <span className="text-sm text-neutral-300">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ChatbotBasicInfo
            chatbotData={chatbotData}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <ChatbotKnowledgeBase
            isEditing={isEditing}
            uploadedDocuments={uploadedDocuments}
            setUploadedDocuments={setUploadedDocuments}
            handleDeleteDocument={handleDeleteDocument}
            chatbotId={chatbotId}
            API_BASE_URL={API_BASE_URL}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onRemoveSelectedFile={handleRemoveSelectedFile}
          />

 
          {isEditing && selectedFiles.length > 0 && (
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h4 className="text-sm font-medium text-neutral-300 mb-3">
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm text-white">{file.name}</span>
                      <span className="text-xs text-neutral-400">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSelectedFile(idx)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ChatbotPreviewAndStats chatbotName={chatbotData.name} />
      </div>
    </section>
  );
};

export default ChatbotEdit;