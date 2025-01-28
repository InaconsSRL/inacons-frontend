
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import Button from '../../../../components/Buttons/Button';
import { DragHandle } from '../DragHandle';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarWidth: number;
  handleSidebarResize: (movement: number) => void;
  handleContextMenu: (e: React.MouseEvent, panelType: string) => void;
  proyecto: { nombre_proyecto: string };
  onLogout: () => void;
  navigationItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; items: { id: string; label: string; onClick: () => void }[] }[];
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const navigationItemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 },
};

const dropdownVariants = {
  open: { opacity: 1, height: 'auto' },
  closed: { opacity: 0, height: 0 },
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarWidth,
  handleSidebarResize,
  handleContextMenu,
  proyecto,
  onLogout,
  navigationItems,
  activeSection,
  setActiveSection
}) => {
  return (
    <motion.div
      initial={{ width: sidebarWidth }}
      animate={{ width: isSidebarOpen ? sidebarWidth : 64 }}
      className="flex-shrink-0 bg-gray-800 border-r border-gray-700 relative"
      onContextMenu={(e) => handleContextMenu(e, 'sidebar')}
    >
      {/* Header del Proyecto */}
      <motion.div 
        className="h-16 flex items-center justify-between px-4 border-b border-gray-700"
        whileHover={{ backgroundColor: "#1a2957" }}
      >
        <motion.div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 text-blue-600 grid grid-cols-2 gap-1">
            <motion.div className="bg-current rounded" whileHover={{ scale: 1.1 }} />
            <motion.div className="bg-current rounded" whileHover={{ scale: 1.1 }} />
            <motion.div className="bg-current rounded" whileHover={{ scale: 1.1 }} />
            <motion.div className="bg-current rounded" whileHover={{ scale: 1.1 }} />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="font-semibold text-gray-400 truncate"
              >
                {proyecto.nombre_proyecto}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>          
      </motion.div>

      {/* Navegación */}
      <div className="flex-1 h-[calc(100vh-14rem)] overflow-y-auto">
        <nav className="px-2 py-4">
          {navigationItems.map((section) => (
            <motion.div 
              key={section.id} 
              className="mb-4"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer 
                  ${activeSection === section.id
                    ? "text-white bg-gray-700"
                    : "text-gray-300 hover:text-blue-400 hover:bg-gray-700"
                  }`}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {React.createElement(section.icon, { className: "w-5 h-5 mr-2" })}
                </motion.div>
                
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      variants={navigationItemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="flex items-center justify-between flex-1"
                    >
                      <span>{section.label}</span>
                      <motion.div
                        animate={{
                          rotate: activeSection === section.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiChevronDown className="w-4 h-4 ml-auto" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {isSidebarOpen && activeSection === section.id && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="mt-1 ml-6 space-y-1 overflow-hidden"
                  >
                    {section.items.map((item, index) => (
                      <motion.button
                        key={item.id}
                        className="block w-full text-left px-2 py-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-md"
                        variants={{
                          open: {
                            opacity: 1,
                            y: 0,
                            transition: { delay: index * 0.1 }
                          },
                          closed: {
                            opacity: 0,
                            y: -10,
                            transition: { delay: index * 0.1 }
                          }
                        }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={item.onClick}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <motion.div 
        className="h-16 flex justify-center items-center px-2"
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
      >
        <Button
          className="w-36 justify-start text-red-400 hover:bg-red-700 hover:text-white"
          onClick={onLogout}
          icon={FiLogOut}
          text={isSidebarOpen ? "Cerrar Proy." : ""}
        />
      </motion.div>
      <DragHandle onDrag={handleSidebarResize} />
    </motion.div>
  );
};

export default Sidebar;