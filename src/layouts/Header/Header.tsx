import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiBell, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg'
import avatar from '../../assets/avatar.webp'
import { fetchRecursos } from '../../slices/recursoSlice';
import { RootState, AppDispatch } from '../../store/store';
import { fetchObras } from '../../slices/obrasSlice';
import { fetchUnidades } from '../../slices/unidadSlice';
import { fetchUsuariosAndCargos } from '../../slices/usuarioSlice';
import { fetchCotizaciones } from '../../slices/cotizacionSlice';
import { fetchTiposRecurso } from '../../slices/tipoRecursoSlice';
import { GlobalDateFilter } from '../../components/GlobalDateFilter/GlobalDateFilter';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(fetchRecursos());
    dispatch(fetchObras());
    dispatch(fetchUnidades());
    dispatch(fetchUsuariosAndCargos());
    dispatch(fetchCotizaciones());
    dispatch(fetchTiposRecurso());
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
        <GlobalDateFilter />

        <div className="flex items-center space-x-4 text-center">
          <span className="text-white text-lg hidden lg:block">{currentTime}</span>
          <div className="flex items-center space-x-2" ref={menuRef}>
            <div
              className="flex items-center text-white cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <img src={avatar} alt="Avatar" className="h-10 mr-4" />
              <span>{user.usuario || 'Usuario'}</span>
            </div>
            {isMenuOpen && (
              <div className="absolute right-16 top-16 bg-white rounded-lg shadow-lg py-2 px-4 min-w-[200px]">
                <div className="flex flex-col items-start gap-3">
                  <span className="font-semibold text-gray-800"> Hola {user.usuario}, ¿Ya te vas?</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <FiLogOut />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <FiBell className="w-6 h-6 text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;