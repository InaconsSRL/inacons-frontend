import React from 'react';

import MenuIcon from '../../components/Icons/MenuIcon';
import XIcon from '../../components/Icons/XIcon';

import SearchIcon from '../../components/Icons/EyeSlashIcon';
import BellIcon from '../../components/Icons/HandshakeIcon';
import CogIcon from '../../components/Icons/EyeSlashIcon';

import logo from '../../assets/logo.svg'
import avatar from '../../assets/avatar.webp'

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC = ({ toggleSidebar, isSidebarOpen }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-lg z-20">



      <div className="flex items-center justify-between px-4 py-3">
        {/* Botón para colapsar/expandir el sidebar */}
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {/* Sección izquierda: Logo */}
        <div className="flex items-center mx-2 sm:mx-1 md:mx-5 lg:ml-5 xl:ml-10">
          <img src={logo} alt="Logo" className="h-10 mr-4" />
        </div>

        {/* Sección media: Barra de búsqueda */}
        <div className="flex items-center flex-grow md:mx-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar requerimientos, presupuestos y más"
              className="w-full bg-gray-100 bg-opacity-40 text-white pl-4 pr-10 py-2 rounded-full focus:outline-none"
            />
            <SearchIcon className="absolute right-3 top-2 w-5 h-5 text-white" />
          </div>
        </div>

        {/* Sección derecha: Hora, usuario e iconos */}
        <div className="flex items-center space-x-4 text-center">
          {/* Reloj */}
          <span className="text-white text-lg">{currentTime}</span>
          {/* Avatar del usuario */}
          <div className="flex items-center space-x-2">
            {/* <UserCircleIcon className="w-8 h-8 text-white" /> */}
            <div className="flex items-center text-white">
              <img src={avatar} alt="Avatar" className="h-10 mr-4" />
              <span>Noe Plasiro Cano Nunez</span>
            </div>
          </div>

          {/* Iconos de notificación y configuración */}
          <BellIcon className="w-6 h-6 text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
