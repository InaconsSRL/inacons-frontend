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
      console.log(error);
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
      console.log(error);
    }
  };

  useEffect(() => {
    if (requerimiento_id) dispatch(fetchRequerimientoRecursos(requerimiento_id));
  }, []);

  if (loading) {
    return <LoaderPage />;
    
  }


  return (
    <div className="bg-white shadow-md rounded-lg p-3 sticky top-8">
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
                    <th className="px-1 text-[8px] text-left text-[#202124]">Código</th>
                    <th className="px-1 text-[8px] text-left text-[#202124]">Nombre</th>
                    <th className="px-1 text-[8px] text-left text-[#202124]">Unidad</th>
                    <th className="px-1 text-[8px] text-right text-[#202124]">Cantidad</th>
                    <th className="px-1 text-[8px] text-right text-[#202124]">Notas</th>
                    <th className="px-1 text-[8px] text-center text-[#202124]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requerimientoRecursos.map(recurso => (
                    <tr key={recurso.id} className="border-t hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-1 text-[8px]">{recurso.codigo}</td>
                      <td className="px-1 text-[8px]">{recurso.nombre}</td>
                      <td className="px-1 text-[8px]">{recurso.unidad_id}</td>
                      <td className="px-1 text-[8px] text-right">
                        {editingId === recurso.id ? (
                          <input
                            type="number"
                            value={editValues.cantidad}
                            onChange={(e) => setEditValues({...editValues, cantidad: e.target.value})}
                            className="w-16 px-1 text-[8px] border rounded"
                          />
                        ) : recurso.cantidad}
                      </td>
                      <td className="px-1 text-[8px] text-right">
                        {editingId === recurso.id ? (
                          <input
                            type="text"
                            value={editValues.notas}
                            onChange={(e) => setEditValues({...editValues, notas: e.target.value})}
                            className="w-20 px-1 text-[8px] border rounded"
                          />
                        ) : recurso.notas}
                      </td>
                      <td className="px-1 text-[8px] text-center flex gap-1 justify-center">
                        {editingId === recurso.id ? (
                          <button
                            onClick={() => handleUpdate(recurso.id)}
                            className="p-0 text-green-600 hover:bg-green-50 rounded transition-colors items-center"
                          >
                            <FiCheckSquare size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(recurso)}
                            className="p-0 text-blue-600 hover:bg-blue-50 rounded transition-colors items-center"
                          >
                            <FiEdit2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRecurso(recurso.id)}
                          className="p-0 text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors items-center"
                        >
                          <FiX size={14} />
                        </button>
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