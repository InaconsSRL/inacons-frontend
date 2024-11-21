import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSolicitudesCompras } from '../../../slices/solicitudCompraSlice';
import { fetchBySolicitudId } from '../../../slices/solicitudCompraRecursoSlice';
import { RootState, AppDispatch } from '../../../store/store';

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
  costo: number;
  recurso_id: {
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

  const solicitudes = useSelector((state: RootState) => state.solicitudCompra.solicitudes);
  const recursos = useSelector((state: RootState) => state.solicitudCompraRecurso.solicitudCompraRecursos);

  useEffect(() => {
    dispatch(fetchSolicitudesCompras());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSolicitud) {
      dispatch(fetchBySolicitudId(selectedSolicitud));
    }
  }, [selectedSolicitud, dispatch]);

  return (
    <div className="bg-white rounded-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Compra</h2>
      </div>

      <div className="flex h-[calc(90vh-12rem)]">
        {/* Panel izquierdo - Lista de Solicitudes */}
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
          {solicitudes.map((solicitud: SolicitudCompra) => (
            <div
              key={solicitud.id}
              onClick={() => setSelectedSolicitud(solicitud.id)}
              className={`p-4 mb-3 rounded-lg cursor-pointer border ${
                selectedSolicitud === solicitud.id
                  ? 'bg-blue-50 border-blue-500'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{solicitud.requerimiento_id.codigo}</div>
              <div className="text-sm text-gray-600">
                Solicitante: {solicitud.usuario_id.nombres} {solicitud.usuario_id.apellidos}
              </div>
              <div className="text-sm text-gray-500">
                Fecha: {new Date(solicitud.fecha).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                Estado: {solicitud.requerimiento_id.estado_atencion}
              </div>
            </div>
          ))}
        </div>

        {/* Panel derecho - Recursos de la solicitud */}
        <div className="w-2/3 p-4 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecursos(recursos);
                      } else {
                        setSelectedRecursos([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recursos.map((recurso: RecursoSolicitud) => (
                <tr key={recurso.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRecursos.some(r => r.id === recurso.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecursos([...selectedRecursos, recurso]);
                        } else {
                          setSelectedRecursos(selectedRecursos.filter(r => r.id !== recurso.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">{recurso.recurso_id.codigo}</td>
                  <td className="px-4 py-3 text-sm">{recurso.recurso_id.nombre}</td>
                  <td className="px-4 py-3 text-sm">{recurso.cantidad}</td>
                  <td className="px-4 py-3 text-sm">S/ {recurso.costo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onSave(selectedRecursos);
            onClose();
          }}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          disabled={selectedRecursos.length === 0}
        >
          Guardar Selección
        </button>
      </div>
    </div>
  );
};

export default AddRecursoRequerimientoCompra;