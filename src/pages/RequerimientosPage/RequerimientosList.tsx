import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TableComponent from '../../components/Table/TableComponent';
import { useQuery, gql } from '@apollo/client';

import LoaderPage from '../../components/Loader/LoaderPage';
import Modal from '../../components/Modal/Modal';
import ObrasPage from '../ObrasPage/ObrasPage';
import RequerimientoForm from './RequerimientoForm';

const GET_REQUERIMIENTOS = gql`
  query GetRequerimientoRecurso {
    listRequerimientos {
      id
      usuario_id
      usuario
      presupuesto_id
      fecha_solicitud
      estado
      sustento
      obra_id
      codigo
    }
  }
`;

const GET_REQUERIMIENTO_RECURSOS = gql`
  query ListRequerimientoRecursos {
    listRequerimientoRecursos {
      id
      requerimiento_id
      recurso_id
      cantidad
      cantidad_aprobada
      estado
      tipo_solicitud
    }
  }
`;

type Requerimiento = {
  id: string;
  obra_id: number;
  usuario: string;
  usuario_id: number;
  presupuesto_id: string;
  fecha_solicitud: string;
  estado: string;
  sustento: string;
  codigo: string;
};

type Recurso = {
  id: string;
  requerimiento_id: string;
  recurso_id: string;
  cantidad: number;
  cantidad_aprobada: number;
  estado: string;
  tipo_solicitud: string;
  nombre: string;
  codigo: string;
};

type MaterialRequestsProps = {
  recursosList: Recurso[];
  obras: [];
};

const RequerimientosList: React.FC<MaterialRequestsProps> = ({ recursosList, obras }) => {
  const { data: reqData, loading: reqLoading, error: reqError, refetch: refetchReq } = useQuery(GET_REQUERIMIENTOS);
  const { data: recData, loading: recLoading, error: recError, refetch: refetchRec } = useQuery(GET_REQUERIMIENTO_RECURSOS);

  const [requerimientos, setRequerimientos] = useState<Requerimiento[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<Requerimiento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalObrasOpen, setIsModalObrasOpen] = useState(false);
  const [isModalRequerimiento, setIsModalRequerimiento] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalObrasOpen(false);
    setIsModalRequerimiento(false);
    setSelectedRequerimiento(null);
  };

  useEffect(() => {
    if (reqData && reqData.listRequerimientos) {
      setRequerimientos(reqData.listRequerimientos);
    }
  }, [reqData]);

  useEffect(() => {
    if (recData && recData.listRequerimientoRecursos) {
      setRecursos(recData.listRequerimientoRecursos);
    }
  }, [recData]);

  if (reqLoading || recLoading) return <LoaderPage />;
  if (reqError) return <p>Error en requerimientos: {reqError.message}</p>;
  if (recError) return <p>Error en recursos: {recError.message}</p>;

  const handleRefresh = () => {
    refetchReq();
    refetchRec();
  };

  const handleRequerimientoView = () => {
    setIsModalRequerimiento(true);
  };

  const handleObrasView = () => {
    setIsModalObrasOpen(true);
  };

  const handleEditRequerimiento = (requerimiento: Requerimiento) => {
    const newRecursos = recursos.filter( recurso => recurso.requerimiento_id === requerimiento.id)
    const newRequerimiento = {...requerimiento, recursos: newRecursos}
    setSelectedRequerimiento(newRequerimiento);
    setIsModalOpen(true);
  };

  const handleRequerimientoSubmit = (updatedRequerimiento: Requerimiento) => {
    setRequerimientos(prevRequerimientos => 
      prevRequerimientos.map(req => 
        req.id === updatedRequerimiento.id ? updatedRequerimiento : req
      )
    );
    handleCloseModal();
    refetchReq();
  };

  return (
    <motion.div className="flex flex-col h-full">
      <motion.div className="bg-blue-600/0 text-white p-4 flex items-center justify-between">
        <motion.h1 className="text-2xl font-bold">
          Lista Requerimientos
        </motion.h1>
        <div className='blue space-x-4'> 
          <motion.button
            className="px-4 py-2 bg-blue-500 text-white-700 rounded hover:bg-blue-600 transition-colors"
            onClick={handleRequerimientoView}
          >
            Generar Requerimiento
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-blue-500 text-white-700 rounded hover:bg-blue-600 transition-colors"
            onClick={handleObrasView}
          >
            Editor de Obras
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-green-500 text-white-700 rounded hover:bg-green-600 transition-colors"
            onClick={handleRefresh}
          >
            Actualizar
          </motion.button>
        </div>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div className="flex-grow border rounded-lg overflow-hidden">
            <TableComponent
              tableData={{
                headers: ['Fecha Solicitud', 'Codigo', 'Obra', 'Usuario',  'Estado', 'Sustento', 'Acciones'],
                rows: requerimientos.map(req => ({
                  'ID': req.id,
                  'Usuario': req.usuario,
                  'Obra': req.codigo ? req.codigo.split("-")[1] : "-",
                  'Codigo': req.codigo ? req.codigo : "-",
                  'Presupuesto ID': req.presupuesto_id,
                  'Fecha Solicitud': new Date(req.fecha_solicitud).toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit' }),
                  'Estado': req.estado,
                  'Sustento': req.sustento,
                  'Acciones': <button onClick={() => handleEditRequerimiento(req)}>Editar Requerimiento</button>
                }))
              }}
            />
          </motion.div>
        </main>
        {isModalOpen && selectedRequerimiento && (
          <Modal title={'Editar Requerimiento'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <RequerimientoForm 
              obras = {obras}
              recursosList={recursosList} 
              onClose={handleCloseModal} 
              requerimiento={selectedRequerimiento}
              onSubmit={handleRequerimientoSubmit}
            />
          </Modal>
        )}
        {isModalObrasOpen && (
          <Modal title={'Todas Las Obras'} isOpen={isModalObrasOpen} onClose={handleCloseModal}>
            <ObrasPage />
          </Modal>
        )}
        {isModalRequerimiento && (
          <Modal title={'Crear Requerimiento'} isOpen={isModalRequerimiento} onClose={handleCloseModal}>
            <RequerimientoForm 
              obras = {obras}
              recursosList={recursosList} 
              onClose={handleCloseModal}
              onSubmit={(newRequerimiento) => {
                setRequerimientos(prev => [...prev, newRequerimiento]);
                handleCloseModal();
              }}
            />
          </Modal>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RequerimientosList;