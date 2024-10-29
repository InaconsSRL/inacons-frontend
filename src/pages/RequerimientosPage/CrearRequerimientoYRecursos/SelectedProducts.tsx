import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { SelectedProductsProps } from './types/interfaces';
import { deleteRequerimientoRecurso,  } from '../../../slices/requerimientoRecursoSlice';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { FiX } from 'react-icons/fi';



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
    <div className="bg-white shadow-md rounded-lg p-4 sticky top-8">
      <h2 className="text-lg font-medium mb-4">Productos Seleccionados</h2>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        {requerimientoRecursos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay productos seleccionados

            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Código</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Unidad</th>
                  <th className="p-2 text-right">Cantidad</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requerimientoRecursos.map(recurso => (
                  <tr key={recurso.id} className="border-t">
                    <td className="p-2">{recurso.codigo}</td>
                    <td className="p-2">{recurso.nombre}</td>
                    <td className="p-2">{recurso.unidad_id}</td>
                    <td className="p-2 text-right">{recurso.cantidad}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteRecurso(recurso.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiX size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          </div>
          
          


        ) : (
          <ul className="space-y-3">
            {requerimientoRecursos.map((reqRecurso) => {
              const recurso = recursos.find((r) => r.id === reqRecurso.recurso_id);
              if (recurso) {
                return (
                  <li 
                    key={reqRecurso.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div>
                      <h3 className="text-md font-medium">{recurso.nombre}</h3>
                      <p className="text-gray-500 text-sm">Código: {recurso.codigo}</p>
                      <p className="text-gray-500">Cantidad: {reqRecurso.cantidad}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteRecurso(reqRecurso.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};