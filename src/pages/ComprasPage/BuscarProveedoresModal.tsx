import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiPlusCircle } from 'react-icons/fi';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProveedores } from '../../slices/proveedorSlice';
import { addCotizacionProveedor } from '../../slices/cotizacionProveedorSlice';
import { updateCotizacion } from '../../slices/cotizacionSlice';
import type { Proveedor } from '../../slices/proveedorSlice';
import Button from '../../components/Buttons/Button';
import ProveedorFormComponent from '../ProveedorPage/ProveedorFormComponent';

interface BuscarProveedoresModalProps {
  cotizacionId: string; // Añadir esta prop
  proveedoresActuales: Array<{ id: string }>;  // Añadir esta prop
}

const estadosProveedor=[
  "respuestaPendiente",
  "proformaRecibida",
  "enEvaluacion",
  "buenaProAdjudicada",
  "noAdjudicada",
  ];

const BuscarProveedoresModal: React.FC<BuscarProveedoresModalProps> = ({ cotizacionId, proveedoresActuales }) => {
  console.log(proveedoresActuales);

  const dispatch = useDispatch<AppDispatch>();
  const proveedores = useSelector((state: RootState) => state.proveedor.proveedores);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fetchProveedores());
  }, [dispatch]);

  const filteredProveedores = proveedores.filter(
    proveedor =>
      (proveedor.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ruc.includes(searchTerm) ||
      proveedor.nombre_comercial?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !proveedoresActuales.some(p => p.id && proveedor.id && p.id === proveedor.id)
  );

  const handleProveedorClick = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (selectedProveedor) {
      try {
        await dispatch(updateCotizacion({ id: cotizacionId, estado: 'iniciada' })).unwrap();
        await dispatch(addCotizacionProveedor({
          cotizacionId,
          proveedor_id: selectedProveedor.id,
          estado: estadosProveedor[0],
          fecha_inicio: new Date(),
          fecha_fin: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 días por defecto
          entrega: new Date(new Date().setDate(new Date().getDate() + 3)),
          c_pago: '',
          observaciones: ''
        })).unwrap();
      } catch (error) {
        console.error('Error al agregar cotización proveedor:', error);
      }
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedProveedor(null);
    setShowConfirmation(false);
  };

  return (
    <div className="flex h-full">
      <div className={`${showForm ? 'w-1/2' : 'w-full'} overflow-y-auto p-4`}>
        <div className="mb-4 flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por RUC o Razón Social..."
              className="w-full p-2 border rounded-lg pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <Button
            text="Nuevo Proveedor"
            color="verde"
            icon={<FiPlusCircle />}
            onClick={() => setShowForm(true)}
          />
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[60vh]">
          {filteredProveedores.map((proveedor) => (
            <div
              key={proveedor.id}
              className="p-4 border bg-white/50 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleProveedorClick(proveedor)}
            >
              <div className="font-semibold">{proveedor.nombre_comercial}</div>
              <div className='flex flex-row gap-10'>
                <div className="text-xs text-gray-600">RUC: {proveedor.ruc}</div>
                <div className="text-xs text-gray-600">RS: {proveedor.razon_social}</div>
              </div>
              <div className="text-xs text-gray-500">{proveedor.direccion}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmation && selectedProveedor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar selección</h3>
            <p>¿Desea seleccionar al proveedor {selectedProveedor.razon_social}?</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                text="Cancelar"
                color="rojo"
                onClick={handleCancel}
              />
              <Button
                text="Confirmar"
                color="verde"
                onClick={handleConfirm}
              />
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="w-1/2 border-l overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nuevo Proveedor</h3>
              <Button
                text="Cerrar"
                color="rojo"
                onClick={() => setShowForm(false)}
              />
            </div>
            <ProveedorFormComponent
              onSuccess={() => {
                dispatch(fetchProveedores());
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarProveedoresModal;