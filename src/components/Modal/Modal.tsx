import React, { ReactNode, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white opacity-50 rounded-lg shadow-lg overflow-hidden max-w-[90vw] max-h-[95vh] z-50 flex flex-col relative"
          style={{ minWidth: 'min(448px, 90vw)' }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="p-4 border-b bg-blue-900">
            <h2 className="text-xl text-white font-semibold pr-8">{title}</h2>
          </div>
          <div className="p-4 overflow-auto flex-grow bg-slate-300">
            {children}
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;