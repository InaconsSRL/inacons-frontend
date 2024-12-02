// components/ItemDetailModal.tsx

import React from 'react';
import { InventoryItem } from './interfaces';

interface ItemDetailModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Detalles del Producto</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-2">Información General</h4>
            <p><span className="font-semibold">Código:</span> {item.code}</p>
            <p><span className="font-semibold">Nombre:</span> {item.name}</p>
            <p><span className="font-semibold">Descripción:</span> {item.description}</p>
            <p><span className="font-semibold">Categoría:</span> {item.category}</p>
            <p><span className="font-semibold">Ubicación:</span> {item.location}</p>
            <p><span className="font-semibold">Proveedor:</span> {item.supplier}</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Información de Stock</h4>
            <p><span className="font-semibold">Stock Actual:</span> {item.currentStock}</p>
            <p><span className="font-semibold">Stock Mínimo:</span> {item.minStock}</p>
            <p><span className="font-semibold">Stock Máximo:</span> {item.maxStock}</p>
            <p><span className="font-semibold">Precio Unitario:</span> {item.unitPrice}</p>
            <p><span className="font-semibold">Última Actualización:</span> {item.lastUpdated.toLocaleString()}</p>
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
                  {item.movements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{movement.date.toLocaleString()}</td>
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
        </div>
      </div>
    </div>
  );
};