import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const className = type === 'success' ? 'toast-success' : 'toast-error';
  
  return (
    <div className={className} role="alert">
      {type === 'success' ? '✅ ' : '⚠️ '}
      {message}
    </div>
  );
};

export default Toast;
