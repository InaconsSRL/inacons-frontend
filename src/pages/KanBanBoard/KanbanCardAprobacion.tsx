import React, { useState, useEffect } from 'react';
import { Task } from './types/kanban';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { getAprobacionByRequerimientoId } from '../../slices/requerimientoAprobacionSlice';
import AprobarRequerimiento from '../AprobacionRequerimientoPage/AprobacionRequerimiento';
import Modal from '../../components/Modal/Modal';

interface KanbanCardProps {
  task: Task;
}

const KanbanCardAprobacion: React.FC<KanbanCardProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalAprobacionReqSup, setModalAprobacionReqSup] = useState(false);
  const [requiresMyApproval, setRequiresMyApproval] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const { aprobaciones } = useSelector((state: RootState) => state.requerimientoAprobacion);

  console.log(user, aprobaciones)

  useEffect(() => {
    if (task.id) {
      dispatch(getAprobacionByRequerimientoId(task.id));
    }
  }, [dispatch, task.id]);

  useEffect(() => {
    // Aplanar el array si es necesario
    const aprobacionesList = Array.isArray(aprobaciones[0]) ? aprobaciones[0] : aprobaciones;
    
    console.log('ID del usuario actual:', user.id);
    console.log('Lista de aprobaciones:', aprobacionesList);

    const userHasPendingApproval = aprobacionesList.some(aprobacion => {
      console.log('Comparando:', {
        'usuario_id de aprobacion': aprobacion.usuario_id,
        'id del usuario actual': user.id,
        'son iguales?': aprobacion.usuario_id === user.id
      });
      return aprobacion.usuario_id === user.id;
    });

    console.log('¿Requiere mi aprobación?:', userHasPendingApproval);
    setRequiresMyApproval(userHasPendingApproval);

  }, [aprobaciones, user.id]);

  const handleModalOpen = () => {
    setModalAprobacionReqSup(true);
  };


  return (
    <div className={`${requiresMyApproval ? 'bg-green-500/75' : 'bg-white/75'} border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow`}>
      <h3 className="font-semibold text-base mb-2 text-neutral-800">{task.title}</h3>
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
          <div className="flex flex-col text-left text-[8px] text-gray-500">
            <p><span className="font-semibold">Código:</span> {task.projectCode}</p>
            <p><span className="font-semibold">Tipo:</span> {task.requestType}</p>
            <p><span className="font-semibold">Entrega:</span> {task.deliveryDate}</p>
          </div>
        </div>
        <div className='col-span-1 flex flex-col justify-around items-center'>
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-xs font-semibold text-white border-2 border-white"
                title={assignee || ''}
              >
                {assignee ? assignee.charAt(0) : ''}
              </div>
            ))}
          </div>
          <button
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
            onClick={handleModalOpen}
          >

            Ver
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalAprobacionReqSup}
        onClose={() => setModalAprobacionReqSup(false)}
        title="Aprobar Requerimiento"
      >
        <AprobarRequerimiento requerimiento={task} />
      </Modal>
    </div>
  );
};

export default KanbanCardAprobacion;