import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  modalStates: { [key: string]: boolean };
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});

  const openModal = (modalId: string) => {
    setModalStates(prev => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId: string) => {
    setModalStates(prev => ({ ...prev, [modalId]: false }));
  };

  return (
    <ModalContext.Provider value={{ modalStates, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};