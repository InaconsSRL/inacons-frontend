// DropdownMenu.tsx
import React from 'react';
import { FiFolder, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaFolderOpen } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  openDropdown: string | null;
  setOpenDropdown: (title: string | null) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items, isSidebarOpen, toggleSidebar, openDropdown, setOpenDropdown }) => {
  const location = useLocation();

  const activeStyle = "bg-sky-300 bg-opacity-50 py-2 pl-2 -m-2";

  // Verificar si alguna ruta interna está activa
  const isAnyRouteActive = items.some(item => location.pathname.startsWith(item.to));

  // Modificar la lógica de isOpen para considerar solo el estado manual
  const isOpen = openDropdown === title;

  const toggleMenu = () => {
    // Simplemente alternar el estado del menú, sin importar si hay rutas activas
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const menuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex flex-col w-[230px] mb-2">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={` ${isSidebarOpen ? "w-[248px] justify-between" : "w-[58px] justify-center"} rounded-t-xl rounded-l-xl flex items-center  mb-0 cursor-pointer mt-1 pr-4 py-1.5 ${isAnyRouteActive ? activeStyle : ''
          }`}
        onClick={toggleMenu}
      >
        <div className="flex items-center ">
          {isOpen ? (
            <FaFolderOpen className={`w-6 h-6 ${isAnyRouteActive ? 'text-black' : 'text-white'}`} />
          ) : (
            <FiFolder className={`w-6 h-6 ${isAnyRouteActive ? 'text-black' : 'text-white'}`} />
          )}
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
      </motion.div>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className={`overflow-hidden mb-1 ${isSidebarOpen ? "w-[240px] " : "w-[50px] "} bg-slate-50/10 rounded-b-xl`}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                ` ${isSidebarOpen ? "w-[240px] " : "w-[50px] "} flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-blue-500 bg-opacity-20 text-white'
                  : 'hover:bg-gray-700'
                }`
              }
              onClick={toggleSidebar}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center w-full "
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-white'}`} />
                  {isSidebarOpen && (
                    <span className="ml-3 text-white whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.text}
                    </span>
                  )}
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DropdownMenu;

