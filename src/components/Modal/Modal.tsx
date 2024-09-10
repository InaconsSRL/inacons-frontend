import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className=''>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className=" bg-white rounded-lg shadow-lg overflow-hidden max-w-[90vw] max-h-[95vh] z-50 flex flex-col relative"
        style={{ minWidth: 'min(448px, 90vw)' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold pr-8">{title}</h2>
        </div>
        <div className="p-4 overflow-auto flex-grow">
          {children}
        </div>
      </motion.div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;