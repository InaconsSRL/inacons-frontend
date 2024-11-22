
import React from 'react';

interface RightPanelProps {
  selectedSolicitud: string | null;
  recursos: RecursoSolicitud[];
  selectedRecursos: RecursoSolicitud[];
  setSelectedRecursos: (recursos: RecursoSolicitud[]) => void;
  totalGeneral: number;
  // ...otras props necesarias...
}

const RightPanel: React.FC<RightPanelProps> = ({
  selectedSolicitud,
  recursos,
  selectedRecursos,
  setSelectedRecursos,
  totalGeneral,
}) => {
  // ...funciones handleCheckboxChange y handleCantidadChange...

  return (
    <div className="flex-1 flex flex-col h-full">
      {selectedSolicitud ? (
        <>
          {/* Encabezado */}
          <div className="p-3 bg-white border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Recursos de la Solicitud</h3>
          </div>

          {/* Tabla de recursos */}
          <div className="flex-1 overflow-auto overflow-x-auto p-3">
            {/* ...tabla existente... */}
          </div>

          {/* Total */}
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
          {/* Mensaje cuando no hay solicitud seleccionada */}
          {/* ...contenido existente... */}
        </div>
      )}
    </div>
  );
};

export default RightPanel;