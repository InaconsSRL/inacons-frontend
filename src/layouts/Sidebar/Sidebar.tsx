import React, { useState } from 'react';

import './Sidebar.css'

import HomeIcon from '../../components/Icons/solid/ChevronDownIcon';
import FolderIcon from '../../components/Icons/solid/ChevronUpIcon';
import CalendarIcon from '../../components/Icons/outline/MenuIcon';
import CogIcon from '../../components/Icons/outline/XIcon';
import ChevronDownIcon from '../../components/Icons/solid/ChevronDownIcon'; // Icono para mostrar que se puede desplegar
import ChevronUpIcon from '../../components/Icons/solid/ChevronUpIcon';
import MailIcon from '../../components/Icons/solid/ChevronUpIcon';
import UsersIcon from '../../components/Icons/solid/ChevronUpIcon';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {

  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
  const [isCollaborationOpen2, setIsCollaborationOpen2] = useState(false);
  const [isCollaborationOpen3, setIsCollaborationOpen3] = useState(false);

  const toggleCollaborationMenu = () => {
    setIsCollaborationOpen(!isCollaborationOpen);
  };

  const toggleCollaborationMenu2 = () => {
    setIsCollaborationOpen2(!isCollaborationOpen2);
  };

  const toggleCollaborationMenu3 = () => {
    setIsCollaborationOpen3(!isCollaborationOpen3);
  };


  return (
    <div
      className={`bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'
        }`}
    >
      <nav className="flex flex-col items-start p-4 h-full overflow-y-auto">
        {/* Inicio */}
        <div className="flex items-center space-x-4 mb-4">
          <HomeIcon className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Inicio</span>}
        </div>

        {/* Colaboración con opciones desplegables */}
        <div className="flex flex-col w-full">
          <div
            className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
            onClick={toggleCollaborationMenu}
          >
            <div className="flex items-center">
              <FolderIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Colaboración</span>}
            </div>
            {isSidebarOpen && (
              <span>
                {isCollaborationOpen ? (
                  <ChevronUpIcon className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                )}
              </span>
            )}
          </div>

          {/* Submenú con transición */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isCollaborationOpen ? 'max-h-screen' : 'max-h-0'
              }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <HomeIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Feed</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CalendarIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Calendario</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CogIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Messenger</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <FolderIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Documentos</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CogIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Drive</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <MailIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Webmail</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <UsersIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Grupos de trabajo</span>}
            </div>

          </div>
        </div>

       {/* Colaboración2 con opciones desplegables */}
        <div className="flex flex-col w-full">
          <div
            className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
            onClick={toggleCollaborationMenu2}
          >
            <div className="flex items-center">
              <FolderIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Colaboración</span>}
            </div>
            {isSidebarOpen && (
              <span>
                {isCollaborationOpen2 ? (
                  <ChevronUpIcon className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                )}
              </span>
            )}
          </div>

          {/* Submenú con transición */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isCollaborationOpen2 ? 'max-h-screen' : 'max-h-0'
              }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <HomeIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Feed</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CalendarIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Calendario</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CogIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Messenger</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <FolderIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Documentos</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CogIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Drive</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <MailIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Webmail</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <UsersIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Grupos de trabajo</span>}
            </div>



          </div>
        </div>

        {/* Colaboración3 con opciones desplegables */}
        <div className="flex flex-col w-full">
          <div
            className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
            onClick={toggleCollaborationMenu3}
          >
            <div className="flex items-center">
              <FolderIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Colaboración</span>}
            </div>
            {isSidebarOpen && (
              <span>
                {isCollaborationOpen3 ? (
                  <ChevronUpIcon className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                )}
              </span>
            )}
          </div>

          {/* Submenú con transición */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isCollaborationOpen3 ? 'max-h-screen' : 'max-h-0'
              }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <HomeIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Feed</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CalendarIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Calendario</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CogIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Messenger</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <FolderIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Documentos</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CogIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Drive</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <MailIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Webmail</span>}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <UsersIcon className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Grupos de trabajo</span>}
            </div>



          </div>
        </div>

        {/* Otros ítems del menú */}
        <div className="flex items-center space-x-4 mb-4">
          <CalendarIcon className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Tareas y proyectos</span>}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <CogIcon className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Firma electrónica</span>}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <CogIcon className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Compañía</span>}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <CogIcon className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Automatización</span>}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
