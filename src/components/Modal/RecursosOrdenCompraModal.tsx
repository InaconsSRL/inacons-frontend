import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrdenCompraRecursosByOrdenId } from '../../slices/ordenCompraRecursosSlice';
import Modal from './Modal';
import TableComponent from '../Table/TableComponent';
import LoaderPage from '../Loader/LoaderPage';

interface RecursosOrdenCompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordenCompraId: string;
}

const RecursosOrdenCompraModal: React.FC<RecursosOrdenCompraModalProps> = ({
  isOpen,
  onClose,
  ordenCompraId
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ordenCompraRecursosByOrdenId, loading, error } = useSelector(
    (state: RootState) => state.ordenCompraRecursos
  );

  useEffect(() => {
    if (isOpen && ordenCompraId) {
      dispatch(fetchOrdenCompraRecursosByOrdenId(ordenCompraId));
    }
  }, [dispatch, ordenCompraId, isOpen]);

  // Calcular la suma total del costo real
  const totalCostoReal = useMemo(() => {
    return ordenCompraRecursosByOrdenId.reduce((sum, recurso) => 
      sum + (recurso.costo_real || 0), 0
    );
  }, [ordenCompraRecursosByOrdenId]);

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filter: [true, true, true, true, true],
    headers: [
      "Recurso",
      "Código",
      "Cantidad",
      "Costo Aproximado",
      "Costo Real"
    ],
    rows: ordenCompraRecursosByOrdenId.map(recurso => ({
      "Recurso": recurso.id_recurso.nombre,
      "Código": recurso.id_recurso.codigo,
      "Cantidad": recurso.cantidad,
      "Costo Aproximado": recurso.costo_aproximado,
      "Costo Real": recurso.costo_real
    }))
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recursos de la Orden de Compra"
    >
      <div className="w-full max-h-[600px] overflow-auto">
        {ordenCompraRecursosByOrdenId.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <p className="text-gray-500 text-lg">No hay recursos disponibles</p>
          </div>
        ) : (
          <div>
            <TableComponent tableData={tableData} />
            <div className="mt-4 flex justify-end items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total Costo Real:</span>
              <input
                type="number"
                value={totalCostoReal.toFixed(2)}
                disabled
                readOnly
                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm w-40 text-right font-semibold text-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RecursosOrdenCompraModal;
