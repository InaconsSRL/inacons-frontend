import { useState } from "react";
import { TransferTable } from "./TransfersTable";
import FormularioSolicitud from "./SalidasAlmacen/FormularioSolicitud";
import { TipoMovimiento } from './types';
import RecepcionCompra from "./RecepcionCompras/RecepcionCompra";
import DevolucionPrestamos from "./DevolucionPrestamos/DevolucionPrestamos";
import Modal from "../../components/Modal/Modal";
import NewRecepcionTransferencia from "./RecepcionTransferencias/NewRecepcionTransferencia";

export default function TransfersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TipoMovimiento | ''>('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOption('');
    // Resetear el select al valor por defecto
    const selectElement = document.querySelector('select') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = '';
    }
  };

  const renderModalContent = () => {
    switch (selectedOption) {
      case 'COMPRAS':
      case 'RECEPCIONES':
        return (
          <div className=" p-6 rounded-lg shadow-lg w-11/12 max-h-[90vh] overflow-y-auto">
            {selectedOption === 'COMPRAS' ? (
              <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Recepcion Traslado Alamcenes">
                <RecepcionCompra
                  onClose={handleCloseModal}
                  onComplete={(orden, detalles) => {
                    console.log('Recepción completada:', { orden, detalles });
                  }}
                />
              </Modal>
            ) : (
              <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Recepción de Transferencias entre Almacenes">
                <NewRecepcionTransferencia onClose={handleCloseModal} />
              </Modal>
            )}
          </div>
        );
      case 'DEVOLUCION':
        return (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Devolución de Préstamos">
            <DevolucionPrestamos />
          </Modal>
        );
      case 'TRASLADOS':
        return (<Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Solicitudes de Salida Transferencia a otro Almacen">
          <FormularioSolicitud onClose={handleCloseModal} />
        </Modal>)
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-14rem)]">
      <main className="container mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 flex justify-between items-auto">
            <h2 className="text-blue-800 text-2xl font-semibold">Transferencias</h2>
            <div className="flex space-x-2">
              <select
                value={selectedOption}
                onChange={(e) => {
                  const value = e.target.value as TipoMovimiento | '';
                  if (value !== '') { // Solo abrir modal si no es la opción por defecto
                    setSelectedOption(value);
                    setIsModalOpen(true);
                  } else {
                    setSelectedOption('');
                    setIsModalOpen(false);
                  }
                }}
                className="bg-blue-900 text-white px-4 py-2 rounded-xl"
              >
                <option value="">Solicitudes</option>
                <optgroup label="Ingresos">
                  <option value="COMPRAS">Compras</option>
                  <option value="RECEPCIONES">Recepciones</option>
                  <option value="DEVOLUCION">Devolucion Prestamos</option>
                </optgroup>
                <optgroup label="Salidas">
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

      {isModalOpen && selectedOption !== 'DEVOLUCION' && (
        <>
          <div className="fixed inset-0 opacity-100" onClick={handleCloseModal}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 rounded">
            {renderModalContent()}
          </div>
        </>
      )}
      {isModalOpen && selectedOption === 'DEVOLUCION' && renderModalContent()}
    </div>
  );
}