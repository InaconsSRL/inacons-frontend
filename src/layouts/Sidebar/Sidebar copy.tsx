import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Importa los iconos que necesites, por ejemplo:
import { FiHome, FiFolder, FiCalendar, FiSettings, FiUsers, FiBox, FiBriefcase, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prevMenus =>
      prevMenus.includes(menu)
        ? prevMenus.filter(item => item !== menu)
        : [...prevMenus, menu]
    );
  };

  const menuItems = [
    { name: 'Inicio', icon: FiHome, path: '/dashboard' },
    {
      name: 'Gestión',
      icon: FiFolder,
      subItems: [
        { name: 'Calendario', icon: FiCalendar, path: '/dashboard/calendar' },
        { name: 'Tipo Recurso', icon: FiBox, path: '/dashboard/tipoRecurso' },
        { name: 'Cargos', icon: FiBriefcase, path: '/dashboard/cargo' },
        { name: 'Recursos', icon: FiBox, path: '/dashboard/recurso' },
        { name: 'Usuarios', icon: FiUsers, path: '/dashboard/usuario' },
      ],
    },
    { name: 'Configuración', icon: FiSettings, path: '/dashboard/settings' },
  ];

  return (
    <motion.div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
      initial={false}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-2xl font-bold">Dashboard</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-blue-700 transition-colors">
            {isSidebarOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full p-4 flex items-center justify-between hover:bg-blue-700 transition-colors ${
                      openMenus.includes(item.name) ? 'bg-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-4" />
                      {isSidebarOpen && <span>{item.name}</span>}
                    </div>
                    {isSidebarOpen && (
                      openMenus.includes(item.name) ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </button>
                  <AnimatePresence>
                    {openMenus.includes(item.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block p-4 pl-12 hover:bg-blue-700 transition-colors ${
                                isActive ? 'bg-blue-900' : ''
                              }`
                            }
                          >
                            <div className="flex items-center">
                              <subItem.icon size={16} className="mr-4" />
                              {isSidebarOpen && <span>{subItem.name}</span>}
                            </div>
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-4 hover:bg-blue-700 transition-colors ${
                      isActive ? 'bg-blue-900' : ''
                    }`
                  }
                >
                  <div className="flex items-center">
                    <item.icon size={20} className="mr-4" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </div>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;