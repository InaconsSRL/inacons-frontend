import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TableComponent from '../../components/Table/TableComponent';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  lastUpdated: string;
};



const mockInventory: InventoryItem[] = [
    { id: 'INV001', name: 'Steel Beams', quantity: 200, unit: 'pieces', location: 'Warehouse A', lastUpdated: '2024-09-25' },
    { id: 'INV002', name: 'Concrete Mix', quantity: 5000, unit: 'kg', location: 'Warehouse B', lastUpdated: '2024-09-26' },
    { id: 'INV003', name: 'Electrical Wiring', quantity: 1000, unit: 'meters', location: 'Warehouse A', lastUpdated: '2024-09-27' },
    { id: 'INV004', name: 'Paint', quantity: 500, unit: 'liters', location: 'Warehouse C', lastUpdated: '2024-09-28' },
    { id: 'INV005', name: 'Lumber', quantity: 1000, unit: 'boards', location: 'Warehouse B', lastUpdated: '2024-09-29' },
  ];

const Inventory: React.FC = (  ) => {
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  return (
    <motion.div className="flex flex-col h-full">
      <motion.div
        className="bg-blue-600/0 text-white p-4 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h1
          className="text-2xl font-bold"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Inventory
        </motion.h1>
        <motion.button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Actualizar
        </motion.button>
      </motion.div>

      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div
            className="flex-grow border rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <TableComponent
              tableData={{
                headers: ['ID', 'Name', 'Quantity', 'Unit', 'Location', 'Last Updated', 'Actions'],
                rows: inventory.map(item => ({
                  'ID': item.id,
                  'Name': item.name,
                  'Quantity': item.quantity.toString(),
                  'Unit': item.unit,
                  'Location': item.location,
                  'Last Updated': item.lastUpdated,
                  'Actions': 'Edit | Delete'
                }))
              }}
            />
          </motion.div>
        </main>
        <aside className="w-64 flex flex-col p-4 bg-gray-100 overflow-hidden h-full">
          <div className="flex justify-between items-center mb-4">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors w-full">
              Detalles
            </button>
          </div>
          <div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-96 overflow-auto">
              {[...Array(30)].map((_, index) => (
                <motion.div
                  key={index}
                  className="p-2 border-b hover:bg-gray-200 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  SubDetalle {index + 1}
                </motion.div>
              ))}
            </div>
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
};

export default Inventory;