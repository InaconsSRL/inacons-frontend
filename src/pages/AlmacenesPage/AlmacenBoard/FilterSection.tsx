// components/FilterSection.tsx

import React from 'react';
import { FilterOptions, DateRange } from './interfaces';

interface FilterSectionProps {
  filters: FilterOptions;
  selectedAlmacenId: string;
  onAlmacenChange: (almacenId: string) => void;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange
}) => {
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDateRange: DateRange = {
      ...filters.dateRange,
      [type]: value ? new Date(value) : null
    };
    onFilterChange({ dateRange: newDateRange });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-3 py-1 border rounded-lg text-sm"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
        />
        <select
          className="px-3 py-1 border rounded-lg text-sm"
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="all">Todas las categorías</option>
          <option value="Electrónicos">Electrónicos</option>
          <option value="Oficina">Oficina</option>
          <option value="Herramientas">Herramientas</option>
          <option value="Materiales">Materiales</option>
          <option value="Consumibles">Consumibles</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-1/2 px-2 py-1 border rounded-lg text-sm"
            value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('start', e.target.value)}
          />
          <input
            type="date"
            className="w-1/2 px-2 py-1 border rounded-lg text-sm"
            value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('end', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};