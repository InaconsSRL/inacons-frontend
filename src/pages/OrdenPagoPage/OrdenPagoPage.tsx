import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import Toast from '../../components/Toast/Toast';
import TableComponent from '../../components/Table/TableComponent';
import DescuentoPagosPage from './DescuentosPagosPage';
import {useSearchParams} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { addOrdenPago, updateOrdenPago, deleteOrdenPago, fetchOrdenPagosByOrdenCompra } from '../../slices/ordenPagoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { TbEyeDiscount } from "react-icons/tb";
import { FiEdit, FiTrash2 } from 'react-icons/fi';

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

const OrdenPagoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ordenCompraId = searchParams.get('ordenCompraId');
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrdenPago, setEditingOrdenPago] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { ordenPagos, loading, error } = useSelector((state: RootState) => state.ordenPago);
  const { 
    ordenPagosByOrdenCompra, 
    loadingByOrdenCompra, 
    errorByOrdenCompra 
  } = useSelector((state: RootState) => state.ordenPago);

  const userId = useSelector((state: RootState) => state.user.id);
  const [moneda, setMoneda] = useState<string>('');
  const [tipoCambio, setTipoCambio] = useState(0);
  const [monto, setMonto] = useState(0);
  const [tipoComprobante, setTipoComprobante] = useState<string>('');
  const [tipoPago, setTipoPago] = useState<string>('');

  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'warning' | 'info'>('info');
    
  // Estados para el modal de descuentos
  const [isDescuentoModalOpen, setIsDescuentoModalOpen] = useState(false);
  const [selectedOrdenPago, setSelectedOrdenPago] = useState<any>(null);
  const [tipoDescuento, setTipoDescuento] = useState<'detracciones' | 'retenciones' | null>(null);

  // Función para abrir el modal de descuentos
  const handleOpenDescuentoModal = (ordenPago: any, tipo: 'detracciones' | 'retenciones') => {
    setSelectedOrdenPago(ordenPago);
    setTipoDescuento(tipo);
    setIsDescuentoModalOpen(true);
  };

  // Función para manejar el envío de datos
  const handleAgregar = async () => {
    try {
      if (!userId) {
        setToastMessage('Error: No hay información de usuario disponible');
        setToastVariant('danger');
        setShowToast(true);
        return;
      }

      if (!monto || !moneda || !tipoComprobante || !tipoPago) {
        setToastMessage('Por favor complete todos los campos');
        setToastVariant('warning');
        setShowToast(true);
        return;
      }

      const nuevaOrdenPago = {
        monto_solicitado: Number(monto),
        tipo_moneda: moneda,
        tipo_pago: tipoPago,
        orden_compra_id: ordenCompraId || '',
        estado: 'PENDIENTE',
        usuario_id: userId,
        comprobante: tipoComprobante
      };

      await dispatch(addOrdenPago(nuevaOrdenPago));
      
      setToastMessage('Orden de pago creada exitosamente');
      setToastVariant('success');
      setShowToast(true);
      
      // Limpiar formulario
      setMonto(0);
      setMoneda('');
      setTipoComprobante('');
      setTipoPago('');
      
      // Recargar datos
      if (ordenCompraId) {
        dispatch(fetchOrdenPagosByOrdenCompra(ordenCompraId));
      }
    } catch (error: any) {
      console.error('Error al crear orden de pago:', error);
      setToastMessage(`Error al crear la orden de pago: ${error.message}`);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  useEffect(() => {
    //dispatch(fetchOrdenPagos());
    if (ordenCompraId) {
      dispatch(fetchOrdenPagosByOrdenCompra(ordenCompraId));
    }
  }, [dispatch, ordenCompraId]);

  const handleEdit = (ordenPago: any) => {
    // Establecer los valores actuales en el estado
    setMonto(ordenPago.monto_solicitado);
    setMoneda(ordenPago.tipo_moneda);
    setTipoComprobante(ordenPago.comprobante);
    setTipoPago(ordenPago.tipo_pago);
    setEditingOrdenPago(ordenPago);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!editingOrdenPago) return;

      if (!monto || !moneda || !tipoComprobante || !tipoPago) {
        setToastMessage('Por favor complete todos los campos');
        setToastVariant('warning');
        setShowToast(true);
        return;
      }

      const updatedOrdenPago = {
        id: editingOrdenPago.id,
        monto_solicitado: Number(monto),
        tipo_moneda: moneda,
        tipo_pago: tipoPago,
        comprobante: tipoComprobante,
        estado: editingOrdenPago.estado,
        usuario_id: userId,
        orden_compra_id: ordenCompraId || ''
      };

      await dispatch(updateOrdenPago(updatedOrdenPago));
      
      setToastMessage('Orden de pago actualizada exitosamente');
      setToastVariant('success');
      setShowToast(true);
      
      // Limpiar formulario y cerrar modal
      setMonto(0);
      setMoneda('');
      setTipoComprobante('');
      setTipoPago('');
      setEditingOrdenPago(null);
      setIsModalOpen(false);
      
      // Recargar datos
      if (ordenCompraId) {
        dispatch(fetchOrdenPagosByOrdenCompra(ordenCompraId));
      }
    } catch (error: any) {
      console.error('Error al actualizar orden de pago:', error);
      setToastMessage(`Error al actualizar la orden de pago: ${error.message}`);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta orden de pago?')) {
      dispatch(deleteOrdenPago(id));
    }
  };

  if (loading) return <LoaderPage />;
  if (error) return <div>Error: {error}</div>;

  const tableData = {
    filter: [true, true, true, true, true, true, true, true, true],
    headers: [
      "código",
      "monto",
      "moneda",
      "tipo pago",
      "orden compra",
      "estado",
      "usuario",
      "descuentos",
      "opciones"
    ],
    rows: ordenPagosByOrdenCompra.map(ordenPago => ({
      código: ordenPago.codigo,
      monto: ordenPago.monto_solicitado,
      moneda: ordenPago.tipo_moneda,
      "tipo pago": ordenPago.tipo_pago,
      "orden compra": ordenPago.orden_compra.codigo_orden,
      estado: ordenPago.estado,
      usuario: ordenPago.usuario_id.nombres,
      descuentos: (
        <div className="flex space-x-2 justify-center">
          <button
            className="text-black hover:text-blue-600 transition-colors"
            onClick={() => handleOpenDescuentoModal(ordenPago, 'detracciones')}
            title="Detracciones"
          >
            <TbEyeDiscount size={18} className="text-green-500" />
          </button>
         
        </div>
      ),
      opciones: (
        <div className="flex space-x-2 justify-center">
          <button
            className="text-black"
            onClick={() => handleEdit(ordenPago)}
          >
            <FiEdit size={18} className="text-blue-500" />
          </button>
          <button
            className="text-black"
            onClick={() => handleDelete(ordenPago.id)}
          >
            <FiTrash2 size={18} className="text-red-500" />
          </button>
        </div>
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
      <motion.div className="fixed top-5 right-0 z-50">
        {showToast && (
          <Toast
            message={toastMessage}
            variant={toastVariant}
            position="top-right"
            duration={3000}
            onClose={() => setShowToast(false)}
            isVisible={showToast}
            index={0}
          />
        )}
      </motion.div>

      <motion.div className="text-white pb-4 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Órdenes de Pago</h1>
      </motion.div>

      <div className="bg-white/80 p-4 rounded-lg shadow-sm mb-4">
	<div className="flex flex-row gap-4 items-center">
	  <div className="flex-1 min-w-[200px]">
	  <label className="text-sm font-medium text-gray-700 mb-1">
	  Orden de Compra :
	    </label>
              <label className="text-sm font-medium text-gray-700 mb-1">
	  &nbsp; {ordenPagosByOrdenCompra[0]?.orden_compra?.codigo_orden || 'No disponible'}
	      </label>
	  </div>

	  <div className="flex-1 min-w-[200px]">
	    <label className="text-sm font-medium text-gray-700 mb-1">
	  Total :
              </label>
	        <label className="text-sm font-medium text-gray-700 mb-1">
	         &nbsp; {ordenPagosByOrdenCompra[0]?.monto_total 
                 ? ordenPagosByOrdenCompra[0].monto_total.toFixed(2)
                  : '0.00'
                 } 
              </label>
	  </div>

	  <div className="flex-1 min-w-[200px]">
	    <label className="text-sm font-medium text-gray-700 mb-1">
	  Proveedor :
	    </label>
               <label className="text-sm font-medium text-gray-700 mb-1">   
	        &nbsp; {ordenPagosByOrdenCompra[0]?.proveedor?.razon_social || 'No disponible'}
	      </label>
	  </div>

            <div className="flex-1 min-w-[100px]">
	      <Button 
               text='Ver recursos' 
	       color='azul' 
	       onClick={handleAgregar}
	       className="rounded w-[150px] bg-blue-500 hover:bg-blue-600 text-white"
	     />

	  </div>
	  	  
	</div>
      </div>
	  	  
      {/* Formulario */}
      <motion.div className="bg-white/80 p-4 rounded-lg shadow-sm mb-4">
        <div id="seleccionables" className="flex flex-row gap-4 items-center">
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input 
              type="number"
              id="monto"
              name="monto"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label htmlFor="moneda" className="block text-sm font-medium text-gray-700 mb-1">
              Moneda
            </label>
            <select 
              id="moneda" 
              name="moneda"
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">--Seleccione--</option>
              <option value="soles">Soles</option>
              <option value="dolares">Dólares</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label htmlFor="comprobante" className="block text-sm font-medium text-gray-700 mb-1">
              Comprobante
            </label>
            <select 
              id="comprobante" 
              name="comprobante"
              value={tipoComprobante}
              onChange={(e) => setTipoComprobante(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">--Seleccione--</option>
              <option value="factura">Factura</option>
              <option value="recibo">Recibo por honorarios</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Pago
            </label>
            <select 
              id="tipo" 
              name="tipo"
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">--Seleccione--</option>
              <option value="adelanto">Adelanto</option>
              <option value="contraentrega">Contra Entrega</option>
              <option value="credito">Crédito</option>
            </select>
          </div>
        </div>



     	  <div className="mt-5">

                  <label htmlFor="comprobante-file" className="block text-sm font-medium text-gray-700 mb-1">
	  Subir Comprobante (Factura /Boleta)
  </label>
  <div className="relative">
    <input
      type="file"
      id="comprobante-file"
      name="comprobante-file"
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-indigo-50 file:text-indigo-700
        hover:file:bg-indigo-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        border border-gray-300 rounded-md shadow-sm"
      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
    />
  </div>
          </div>	  
       
	  {moneda === 'dolares' && (
  <div className="calculo-dolares mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Tipo de Cambio
    </label>
    <div className="flex space-x-4 items-center">
      <div className="flex-1">
        <input 
          type="number"
          id="tipoCambio"
              name="tipoCambio"
	      value={tipoCambio}
	     onChange={(e) => setTipoCambio(Number(e.target.value))}
          min="0"
          step="0.01"
          placeholder="Tipo de cambio"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex-1">
        <input 
          type="number"
          id="resultadoSoles"
          name="resultadoSoles"
          disabled
          value={tipoCambio * monto} // Aquí va el cálculo
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
          placeholder="Resultado en soles"
        />
      </div>
     </div>
  </div>
)}

	  
        <div className="mt-5 flex justify-center">
          <Button 
            text={editingOrdenPago ? 'Actualizar' : 'Agregar'}
            color='azul' 
            onClick={editingOrdenPago ? handleUpdate : handleAgregar}
            className="rounded w-[400px] bg-blue-500 hover:bg-blue-600 text-white"
          />
        </div>
      </motion.div>

      {/* Tabla o mensaje de sin datos */}
      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          {ordenPagosByOrdenCompra.length === 0 ? (
            <div className="flex justify-center items-center p-8 bg-white/80 rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">Sin órdenes de Pago</p>
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
      {/* Modal para Descuentos */}
      <AnimatePresence>
        {isDescuentoModalOpen && selectedOrdenPago && (
          <Modal 
            title="Descuentos"  
            isOpen={isDescuentoModalOpen}
            onClose={() => setIsDescuentoModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <DescuentoPagosPage 
                ordenPagoId={selectedOrdenPago._id}
                tipoDescuento={tipoDescuento}
                onClose={() => setIsDescuentoModalOpen(false)}
                montoSolicitado={selectedOrdenPago.monto_solicitado}
                tipoMoneda={selectedOrdenPago.tipo_moneda}
                tipoComprobante={selectedOrdenPago.comprobante}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrdenPagoPage;
