// DropdownMenu.tsx
import React, { useState } from 'react';
import { FiFolder, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuItem {
  to: string;
  icon: React.ElementType;
  text: string;
}

interface DropdownMenuProps {
  title: string;
  items: MenuItem[];
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items, isSidebarOpen, toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const activeStyle = "bg-sky-300 bg-opacity-50 rounded-xl py-2 pl-2 -m-2";

  // Verificar si alguna ruta interna está activa
  const isAnyRouteActive = items.some(item => location.pathname.startsWith(item.to));

  return (
    <div className="flex flex-col w-full mb-2">
      <div
        className={`flex items-center justify-between space-x-4 cursor-pointer mb-0 mt-1 ${isAnyRouteActive ? activeStyle : ''}`}
        onClick={toggleMenu}
      >
        <div className={`flex items-center `}>
          <FiFolder className={`w-6 h-6 ${isAnyRouteActive ? 'text-black' : 'text-white'}`} />
          {isSidebarOpen && <span className={`pl-3 ${isAnyRouteActive ? 'text-black' : 'text-white'}`}>{title}</span>}
        </div>
        {isSidebarOpen && (
          <span>
            {isOpen ? (
              <FiChevronUp className={`w-4 h-4  ${isAnyRouteActive ? 'text-black' : 'text-white'}`} />
            ) : (
              <FiChevronDown className={`w-4 h-4 ${isAnyRouteActive ? 'text-black' : 'text-white'}`} />
            )}
          </span>
        )}
      </div>

      <div className={`
        ${isOpen ? "rounded-[10px] shadow-neumorph max-h-screen mt-4 mb-4" : "max-h-0 hidden"}
        pt-4 -m-2 pl-2 overflow-hidden transition-all duration-300`}
      >
        {items.map((item, index) => (
          <NavLink 
            key={index}
            to={item.to} 
            className={({ isActive }) => 
              `flex items-center space-x-4 mb-4 ${isActive ? activeStyle : ''}`
            }
            onClick={toggleSidebar}
          >
            <item.icon className="w-6 h-6 text-white" />
            {isSidebarOpen && <span className="text-white whitespace-nowrap overflow-hidden text-ellipsis">{item.text}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;