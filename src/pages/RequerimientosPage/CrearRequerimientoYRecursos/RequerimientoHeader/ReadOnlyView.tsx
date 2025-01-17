import React, { memo, useState } from 'react';

import { FormData, Requerimiento,UsuarioCargo } from './types';
import { formatDateForInput } from '../../../../components/Utils/dateUtils';
import AssignApproversModal from './AssignApproversModal';
import Modal from '../../../../components/Modal/Modal';

interface ReadOnlyViewProps {
  formData: FormData;
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
  onEdit: () => void;
  onSubmit: () => void;
  onSave: () => void;
  usuariosCargo: UsuarioCargo[];
}

export const ReadOnlyView: React.FC<ReadOnlyViewProps> = memo(({ formData, requerimiento, obras, onEdit, onSave, onSubmit, usuariosCargo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-4 gap-1 bg-gray-900/80 py-2.5 px-3 rounded-lg">
      <div>
        <span className="block font-bold text-xs text-zinc-400">Código:</span>
        <p className="text-base text-zinc-100 p-1">{formData.codigo || '-'}</p>
      </div>

      <div>
        <span className="block font-bold text-xs text-zinc-400">Usuario:</span>
        <p className="text-base text-zinc-100 p-1">{requerimiento.usuario || '-'}</p>
      </div>

      <div>
        <span className="block text-xs font-bold text-zinc-400">Obra:</span>
        <p className="text-base text-zinc-100 p-1">
          {obras.obras.find(obra => obra.id === formData.obra_id)?.nombre || '-'}
        </p>
      </div>

      <div>
        <span className="block text-xs font-bold text-zinc-400">Fecha Final:</span>
        <p className="text-base text-zinc-100 p-1">
          {formatDateForInput(formData.fecha_final).split("-").reverse().join("-") || '-'}
        </p>
      </div>

      <div className="col-span-3">
        <span className="block text-xs font-bold text-zinc-400">Sustento:</span>
        <p className="text-base text-zinc-100 p-1">{formData.sustento || '-'}</p>
      </div>

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="w-full bg-blue-500 text-white rounded text-base p-2"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onSave}
          className="w-full bg-green-500 text-white rounded text-base p-2"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full bg-yellow-500 text-white rounded text-base p-2"
        >
          Enviar
        </button>
      </div>
    {isModalOpen && (
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AssignApproversModal
          requerimientoId={requerimiento.id}
          usuariosCargo={usuariosCargo}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      </Modal>
    )}
    </div>
  );
});