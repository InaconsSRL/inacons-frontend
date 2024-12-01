import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import ComparacionTable from './ComparacionTable';
import BuscarProveedoresModal from './BuscarProveedoresModal';
import { AppDispatch, RootState } from '../../store/store';
import { ComprasSelectSourcesProps } from './ComprasSelectSources';
import { fetchCotizacionProveedoresByCotizacionId, updateCotizacionProveedor } from '../../slices/cotizacionProveedorSlice';
import { updateCotizacion } from '../../slices/cotizacionSlice';
import { addOrdenCompra } from '../../slices/ordenCompraSlice';
import { addOrdenCompraRecurso } from '../../slices/ordenCompraRecursosSlice';
import { fetchCotizacionesByProveedor } from '../../slices/cotizacionProveedoresRecursoSlice';

//Todo Ok

export interface CompararProveedoresProps {
  onClose: () => void;
  recursos: RecursoItem[];
  cotizacion: ComprasSelectSourcesProps['cotizacion'];
}

export interface RecursoItem {
  id: string;
  cantidad: number;
  atencion: string;
  costo: number;
  total: number;
  cotizacion_id: {
    codigo_cotizacion: string;
    aprobacion: boolean;
  };
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    fecha: string;
    cantidad: number;
    precio_actual: number;
    vigente: boolean;
    unidad_id: string;
    imagenes: Array<{file: string}>;
  };
}

export interface ProveedorCotizacion {
  id: string;
  nombre: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  entrega: string;
  items: {
    cantidad: number;
    precio: number;
    subTotal: number;
  }[];
  total: number;
  notas: string;
}

const CompararProveedores: React.FC<CompararProveedoresProps> = ({ cotizacion, recursos, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [showGenerarOCModal, setShowGenerarOCModal] = useState(false);
  
  const cotizacionProveedores = useSelector((state: RootState) => 
    state.cotizacionProveedor.cotizacionProveedores
  );
  const cotizacionProveedoresRecursos = useSelector((state: RootState) => state.cotizacionProveedoresRecurso.cotizacionProveedoresRecursos);

  const proveedorAdjudicado = useMemo(() => {
    return cotizacionProveedores.find(proveedor => proveedor.estado === 'buenaProAdjudicada');
  }, [cotizacionProveedores]);

  useEffect(() => {
    if (proveedorAdjudicado) {
      dispatch(fetchCotizacionesByProveedor(proveedorAdjudicado.id));
    }
  }, [dispatch, proveedorAdjudicado]);

  console.log(cotizacionProveedores)

  useEffect(() => {
    const fetchAndUpdateProveedores = async () => {
      if (cotizacion.id) {
        await dispatch(fetchCotizacionProveedoresByCotizacionId(cotizacion.id));
        
        // Verifica si el estado de la cotización es "enEvaluacion"
        if (cotizacion.estado === "enEvaluacion") {
          // Actualiza el estado de todos los proveedores
          const updatePromises = cotizacionProveedores.map(proveedor => 
            dispatch(updateCotizacionProveedor({
              id: proveedor.id,
              estado: "enEvaluacion"
            }))
          );
          
          try {
            await Promise.all(updatePromises);
          } catch (error) {
            console.error('Error al actualizar el estado de los proveedores:', error);
          }
        }
      }
    };

    fetchAndUpdateProveedores();
  }, [dispatch, cotizacion.id, cotizacion.estado]);

  // Transformar los datos de la API al formato necesario para la tabla
  const proveedores = useMemo(() => {
    return cotizacionProveedores.map(cp => ({
      id: cp.id,
      nombre: cp.proveedor_id.nombre_comercial,
      estado: cp.estado,
      fechaInicio: cp.fecha_inicio,
      fechaFin: cp.fecha_fin,
      entrega: cp.entrega,
      items: recursos.map(recurso => ({
        cantidad: recurso.cantidad,
        precio: recurso.recurso_id.precio_actual, // Este precio deberá actualizarse cuando implementes la edición
        subTotal: recurso.cantidad * recurso.recurso_id.precio_actual
      })),
      total: recursos.reduce((acc, recurso) => 
        acc + (recurso.cantidad * recurso.recurso_id.precio_actual), 0),
      notas: cp.observaciones || ''
    }));
  }, [cotizacionProveedores, recursos]);

  const mejorProveedor = useMemo(() => {
    if (proveedores.length === 0) return null;
    return proveedores.reduce((mejor, actual) =>
      actual.total < mejor.total ? actual : mejor
    );
  }, [proveedores]);

  const handleEnEvaluacion = async () => {
    if (!cotizacion.id) return;
    try {
      // Actualizar estado de cotización
      await dispatch(updateCotizacion({
        id: cotizacion.id,
        estado: 'enEvaluacion'
      })).unwrap();

      // Actualizar estado de proveedores
      const updatePromises = cotizacionProveedores.map(proveedor => 
        dispatch(updateCotizacionProveedor({
          id: proveedor.id,
          estado: "enEvaluacion"
        }))
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error al actualizar estados:', error);
      alert('Error al actualizar los estados');
    }
  };

const handleGenerarOC = () => {
  setShowGenerarOCModal(true);
};

const handleConfirmarGenerarOC = async () => {
  if (!proveedorAdjudicado || !cotizacion.id) return;

  try {
    // Crear la Orden de Compra
    const nuevaOrdenCompra = {
      proveedor_id: proveedorAdjudicado.proveedor_id.id,
      codigo_orden: 'ORD-' + new Date().getTime(), // Example code
      cotizacion_id: cotizacion.id,
      estado: false, // Cambiado de 'PENDIENTE' a false para cumplir con el tipo boolean
      descripcion: 'Orden de compra generada automáticamente',
      fecha: new Date().toISOString(),
      fecha_ini: new Date().toISOString(),
      fecha_fin: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // 7 days from now
    };

    const ordenCompraCreada = await dispatch(addOrdenCompra(nuevaOrdenCompra)).unwrap();

    // Crear los recursos de la Orden de Compra
    const recursosOC = cotizacionProveedoresRecursos
      .filter(cpr => cpr.cotizacion_proveedor_id.id === proveedorAdjudicado.id)
      .map(cpr => ({
        orden_compra_id: ordenCompraCreada.id,
        id_recurso: cpr.recurso_id.id, // Cambiado de recurso_id a id_recurso
        cantidad: cpr.cantidad,
        costo_real: cpr.costo,
        costo_aproximado: cpr.costo, // Si es necesario
        estado: 'PENDIENTE' // Cambiado de 'PENDIENTE' a false asumiendo que el estado es boolean
      }));

    for (const recurso of recursosOC) {
      await dispatch(addOrdenCompraRecurso(recurso));
    }

    setShowGenerarOCModal(false);
    // ...acciones adicionales si es necesario...

  } catch (error) {
    console.error('Error al generar la Orden de Compra:', error);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white p-6 rounded-xl shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-1 text-gray-500 text-sm">
            <div>
              <span className="font-semibold">Cotización:</span> {cotizacion.codigo_cotizacion}
            </div>
            <div>
              <span className="font-semibold">Estado:</span> {cotizacion.estado}
            </div>
            <div>
              <span className="font-semibold">Solicita:</span> {cotizacion.usuario_id?.nombres.split(" ")[0]} {cotizacion.usuario_id?.apellidos.split(" ")[0]}
            </div>
            <div>
              <span className="font-semibold">F.Emision:</span> {cotizacion.fecha}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          {/* Mostrar botón de Proveedor solo en estados iniciales */}
          {['vacio', 'pendiente', 'iniciada'].includes(cotizacion.estado || '') && (
            <Button
              text="Proveedor"
              color="rojo"
              className="text-sm shadow-md min-w-32"
              icon={<FiPlusCircle className="w-4 h-4" />}
              onClick={() => setShowProveedorModal(true)}
            />
          )}

          {/* Mostrar botón de IniciarAdjudicar */}
          {['iniciada', 'cotizada'].includes(cotizacion.estado || '') && (
            <Button 
              onClick={handleEnEvaluacion} 
              text="IniciarAdjudicar" 
              color="azul" 
              className="text-sm shadow-md min-w-36" 
            />
          )}

          <Button onClick={onClose} text="Guardar" color="verde" className="text-sm shadow-md" />

          {/* Mostrar botón de Generar OC solo si hay proveedor adjudicado */}
          {cotizacion.estado === 'adjudicada' && proveedorAdjudicado && (
            <Button 
              text="Generar OC" 
              color="amarillo" 
              className="text-sm shadow-md" 
              onClick={handleGenerarOC} 
            />
          )}
        </div>
      </div>

      <ComparacionTable
        recursos={recursos}
        proveedores={proveedores}
        estadoCotizacion={cotizacion.estado || ''}
        mejorProveedor={mejorProveedor || {} as ProveedorCotizacion}
        cotizacionId={cotizacion.id || ''}
      />

      {showProveedorModal && (
        <Modal
          isOpen={showProveedorModal}
          onClose={() => setShowProveedorModal(false)}
          title="Buscar Proveedor"
        >
          <BuscarProveedoresModal
            cotizacionId={cotizacion.id || ''}
            proveedoresActuales={cotizacionProveedores.map(cp => ({
              id: cp.proveedor_id.id || ''
            }))}
          />
        </Modal>
      )}

      {showGenerarOCModal && (
        <Modal
          isOpen={showGenerarOCModal}
          onClose={() => setShowGenerarOCModal(false)}
          title="Confirmar generación de Orden de Compra"
        >
          <div className="p-4">
            <p>
              ¿Está seguro que desea generar la Orden de Compra para el proveedor {proveedorAdjudicado?.proveedor_id.nombre_comercial}?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button text="Cancelar" color="rojo" onClick={() => setShowGenerarOCModal(false)} />
              <Button text="Confirmar" color="verde" onClick={handleConfirmarGenerarOC} />
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default CompararProveedores;