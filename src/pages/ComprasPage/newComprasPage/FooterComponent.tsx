
import React from 'react';

interface FooterProps {
  onClose: () => void;
  onSave: (recursos: RecursoSolicitud[]) => void;
  selectedRecursos: RecursoSolicitud[];
  selectedSolicitud: string | null;
}

const Footer: React.FC<FooterProps> = ({
  onClose,
  onSave,
  selectedRecursos,
  selectedSolicitud,
}) => {
  return (
    <div className="p-3 border-t border-gray-100 flex justify-end space-x-2 bg-white">
      <button
        onClick={onClose}
        className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
      >
        Cancelar
      </button>
      <button
        onClick={() => onSave(selectedRecursos)}
        className="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedSolicitud || selectedRecursos.length === 0}
      >
        Guardar Selección
      </button>
    </div>
  );
};

export default Footer;