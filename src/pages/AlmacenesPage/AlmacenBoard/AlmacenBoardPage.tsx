// pages/AlmacenBoardPage.tsx

import React, { useState, useEffect } from 'react';
import { FilterSection } from './FilterSection';
import { InventoryTable } from './InventoryTable';
import { ItemDetailModal } from './ItemDetailModal';
import { NewMovementModal } from './NewMovementModal';
import { generateMockData } from './mockData';
import type { 
  InventoryItem, 
  Movement, 
  SortConfig, 
  FilterOptions, 
} from './interfaces';

export const AlmacenBoardPage: React.FC = () => {
  // Estados principales
  const [inventory, setInventory] = useState<InventoryItem[]>(generateMockData());
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: 'all',
    dateRange: { start: null, end: null }
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'code', 
    direction: 'asc' 
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showNewMovementModal, setShowNewMovementModal] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Efectos
  useEffect(() => {
    filterAndSortItems();
  }, [filters, sortConfig, inventory]);

  // Funciones de utilidad
  const filterAndSortItems = () => {
    let filtered = [...inventory];
    
    // Aplicar filtros
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.lastUpdated);
        return itemDate >= filters.dateRange.start! && 
               itemDate <= filters.dateRange.end!;
      });
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredItems(filtered);
    setPage(1); // Resetear la página al filtrar
  };

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleMovement = (movement: Partial<Movement>) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === Number(movement.id)) {
        const newQuantity = movement.type === 'entrada'
          ? item.currentStock + (movement.quantity || 0)
          : item.currentStock - (movement.quantity || 0);

        return {
          ...item,
          currentStock: newQuantity,
          movements: [...item.movements, movement as Movement],
          lastUpdated: new Date()
        };
      }
      return item;
    });

    setInventory(updatedInventory);
  };

  return (
    <div className="max-h-full bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Sistema de Kardex Empresarial
        </h1>
        <div className="flex gap-4">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setShowNewMovementModal(true)}
          >
            Nuevo Movimiento
          </button>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => {/* Implementar exportación */}}
          >
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FilterSection
        filters={filters}
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
      />

      {/* Tabla */}
      <InventoryTable
        items={filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
        sortConfig={sortConfig}
        onSort={handleSort}
        onItemSelect={setSelectedItem}
        onMovement={(itemId, type, quantity) => 
          handleMovement({
            id: `${itemId}`,
            type,
            quantity,
            date: new Date(),
            document: `AUTO-${Date.now()}`,
            user: 'Usuario Actual',
            notes: `Movimiento automático de ${type}`
          })
        }
      />

      {/* Paginación */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Mostrando {((page - 1) * itemsPerPage) + 1} a {Math.min(page * itemsPerPage, filteredItems.length)} de {filteredItems.length} resultados
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>
          <button 
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
            disabled={page >= Math.ceil(filteredItems.length / itemsPerPage)}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modales */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showNewMovementModal && (
        <NewMovementModal
          inventory={inventory}
          onClose={() => setShowNewMovementModal(false)}
          onSave={handleMovement}
        />
      )}
    </div>
  );
};

export default AlmacenBoardPage;