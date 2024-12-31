import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchTransferenciaDetalles, fetchObraOrigenYDestino, addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { fetchTransferenciaRecursosById, addTransferenciaRecurso, Recurso } from '../../../slices/transferenciaRecursoSlice';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { updateObraBodegaRecurso, addObraBodegaRecurso } from '../../../slices/obraBodegaRecursoSlice';
import {  } from '../../../slices/transferenciaRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { formatDate } from '../../../components/Utils/dateUtils';

interface ModalProps {
  onClose: () => void;
}

interface TransferenciaRecurso {
  _id: string;
  transferencia_detalle_id: {
    id: string;
    referencia_id: string;
    fecha: string;
    tipo: string;
    referencia: string;
  };
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    unidad_id: string
    imagenes?: { file: string }[];
  };
  cantidad: number;
  costo: number;
  cantidadModificada?: number; 
}

interface Unidades2 {
  id: string;
  nombre: string;
}

interface Obra {
  nombre: string;
  _id: string;
}

interface ObraInfo {
  referencia_id: {
    obra_destino_id: Obra;
    obra_origen_id: Obra;
  }
}

// Agregar esta función de utilidad antes del componente
const getUnidadNombre = (recurso: TransferenciaRecurso, unidades: Unidades2[]): string => {
  if (!recurso?.recurso_id?.unidad_id || !unidades) return '-';
  const unidad = unidades.find(u => u.id === recurso.recurso_id.unidad_id);
  return unidad?.nombre || '-';
};

const NewRecepcionTransferencia: React.FC<ModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTransferencia, setSelectedTransferencia] = useState<string | null>(null);
  const [selectedRecursos, setSelectedRecursos] = useState<TransferenciaRecurso[]>([]);
  const [isLoadingDetalles, setIsLoadingDetalles] = useState(true);
  const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.user?.id);
  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  const [obrasInfo, setObrasInfo] = useState<ObraInfo | null>(null);

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
      if (selectedTransferencia) {
        setIsLoadingRecursos(true);
        const response = await dispatch(fetchTransferenciaRecursosById(selectedTransferencia));
        // Inicializar los recursos con cantidadModificada en 0
        if (response.payload) {
          const recursosConCantidad = response.payload.map( (recurso: Recurso)  => ({
            ...recurso,
            cantidadModificada: 0
          }));
          setSelectedRecursos(recursosConCantidad);
        }
        setIsLoadingRecursos(false);
      }
    };
    loadRecursos();
  }, [selectedTransferencia, dispatch]);

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

  const handleCantidadChange = (recursoId: string, valor: number) => {
    const cantidadValidada = Math.max(0, valor);
    const recurso = transferenciaRecursos.find(r => r._id === recursoId);
    
    if (recurso) {
      setSelectedRecursos(prev => {
        const index = prev.findIndex(r => r._id === recursoId);
        const recursoActualizado = {
          ...recurso,
          cantidadModificada: Math.min(cantidadValidada, recurso.cantidad)
        };
        
        if (index === -1) {
          return [...prev, recursoActualizado];
        } else {
          const newArray = [...prev];
          newArray[index] = recursoActualizado;
          return newArray;
        }
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

      // Crear la transferencia
      const transferenciaData = {
        usuario_id: userId,
        fecha: new Date(),
        movimiento_id: "6773f8eacfeba5769b30f4ee",
        movilidad_id: transferencia.transferencia_id.movilidad_id?.id || "6765ecf0444c04c94802b3df",
        estado: 'COMPLETO' as const,
        descripcion: `Recepción de transferencia - ${transferencia.referencia}`
      };

      const nuevaTransferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

      // Crear el detalle de transferencia
      const detalleData = {
        transferencia_id: nuevaTransferencia.id,
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
        const obraDestinoId = obrasInfo.referencia_id.obra_destino_id._id;
        
        // Actualizar o crear registros en la bodega de destino
        const actualizacionesObraBodega = recursosValidos.map(async (recurso) => {
          try {
            // Intentar actualizar primero
            try {
              await dispatch(updateObraBodegaRecurso({
                updateObraBodegaRecursoId: obraDestinoId,
                cantidad: recurso.cantidadModificada!,
              })).unwrap();
            } catch (error) {
              console.log('Error al actualizar ObraBodegaRecurso:', error);
              // Si falla la actualización, intentamos crear un nuevo registro
              await dispatch(addObraBodegaRecurso({
                obraBodegaId: obraDestinoId,
                recursoId: recurso.recurso_id.id,
                cantidad: recurso.cantidadModificada!,
                costo: recurso.costo,
                estado: 'ACTIVO' // o el estado que corresponda según tu lógica
              })).unwrap();
            }
          } catch (error) {
            console.error('Error al procesar ObraBodegaRecurso:', error);
            throw error;
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
      {/* Header */}
      <div className="p-4 border-b border-indigo-100 bg-white">
        <h2 className="text-lg font-semibold text-indigo-700">Recepción de Transferencias</h2>
      </div>

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
                className={`p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTransferencia === transferencia.id
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
                      Desde: {obrasInfo.referencia_id.obra_origen_id? obrasInfo.referencia_id.obra_origen_id.nombre : 'Sin origen'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Para: {obrasInfo.referencia_id.obra_destino_id? obrasInfo.referencia_id.obra_destino_id.nombre : 'Sin destino'}
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
                    {transferenciaRecursos.map(recurso => (
                      <tr key={recurso._id} className="hover:bg-gray-50">                        
                        <td className="px-2 text-center py-3 text-sm text-gray-600">{formatDate(recurso.transferencia_detalle_id.fecha,'dd/mm/yyyy')}</td>
                        <td className="px-2 text-center py-3 text-sm text-gray-600">{recurso.recurso_id?.codigo || '-'}</td>
                        <td className="px-2 text-left   py-3 text-sm text-gray-600">{recurso.recurso_id?.nombre || '-'}</td>
                        <td className="px-2 text-center py-3 text-sm text-gray-600">
                          {getUnidadNombre(recurso, unidades)}
                        </td>
                        <td className="px-2 text-center py-3 text-sm text-gray-600">{recurso.cantidad}</td>
                        <td className="px-2 text-center py-3">
                          <input
                            type="number"
                            min="0"
                            max={recurso.cantidad}
                            value={selectedRecursos.find(r => r._id === recurso._id)?.cantidadModificada || 0}
                            onChange={(e) => handleCantidadChange(recurso._id, parseInt(e.target.value) || 0)}
                            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
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
