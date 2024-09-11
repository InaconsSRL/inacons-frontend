import React from 'react';
import { useTable, useFilters, useSortBy, useResizeColumns, Column } from 'react-table';

interface TableProps {
  tableData: {
    headers: string[];
    rows: Record<string, any>[];
  };
}

const TableComponent: React.FC<TableProps> = ({ tableData }) => {
  const data = React.useMemo(() => tableData.rows, [tableData.rows]);
  const columns = React.useMemo<Column<Record<string, any>>[]>(
    () => tableData.headers.map(header => ({ Header: header, accessor: header })),
    [tableData.headers]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    { columns, data },
    useFilters,
    useSortBy,
    useResizeColumns
  );

  return (
    <div className="flex flex-1 overflow-hidden rounded-xl">
      <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Actividades Septiembre, 2024</h2>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Programar</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">&lt; Hoy &gt;</button>
          </div>
        </div>
        <div className="flex-grow border rounded-lg overflow-hidden">
          <div className="h-full overflow-auto">
            <table {...getTableProps()} className="w-full bg-white shadow-md">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-20">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className={`py-3 px-4 font-semibold text-sm text-left whitespace-nowrap ${index === 0 ? 'sticky left-0 z-30' : ''}`}
                      >
                        <div className="flex items-center">
                          {index === 0 ? (
                            <div className="sticky left-0 bg-gray-200">{column.render('Header')}</div>
                          ) : (
                            column.render('Header')
                          )}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''}
                          </span>
                          <div
                            {...column.getResizerProps()}
                            className="resizer"
                            style={{
                              display: 'inline-block',
                              width: '10px',
                              height: '100%',
                              position: 'absolute',
                              right: '0',
                              top: '0',
                              transform: 'translateX(50%)',
                              zIndex: 1,
                              touchAction: 'none',
                            }}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
                <tr>
                  {headerGroups[0].headers.map(column => (
                    <th key={column.id}>
                      <input
                        type="text"
                        onChange={e => setFilter(column.id, e.target.value)}
                        placeholder={`Buscar ${column.render('Header')}`}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, rowIndex) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}
                    >
                      {row.cells.map((cell, colIndex) => (
                        <td
                          {...cell.getCellProps()}
                          className={`py-2 px-4 border-b border-gray-200 ${colIndex === 0 ? 'sticky left-0 z-10' : ''}`}
                        >
                          {colIndex === 0 ? (
                            <div className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                              {cell.render('Cell')}
                            </div>
                          ) : (
                            cell.render('Cell')
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableComponent;