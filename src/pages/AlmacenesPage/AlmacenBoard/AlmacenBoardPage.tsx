import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchAlmacenes } from '../../../slices/almacenSlice';
import { fetchAlmacenRecursos } from '../../../slices/almacenRecursoSlice';
import { FilterSection } from './FilterSection';
import { InventoryTable } from './InventoryTable';
import { useNavigate } from 'react-router-dom';
import { ItemDetailModal } from './ItemDetailModal';
import { NewMovementModal } from './NewMovementModal';
import { generateMockData } from './mockData';
import type {
  InventoryItem,
  Movement,
  SortConfig,
  FilterOptions,
} from './interfaces';
import TransfersPage from '../../Tranferencias/TransfersPage';
import AlmacenBetha from '../../AlmacenBetha/AlmacenBetha';

export const AlmacenBoardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const almacenes = useSelector((state: RootState) => state.almacen.almacenes);
  const almacenRecursos = useSelector((state: RootState) => state.almacenRecurso.almacenRecursos);
  const [selectedAlmacenId, setSelectedAlmacenId] = useState<string>('');

  const navigate = useNavigate();

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
  const [mostrarTransfersPage, setMostrarTransfersPage] = useState(false)
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAlmacenes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAlmacenId) {
      dispatch(fetchAlmacenRecursos());
    }
  }, [dispatch, selectedAlmacenId]);

  // Transform almacenRecursos to InventoryItem format
  const transformToInventoryItems = (): InventoryItem[] => {
    return almacenRecursos
      .filter(recurso => recurso.almacen_id === selectedAlmacenId)
      .map(recurso => ({
        id: Number(recurso.id),
        code: recurso.recurso_id,
        name: recurso.nombre_almacen,
        description: '',
        category: 'Material',
        location: 'Almacén',
        supplier: '',
        status: recurso.cantidad > 0 ? 'Activo' : 'Agotado',
        minStock: 0,
        maxStock: 1000,
        currentStock: recurso.cantidad,
        unitPrice: recurso.costo,
        lastUpdated: new Date(),
        movements: [],
        qrCode: '',
        batchNumber: '',
        expirationDate: new Date(),
        dimensions: { length: 0, width: 0, height: 0, weight: 0 }
      }));
  };

  useEffect(() => {
    setInventory(transformToInventoryItems());
  }, [almacenRecursos, selectedAlmacenId]);

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
          lastUpdated: new Date()
        };
      }
      return item;
    });

    setInventory(updatedInventory);
  };

  return (
    <div className="container mx-auto px-6">
      <div className="text-white pb-4">
        <h1 className="text-2xl font-bold">Sistema de Kardex Empresarial</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-violet-600 text-white px-4 py-2 rounded"
          onClick={() => setMostrarTransfersPage(!mostrarTransfersPage)}
        >
          {!mostrarTransfersPage? "Mostrar Transeferencias" : "Mostrar Inventario"}
        </button>
      </div>

      <div className="flex justify-end gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowNewMovementModal(true)}
        >
          Nuevo Movimiento
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Exportar
        </button>
      </div>

      {/* Todo esto es la tabla */}

      {mostrarTransfersPage ? (<TransfersPage />) : 
      ( <AlmacenBetha />)
      }

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
          selectedAlmacenId={selectedAlmacenId}
          onClose={() => setShowNewMovementModal(false)}
          onSave={handleMovement}
        />
      )}
    </div>
  );
};

export default AlmacenBoardPage;
