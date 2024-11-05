
import React, { useState } from 'react';

interface Warehouse {
    id: number;
    name: string;
    location: string;
    capacity: string;
    usage: number;
  }
  
  function AlmacenBoardPage() {
  // Estados principales
  const [inventory, setInventory] = React.useState(generateMockData());
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState({ key: 'code', direction: 'asc' });
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ start: null, end: null });
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;

  // Generar datos mock
  function generateMockData() {
    const categories = ['Electrónicos', 'Oficina', 'Herramientas', 'Materiales', 'Consumibles'];
    const locations = ['Almacén A', 'Almacén B', 'Almacén C', 'Almacén D'];
    const suppliers = ['Proveedor X', 'Proveedor Y', 'Proveedor Z'];
    const status = ['Activo', 'Bajo Stock', 'Agotado', 'En Tránsito'];

    return Array.from({ length: 2000 }, (_, index) => ({
      id: index + 1,
      code: `PROD${String(index + 1).padStart(4, '0')}`,
      name: `Producto ${index + 1}`,
      description: `Descripción detallada del producto ${index + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      status: status[Math.floor(Math.random() * status.length)],
      minStock: Math.floor(Math.random() * 50) + 10,
      maxStock: Math.floor(Math.random() * 200) + 100,
      currentStock: Math.floor(Math.random() * 100) + 1,
      unitPrice: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      movements: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, i) => ({
        id: `MOV-${index}-${i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        type: Math.random() > 0.5 ? 'entrada' : 'salida',
        quantity: Math.floor(Math.random() * 50) + 1,
        document: `DOC-${Math.floor(Math.random() * 1000)}`,
        user: `Usuario ${Math.floor(Math.random() * 10) + 1}`,
        notes: `Nota de movimiento ${i + 1}`
      })),
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
  }

  // Efectos y funciones de utilidad
  React.useEffect(() => {
    filterItems();
  }, [searchTerm, selectedCategory, inventory]);

  const filterItems = () => {
    let filtered = [...inventory];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredItems].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredItems(sorted);
  };

  const handleMovement = (itemId, type, quantity) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        const newQuantity = type === 'entrada' 
          ? item.currentStock + quantity 
          : item.currentStock - quantity;
        
        const newMovement = {
          id: `MOV-${item.id}-${item.movements.length + 1}`,
          date: new Date(),
          type,
          quantity,
          document: `DOC-${Math.floor(Math.random() * 1000)}`,
          user: 'Usuario Actual',
          notes: `Movimiento de ${type}`
        };

        return {
          ...item,
          currentStock: newQuantity,
          movements: [...item.movements, newMovement],
          lastUpdated: new Date()
        };
      }
      return item;
    });

    setInventory(updatedInventory);
  };

  // Renderizado del componente principal
  return (
    <div className="max-h-full bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Sistema de Kardex Empresarial
        </h1>
        <div className="flex gap-4">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Nuevo Movimiento
          </button>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar por código o nombre..."
              className="w-full px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              <option value="Electrónicos">Electrónicos</option>
              <option value="Oficina">Oficina</option>
              <option value="Herramientas">Herramientas</option>
              <option value="Materiales">Materiales</option>
              <option value="Consumibles">Consumibles</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              className="w-1/2 px-4 py-2 border rounded-lg"
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <input
              type="date"
              className="w-1/2 px-4 py-2 border rounded-lg"
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('code')}>
                Código {sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}>
                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('currentStock')}>
                Stock Actual {sortConfig.key === 'currentStock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.currentStock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.status === 'Activo' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Bajo Stock' ? 'bg-yellow-100 text-yellow-800' : 
                      item.status === 'Agotado' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => setSelectedItem(item)}
                  >
                    Ver detalles
                  </button>
                  <button 
                    className="text-green-600 hover:text-green-900 mr-4"
                    onClick={() => handleMovement(item.id, 'entrada', 1)}
                  >
                    Entrada
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleMovement(item.id, 'salida', 1)}
                  >
                    Salida
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Mostrando {((page - 1) * itemsPerPage) + 1} a {Math.min(page * itemsPerPage, filteredItems.length)} de {filteredItems.length} resultados
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>
          <button 
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
            disabled={page >= Math.ceil(filteredItems.length / itemsPerPage)}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de Detalles */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detalles del Producto</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold mb-2">Información General</h4>
                <p><span className="font-semibold">Código:</span> {selectedItem.code}</p>
                <p><span className="font-semibold">Nombre:</span> {selectedItem.name}</p>
                <p><span className="font-semibold">Descripción:</span> {selectedItem.description}</p>
                <p><span className="font-semibold">Categoría:</span> {selectedItem.category}</p>
                <p><span className="font-semibold">Ubicación:</span> {selectedItem.location}</p>
                <p><span className="font-semibold">Proveedor:</span> {selectedItem.supplier}</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Información de Stock</h4>
                <p><span className="font-semibold">Stock Actual:</span> {selectedItem.currentStock}</p>
                <p><span className="font-semibold">Stock Mínimo:</span> {selectedItem.minStock}</p>
                <p><span className="font-semibold">Stock Máximo:</span> {selectedItem.maxStock}</p>
                <p><span className="font-semibold">Precio Unitario:</span> ${selectedItem.unitPrice}</p>
                <p><span className="font-semibold">Última Actualización:</span> {selectedItem.lastUpdated.toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-bold mb-2">Historial de Movimientos</h4>
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Fecha</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Cantidad</th>
                        <th className="px-4 py-2 text-left">Documento</th>
                        <th className="px-4 py-2 text-left">Usuario</th>
                        <th className="px-4 py-2 text-left">Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem.movements.map((movement) => (
                        <tr key={movement.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{movement.date.toLocaleDateString()}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              movement.type === 'entrada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {movement.type}
                            </span>
                          </td>
                          <td className="px-4 py-2">{movement.quantity}</td>
                          <td className="px-4 py-2">{movement.document}</td>
                          <td className="px-4 py-2">{movement.user}</td>
                          <td className="px-4 py-2">{movement.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-span-2">
                <h4 className="font-bold mb-2">Información Adicional</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-semibold">Código QR:</span> {selectedItem.qrCode}</p>
                    <p><span className="font-semibold">Número de Lote:</span> {selectedItem.batchNumber}</p>
                    <p><span className="font-semibold">Fecha de Vencimiento:</span> {selectedItem.expirationDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">Dimensiones:</span></p>
                    <ul className="ml-4">
                      <li>Largo: {selectedItem.dimensions.length} cm</li>
                      <li>Ancho: {selectedItem.dimensions.width} cm</li>
                      <li>Alto: {selectedItem.dimensions.height} cm</li>
                      <li>Peso: {selectedItem.dimensions.weight} kg</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nuevo Movimiento */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nuevo Movimiento</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Producto</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Documento de Referencia</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportar el componente
export default AlmacenBoardPage;