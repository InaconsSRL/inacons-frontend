import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRecursoComposicionApu, AddRecursoComposicionApuDto } from '../../../slices/recursoComposicionApuSlice';
import { AppDispatch } from '../../../store/store';

interface RecursoPresupuesto {
  id_recurso: string;
  id_unidad: string;
  id_clase: string;
  id_tipo: string;
  tipo?: ITipo;
  id_recurso_app: string;
  nombre: string;
  precio_referencial: number;
  fecha_actualizacion: string; // Cambiado de Date a string
}
 interface ITipo {
  id_tipo: string;
  descripcion: string;
  codigo: string;
}


interface Props {
  recurso: RecursoPresupuesto;
  onSuccess: (nuevoRecurso: AddRecursoComposicionApuDto) => void;
  onCancel: () => void;
}

const CrearRecursoApuForm: React.FC<Props> = ({ recurso, onSuccess, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    cuadrilla: 1,
    cantidad: 1,
    especificaciones: '',
    descripcion: '',
    nombre: recurso.nombre
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevoRecursoApu: AddRecursoComposicionApuDto = {
      nombre: formData.nombre,
      especificaciones: formData.especificaciones,
      descripcion: formData.descripcion,
      id_unidad: recurso.id_unidad,
      id_recurso: recurso.id_recurso,
    };

    try {
      const resultAction = await dispatch(addRecursoComposicionApu(nuevoRecursoApu));
      if (addRecursoComposicionApu.fulfilled.match(resultAction)) {
        onSuccess({...nuevoRecursoApu, id_rec_comp_apu: resultAction.payload.id_rec_comp_apu});
      }
    } catch (error) {
      console.error('Error al crear recurso APU:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md min-w-[30vw] max-w-[40vw]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Nuevo Nombre para el recurso <span className='font-semibold'>{recurso.nombre}</span></label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-950">Especificaciones</label>
          <textarea
            value={formData.especificaciones}
            onChange={(e) => setFormData({...formData, especificaciones: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-950">Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-950 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRecursoApuForm;
