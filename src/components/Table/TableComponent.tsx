import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  ColumnResizeMode,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

type TableRow = Record<string, string | number | boolean>;

type TableData = {
  headers: string[];
  rows: TableRow[];
};

interface TableComponentProps {
  tableData: TableData;
  maxCharacters?: number; // New prop for maximum characters to display
}

const preventDefault = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const TableComponent: React.FC<TableComponentProps> = ({ tableData, maxCharacters = 14 }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      document.removeEventListener("selectstart", preventDefault);
    };
  }, []);

  const calculateMaxChars = (columnWidth: number) => {
    // Estimate characters based on column width
    // You may need to adjust this calculation based on your font and styling
    return Math.floor(columnWidth / 5 ); // Assuming average character width is 8px
  };

  const truncateText = (text: string, maxLength: number) => {
    if (typeof text !== 'string') return text;
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const columns = useMemo<ColumnDef<TableRow>[]>(() => 
    tableData.headers.map(header => ({
      header: () => header.toUpperCase(),
      accessorKey: header,
      cell: info => {
        const value = info.getValue();
        const columnWidth = info.column.getSize();
        const dynamicMaxChars = calculateMaxChars(columnWidth);
        
        return (
          <div title={String(value)}>
            {truncateText(value, dynamicMaxChars)}
          </div>
        );
      },
      footer: props => props.column.id,
    })),
  [tableData.headers]);

  const table = useReactTable({
    data: tableData.rows,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
  });

  return (
    <div className="p-2 bg-gray-50 rounded-lg shadow-md">
      <div className="overflow-x-auto" ref={tableContainerRef}>
        <table className="w-full border-collapse bg-white">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border-b border-gray-200 bg-gray-100 p-4 text-left text-sm font-semibold text-gray-600 relative"
                    style={{ width: header.getSize(), minWidth: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none hover:text-blue-600 transition-colors duration-200'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        > 
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' ▲',
                            desc: ' ▼',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="mt-2">
                            <input
                              value={(header.column.getFilterValue() ?? '') as string}
                              onChange={e =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder={`Filtra`}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                    <div
                      onMouseDown={(e) => {
                        document.addEventListener("selectstart", preventDefault);
                        header.getResizeHandler()(e);
                      }}
                      onTouchStart={header.getResizeHandler()}
                      onMouseUp={() => {
                        document.removeEventListener("selectstart", preventDefault);
                      }}
                      onMouseLeave={() => {
                        document.removeEventListener("selectstart", preventDefault);
                      }}
                      className={`resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      } absolute right-0 top-0 h-full w-1 bg-blue-500 cursor-col-resize opacity-0 hover:opacity-100 transition-opacity duration-200`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100 transition-colors duration-150'}>
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="border-b border-gray-200 px-0.5 py-0.5 text-sm text-gray-700 text-center"
                    style={{ minWidth: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
        <span className="text-sm text-gray-700">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Go to page:</span>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[10, 20, 30, 40, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TableComponent;