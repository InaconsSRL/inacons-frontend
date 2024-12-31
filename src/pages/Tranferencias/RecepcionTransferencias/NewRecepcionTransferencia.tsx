import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransferenciaDetalles } from '../../../slices/transferenciaDetalleSlice';
import { fetchTransferenciaRecursosById, clearTransferenciaRecursos } from '../../../slices/transferenciaRecursoSlice';
import { RootState, AppDispatch } from '../../../store/store';
import noImage from '../../../assets/NoImage.webp';
import IMG from '../../../components/IMG/IMG';
import LoaderPage from '../../../components/Loader/LoaderPage';

interface ModalProps {
  onClose: () => void;
}

interface TransferenciaRecurso {
  id: string;
  transferencia_detalle_id: string;
  cantidad: number;
  cantidadModificada?: number;
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    imagenes: { file: string }[];
  };
}

const NewRecepcionTransferencia: React.FC<ModalProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTransferencia, setSelectedTransferencia] = useState<string | null>(null);
  const [selectedRecursos, setSelectedRecursos] = useState<TransferenciaRecurso[]>([]);
  const [isLoadingDetalles, setIsLoadingDetalles] = useState(true);
  const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);

  const { transferenciaDetalles } = useSelector((state: RootState) => state.transferenciaDetalle);
  const { transferenciaRecursos } = useSelector((state: RootState) => state.transferenciaRecurso);

  // Filtrar solo las transferencias de tipo SALIDA-ALMACEN
  const filteredTransferencias = transferenciaDetalles.filter(
    detalle => detalle.tipo === 'SALIDA-ALMACEN'
  );

  useEffect(() => {
    const loadTransferencias = async () => {
      setIsLoadingDetalles(true);
      await dispatch(fetchTransferenciaDetalles());
      setIsLoadingDetalles(false);
    };
    loadTransferencias();
  }, [dispatch]);

  useEffect(() => {
    const loadRecursos = async () => {
      if (selectedTransferencia) {
        setIsLoadingRecursos(true);
        // Limpiar recursos anteriores
        dispatch(clearTransferenciaRecursos());
        await dispatch(fetchTransferenciaRecursosById(selectedTransferencia));
        setIsLoadingRecursos(false);
      }
    };
    loadRecursos();
  }, [selectedTransferencia, dispatch]);

  const handleCantidadChange = (recursoId: string, valor: number) => {
    setSelectedRecursos(prev => prev.map(recurso =>
      recurso.id === recursoId
        ? { ...recurso, cantidadModificada: valor }
        : recurso
    ));
  };

  const handleSave = () => {
    console.log('Recursos seleccionados:', selectedRecursos);
    onClose();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg w-[2000px] max-w-full min-w-full max-h-[90vh] overflow-hidden border border-indigo-100">
      {/* Header */}
      <div className="p-4 border-b border-indigo-100 bg-white">
        <h2 className="text-lg font-semibold text-indigo-700">Recepción de Transferencias</h2>
      </div>

      <div className="flex h-[calc(90vh-12rem)]">
        {/* Panel izquierdo - Lista de Transferencias */}
        <div className="w-1/3 border-r border-indigo-100 p-4 overflow-y-auto bg-white">
          {isLoadingDetalles ? (
            <div className="flex justify-center items-center h-full">
              <LoaderPage />
            </div>
          ) : (
            filteredTransferencias.map(transferencia => (
              <div
                key={transferencia.id}
                onClick={() => setSelectedTransferencia(transferencia.id)}
                className={`p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTransferencia === transferencia.id
                    ? 'bg-indigo-50 border-indigo-200 shadow'
                    : 'bg-white border border-gray-100 hover:shadow-md hover:border-indigo-100'
                }`}
              >
                <div className="text-sm font-medium text-indigo-700">{transferencia.referencia}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Usuario: {transferencia.transferencia_id.usuario_id.nombres}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Fecha: {new Date(transferencia.fecha).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel derecho - Recursos */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedTransferencia ? (
            isLoadingRecursos ? (
              <div className="flex justify-center items-center h-full">
                <LoaderPage />
              </div>
            ) : (
              <div className="overflow-auto p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad a Recibir</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {transferenciaRecursos.map(recurso => (
                      <tr key={recurso.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <IMG
                            src={recurso.recurso_id.imagenes?.[0]?.file || noImage}
                            alt={recurso.recurso_id.nombre}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{recurso.recurso_id.codigo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{recurso.recurso_id.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{recurso.cantidad}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={recurso.cantidad}
                            value={recurso.cantidadModificada || 0}
                            onChange={(e) => handleCantidadChange(recurso.id, parseInt(e.target.value))}
                            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="mt-2 text-sm">Selecciona una transferencia para ver sus recursos</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-100 flex justify-end space-x-3 bg-white">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors duration-200"
          disabled={!selectedTransferencia}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default NewRecepcionTransferencia;
