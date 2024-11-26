
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ModalAgregarProveedorProps {
  onClose: () => void;
  onAdd: (nombre: string) => void;
}

const ModalAgregarProveedor: React.FC<ModalAgregarProveedorProps> = ({ onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-96"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Agregar Proveedor</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Nombre del proveedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (nombre.trim()) {
                onAdd(nombre.trim());
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!nombre.trim()}
          >
            Agregar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalAgregarProveedor;