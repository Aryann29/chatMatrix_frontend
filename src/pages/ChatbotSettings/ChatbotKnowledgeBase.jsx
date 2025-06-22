import React, { useRef, useState } from 'react';

const ChatbotKnowledgeBase = ({
  isEditing,
  uploadedDocuments,
  setUploadedDocuments,
  handleDeleteDocument,
  selectedFiles,
  setSelectedFiles,
  onRemoveSelectedFile,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && isEditing) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
          </svg>
        );
      case 'txt':
      case 'md':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'docx':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
      <h3 className="text-xl font-semibold text-white mb-4">Knowledge Base</h3>
      <div className="space-y-4">

        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-teal-400 bg-teal-500/10' 
              : 'border-neutral-600 hover:border-neutral-500'
          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="text-neutral-300 mb-2">
            {dragActive ? 'Drop files here' : 'Upload documents'}
          </p>
          <p className="text-neutral-500 text-sm mb-4">
            Drag and drop files here or click to browse
          </p>
          <p className="text-xs text-neutral-600 mb-4">
            Supported formats: PDF, TXT, DOCX, MD (Max 10MB each)
          </p>
          
          {/* Hidden file input */}
          <input
            type="file"
            multiple
            accept=".pdf,.txt,.docx,.md"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) fileInputRef.current?.click();
            }}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              isEditing 
                ? 'bg-teal-500 hover:bg-teal-600 text-white' 
                : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
            }`}
            disabled={!isEditing}
          >
            Choose Files
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-300">
              Uploaded Documents ({uploadedDocuments.length})
            </h4>
            {uploadedDocuments.length > 0 && (
              <span className="text-xs text-neutral-500">
                Total: {uploadedDocuments.reduce((acc, doc) => acc + (doc.size || 0), 0) > 0 
                  ? formatFileSize(uploadedDocuments.reduce((acc, doc) => acc + (doc.size || 0), 0))
                  : 'Size unknown'}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {uploadedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-neutral-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-neutral-500 text-sm">No documents uploaded yet</p>
                <p className="text-neutral-600 text-xs mt-1">
                  {isEditing ? 'Upload files to build your chatbot\'s knowledge base' : 'Enable editing to upload files'}
                </p>
              </div>
            ) : (
              uploadedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-700 rounded-lg hover:bg-neutral-650 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.file_name)}
                    <div>
                      <p className="text-white text-sm font-medium">{doc.file_name}</p>
                      <div className="flex items-center space-x-2 text-xs text-neutral-400">
                        <span>{doc.file_type?.toUpperCase() || 'Unknown'}</span>
                        {doc.size && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(doc.size)}</span>
                          </>
                        )}
                        {doc.created_at && (
                          <>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/20 rounded"
                      title="Delete document"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>


        {selectedFiles.length > 0 && (
          <div className="border-t border-neutral-700 pt-4">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">
              Selected Files ({selectedFiles.length}) - Ready to Upload
            </h4>
            <div className="space-y-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-teal-500/10 border border-teal-500/20 rounded">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.name)}
                    <div>
                      <span className="text-sm text-teal-100 font-medium">{file.name}</span>
                      <div className="text-xs text-teal-300">
                        {formatFileSize(file.size)} • Ready to upload
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveSelectedFile(idx)}
                    className="text-teal-400 hover:text-teal-300 transition-colors p-1 hover:bg-teal-500/20 rounded"
                    title="Remove from selection"
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
    </div>
  );
};

export default ChatbotKnowledgeBase;