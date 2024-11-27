
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchProveedores } from '../../../slices/proveedorSlice';
import type { Proveedor } from '../../../slices/proveedorSlice';
import Button from '../../../components/Buttons/Button';
import { FiSearch, FiPlusCircle } from 'react-icons/fi';
import ProveedorFormComponent from '../../ProveedorPage/ProveedorFormComponent';

interface BuscarProveedoresModalProps {
  onSelectProveedor: (proveedor: Proveedor) => void;
  onClose: () => void;
}

const BuscarProveedoresModal: React.FC<BuscarProveedoresModalProps> = ({ onSelectProveedor, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const proveedores = useSelector((state: RootState) => state.proveedor.proveedores);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProveedores());
  }, [dispatch]);

  const filteredProveedores = proveedores.filter(
    proveedor =>
      proveedor.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ruc.includes(searchTerm)
  );

  const handleProveedorSubmit = async (proveedorData: any) => {
    // Aquí implementar la lógica para crear un nuevo proveedor
    // Después de crear el proveedor:
    setShowForm(false);
    dispatch(fetchProveedores()); // Recargar la lista
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

        <div className="space-y-2">
          {filteredProveedores.map((proveedor) => (
            <div
              key={proveedor.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectProveedor(proveedor)}
            >
              <div className="font-semibold">{proveedor.razon_social}</div>
              <div className="text-sm text-gray-600">RUC: {proveedor.ruc}</div>
              <div className="text-sm text-gray-500">{proveedor.direccion}</div>
            </div>
          ))}
        </div>
      </div>

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
            <ProveedorFormComponent onSubmit={handleProveedorSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarProveedoresModal;