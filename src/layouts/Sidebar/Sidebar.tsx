// Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBold, FiShare, FiArchive, FiBriefcase, FiCommand, FiType, FiPackage, FiUsers, FiPower } from 'react-icons/fi';
import DropdownMenu from './DropdownMenu';
import { GiAbstract009, GiThreeFriends } from 'react-icons/gi';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const activeStyle = "bg-sky-300 bg-opacity-50 rounded-xl py-2 pl-2 -m-2 pr-2";

  const moduloOtrosItems = [
    { to: "/dashboard/calendar", icon: FiBold, text: "Forma Básica" },
    { to: "/dashboard/organigrama", icon: GiAbstract009, text: "OrganigramaObras" },
  ];

  const moduloAdministracionItems = [
    { to: "/dashboard/usuario", icon: FiUsers, text: "Usuarios" },
    { to: "/dashboard/roles", icon: GiThreeFriends, text: "AsignarRoles" },
    { to: "/dashboard/cargo", icon: FiBriefcase, text: "Cargos" },
  ];

  const moduloRecursosItems = [
    { to: "/dashboard/recurso", icon: FiArchive, text: "Recursos" },
    { to: "/dashboard/tipoRecurso", icon: FiShare, text: "Tipo Recurso" },
    { to: "/dashboard/unidad", icon: FiCommand, text: "Unidades" },
    { to: "/dashboard/clasificacionRecurso", icon: FiType, text: "Clase de Recurso" },
    { to: "/dashboard/tipoCostoRecurso", icon: FiType, text: "Tipo de Costo" },
  ];

  const otroModuloItems = [
    { to: "/dashboard/requerimiento", icon: FiBriefcase, text: "Requerimiento" },
    { to: "/dashboard/reqRecursos", icon: FiPackage, text: "GenerarRequerimiento" },
    { to: "/dashboard/kanban", icon: GiThreeFriends, text: "Kanban" },
    { to: "/dashboard/proveedor", icon: FiPower, text: "Proveedores" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && isHovered && !isSidebarOpen) {
      toggleSidebar();
    }
  }, [isHovered, isSidebarOpen, toggleSidebar, isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      if (isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  return (
    <div 
      className={`bg-black/50 backdrop-blur-lg transition-all duration-500 ease-in-out select-none ${isSidebarOpen || (!isMobile && isHovered) ? 'w-full md:w-64 lg:w-64' : 'w-0 md:w-0 lg:w-16 hidden lg:block'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="flex flex-col items-start p-4 h-full overflow-y-auto">
        
        <NavLink
          to="/dashboard"
          className={`flex items-center select-none ${isSidebarOpen || (!isMobile && isHovered) ? 'space-x-4 w-full mb-4' : 'justify-center mb-4'}  ${location.pathname === '/dashboard' ? activeStyle : ''}`}
        >
          <FiHome className="w-6 h-6 text-white" />
          {(isSidebarOpen || (!isMobile && isHovered)) && <span className="text-white whitespace-nowrap overflow-hidden text-ellipsis select-none">Inicio</span>}
        </NavLink>

        <DropdownMenu
          title="Recursos"
          items={moduloRecursosItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
        />

        <DropdownMenu
          title="Requerimiento"
          items={otroModuloItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
        />

        <DropdownMenu
          title="Administración"
          items={moduloAdministracionItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
        />

        <DropdownMenu
          title="Otros"
          items={moduloOtrosItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
        />
      </nav>
    </div>
  );
};

export default Sidebar;