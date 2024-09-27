import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';

// Types
type MaterialRequest = {
  id: string;
  requester: string;
  material: string;
  quantity: number;
  unit: string;
  project: string;
  dueDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  lastUpdated: string;
};

type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
};

// Mock Data
const mockMaterialRequests: MaterialRequest[] = [
  { id: 'MR001', requester: 'John Doe', material: 'Steel Beams', quantity: 50, unit: 'pieces', project: 'Project A', dueDate: '2024-10-15', status: 'Pending' },
  { id: 'MR002', requester: 'Jane Smith', material: 'Concrete Mix', quantity: 1000, unit: 'kg', project: 'Project B', dueDate: '2024-10-20', status: 'Approved' },
  { id: 'MR003', requester: 'Bob Johnson', material: 'Electrical Wiring', quantity: 500, unit: 'meters', project: 'Project C', dueDate: '2024-10-25', status: 'Rejected' },
  { id: 'MR004', requester: 'Alice Brown', material: 'Paint', quantity: 200, unit: 'liters', project: 'Project A', dueDate: '2024-11-01', status: 'Pending' },
  { id: 'MR005', requester: 'Charlie Wilson', material: 'Lumber', quantity: 300, unit: 'boards', project: 'Project D', dueDate: '2024-11-05', status: 'Approved' },
];

const mockInventory: InventoryItem[] = [
  { id: 'INV001', name: 'Steel Beams', quantity: 200, unit: 'pieces', location: 'Warehouse A', lastUpdated: '2024-09-25' },
  { id: 'INV002', name: 'Concrete Mix', quantity: 5000, unit: 'kg', location: 'Warehouse B', lastUpdated: '2024-09-26' },
  { id: 'INV003', name: 'Electrical Wiring', quantity: 1000, unit: 'meters', location: 'Warehouse A', lastUpdated: '2024-09-27' },
  { id: 'INV004', name: 'Paint', quantity: 500, unit: 'liters', location: 'Warehouse C', lastUpdated: '2024-09-28' },
  { id: 'INV005', name: 'Lumber', quantity: 1000, unit: 'boards', location: 'Warehouse B', lastUpdated: '2024-09-29' },
];

const mockSuppliers: Supplier[] = [
  { id: 'SUP001', name: 'Steel Co.', contact: 'Mike Steel', email: 'mike@steelco.com', phone: '123-456-7890', rating: 4.5 },
  { id: 'SUP002', name: 'Concrete Solutions', contact: 'Sarah Concrete', email: 'sarah@concretesolutions.com', phone: '234-567-8901', rating: 4.2 },
  { id: 'SUP003', name: 'Electro Supplies', contact: 'Tom Electro', email: 'tom@electrosupplies.com', phone: '345-678-9012', rating: 4.8 },
  { id: 'SUP004', name: 'Paint Masters', contact: 'Lisa Paint', email: 'lisa@paintmasters.com', phone: '456-789-0123', rating: 4.0 },
  { id: 'SUP005', name: 'Lumber Jack', contact: 'Jack Lumber', email: 'jack@lumberjack.com', phone: '567-890-1234', rating: 4.7 },
];

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Component
const MaterialManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'suppliers'>('requests');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<MaterialRequest[]>(mockMaterialRequests);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);

  const handleNewItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <TableComponent
            tableData={{
              headers: ['ID', 'Requester', 'Material', 'Quantity', 'Unit', 'Project', 'Due Date', 'Status', 'Actions'],
              rows: requests.map(req => ({
                'ID': req.id,
                'Requester': req.requester,
                'Material': req.material,
                'Quantity': req.quantity.toString(),
                'Unit': req.unit,
                'Project': req.project,
                'Due Date': req.dueDate,
                'Status': req.status,
                'Actions': 'Edit | Delete'
              }))
            }}
          />
        );
      case 'inventory':
        return (
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
        );
      case 'suppliers':
        return (
          <TableComponent
            tableData={{
              headers: ['ID', 'Name', 'Contact', 'Email', 'Phone', 'Rating', 'Actions'],
              rows: suppliers.map(sup => ({
                'ID': sup.id,
                'Name': sup.name,
                'Contact': sup.contact,
                'Email': sup.email,
                'Phone': sup.phone,
                'Rating': sup.rating.toString(),
                'Actions': 'Edit | Delete'
              }))
            }}
          />
        );
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >

      <motion.header
        className="bg-white/70 p-4 shadow-lg rounded-3xl h-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-cyan-700 via-purple-700 to-indigo-700 text-transparent bg-clip-text font-bold text-2xl"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Sección Requermientos
          </motion.div>
          <div className="flex items-center space-x-6">
            {['requests', 'inventory', 'suppliers'].map((tab, index) => (
              <motion.a
                key={tab}
                href="#"
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-full ${activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500/ to-cyan-500 text-white font-medium'
                  : 'text-black hover:bg-white/70 bg-blue-100'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {tab === 'requests' && 'Lista de requerimientos'}
                {tab === 'inventory' && 'Crear Requerimiento'}
                {tab === 'suppliers' && 'Más'}
                {activeTab === tab && (
                  <motion.div
                    className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-white rounded-full"
                    layoutId="underline"
                  />
                )}
              </motion.a>
            ))}
          </div>
        </nav>
      </motion.header>

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
          {activeTab === 'requests' ? 'Material Requests' : activeTab === 'inventory' ? 'Inventory' : 'Suppliers'}
        </motion.h1>
        <motion.div
          className="flex space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          

        </motion.div>
          
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
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="h-full overflow-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTable()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>
        {/* Section D: Samples */}
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

export default MaterialManagement;