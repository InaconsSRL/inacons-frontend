import React, { useState, useMemo, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import TableComponentOptions from './TableComponentOptions';
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
  Header,
} from '@tanstack/react-table';
import backImage from '../../assets/bgmedia.webp'
import * as XLSX from 'xlsx';

//todo bien 12012025

type TableRow = Record<string, string | number | boolean | ReactNode>;

type TableData = {
  headers: string[];
  filterSelect?: boolean[];
  filter?: boolean[];
  rows: TableRow[];
};

interface TableComponentProps {
  tableData: TableData;
  maxCharacters?: number;
}

const preventDefault = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const shouldUseAnimations = (pageSize: number) => pageSize < 50;

const TableComponent: React.FC<TableComponentProps> = ({ tableData }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialColumnSizes, setInitialColumnSizes] = useState<Record<string, number>>({});
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(tableData.headers);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleResetColumns = () => {
    setVisibleColumns(tableData.headers);
  };

  const handleResetFilters = () => {
    setColumnFilters([]);
  };

  const handleResetAll = () => {
    handleResetColumns();
    handleResetFilters();
    table.setPageIndex(0);
    setSorting([]);
  };

  // Invertimos el orden de las filas
  const reversedRows = useMemo(() => [...tableData.rows].reverse(), [tableData.rows]);

  useEffect(() => {
    return () => {
      document.removeEventListener("selectstart", preventDefault);
    };
  }, []);

  // Añadir ResizeObserver para detectar cambios en el tamaño de la tabla
  useEffect(() => {
    if (!tableContainerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      const headers = tableContainerRef.current?.querySelectorAll('th');
      if (headers) {
        const widths: Record<string, number> = {};
        headers.forEach((header, index) => {
          widths[tableData.headers[index]] = header.getBoundingClientRect().width;
        });
      }
    });

    resizeObserver.observe(tableContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [tableData.headers]);

  // Función para calcular el ancho óptimo de cada columna
  const calculateOptimalColumnWidths = () => {
    const fontMeasurementDiv = document.createElement('div');
    fontMeasurementDiv.style.visibility = 'hidden';
    fontMeasurementDiv.style.position = 'absolute';
    fontMeasurementDiv.style.whiteSpace = 'nowrap';
    fontMeasurementDiv.className = 'text-xs md:text-[0.68rem]'; // Mismo tamaño de fuente que las celdas
    document.body.appendChild(fontMeasurementDiv);

    const columnWidths: Record<string, number> = {};
    const padding = 32; // Padding para los bordes y espaciado interno

    tableData.headers.forEach((header) => {
      // Medir el ancho del encabezado
      fontMeasurementDiv.textContent = header;
      let maxWidth = fontMeasurementDiv.offsetWidth + padding || 500;

      // Medir el contenido de las primeras 10 filas (o menos si hay menos filas)
      const rowsToMeasure = Math.min(10, tableData.rows.length);
      for (let i = 0; i < rowsToMeasure; i++) {
        const cellContent = String(tableData.rows[i][header] || '');
        fontMeasurementDiv.textContent = cellContent;
        const contentWidth = fontMeasurementDiv.offsetWidth + padding;
        maxWidth = Math.max(maxWidth, contentWidth);
      }

      // Establecer límites mínimo y máximo
      const minWidth = 100;
      columnWidths[header] = Math.min(Math.max(maxWidth, minWidth), maxWidth);
    });

    document.body.removeChild(fontMeasurementDiv);
    return columnWidths;
  };

  // Efecto para calcular los anchos iniciales
  useEffect(() => {
    const optimalWidths = calculateOptimalColumnWidths();
    setInitialColumnSizes(optimalWidths);
  }, [tableData.rows, tableData.headers]);

  const renderCellContent = (value: unknown): ReactNode => {
    if (React.isValidElement(value)) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      const stringValue = String(value);
      return (
        <div 
          title={stringValue} 
          className="break-words whitespace-normal" // Cambiado de truncate a break-words
          style={{
            maxWidth: '100%',
            minWidth: 0
          }}
        >
          {stringValue} {/* Ya no usamos truncateText aquí */}
        </div>
      );
    }
    return String(value);
  };

  const getUniqueValues = (rows: TableRow[], accessor: string): (string | number | boolean)[] => {
    const uniqueValues = new Set<string | number | boolean>();
    rows.forEach(row => {
      const value = row[accessor];
      if (typeof value !== 'object' && value !== undefined) {
        uniqueValues.add(value);
      }
    });
    return Array.from(uniqueValues).sort((a, b) => String(a).localeCompare(String(b)));
  };

  const columns = useMemo<ColumnDef<TableRow>[]>(() => 
    tableData.headers
      .filter(header => visibleColumns.includes(header))
      .map((header, index) => ({
      header: () => header.toUpperCase(),
      accessorKey: header,
      enableColumnFilter: (tableData.filter ? tableData.filter[index] : true) || 
                        (tableData.filterSelect ? tableData.filterSelect[index] : false),
      cell: info => {
        const value = info.getValue();        
        return renderCellContent(value);
      },
      footer: props => props.column.id,
      minSize: 100, // Añadimos un tamaño mínimo para las columnas
      size: initialColumnSizes[header] || 150, // Usar el tamaño calculado o un valor por defecto
    })),
  [tableData.headers, tableData.filter, tableData.filterSelect, initialColumnSizes, visibleColumns]);

  const table = useReactTable({
    data: reversedRows, // Usamos las filas invertidas aquí
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

  useEffect(() => {
    setCurrentPage(table.getState().pagination.pageIndex + 1);
  }, [table.getState().pagination.pageIndex]);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageCount = table.getPageCount();
    let page = Number(e.target.value);
    
    if (isNaN(page) || page < 1) {
      page = 1;
    } else if (page > pageCount) {
      page = pageCount;
    }
    
    setCurrentPage(page);
    table.setPageIndex(page - 1);
  };

  const renderFilter = (header: Header<TableRow, unknown>, index: number) => {
    if (!header.column.getCanFilter()) return null;

    const isSelectFilter = tableData.filterSelect?.[index];
    const isInputFilter = tableData.filter?.[index];

    if (isSelectFilter) {
      const uniqueValues = getUniqueValues(tableData.rows, header.column.id);
      const filterValue = header.column.getFilterValue();
      
      return (
        <select
          value={(filterValue as string) ?? ''}
          onChange={e => header.column.setFilterValue(e.target.value || undefined)}
          className="w-full border border-slate-400 bg-slate-100 rounded-xl px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          {uniqueValues.map((value) => (
            <option key={String(value)} value={String(value)}>
              {String(value)}
            </option>
          ))}
        </select>
      );
    }

    if (isInputFilter) {
      const filterValue = header.column.getFilterValue();
      
      return (
        <input
          value={(filterValue as string) ?? ''}
          onChange={e => header.column.setFilterValue(e.target.value || undefined)}
          placeholder="✎"
          className="w-full border border-slate-400 bg-slate-100 rounded-xl px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }

    return null;
  };

  const handleExportToExcel = () => {
    // Crear un array con los headers
    const headers = tableData.headers;
    
    // Obtener todas las filas de datos
    const data = tableData.rows.map(row => {
      const rowData: Record<string, string | number | boolean> = {};
      headers.forEach(header => {
        const value = row[header];
        // Convertir elementos React a texto si es necesario
        rowData[header] = React.isValidElement(value) 
          ? 'React Component' 
          : typeof value === 'object' 
            ? String(value) 
            : value as string | number | boolean;
      });
      return rowData;
    });
    
    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    
    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Generar el archivo y descargarlo
    XLSX.writeFile(wb, 'tabla_datos.xlsx');
  };

  return (
    shouldUseAnimations(table.getState().pagination.pageSize) ? (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-1.5 bg-gray-50/50 rounded-xl shadow-md relative min-h-[50vh] flex flex-col"
      >
        <div className="flex justify-end mb-1">
          <motion.button
            ref={optionsButtonRef}
            data-settings-button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="px-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiSettings className="w-4 h-4 text-gray-600" />
          </motion.button>
          <TableComponentOptions
            table={table}
            onExportToExcel={handleExportToExcel}
            isOpen={isOptionsOpen}
            onClose={() => setIsOptionsOpen(false)}
            columns={tableData.headers}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            onResetColumns={handleResetColumns}
            onResetFilters={handleResetFilters}
            onResetAll={handleResetAll}
          />
        </div>
        <div className="overflow-x-auto font-lato flex-grow" ref={tableContainerRef}>
          <table className="w-full border-collapse bg-white table-fixed rounded-xl">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                shouldUseAnimations(table.getState().pagination.pageSize) ? (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="rounded-lg" 
                    key={headerGroup.id} 
                    style={{ 
                      minWidth: 'screen',
                      backgroundImage: `url(${backImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundAttachment: 'fixed',
                      backgroundBlendMode: 'overlay'
                    }}
                  >
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="border-b border-gray-200 bg-white/85 px-4 py-2 text-left text-xs font-semibold text-gray-600 relative"
                        style={{ width: header.getSize(), minWidth: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              {...{
                                className: header.column.getCanSort()
                                  ? `cursor-pointer select-none ${header.column.getIsSorted() ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors duration-200`
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            > 
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <span className="text-blue-600">
                                {{
                                  asc: ' ▲',
                                  desc: ' ▼',
                                }[header.column.getIsSorted() as string] ?? null}
                              </span>
                            </motion.div>
                            {header.column.getCanFilter() ? (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-1"
                              >
                                {renderFilter(header, header.index)}
                              </motion.div>
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
                  </motion.tr>
                ) : (
                  <tr 
                    className="rounded-lg" 
                    key={headerGroup.id} 
                    style={{ 
                      minWidth: 'screen',
                      backgroundImage: `url(${backImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundAttachment: 'fixed',
                      backgroundBlendMode: 'overlay'
                    }}
                  >
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="border-b border-gray-200 bg-white/85 p-4 text-left text-sm font-semibold text-gray-600 relative"
                        style={{ width: header.getSize(), minWidth: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? `cursor-pointer select-none ${header.column.getIsSorted() ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors duration-200`
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            > 
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <span className="text-blue-600">
                                {{
                                  asc: ' ▲',
                                  desc: ' ▼',
                                }[header.column.getIsSorted() as string] ?? null}
                              </span>
                            </div>
                            {header.column.getCanFilter() ? (
                              <div className="mt-1">
                                {renderFilter(header, header.index)}
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
                )
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                shouldUseAnimations(table.getState().pagination.pageSize) ? (
                  <motion.tr 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={row.id} 
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100 transition-colors duration-150'}`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id} 
                        className="border-b border-gray-200 px-1 md:px-2 py-1 md:py-2 text-xs md:text-[0.68rem] text-gray-700 text-left"
                        style={{ 
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          overflow: 'hidden',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word'
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ) : (
                  <tr
                    key={row.id} 
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100 transition-colors duration-150'}`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id} 
                        className="border-b border-gray-200 px-1 md:px-2 py-1 md:py-2 text-xs md:text-[0.68rem] text-gray-700 text-left overflow-hidden"
                        style={{ 
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          whiteSpace: 'normal',
                          wordWrap: 'break-word'
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
        {shouldUseAnimations(table.getState().pagination.pageSize) ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </motion.button>
            </div>
            <span className="text-sm text-gray-700">
              Página{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </strong>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">Ir a página:</span>
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="number"
                min={1}
                max={table.getPageCount()}
                value={currentPage}
                onChange={handlePageChange}
                className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.select
              whileHover={{ scale: 1.05 }}
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 30, 40, 50, 100, tableData.rows.length].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize === tableData.rows.length ? 'Todo' : pageSize}
                </option>
              ))}
            </motion.select>
          </motion.div>
        ) : (
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
              Página{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </strong>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">Ir a página:</span>
              <input
                type="number"
                min={1}
                max={table.getPageCount()}
                value={currentPage}
                onChange={handlePageChange}
                className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 30, 40, 50, 100, tableData.rows.length].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize === tableData.rows.length ? 'Todo' : pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>
    ) : (
      <div className="p-2 bg-gray-50/50 rounded-lg shadow-md min-h-[50vh] flex flex-col">
        <div className="overflow-x-auto flex-grow" ref={tableContainerRef}>
          <table className="w-full border-collapse bg-white table-fixed">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr 
                  className="rounded-lg" 
                  key={headerGroup.id} 
                  style={{ 
                    minWidth: 'screen',
                    backgroundImage: `url(${backImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundBlendMode: 'overlay'
                  }}
                >
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="border-b border-gray-200 bg-white/85 p-4 text-left text-sm font-semibold text-gray-600 relative"
                      style={{ width: header.getSize(), minWidth: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? `cursor-pointer select-none ${header.column.getIsSorted() ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors duration-200`
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          > 
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span className="text-blue-600">
                              {{
                                asc: ' ▲',
                                desc: ' ▼',
                              }[header.column.getIsSorted() as string] ?? null}
                            </span>
                          </div>
                          {header.column.getCanFilter() ? (
                            <div className="mt-1">
                              {renderFilter(header, header.index)}
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
                <tr
                  key={row.id} 
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100 transition-colors duration-150'}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className="border-b border-gray-200 px-1 md:px-2 py-1 md:py-2 text-xs md:text-sm text-gray-700 text-left"
                      style={{ 
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4">
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
            Página{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </strong>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-700">Ir a página:</span>
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={currentPage}
              onChange={handlePageChange}
              className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 40, 50, 100, tableData.rows.length].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize === tableData.rows.length ? 'Todo' : pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  );
};

export default TableComponent;