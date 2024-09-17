import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { 
  FiHome, 
  FiFolder,
  FiUsers, 
  FiChevronDown, 
  FiChevronUp, 
  FiBold, 
  FiShare, 
  FiArchive, 
  FiBriefcase 
} from 'react-icons/fi';
interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(true);

  const toggleCollaborationMenu = () => {
    setIsCollaborationOpen(!isCollaborationOpen);
  };

  // Estilo para el enlace activo
  const activeStyle = "bg-sky-300 bg-opacity-50 rounded-xl py-2 pl-2 -m-2 ";

  return (
    <div
      className={`bg-black bg-opacity-25 backdrop-blur-lg transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'
        }`}
    >
      <nav className="flex flex-col items-start p-4 h-full overflow-y-auto">
        {/* Inicio */}
        <div className="flex items-center space-x-4 mb-4">
          <FiHome className="w-6 h-6 text-white" />
          {isSidebarOpen && <span className="text-white">Inicio</span>}
        </div>

        {/* Colaboración con opciones desplegables */}
        <div className="flex flex-col w-full ">
          <div
            className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
            onClick={toggleCollaborationMenu}
          >
            <div className="flex items-center">
              <FiFolder className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white pl-3">Modulo_Recursos</span>}
            </div>
            {isSidebarOpen && (
              <span>
                {isCollaborationOpen ? (
                  <FiChevronUp className="w-4 h-4 text-white" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-white" />
                )}
              </span>
            )}
          </div>

          {/* Submenú con transición */}
          <div
            className={`${isCollaborationOpen && " bg-white/20 rounded-xl"} pt-3 -m-2 pl-2 overflow-hidden transition-all duration-300 ${isCollaborationOpen ? 'max-h-screen' : 'max-h-0'
              }`}
          >
            <NavLink to="/dashboard/calendar" className={({ isActive }) => 
                `flex items-center space-x-4 mb-4 ${isActive ? activeStyle : ''}`
              }>
              <FiBold className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Forma Basica</span>}
              
            </NavLink>

            <NavLink to="/dashboard/tipoRecurso" className={({ isActive }) => 
                `flex items-center space-x-4 mb-4 ${isActive ? activeStyle : ''}`
              }>
              <FiShare className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">TipoRecurso</span>}
            </NavLink>

            <NavLink to="/dashboard/cargo" className={({ isActive }) => 
                `flex items-center space-x-4 mb-4 ${isActive ? activeStyle : ''}`
              }>
              <FiBriefcase className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Cargos</span>}
            </NavLink>

            <NavLink to="/dashboard/recurso" className={({ isActive }) => 
                `flex items-center space-x-4 mb-4 ${isActive ? activeStyle : ''}`
              }>
              <FiArchive className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Recursos</span>}
            </NavLink>

            <NavLink to="/dashboard/usuario" className={({ isActive }) => 
                `flex items-center space-x-4 mb-4 ${isActive ? activeStyle : ''}`
              }>
              <FiUsers className="w-6 h-6 text-white" />
              {isSidebarOpen && <span className="text-white">Usuarios</span>}
            </NavLink>

            

          </div>
        </div>             
      </nav>
    </div>
  );
};

export default Sidebar;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// import HomeIcon from '../../components/Icons/HomeIcon';
// import FolderIcon from '../../components/Icons/FolderIcon';
// import CalendarIcon from '../../components/Icons/CalendarIcon';
// import CogIcon from '../../components/Icons/CogIcon';
// import ChevronDownIcon from '../../components/Icons/ChevronDownIcon'; // Icono para mostrar que se puede desplegar
// import ChevronUpIcon from '../../components/Icons/ChevronUpIcon';
// import MailIcon from '../../components/Icons/MailIcon';
// import UsersIcon from '../../components/Icons/UserGroupIcon';

// interface SidebarProps {
//   isSidebarOpen: boolean;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {

//   const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
//   const [isCollaborationOpen2, setIsCollaborationOpen2] = useState(false);
//   const [isCollaborationOpen3, setIsCollaborationOpen3] = useState(false);

//   const toggleCollaborationMenu = () => {
//     setIsCollaborationOpen(!isCollaborationOpen);
//   };

//   const toggleCollaborationMenu2 = () => {
//     setIsCollaborationOpen2(!isCollaborationOpen2);
//   };

//   const toggleCollaborationMenu3 = () => {
//     setIsCollaborationOpen3(!isCollaborationOpen3);
//   };


//   return (
//     <div
//       className={`bg-black bg-opacity-25 backdrop-blur-lg transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'
//         }`}
//     >
//       <nav className="flex flex-col items-start p-4 h-full overflow-y-auto">
//         {/* Inicio */}
//         <div className="flex items-center space-x-4 mb-4">
//           <HomeIcon className="w-6 h-6 text-white" />
//           {isSidebarOpen && <span className="text-white">Inicio</span>}
//         </div>

//         {/* Colaboración con opciones desplegables */}
//         <div className="flex flex-col w-full ">
//           <div
//             className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
//             onClick={toggleCollaborationMenu}
//           >
//             <div className="flex items-center">
//               <FolderIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white pl-3">Opciones 1</span>}
//             </div>
//             {isSidebarOpen && (
//               <span>
//                 {isCollaborationOpen ? (
//                   <ChevronUpIcon className="w-4 h-4 text-white" />
//                 ) : (
//                   <ChevronDownIcon className="w-4 h-4 text-white" />
//                 )}
//               </span>
//             )}
//           </div>

//           {/* Submenú con transición */}
//           <div
//             className={`${isCollaborationOpen && "bg-white/20 rounded-xl mb-3 p-2"} overflow-hidden transition-all duration-300 ${isCollaborationOpen ? 'max-h-screen' : 'max-h-0'
//               }`}
//           >
//             <Link to="/dashboard/calendar" className="flex items-center space-x-4 mb-4">
//               <HomeIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Calendario</span>}
              
//             </Link>

//             <Link to="/dashboard/tipoRecurso" className="flex items-center space-x-4 mb-4">
//               <CalendarIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">TipoRecurso</span>}
//             </Link>

//             <Link to="/dashboard/cargo" className="flex items-center space-x-4 mb-4">
//               <CogIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Cargos</span>}
//             </Link>

//             <div className="flex items-center space-x-4 mb-4">
//               <FolderIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Documentos</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CogIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Drive</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <MailIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Webmail</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <UsersIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Grupos de trabajo</span>}
//             </div>

//           </div>
//         </div>

//        {/* Colaboración2 con opciones desplegables */}
//         <div className="flex flex-col w-full ">
//           <div
//             className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
//             onClick={toggleCollaborationMenu2}
//           >
//             <div className="flex items-center">
//               <FolderIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white pl-3">Colaboración</span>}
//             </div>
//             {isSidebarOpen && (
//               <span>
//                 {isCollaborationOpen2 ? (
//                   <ChevronUpIcon className="w-4 h-4 text-white" />
//                 ) : (
//                   <ChevronDownIcon className="w-4 h-4 text-white" />
//                 )}
//               </span>
//             )}
//           </div>

//           {/* Submenú con transición */}
//           <div
//             className={`${isCollaborationOpen2 && "bg-white/20 rounded-xl mb-3 p-2"} overflow-hidden transition-all duration-300 ${isCollaborationOpen2 ? 'max-h-screen' : 'max-h-0'
//               }`}
//           >
//             <div className="flex items-center space-x-4 mb-4">
//               <HomeIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Feed</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CalendarIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Calendario</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CogIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Messenger</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <FolderIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Documentos</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CogIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Drive</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <MailIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Webmail</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <UsersIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Grupos de trabajo</span>}
//             </div>



//           </div>
//         </div>

//         {/* Colaboración3 con opciones desplegables */}
//         <div className="flex flex-col w-full ">
//           <div
//             className="flex items-center justify-between space-x-4 mb-4 cursor-pointer"
//             onClick={toggleCollaborationMenu3}
//           >
//             <div className="flex items-center">
//               <FolderIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white pl-3">Colaboración</span>}
//             </div>
//             {isSidebarOpen && (
//               <span>
//                 {isCollaborationOpen3 ? (
//                   <ChevronUpIcon className="w-4 h-4 text-white" />
//                 ) : (
//                   <ChevronDownIcon className="w-4 h-4 text-white" />
//                 )}
//               </span>
//             )}
//           </div>

//           {/* Submenú con transición */}
//           <div
//             className={`${isCollaborationOpen3 && "bg-white/20 rounded-xl mb-3 p-2"} overflow-hidden transition-all duration-300 ${isCollaborationOpen3 ? 'max-h-screen' : 'max-h-0'
//               }`}
//           >
//             <div className="flex items-center space-x-4 mb-4">
//               <HomeIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Feed</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CalendarIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Calendario</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CogIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Messenger</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <FolderIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Documentos</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <CogIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Drive</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <MailIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Webmail</span>}
//             </div>

//             <div className="flex items-center space-x-4 mb-4">
//               <UsersIcon className="w-6 h-6 text-white" />
//               {isSidebarOpen && <span className="text-white">Grupos de trabajo</span>}
//             </div>



//           </div>
//         </div>

//         {/* Otros ítems del menú */}
//         <div className="flex items-center space-x-4 mb-4">
//           <CalendarIcon className="w-6 h-6 text-white" />
//           {isSidebarOpen && <span className="text-white">Tareas y proyectos</span>}
//         </div>

//         <div className="flex items-center space-x-4 mb-4">
//           <CogIcon className="w-6 h-6 text-white" />
//           {isSidebarOpen && <span className="text-white">Firma electrónica</span>}
//         </div>

//         <div className="flex items-center space-x-4 mb-4">
//           <CogIcon className="w-6 h-6 text-white" />
//           {isSidebarOpen && <span className="text-white">Compañía</span>}
//         </div>

//         <div className="flex items-center space-x-4 mb-4">
//           <CogIcon className="w-6 h-6 text-white" />
//           {isSidebarOpen && <span className="text-white">Automatización</span>}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
