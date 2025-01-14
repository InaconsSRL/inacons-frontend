import React, { useState } from 'react';
import Button from '../../../components/Buttons/Button';

interface ValoracionData {
  puntuacion: number;
  fecha_inicio: string;
  fecha_fin: string;
  notas?: string;
  usuario_id: string;
}

interface ValoracionFormProps {
  onSubmit: (data: ValoracionData) => void;
  onCancel: () => void;
  initialData?: ValoracionData;
}

const ValoracionForm: React.FC<ValoracionFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    puntuacion: initialData?.puntuacion || 0,
    fecha_inicio: initialData?.fecha_inicio.split("T")[0] || '',
    fecha_fin: initialData?.fecha_fin.split("T")[0] || '',
    notas: initialData?.notas || '',
    usuario_id: initialData?.usuario_id || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Editar Valoración' : 'Nueva Valoración'}
      </h3>
    <div>
      <label className="block text-sm font-medium text-gray-700">Puntuación (1-10)</label>
      <input
        type="number"
        name="puntuacion"
        min="1"
        max="100"
        step="0.5"
        value={formData.puntuacion}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha Inicios</label>
        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notas</label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button text="Cancelar" color="rojo" onClick={onCancel} />
        <Button text="Guardar" color="verde"   />
      </div>
    </form>
  );
};

export default ValoracionForm;