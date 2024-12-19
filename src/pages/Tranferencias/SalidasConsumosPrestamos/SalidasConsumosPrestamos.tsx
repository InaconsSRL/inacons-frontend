import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchRequerimientos } from '../../../slices/requerimientoSlice';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import type { Requerimiento, RequerimientoRecurso } from './types';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} role="status" />
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex h-full items-center justify-center" role="status">
    <div className="text-center text-gray-400">
      <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="mt-2">{message}</p>
    </div>
  </div>
);

const SalidasConsumosPrestamos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<string | null>(null);
  const [selectedObra, setSelectedObra] = useState<string>('');
  const [isLoadingRequerimientos, setIsLoadingRequerimientos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { requerimientos } = useSelector((state: RootState) => state.requerimiento);
  const { requerimientoRecursos, loading: loadingRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  const { obras } = useSelector((state: RootState) => state.obra);

  console.log(requerimientoRecursos)

  const filteredRequerimientos = useMemo(() => {
    if (!selectedObra) return requerimientos;
    return requerimientos.filter(req => req.obra_id === selectedObra);
  }, [requerimientos, selectedObra]);

  const handleRequerimientoSelect = useCallback((id: string) => {
    setSelectedRequerimiento(id);
    dispatch(fetchRequerimientoRecursos(id))
      .unwrap()
      .catch(error => setError(error.message));
  }, [dispatch]);

  useEffect(() => {
    const loadRequerimientos = async () => {
      setIsLoadingRequerimientos(true);
      try {
        await dispatch(fetchRequerimientos()).unwrap();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar requerimientos');
      } finally {
        setIsLoadingRequerimientos(false);
      }
    };
    loadRequerimientos();
  }, [dispatch]);

  const getEstadoAtenciónStyle = useCallback((estado: string) => {
    const styles = {
      Pendiente: 'bg-yellow-100 text-yellow-700',
      Completado: 'bg-green-100 text-green-700',
      default: 'bg-gray-100 text-gray-700'
    };
    return styles[estado as keyof typeof styles] || styles.default;
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
        <h1 className="text-lg font-semibold text-gray-700">Salidas, Consumos y Préstamos</h1>
        <select
          value={selectedObra}
          onChange={(e) => setSelectedObra(e.target.value)}
          className="w-56 px-2 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
          aria-label="Seleccionar obra"
        >
          <option value="">Todas las obras</option>
          {obras.map((obra) => (
            <option key={obra.id} value={obra.id}>{obra.nombre}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 border-b border-red-100" role="alert">
          {error}
        </div>
      )}

      <div className="flex h-[calc(90vh-12rem)]">
        {/* Panel izquierdo */}
        <div className="w-1/4 border-r border-gray-100 p-3 overflow-y-auto bg-gray-100">
          {isLoadingRequerimientos ? (
            [...Array(5)].map((_, index) => (
              <div key={index} className="p-3 mb-2 rounded-md border border-white">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-1" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))
          ) : filteredRequerimientos.length === 0 ? (
            <EmptyState message="No hay requerimientos disponibles" />
          ) : (
            filteredRequerimientos.map((requerimiento: Requerimiento) => (
              <div
                key={requerimiento.id}
                onClick={() => handleRequerimientoSelect(requerimiento.id)}
                className={`p-3 mb-2 shadow-xl rounded-md cursor-pointer border transition-all duration-200 ${
                  selectedRequerimiento === requerimiento.id
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="text-sm font-medium text-gray-700">{requerimiento.codigo}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Solicitante: {requerimiento.usuario}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Fecha: {new Date(requerimiento.fecha_solicitud).toLocaleDateString()}
                </div>
                <div className="text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded-full ${getEstadoAtenciónStyle(requerimiento.estado_atencion)}`}>
                    {requerimiento.estado_atencion}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel derecho */}
        <div className="flex-1 flex flex-col h-full">
          {selectedRequerimiento ? (
            <>
              <div className="p-3 bg-white border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-700">Recursos del Requerimiento</h2>
              </div>

              <div className="flex-1 overflow-auto p-3">
                {loadingRecursos ? (
                  <div className="animate-pulse">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="h-16 mb-2" />
                    ))}
                  </div>
                ) : requerimientoRecursos.length === 0 ? (
                  <EmptyState message="No hay recursos para este requerimiento" />
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky -top-3">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad Aprobada</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {requerimientoRecursos.map((recurso: RequerimientoRecurso) => (
                        <tr key={recurso.id} className="hover:bg-gray-50 transition-colors duration-150">                          
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.codigo}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.nombre}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.cantidad_aprobada}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.estado}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.notas}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <EmptyState message="Selecciona un requerimiento para ver sus recursos" />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SalidasConsumosPrestamos);
