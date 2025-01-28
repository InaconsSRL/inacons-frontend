import React from 'react';
import { ArchivoPago } from '../../services/archivoPagoService';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';

interface ComprobantesModalProps {
  isOpen: boolean;
  onClose: () => void;
  archivos: ArchivoPago[];
}

const ComprobantesModal: React.FC<ComprobantesModalProps> = ({ isOpen, onClose, archivos }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Comprobantes de Pago"
    >
      {archivos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay comprobantes disponibles</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* {JSON.stringify(archivos, null, 2)} */}
          {archivos.map((archivo, index) => (
            <Card key={archivo.id} className="relative group overflow-hidden">
              <a 
                href={archivo.file} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={archivo.file}
                    alt={`Comprobante ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-sm truncate">
                      {archivo.nombre_archivo}
                    </p>
                  </div>
                </div>
              </a>
            </Card>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default ComprobantesModal;
