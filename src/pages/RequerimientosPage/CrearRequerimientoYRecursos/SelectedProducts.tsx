import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { SelectedProductsProps } from './types/interfaces';
import { fetchRequerimientoRecursos, deleteRequerimientoRecurso, updateRequerimientoRecurso} from '../../../slices/requerimientoRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { FiCheckSquare, FiEdit2, FiX } from 'react-icons/fi';

export const SelectedProducts: React.FC<SelectedProductsProps> = ({ requerimiento_id, fecha_final }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ cantidad: '', notas: '' });

  const handleDeleteRecurso = async (recursoId: string) => {
    try {
      await dispatch(deleteRequerimientoRecurso(recursoId)).unwrap();
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEdit = (recurso: any) => {
    setEditingId(recurso.id);
    setEditValues({
      cantidad: recurso.cantidad.toString(),
      notas: recurso.notas || ''
    });
  };

  const handleUpdate = async (recursoId: string) => {
    try {
      await dispatch(updateRequerimientoRecurso({
        id: recursoId,
        cantidad_aprobada: Number(editValues.cantidad),
        cantidad: Number(editValues.cantidad),
        notas: editValues.notas,
        fecha_limit: fecha_final,
      })).unwrap();
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (requerimiento_id) dispatch(fetchRequerimientoRecursos(requerimiento_id));
  }, []);

  if (loading) {
    return <LoaderPage />;    
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-3 sticky">
      <h2 className="text-sm font-semibold mb-3 text-[#1a73e8]">Productos Seleccionados</h2>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        {requerimientoRecursos.length === 0 ? (
          <div className="text-center py-3 text-[#5f6368] text-xs">
            No hay productos seleccionados

          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#f8f9fa]">
                    <th className="px-1 text-left text-[#202124]">Código</th>
                    <th className="px-1 text-left text-[#202124]">Nombre</th>
                    <th className="px-1 text-left text-[#202124]">Unidad</th>
                    <th className="px-1 text-center text-[#202124]">Cant.</th>
                    <th className="px-1 text-left text-[#202124]">Notas</th>
                    <th className="px-1 text-left text-[#202124]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requerimientoRecursos.map(recurso => (
                    <tr key={recurso.id} className="border-t hover:bg-[#d4d6d7] transition-colors">
                      <td className="px-1 py-2">{recurso.codigo}</td>
                      <td className="px-1 py-2">{recurso.nombre}</td>
                      <td className="px-1 py-2 text-center">{recurso.unidad}</td>
                      <td className="px-1 py-2 text-center">
                        {editingId === recurso.id ? (
                          <input
                            type="number"
                            value={editValues.cantidad}
                            onChange={(e) => setEditValues({...editValues, cantidad: e.target.value})}
                            className="w-14 px-0 border text-center rounded"
                          />
                        ) : recurso.cantidad}
                      </td>
                      <td className="px-1 py-2">
                        {editingId === recurso.id ? (
                          <input
                            type="text"
                            value={editValues.notas}
                            onChange={(e) => setEditValues({...editValues, notas: e.target.value})}
                            className="w-25 px-1 border rounded"
                          />
                        ) : recurso.notas}
                      </td>
                      <td className="px-1 py-2 text-center">
                        <div className="flex gap-1 justify-center items-center">
                          {editingId === recurso.id ? (
                            <button
                              onClick={() => handleUpdate(recurso.id)}
                              className="p-0 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <FiCheckSquare size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(recurso)}
                              className="p-0 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <FiEdit2 size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRecurso(recurso.id)}
                            className="p-0 text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};