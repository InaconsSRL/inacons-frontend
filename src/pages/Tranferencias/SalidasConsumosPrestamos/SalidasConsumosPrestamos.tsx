import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { FiSearch } from 'react-icons/fi';
import { RecursosList } from './components/RecursosList';
import { SelectedRecursos } from './components/SelectedRecursos';
import { PrestamoModal } from './components/PrestamoModal';
import { addTransferencia } from '../../../slices/transferenciaSlice';
import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
import { addPrestamo } from '../../../slices/prestamoSlice';
import { addPrestamoRecurso } from '../../../slices/prestamoRecursoSlice';
import { updateObraBodegaRecurso } from '../../../slices/obraBodegaRecursoSlice';
import { addConsumo } from '../../../slices/consumoSlice';
import { addConsumoRecurso } from '../../../slices/consumoRecursoSlice';
import { RecursoObra, SelectedRecurso } from './components/bodega.types';
import Modal from '../../../components/Modal/Modal';


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
  const [recursosNoRetornables, setRecursosNoRetornables] = useState<SelectedRecurso[]>([]);

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
      [recurso.id]: { cantidad, recurso, observacion: '' }
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

  const handleUpdateObservaciones = (recursoId: string, observacion: string) => {
    setSelectedRecursos(prev => ({
      ...prev,
      [recursoId]: { ...prev[recursoId], observacion }
    }));
  };

  const procesarSalida = async () => {
    try {
      setIsProcessing(true);
      if (!userId) throw new Error('Usuario no autenticado');

      // Separar recursos retornables y no retornables, incluyendo observaciones
      const retornables = Object.values(selectedRecursos).filter(
        ({recurso}) => recurso.recurso_id.tipo_recurso_id === "66e2075541a2c058b6fe80c4"
      );

      const noRetornables = Object.values(selectedRecursos).filter(
        ({recurso}) => recurso.recurso_id.tipo_recurso_id !== "66e2075541a2c058b6fe80c4"
      );

      setRecursosRetornables(retornables);
      setRecursosNoRetornables(noRetornables);
      setShowPrestamoModal(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrestamoConfirm = async (prestamoData: { 
    empleadoId: string; 
    fRetorno: Date;
    responsableId: string; // Añadimos el nuevo campo
  }) => {
    try {
      setIsProcessing(true);

      // 1. Crear transferencia principal
      const transferenciaData = {
        usuario_id: userId!,
        fecha: new Date(),
        movimiento_id: "6765ed96444c04c94802b3e1",
        movilidad_id: "6765ecf0444c04c94802b3df",
        estado: 'COMPLETO' as const,
        descripcion: `Préstamo y consumo de recursos - Obra ${obraId}`
      };
      const transferencia = await dispatch(addTransferencia(transferenciaData)).unwrap();

      // 2. Crear detalle de transferencia
      const detalleData = {
        transferencia_id: transferencia.id,
        referencia_id: obraId,
        fecha: new Date(),
        tipo: 'SALIDA_MIXTA',
        referencia: `Préstamo y consumo de recursos - Obra ${obraId}`
      };
      const detalleTransferencia = await dispatch(addTransferenciaDetalle(detalleData)).unwrap();

      // 3. Registrar todos los recursos en TransferenciaRecurso
      const allResources = [...recursosRetornables, ...recursosNoRetornables];
      await Promise.all(
        allResources.map(({ recurso, cantidad }) => 
          dispatch(addTransferenciaRecurso({
            transferencia_detalle_id: detalleTransferencia.id,
            recurso_id: recurso.recurso_id.id,
            cantidad: cantidad,
            costo: recurso.costo,
          })).unwrap()
        )
      );

      // 4. Crear préstamo y registrar recursos retornables
      if (recursosRetornables.length > 0) {
        const prestamo = await dispatch(addPrestamo({
          fecha: new Date(),
          obraId: obraId,
          usuarioId: userId!,
          personalId: prestamoData.empleadoId,
          responsableId: prestamoData.responsableId, // Usar el responsableId almacenado
          fRetorno: prestamoData.fRetorno,
          estado: 'ACTIVO',
          transferenciaDetalleId: detalleTransferencia.id
        })).unwrap();

        // Registrar recursos del préstamo
        await Promise.all(
          recursosRetornables.map(({ recurso, cantidad, observacion }) =>
            dispatch(addPrestamoRecurso({
              prestamoId: prestamo.id,
              obrabodegaRecursoId: recurso.id,
              cantidad: cantidad,
              observaciones: observacion // Usar la observación almacenada
            })).unwrap()
          )
        );
      }

      // 5. Crear consumo y registrar recursos no retornables
      if (recursosNoRetornables.length > 0) {
        const consumo = await dispatch(addConsumo({
          fecha: new Date(),
          almaceneroId: userId!,
          responsableId: prestamoData.responsableId, // Usamos el responsableId seleccionado
          obraId: obraId,
          personalId: prestamoData.empleadoId,
          estado: 'COMPLETO',
          transferenciaDetalleId: detalleTransferencia.id
        })).unwrap();

        // Registrar recursos del consumo
        await Promise.all(
          recursosNoRetornables.map(({ recurso, cantidad, observacion }) =>
            dispatch(addConsumoRecurso({
              consumo_id: consumo.id,
              recurso_id: recurso.recurso_id.id,
              cantidad: cantidad,
              costo: recurso.costo,
              obra_bodega_id: recurso.obra_bodega_id.id,
              observaciones: observacion // Añadir las observaciones también para consumos
            })).unwrap()
          )
        );
      }

      // 6. Actualizar cantidades en bodega para todos los recursos
      await Promise.all(
        allResources.map(({ recurso, cantidad }) =>
          dispatch(updateObraBodegaRecurso({
            updateObraBodegaRecursoId: recurso.id,
            obraBodegaId: recurso.obra_bodega_id.id,
            recursoId: recurso.recurso_id.id,
            cantidad: recurso.cantidad - cantidad,
            costo: recurso.costo,
            estado: recurso.estado
          })).unwrap()
        )
      );

      setShowPrestamoModal(false);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el préstamo y consumo');
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
            onUpdateObservaciones={handleUpdateObservaciones} // Añadir esta prop
          />
        </div>
      </div>
      <Modal 
        isOpen={showPrestamoModal}
        onClose={() => setShowPrestamoModal(false)}
        title="Registrar Salida y Préstamo de Recursos"
      >
        <PrestamoModal
          isOpen={showPrestamoModal}
          onClose={() => setShowPrestamoModal(false)}
          onConfirm={handlePrestamoConfirm}
          recursosRetornables={recursosRetornables}
          recursosNoRetornables={recursosNoRetornables}
          obraId={obraId}
        />
      </Modal>
    </>
  );
};

export default SalidasConsumosPrestamos;