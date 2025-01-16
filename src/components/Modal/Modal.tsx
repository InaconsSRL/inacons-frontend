import React, { ReactNode, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import backImage from '../../assets/bgmedia.webp'
import { FiXCircle } from 'react-icons/fi';

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
    <div className="fixed inset-0 flex items-center justify-center z-[9000]">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div>
        <motion.div
          ref={modalRef}
          data-modal
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="rounded-lg shadow-lg overflow-hidden min-w-[45vw] max-w-[90vw] max-h-[95vh] z-[9001] flex flex-col relative"
          style={{ 
            minWidth: 'screen',
            backgroundImage: `url(${backImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-3.5 right-3.5 text-white  z-10"
            aria-label="Close"
          >
            <FiXCircle className='h-7 w-7 bg-red-500 hover:bg-red-700 hover:scale-125 rounded-full' />
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