import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { RecursoObra, SelectedRecurso } from './components/bodega.types';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
import { RecursosList } from './components/RecursosList';
import { SelectedRecursos } from './components/SelectedRecursos';
import { FiSearch } from 'react-icons/fi';
import { addPrestamo } from '../../../slices/prestamoSlice';
import { addPrestamoRecurso } from '../../../slices/prestamoRecursoSlice';
import { PrestamoModal } from './components/PrestamoModal';
import { updateObraBodegaRecurso } from '../../../slices/obraBodegaRecursoSlice';
// import { addConsumo } from '../../../slices/consumoSlice';
// import { addConsumoRecurso } from '../../../slices/consumoRecursoSlice';


interface Props {
  obraId: string;
  recursos: RecursoObra[];
  onClose: () => void;
  loading?: boolean; // Agregamos la nueva prop
}

const SalidasConsumosPrestamos: React.FC<Props> = ({ obraId, recursos, onClose, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecursos, setSelectedRecursos] = useState<Record<string, SelectedRecurso>>({});
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(0);
  const [showPrestamoModal, setShowPrestamoModal] = useState(false);
  const [recursosRetornables, setRecursosRetornables] = useState<SelectedRecurso[]>([]);

  // Filtrar todos los recursos primero
  const filteredRecursos = useMemo(() => {
    return recursos.filter(recurso =>
      recurso.recurso_id.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.recurso_id.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recursos, searchTerm]);

  const totalPages = Math.ceil(filteredRecursos.length / PER_PAGE);

  // Obtener solo los recursos de la página actual
  const displayedRecursos = filteredRecursos.slice(
    currentPage * PER_PAGE,
    (currentPage + 1) * PER_PAGE
  );

  // Reset página cuando cambia la búsqueda
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

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

      // Separar recursos retornables
      const retornables = Object.values(selectedRecursos).filter(
        ({recurso}) => recurso.recurso_id.tipo_recurso_id === "66e2075541a2c058b6fe80c4"
      );

      if (retornables.length > 0) {
        setRecursosRetornables(retornables);
        setShowPrestamoModal(true);
        return;
      }

      await procesarTransferencia();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar');
    } finally {
      setIsProcessing(false);
    }
  };

  const procesarTransferencia = async () => {
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

      // Después de crear la transferencia y sus detalles, actualizar cantidades en bodega
      for (const { recurso, cantidad } of Object.values(selectedRecursos)) {
        await dispatch(updateObraBodegaRecurso({
          updateObraBodegaRecursoId: recurso.id,
          obraBodegaId: recurso.obra_bodega_id.id,
          recursoId: recurso.recurso_id.id,
          cantidad: recurso.cantidad - cantidad, // Restamos la cantidad saliente
          costo: recurso.costo,
          estado: recurso.estado
        })).unwrap();
      }

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la salida');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrestamoConfirm = async (prestamoData: { empleadoId: string; fRetorno: Date }) => {
    try {
      setIsProcessing(true);

      // Primero creamos la transferencia
      const transferenciaData = {
        usuario_id: userId!,
        fecha: new Date(),
        movimiento_id: "6765ed96444c04c94802b3e1",
        movilidad_id: "6765ecf0444c04c94802b3df",
        estado: 'COMPLETO' as const,
        descripcion: `Préstamo de recursos - Obra ${obraId}`
      };

      const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

      // Luego creamos el detalle de transferencia
      const detalleData = {
        transferencia_id: transferencia.id,
        referencia_id: obraId,
        fecha: new Date(),
        tipo: 'SALIDA_PRESTAMO',
        referencia: `Préstamo de recursos - Obra ${obraId}`
      };

      const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

      // Ahora sí creamos el préstamo con el ID del detalle de transferencia
      const prestamo = await dispatch(addPrestamo({
        fecha: new Date(),
        usuarioId: userId!,
        obraId: obraId,
        personalId: prestamoData.empleadoId,
        fRetorno: prestamoData.fRetorno,
        estado: 'ACTIVO',
        transferenciaDetalleId: detalleTransferencia.id
      })).unwrap();

      // Crear PrestamoRecurso para cada recurso retornable
      for (const { recurso, cantidad } of recursosRetornables) {
        await dispatch(addPrestamoRecurso({
          prestamoId: prestamo.id,
          obrabodegaRecursoId: recurso.id,
          cantidad: cantidad
        })).unwrap();

        // También creamos el registro de transferencia recurso
        await dispatch(addTransferenciaRecurso({
          transferencia_detalle_id: detalleTransferencia.id,
          recurso_id: recurso.recurso_id.id,
          cantidad: cantidad,
          costo: recurso.costo,
        })).unwrap();

        // Actualizar cantidades en bodega para recursos retornables
        await dispatch(updateObraBodegaRecurso({
          updateObraBodegaRecursoId: recurso.id,
          obraBodegaId: recurso.obra_bodega_id.id,
          recursoId: recurso.recurso_id.id,
          cantidad: recurso.cantidad - cantidad, // Restamos la cantidad prestada
          costo: recurso.costo,
          estado: recurso.estado
        })).unwrap();
      }

      // Procesar la transferencia para los recursos no retornables
      const recursosNoRetornables = { ...selectedRecursos };
      recursosRetornables.forEach(({ recurso }) => {
        delete recursosNoRetornables[recurso.id];
      });

      setSelectedRecursos(recursosNoRetornables);
      setShowPrestamoModal(false);

      if (Object.keys(recursosNoRetornables).length > 0) {
        await procesarTransferencia();
      } else {
        onClose();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el préstamo');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-white rounded-lg">
        {/* Aquí puedes colocar tu componente de Skeleton o Loader */}
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-neutral-200 rounded-lg">
        <div>
          <div className="mb-4 sticky top-0 bg-white/80 p-4 shadow-md rounded-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <RecursosList 
            recursos={displayedRecursos}
            selectedRecursos={selectedRecursos}
            onAddRecurso={handleAddRecurso}
          />
          {filteredRecursos.length > PER_PAGE && (
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
      <PrestamoModal
        isOpen={showPrestamoModal}
        onClose={() => setShowPrestamoModal(false)}
        onConfirm={handlePrestamoConfirm}
        recursosRetornables={recursosRetornables}
      />
    </>
  );
};

export default SalidasConsumosPrestamos;