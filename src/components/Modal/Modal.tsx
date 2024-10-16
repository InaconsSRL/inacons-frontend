import React, { ReactNode, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import backImage from '../../assets/bgmedia.webp'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      const modalElements = document.querySelectorAll('[data-modal]');
      const topModal = modalElements[modalElements.length - 1];
      
      if (modalRef.current === topModal) {
        event.stopPropagation();
        onClose();
      }
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div>
        <motion.div
          ref={modalRef}
          data-modal
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="rounded-lg shadow-lg overflow-hidden max-w-[90vw] max-h-[95vh] z-50 flex flex-col relative"
          style={{ 
            minWidth: 'min(448px, 90vw)',
            backgroundImage: `url(${backImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="p-4 border-b bg-blue-900 bg-opacity-70">
            <h2 className="text-xl text-white font-semibold pr-8">{title}</h2>
          </div>
          <div className="p-4 overflow-auto flex-grow bg-white bg-opacity-70">
            {children}
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;