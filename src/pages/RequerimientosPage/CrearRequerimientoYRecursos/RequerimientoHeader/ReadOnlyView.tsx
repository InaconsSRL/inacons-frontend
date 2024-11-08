import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { 
  addAprobacion,
  //updateRequerimientoAprobacionThunk
} from '../../../../slices/requerimientoAprobacionSlice';
import { UsuarioCargo, FormData, Requerimiento } from './types';
import { formatDateForInput } from '../../../../components/Utils/dateUtils';

interface ReadOnlyViewProps {
  formData: FormData;
  usuariosCargo: UsuarioCargo[];
  requerimiento: Requerimiento;
  obras: { obras: { id: string; nombre: string }[] };
  onEdit: () => void;
  onSubmit: () => void;
  onSave: () => void;
}

export const ReadOnlyView: React.FC<ReadOnlyViewProps> = memo(({ usuariosCargo, formData, requerimiento, obras, onEdit, onSave, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [supervisorId, setSupervisorId] = useState('');
  const [gerenteId, setGerenteId] = useState('');

  const handleSupervisorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSupervisorId(selectedId);

    if (selectedId) {
      const aprobacionData = {
        requerimiento_id: requerimiento.id,
        usuario_id: selectedId,
        estado_aprobacion: 'pendiente_aprobacion',
        comentario: 'Asignación inicial de supervisor',
        gerarquia_aprobacion: 3
      };

      try {
        await dispatch(addAprobacion(aprobacionData)).unwrap();
      } catch (error) {
        console.error('Error al asignar supervisor:', error);
      }
    }
  };

  const handleGerenteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setGerenteId(selectedId);

    if (selectedId) {
      const aprobacionData = {
        requerimiento_id: requerimiento.id,
        usuario_id: selectedId,
        estado_aprobacion: 'Pendiente',
        comentario: 'Asignación inicial de gerente',
        gerarquia_aprobacion: 4
      };

      try {
        await dispatch(addAprobacion(aprobacionData)).unwrap();
      } catch (error) {
        console.error('Error al asignar gerente:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1 bg-white/50 p-2 rounded-lg">
      <div>
        <span className="block text-xs text-gray-700">Código:</span>
        <p className="text-sm border-b p-1">{formData.codigo || '-'}</p>
      </div>

      <div>
        <span className="block text-xs text-gray-700">Usuario:</span>
        <p className="text-sm border-b p-1">{requerimiento.usuario || '-'}</p>
      </div>

      <div>
        <span className="block text-xs text-gray-700">Obra:</span>
        <p className="text-sm border-b p-1">
          {obras.obras.find(obra => obra.id === formData.obra_id)?.nombre || '-'}
        </p>
      </div>

      <div>
        <span className="block text-xs text-gray-700">Fecha Final:</span>
        <p className="text-sm border-b p-1">
          {formatDateForInput(formData.fecha_final).split("-").reverse().join("-") || '-'}
        </p>
      </div>

      <div className="col-span-1">
        <span className="block text-xs text-gray-700">Sustento:</span>
        <p className="text-sm border-b p-1">{formData.sustento || '-'}</p>
      </div>

      <div className="col-span-1">
        <span className="block text-xs text-gray-700">Elige al Supervisor:</span>
        <select 
          className="w-full border rounded text-xs p-1"
          value={supervisorId}
          onChange={handleSupervisorChange}
        >
          <option value="">--Selecciona Supervisor--</option>
          {usuariosCargo
            .filter(usuario => usuario.cargo_id?.gerarquia === 3)
            .map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombres} {usuario.apellidos}
              </option>
            ))}
        </select>
      </div>

      <div className="col-span-1">
        <span className="block text-xs text-gray-700">Elige al Gerente:</span>
        <select 
          className="w-full border rounded text-xs p-1"
          value={gerenteId}
          onChange={handleGerenteChange}
        >
          <option value="">--Selecciona Gerente--</option>
          {usuariosCargo
            .filter(usuario => usuario.cargo_id?.gerarquia === 4)
            .map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombres} {usuario.apellidos}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="w-full bg-blue-500 text-white rounded text-xs p-2"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onSave}
          className="w-full bg-green-500 text-white rounded text-xs p-2"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full bg-yellow-500 text-white rounded text-xs p-2"
        >
          Enviar
        </button>
      </div>
    </div>
  );
});