import React from 'react';

const ErrorNotification = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p className="font-bold">Connection Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorNotification;
