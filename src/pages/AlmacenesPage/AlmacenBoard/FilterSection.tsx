// components/FilterSection.tsx

import React from 'react';
import { FilterOptions, DateRange } from './interfaces';

interface FilterSectionProps {
  filters: FilterOptions;
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('start', e.target.value)}
          />
          <input
            type="date"
            className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('end', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};