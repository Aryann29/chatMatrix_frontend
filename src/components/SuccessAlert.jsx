import React from 'react';

const SuccessAlert = ({ success }) => {
  if (!success) return null;

  return (
    <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-4">
      {success}
    </div>
  );
};

export default SuccessAlert;