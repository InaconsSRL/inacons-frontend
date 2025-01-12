import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchPrestamos, PrestamoOutput } from '../../../slices/prestamoSlice';
import { fetchPrestamoRecursosByPrestamoId } from '../../../slices/prestamoRecursoSlice';
import { PrestamoRecursoResponse } from '../../../types/prestamoRecurso';
import { FiSearch } from 'react-icons/fi';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
import { updatePrestamo } from '../../../slices/prestamoSlice';
import { updatePrestamoRecurso } from '../../../slices/prestamoRecursoSlice';
import { addObraBodegaRecurso, updateObraBodegaRecurso } from '../../../slices/obraBodegaRecursoSlice';
import { formatFullTime } from '../../../components/Utils/dateUtils';
import { consultaRecursosPorBodegaByObraIdAndRecursoIdService } from '../../../services/consultaRecursosPorBodegaByObraIdAndRecursoIdService';


interface SelectedRecursoDevolucion {
  recurso: PrestamoRecursoResponse;
  cantidadDevolver: number;
  bodegaSeleccionada?: {
    obra_bodega_id: string;
    obra_bodega_recursos_id: string;
    cantidad: number;
    existencia: string;
  };
}

interface BodegaInfo {
  obra_bodega_id: string;
  nombre: string;
  cantidad: number;
  costo: number;
  obra_bodega_recursos_id: string;
  existencia: string;
 }

type PrestamoDetails = PrestamoOutput;

const DevolucionPrestamos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedObra, setSelectedObra] = useState<string>('');
  const [selectedPrestamo, setSelectedPrestamo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedRecursos, setSelectedRecursos] = useState<Record<string, SelectedRecursoDevolucion>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = useSelector((state: RootState) => state.user?.id);
  const [bodegasInfo, setBodegasInfo] = useState<{
    [key: string]: BodegaInfo[];
  }>({});

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
    prestamo.estado !== "COMPLETADO").filter((prestamo: PrestamoDetails) => 
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

  const getPrestamosCountPorObra = (obraId: string) => {
    return prestamos.filter(prestamo => 
      prestamo.obra_id?.id === obraId && 
      prestamo.estado !== "COMPLETADO"
    ).length;
  };

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  const obtenerBodegasParaRecurso = async (obraId: string, recursoId: string) => {
    try {
      const bodegas = await consultaRecursosPorBodegaByObraIdAndRecursoIdService({
        obraId,
        recursoId
      });
      return bodegas;
    } catch (error) {
      console.error('Error al obtener bodegas:', error);
      return [];
    }
  };

  const procesarDevolucion = async () => {
    try {
      setIsProcessing(true);
      if (!userId) throw new Error('Usuario no autenticado');
      if (!selectedPrestamo) throw new Error('No hay préstamo seleccionado');

      const prestamo = prestamos.find(p => p.id === selectedPrestamo);
      if (!prestamo) throw new Error('Préstamo no encontrado');

      // Crear la transferencia
      const transferenciaData = {
        usuario_id: userId,
        fecha: new Date(),
        // TODO: Reemplazar con IDs correctos
        movimiento_id: "67703b70bc1f0aa828f1812b",
        movilidad_id: "67703af9bc1f0aa828f1811a",
        estado: 'COMPLETO' as const,
        descripcion: `Devolución de préstamo - ${prestamo.personal_id?.nombres}`
      };

      const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

      // Crear el detalle de transferencia
      const detalleData = {
        transferencia_id: transferencia.id,
        referencia_id: prestamo.id,
        fecha: new Date(),
        tipo: 'DEVOLUCION_PRESTAMO',
        referencia: `Devolución de préstamo - ${prestamo.personal_id?.nombres}`
      };

      const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

      // Procesar cada recurso seleccionado
      for (const { recurso, cantidadDevolver, bodegaSeleccionada } of Object.values(selectedRecursos)) {
        if (!bodegaSeleccionada) {
          throw new Error('Debe seleccionar una bodega destino para cada recurso');
        }

        // Crear transferencia recurso
        await dispatch(addTransferenciaRecurso({
          transferencia_detalle_id: detalleTransferencia.id,
          recurso_id: recurso.obrabodega_recurso_id.recurso_id.id,
          cantidad: cantidadDevolver,
          costo: 0,
        })).unwrap();

        // Actualizar cantidad en préstamo
        const nuevaCantidadPrestamo = recurso.cantidad - cantidadDevolver;
        await dispatch(updatePrestamoRecurso({
          id: recurso.id,
          prestamoId: selectedPrestamo,
          obrabodegaRecursoId: recurso.obrabodega_recurso_id.id,
          cantidad: nuevaCantidadPrestamo
        })).unwrap();

        // Actualizar cantidad en bodega
        if (bodegaSeleccionada.existencia === 'si') {
          await dispatch(updateObraBodegaRecurso({
            updateObraBodegaRecursoId: bodegaSeleccionada.obra_bodega_recursos_id,
            cantidad: bodegaSeleccionada.cantidad + cantidadDevolver,
          })).unwrap();
        } else {
          await dispatch(addObraBodegaRecurso({
            obraBodegaId: bodegaSeleccionada.obra_bodega_id,
            recursoId: recurso.obrabodega_recurso_id.recurso_id.id,
            cantidad: cantidadDevolver,
            costo: 0,
            estado: 'Nuevo',
          })).unwrap();
        }
      }

      // Verificar si la devolución es completa o parcial
      const esDevolucionCompleta = Object.values(selectedRecursos).every(
        ({ recurso, cantidadDevolver }) => cantidadDevolver === recurso.cantidad
      );

      // Actualizar estado del préstamo
      await dispatch(updatePrestamo({
        id: selectedPrestamo,
        estado: esDevolucionCompleta ? 'COMPLETADO' : 'PARCIAL'
      })).unwrap();

      // Después de completar todas las operaciones, actualizar los datos de bodegas
      for (const { recurso } of Object.values(selectedRecursos)) {
        const bodegas = await obtenerBodegasParaRecurso(
          prestamo.obra_id.id,
          recurso.obrabodega_recurso_id.recurso_id.id
        );
        setBodegasInfo(prev => ({
          ...prev,
          [recurso.obrabodega_recurso_id.recurso_id.id]: bodegas
        }));
      }

      // Limpiar selección y actualizar datos
      setSelectedRecursos({});
      dispatch(fetchPrestamos());
      dispatch(fetchPrestamoRecursosByPrestamoId(selectedPrestamo));

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la devolución');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSeleccionarRecurso = async (
    recurso: PrestamoRecursoResponse,
    cantidadDevolver: number,
    bodegaId?: string
  ) => {
    if (cantidadDevolver <= 0 || cantidadDevolver > recurso.cantidad) return;

    const prestamo = prestamos.find(p => p.id === selectedPrestamo);
    if (!prestamo) return;

    try {
      // Obtener bodegas si no están cargadas
      if (!bodegasInfo[recurso.obrabodega_recurso_id.recurso_id.id]) {
        const bodegas = await obtenerBodegasParaRecurso(
          prestamo.obra_id.id,
          recurso.obrabodega_recurso_id.recurso_id.id
        );
        setBodegasInfo(prev => ({
          ...prev,
          [recurso.obrabodega_recurso_id.recurso_id.id]: bodegas
        }));
      }

      // Actualizar selección
      setSelectedRecursos(prev => ({
        ...prev,
        [recurso.id]: {
          recurso,
          cantidadDevolver,
          bodegaSeleccionada: bodegaId
            ? bodegasInfo[recurso.obrabodega_recurso_id.recurso_id.id].find(
                b => b.obra_bodega_id === bodegaId
              )
            : undefined
        }
      }));
    } catch (error) {
      console.error('Error al procesar la selección:', error);
    }
  };

  // Añadir componente Loader
  const Loader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="text-gray-700">Procesando devolución...</span>
      </div>
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-gray-100">
      {isProcessing && <Loader />}
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="w-56">
          <select
            value={selectedObra}
            onChange={(e) => setSelectedObra(e.target.value)}
            className="w-full px-2 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
          >
            <option value="">Todas las obras ({prestamos.filter(p => p.estado !== "COMPLETADO").length})</option>
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>
                {obra.nombre} ({getPrestamosCountPorObra(obra.id)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex h-[calc(90vh-12rem)]">
        {/* Panel izquierdo - Lista de Préstamos */}
        <div className="w-1/4 border-r border-gray-100 p-3 overflow-y-auto bg-gray-100">
          {prestamosLoading ? (
            [...Array(5)].map((_, index) => (
              <div key={index} className="p-3 mb-2 rounded-md border border-white">
                <div className="animate-pulse">
                  <div className="h-4 w-3/4 mb-2 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/2 mb-1 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            filteredPrestamos.map((prestamo: PrestamoDetails) => (
              prestamo && prestamo.personal_id && (
                <div
                  key={prestamo.id}
                  onClick={() => handlePrestamoClick(prestamo.id)}
                  className={`p-3 mb-2 shadow-xl rounded-md cursor-pointer border transition-all duration-200 ${
                    selectedPrestamo === prestamo.id
                      ? 'bg-blue-50 border-blue-400 shadow-sm'
                      : 'border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm'
                  }`}
                >
                    <div className="text-sm font-medium text-gray-700">
                    <span className='inline-block min-w-[80px] text-slate-400'>
                    Prestatario:
                    </span>
                    {prestamo.personal_id.nombres}
                    </div>
                  <div className="text-sm font-medium text-gray-700">
                  <span className='inline-block min-w-[80px] text-slate-400'>
                    Obra:
                    </span> {prestamo.obra_id?.nombre}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Fecha: { formatFullTime(prestamo.fecha.toString()) }
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Retorno: { formatFullTime(prestamo.f_retorno.toString()) }
                  </div>
                  <div className="text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full ${
                      prestamo.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {prestamo.estado === 'ACTIVO' ? 'Pendiente' : 'Devolución Parcial'}
                    </span>
                  </div>
                </div>
              )
            ))
          )}
        </div>

        {/* Panel derecho - Recursos del Préstamo */}
        <div className="flex-1 flex flex-col h-full">
          {selectedPrestamo ? (
            <>
              <div className="p-3 bg-white border-b border-gray-100 flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-700">Recursos del Préstamo</h3>
                </div>
                <div className="w-64 relative">
                  <input
                    type="text"
                    placeholder="Buscar por código o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
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
                                <div className="flex flex-col space-y-2">
                                <input
                                  type="number"
                                  min="1"
                                  max={recurso.cantidad}
                                  className="min-w-20 w-full px-2 py-1 border rounded"
                                  onChange={(e) => handleSeleccionarRecurso(recurso, parseInt(e.target.value))}
                                />
                                {selectedRecursos[recurso.id] && bodegasInfo[recurso.obrabodega_recurso_id.recurso_id.id] && (
                                  <div className="relative">
                                  <select
                                    className="appearance-none w-full px-4 py-2 text-sm bg-white border border-blue-100
                                    rounded-lg shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2
                                    focus:ring-blue-200 focus:outline-none transition-all duration-200
                                    text-gray-700 cursor-pointer"
                                    onChange={(e) => handleSeleccionarRecurso(
                                    recurso,
                                    selectedRecursos[recurso.id].cantidadDevolver,
                                    e.target.value
                                    )}
                                    value={selectedRecursos[recurso.id].bodegaSeleccionada?.obra_bodega_id || ''}
                                  >
                                    <option value="" className="text-gray-500">Seleccionar bodega</option>
                                    {bodegasInfo[recurso.obrabodega_recurso_id.recurso_id.id].map(bodega => (
                                    <option 
                                      key={bodega.obra_bodega_id} 
                                      value={bodega.obra_bodega_id}
                                      className="text-gray-700 py-2"
                                    >
                                      {bodega.nombre} ({bodega.cantidad})
                                    </option>
                                    ))}
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                  </div>
                                  </div>
                                )}
                                </div>
                            </td>
                          </tr>
                        )
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex justify-end">
                  <button 
                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                    onClick={procesarDevolucion}
                    disabled={isProcessing || Object.keys(selectedRecursos).length === 0}
                  >
                    {isProcessing ? 'Procesando...' : 'Procesar Devolución'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-gray-400">
                <svg
                  className="mx-auto h-10 w-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-600">No hay préstamo seleccionado</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Selecciona un préstamo del panel izquierdo para ver sus recursos
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevolucionPrestamos;