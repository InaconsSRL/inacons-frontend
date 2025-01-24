import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
//import DescuentoPagoFormComponent from './DescuentoPagoFormComponent';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDescuentos, addDescuento, updateDescuento, deleteDescuento } from '../../slices/descuentoPagoSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

type TipoDescuento = 'detracciones' | 'retenciones';
interface DescuentoPago {
  id: string;
  orden_pago_id: {
    id: string;
    codigo: string;
    monto_solicitado: number;
    tipo_moneda: string;
    tipo_pago: string;
    estado: string;
    observaciones: string;
    comprobante: string;
    fecha: string;
  };
  codigo: string;
  monto: number;
  tipo: string;
  detalle: string;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
    dni: string;
    usuario: string;
    contrasenna: string;
    rol_id: string;
  };
}

interface DescuentoPagosPageProps {
  ordenPagoId?: string;
  tipoDescuento?: 'detracciones' | 'retenciones' | null;
  onClose?: () => void;
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
  onClose

}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDescuento, setEditingDescuento] = useState<DescuentoPago | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { descuentos, loading, error } = useSelector((state: RootState) => state.descuentoPago);

  useEffect(() => {
    dispatch(fetchDescuentos());
  }, [dispatch]);

 // Filtrar los descuentos según ordenPagoId y tipoDescuento
  const filteredDescuentos = descuentos.filter(descuento => {
    if (!ordenPagoId) return true;
    if (!tipoDescuento) return descuento.orden_pago_id.id === ordenPagoId;
    return descuento.orden_pago_id.id === ordenPagoId && descuento.tipo.toLowerCase() === tipoDescuento.toLowerCase();
  });

    // Mejora para el filtrado de tipos (despues de la importacion ):   
/*
const filteredDescuentos = React.useMemo(() => {
  return descuentos.filter(descuento => {
    if (!ordenPagoId) return true;
    if (!tipoDescuento) return descuento.orden_pago_id.id === ordenPagoId;
    return descuento.orden_pago_id.id === ordenPagoId && 
           descuento.tipo.toLowerCase() === tipoDescuento.toLowerCase();
  });
}, [descuentos, ordenPagoId, tipoDescuento]);
*/
   
  const handleSubmit = (data: Omit<DescuentoPago, 'id' | 'codigo'>) => {
    if (editingDescuento) {
      dispatch(updateDescuento({ id: editingDescuento.id, ...data }));
    } else {
      dispatch(addDescuento(data));
    }
    setIsModalOpen(false);
    setEditingDescuento(null);
  };

    // Mejora en el manejo de erores (reemplazar handlesubmit)
    
    /*
      const handleSubmit = async (data: Omit<DescuentoPago, 'id' | 'codigo'>) => {
  try {
    if (editingDescuento) {
      await dispatch(updateDescuento({ id: editingDescuento.id, ...data }));
    } else {
      await dispatch(addDescuento(data));
    }
    setIsModalOpen(false);
    setEditingDescuento(null);
  } catch (error) {
    console.error('Error al guardar el descuento:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};

*/

//4. **Mejora en el manejo de eliminación (Reemplazar handleDelete):**
/*
const handleDelete = async (id: string) => {
  if (window.confirm('¿Está seguro de eliminar este descuento?')) {
    try {
      await dispatch(deleteDescuento(id));
    } catch (error) {
      console.error('Error al eliminar el descuento:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }
};

*/
    
  const handleEdit = (descuento: DescuentoPago) => {
    setEditingDescuento(descuento);
    setIsModalOpen(true);
  };
    
  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este descuento?')) {
      dispatch(deleteDescuento(id));
    }
  };

  const handleButtonClick = () => {
    setEditingDescuento(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDescuento(null);
  };

  const tableData = {
    filter: [true, true, true, true, true, true, true],
    headers: [
      "Código",
      "Orden de Pago",
      "Monto",
      "Tipo",
      "Detalle",
      "Usuario",
      "Opciones"
    ],
    rows: descuentos.map(descuento => ({
      codigo: descuento.codigo,
      orden_pago: descuento.orden_pago_id.codigo,
      monto: `${descuento.monto} ${descuento.orden_pago_id.tipo_moneda}`,
      tipo: descuento.tipo,
      detalle: descuento.detalle,
      usuario: `${descuento.usuario_id.nombres} ${descuento.usuario_id.apellidos}`,
      opciones: (
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
    }))
  };

  if (loading) return <LoaderPage />;
  if (error) return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="text-red-500 p-4" >
      Error: {error}
    </motion.div>
  );

// Modificar el título según el contexto
  const titulo = ordenPagoId 
    ? `${tipoDescuento === 'detracciones' ? 'Detracciones' : 'Retenciones'}`
    : 'Descuentos de Pagos';
    
  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div
        className="text-white pb-4 px-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
	  >
	 
          <h1 className="text-2xl font-bold">{titulo}</h1>
	  {/*  
	  <Button 
          text='Nuevo Descuento' 
          color='verde' 
          onClick={handleButtonClick} 
          className="rounded" 
          />
	  */}
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
		    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
		  >
		    <option value="">Seleccione</option>
		    <option value="detraccion">Detracción</option>
		    <option value="retencion">Retención</option>
		    <option value="pendiente">Pendientes</option>
		  </select>
		</div>

		{/* Div con inputs numéricos */}
		<div className="flex-1 min-w-[300px]">
		  <div className="space-y-4">
		    {/* Contenedor para los inputs lado a lado */}
		    <div className="flex gap-4">
		      <div className="flex-1">
			<label htmlFor="monto1" className="block text-sm font-medium text-gray-700 mb-1">
			  Porcentaje de calculo 
			</label>
			<input 
			  type="number"
			  id="monto1"
			  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
			  min="0"
			  step="0.01"
			/>
		      </div>
		      <div className="flex-1">
			<label htmlFor="monto2" className="block text-sm font-medium text-gray-700 mb-1">
			 Ingrese Monto 
			</label>
			<input 
			  type="number"
			  id="monto2"
			  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
			  min="0"
			  step="0.01"
			/>
		      </div>
		    </div>
		    {/* Input debajo */}
		    <div>
		      <label htmlFor="monto3" className="block text-sm font-medium text-gray-700 mb-1">
			Monto calculado 
		      </label>
		      <input 
			type="number"
			id="monto3"
			className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
		    rows={4}
		    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
		  />
		</div>

		{/* Botón Agregar */}
		<div className="flex items-end pb-1 mt-14">
		  <button
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
              <TableComponent tableData={tableData} />
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
              {/* 

                  Aquí iría el componente de formulario:
              <DescuentoPagoFormComponent
                initialValues={editingDescuento || undefined}
                onSubmit={handleSubmit}
                ordenPagoId={ordenPagoId}
                tipoDescuento={tipoDescuento}
              />
            	*/}
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DescuentoPagosPage;
