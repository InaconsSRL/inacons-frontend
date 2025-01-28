import React, { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { getPresupuestosByProyecto, deletePresupuesto } from '../../../slices/presupuestoSlice';
import { IPresupuesto } from '../../../types/PresupuestosTypes';
import Modal from '../../../components/Modal/Modal';
import FormularioPresupuesto from './FormularioPresupuesto';
import ModalAlert from '../../../components/Modal/ModalAlert';

interface ProjectBudgetsProps {
  id_proyecto: string;
}

const ListaPresupuestos: React.FC<ProjectBudgetsProps> = ({ id_proyecto }) => {
  const dispatch = useDispatch<AppDispatch>();
  const presupuestos = useSelector((state: RootState) => state.presupuesto.presupuestos);
  const loading = useSelector((state: RootState) => state.presupuesto.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<IPresupuesto | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [presupuestoToDelete, setPresupuestoToDelete] = useState<IPresupuesto | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchPresupuestos = async () => {
      if (id_proyecto) {
        // Verificamos si ya hicimos la petición para este proyecto
        const hasPresupuestosForProject = presupuestos.some(p => p.id_proyecto === id_proyecto);
        const isInitialLoad = !hasPresupuestosForProject && !loading;
        
        if (isInitialLoad) {
          await dispatch(getPresupuestosByProyecto(id_proyecto));
        }
      }
    };

    fetchPresupuestos();
  }, [id_proyecto]); // Solo dependerá del id_proyecto

  const handleEdit = (presupuesto: IPresupuesto) => {
    setSelectedBudget(presupuesto);
    setIsModalOpen(true);
  };

  const handleDelete = (presupuesto: IPresupuesto) => {
    setPresupuestoToDelete(presupuesto);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (presupuestoToDelete) {
      try {
        await dispatch(deletePresupuesto(presupuestoToDelete.id_presupuesto));
        // Refrescar la lista después de eliminar
        await dispatch(getPresupuestosByProyecto(id_proyecto));
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
      setShowDeleteAlert(false);
      setPresupuestoToDelete(null);
    }
  };

  const handleCreate = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(getPresupuestosByProyecto(id_proyecto));
    } catch (error) {
      console.error('Error al refrescar:', error);
    }
    setIsRefreshing(false);
  };

  // Filtrar los presupuestos para mostrar solo los del proyecto actual y ordenarlos
  const projectBudgets = presupuestos
    .filter(p => p.id_proyecto === id_proyecto)
    .sort((a, b) => (a.numeracion_presupuesto ?? 0) - (b.numeracion_presupuesto ?? 0));
  const total = projectBudgets.reduce((sum, presupuesto) => sum + (presupuesto.costo_directo || 0), 0);

  if (loading === true) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        <div className="animate-pulse">Cargando presupuestos...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-4 rounded-lg">
      {isModalOpen ? (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Presupuesto"
        >
          <FormularioPresupuesto
            cantidadPresupuestos={projectBudgets.length} 
            presupuesto={selectedBudget}
            id_proyecto={id_proyecto}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-200">Presupuestos del Proyecto</h3>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs 
                  ${isRefreshing ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'} 
                  text-white rounded-md transition-colors duration-200`}
                disabled={isRefreshing}
              >
                <svg
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"
                  />
                  <path
                    fill="currentColor"
                    d="M20 12h2A10 10 0 0012 2v2a8 8 0 018 8z"
                  />
                </svg>
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Nuevo</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-2 px-4 text-left font-medium text-gray-300">Código</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-300">Descripción</th>
                  <th className="py-2 px-4 text-right font-medium text-gray-300">Costo Directo</th>
                  <th className="py-2 px-4 text-right font-medium text-gray-300">Costo Oferta S/.</th>
                  <th className="py-2 px-4 text-right font-medium text-gray-300">Costo Base S/.</th>
                  <th className="py-2 px-4 text-center font-medium text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projectBudgets.map((presupuesto) => (
                  <tr
                    key={presupuesto.id_presupuesto}
                    className="bg-gray-900 hover:bg-gray-800 transition-colors duration-150"
                  >
                    <td className="py-2 px-4 text-gray-300">{presupuesto.numeracion_presupuesto}</td>
                    <td className="py-2 px-4 text-gray-300">{presupuesto.nombre_presupuesto}</td>
                    <td className="py-2 px-4 text-right text-gray-300">
                      {presupuesto.costo_directo?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-300">
                      {presupuesto.ppto_base?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-300">
                      {presupuesto.ppto_oferta?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleEdit(presupuesto)}
                        className="p-1.5 text-blue-500 hover:text-blue-200 rounded-full hover:bg-gray-700 transition-colors duration-200"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(presupuesto)}
                        className="p-1.5 text-red-500 hover:text-red-200 rounded-full hover:bg-gray-700 transition-colors duration-200"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-800 font-medium">
                  <td colSpan={3} className="py-2 px-4 text-right text-gray-300">Total:</td>
                  <td className="py-2 px-4 text-right text-gray-300">
                    {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      {showDeleteAlert && presupuestoToDelete &&
        <ModalAlert
          isOpen={showDeleteAlert}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de eliminar el presupuesto "${presupuestoToDelete?.nombre_presupuesto}"?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteAlert(false);
            setPresupuestoToDelete(null);
          }}
          variant="red"
        />
      }
    </div>
  );
};

export default ListaPresupuestos;