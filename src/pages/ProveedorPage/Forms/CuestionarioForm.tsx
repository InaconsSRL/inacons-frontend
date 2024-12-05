
import React, { useState } from 'react';
import Button from '../../../components/Buttons/Button';

interface CuestionarioFormProps {
  cuestionarios: Array<{ id: string; denominacion: string }>;
  onSubmit: (data: { cuestionario_id: string; respuesta: string }) => void;
  onCancel: () => void;
}

const CuestionarioForm: React.FC<CuestionarioFormProps> = ({ cuestionarios, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cuestionario_id: '',
    respuesta: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Cuestionario</label>
        <select
          name="cuestionario_id"
          value={formData.cuestionario_id}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccione un cuestionario</option>
          {cuestionarios.map(c => (
            <option key={c.id} value={c.id}>{c.denominacion}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Respuesta</label>
        <textarea
          name="respuesta"
          value={formData.respuesta}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button text="Cancelar" color="rojo" onClick={onCancel} />
        <Button text="Guardar" color="verde" />
      </div>
    </form>
  );
};

export default CuestionarioForm;