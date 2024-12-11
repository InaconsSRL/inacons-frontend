import { useState, useEffect } from 'react';

interface TableData {
    [key: string]: any;
}

interface TableCount {
    [key: string]: number;
}

const TableViewer = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [tableCounts, setTableCounts] = useState<TableCount>({});
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/count')
            .then(res => res.json())
            .then(data => {
                setTableCounts(data);
                const filteredTables = Object.keys(data).filter(table => data[table] > 0);
                setTables(filteredTables);
            });
    }, []);

    console.log(tables)

    const fetchTableData = (tableName: string) => {
        fetch(`http://localhost:5000/${tableName}`)
            .then(res => res.json())
            .then(data => {
                setTableData(data);
                if (data.length > 0) {
                    const cols = Object.keys(data[0]);
                    setColumns(cols);
                    setSelectedColumns(cols);
                }
            });
    };

    const handleColumnToggle = (column: string) => {
        setSelectedColumns(prev =>
            prev.includes(column)
                ? prev.filter(col => col !== column)
                : [...prev, column]
        );
    };

    const renderCellContent = (value: any) => {
        if (Array.isArray(value)) {
            return value.map(item =>
                typeof item === 'object' ? JSON.stringify(item) : item
            ).join(', ');
        }
        return value?.toString() || '';
    };

    return (
        <div className="flex bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-96 bg-white bg-opacity-80 p-6 flex flex-col overflow-auto h-[85vh]">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white bg-opacity-80 z-10">Tablas</h2>
                <div className="overflow-y-auto flex-grow">
                    <ul className="space-y-4">
                        {tables.sort((a, b) => a.localeCompare(b)).map(table => (
                            <li key={table}>
                                <button
                                    className={`w-full text-left px-4 py-2 rounded-md font-medium focus:outline-none transition-colors duration-200
                                        ${selectedTable === table ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-800 hover:bg-purple-100 hover:text-purple-600'}`}
                                    onClick={() => {
                                        setSelectedTable(table);
                                        fetchTableData(table);
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{table}</span>
                                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                            {tableCounts[table]}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
                        {columns.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-4 h-20 overflow-auto">
                                {columns.map(column => (
                                    <label key={column} className="flex items-center space-x-3 text-base h-7 text-gray-700 bg-white bg-opacity-70 px-4 py-2 rounded-full shadow">
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns.includes(column)}
                                            onChange={() => handleColumnToggle(column)}
                                            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <span>{column}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {tableData.length > 0 && (
                            <div className="relative">
                                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                                    <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg">
                                        <thead className="bg-gradient-to-r from-purple-600 to-blue-500 sticky top-0">
                                            <tr>
                                                {selectedColumns.map(column => (
                                                    <th key={column} className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                        {column}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white bg-opacity-80 divide-y divide-gray-200">
                                            {tableData.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-purple-50 transition duration-200">
                                                    {selectedColumns.map(column => (
                                                        <td key={column} className="px-6 py-4 text-sm text-gray-800">
                                                            {renderCellContent(row[column])}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableViewer;