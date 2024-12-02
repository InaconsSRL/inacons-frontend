// components/InventoryTable.tsx

import React from 'react';
import { InventoryItem, SortConfig } from './interfaces';

interface InventoryTableProps {
  items: InventoryItem[];
  sortConfig: SortConfig;
  onSort: (key: keyof InventoryItem) => void;
  onItemSelect: (item: InventoryItem) => void;
  onMovement: (itemId: number, type: 'entrada' | 'salida', quantity: number) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  sortConfig,
  onSort,
  onItemSelect,
  onMovement
}) => {
  const getSortIcon = (key: keyof InventoryItem) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const getStatusClass = (status: string) => {
    const statusClasses = {
      'Activo': 'bg-green-100 text-green-800',
      'Bajo Stock': 'bg-yellow-100 text-yellow-800',
      'Agotado': 'bg-red-100 text-red-800',
      'En Tránsito': 'bg-blue-100 text-blue-800'
    } as const;
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <table className="w-full">
        <thead className="sticky top-0 bg-white shadow-sm">
          <tr>
            {[
              { key: 'code', label: 'Código' },
              { key: 'name', label: 'Nombre' },
              { key: 'category', label: 'Categoría' },
              { key: 'currentStock', label: 'Stock Actual' },
              { key: 'status', label: 'Estado' }
            ].map(({ key, label }) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort(key as keyof InventoryItem)}
              >
                {label} {getSortIcon(key as keyof InventoryItem)}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.code}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{item.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.currentStock}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  onClick={() => onItemSelect(item)}
                >
                  Ver detalles
                </button>
                <button
                  className="text-green-600 hover:text-green-900 mr-4"
                  onClick={() => onMovement(item.id, 'entrada', 1)}
                >
                  Entrada
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => onMovement(item.id, 'salida', 1)}
                >
                  Salida
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};