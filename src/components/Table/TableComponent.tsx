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
}

const preventDefault = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const TableComponent: React.FC<TableComponentProps> = ({ tableData }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      document.removeEventListener("selectstart", preventDefault);
    };
  }, []);

  const columns = useMemo<ColumnDef<TableRow>[]>(() => 
    tableData.headers.map(header => ({
      header,
      accessorKey: header,
      cell: info => info.getValue(),
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
    <div className="p-2">
      <div className="h-2" />
      <div 
        ref={tableContainerRef}
        className="overflow-x-auto"
        style={{ position: 'relative', width: '100%' }}
      >
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border border-gray-300 bg-gray-100 p-2 relative"
                    style={{ width: header.getSize(), minWidth: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        > 
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <input
                              value={(header.column.getFilterValue() ?? '') as string}
                              onChange={e =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder={`Filter ${header.column.columnDef.header}`}
                              className="w-full border p-1 mt-1 text-sm"
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
                      }`}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100%',
                        width: '5px',
                        cursor: 'col-resize',
                        zIndex: 1,
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="border border-gray-300 p-2"
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
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="border p-1 rounded"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TableComponent;