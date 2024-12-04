import { useState } from "react";
import { TransferTable } from "./TransfersTable";
import TransfersForms from "./TransfersForms"; 
import RecursoTransfer from "./RecursoTransfer";

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
              <RecursoTransfer onClose={handleCloseModal} transferenciaId={('')} requerimientos={[]} recursos={[]} />
            ) : (
              <TransfersForms onClose={handleCloseModal} onSave={() => {}} requerimientos={[]} recursos={[]} />
            )}
          </div>
        </>
      )}
    </div>
  );
}