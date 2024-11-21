import React, { ReactNode } from 'react';
import { FiArrowLeftCircle, FiTrash } from 'react-icons/fi';

// Tipos expandidos
export type CellType = 
  | 'text' 
  | 'number' 
  | 'input' 
  | 'formula' 
  | 'icon' 
  | 'actions'
  | 'custom'; // Nuevo tipo para elementos personalizados

interface RowData {
  id: string;  // Agregamos id como propiedad obligatoria
  [key: string]: string | number | ReactNode;
}

export interface Column {
  key: string;
  title: string;
  type: CellType;
  width?: string;
  formula?: (row: RowData) => number;
  style?: React.CSSProperties;
  render?: (value: string | number | ReactNode, row: RowData, index: number) => ReactNode; // Función para renderizado personalizado
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; // Props para inputs
}

interface TableAction {
  icon: ReactNode;
  onClick: (row: RowData) => void;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: RowData[];
  onRowChange?: (index: number, field: string, value: string | number) => void;
  actions?: TableAction[]; // Nueva prop para acciones
  rowStyles?: (row: RowData) => React.CSSProperties;
  onDelete?: (index: number) => void;
}
const TableComponentSimple: React.FC<TableProps> = ({
  columns,
  data,
  onRowChange,
  actions,
  rowStyles,
  onDelete
}) => {
  const handleInputChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (onRowChange) {
      onRowChange(index, field, value);
    }
  };

  const renderCell = (column: Column, row: RowData, rowIndex: number) => {
    if (column.key === 'actions' && actions) {
      return (
        <div className="flex space-x-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.onClick(row)}
              className={action.className}
            >
              {action.icon}
            </button>
          ))}
        </div>
      );
    }

    // Si la columna tiene una función render personalizada, úsala
    if (column.render) {
      return column.render(row[column.key], row, rowIndex);
    }

    switch (column.type) {
      case 'input':
        return (
          <input
            {...column.inputProps}
            type="text"
            value={String(row[column.key] || '')}
            onChange={(e) => handleInputChange(rowIndex, column.key, e.target.value)}
            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${column.inputProps?.className || ''}`}
          />
        );
      case 'formula':
        return column.formula ? column.formula(row).toFixed(2) : '';
      case 'number':
        return typeof row[column.key] === 'number' 
          ? (row[column.key] as number).toLocaleString()
          : row[column.key];
      case 'actions':
        return (
          <div className="flex space-x-2">
            {onDelete && (
              <button
                onClick={() => onDelete(rowIndex)}
                className="p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <FiTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      case 'icon':
        return (
          <div className="flex justify-center">
            <FiArrowLeftCircle className="w-4 h-4" />
          </div>
        );
      case 'custom':
        return row[column.key];
      default:
        return row[column.key];
    }
  };

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors"
              style={rowStyles ? rowStyles(row) : {}}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap"
                  style={column.style}
                >
                  {renderCell(column, row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponentSimple;