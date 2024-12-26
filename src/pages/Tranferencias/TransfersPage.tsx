import { useState } from "react";
import { TransferTable } from "./TransfersTable";
import FormularioSolicitud from "./FormularioSolicitud";
import RecepcionTransferencia from "./RecepcionTransferencias/RecepcionTransferencias";
import { TipoMovimiento } from './types';
import RecepcionCompra from "./RecepcionCompras/RecepcionCompra";
import Recursos from "../CalendarPage/CalendarPage";
import SalidasConsumosPrestamos from "./SalidasConsumosPrestamos/SalidasConsumosPrestamos";

export default function TransfersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TipoMovimiento | ''>('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOption(''); // Restablecer el estado del select al cerrar el modal
  };

  const renderModalContent = () => {
    switch (selectedOption) {
      case 'COMPRAS':
      case 'RECEPCIONES':
        return (
          <div className=" p-6 rounded-lg shadow-lg w-11/12 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            {selectedOption === 'COMPRAS' ? (
              <RecepcionCompra 
                onClose={handleCloseModal} 
                onComplete={(orden, detalles) => {
                  console.log('Recepción completada:', { orden, detalles,Recursos });
                }} 
              />
            ) : (
              <RecepcionTransferencia onClose={handleCloseModal} />
            )}
          </div>
        );
      case 'OBRA':
        return <SalidasConsumosPrestamos />;
      case 'TRASLADOS':
        return <FormularioSolicitud onClose={handleCloseModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 flex justify-between items-auto">
            <h2 className="text-blue-800 text-2xl font-semibold">Transferencias</h2>
            <div className="flex space-x-2">
              <select
                onChange={(e) => {
                  const value = e.target.value as TipoMovimiento | '';
                  setSelectedOption(value);
                  setIsModalOpen(true);
                }}
                className="bg-blue-900 text-white px-4 py-2 rounded-xl"
              >
                <option value="">Solicitudes</option>
                <optgroup label="Ingresos">
                  <option value="COMPRAS">Compras</option>
                  <option value="RECEPCIONES">Recepciones</option>
                </optgroup>
                <optgroup label="Salidas">
                  <option value="OBRA">Obra</option>
                  <option value="TRASLADOS">Traslados</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div className="p-4">
            <TransferTable />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 opacity-50" onClick={handleCloseModal}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 rounded">
            {renderModalContent()}
          </div>
        </>
      )}
    </div>
  );
}