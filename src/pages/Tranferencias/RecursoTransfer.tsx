import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { obtenerUnidadConId } from '../../components/Utils/obtenerUnidadConId';
import { fetchSolicitudAlmacenes } from '../../slices/solicitudAlmacenSlice';
import { addSolicitudRecursoAlmacen, fetchSolicitudesRecursoAlmacen, updateSolicitudRecursoAlmacen } from '../../slices/solicitudRecursoAlmacenSlice';
import { RootState, AppDispatch } from '../../store/store';
import { addTransferenciaRecurso } from '../../slices/transferenciaRecursoSlice';
import { updateTransferencia } from '../../slices/transferenciaSlice';
import noImage from '../../assets/NoImage.webp';
import IMG from '../../components/IMG/IMG';
import { TransportForm } from "./TransporteForm";
import { IoMdCloseCircle } from "react-icons/io";

interface solicitudAlmacen {
  id: string;
  requerimiento_id: {
    id: string;
    presupuesto_id: string | null;
    fecha_solicitud: string;
    estado_atencion: string;
    sustento: string;
    obra_id: string;
    codigo: string;
  };
  usuario_id: {
    apellidos: string;
    nombres: string;
    id: string;
  };
  fecha: string;
}

interface SolicitudRecursoAlmacen {
    id: string;
    cantidad: number;
    costo: number;
    soliciud_almacen_id:{
      id: string;
    }
    cantidadSeleccionada?: number;
    recurso_id: {
        recurso: string;
        id: string;
        cantidad: number;
        nombre: string;
        codigo: string;
        precio_actual: number;
        imagenes: { file: string }[];
        unidad_id: string;
        vigente: boolean;
    };
}
interface ModalProps {
  onClose: () => void;
  transferenciaId: string | null;
}

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const RecursoTransfer: React.FC<ModalProps> = ({ onClose, transferenciaId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSolicitud, setSelectedSolicitud] = React.useState<string | null>(null);
  const [selectedRecursos, setSelectedRecursos] = React.useState<SolicitudRecursoAlmacen[]>([]);
  const [selectedObra, setSelectedObra] = React.useState<string>('');
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = React.useState(true);
  const [isLoadingRecursos, setIsLoadingRecursos] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //const currentUserId = useSelector((state: RootState) => state.user.id);
  const solicitudes = useSelector((state: RootState) => state.solicitudAlmacen.solicitudes);
  const recursos = useSelector((state: RootState) => state.solicitudRecursoAlmacen.solicitudesRecurso);
  const { obras } = useSelector((state: RootState) => state.obra);

  const filteredSolicitudes = React.useMemo(() => {
    if (!selectedObra) return solicitudes;
    return solicitudes.filter((solicitud: solicitudAlmacen) =>
        solicitud.requerimiento_id.obra_id === selectedObra
    );
  }, [solicitudes, selectedObra]);

  useEffect(() => {
    const loadSolicitudes = async () => {
      setIsLoadingSolicitudes(true);
      await dispatch(fetchSolicitudAlmacenes());
      setIsLoadingSolicitudes(false);
    };
    loadSolicitudes();
  }, [dispatch]);

  useEffect(() => {
const fetchRecursos = async () => {
        if (selectedSolicitud) {
            setIsLoadingRecursos(true); 
            try {
                await dispatch(fetchSolicitudesRecursoAlmacen()).unwrap();
            } catch (err) {
                console.error('Error al obtener los recursos de transferencia', err);
            } finally {
                setIsLoadingRecursos(false); 
            }
        }
    };
    fetchRecursos();
}, [selectedSolicitud, dispatch]);

  useEffect(() => {
    setSelectedRecursos([]);
  }, [selectedSolicitud]);

  
  useEffect(() => {
    setSelectedSolicitud(null);
  }, [selectedObra]);

  const handleCheckboxChange = React.useCallback((recurso: SolicitudRecursoAlmacen, checked: boolean) => {
    setSelectedRecursos(prev => checked
      ? [...prev, { ...recurso, cantidadSeleccionada: recurso.cantidad }]
      : prev.filter(r => r.id !== recurso.id)
    );
  }, []);

  const handleCantidadChange = (recursoId: string, valor: number) => {
    setSelectedRecursos(selectedRecursos.map(recurso =>
      recurso.id === recursoId
        ? { ...recurso, cantidadSeleccionada: valor }
        : recurso
    ));
  };


  const totalGeneral = React.useMemo(() => {
    return selectedRecursos.reduce((total, recurso) =>
      total + (recurso.recurso_id.precio_actual* (recurso.cantidadSeleccionada || 0))
      , 0);
  }, [selectedRecursos]);

  const handleSaveSelection = async () => {
    try {
      if (!transferenciaId) {
        console.error('No hay transferencias disponible');
        return;
      }

      
      for (const recurso of selectedRecursos) {
          if (selectedSolicitud) {
          const solicitudRecursoAlmacenData = {
              recurso_id: recurso.recurso_id.id,
              cantidad: recurso.cantidadSeleccionada || 0,
              solicitud_almacen_id: selectedSolicitud
            };

            await dispatch(addSolicitudRecursoAlmacen(solicitudRecursoAlmacenData)).unwrap();
          }
      }

      if (transferenciaId && selectedSolicitud) {
        await dispatch(updateSolicitudRecursoAlmacen({
          updateSolicitudRecursoAlmacenId: transferenciaId,
          recursoId: selectedRecursos[0].recurso_id.id,
          cantidad: selectedRecursos[0].cantidadSeleccionada || 0,
          solicitudAlmacenId: selectedSolicitud
        })).unwrap();
      }
 
      onClose();
    } catch (error) {
      console.error('Error al guardar los recursos:', error);
    }
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[120px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 className="text-xl font-semibold text-blue-800">Solicitudes de transferencias</h2>
        <div className="w-56 relative">
  <button
    onClick={onClose}
    className="absolute top-0 right-0 text-2xl text-red-500 mt-2 mr-2"
  >
    <IoMdCloseCircle />
  </button>
  <div className="pt-9">
    <select
      value={selectedObra}
      onChange={(e) => {
        setSelectedObra(e.target.value);
      }}
      className="w-full px-2 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
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
      </div>

      <div className="flex h-[calc(90vh-12rem)]">
        {/*  Lista de Solicitudes */}
        <div className="w-1/4 border-r border-gray-100 p-3 overflow-y-auto  bg-gray-100">
          {isLoadingSolicitudes ? (
            // Skeleton para solicitudes
            [...Array(5)].map((_, index) => (
              <div key={index} className="p-3 mb-2 rounded-md border border-white">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-1" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))
          ) : (
            filteredSolicitudes.map((solicitud: solicitudAlmacen) => (
              <div
                key={solicitud.id}
                onClick={() => setSelectedSolicitud(solicitud.id)}
                className={`p-3 mb-2  shadow-xl rounded-md cursor-pointer border transition-all duration-200 ${selectedSolicitud === solicitud.id
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'border-gray-100  bg-gray-50 hover:bg-white hover:shadow-sm'
                  }`}
              >
                <div className="text-sm font-medium text-gray-700">{solicitud.requerimiento_id.codigo}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Solicitante: {solicitud.usuario_id.nombres} {solicitud.usuario_id.apellidos}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Fecha: {new Date(solicitud.fecha).toLocaleDateString()}
                </div>
                <div className="text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded-full ${solicitud.requerimiento_id.estado_atencion === 'Pendiente'
                      ? 'bg-yellow-100 text-yellow-700'
                      : solicitud.requerimiento_id.estado_atencion === 'Enviado'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                    {solicitud.requerimiento_id.estado_atencion}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recursos de la solicitud */}
        <div className="flex-1 p-4 w-full flex flex-col h-full">
          {selectedSolicitud ? (
            <>
              <div className="p-3 bg-white border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Recursos de la Solicitud</h3>
              </div>

              <div className="flex-1 overflow-auto overflow-x-auto p-3 w-full">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50 sticky -top-3">
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecursos(recursos.filter(r => r?.recurso_id).map(r => ({ ...r, cantidadSeleccionada: r.cantidad })));
                            } else {
                              setSelectedRecursos([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-2 border">Imagen</th>
                      <th className="p-2 border">Codigo</th>
                      <th className="p-2 border">Nombre</th>
                      <th className="p-2 border">Unidad</th>
                      <th className="p-2 border">Cantidad</th>
                      <th className="p-2 border">vigencia</th>
                      <th className="p-2 border">Precio</th>
                      <th className="p-2 border">Cant.Transferida</th>
                      <th className="p-2 border">Subtotal</th>
                      <th className="P-2 border">Bodega</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {isLoadingRecursos ? (
                      // Skeleton para recursos
                      [...Array(5)].map((_, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2"><Skeleton className="h-4 w-4" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-12 w-12 rounded-md" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-4 w-32" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-4 w-16" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-8 w-20" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-4 w-16" /></td>
                          <td className="px-3 py-2"><Skeleton className="h-4 w-16" /></td>
                        </tr>
                      ))
                    ) : (
                      recursos.map((recurso: SolicitudRecursoAlmacen) => {
                        if (!recurso?.recurso_id) return null;
                        
                        const isSelected = selectedRecursos.some(r => r.id === recurso.id);
                        const selectedRecurso = selectedRecursos.find(r => r.id === recurso.id);
                        const subtotal = (selectedRecurso?.cantidadSeleccionada || 0) * recurso.recurso_id.precio_actual;

                        return (
                          <tr key={recurso.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                checked={isSelected}
                                onChange={(e) => handleCheckboxChange(recurso, e.target.checked)}
                              />
                            </td>
                            <td className="px-3 py-2">
                              {recurso.recurso_id.imagenes && recurso.recurso_id.imagenes.length > 0 ? (
                                <IMG
                                  src={recurso.recurso_id.imagenes[0].file}
                                  alt={recurso.recurso_id.nombre}
                                  className="h-12 w-12 object-cover rounded-md border border-gray-200"
                                />
                              ) : (
                                <IMG
                                  src={noImage}
                                  alt="No image available"
                                  className="h-12 w-12 object-cover rounded-md border border-gray-200"
                                />
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.codigo}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.nombre}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.unidad_id}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{recurso.cantidad}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.vigente} </td>
                            <td className="px-3 py-2 text-xs text-gray-600">S/ {recurso.recurso_id.precio_actual}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min="1"
                                max={recurso.cantidad}
                                value={selectedRecurso?.cantidadSeleccionada || 0}
                                onChange={(e) => handleCantidadChange(recurso.id, parseInt(e.target.value))}
                                disabled={!isSelected}
                                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                              />
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">S/ {subtotal.toFixed(2)}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.unidad_id}</td>
                            {/*<td className="px-3 py-2 text-xs text-gray-600">S/ {(recurso.recurso_id.precio_actual || 0).toFixed(2)}</td>*/}
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

      <div className="p-5 border-t border-gray-100 flex justify-end space-x-2 bg-white">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveSelection}
          className="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedSolicitud || selectedRecursos.length === 0}
        >
          Guardar Selección
        </button>

        {/* boton de tipo de transporte */}
        <button
             onClick={handleOpenModal}
             className="px-3 py-1.5 text-sm text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed "
              disabled ={!selectedSolicitud || selectedRecursos.length === 0}
            >  
            Tipo de transporte
        </button>
      </div>
      {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black opacity-50" onClick={handleCloseModal}></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 rounded" >
                        <TransportForm onSubmit={handleCloseModal} onClose={handleCloseModal} />
                    </div>
                </>
            )}
    </div>
  );
};

export default RecursoTransfer;