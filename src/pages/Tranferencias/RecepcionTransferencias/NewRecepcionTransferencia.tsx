import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchTransferenciaDetalles, fetchObraOrigenYDestino, addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { fetchTransferenciaRecursosById, addTransferenciaRecurso, Recurso } from '../../../slices/transferenciaRecursoSlice';
import { updateObraBodegaRecurso, addObraBodegaRecurso } from '../../../slices/obraBodegaRecursoSlice';
import { } from '../../../slices/transferenciaRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { formatDate } from '../../../components/Utils/dateUtils';
import { ModalProps, ObraInfo, TransferenciaRecurso, Unidades2 } from './type';
import { consultaRecursosPorBodegaByObraIdAndRecursoIdService } from '../../../services/consultaRecursosPorBodegaByObraIdAndRecursoIdService';

interface BodegaInfo {
  obra_bodega_id: string;
  nombre: string;
  cantidad: number;
  costo: number;
  obra_bodega_recursos_id: string;
  existencia: string;
}

interface RecursoConBodegas extends TransferenciaRecurso {
  cantidadModificada?: number;
  bodegasDistribucion: {
    [bodegaId: string]: number;
  };
}

const getUnidadNombre = (recurso: TransferenciaRecurso, unidades: Unidades2[]): string => {
  if (!recurso?.recurso_id?.unidad_id || !unidades) return '-';
  const unidad = unidades.find(u => u.id === recurso.recurso_id.unidad_id);
  return unidad?.nombre || '-';
};

const NewRecepcionTransferencia: React.FC<ModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTransferencia, setSelectedTransferencia] = useState<string | null>(null);
  const [selectedRecursos, setSelectedRecursos] = useState<RecursoConBodegas[]>([]);
  const [isLoadingDetalles, setIsLoadingDetalles] = useState(true);
  const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.user?.id);
  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  const [obrasInfo, setObrasInfo] = useState<ObraInfo | null>(null);
  const [bodegasInfo, setBodegasInfo] = useState<{ [key: string]: BodegaInfo[] }>({});

  const { transferenciaDetalles } = useSelector((state: RootState) => state.transferenciaDetalle);
  const { transferenciaRecursos } = useSelector((state: RootState) => state.transferenciaRecurso);

  console.log('transferenciaRecursos:', transferenciaRecursos);

  // Filtrar solo las transferencias de tipo SALIDA-ALMACEN
  const filteredTransferencias = transferenciaDetalles.filter(
    detalle => detalle.tipo === 'SALIDA-ALMACEN'
  );

  useEffect(() => {
    const loadTransferencias = async () => {
      setIsLoadingDetalles(true);
      await dispatch(fetchTransferenciaDetalles());
      setIsLoadingDetalles(false);
    };
    loadTransferencias();
  }, [dispatch]);

  useEffect(() => {
    const loadRecursos = async () => {
      if (!selectedTransferencia) return;
  
      try {
        setIsLoadingRecursos(true);
  
        // Obtener recursos
        const response = await dispatch(fetchTransferenciaRecursosById(selectedTransferencia));
  
        if (!response.payload) {
          throw new Error('No se recibieron datos de recursos');
        }
  
        // Inicializar recursos con cantidadModificada
        const recursosConCantidad = response.payload.map((recurso: Recurso) => ({
          ...recurso,
          cantidadModificada: 0,
          bodegasDistribucion: {}
        }));
        setSelectedRecursos(recursosConCantidad);
  
        // Obtener información de bodegas
        const obraDestinoId = obrasInfo?.referencia_id?.obra_destino_id?._id;
        if (obraDestinoId) {
          const bodegasPromises = response.payload.map(async (recurso: TransferenciaRecurso) => {
            try {
              const bodegas = await consultaRecursosPorBodegaByObraIdAndRecursoIdService({
                obraId: obraDestinoId,
                recursoId: recurso.recurso_id.id
              });
              return { [recurso.recurso_id.id]: bodegas };
            } catch (error) {
              console.error(`Error al obtener bodegas para recurso ${recurso.recurso_id.id}:`, error);
              return { [recurso.recurso_id.id]: [] };
            }
          });
  
          const bodegasResults = await Promise.all(bodegasPromises);
          const bodegasData = bodegasResults.reduce((acc, curr) => ({
            ...acc,
            ...curr
          }), {});
  
          setBodegasInfo(bodegasData);
        }
      } catch (error) {
        console.error('Error al cargar recursos:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setIsLoadingRecursos(false);
      }
    };
  
    loadRecursos();
  }, [selectedTransferencia, dispatch, obrasInfo]);

  useEffect(() => {
    const loadObrasInfo = async () => {
      if (selectedTransferencia) {
        const transferencia = transferenciaDetalles.find(t => t.id === selectedTransferencia);
        if (transferencia) {
          const response = await dispatch(fetchObraOrigenYDestino(transferencia.transferencia_id.id));
          if (response.payload && response.payload.length > 0) {
            setObrasInfo(response.payload[0]);
          }
        }
      }
    };
    loadObrasInfo();
  }, [selectedTransferencia, dispatch, transferenciaDetalles]);

  const handleCantidadChange = (recursoId: string, bodegaId: string, valor: number) => {
    const cantidadValidada = Math.max(0, valor);
    const recurso = transferenciaRecursos.find(r => r._id === recursoId);

    if (recurso) {
      setSelectedRecursos(prev => {
        const index = prev.findIndex(r => r._id === recursoId);
        const recursoActual = prev.find(r => r._id === recursoId) || {
          ...recurso,
          bodegasDistribucion: {},
          cantidadModificada: 0
        };

        // Actualizar la distribución de bodegas
        const nuevaDistribucion = {
          ...recursoActual.bodegasDistribucion,
          [bodegaId]: cantidadValidada
        };

        // Calcular el total distribuido
        const totalDistribuido = Object.values(nuevaDistribucion).reduce((sum, val) => sum + val, 0);

        // Validar que no exceda la cantidad disponible
        if (totalDistribuido <= recurso.cantidad) {
          const recursoActualizado = {
            ...recursoActual,
            bodegasDistribucion: nuevaDistribucion,
            cantidadModificada: totalDistribuido
          };

          if (index === -1) {
            return [...prev, recursoActualizado];
          } else {
            const newArray = [...prev];
            newArray[index] = recursoActualizado;
            return newArray;
          }
        }

        return prev;
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      if (!userId) throw new Error('Usuario no autenticado');
      if (!selectedTransferencia) throw new Error('No hay transferencia seleccionada');

      const transferencia = transferenciaDetalles.find(t => t.id === selectedTransferencia);
      if (!transferencia) throw new Error('Transferencia no encontrada');

      // Verificar si hay recursos seleccionados con cantidad mayor a 0
      const recursosValidos = selectedRecursos.filter(recurso =>
        (recurso.cantidadModificada || 0) > 0
      );

      if (recursosValidos.length === 0) {
        throw new Error('No hay recursos seleccionados para transferir');
      }

      // Crear el detalle de transferencia
      const detalleData = {
        transferencia_id: transferencia.id,
        referencia_id: transferencia.id,
        fecha: new Date(),
        tipo: 'RECEPCION_TRANSFERENCIA',
        referencia: `Recepción de transferencia - ${transferencia.referencia}`
      };

      const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

      // Procesar los recursos de transferencia
      const recursosPromesas = recursosValidos.map(recurso => {
        return dispatch(addTransferenciaRecurso({
          transferencia_detalle_id: detalleTransferencia.id,
          recurso_id: recurso.recurso_id.id,
          cantidad: recurso.cantidadModificada!,
          costo: recurso.costo
        })).unwrap();
      });

      await Promise.all(recursosPromesas);

      // Actualizar las cantidades en ObraBodegaRecurso
      if (obrasInfo) {
        //const obraDestinoId = obrasInfo.referencia_id.obra_destino_id._id;

        // Actualizar o crear registros en la bodega de destino
        const actualizacionesObraBodega = recursosValidos.map(async (recurso) => {
          const bodegasDelRecurso = bodegasInfo[recurso._id] || [];
        
          for (const bodega of bodegasDelRecurso) {
            try {
              // Intentar actualizar primero
              await dispatch(updateObraBodegaRecurso({
                updateObraBodegaRecursoId: bodega.obra_bodega_recursos_id,
                cantidad: recurso.cantidadModificada!,
              })).unwrap();
            } catch (error) {
              console.log('Error al actualizar ObraBodegaRecurso:', error);
              // Si falla la actualización, crear nuevo registro
              await dispatch(addObraBodegaRecurso({
                obraBodegaId: bodega.obra_bodega_id,
                recursoId: recurso.recurso_id.id,
                cantidad: recurso.cantidadModificada!,
                costo: bodega.costo,
                estado: 'ACTIVO'
              })).unwrap();
            }
          }
        });

        await Promise.all(actualizacionesObraBodega);
      }

      // Actualizar la vista
      dispatch(fetchTransferenciaDetalles());
      dispatch(fetchTransferenciaRecursosById(selectedTransferencia));

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la recepción');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-indigo-100">

      {error && (
        <div className="p-3 text-red-500 bg-red-50 border-b border-red-100">
          {error}
        </div>
      )}

      <div className="flex h-[calc(90vh-12rem)]">
        {/* Panel izquierdo - Lista de Transferencias */}
        <div className="w-1/3 border-r border-indigo-100 p-4 overflow-y-auto bg-white">
          {isLoadingDetalles ? (
            <div className="flex justify-center items-center h-full">
              <LoaderPage />
            </div>
          ) : (
            filteredTransferencias.map(transferencia => (
              <div
                key={transferencia.id}
                onClick={() => setSelectedTransferencia(transferencia.id)}
                className={`p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedTransferencia === transferencia.id
                    ? 'bg-indigo-50 border-indigo-200 shadow'
                    : 'bg-white border border-gray-100 hover:shadow-md hover:border-indigo-100'
                  }`}
              >
                <div className="text-sm font-medium text-indigo-700">{transferencia.referencia}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Usuario: {transferencia.transferencia_id.usuario_id.nombres}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Fecha: {new Date(transferencia.fecha).toLocaleDateString()}
                </div>
                {selectedTransferencia === transferencia.id && obrasInfo && (
                  <>
                    <div className="text-xs text-gray-600 mt-1">
                      Desde: {obrasInfo.referencia_id.obra_origen_id ? obrasInfo.referencia_id.obra_origen_id.nombre : 'Sin origen'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Para: {obrasInfo.referencia_id.obra_destino_id ? obrasInfo.referencia_id.obra_destino_id.nombre : 'Sin destino'}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Panel derecho - Recursos */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedTransferencia ? (
            isLoadingRecursos ? (
              <div className="flex justify-center items-center h-full">
                <LoaderPage />
              </div>
            ) : (
              <div className="overflow-auto p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="text-center">
                      <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase">Unidad</th>
                      <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase">Cantidad a Recibir</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {transferenciaRecursos.map(recurso => {
                      const bodegasDelRecurso = bodegasInfo[recurso.recurso_id.id] || [];
                      const selectedRecurso = selectedRecursos.find(r => r._id === recurso._id);
                      const totalDistribuido = selectedRecurso ? 
                        Object.values(selectedRecurso.bodegasDistribucion || {}).reduce((sum, val) => sum + val, 0) : 0;

                      return (
                        <tr key={recurso._id} className="hover:bg-gray-50">
                          <td className="px-2 text-center py-3 text-sm text-gray-600">
                            {formatDate(recurso.transferencia_detalle_id.fecha, 'dd/mm/yyyy')}
                          </td>
                          <td className="px-2 text-center py-3 text-sm text-gray-600">
                            {recurso.recurso_id?.codigo || '-'}
                          </td>
                          <td className="px-2 text-left py-3 text-sm text-gray-600">
                            {recurso.recurso_id?.nombre || '-'}
                          </td>
                          <td className="px-2 text-center py-3 text-sm text-gray-600">
                            {getUnidadNombre(recurso, unidades)}
                          </td>
                          <td className="px-2 text-center py-3 text-sm text-gray-600">
                            {recurso.cantidad}
                          </td>
                          <td className="px-2 py-3">
                            <div className="space-y-2">
                              {bodegasDelRecurso.map(bodega => (
                                <div key={bodega.obra_bodega_id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                                  <span className="text-sm text-gray-600 min-w-[120px]">{bodega.nombre}:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={recurso.cantidad - (totalDistribuido - (selectedRecurso?.bodegasDistribucion[bodega.obra_bodega_id] || 0))}
                                    value={selectedRecurso?.bodegasDistribucion[bodega.obra_bodega_id] || 0}
                                    onChange={(e) => handleCantidadChange(recurso._id, bodega.obra_bodega_id, parseInt(e.target.value) || 0)}
                                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                  <span className="text-xs text-gray-500">
                                    (Actual: {bodega.cantidad})
                                  </span>
                                </div>
                              ))}
                              <div className="text-sm text-indigo-600 font-medium">
                                Total distribuido: {totalDistribuido} / {recurso.cantidad}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="mt-2 text-sm">Selecciona una transferencia para ver sus recursos</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-100 flex justify-end space-x-3 bg-white">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          disabled={isProcessing}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors duration-200"
          disabled={!selectedTransferencia || isProcessing || selectedRecursos.length === 0}
        >
          {isProcessing ? 'Procesando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
};

export default NewRecepcionTransferencia;
