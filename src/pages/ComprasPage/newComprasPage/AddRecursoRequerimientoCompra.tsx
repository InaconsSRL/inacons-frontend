import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSolicitudesCompras } from '../../../slices/solicitudCompraSlice';
import { fetchBySolicitudId } from '../../../slices/solicitudCompraRecursoSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { addCotizacion } from '../../../slices/cotizacionSlice';
import { addCotizacionRecurso } from '../../../slices/cotizacionRecursoSlice';

interface SolicitudCompra {
  id: string;
  requerimiento_id: {
    id: string;
    presupuesto_id: string | null;
    fecha_solicitud: string;
    fecha_final: string;
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

interface RecursoSolicitud {
  id: string;
  solicitud_compra_id: string;
  cantidad: number;
  cantidadSeleccionada?: number; // Añadimos esta propiedad
  costo: number;
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio_actual: number;
    vigente: boolean;
    imagenes: { file: string }[];
  };
}

interface ModalProps {
  onClose: () => void;
  onSave: (recursos: RecursoSolicitud[]) => void;
}

const AddRecursoRequerimientoCompra: React.FC<ModalProps> = ({ onClose, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSolicitud, setSelectedSolicitud] = React.useState<string | null>(null);
  const [selectedRecursos, setSelectedRecursos] = React.useState<RecursoSolicitud[]>([]);
  const [selectedObra, setSelectedObra] = React.useState<string>('');

  const currentUserId = useSelector((state: RootState) => state.user.id);
  const solicitudes = useSelector((state: RootState) => state.solicitudCompra.solicitudes);
  const recursos = useSelector((state: RootState) => state.solicitudCompraRecurso.solicitudCompraRecursos);
  const {obras} = useSelector((state: RootState) => state.obra);

  const filteredSolicitudes = React.useMemo(() => {
    if (!selectedObra) return solicitudes;
    return solicitudes.filter((solicitud: SolicitudCompra) => 
      solicitud.requerimiento_id.obra_id === selectedObra
    );
  }, [solicitudes, selectedObra]);

  console.log(selectedRecursos)
  useEffect(() => {
    if (recursos.length === 0) {
    dispatch(fetchSolicitudesCompras());
    }
  }, [dispatch, recursos.length]);

  useEffect(() => {
    if (selectedSolicitud) {
      dispatch(fetchBySolicitudId(selectedSolicitud));
    }
  }, [selectedSolicitud, dispatch]);

  // Limpiar recursos seleccionados cuando se cambia de solicitud
  useEffect(() => {
    setSelectedRecursos([]);
  }, [selectedSolicitud]);

  // Efecto para limpiar la selección cuando cambia la obra
  useEffect(() => {
    setSelectedSolicitud(null);
  }, [selectedObra]);

  const handleCheckboxChange = React.useCallback((recurso: RecursoSolicitud, checked: boolean) => {
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

  // Calcular el total general
  const totalGeneral = React.useMemo(() => {
    return selectedRecursos.reduce((total, recurso) => 
      total + (recurso.costo * (recurso.cantidadSeleccionada || 0))
    , 0);
  }, [selectedRecursos]);

  const handleSaveSelection = async () => {
    try {
      // Primero creamos la cotización
      const cotizacionData = {
        codigo_cotizacion: `COT-${Date.now()}`, // Generar código único
        proveedor_id: '', // Completar con el ID del proveedor seleccionado
        usuario_id: currentUserId || '',
        solicitud_compra_id: selectedSolicitud || '',
        aprobacion: false
      };

      const nuevaCotizacion = await dispatch(addCotizacion(cotizacionData)).unwrap();

      // Luego agregamos cada recurso seleccionado a la cotización
      for (const recurso of selectedRecursos) {
        const cotizacionRecursoData = {
          cantidad: recurso.cantidadSeleccionada || 0,
          atencion: 'pendiente',
          costo: recurso.costo,
          total: (recurso.cantidadSeleccionada || 0) * recurso.costo,
          cotizacion_id: nuevaCotizacion.id,
          recurso_id: recurso.recurso_id.id
        };

        await dispatch(addCotizacionRecurso(cotizacionRecursoData)).unwrap();
      }

      // Llamar al onSave original para cualquier lógica adicional
      onSave(selectedRecursos);
      onClose();

    } catch (error) {
      console.error('Error al guardar la cotización:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-gray-100">
    {/* Header */}
    <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
      <h2 className="text-lg font-semibold text-gray-700">Solicitudes de Compra</h2>
      <div className="w-56">
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

    <div className="flex h-[calc(90vh-12rem)]">
      {/* Panel izquierdo - Lista de Solicitudes */}
      <div className="w-1/4 border-r border-gray-100 p-3 overflow-y-auto  bg-gray-50">
        {filteredSolicitudes.map((solicitud: SolicitudCompra) => (
          <div
            key={solicitud.id}
            onClick={() => setSelectedSolicitud(solicitud.id)}
            className={`p-3 mb-2 rounded-md cursor-pointer border transition-all duration-200 ${
              selectedSolicitud === solicitud.id
                ? 'bg-blue-50 border-blue-400 shadow-sm'
                : 'border-gray-100 hover:bg-white hover:shadow-sm'
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
              <span className={`px-2 py-0.5 rounded-full ${
                solicitud.requerimiento_id.estado_atencion === 'Pendiente' 
                  ? 'bg-yellow-100 text-yellow-700'
                  : solicitud.requerimiento_id.estado_atencion === 'Completado'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {solicitud.requerimiento_id.estado_atencion}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Panel derecho - Recursos de la solicitud */}
      <div className="flex-1 flex flex-col h-full">
        {selectedSolicitud ? (
          <>
            <div className="p-3 bg-white border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Recursos de la Solicitud</h3>
            </div>
            
            <div className="flex-1 overflow-auto overflow-x-auto p-3">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky -top-3">
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecursos(recursos.map(r => ({ ...r, cantidadSeleccionada: r.cantidad })));
                          } else {
                            setSelectedRecursos([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad a Cotizar</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recursos.map((recurso: RecursoSolicitud) => {
                    const isSelected = selectedRecursos.some(r => r.id === recurso.id);
                    const selectedRecurso = selectedRecursos.find(r => r.id === recurso.id);
                    const subtotal = (selectedRecurso?.cantidadSeleccionada || 0) * recurso.costo;
                    
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
                        <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.codigo}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{recurso.recurso_id.nombre}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{recurso.cantidad}</td>
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
                        <td className="px-3 py-2 text-xs text-gray-600">S/ {recurso.costo.toFixed(2)}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          S/ {subtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex justify-end">
                <div className="text-sm font-medium text-gray-700 pr-10">
                  Total: <span className="text-blue-600">S/ {totalGeneral.toFixed(2)}</span>
                </div>
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
              <h3 className="mt-2 text-sm font-medium text-gray-600">No hay solicitud seleccionada</h3>
              <p className="mt-1 text-xs text-gray-400">
                Selecciona una solicitud del panel izquierdo para ver sus recursos
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="p-3 border-t border-gray-100 flex justify-end space-x-2 bg-white">
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
    </div>
  </div>
  );
};

export default AddRecursoRequerimientoCompra;