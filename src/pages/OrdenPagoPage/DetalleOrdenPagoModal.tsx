import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { IOrdenPago } from '../../slices/ordenPagoSlice';
import { OrdenPagoDescuento } from '../../slices/descuentoPagoSlice';
//import { AprobacionOrdenPago } from '../../slices/aprobacionesOrdenPagoSlice';
import { fetchOrdenPagosByOrdenCompra } from '../../slices/ordenPagoSlice';
import { fetchDescuentosByOrdenPago } from '../../slices/descuentoPagoSlice';
import { addAprobacion } from '../../slices/aprobacionesOrdenPagoSlice';
import { FiEdit } from 'react-icons/fi';
//import TableComponent, { TableData, TableRow as TableRowType } from '../../components/Table/TableComponent';
import TableComponent from '../../components/Table/TableComponent';  // Importar solo el componente
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Buttons/Button';
import { motion } from 'framer-motion';

interface Proveedor {
  razon_social: string;
}

interface ExtendedOrdenPago extends Omit<IOrdenPago, 'orden_compra'> {
  proveedor?: Proveedor;
  orden_compra: {
    codigo_orden?: string;
    id?: string;
  };
}

// Función de mapeo para transformar los datos
const mapToExtendedOrdenPago = (data: any): ExtendedOrdenPago => {
  return {
    ...data,
    orden_compra: {
      codigo_orden: data.orden_compra?.codigo_orden || '',
      id: data.orden_compra?.id
    }
  };
};

interface DetalleOrdenPagoModalProps {
  ordenId: string;
  ordenCompraId: string;
  onClose: () => void;
}

const DetalleOrdenPagoModal: React.FC<DetalleOrdenPagoModalProps> = ({
  ordenId,
  ordenCompraId,
  onClose
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id);
  const [ordenPago, setOrdenPago] = useState<ExtendedOrdenPago | null>(null);
  const [descuentos, setDescuentos] = useState<OrdenPagoDescuento[]>([]);
 // const [aprobaciones, setAprobaciones] = useState<AprobacionOrdenPago[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordenPagoResult = await dispatch(fetchOrdenPagosByOrdenCompra(ordenCompraId)).unwrap();
        const ordenPagoEncontrada = ordenPagoResult.find((op) => op._id === ordenId);
        setOrdenPago(ordenPagoEncontrada ? mapToExtendedOrdenPago(ordenPagoEncontrada) : null);

        const descuentosResult = await dispatch(fetchDescuentosByOrdenPago(ordenId)).unwrap();
        setDescuentos(descuentosResult);
        // await dispatch(fetchAprobacionesByOrdenPago(ordenId)).unwrap();
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [dispatch, ordenId, ordenCompraId]);

  // Configuración de la tabla de descuentos
  const tableData = {  // Removemos el tipo TableData
    headers: [
      "Orden Pago",
      "Orden Descuento",
      "Monto",
      "Tipo",
      "Detalle",
      "Acciones"
    ],
    rows: descuentos.map(descuento => ({
      "Orden Pago": ordenPago?.codigo || '',
      "Orden Descuento": descuento.codigo,
      "Monto": descuento.monto.toFixed(2),
      "Tipo": descuento.tipo,
      "Detalle": descuento.detalle,
      "Acciones": (
        <button className="text-blue-600 hover:text-blue-800">
          <FiEdit size={18} />
        </button>
      )
    }))  // Removemos el type assertion
  };

  const handleAprobar = async () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAprobacion = async () => {
    if (!ordenPago) return;
    
    try {
      setIsSubmitting(true);
      await dispatch(addAprobacion({
        usuario_id: userId || '',
        estado: 'APROBADO',
        orden_pago_id: ordenPago._id,
        monto: ordenPago.monto_solicitado, // Agregamos el monto
        tipo_moneda: ordenPago.tipo_moneda // Agregamos el tipo de moneda
      })).unwrap();
      
      alert('Aprobación registrada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al registrar aprobación:', error);
      alert('Error al registrar la aprobación');
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (!ordenPago) return <div>Cargando...</div>;

  return (
    <Modal
      title="Detalle de Orden de Pago"
      isOpen={true}
      onClose={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Información de la Orden de Pago */}
          <div id="orden-pago" className="flex-1 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Código orden pago</span>
                <span className="text-lg font-semibold text-gray-900">{ordenPago.codigo}</span>
                {/* <span className="text-lg font-semibold text-gray-900">{ordenPago._id}</span> */}
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Código OC</span>
                <span className="text-lg text-gray-900">{ordenPago.orden_compra?.codigo_orden}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Moneda</span>
                  <span className="text-lg text-gray-900">{ordenPago.tipo_moneda}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Estado</span>
                  <span className={`text-lg font-medium ${
                    ordenPago.estado === 'PENDIENTE' ? 'text-yellow-600' :
                    ordenPago.estado === 'APROBADO' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {ordenPago.estado}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Proveedor</span>
                <span className="text-lg text-gray-900">{ordenPago.proveedor?.razon_social}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Tipo de Pago</span>
                  <span className="text-lg text-gray-900">{ordenPago.tipo_pago}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Comprobante</span>
                  <span className="text-lg text-gray-900">{ordenPago.comprobante}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Solicitante</span>
                <span className="text-lg text-gray-900">{ordenPago.usuario_id?.nombres}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Fecha de generación</span>
                <span className="text-lg text-gray-900">
                  {ordenPago.fecha 
                    ? new Date(ordenPago.fecha).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : '-'}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Observaciones</span>
                <span className="text-lg text-gray-900 break-words">
                  {ordenPago.observaciones || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabla de Descuentos */}
          <div id="descuentos" className="flex-1">
            <h3 className="text-xl font-semibold mb-3">Descuentos</h3>
            <div className="overflow-x-auto">
              {descuentos.length === 0 ? (
                <div className="flex justify-center items-center p-4">
                  <p className="text-gray-500">No hay descuentos registrados</p>
                </div>
              ) : (
                <>
                  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex flex-col items-center flex-1">
                        <span className="text-gray-600 text-sm font-medium mb-1">Monto Solicitado</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {ordenPago.monto_solicitado?.toFixed(2)} {' '}
                          {ordenPago.tipo_moneda} 
                        </span>
                      </div>
                      <div className="w-px h-12 bg-gray-200"></div>
                      <div className="flex flex-col items-center flex-1">
                        <span className="text-gray-600 text-sm font-medium mb-1">Monto a Pagar</span>
                        <span className="text-2xl font-bold text-green-600">
                          {descuentos
                            .reduce((total, descuento) => total + descuento.monto, 0)
                            .toFixed(2)} {' '}
                              {ordenPago.tipo_moneda} 
                        </span>
                      </div>
                    </div>
                  </div>
                  <TableComponent tableData={tableData} />
                </>
              )}
            </div>
          </div>
           
        </div>
         <div className="mt-6 flex justify-center w-full">
              <Button
                text="Aprobar"
                color="verde"
                onClick={handleAprobar}
                className="px-6 py-2 bg-green-600 w-60 text-white rounded hover:bg-green-700"
                disabled={isSubmitting}
              />
            </div>
      </motion.div>

      {/* robaciones" className="flex-1">
        <h3 className="text-xl font-semibold mb-3">Historial de Aprobaciones</h3>
        <div className="overflow-x-auto">
          {aprobaciones.length === 0 ? (
            <div className="flex justify-center items-center p-4">
              <p className="text-gray-500">Estado: PENDIENTE</p>
            </div>
          ) : (
            <TableComponent tableData={aprobacionesTableData} />
          )}
        </div>
      </div>
      */}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <Modal
          title="Confirmar Aprobación"
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
        >
          <div className="p-6">
            <p className="text-lg text-gray-700 mb-6">
              ¿Está seguro que desea aprobar esta orden de pago?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                text="No"
                color="rojo"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              />
              <Button
                text="Sí, Aprobar"
                color="verde"
                onClick={handleConfirmAprobacion}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              />
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default DetalleOrdenPagoModal;
