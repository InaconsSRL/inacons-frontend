// types/interfaces.ts

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface Movement {
  id: string;
  date: Date;
  type: 'entrada' | 'salida';
  quantity: number;
  document: string;
  user: string;
  notes: string;
}

export interface InventoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  location: string;
  supplier: string;
  status: 'Activo' | 'Bajo Stock' | 'Agotado' | 'En Tránsito';
  minStock: number;
  maxStock: number;
  currentStock: number;
  unitPrice: number;
  lastUpdated: Date;
  movements: Movement[];
  qrCode: string;
  batchNumber: string;
  expirationDate: Date;
  dimensions: Dimensions;
}

export interface SortConfig {
  key: keyof InventoryItem;
  direction: 'asc' | 'desc';
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface FilterOptions {
  searchTerm: string;
  category: string;
  dateRange: DateRange;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}