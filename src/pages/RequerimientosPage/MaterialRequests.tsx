import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TableComponent from '../../components/Table/TableComponent';
import { useQuery, gql } from '@apollo/client';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FaCheck } from 'react-icons/fa';

//const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI;

const GET_REQUERIMIENTOS = gql`
  query GetRequerimientoRecurso {
    listRequerimientos {
      id
      usuario_id
      presupuesto_id
      fecha_solicitud
      estado
      sustento
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
  usuario_id: string;
  presupuesto_id: string;
  fecha_solicitud: string;
  estado: string;
  sustento: string;
};



type Recurso = {
  id: string;
  requerimiento_id: string;
  recurso_id: string;
  cantidad: number;
  cantidad_aprobada: number;
  estado: string;
  tipo_solicitud: string;
  nombre?: string;
};

type MaterialRequestsProps = {
  recursosList: Recurso[];
};


const MaterialRequests: React.FC<MaterialRequestsProps> = ({ recursosList }) => {
  const { data: reqData, loading: reqLoading, error: reqError, refetch: refetchReq } = useQuery(GET_REQUERIMIENTOS);
  const { data: recData, loading: recLoading, error: recError, refetch: refetchRec } = useQuery(GET_REQUERIMIENTO_RECURSOS);

  const [requerimientos, setRequerimientos] = useState<Requerimiento[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<string | null>(null);

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

  const handleSelectRequerimiento = (id: string) => {
    setSelectedRequerimiento(id);
    // Filtrar los recursos del requerimiento seleccionado
    const recursosDelRequerimiento = recursos.filter(r => r.requerimiento_id === id);

    // Buscar los nombres de los recursos y actualizar el estado
    const recursosConNombres = recursosDelRequerimiento.map(recurso => {
      const recursoEncontrado = recursosList.find(r  => r.id === recurso.recurso_id);
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
        <motion.button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={handleRefresh}
        >
          Actualizar
        </motion.button>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-xl">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div className="flex-grow border rounded-lg overflow-hidden">
            <TableComponent
              tableData={{
                headers: ['Fecha Solicitud', 'Estado', 'Sustento', 'Acciones'],
                rows: requerimientos.map(req => ({
                  'ID': req.id,
                  'Usuario ID': req.usuario_id,
                  'Presupuesto ID': req.presupuesto_id,
                  'Fecha Solicitud': new Date(parseInt(req.fecha_solicitud)).toLocaleDateString(),
                  'Estado': req.estado,
                  'Sustento': req.sustento,
                  'Acciones': <button onClick={() => handleSelectRequerimiento(req.id)}>Ver Recursos</button>
                }))
              }}
            />
          </motion.div>
        </main>
        <aside className="w-96 flex flex-col bg-white shadow-lg  overflow-hidden h-full border border-gray-200">
          <div className="bg-gradient-to-r from-slate-600 to-slate-800 p-4">
            <h2 className="text-xl font-bold text-white">Recursos</h2>
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="h-full overflow-auto">
              {selectedRequerimiento ? (
                filteredRecursos.map((recurso, index) => (
                  <motion.div
                    key={recurso.id}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <h3 className="font-semibold text-sm text-gray-800 mb-2">{recurso.nombre || 'Cargando...'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Cantidad:</span>
                        <span className="font-medium">{recurso.cantidad}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Aprobada:</span>
                        <span className="font-medium">{recurso.cantidad_aprobada}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Estado:</span>
                        <span className={`font-medium ${recurso.estado === 'Pendiente' ? 'text-yellow-600' : recurso.estado === 'Aprobado' ? 'text-green-600' : 'text-red-600'}`}>
                          {recurso.estado}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Tipo:</span>
                        <span className="font-medium">{recurso.tipo_solicitud}</span>
                      </div>

                      <div className="grid grid-cols-3 content-between w-full">

                        <div><span>Aprobar:</span></div>
                        <form action="" className='grid grid-cols-2 gap-2 w-full'>

                        <input
                          type="text"
                          name="nombre"
                          value={recurso.cantidad}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="Nombre"
                          autoComplete="off"
                          className="px-1 md:px-2 border rounded text-[8px] md:text-xs mx-10 w-10"
                        />
                        <button className='text-green-500 rounded-full bg-green-50 p-1 mx-20'>
                          <FaCheck />
                        </button>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    Selecciona un requerimiento<br />para ver sus recursos
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
};

export default MaterialRequests;