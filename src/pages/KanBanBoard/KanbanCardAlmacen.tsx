import React, { useState } from 'react';
import { KanbanCardBaseProps } from './KanbanColumn';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
import Modal from '../../components/Modal/Modal';
import AprobacionTransferenciaPageAlmacen from '../AprobacionTransferenciaPage/AprobacionTransferenciaPageAlmacen';
import { formatFullTime } from '../../components/Utils/dateUtils';

const KanbanCardAlmacen
: React.FC<KanbanCardBaseProps> = ({ column }) => {
  const [modalAprobacionReqSup, setModalAprobacionReqSup] = useState(false);
  // const user = useSelector((state: RootState) => state.user);
  
  const handleModalOpen = () => {
    setModalAprobacionReqSup(true);
  };
  const requerimiento = column.requerimiento;

  // Encontrar la aprobación del usuario actual
  // const userAprobacion = requerimiento.aprobacion?.find(
  //   (aprobacion) => aprobacion.id_usuario === user.id
  // );

  // // Determinar si debe mostrar el fondo verde
  // const shouldShowGreenBackground = () => {
  //   if (!userAprobacion) return false;

  //   if (userAprobacion.gerarquia === 3) {
  //     // Para gerarquía 3, solo mostrar verde en columna de supervisor
  //     return column.id === 'aprobacion_supervisor';
  //   } else if (userAprobacion.gerarquia === 4) {
  //     // Para gerarquía 4, mostrar verde en todas las columnas donde el usuario esté en aprobaciones
  //     return true;
  //   }
  //   return false;
  // };

  // const newRequerimiento = {
  //   ...requerimiento, user: {
  //     id: user.id || '',
  //     usuario: user.usuario || '',
  //     token: user.token || ''
  //   }
  // }

  return (
    // <div className={`${shouldShowGreenBackground() ? "bg-teal-300" : "bg-white/75"} border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow`}>
    <div className={`bg-white/75 border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow`}>
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
          {/* <div className="flex -space-x-2">
            {requerimiento.aprobacion?.map((aprueba, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-xs font-semibold text-white border-2 border-white"
                title={aprueba.cargo || ''}
              >
                {aprueba ? aprueba.cargo.charAt(0) : ''}
              </div>
            )) || []}
          </div> */}
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
        title="Aprobar Cantidades"
      >
        <AprobacionTransferenciaPageAlmacen
          column={column}
        />
      </Modal>
    </div>
  );
};

export default KanbanCardAlmacen
;