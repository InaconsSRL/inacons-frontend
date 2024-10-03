// Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBold, FiShare, FiArchive, FiBriefcase, FiCommand, FiType, FiPackage, FiUsers } from 'react-icons/fi';
import DropdownMenu from './DropdownMenu';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const activeStyle = "bg-sky-300 bg-opacity-50 rounded-xl py-2 pl-2 -m-2 pr-2";

  const moduloRecursosItems = [
    { to: "/dashboard/calendar", icon: FiBold, text: "Forma Básica" },
    { to: "/dashboard/tipoRecurso", icon: FiShare, text: "Tipo Recurso" },
    { to: "/dashboard/cargo", icon: FiBriefcase, text: "Cargos" },
    { to: "/dashboard/recurso", icon: FiArchive, text: "Recursos" },
    { to: "/dashboard/usuario", icon: FiUsers, text: "Usuarios" },
    { to: "/dashboard/unidad", icon: FiCommand, text: "Unidades" },
    { to: "/dashboard/clasificacionRecurso", icon: FiType, text: "Clasificación de Recurso" },
  ];

  const otroModuloItems = [
    { to: "/dashboard/requerimiento", icon: FiPackage, text: "Requerimiento" },
  ];

  return (
    <div className={`bg-black/50 backdrop-blur-lg transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-18'}`}>
      <nav className="flex flex-col items-start p-4 h-full overflow-y-auto">
        
        
        <NavLink
          to="/dashboard"
          className={`flex items-center ${isSidebarOpen ? 'space-x-4 w-full mb-4' : 'justify-center mb-4'}  ${location.pathname === '/dashboard' ? activeStyle : ''}`}
        >
          <FiHome className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Inicio</span>}
        </NavLink>

        <DropdownMenu
          title="Recursos"
          items={moduloRecursosItems}
          isSidebarOpen={isSidebarOpen}
        />

        <DropdownMenu
          title="Requerimiento"
          items={otroModuloItems}
          isSidebarOpen={isSidebarOpen}
        />

      </nav>
    </div>
  );
};

export default Sidebar;