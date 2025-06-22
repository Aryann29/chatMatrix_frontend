import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="text-red-400 p-8 text-center bg-neutral-800 rounded-lg mx-auto max-w-lg mt-10">
      <p className="text-lg font-semibold mb-2">Error Loading Chatbot</p>
      <p>{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorDisplay;