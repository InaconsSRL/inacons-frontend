import React, { useState } from 'react';

interface ButtonProps {
  onClick?: () => void;
  color?: 'verde' | 'blanco' | 'transp';
  options?: Array<{ label: string; action: () => void } | string>; // Acepta objetos o strings
  className?: string;
  text?:string;
}

const Button: React.FC<ButtonProps> = ({ onClick, color = 'verde', options = [], className = '', text }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    if (onClick) onClick();
    if (options.length > 0) setIsOpen(!isOpen); // Si tiene opciones, abre el menú desplegable
  };

  const buttonColors = {
    transp: 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/100',
    verde: 'bg-[#c4f033] hover:bg-[#D2F95F] active:bg-[#B2E232] text-white',
    blanco: 'bg-white border border-gray-300 text-black hover:bg-gray-100 active:bg-gray-200',
  };

  const handleOptionClick = (option: any) => {
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
        `}
      >
        {text} <span className='text-xs'>{options.length > 0 && (isOpen ? "▲" : "▼")}</span>
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
