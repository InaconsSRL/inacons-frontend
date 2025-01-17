import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchRecursos } from '../../../slices/recursoSlice';
import { fetchObras } from '../../../slices/obrasSlice';
import { ProductCard } from './ProductCard';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { ProductListProps } from './types/interfaces';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';

export const ProductList: React.FC<ProductListProps> = ({ requerimiento_id, fecha_final }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recursos, loading: loadingRecursos } = useSelector((state: RootState) => state.recurso);
  const { obras, loading: loadingObras } = useSelector((state: RootState) => state.obra);
  const { requerimientoRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  
  const [searchInput, setSearchInput] = useState('');
  const [displayedRecursos, setDisplayedRecursos] = useState<typeof recursos>([]);
  const [showAll] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Cargar recursos y obras iniciales
  useEffect(() => {
    if (recursos.length === 0) dispatch(fetchRecursos());
    if (obras.length === 0) dispatch(fetchObras());
  }, [dispatch]);

  useEffect(() => {
    handleSearch();
  }, [requerimientoRecursos]);

  // Función de búsqueda
  const handleSearch = () => {
    const selectedIds = requerimientoRecursos.map(rr => rr.recurso_id);
    
    // Si no hay término de búsqueda y no se quiere mostrar todo, limpiar resultados
    if (!searchInput.trim() && !showAll) {
      setDisplayedRecursos([]);
      return;
    }

    // Si showAll está activo o hay un término de búsqueda, filtrar recursos
    const searchTerm = searchInput.toLowerCase().trim();
    const filteredRecursos = recursos.filter(recurso => {
      if (!recurso || selectedIds.includes(recurso.id)) return false;
      
      if (!searchTerm && showAll) return true;

      return (
        recurso.codigo?.toString().includes(searchTerm) ||
        recurso.nombre?.toLowerCase().includes(searchTerm)
      );
    });

    setDisplayedRecursos(filteredRecursos);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loadingRecursos || loadingObras) {
    return <LoaderPage />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-22rem)] overflow-hidden">
      {/* Barra de búsqueda */}
      <div className="mb-4 sticky top-0 bg-white/80 p-4 shadow-md rounded-lg">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <FiSearch />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title={viewType === 'grid' ? "Vista lista" : "Vista cuadrícula"}
            >
              {viewType === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto pr-4">
        {displayedRecursos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchInput.trim() || showAll ? 
              "No se encontraron productos" : 
              "Ingrese un término de búsqueda para mostrar recursos"}
          </div>
        ) : (
          <div className={`${
            viewType === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'grid grid-cols-1 gap-4'
          } max-h-[calc(100vh-28rem)] overflow-y-auto`}>
            {displayedRecursos.map((recurso) => (
              <ProductCard
                key={recurso.id}
                {...recurso}
                requerimiento_id={requerimiento_id}
                fecha_limit={fecha_final}
                viewType={viewType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};