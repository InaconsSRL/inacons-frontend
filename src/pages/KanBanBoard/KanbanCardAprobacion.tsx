import React, { useState } from 'react';
import { KanbanCardBaseProps } from './KanbanColumn';  // Importar el tipo base
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AprobarRequerimiento from '../AprobacionRequerimientoPage/AprobacionRequerimiento';
import Modal from '../../components/Modal/Modal';
import { formatFullTime } from '../../components/Utils/dateUtils';

// Usar el tipo base en lugar de definir uno nuevo
const KanbanCardAprobacion: React.FC<KanbanCardBaseProps> = ({ column }) => {
  const [modalAprobacionReqSup, setModalAprobacionReqSup] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const handleModalOpen = () => {
    setModalAprobacionReqSup(true);
  };
  const requerimiento = column.requerimiento;

  // Encontrar la aprobación del usuario actual
  const userAprobacion = requerimiento.aprobacion?.find(
    (aprobacion) => aprobacion.id_usuario === user.id
  );

  // Determinar si debe mostrar el fondo verde
  const shouldShowGreenBackground = () => {
    if (!userAprobacion) return false;

    if (userAprobacion.gerarquia === 3) {
      // Para gerarquía 3, solo mostrar verde en columna de supervisor
      return column.id === 'aprobacion_supervisor';
    } else if (userAprobacion.gerarquia === 4) {
      // Para gerarquía 4, mostrar verde en todas las columnas donde el usuario esté en aprobaciones
      return true;
    }
    return false;
  };

  const newRequerimiento = {
    ...requerimiento, user: {
      id: user.id || '',
      usuario: user.usuario || '',
      token: user.token || ''
    }
  }

  return (
    <div className={`${shouldShowGreenBackground() ? "bg-teal-300" : "bg-white/75"} border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow`}>
      <h3 className="font-semibold text-base mb-2 text-neutral-800">{requerimiento.codigo}</h3>
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          <p className="text-xs text-gray-600 mb-2">{requerimiento.sustento}</p>
          <div className="flex flex-col text-left text-[8px] text-gray-500">
            <p><span className="font-semibold">Código:</span> {requerimiento.codigo}</p>
            <p><span className="font-semibold">Estado:</span> {requerimiento.estado_atencion}</p>
            <p><span className="font-semibold">Entrega:</span> {formatFullTime(requerimiento.fecha_solicitud)}</p>
          </div>
        </div>
        <div className='col-span-1 flex flex-col justify-around items-center'>
          <div className="flex -space-x-1 overflow-hidden">
            {requerimiento.aprobacion?.map((aprueba, index) => (

              <div
                key={index}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[0.5rem] font-semibold text-white border-2 border-white"
                title={aprueba.nombres || ''}
                style={{ backgroundColor: `#${['F5A623', 'D0021B', 'ffbd33', '4A90E2', '50E3C2'][index % 5]}` }}
              >
                {aprueba ? aprueba.nombres.charAt(0) + aprueba.apellidos.charAt(0) : ''}
              </div>
            )) || []}
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
        <AprobarRequerimiento
          newRequerimiento={newRequerimiento}
          userAprobacion={userAprobacion}
          columnId={column.id}
        />
      </Modal>
    </div>
  );
};

export default KanbanCardAprobacion;