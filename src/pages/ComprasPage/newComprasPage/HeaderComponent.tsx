
import React from 'react';

interface HeaderProps {
  selectedObra: string;
  setSelectedObra: (obraId: string) => void;
  obras: Obra[]; // Asegúrate de tener definido el tipo 'Obra'
}

const Header: React.FC<HeaderProps> = ({ selectedObra, setSelectedObra, obras }) => {
  return (
    <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
      <h2 className="text-lg font-semibold text-gray-700">Solicitudes de Compra</h2>
      <div className="w-56">
        <select
          value={selectedObra}
          onChange={(e) => setSelectedObra(e.target.value)}
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
  );
};

export default Header;