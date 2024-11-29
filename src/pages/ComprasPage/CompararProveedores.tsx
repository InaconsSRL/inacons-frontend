import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle } from 'react-icons/fi';
import Button from '../../components/Buttons/Button';
import 'tailwindcss/tailwind.css';
import ComparacionTable from './ComparacionTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {ComprasSelectSourcesProps} from './ComprasSelectSources';
import Modal from '../../components/Modal/Modal';
import BuscarProveedoresModal from './BuscarProveedoresModal';
import { fetchCotizacionProveedoresByCotizacionId } from '../../slices/cotizacionProveedorSlice';

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
  
  const cotizacionProveedores = useSelector((state: RootState) => 
    state.cotizacionProveedor.cotizacionProveedores
  );

  console.log(cotizacionProveedores)

  useEffect(() => {
    if (cotizacion.id) {
      dispatch(fetchCotizacionProveedoresByCotizacionId(cotizacion.id));
    }
  }, [dispatch, cotizacion.id]);

  // Transformar los datos de la API al formato necesario para la tabla
  const proveedores = useMemo(() => {
    return cotizacionProveedores.map(cp => ({
      id: cp.id,
      nombre: cp.proveedor_id.nombre_comercial,
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

  const handleProveedorSelect = (proveedor) => {
    setShowProveedorModal(false);
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
            {/* <div>
              <span className="font-semibold">Obra:</span> {cotizacion.obra}
            </div> */}
            <div>
              <span className="font-semibold">Solicita:</span> {cotizacion.usuario_id?.nombres.split(" ")[0]} {cotizacion.usuario_id?.apellidos.split(" ")[0]}
            </div>
            <div>
              <span className="font-semibold">F.Emision:</span> {cotizacion.fecha}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button text="Reordenar" color="azul" className="text-sm shadow-md" />
          <Button text="Generar OC" color="amarillo" className="text-sm shadow-md" />
          <Button text="Guardar" color="verde" className="text-sm shadow-md" />
        </div>
      </div>

      <ComparacionTable
        recursos={recursos}
        proveedores={proveedores}
        mejorProveedor={mejorProveedor}
      />

      {/* Botón para agregar nuevo proveedor */}
      <div className="mt-6 flex justify-end">
        <Button
          text="Agregar Proveedor"
          color="azul"
          className="text-sm shadow-md min-w-40"
          icon={<FiPlusCircle className="w-4 h-4 mr-2" />}
          onClick={() => setShowProveedorModal(true)}
        />
      </div>

      {showProveedorModal && (
        <Modal
          isOpen={showProveedorModal}
          onClose={() => setShowProveedorModal(false)}
          title="Buscar Proveedor"
        >
          <BuscarProveedoresModal
            onSelectProveedor={handleProveedorSelect}
            cotizacionId={cotizacion.id || ''}
            proveedoresActuales={cotizacionProveedores.map(cp => ({
              id: cp.proveedor_id.id || ''
            }))}
          />
        </Modal>
      )}
    </motion.div>
  );
};

export default CompararProveedores;