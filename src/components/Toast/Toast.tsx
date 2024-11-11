import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  title?: string;
  message: string;
  variant?: 'success' | 'danger' | 'warning' | 'info';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration?: number;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
  isVisible?: boolean;
}

interface ToastPositionProps extends ToastProps {
  index: number;
}

const Toast: React.FC<ToastPositionProps> = ({
  title,
  message,
  variant = 'info',
  position = 'top-right',
  duration = 3000,
  icon,
  showCloseButton = true,
  onClose,
  isVisible = true,
  index,
}) => {
  const [show, setShow] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setShow(isVisible);
    setIsExiting(false);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShow(false);
      onClose?.();
    }, 300); // Duración de la animación de salida
  };

  if (!show) return null;

  const getPositionStyle = () => {
    const spacing = 16; // espacio entre toasts
    const offset = index * (spacing + 80); // altura del toast + espacio

    switch (position) {
      case 'top-right':
        return `fixed top-[${offset}px] right-[16px]`;
      case 'top-left':
        return `fixed top-[${offset}px] left-[16px]`;
      case 'bottom-right':
        return `fixed bottom-[${offset}px] right-[16px]`;
      case 'bottom-left':
        return `fixed bottom-[${offset}px] left-[16px]`;
      default:
        return `fixed top-[${offset}px] right-[16px]`;
    }
  };

  const variantStyles = {
    success: 'bg-emerald-800/75',
    danger: 'bg-red-800/75',
    warning: 'bg-amber-800/75',
    info: 'bg-blue-800/75',
  };

  const variantIcons = {
    success: '✓',
    danger: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`
        fixed z-50 ${getPositionStyle()}
        modern-toast ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
      style={{
        transition: 'all 0.3s ease-out',
      }}
    >
      <div
        className={`
          flex flex-col w-80 rounded-lg shadow-lg backdrop-blur-md
          ${variantStyles[variant]} text-white
          transform transition-all duration-300
        `}
      >
        <div className="flex items-center px-4 py-3 rounded-t-lg">
          <div className="flex items-center space-x-3 flex-1">
            <span className="toast-icon">
              {icon || variantIcons[variant]}
            </span>
            {title && (
              <h6 className="font-semibold text-white m-0">{title}</h6>
            )}
          </div>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="toast-close-btn"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
        <div className="px-4 py-3 text-sm">
          {message}
        </div>
        <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  );
};

export default Toast;