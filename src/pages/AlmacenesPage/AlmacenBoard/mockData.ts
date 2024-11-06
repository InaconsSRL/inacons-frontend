// utils/mockData.ts

import { InventoryItem, PaginationInfo } from './interfaces';

const categories = ['Electrónicos', 'Oficina', 'Herramientas', 'Materiales', 'Consumibles'];
const locations = ['Almacén A', 'Almacén B', 'Almacén C', 'Almacén D'];
const suppliers = ['Proveedor X', 'Proveedor Y', 'Proveedor Z'];
const status = ['Activo', 'Bajo Stock', 'Agotado', 'En Tránsito'] as const;

export const generateMockData = (): InventoryItem[] => {
  return Array.from({ length: 2000 }, (_, index) => ({
    id: index + 1,
    code: `PROD${String(index + 1).padStart(4, '0')}`,
    name: `Producto ${index + 1}`,
    description: `Descripción detallada del producto ${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    status: status[Math.floor(Math.random() * status.length)] as typeof status[number],
    minStock: Math.floor(Math.random() * 50) + 10,
    maxStock: Math.floor(Math.random() * 200) + 100,
    currentStock: Math.floor(Math.random() * 100) + 1,
    unitPrice: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    movements: generateMockMovements(index),
    qrCode: `QR-${index + 1}`,
    batchNumber: `BATCH-${Math.floor(Math.random() * 1000)}`,
    expirationDate: new Date(Date.now() + Math.floor(Math.random() * 31536000000)),
    dimensions: {
      length: Math.floor(Math.random() * 100) + 1,
      width: Math.floor(Math.random() * 100) + 1,
      height: Math.floor(Math.random() * 100) + 1,
      weight: parseFloat((Math.random() * 10).toFixed(2))
    }
  }));
};

const generateMockMovements = (itemIndex: number) => {
  return Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, i) => ({
    id: `MOV-${itemIndex}-${i}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    type: Math.random() > 0.5 ? 'entrada' as const : 'salida' as const,
    quantity: Math.floor(Math.random() * 50) + 1,
    document: `DOC-${Math.floor(Math.random() * 1000)}`,
    user: `Usuario ${Math.floor(Math.random() * 10) + 1}`,
    notes: `Nota de movimiento ${i + 1}`
  }));
};

// utils/helpers.ts

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const calculatePagination = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationInfo => {
  return {
    currentPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    itemsPerPage,
    totalItems
  };
};