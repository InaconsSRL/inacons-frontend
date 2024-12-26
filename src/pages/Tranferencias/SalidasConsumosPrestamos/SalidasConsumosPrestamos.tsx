import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { RecursoObra, SelectedRecurso } from './components/bodega.types';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
import { RecursosList } from './components/RecursosList';
import { SelectedRecursos } from './components/SelectedRecursos';

interface Props {
  obraId: string;
  recursos: RecursoObra[];
  onClose: () => void;
  loading?: boolean; // Agregamos la nueva prop
}

const SalidasConsumosPrestamos: React.FC<Props> = ({ obraId, recursos, onClose, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRecursos, setSelectedRecursos] = useState<Record<string, SelectedRecurso>>({});
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(recursos.length / PER_PAGE);

  const userId = useSelector((state: RootState) => state.user?.id);

  const handleAddRecurso = (recurso: RecursoObra, cantidad: number) => {
    setSelectedRecursos(prev => ({
      ...prev,
      [recurso.id]: { cantidad, recurso }
    }));
  };

  const handleRemoveRecurso = (recursoId: string) => {
    const newSelected = { ...selectedRecursos };
    delete newSelected[recursoId];
    setSelectedRecursos(newSelected);
  };

  const handleUpdateCantidad = (recursoId: string, cantidad: number) => {
    if (selectedRecursos[recursoId]) {
      setSelectedRecursos(prev => ({
        ...prev,
        [recursoId]: { ...prev[recursoId], cantidad }
      }));
    }
  };

  const procesarSalida = async () => {
    try {
      setIsProcessing(true);
      if (!userId) throw new Error('Usuario no autenticado');

      const transferenciaData = {
        usuario_id: userId,
        fecha: new Date(),
        movimiento_id: "6765ed96444c04c94802b3e1",
        movilidad_id: "6765ecf0444c04c94802b3df",
        estado: 'COMPLETO' as const,
        descripcion: `Salida de recursos - Obra ${obraId}`
      };

      const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

      const detalleData = {
        transferencia_id: transferencia.id,
        referencia_id: obraId,
        fecha: new Date(),
        tipo: 'SALIDA_CONSUMO',
        referencia: `Salida de recursos - Obra ${obraId}`
      };

      const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

      const promesasRecursos = Object.values(selectedRecursos).map(({ recurso, cantidad }) => {
        return dispatch(addTransferenciaRecurso({
          transferencia_detalle_id: detalleTransferencia.id,
          recurso_id: recurso.recurso_id.id,
          cantidad: cantidad,
          costo: recurso.costo,
        })).unwrap();
      });

      await Promise.all(promesasRecursos);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la salida');
    } finally {
      setIsProcessing(false);
    }
  };

  const displayedRecursos = recursos.slice(
    currentPage * PER_PAGE,
    (currentPage + 1) * PER_PAGE
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-white rounded-lg">
        {/* Aquí puedes colocar tu componente de Skeleton o Loader */}
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-neutral-200 rounded-lg">
      <div>
      <RecursosList 
        recursos={displayedRecursos}
        selectedRecursos={selectedRecursos}
        onAddRecurso={handleAddRecurso}
      />
      {recursos.length > PER_PAGE && (
        <div className="flex items-center justify-start gap-4 mt-4 p-2">
          <button 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={currentPage === 0}
          >
        ← Anterior
          </button>
          <span className="text-sm text-gray-700">
        Página <span className="font-medium">{currentPage + 1}</span> de{" "}
        <span className="font-medium">{totalPages}</span>
          </span>
          <button
        onClick={() => setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : prev))}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={currentPage === totalPages - 1}
          >
        Siguiente →
          </button>
        </div>
      )}
      </div>
      <div className="lg:sticky lg:top-8">
      <SelectedRecursos
        selectedRecursos={selectedRecursos}
        onUpdateCantidad={handleUpdateCantidad}
        onRemoveRecurso={handleRemoveRecurso}
        onProcesar={procesarSalida}
        isProcessing={isProcessing}
        error={error}
      />
      </div>
    </div>
  );
};

export default SalidasConsumosPrestamos;