import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
      {type === 'success' ? (
        <CheckCircle size={18} />
      ) : (
        <XCircle size={18} />
      )}
      <div className="toast-message">{message}</div>
      <button 
        onClick={onClose} 
        style={{ 
          marginRight: 'auto', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          color: 'var(--color-text-light)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
