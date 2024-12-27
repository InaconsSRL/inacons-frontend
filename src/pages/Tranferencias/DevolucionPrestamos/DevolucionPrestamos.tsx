import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchPrestamos, PrestamoOutput } from '../../../slices/prestamoSlice';
import { fetchPrestamoRecursosByPrestamoId } from '../../../slices/prestamoRecursoSlice';
import { PrestamoRecursoResponse } from '../../../types/prestamoRecurso';
import { FiSearch } from 'react-icons/fi';

type PrestamoDetails = PrestamoOutput;

const DevolucionPrestamos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedObra, setSelectedObra] = useState<string>('');
  const [selectedPrestamo, setSelectedPrestamo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { prestamos, loading: prestamosLoading } = useSelector((state: RootState) => state.prestamo);
  const { prestamoRecursos, loading: recursosLoading } = useSelector((state: RootState) => state.prestamoRecurso);
  const { obras } = useSelector((state: RootState) => state.obra);
  const { unidades } = useSelector((state: RootState) => state.unidad);
  const { tiposRecurso } = useSelector((state: RootState) => state.tipoRecurso);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchPrestamos());
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error:', err);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedPrestamo) {
      dispatch(fetchPrestamoRecursosByPrestamoId(selectedPrestamo));
    }
  }, [selectedPrestamo, dispatch]);

  const handlePrestamoClick = (prestamoId: string) => {
    if (selectedPrestamo === prestamoId) {
      setSelectedPrestamo(null); // Deseleccionar si se hace clic en el mismo préstamo
    } else {
      setSelectedPrestamo(prestamoId);
    }
  };

  const filteredPrestamos = React.useMemo(() => {
    return prestamos.filter((prestamo: PrestamoDetails) => 
      prestamo && (!selectedObra || prestamo.obra_id?.id === selectedObra)
    );
  }, [prestamos, selectedObra]);

  const filteredRecursos = React.useMemo(() => {
    if (!selectedPrestamo) return [];
    
    return prestamoRecursos.filter((recurso: PrestamoRecursoResponse) => 
      recurso && 
      recurso.prestamo_id?.id === selectedPrestamo &&
      recurso.obrabodega_recurso_id?.recurso_id && 
      (recurso.obrabodega_recurso_id.recurso_id.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
       recurso.obrabodega_recurso_id.recurso_id.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [prestamoRecursos, selectedPrestamo, searchTerm]);

  const getUnidadNombre = (unidadId: string) => {
    const unidad = unidades.find(u => u.id === unidadId);
    return unidad?.nombre || 'N/A';
  };

  const getTipoRecursoNombre = (tipoRecursoId: string) => {
    const tipoRecurso = tiposRecurso.find(tr => tr.id === tipoRecursoId);
    return tipoRecurso?.nombre || 'N/A';
  };

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel izquierdo - Lista de Préstamos */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Devolución de Préstamo</h2>
              <select
                value={selectedObra}
                onChange={(e) => setSelectedObra(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md"
              >
                <option value="">Todas las obras</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4 max-h-[calc(90vh-12rem)] overflow-y-auto">
              {prestamosLoading ? (
                Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">{renderSkeleton()}</div>
                ))
              ) : (
                filteredPrestamos.map((prestamo: PrestamoDetails) => (
                  prestamo && prestamo.personal_id && (
                    <div
                      key={prestamo.id}
                      onClick={() => handlePrestamoClick(prestamo.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPrestamo === prestamo.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        Solicitante: {prestamo.personal_id?.nombres || 'No especificado'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Fecha: {new Date(prestamo.fecha).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Retorno: {new Date(prestamo.f_retorno).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          prestamo.estado === 'ACTIVO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prestamo.estado}
                        </span>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel derecho - Recursos del Préstamo */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recursos del Préstamo</h2>
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pr-10"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="p-4">
            {selectedPrestamo ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recursosLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4">
                          {renderSkeleton()}
                        </td>
                      </tr>
                    ) : (
                      filteredRecursos.map((recurso: PrestamoRecursoResponse) => (
                        recurso && recurso.obrabodega_recurso_id?.recurso_id && (
                          <tr key={recurso.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {recurso.obrabodega_recurso_id.recurso_id.codigo}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {recurso.obrabodega_recurso_id.recurso_id.nombre}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {recurso.cantidad}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {getTipoRecursoNombre(recurso.obrabodega_recurso_id.recurso_id.tipo_recurso_id)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {getUnidadNombre(recurso.obrabodega_recurso_id.recurso_id.unidad_id)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Prestado
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => {/* Aquí irá la lógica para procesar la devolución */}}
                              >
                                Devolver
                              </button>
                            </td>
                          </tr>
                        )
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center text-gray-500">
                Seleccione un préstamo para ver sus recursos
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Procesar Ingreso
        </button>
      </div>
    </div>
  );
};

export default DevolucionPrestamos;