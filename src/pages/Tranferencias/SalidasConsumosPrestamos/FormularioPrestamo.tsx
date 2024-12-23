import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';

interface FormularioPrestamoProps {
  isOpen: boolean;
  onClose: () => void;
  onSetFechaRetorno: (fecha: string) => void;
  hasError?: boolean;
}

const FormularioPrestamo: React.FC<FormularioPrestamoProps> = ({
  isOpen,
  onClose,
  onSetFechaRetorno,
  hasError
}) => {
  const [fRetorno, setFRetorno] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fRetorno) {
      onSetFechaRetorno(fRetorno);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fecha de Retorno">
      <form onSubmit={handleSubmit} className="space-y-4">
        {hasError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            Por favor seleccione una fecha de retorno
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="fRetorno" className="block text-sm font-medium text-gray-700">
            Fecha de Retorno
          </label>
          <input
            type="date"
            id="fRetorno"
            value={fRetorno}
            onChange={(e) => setFRetorno(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!fRetorno}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Guardar Fecha
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormularioPrestamo;
