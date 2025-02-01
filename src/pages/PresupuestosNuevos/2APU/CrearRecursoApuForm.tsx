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
    nombreAdicional: '',  // Nuevo campo para el texto adicional
    nombre: recurso.nombre // Mantenemos el nombre original
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nombreCompleto = formData.nombreAdicional 
      ? `${recurso.nombre} ${formData.nombreAdicional}`.trim()
      : recurso.nombre;

    const nuevoRecursoApu: AddRecursoComposicionApuDto = {
      nombre: nombreCompleto,
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
    <div className="p-4 m-auto bg-white rounded-lg shadow-md min-w-[30vw] max-w-[40vw]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Nombre del recurso: <span className='font-semibold'>{recurso.nombre}</span>
          </label>
          <div className="mt-1 flex items-center">
            <span className="inline-block px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600">
              {recurso.nombre}
            </span>
            <input
              type="text"
              value={formData.nombreAdicional}
              onChange={(e) => setFormData({...formData, nombreAdicional: e.target.value})}
              className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Texto adicional..."
            />
          </div>
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
