import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchObras } from '../../../slices/obrasSlice';
import { addRequerimiento } from '../../../slices/requerimientoSlice';
import { RequerimientoFormData } from './types/interfaces';

interface RequerimientoFormProps {
  onRequerimientoCreated: (requerimientoId: string, requerimientoData: any) => void;
}

export const RequerimientoForm: React.FC<RequerimientoFormProps> = ({ onRequerimientoCreated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { obras } = useSelector((state: RootState) => state.obra);
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<RequerimientoFormData>({
    usuario_id: user?.id || '',
    obra_id: '',
    fecha_final: new Date(),
    sustento: '',
    estado_atencion: 'Pendiente de envio',
  });

  useEffect(() => {
    if (obras.length === 0) dispatch(fetchObras());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(addRequerimiento(formData)).unwrap();
      onRequerimientoCreated(result.id, result);
    } catch (error) {
      console.error('Error al crear el requerimiento:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Nuevo Requerimiento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Obra</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.obra_id}
            onChange={(e) => setFormData({ ...formData, obra_id: e.target.value })}
            required
          >
            <option value="">Seleccione una obra</option>
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>
                {obra.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Final</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.fecha_final.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, fecha_final: new Date(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sustento</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.sustento}
            onChange={(e) => setFormData({ ...formData, sustento: e.target.value })}
            required
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Crear Requerimiento
        </button>
      </form>
    </div>
  );
};