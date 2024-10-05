import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TableComponent from '../../components/Table/TableComponent';
import { useQuery, gql } from '@apollo/client';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FaCheck } from 'react-icons/fa';
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
};


const RequerimientosList: React.FC<MaterialRequestsProps> = ({ recursosList }) => {
  const { data: reqData, loading: reqLoading, error: reqError, refetch: refetchReq } = useQuery(GET_REQUERIMIENTOS);
  const { data: recData, loading: recLoading, error: recError, refetch: refetchRec } = useQuery(GET_REQUERIMIENTO_RECURSOS);

  const [requerimientos, setRequerimientos] = useState<Requerimiento[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalObrasOpen, setIsModalObrasOpen] = useState(false);
  const [isModalRequerimiento, setIsModalRequerimiento] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalObrasOpen(false)
    setIsModalRequerimiento(false)
  };

  useEffect(() => {
    if (reqData && reqData.listRequerimientos) {
      setRequerimientos(reqData.listRequerimientos);
      console.log(reqData.listRequerimientos)
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
    setIsModalRequerimiento(true)
  };

  const handleObrasView = () => {
    setIsModalObrasOpen(true)
  };

  const handleSelectRequerimiento = (id: string) => {
    setIsModalOpen(true);
    setSelectedRequerimiento(id);
    // Filtrar los recursos del requerimiento seleccionado
    const recursosDelRequerimiento = recursos.filter(r => r.requerimiento_id === id);

    // Buscar los nombres de los recursos y actualizar el estado
    const recursosConNombres = recursosDelRequerimiento.map(recurso => {
      const recursoEncontrado = recursosList.find(r => r.id === recurso.recurso_id);
      return {
        ...recurso,
        nombre: recursoEncontrado ? recursoEncontrado.nombre : 'Nombre no encontrado'
      };
    });

    // Actualizar el estado con los recursos que tienen nombres
    setRecursos(prevRecursos => {
      const recursosActualizados = prevRecursos.map(r =>
        r.requerimiento_id === id ? recursosConNombres.find(rn => rn.id === r.id) || r : r
      );
      return recursosActualizados;
    });
  };

  const filteredRecursos = recursos.filter(r => r.requerimiento_id === selectedRequerimiento);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e);
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
                  'Acciones': <button onClick={() => handleSelectRequerimiento(req.id)}>Ver Recursos</button>
                }))
              }}
            />
          </motion.div>
        </main>
        {isModalOpen && (
          <Modal title={'Crear Requerimiento'} isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className="bg-gradient-to-r from-slate-600 to-slate-800 p-4">
              <h2 className="text-xl font-bold text-white">Recursos</h2>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-auto">
                {selectedRequerimiento ? (
                  <div className="table w-full">
                    <div className="table-header-group bg-gray-100">
                      <div className="table-row">
                        <div className="table-cell p-2 font-semibold text-gray-700">Nombre</div>
                        <div className="table-cell p-2 font-semibold text-gray-700">Cantidad</div>
                        <div className="table-cell p-2 font-semibold text-gray-700">Aprobada</div>
                        <div className="table-cell p-2 font-semibold text-gray-700">Estado</div>
                        <div className="table-cell p-2 font-semibold text-gray-700">Tipo</div>
                      </div>
                    </div>
                    <div className="table-row-group">
                      {filteredRecursos.map((recurso, index) => (
                        <motion.div
                          key={recurso.id}
                          className={`${index%2===0 ? " bg-slate-200 ": "  "} table-row hover:bg-gray-300 transition-colors`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                        >
                          <div className="table-cell p-2 text-sm text-gray-800">{recurso.nombre || 'Cargando...'}</div>
                          <div className="table-cell p-2 text-sm">{recurso.cantidad}</div>
                          <form action="" className='flex items-center'>
                            <input
                              type="text"
                              name="nombre"
                              value={recurso.cantidad}
                              onChange={(e) => handleInputChange(e)}
                              placeholder="Nombre"
                              autoComplete="off"
                              className="px-1 md:px-2 border rounded text-xs mx-2 w-16"
                            />
                            <button className='text-green-500 rounded-full bg-green-50 p-1'>
                              <FaCheck />
                            </button>
                          </form>
                          <div className="table-cell p-2 text-sm">
                            <span className={`font-medium ${recurso.estado === 'Pendiente' ? 'text-yellow-600' : recurso.estado === 'Aprobado' ? 'text-green-600' : 'text-red-600'}`}>
                              {recurso.estado}
                            </span>
                          </div>
                          <div className="table-cell p-2 text-sm">{recurso.tipo_solicitud}</div>
                          <div className="table-cell p-2 text-sm">

                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      Selecciona un requerimiento<br />para ver sus recursos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
        {isModalObrasOpen && (
          <Modal title={'Todas Las Obras'} isOpen={isModalObrasOpen} onClose={handleCloseModal}>
            <ObrasPage />
          </Modal>
        )}{isModalRequerimiento && (
          <Modal title={'Crear Requerimiento'} isOpen={isModalRequerimiento} onClose={handleCloseModal}>
            <RequerimientoForm recursosList={recursosList} onClose={handleCloseModal}  />
          </Modal>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RequerimientosList;


