import React, { useState, ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  color?: 'verde' | 'blanco' | 'transp';
  options?: Array<{ label: string; action: () => void } | string>;
  className?: string;
  text?: string;
  icon?: ReactNode; // Nueva prop para el icono
}

type Option = { label: string; action: () => void } | string;

const Button: React.FC<ButtonProps> = ({ onClick, color = 'blanco', options = [], className = '', text, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    if (onClick) onClick();
    if (options.length > 0) setIsOpen(!isOpen);
  };

  const buttonColors = {
    transp: 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-black/100',
    verde: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white',
    blanco: 'bg-white border border-gray-300 text-black hover:bg-gray-100 active:bg-gray-200',
  };

  const handleOptionClick = (option: Option) => {
    if (typeof option === 'string') {
      alert(`Opción seleccionada: ${option}`);
    } else {
      option.action();
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleButtonClick}
        className={`
          ${buttonColors[color]} 
          py-2 
          px-4 
          rounded 
          transition-colors 
          text-gray-700
          duration-200 
          w-28
          ${className}
          flex items-center justify-between
        `}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span className="truncate whitespace-nowrap sm:whitespace-normal">{text}</span>
        {options.length > 0 && (
          <span className='text-xs ml-1 flex-shrink-0'>{isOpen ? "▲" : "▼"}</span>
        )}
      </button>

      {options.length > 0 && (
        <div className={`absolute right-0 mt-0.5 w-24 bg-white border rounded shadow-lg ${isOpen ? '' : 'hidden'}`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="text-xs pr-4 block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {typeof option === 'string' ? option : option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Button;