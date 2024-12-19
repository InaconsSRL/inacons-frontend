import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchSolicitudAlmacenes } from '../../slices/solicitudAlmacenSlice';
import { getOrdenSolicitudRecursoById } from '../../slices/solicitudRecursoAlmacenSlice';
import { IoMdCloseCircle } from "react-icons/io";
import OrdenTransferencia from './OrdenTransferencia';
import { 
  FormularioSolicitudProps, 
  RecursoSeleccionado, 
  SolicitudAlmacen 
} from './types';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const FormularioSolicitud: React.FC<FormularioSolicitudProps> = ({ onClose, transferenciasId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showOrdenTransferencia, setShowOrdenTransferencia] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudAlmacen | null>(null);
  const [selectedRecursos, setSelectedRecursos] = useState<RecursoSeleccionado[]>([]);
  const [almacenId, setAlmacenId] = useState<string>('');
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState(true);
  const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);

  const solicitudes = useSelector((state: RootState) => state.solicitudAlmacen.solicitudes);
  const obras = useSelector((state: RootState) => state.obra.obras);
  const unidades = useSelector((state: RootState) => state.unidad.unidades);

  useEffect(() => {
    const loadSolicitudes = async () => {
      setIsLoadingSolicitudes(true);
      await dispatch(fetchSolicitudAlmacenes());
      setIsLoadingSolicitudes(false);
    };
    loadSolicitudes();
  }, [dispatch]);

  useEffect(() => {
    const loadRecursos = async () => {
      if (selectedSolicitud) {
        setIsLoadingRecursos(true);
        const recursosData = await dispatch(getOrdenSolicitudRecursoById(selectedSolicitud.id)).unwrap();
        setSelectedRecursos(recursosData);
        setIsLoadingRecursos(false);
      }
    };
    loadRecursos();
  }, [selectedSolicitud, dispatch]);

  const handleCheckboxChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRecursos = [...selectedRecursos];
    updatedRecursos[index].isChecked = e.target.checked;
    setSelectedRecursos(updatedRecursos);
  };

  const handleCantidadChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRecursos = [...selectedRecursos];
    updatedRecursos[index].cantidadSeleccionada = parseInt(e.target.value);
    setSelectedRecursos(updatedRecursos);
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRecursos = selectedRecursos.map(recurso => ({
      ...recurso,
      isChecked: e.target.checked,
      cantidadSeleccionada: e.target.checked ? recurso.cantidad : 0,
    }));
    setSelectedRecursos(updatedRecursos);
  };

  const handleSave = async () => {
    if (!selectedSolicitud) return;

    // En lugar de cerrar directamente, mostramos el formulario de orden de transferencia
    setShowOrdenTransferencia(true);
  };

  const handleCloseOrdenTransferencia = () => {
    setShowOrdenTransferencia(false);
    onClose();
  };
  
  const totalGeneral = React.useMemo(() => {
    return selectedRecursos.reduce((total, recurso) =>
      total + recurso.cantidadSeleccionada * recurso.recurso_id.precio_actual, 0);
  }, [selectedRecursos]);
  
  return (
    <>
      {showOrdenTransferencia && selectedSolicitud ? (
  <OrdenTransferencia 
    onClose={handleCloseOrdenTransferencia}
    transferenciasId={transferenciasId}
    recursos={selectedRecursos.filter(recurso => recurso.isChecked)}
    solicitudData={{
      id: selectedSolicitud.id,
      almacenOrigen: selectedSolicitud.almacen_origen_id,
      almacenDestino: selectedSolicitud.almacen_destino_id,
      usuario: selectedSolicitud.usuario_id
    }}
  />
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[120px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="border-b border-gray-100 bg-white">
            <div className="p-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-800">Solicitudes de Transferencia</h2>
              <button
                onClick={onClose}
                className="text-2xl text-red-500 transition-transform transform hover:scale-110"
              >
                <IoMdCloseCircle />
              </button>
            </div>
            <div className="px-3 pb-3">
              <select
                value={almacenId}
                onChange={(e) => setAlmacenId(e.target.value)}
                className="w-64 px-2 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
              >
                <option value="">Todas las obras</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>{obra.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(80vh-16rem)]">
            {/* Left Panel - Solicitudes */}
            <div className="w-1/4 border-r border-gray-100 p-4 overflow-y-auto bg-gray-100">
              {isLoadingSolicitudes ? (
                [...Array(5)].map((_, index) => (
                  <div key={index} className="p-3 mb-2 rounded-md border border-white">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))
              ) : (
                solicitudes.filter(solicitud => almacenId === '' || solicitud.requerimiento_id.obra_id === almacenId).map((solicitud) => (
                  <div
                    key={solicitud.id}
                    onClick={() => {
                      setSelectedSolicitud(solicitud);
                      setSelectedRecursos([]);
                    }}
                    className={`p-3 mb-2 shadow-xl rounded-md cursor-pointer border transition-all duration-200 hover:bg-blue-50 ${
                      selectedSolicitud?.id === solicitud.id
                        ? 'bg-blue-50 border-blue-400 shadow-sm'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-700">{solicitud.requerimiento_id.codigo}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Solicitante: {solicitud.usuario_id.nombres} {solicitud.usuario_id.apellidos}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Fecha: {new Date(solicitud.fecha).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Panel - Recursos */}
            <div className="flex-1 p-4 w-full flex flex-col h-full">
              {selectedSolicitud ? (
                <>
                  <div className="p-3 bg-white border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700">Recursos de la Solicitud</h3>
                  </div>

                  <div className="flex-1 overflow-auto overflow-x-auto p-3 w-full">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50 sticky -top-3">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                              onChange={handleSelectAllChange}
                            />
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cant. Transferida</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {isLoadingRecursos ? (
                          [...Array(5)].map((_, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-4" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-32" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-16" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-16" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-8 w-20" /></td>
                              <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                            </tr>
                          ))
                        ) : (
                          selectedRecursos.map((recurso, index) => {
                            const subtotal = (recurso.cantidadSeleccionada || 0) * recurso.recurso_id.precio_actual;
                            return (
                              <tr key={recurso.recurso_id.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-3 py-2">
                                  <input
                                    type="checkbox"
                                    checked={recurso.isChecked || false}
                                    onChange={(e) => handleCheckboxChange(index, e)}
                                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                  />
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.codigo}</td>
                                <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.nombre}</td>
                                <td className="px-3 py-2 text-xs text-gray-600">{unidades.find(u => u.id === recurso.recurso_id.unidad_id)?.nombre || 'N/A'}</td>
                                <td className="px-3 py-2 text-xs text-gray-600">{recurso.cantidad}</td>
                                <td className="px-3 py-2 text-xs text-gray-600">S/ {recurso.recurso_id.precio_actual}</td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={recurso.cantidad}
                                    value={recurso.cantidadSeleccionada || 0}
                                    onChange={(e) => handleCantidadChange(index, e)}
                                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                                  />
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">S/ {subtotal.toFixed(2)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex justify-end">
                      <div className="text-sm font-medium text-gray-700 pr-10">
                        Total: <span className="text-blue-600">S/ {(totalGeneral || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-gray-400">
                    <h3 className="mt-2 text-sm font-medium text-gray-600">No hay solicitud seleccionada</h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 flex justify-end space-x-2 bg-white">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedSolicitud || selectedRecursos.length === 0}
            >
              Guardar Solicitud
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormularioSolicitud;