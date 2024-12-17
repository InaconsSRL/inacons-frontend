// Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegCalendarAlt, FaProjectDiagram, FaUsers, FaUserShield, FaBriefcase, FaBoxOpen, FaTags, FaBalanceScale, FaLayerGroup, FaMoneyBillWave, FaShoppingCart, FaWarehouse, FaClipboardList, FaTasks, FaHandshake, FaDatabase } from 'react-icons/fa';
import { IoIosArchive } from "react-icons/io";
import { FiHome } from 'react-icons/fi';
import { GiConcreteBag, GiFireworkRocket } from 'react-icons/gi';
import { MdViewKanban } from "react-icons/md";
import DropdownMenu from './DropdownMenu';
import { motion } from 'framer-motion';
import { FaListCheck } from 'react-icons/fa6';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const moduloOtrosItems = [
    { to: "/dashboard/calendar", icon: FaRegCalendarAlt, text: "Forma Básica" },
    { to: "/dashboard/organigrama", icon: FaProjectDiagram, text: "OrganigramaObras" },
    { to: "/dashboard/almacenbetha", icon: GiFireworkRocket, text: "Alm2" },
  ];

  const moduloAdministracionItems = [
    { to: "/dashboard/usuario", icon: FaUsers, text: "Usuarios" },
    { to: "/dashboard/roles", icon: FaUserShield, text: "AsignarRoles" },
    { to: "/dashboard/cargo", icon: FaBriefcase, text: "Cargos" },
  ];

  const moduloRecursosItems = [
    { to: "/dashboard/recurso", icon: FaBoxOpen, text: "Recursos" },
    { to: "/dashboard/tipoRecurso", icon: FaTags, text: "Tipo Recurso" },
    { to: "/dashboard/unidad", icon: FaBalanceScale, text: "Unidades" },
    { to: "/dashboard/clasificacionRecurso", icon: FaLayerGroup, text: "Clase de Recurso" },
    { to: "/dashboard/tipoCostoRecurso", icon: FaMoneyBillWave, text: "Tipo de Costo" },
  ];

  const moduloCompras = [
    { to: "/dashboard/compras", icon: FaShoppingCart, text: "Cotizaciones" },
    { to: "/dashboard/proveedor", icon: FaHandshake, text: "Proveedores" },
    { to: "/dashboard/ordenCompra", icon: FaListCheck, text: "OrdenesDeCompra" },
  ];

  const moduloProyectos = [
    { to: "/dashboard/obras", icon: GiConcreteBag , text: "Obras" },
    { to: "/dashboard/presupuestoBoard", icon: FaMoneyBillWave, text: "Presupuestos" },
    { to: "/dashboard/tableViewer", icon: FaDatabase, text: "DataBase" },
  ];

  const moduloAlmacen = [
    { to: "/dashboard/almacen", icon: FaWarehouse, text: "Almacen" },
    { to: "/dashboard/almacenBoard", icon: FaClipboardList, text: "AlmacenBoard" },
    { to: "/dashboard/tipoAlmacen", icon: IoIosArchive, text: "TipoDeAlmacen" },
  ];

  const otroModuloItems = [
    { to: "/dashboard/requerimiento", icon: FaClipboardList, text: "Requerimiento" },
    { to: "/dashboard/reqRecursos", icon: FaTasks, text: "GenerarRequerimiento" },
    { to: "/dashboard/kanban", icon: MdViewKanban, text: "Kanban" },
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

  const activeStyle = "bg-sky-300 bg-opacity-50 rounded-xl py-2 pl-2 -m-2 pr-2";
  return (
    <motion.div
      initial={false}
      animate={{
        width: isSidebarOpen || (!isMobile && isHovered) ?
          window.innerWidth < 768 ? '100%' : '16rem' :
          window.innerWidth < 768 ? '0' : '4rem'
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-black/50 backdrop-blur-lg select-none ${isSidebarOpen || (!isMobile && isHovered) ?
          'w-full md:w-64 lg:w-64' :
          'w-0 md:w-0 lg:w-16 hidden lg:block'
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.nav
        className="flex flex-col items-start py-4 pl-2 h-full overflow-y-auto"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col w-[230px] mb-2"
        >
          <NavLink
            to="/dashboard"
            className={`${isSidebarOpen ? "w-[248px] justify-between" : "w-[58px] justify-center"} rounded-t-xl rounded-l-xl flex items-center mb-0 mt-1 pr-4 py-1.5 ${location.pathname === '/dashboard' ? activeStyle : ''}`}
          >
            <div className="flex items-center">
              <FiHome className={`w-6 h-6 ${location.pathname === '/dashboard' ? 'text-black' : 'text-white'}`} />
              {(isSidebarOpen || (!isMobile && isHovered)) && 
                <span className={`pl-3 ${location.pathname === '/dashboard' ? 'text-black' : 'text-white'}`}>
                  Inicio
                </span>
              }
            </div>
          </NavLink>
        </motion.div>

        <DropdownMenu
          title="Recursos"
          items={moduloRecursosItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <DropdownMenu
          title="Requerimiento"
          items={otroModuloItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <DropdownMenu
          title="Administración"
          items={moduloAdministracionItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <DropdownMenu
          title="Almacen"
          items={moduloAlmacen}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <DropdownMenu
          title="Compras"
          items={moduloCompras}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <DropdownMenu
          title="Proyectos"
          items={moduloProyectos}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <DropdownMenu
          title="Otros"
          items={moduloOtrosItems}
          isSidebarOpen={isSidebarOpen || (!isMobile && isHovered)}
          toggleSidebar={toggleSidebar}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      </motion.nav>
    </motion.div>
  );
};

export default Sidebar;