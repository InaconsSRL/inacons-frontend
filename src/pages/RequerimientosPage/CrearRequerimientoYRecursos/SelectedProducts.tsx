import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { SelectedProductsProps } from './types/interfaces';
import { deleteRequerimientoRecurso,  } from '../../../slices/requerimientoRecursoSlice';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { FiTrash2, FiX } from 'react-icons/fi';



export const SelectedProducts: React.FC<SelectedProductsProps> = ({ requerimiento_id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);
  const { recursos } = useSelector((state: RootState) => state.recurso);

  const handleDeleteRecurso = async (recursoId: string) => {
    try {
      await dispatch(deleteRequerimientoRecurso(recursoId)).unwrap();
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
            <th className="p-2 text-left text-[#202124]">Código</th>
            <th className="p-2 text-left text-[#202124]">Nombre</th>
            <th className="p-2 text-left text-[#202124]">Unidad</th>
            <th className="p-2 text-right text-[#202124]">Cantidad</th>
            <th className="p-2 text-center text-[#202124]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requerimientoRecursos.map(recurso => (
            <tr key={recurso.id} className="border-t hover:bg-[#f8f9fa] transition-colors">
              <td className="p-2">{recurso.codigo}</td>
              <td className="p-2">{recurso.nombre}</td>
              <td className="p-2">{recurso.unidad_id}</td>
              <td className="p-2 text-right">{recurso.cantidad}</td>
              <td className="p-2 text-center">
              <button
                onClick={() => handleDeleteRecurso(recurso.id)}
                className="p-1 text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors"
              >
                <FiX size={16} />
              </button>
              </td>
            </tr>
            ))}
          </tbody>
          </table>
        </div>
        <ul className="space-y-2">
        {requerimientoRecursos.map((reqRecurso) => {
          const recurso = recursos.find((r) => r.id === reqRecurso.recurso_id);
          if (recurso) {
          return (
            <li 
            key={reqRecurso.id} 
            className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded-md hover:bg-[#f1f3f4] transition-all duration-200 border border-[#dadce0]"
            >
            <div>
              <h3 className="text-xs font-medium text-[#202124]">{recurso.nombre}</h3>
              <div className="flex gap-2">
              <p className="text-[#5f6368] text-[10px]">Código: {recurso.codigo}</p>
              <p className="text-[#5f6368] text-[10px]">Cantidad: {reqRecurso.cantidad}</p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteRecurso(reqRecurso.id)}
              className="text-[#d93025] hover:text-[#ae2317] p-1 transition-colors"
            >
              <FiTrash2 size={14} />
            </button>
            </li>
          );
          }
          return null;
        })}
        </ul>
        </>
      )}
      </div>
    </div>
  );
};