import React from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { TableHeaderProps } from '../types';

export const TableHeader: React.FC<TableHeaderProps> = ({
  field,
  label,
  sortable = true,
  onSort,
  currentSort
}) => {
  const handleClick = () => {
    if (sortable && onSort) {
      onSort(field);
    }
  };

  const renderSortIcon = () => {
    if (!sortable || !currentSort || currentSort.field !== field) {
      return null;
    }

    return currentSort.direction === 'asc' ? (
      <FiChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <FiChevronDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <th
      className={`font-semibold p-3 text-center bg-gray-100 border-b ${
        sortable ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon()}
      </div>
    </th>
  );
};
