import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchRequerimientos } from '../../../slices/requerimientoSlice';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import { fetchRecursosForObraAndRecursoId } from '../../../slices/cantidadRecursosByBodegaSlice';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';

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

interface BodegaCantidad {
  nombre: string;
  cantidad: number;
}

const SalidasConsumosPrestamos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<string | null>(null);
  const [selectedObra, setSelectedObra] = useState<string>('');
  const [isLoadingRequerimientos, setIsLoadingRequerimientos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cantidadesPorBodega, setCantidadesPorBodega] = useState<Record<string, Record<string, number>>>({});
  const [recursosCantidades, setRecursosCantidades] = useState<Record<string, BodegaCantidad[]>>({});

  // Selectores
  const { requerimientos } = useSelector((state: RootState) => state.requerimiento);
  const { requerimientoRecursos, loading: loadingRecursos } = useSelector((state: RootState) => state.requerimientoRecurso);
  const { obras } = useSelector((state: RootState) => state.obra);
  const userId = useSelector((state: RootState) => state.user?.id);
  console.log(requerimientoRecursos)
  // Validación consolidada
  const validateSalida = () => {
    if (!selectedRequerimiento || !userId) {
      return 'Seleccione un requerimiento y verifique su sesión';
    }
    
    const haySeleccion = Object.values(cantidadesPorBodega).some(bodega =>
      Object.values(bodega).some(cantidad => cantidad > 0)
    );
    
    if (!haySeleccion) {
      return 'Debe seleccionar al menos una cantidad para transferir';
    }
    
    return null;
  };

  // Memos y callbacks simplificados
  const filteredRequerimientos = useMemo(() => 
    selectedObra ? requerimientos.filter(req => req.obra_id === selectedObra) : requerimientos
  , [requerimientos, selectedObra]);

  const getTotalSeleccionado = useCallback((recursoId: string) => 
    Object.values(cantidadesPorBodega[recursoId] || {}).reduce((sum, cantidad) => sum + cantidad, 0)
  , [cantidadesPorBodega]);

  const loadRecursoCantidades = useCallback(async (obraId: string, recursoId: string) => {
    try {
      const result = await dispatch(fetchRecursosForObraAndRecursoId({ obraId, recursoId })).unwrap();
      setRecursosCantidades(prev => ({
        ...prev,
        [recursoId]: result
      }));
    } catch (error) {
      console.error('Error al cargar cantidades:', error);
    }
  }, [dispatch]);

  const handleRequerimientoSelect = useCallback(async (id: string) => {
    setSelectedRequerimiento(id);
    try {
      // Limpiar cantidades anteriores
      setRecursosCantidades({});
      
      // Esperar a que se completen los recursos del requerimiento
      const recursos = await dispatch(fetchRequerimientoRecursos(id)).unwrap();
      
      // Una vez que tenemos los recursos, cargamos las cantidades
      const obraId = filteredRequerimientos.find(req => req.id === id)?.obra_id || '';
      if (obraId && recursos.length > 0) {
        // Cargar cantidades para cada recurso de manera secuencial
        for (const recurso of recursos) {
          await loadRecursoCantidades(obraId, recurso.recurso_id);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar recursos');
    }
  }, [dispatch, filteredRequerimientos, loadRecursoCantidades]);

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

  const handleCantidadBodegaChange = useCallback((
    recursoId: string, 
    bodegaNombre: string, 
    value: string, 
    cantidadAprobada: number,
    cantidadesActuales: Record<string, number>
  ) => {
    const newValue = Number(value) || 0;
    
    // Calcular el total actual sin la bodega actual
    const totalOtrasBodegas = Object.entries(cantidadesActuales || {})
      .reduce((sum, [bodega, cant]) => 
        bodega !== bodegaNombre ? sum + cant : sum, 0);
    
    // Calcular el máximo permitido para esta bodega
    const maxPermitido = Math.min(
      cantidadAprobada - totalOtrasBodegas,
      Number(value)
    );

    // Actualizar el valor asegurando que no sea negativo
    const cantidadFinal = Math.max(0, Math.min(maxPermitido, newValue));

    setCantidadesPorBodega(prev => ({
      ...prev,
      [recursoId]: {
        ...(prev[recursoId] || {}),
        [bodegaNombre]: cantidadFinal
      }
    }));
  }, []);

  const handleGuardarSalida = () => {
    const errorValidacion = validateSalida();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setShowConfirmDialog(true);
  };

  const procesarSalida = async () => {
    try {
      setIsProcessing(true);
      // 1. Validar que el usuario esté autenticado
      // 2. Crear la transferencia principal
      const requerimientoActual = requerimientos.find(r => r.id === selectedRequerimiento);
      
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      const transferenciaData = {
        usuario_id: userId,
        fecha: new Date(),
        movimiento_id: "6765ed96444c04c94802b3e1",
        movilidad_id: "6765ecf0444c04c94802b3df",
        estado: 'COMPLETO' as const,
        descripcion: `Salida por consumo - Req. ${requerimientoActual?.codigo}`
      };

      const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

      // 3. Crear el detalle de transferencia
      const detalleData = {
        transferencia_id: transferencia.id,
        referencia_id: selectedRequerimiento,
        fecha: new Date(),
        tipo: 'SALIDA_CONSUMO',
        referencia: `Salida por consumo - Req. ${requerimientoActual?.codigo}`
      };

      const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

      // 4. Crear los recursos de transferencia
      const promesasRecursos = [];

      for (const recurso of requerimientoRecursos) {
        const cantidadesBodega = cantidadesPorBodega[recurso.recurso_id] || {};
        
        for (const [bodegaNombre, cantidad] of Object.entries(cantidadesBodega)) {
          if (cantidad > 0) {
            const recursoData = {
              transferencia_detalle_id: detalleTransferencia.id,
              recurso_id: recurso.recurso_id,
              cantidad: cantidad,
              costo: recurso.precio || 0,
              bodega: bodegaNombre
            };

            promesasRecursos.push(dispatch(addTransferenciaRecurso(recursoData)).unwrap());
          }
        }
      }

      await Promise.all(promesasRecursos);

      // 5. Limpiar y cerrar
      setCantidadesPorBodega({});
      setSelectedRequerimiento(null);
      setShowConfirmDialog(false);
      
      // Mostrar mensaje de éxito
      setError('Salida procesada exitosamente');
      setTimeout(() => setError(null), 3000);

    } catch (error) {
      console.error('Error al procesar la salida:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar la salida');
    } finally {
      setIsProcessing(false);
    }
  };
  
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">En Bodega</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {requerimientoRecursos.map((recurso: RequerimientoRecurso) => (
                        <tr key={recurso.id} className="hover:bg-gray-50 transition-colors duration-150">                          
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.codigo}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.nombre}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.cantidad_aprobada}</td>
                          <td className="px-3 py-2">
                            {recursosCantidades[recurso.recurso_id] === undefined ? (
                              <div className="text-xs text-gray-400">Cargando...</div>
                            ) : recursosCantidades[recurso.recurso_id]?.length > 0 ? (
                              <div className="space-y-2">
                                {recursosCantidades[recurso.recurso_id].map((item: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between space-x-2">
                                    <span className="text-xs text-gray-600 min-w-[100px]">{item.nombre}:</span>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max={Math.min(
                                          item.cantidad,
                                          recurso.cantidad_aprobada - getTotalSeleccionado(recurso.recurso_id) + 
                                          (cantidadesPorBodega[recurso.recurso_id]?.[item.nombre] || 0)
                                        )}
                                        value={cantidadesPorBodega[recurso.recurso_id]?.[item.nombre] || ''}
                                        onChange={(e) => handleCantidadBodegaChange(
                                          recurso.recurso_id,
                                          item.nombre,
                                          e.target.value,
                                          recurso.cantidad_aprobada,
                                          cantidadesPorBodega[recurso.recurso_id] || {}
                                        )}
                                        className="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                      />
                                      <span className="text-xs text-gray-400">/ {item.cantidad}</span>
                                    </div>
                                  </div>
                                ))}
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                  Total: {getTotalSeleccionado(recurso.recurso_id)} / {recurso.cantidad_aprobada}
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400">Sin cantidades</div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">{recurso.estado}</td>
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

      {/* Agregar botón de guardar después de la tabla */}
      {selectedRequerimiento && (
        <div className="p-4 border-t bg-white">
          <div className="flex justify-end">
            <button
              onClick={handleGuardarSalida}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Procesando...' : 'Procesar Salida'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmDialog && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar Salida de Recursos
            </h3>
            <div className="max-h-60 overflow-y-auto mb-4">
                <p className="text-gray-700 mb-3">Se procesará la siguiente salida:</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                    {Object.entries(cantidadesPorBodega).map(([recursoId, bodegas]) => {
                        const recurso = requerimientoRecursos.find(r => r.recurso_id === recursoId);
                        if (!recurso) return null;

                        return (
                            <div key={recursoId} className="mb-3 border-b pb-2">
                                <p className="font-medium text-gray-800">{recurso.nombre}</p>
                                {Object.entries(bodegas).map(([bodega, cantidad]) => (
                                    cantidad > 0 && (
                                        <div key={bodega} className="ml-4 text-sm text-gray-600">
                                            • {bodega}: {cantidad} unidades
                                        </div>
                                    )
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded"
                    disabled={isProcessing}
                >
                    Cancelar
                </button>
                <button
                    onClick={procesarSalida}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <span>Confirmar Salida</span>
                    )}
                </button>
            </div>
        </div>
    </div>
)}
    </div>
  );
};

export default React.memo(SalidasConsumosPrestamos);
