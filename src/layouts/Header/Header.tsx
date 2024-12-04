import React, {useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/logo.svg'
import avatar from '../../assets/avatar.webp'
import { fetchRecursos } from '../../slices/recursoSlice';
import { RootState, AppDispatch } from '../../store/store';
import { fetchObras } from '../../slices/obrasSlice';
import { fetchUnidades } from '../../slices/unidadSlice';
import { fetchUsuariosAndCargos } from '../../slices/usuarioSlice';
import { fetchCotizaciones } from '../../slices/cotizacionSlice';


interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {  
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchRecursos());
    dispatch(fetchObras());
    dispatch(fetchUnidades());
    dispatch(fetchUsuariosAndCargos());
    dispatch(fetchCotizaciones());
  }, []);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const user = useSelector((state: RootState) => state.user);
  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-lg z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        <div className="flex items-center mx-2 sm:mx-1 lg:mx-5 lg:ml-5 xl:ml-10">
          <img src={logo} alt="Logo" className="h-10 mr-4" />
        </div>

        {/* <div className="flex items-center flex-grow lg:mx-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar requerimientos, presupuestos y más"
              className="w-full bg-gray-100 bg-opacity-40 text-white pl-4 pr-10 py-2 rounded-full focus:outline-none"
            />
            <FiSearch className="absolute right-3 top-2 w-5 h-5 text-white" />
          </div>
        </div> */}

        <div className="flex items-center space-x-4 text-center">
          <span className="text-white text-lg hidden lg:block">{currentTime}</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-white">
              <img src={avatar} alt="Avatar" className="h-10 mr-4" />
              <span>{user.usuario || 'Usuario'}</span>
            </div>
          </div>

          <FiBell className="w-6 h-6 text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;