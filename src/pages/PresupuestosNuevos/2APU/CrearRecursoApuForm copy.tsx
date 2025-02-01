// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { addRecursoComposicionApu, AddRecursoComposicionApuDto } from '../../../slices/recursoComposicionApuSlice';
// import { AppDispatch } from '../../../store/store';

// // Nueva interfaz basada en el modelo Recurso
// interface Recurso {
//   id: string;
//   codigo: string;
//   nombre: string;
//   descripcion: string;
//   fecha: string;
//   cantidad: number;
//   unidad_id: string;
//   precio_actual: number;
//   tipo_recurso_id: string;
//   clasificacion_recurso_id: string;
//   tipo_costo_recurso_id: string;
//   vigente: boolean;
//   imagenes: Array<{id: string, file: string}>;
// }

// interface Props {
//   recurso: Recurso;
//   onSuccess: (nuevoRecurso: AddRecursoComposicionApuDto) => void;
//   onCancel: () => void;
// }

// const CrearRecursoApuForm: React.FC<Props> = ({ recurso, onSuccess, onCancel }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [formData, setFormData] = useState({
//     cuadrilla: 1,
//     cantidad: 1,
//     especificaciones: '',
//     descripcion: '',
//     nombre: recurso.nombre
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const nuevoRecursoApu: AddRecursoComposicionApuDto = {
//       nombre: formData.nombre,
//       especificaciones: formData.especificaciones,
//       descripcion: formData.descripcion,
//       id_unidad: recurso.unidad_id, // Cambiado de id_unidad a unidad_id
//       id_recurso: recurso.id, // Cambiado de id_recurso a id
//     };

//     try {
//       const resultAction = await dispatch(addRecursoComposicionApu(nuevoRecursoApu));
//       if (addRecursoComposicionApu.fulfilled.match(resultAction)) {
//         onSuccess({...nuevoRecursoApu, id_rec_comp_apu: resultAction.payload.id_rec_comp_apu});
//       }
//     } catch (error) {
//       console.error('Error al crear recurso APU:', error);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md min-w-[30vw] max-w-[40vw]">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-900">Nuevo Nombre para el recurso <span className='font-semibold'>{recurso.nombre}</span></label>
//           <input
//             type="text"
//             value={formData.nombre}
//             onChange={(e) => setFormData({...formData, nombre: e.target.value})}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-950">Especificaciones</label>
//           <textarea
//             value={formData.especificaciones}
//             onChange={(e) => setFormData({...formData, especificaciones: e.target.value})}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-950">Descripción</label>
//           <textarea
//             value={formData.descripcion}
//             onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
//           />
//         </div>

//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-950 hover:bg-gray-50"
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
//           >
//             Crear
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CrearRecursoApuForm;
