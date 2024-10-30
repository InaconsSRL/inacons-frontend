import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchRecursos } from '../../../slices/recursoSlice';
import { fetchObras } from '../../../slices/obrasSlice';
import { ProductCard } from './ProductCard';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { ProductListProps } from './types/interfaces';

export const ProductList: React.FC<ProductListProps> = ({ requerimiento_id, fecha_final }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recursos, loading: loadingRecursos } = useSelector((state: RootState) => state.recurso);
  const { obras, loading: loadingObras } = useSelector((state: RootState) => state.obra);
  const { requerimientoRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecursos, setFilteredRecursos] = useState(recursos);

  useEffect(() => {
    if (recursos.length === 0) dispatch(fetchRecursos());
    if (obras.length === 0) dispatch(fetchObras());
  }, [dispatch]);

  // Filtrar recursos que ya están seleccionados y aplicar búsqueda
  useEffect(() => {
    const selectedRecursosIds = requerimientoRecursos.map(rr => rr.recurso_id);

    const filtered = recursos.filter(recurso => {
      // Verificar que recurso no sea null o undefined
      if (!recurso) return false;

      // Excluir recursos ya seleccionados
      if (selectedRecursosIds.includes(recurso.id)) return false;

      // Aplicar filtro de búsqueda
      const searchLower = searchTerm.toLowerCase();
      return (
        recurso.codigo?.toString().includes(searchTerm) ||
        recurso.nombre?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredRecursos(filtered);
  }, [recursos, searchTerm, requerimientoRecursos]);

  if (loadingRecursos || loadingObras) {
    return <LoaderPage />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Barra de búsqueda */}
      <div className="mb-4 sticky top-0 bg-white p-4 shadow-md rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto pr-4">
        {filteredRecursos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron productos
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-h-[75vh] overflow-y-auto">
            {filteredRecursos.map((recurso) => (
              <ProductCard
              key={recurso.id}
              {...recurso}
              requerimiento_id={requerimiento_id}
              fecha_limit={fecha_final}
              />
            ))}
            </div>
        )}
      </div>
    </div>
  );
};