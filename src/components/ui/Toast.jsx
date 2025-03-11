import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' 
    ? 'bg-green-50 border-green-500 text-green-800' 
    : type === 'error' 
      ? 'bg-red-50 border-red-500 text-red-800'
      : 'bg-blue-50 border-blue-500 text-blue-800';

  const iconColor = type === 'success' 
    ? 'text-green-500' 
    : type === 'error' 
      ? 'text-red-500'
      : 'text-blue-500';

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className={`flex items-center p-4 mb-4 border-l-4 rounded-md shadow-md ${bgColor}`} role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3">
          {type === 'success' && (
            <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === 'error' && (
            <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === 'info' && (
            <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
            </svg>
          )}
        </div>
        <div className="text-sm font-medium">{message}</div>
        <button 
          type="button" 
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-100 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Đóng</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;