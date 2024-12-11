import { useState } from "react";
import { TransferTable } from "./TransfersTable";
import TransfersForms from "./TransfersForms"; 
import FormularioSolicitud from "./FormularioSolicitud";
import RecepcionTransferencia from "./RecepcionTransferencias/RecepcionTransferencias";

export default function TransfersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-20">
      <main className="container mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 flex justify-between items-auto">
            <h2 className="text-blue-800 text-2xl font-semibold">Transferencias</h2>
            <div className="flex space-x-2">
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedOption(value);
                  setIsModalOpen(true);
                }}
                className="bg-blue-900 text-white px-4 py-2 rounded-xl"
              >
                <option value="">Solicitudes</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Salida">Salida</option>
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
            {selectedOption === "Ingreso" ? (
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-h-[90vh] overflow-y-auto">
                <button 
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <RecepcionTransferencia />
              </div>
            ) : (
              <FormularioSolicitud onClose={handleCloseModal} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
