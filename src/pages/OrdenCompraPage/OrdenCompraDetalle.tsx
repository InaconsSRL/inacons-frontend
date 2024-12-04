import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrdenCompraRecursosByOrdenId } from '../../slices/ordenCompraRecursosSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import PDFGenerator from './PDFGenerator';


interface OrdenCompraDetalleProps {
  ordenCompra: {
    id: string;
    codigo_orden: string;
    descripcion: string;
    fecha_ini: string;
    fecha_fin: string;
  };
}

const OrdenCompraDetalle: React.FC<OrdenCompraDetalleProps> = ({ ordenCompra }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ordenCompraRecursosByOrdenId, loading } = useSelector(
    (state: RootState) => state.ordenCompraRecursos
  );
  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    dispatch(fetchOrdenCompraRecursosByOrdenId(ordenCompra.id));
  }, [dispatch, ordenCompra.id]);

  const formatCurrency = (value: number) => `S/ ${value.toFixed(2)}`;

  if (loading) return <LoaderPage />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto shadow-md rounded-lg mt-4"
    >
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Orden de Compra: {ordenCompra.codigo_orden}
          </h3>
          <button
            onClick={() => setShowPDF(!showPDF)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showPDF ? 'Ver Tabla' : 'Ver PDF'}
          </button>
        </div>

        {showPDF ? (
          <PDFGenerator
            ordenCompra={ordenCompra}
            recursos={ordenCompraRecursosByOrdenId}
            unidades={unidades}
          />
        ) : (
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="text-xs">
                <th className="border p-2">Código</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Unidad</th>
                <th className="border p-2 text-right">Cantidad</th>
                <th className="border p-2 text-right">Costo Real</th>
                <th className="border p-2 text-right">Costo Aprox.</th>
                <th className="border p-2">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ordenCompraRecursosByOrdenId.map((recurso) => (
                <tr key={recurso.id} className="hover:bg-gray-50">
                  <td className="border p-2">{recurso.id_recurso.codigo}</td>
                  <td className="border p-2">{recurso.id_recurso.nombre}</td>
                  <td className="border p-2">
                    {unidades.find(u => u.id === recurso.id_recurso.unidad_id)?.nombre || 'N/A'}
                  </td>
                  <td className="border p-2 text-right">{recurso.cantidad}</td>
                  <td className="border p-2 text-right">{formatCurrency(recurso.costo_real)}</td>
                  <td className="border p-2 text-right">{formatCurrency(recurso.costo_aproximado)}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recurso.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                      recurso.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {recurso.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold text-xs">
              <tr>
                <td colSpan={4} className="border p-2 text-right">Totales:</td>
                <td className="border p-2 text-right">
                  {formatCurrency(
                    ordenCompraRecursosByOrdenId.reduce((sum, item) => sum + item.costo_real * item.cantidad, 0)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {formatCurrency(
                    ordenCompraRecursosByOrdenId.reduce((sum, item) => sum + item.costo_aproximado * item.cantidad, 0)
                  )}
                </td>
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default OrdenCompraDetalle;