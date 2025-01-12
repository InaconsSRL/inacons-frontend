import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiColumns, FiFilter, FiRefreshCcw } from 'react-icons/fi';
import { Table } from '@tanstack/react-table';
import { TableRow } from './types';

interface TableComponentOptionsProps {
  table: Table<TableRow>;
  onExportToExcel: () => void;
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  visibleColumns: string[];
  onToggleColumn: (columnId: string) => void;
  onResetColumns: () => void;
  onResetFilters: () => void;
  onResetAll: () => void;
}

const TableComponentOptions: React.FC<TableComponentOptionsProps> = ({

  onExportToExcel,
  isOpen,
  onClose,
  columns,
  visibleColumns,
  onToggleColumn,
  onResetColumns,
  onResetFilters,
  onResetAll,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button')?.contains(document.querySelector('[data-settings-button]'))
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-50"
        >
          <div className="space-y-4">
            {/* Sección de Exportar */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Exportar</h3>
              <button
                onClick={onExportToExcel}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                <FiDownload />
                <span>Exportar a Excel</span>
              </button>
            </div>

            {/* Sección de Columnas Visibles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Columnas Visibles</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {columns.map(column => (
                  <label
                    key={column}
                    className="flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column)}
                      onChange={() => onToggleColumn(column)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">{column}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sección de Acciones de Reinicio */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Acciones</h3>
              <div className="space-y-2">
                <button
                  onClick={onResetColumns}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiColumns />
                  <span>Restablecer Columnas</span>
                </button>
                <button
                  onClick={onResetFilters}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiFilter />
                  <span>Limpiar Filtros</span>
                </button>
                <button
                  onClick={onResetAll}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FiRefreshCcw />
                  <span>Restablecer Todo</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableComponentOptions;
