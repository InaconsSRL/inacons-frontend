// Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBold, FiShare, FiArchive, FiBriefcase, FiCommand, FiType, FiPackage, FiUsers, FiPower } from 'react-icons/fi';
import DropdownMenu from './DropdownMenu';
import { GiAbstract009, GiThreeFriends } from 'react-icons/gi';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
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
    { to: "/dashboard/tipoCosto", icon: FiType, text: "Tipo de Costo" },
  ];

  const otroModuloItems = [
    { to: "/dashboard/requerimiento", icon: FiPackage, text: "Requerimiento" },
    { to: "/dashboard/kanban", icon: GiThreeFriends, text: "Kanban" },
    { to: "/dashboard/proveedor", icon: FiPower, text: "Proveedores" },
    { to: "/dashboard/requerimientos", icon: FiBriefcase, text: "Requerimientos" },
  ];

  return (
    <div className={` bg-black/50 backdrop-blur-lg transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-full md:w-64 lg:w-64' : 'w-0 md:w-0 lg:w-16 '}`}>
      <nav className="flex flex-col items-start p-4 h-full overflow-y-auto ">
        
        
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
          toggleSidebar={toggleSidebar}
        />

        <DropdownMenu
          title="Requerimiento"
          items={otroModuloItems}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <DropdownMenu
          title="Administración"
          items={moduloAdministracionItems}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <DropdownMenu
          title="Otros"
          items={moduloOtrosItems}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </nav>
    </div>
  );
};

export default Sidebar;