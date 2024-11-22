
import React from 'react';

interface LeftPanelProps {
  solicitudes: SolicitudCompra[];
  selectedSolicitud: string | null;
  setSelectedSolicitud: (solicitudId: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  solicitudes,
  selectedSolicitud,
  setSelectedSolicitud,
}) => {
  return (
    <div className="w-1/4 border-r border-gray-100 p-3 overflow-y-auto bg-gray-50">
      {solicitudes.map((solicitud) => (
        <div
          key={solicitud.id}
          onClick={() => setSelectedSolicitud(solicitud.id)}
          className={`p-3 mb-2 rounded-md cursor-pointer border transition-all duration-200 ${
            selectedSolicitud === solicitud.id
              ? 'bg-blue-50 border-blue-400 shadow-sm'
              : 'border-gray-100 hover:bg-white hover:shadow-sm'
          }`}
        >
          <div className="text-sm font-medium text-gray-700">
            {solicitud.requerimiento_id.codigo}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Solicitante: {solicitud.usuario_id.nombres} {solicitud.usuario_id.apellidos}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Fecha: {new Date(solicitud.fecha).toLocaleDateString()}
          </div>
          <div className="text-xs mt-1">
            <span
              className={`px-2 py-0.5 rounded-full ${
                solicitud.requerimiento_id.estado_atencion === 'Pendiente'
                  ? 'bg-yellow-100 text-yellow-700'
                  : solicitud.requerimiento_id.estado_atencion === 'Completado'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {solicitud.requerimiento_id.estado_atencion}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeftPanel;