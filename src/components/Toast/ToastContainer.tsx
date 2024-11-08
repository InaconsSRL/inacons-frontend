import React from 'react';
import Toast from './Toast';

interface ToastData extends React.ComponentProps<typeof Toast> {
  id: string;
}

interface ToastContainerProps {
  toasts: ToastData[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onRemove,
}) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          position={position}
          index={index}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  );
};

export default ToastContainer;
