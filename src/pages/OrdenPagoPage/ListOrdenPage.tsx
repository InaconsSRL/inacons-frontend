import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TableComponent from '../../components/Table/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdenPagos } from '../../slices/ordenPagoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import DetalleOrdenPagoModal from './DetalleOrdenPagoModal';
import { FiEye } from 'react-icons/fi';
import { fetchAprobacionesByOrdenPago } from '../../slices/aprobacionesOrdenPagoSlice';
import AprobacionArchivoModal from './AprobacionArchivoModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const ListOrdenPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ordenPagos, loading, error } = useSelector((state: RootState) => state.ordenPago);
  const [selectedOrden, setSelectedOrden] = useState<{id: string, ordenCompraId: string} | null>(null);
  const [aprobacionesPorOrden, setAprobacionesPorOrden] = useState<{[key: string]: string}>({});
  const [selectedOrdenForAprobacion, setSelectedOrdenForAprobacion] = useState<{
    id: string,
    estado: string
  } | null>(null);

  useEffect(() => {
    dispatch(fetchOrdenPagos());
  }, [dispatch]);

  useEffect(() => {
    const cargarAprobaciones = async () => {
      const aprobaciones: {[key: string]: string} = {};
      
      for (const orden of ordenPagos) {
        try {
          const result = await dispatch(fetchAprobacionesByOrdenPago(orden.id)).unwrap();
          if (result && result.length > 0) {
            aprobaciones[orden.id] = result[result.length - 1].estado;
          } else {
            aprobaciones[orden.id] = 'PENDIENTE';
          }
        } catch (error) {
          console.error('Error al cargar aprobaciones:', error);
          aprobaciones[orden.id] = 'PENDIENTE';
        }
      }
      
      setAprobacionesPorOrden(aprobaciones);
    };

    if (ordenPagos.length > 0) {
      cargarAprobaciones();
    }
  }, [dispatch, ordenPagos]);

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const handleVerDetalle = (ordenId: string, ordenCompraId: string) => {
    setSelectedOrden({ id: ordenId, ordenCompraId });
  };

  const tableData = {
    filter: [true, true, true, true, true, true, true, true, false],
    headers: [
      "código",
      "monto",
      "moneda",
      "tipo pago",
      "orden compra",
      "estado",
      "usuario",
      "Aprobación",
      "Acciones"
    ],
    rows: ordenPagos.map(ordenPago => ({
      código: ordenPago.codigo,
      monto: ordenPago.monto_solicitado,
      moneda: ordenPago.tipo_moneda,
      "tipo pago": ordenPago.tipo_pago,
      "orden compra": ordenPago.orden_compra_id.codigo_orden,
      estado: (
        <button
          onClick={() => setSelectedOrdenForAprobacion({
            id: ordenPago.id,
            estado: ordenPago.estado
          })}
          className={`px-2 py-1 rounded-full text-sm font-semibold ${
            ordenPago.estado === 'APROBADO' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {ordenPago.estado}
        </button>
      ),
      usuario: `${ordenPago.usuario_id.nombres} ${ordenPago.usuario_id.apellidos}`,
      "Aprobación": (
        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
          aprobacionesPorOrden[ordenPago.id] === 'APROBADO' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {aprobacionesPorOrden[ordenPago.id] || 'PENDIENTE'}
        </span>
      ),
      "Acciones": (
        <button
          onClick={() => handleVerDetalle(ordenPago.id, ordenPago.orden_compra_id.id)}
          className="flex items-center justify-center text-blue-600 hover:text-blue-800"
        >
         <FiEye size={18} />
        </button>
      )
    }))
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div className="text-white pb-4 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Órdenes de Pago</h1>
      </motion.div>

      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          {ordenPagos.length === 0 ? (
            <div className="flex justify-center items-center p-8 bg-white/80 rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No hay órdenes de pago registradas</p>
            </div>
          ) : (
            <motion.div
              className="flex-grow border rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="h-full overflow-auto">
                <TableComponent tableData={tableData} />
              </div>
            </motion.div>
          )}
        </main>
      </motion.div>

      {selectedOrden && (
        <DetalleOrdenPagoModal
          ordenId={selectedOrden.id}
          ordenCompraId={selectedOrden.ordenCompraId}
          onClose={() => setSelectedOrden(null)}
        />
      )}

      {selectedOrdenForAprobacion && (
        <AprobacionArchivoModal
          isOpen={true}
          onClose={() => setSelectedOrdenForAprobacion(null)}
          ordenPagoId={selectedOrdenForAprobacion.id}
          currentEstado={selectedOrdenForAprobacion.estado}
        />
      )}
    </motion.div>
  );
};

export default ListOrdenPage;
