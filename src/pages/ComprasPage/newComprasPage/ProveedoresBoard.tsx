import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import Modal from '../../../components/Modal/Modal';
import TableComponent from '../../../components/Table/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { set } from 'zod';
import CompararProveedores from './CompararProveedores';

interface Proveedor {
  ruc: string;
  nombre: string;
  forma_pago: string;
  neto: string;
  igv: string;
  total: string;
}

interface DocumentoData {
  codigo: string;
  usuario: string;
  obra: string;
  fecha_final: string;
  sustento: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

interface ProveedoresBoardProps {
  onClose: () => void;
  requerimientos: any;
  recursos: any;
}

const ProveedoresBoard: React.FC<ProveedoresBoardProps> = ({ onClose, requerimientos, recursos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentoData, setDocumentoData] = useState<DocumentoData>({
    codigo: '-CU_PLAN',
    usuario: 'Noe Cano',
    obra: 'CU_PLAN',
    fecha_final: '15-11-2024',
    sustento: 'Seccion Final de Empastado - Ala Bs'
  });

  const renderOptions = (proveedor: Proveedor) => (
    <div className='flex flex-row gap-2'>
      <button className='text-blue-500 hover:text-blue-700'>
        <FiEye />
      </button>
      <button className='text-yellow-500 hover:text-yellow-700'>
        <FiEdit />
      </button>
      <button className='text-red-500 hover:text-red-700'>
        <FiTrash2 />
      </button>
    </div>
  );

  const tableData = {
    headers: ['Ruc', 'Nombre del Provedor', 'Forma Pago', 'Neto', 'IGV', 'Total', 'Acciones'],
    rows: [
      {
        Ruc: '2032564256',
        'Nombre del Provedor': 'Juan Perez',
        'Forma Pago': 'Trasferencia',
        Neto: '15112024',
        IGV: '15112024',
        Total: '15112024',
        Acciones: renderOptions({
          ruc: '2032564256',
          nombre: 'Juan Perez',
          forma_pago: 'Trasferencia',
          neto: '15112024',
          igv: '15112024',
          total: '15112024'
        })
      },
      // Repite los mismos datos para las otras filas como se muestra en la imagen
    ]
  };

  const handleIsOpenComparar = () => {
    setIsModalOpen(true);
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-white/10 rounded-lg shadow-lg p-4"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="mb-4">
        <div className="grid bg-white rounded-xl p-4 grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Código:</strong> {documentoData.codigo}</p>
            <p><strong>Usuario:</strong> {documentoData.usuario}</p>
            <p><strong>Sustento:</strong> {documentoData.sustento}</p>
          </div>
          <div className="text-left">
            <p><strong>Obra:</strong> {documentoData.obra}</p>
            <p><strong>Fecha Final:</strong> {documentoData.fecha_final}</p>
          </div>
        </div>

        <motion.div
          className="x text-white p-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold">Proveedores</h1>
          <div className="flex space-x-2">
            <Button text="+ Proveedor" color="verde" className="rounded" />
            <Button onClick={handleIsOpenComparar} text="Comparar" color="amarillo" className="rounded" />
            {/* <Button text="Guardar" color="verde" className="rounded" /> */}
          </div>
        </motion.div>

        <div className="flex justify-between gap-2 mb-4">
          <div>
          </div>
          <div className="flex gap-2">
            <div >
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-blue-600 mb-4">Proveedores</h2>

        <div className="overflow-x-auto">
          <TableComponent tableData={tableData} />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir Proveedores"
      >
        <CompararProveedores
          onClose={() => setIsModalOpen(false)}
          //onSave={handleSaveRecursos}
          requerimientos={requerimientos}
          recursos={recursos}
        />
      </Modal>
    </motion.div>
  );
};

export default ProveedoresBoard;