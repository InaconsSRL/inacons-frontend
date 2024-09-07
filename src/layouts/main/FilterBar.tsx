import React, { useState } from 'react';

type FilterOption = string | { value: string; label: string };

interface FilterBarProps {
  filters?: {
    solicita: FilterOption[];
    numero: FilterOption[];
    desde: string;
    hasta: string;
    estado: FilterOption[];
    estadoAprob: FilterOption[];
    obra: FilterOption[];
    descripcion: FilterOption[];
  };
}

const defaultFilters: Required<FilterBarProps>['filters'] = {
  solicita: ['Juan Pérez', 'María González', 'Carlos Rodríguez'],
  numero: ['001', '002', '003', '004', '005'],
  desde: '1991-10-12',
  hasta: '2024-09-06',
  estado: [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' }
  ],
  estadoAprob: [
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'pendiente', label: 'Pendiente de Aprobación' }
  ],
  obra: ['INA-CAS', 'PRO-001', 'PRO-002'],
  descripcion: ['Proyecto A', 'Proyecto B', 'Proyecto C']
};

const FilterBar: React.FC<FilterBarProps> = ({ filters = defaultFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    desde: filters.desde,
    hasta: filters.hasta
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const renderFilterInput = (name: keyof typeof filters, options: FilterOption[]) => {
    if (name === 'desde' || name === 'hasta') {
      return (
        <div className="flex items-center w-full">
          <input
            type="date"
            value={selectedFilters[name]} // Usar el estado para manejar las fechas seleccionadas
            name={name}
            onChange={(e) => handleFilterChange(name, e.target.value)}
            className="text-xs/3 border rounded w-full  text-white bg-white/0 pr-2 pl-1"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      );
    }

    return (
      <div className="relative w-full overflow-scroll overflow-x-auto">
        <select
          value={selectedFilters[name] || ''}
          onChange={(e) => handleFilterChange(name, e.target.value)}
          className="text-xs/3 border rounded-md p-auto w-full bg-white/0 text-slate-100 hover:border-white active:border-white selection:border-white"
        >
          <option className="text-gray-700 text-xs/3" value="">
            Seleccionar
          </option>
          {options.map((option, index) => (
            <option className="text-gray-700 text-xs/3" key={index} value={typeof option === 'string' ? option : option.value}>
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="flex flex-nowrap overflow-x-auto p-4 w-full bg-black/20 rounded-full justify-evenly items-center">
      {Object.entries(filters).map(([name, options]) => (
        <div key={name} className="flex-shrink-0 mr-4 last:mr-0 w-32">
          <label className="mb-1 text-sm font-medium text-white capitalize whitespace-nowrap">
            {name}
          </label>
          <div className="flex items-center"> {/* Added flex and items-center */}
            {renderFilterInput(name as keyof typeof filters, Array.isArray(options) ? options : [options])}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
