import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { SelectedProductsProps } from './types/interfaces';
import { fetchRequerimientoRecursos, deleteRequerimientoRecurso, updateRequerimientoRecurso} from '../../../slices/requerimientoRecursoSlice';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { FiCheckSquare, FiEdit2, FiPlusCircle, FiX } from 'react-icons/fi';

const mockPartidas = [
  { id: 'partida1', nombre: 'Partida 1' },
  { id: 'partida2', nombre: 'Partida 2' },
  { id: 'partida3', nombre: 'Partida 3' },
];

interface Recurso {
  id: string;
  cantidad: number;
  notas?: string;
}

export const SelectedProducts: React.FC<SelectedProductsProps> = ({ requerimiento_id, fecha_final }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ cantidad: '', notas: '' });
  const [partidasData, setPartidasData] = useState<{
    [key: string]: {
      visible: boolean;
      selected: string;
      qty: string;
      applied: Array<{ partida: string; cantidad: string }>;
    };
  }>({});

  const handleDeleteRecurso = async (recursoId: string) => {
    try {
      await dispatch(deleteRequerimientoRecurso(recursoId)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleEdit = (recurso: Recurso) => {
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

  const togglePartidas = (id: string) => {
    setPartidasData(prev => ({
      ...prev,
      [id]: {
        visible: !prev[id]?.visible,
        selected: '',
        qty: '',
        applied: prev[id]?.applied || []
      }
    }));
  };

  const handleAddPartida = (id: string) => {
    setPartidasData(prev => {
      const data = prev[id];
      if (!data.selected || !data.qty) return prev;
      return {
        ...prev,
        [id]: {
          ...data,
          applied: [...data.applied, { partida: data.selected, cantidad: data.qty }],
          selected: '',
          qty: ''
        }
      };
    });
  };

  useEffect(() => {
    if (requerimiento_id) dispatch(fetchRequerimientoRecursos(requerimiento_id));
  }, []);

  console.log(requerimientoRecursos)

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
                    <React.Fragment key={recurso.id}>
                      <tr className="border-t hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-1 text-[8px]">{recurso.codigo}</td>
                        <td className="px-1 text-[8px]">{recurso.nombre}</td>
                        <td className="px-1 text-[8px]">{recurso.unidad}</td>
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
                          <button
                            onClick={() => togglePartidas(recurso.id)}
                            className="p-0 text-yellow-400 hover:bg-purple-50 rounded transition-colors"
                          >
                            <FiPlusCircle size={14}  />
                          </button>
                        </td>
                      </tr>
                      {partidasData[recurso.id]?.visible && (
                        <tr key={`partidas-${recurso.id}`} className="border-b">
                          <td colSpan={6} className="p-2">
                            <div className="bg-gray-50 p-2 rounded">
                              <select
                                value={partidasData[recurso.id].selected}
                                onChange={(e) => setPartidasData(prev => ({
                                  ...prev,
                                  [recurso.id]: { ...partidasData[recurso.id], selected: e.target.value }
                                }))}
                                className="border text-[8px] rounded px-1 mr-1"
                              >
                                <option value="">Seleccionar partida</option>
                                {mockPartidas.map(part => (
                                  <option key={part.id} value={part.id}>{part.nombre}</option>
                                ))}
                              </select>
                              <input
                                type="number"
                                value={partidasData[recurso.id].qty}
                                onChange={(e) => setPartidasData(prev => ({
                                  ...prev,
                                  [recurso.id]: { ...partidasData[recurso.id], qty: e.target.value }
                                }))}
                                className="border text-[8px] rounded px-1 w-16 mr-1"
                              />
                              <button
                                onClick={() => handleAddPartida(recurso.id)}
                                className="text-[8px] bg-[#1a73e8] text-white px-2 py-1 rounded"
                              >
                                Agregar
                              </button>
                              <div className="mt-2">
                                {partidasData[recurso.id].applied.map((p, idx) => (
                                  <div key={idx} className="flex items-center text-[8px] gap-2 mb-1">
                                    <span className="text-gray-600">Partida: {p.partida}</span>
                                    <span>Cantidad: {p.cantidad}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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