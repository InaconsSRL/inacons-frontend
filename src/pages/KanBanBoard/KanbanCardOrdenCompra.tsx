import React, { useState, useEffect } from 'react';
import { KanbanCardBaseProps } from './KanbanColumn';
import { useSelector, useDispatch} from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import Modal from '../../components/Modal/Modal';
import AprobacionTransferenciaPage from '../AprobacionTransferenciaPage/AprobacionTransferenciaPageLogistica';
import CompararProveedores from '../ComprasPage/CompararProveedores';
import { fetchCotizacionRecursoForCotizacionId } from '../../slices/cotizacionRecursoSlice';

const KanbanCardOrdenCompra: React.FC<KanbanCardBaseProps> = ({ column }) => {
  const [modalAprobacionReqSup, setModalAprobacionReqSup] = useState(false);
  const [recursos, setRecursos] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  
  const handleModalOpen = () => {
    setModalAprobacionReqSup(true);
  };

  const cotizacion = column.cotizacion;
  const cotizacionId = cotizacion.id;

  useEffect(() => {
    if (cotizacionId) {
      dispatch(fetchCotizacionRecursoForCotizacionId(cotizacionId))
        .unwrap()
        .then((response) => {
          setRecursos(response);
        })
        .catch((error) => {
          console.log(error);
        }
      );
    }
  }
  , [modalAprobacionReqSup, cotizacionId, dispatch]);
  console.log(recursos)

  return (
    // <div className={`${shouldShowGreenBackground() ? "bg-teal-300" : "bg-white/75"} border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow`}>
    <div className={`bg-white/75 border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow`}>
      {/* <h3 className="font-semibold text-base mb-2 text-neutral-800">{requerimiento.codigo}</h3> */}
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          {/* <p className="text-xs text-gray-600 mb-2">{requerimiento.sustento}</p> */}
          <div className="flex flex-col text-left text-[8px] text-gray-500">
            <p><span className="font-semibold">Código:</span> {cotizacion.codigo_cotizacion}</p>
            <p><span className="font-semibold">Tipo:</span> {cotizacion.estado}</p>
            {/* <p><span className="font-semibold">Entrega:</span> {new Date(requerimiento.fecha_solicitud).toLocaleDateString('es-ES')}</p> */}
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
        title="Sugerir Cantidades"
      >
        {cotizacion && (
          <CompararProveedores
            cotizacion={cotizacion}
            recursos={recursos ? recursos : []}
            onClose={() => setModalAprobacionReqSup(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default KanbanCardOrdenCompra;