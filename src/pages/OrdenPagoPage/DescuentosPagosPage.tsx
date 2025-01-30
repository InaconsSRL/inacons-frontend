import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
//import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import DescuentoPagoFormComponent from './DescuentoPagoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { addDescuento, updateDescuento, deleteDescuento , fetchDescuentosByOrdenPago, OrdenPagoDescuento} from '../../slices/descuentoPagoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Toast from '../../components/Toast/Toast';
import { calcularDescuento } from '../../components/Utils/calculosUtils';

//type TipoDescuento = 'detracciones' | 'retenciones';

interface DescuentoPagosPageProps {
  ordenPagoId?: string;
  tipoDescuento?: 'detracciones' | 'retenciones' | null;
  handleClose: () => void; 
  montoSolicitado?: number;
  tipoMoneda?: string;
  tipoComprobante?: string;
}


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

const DescuentoPagosPage: React.FC<DescuentoPagosPageProps> = ({
  ordenPagoId,
  tipoDescuento,
  montoSolicitado = 0,
  tipoMoneda = '',
  tipoComprobante = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDescuento, setEditingDescuento] = useState<OrdenPagoDescuento | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { descuentos, loading, error } = useSelector((state: RootState) => state.descuentoPago);
   const userId = useSelector((state: RootState) => state.user.id);

  // Nuevos estados
  const [selectedTipoDescuento, setSelectedTipoDescuento] = useState('');
  const [porcentaje, setPorcentaje] = useState(0);
  const [montoIngresado, setMontoIngresado] = useState(0);
  const [montoCalculado, setMontoCalculado] = useState(0);
  const [detalleDescuento, setDetalleDescuento] = useState('');
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'warning' | 'info'>('info');

  // Calcular monto cuando cambian porcentaje o monto ingresado
  useEffect(() => {
    if (!selectedTipoDescuento || montoIngresado < 0 || porcentaje < 0) {
      setMontoCalculado(0);
      return;
    }

    const resultado = calcularDescuento(
      selectedTipoDescuento,
      montoIngresado,
      selectedTipoDescuento === 'retencion' ? 3 : porcentaje // 3% fijo para retención
    );
    
    setMontoCalculado(resultado);
  }, [selectedTipoDescuento, porcentaje, montoIngresado]);

  useEffect(() => {
    if(ordenPagoId) {
      dispatch(fetchDescuentosByOrdenPago(ordenPagoId));
    }
  }, [dispatch, ordenPagoId]);

    
  const handleEdit = (descuento: OrdenPagoDescuento) => {
    setEditingDescuento({
      id: descuento.id,
    codigo: descuento.codigo,
    tipo: descuento.tipo,
    monto: descuento.monto,
    detalle: descuento.detalle,
    estado: descuento.estado,
    usuario_id: descuento.usuario_id,
    orden_pago_id: {
      id: descuento.orden_pago_id.id,
      codigo: descuento.orden_pago_id.codigo,
      monto_solicitado: descuento.orden_pago_id.monto_solicitado,
      tipo_moneda: descuento.orden_pago_id.tipo_moneda,
      tipo_pago: descuento.orden_pago_id.tipo_pago,
      estado: descuento.orden_pago_id.estado,
      observaciones: descuento.orden_pago_id.observaciones,
      comprobante: descuento.orden_pago_id.comprobante,
      fecha: descuento.orden_pago_id.fecha
      }
    });
    setIsModalOpen(true);
  };
    

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este descuento?')) {
      try {
        await dispatch(deleteDescuento(id));
        // Refrescar los descuentos después de eliminar
        if (ordenPagoId) {
          dispatch(fetchDescuentosByOrdenPago(ordenPagoId));
        }
        
      } catch (error) {
        console.error('Error al eliminar el descuento:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDescuento(null);
  };

  const handleAgregar = async () => {
    try {
      // Validaciones
      if (!selectedTipoDescuento || !montoCalculado || !detalleDescuento) {
        setToastMessage('Por favor complete todos los campos requeridos');
        setToastVariant('warning');
        setShowToast(true);
        return;
      }

      if (!ordenPagoId || !userId) {
        setToastMessage('Error: Faltan datos necesarios para crear el descuento');
        setToastVariant('danger');
        setShowToast(true);
        return;
      }

      const nuevoDescuento = {
        orden_pago_id: ordenPagoId,    // ID de la orden de pago
        monto: montoCalculado,         // Monto calculado según el tipo
        tipo: selectedTipoDescuento,   // Tipo de descuento
        detalle: detalleDescuento,     // Detalle ingresado
        usuario_id: userId             // ID del usuario actual
      };

      await dispatch(addDescuento(nuevoDescuento));
      
      // Mostrar mensaje de éxito
      setToastMessage('Descuento agregado exitosamente');
      setToastVariant('success');
      setShowToast(true);
      
      // Limpiar formulario
      setSelectedTipoDescuento('');
      setPorcentaje(0);
      setMontoIngresado(0);
      setMontoCalculado(0);
      setDetalleDescuento('');
      
      // Recargar datos
      if (ordenPagoId) {
        dispatch(fetchDescuentosByOrdenPago(ordenPagoId));
      }
    } catch (error: any) {
      console.error('Error al crear descuento:', error);
      setToastMessage(`Error al crear el descuento: ${error.message}`);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleSubmit = async (values: Partial<OrdenPagoDescuento>) => {
    try {
      if (!userId) {
        setToastMessage('Error: No hay información de usuario disponible');
        setToastVariant('danger');
        setShowToast(true);
        return;
      }

      if (editingDescuento) {
        // Actualizar descuento existente
        await dispatch(updateDescuento({
          id: editingDescuento.id,
          orden_pago_id: ordenPagoId || '',
          monto: values.monto || 0,
          tipo: values.tipo || '',
          detalle: values.detalle || '',
          usuario_id: userId
        }));
        
        setToastMessage('Descuento actualizado exitosamente');
        setToastVariant('success');
        setShowToast(true);
        
        // Cerrar modal y limpiar estado
        handleCloseModal();
        
        // Recargar datos
        if (ordenPagoId) {
          dispatch(fetchDescuentosByOrdenPago(ordenPagoId));
        }
      }
    } catch (error: any) {
      console.error('Error al actualizar descuento:', error);
      setToastMessage(`Error: ${error.message}`);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  // Agregar la función handleTipoDescuentoChange
  const handleTipoDescuentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    setSelectedTipoDescuento(tipo);
    
    // Ajustar el porcentaje según el tipo seleccionado
    switch (tipo) {
      case 'retencion':
        setPorcentaje(3); // Porcentaje fijo para retención
        break;
      case 'detraccion':
        setPorcentaje(12); // Porcentaje por defecto para detracción
        break;
      case 'pendiente':
        setPorcentaje(100); // Para que muestre el mismo monto
        break;
      default:
        setPorcentaje(0);
        break;
    }

    // Recalcular el monto si hay un monto ingresado
    if (montoIngresado > 0) {
      const resultado = calcularDescuento(tipo, montoIngresado, tipo === 'retencion' ? 3 : porcentaje);
      setMontoCalculado(resultado);
    }
  };

// Vamos a corregir tableData basándonos en la estructura que sí funciona
const tableData = {
  headers: [
    "Código",
    "Monto",
    "Tipo",
    "Detalle",
    "Usuario",
    "Opciones"
  ],
  rows: descuentos.map(descuento => {
    console.log('Procesando descuento para tabla:', descuento); // Para debug
    return {
      "Código": descuento.codigo,
     "Monto": `${descuento.monto.toFixed(2)} ${descuento.orden_pago_id?.tipo_moneda || 'Soles'}`,
      "Tipo": descuento.tipo,
      "Detalle": descuento.detalle,
      "Usuario": `${descuento.usuario_id?.nombres || ''} ${descuento.usuario_id?.apellidos || ''}`.trim(),
      "Opciones": (
        <div className="flex space-x-2 justify-center">
          <button
            className='text-black hover:text-blue-600 transition-colors'
            onClick={() => handleEdit(descuento)}
          >
            <FiEdit size={18} className='text-blue-500' />
          </button>
          <button
            className='text-black hover:text-red-600 transition-colors'
            onClick={() => handleDelete(descuento.id)}
          >
            <FiTrash2 size={18} className='text-red-500' />
          </button>
        </div>
      )
    };
  })
};

    
  if (loading) return <LoaderPage />;
  if (error) return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="text-red-500 p-4" >
      Error: {error}
    </motion.div>
  );

// Modificar el título según el contexto
 

  // Agregar cálculo del monto total de descuentos
  const montoTotalDescuentos = descuentos.reduce((total, descuento) => total + descuento.monto, 0);
  const montoPagar = montoSolicitado - montoTotalDescuentos;
    
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

      <motion.div
        className="text-white pb-4 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div id="datos" className="bg-white/90 rounded-lg p-4 shadow-sm w-full">
          <div className="flex justify-between items-center gap-8 text-gray-700">
            <div className="flex items-center gap-8">
              <div>
                <span className="text-sm font-medium">Monto solicitado:</span>
                <span className="text-lg font-semibold ml-2">
                  {montoSolicitado.toFixed(2)} {tipoMoneda}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium">Monto a pagar:</span>
                <span className="text-lg font-semibold text-green-600 ml-2">
                  {montoPagar.toFixed(2)} {tipoMoneda}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Tipo comprobante:</span>
              <span className="ml-2 text-gray-600 capitalize">
                {tipoComprobante}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div
            className="flex-grow border rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div id="formulario" className="h-full overflow-auto">
                  <div className="flex flex-row gap-4 items-start p-4">
    {/* Select para tipo de descuento */}
		<div className="flex-1 min-w-[200px]">
		  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
		    Tipo de Descuento
		  </label>
		  <select 
		    id="tipo" 
		    value={selectedTipoDescuento}
            onChange={handleTipoDescuentoChange}
		    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
		  >
		    <option value="">Seleccione</option>
		    <option value="detraccion">Detracción</option>
		    <option value="retencion">Retención (3%)</option>
		    <option value="pendiente">Pendientes</option>
		  </select>
		</div>

		{/* Div con inputs numéricos */}
		<div className="flex-1 min-w-[300px]">
		  <div className="space-y-4">
		    {/* Contenedor para los inputs lado a lado */}
		    <div className="flex gap-4">
		      <div className="flex-1">
			<label htmlFor="porcentaje" className="block text-sm font-medium text-gray-700 mb-1">
			  Porcentaje de cálculo 
			</label>
			<input 
			  type="number"
			  id="porcentaje"
			  value={porcentaje}
              onChange={(e) => setPorcentaje(Number(e.target.value))}
			  disabled={selectedTipoDescuento === 'retencion'} // Deshabilitar para retención
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                ${selectedTipoDescuento === 'retencion' ? 'bg-gray-100' : ''}
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
			  min="0"
			  step="0.01"
			/>
		      </div>
		      <div className="flex-1">
			<label htmlFor="montoIngresado" className="block text-sm font-medium text-gray-700 mb-1">
			 Ingrese Monto 
			</label>
			<input 
			  type="number"
			  id="montoIngresado"
			  value={montoIngresado}
              onChange={(e) => setMontoIngresado(Number(e.target.value))}
			  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
			  min="0"
			  step="0.01"
			/>
		      </div>
		    </div>
		    {/* Input debajo */}
		    <div>
		      <label htmlFor="montoCalculado" className="block text-sm font-medium text-gray-700 mb-1">
			 Monto calculado 
		      </label>
		      <input 
			type="number"
			id="montoCalculado"
			value={montoCalculado}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
			min="0"
			step="0.01"
		      />
		    </div>
		  </div>
		</div>

		{/* Textarea */}
		<div className="flex-1 min-w-[300px]">
		  <label htmlFor="detalle" className="block text-sm font-medium text-gray-700 mb-1">
		    Detalle del descuento 
		  </label>
		  <textarea 
		    id="detalle"
		    value={detalleDescuento}
            onChange={(e) => setDetalleDescuento(e.target.value)}
		    rows={4}
		    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
		  />
		</div>

		{/* Botón Agregar */}
		<div className="flex items-end pb-1 mt-14">
		  <button
		    onClick={handleAgregar}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
		  >
		    Agregar
		  </button>
		</div>
	      </div>
	   </div>
          </motion.div>
        </main>
      </motion.div>

	  
      <motion.div
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
          <motion.div
            className="flex-grow border rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="h-full overflow-auto">
              {descuentos.length === 0 ? (
                <div className="flex justify-center items-center h-full p-8">
                  <p className="text-gray-500 text-lg">No hay descuentos registrados</p>
                </div>
              ) : (
                <TableComponent tableData={tableData} />
              )}
            </div>
          </motion.div>
        </main>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal 
            title={editingDescuento ? 'Actualizar Descuento' : 'Crear Descuento'} 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
                  <DescuentoPagoFormComponent
                    initialValues={editingDescuento || undefined}
                    onSubmit={handleSubmit}
                    ordenPagoId={ordenPagoId}
                    tipoDescuento={tipoDescuento}
                  />


            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DescuentoPagosPage;
