import React from 'react';

interface TransferFilterProps {
  tipoFiltro: 'TODOS' | 'COMPRAS' | 'RECEPCIONES' | 'PRESTAMOS' | 'SALIDA';
  onChange: (tipo: 'TODOS' | 'COMPRAS' | 'RECEPCIONES' | 'PRESTAMOS' | 'SALIDA') => void;
}

export const TransferFilter: React.FC<TransferFilterProps> = ({ tipoFiltro, onChange }) => {
  return (
    <div className="mb-4 flex justify-end">
      <select 
        value={tipoFiltro}
        onChange={(e) => onChange(e.target.value as 'TODOS' | 'COMPRAS' | 'RECEPCIONES' | 'PRESTAMOS' | 'SALIDA')}
        className="p-2 border rounded text-sm"
      >
        <option value="TODOS">Todos los movimientos</option>
        <option value="COMPRAS">Compras</option>
        <option value="RECEPCIONES">Recepciones</option>
        <option value="PRESTAMOS">Préstamos</option>
        <option value="SALIDA">Transferencias</option>
      </select>
    </div>
  );
};
