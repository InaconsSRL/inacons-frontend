import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Button from '../../components/Buttons/Button';
import TableComponent from '../../components/Table/TableComponent';
import { 
  addContactoProveedor, 
  fetchContactosByProveedor, 
  updateContactoProveedor, 
  deleteContactoProveedor
} from '../../slices/contactoProveedorSlice';
import { 
  addMediosPagoProveedor, 
  fetchMediosPagoByProveedor, 
  deleteMediosPagoProveedor, 
  updateMediosPagoProveedor 
} from '../../slices/mediosPagoProveedorSlice';
import { addProveedor, updateProveedor } from '../../slices/proveedorSlice';
import type { AppDispatch, RootState } from '../../store/store';
import ContactoForm from './Forms/ContactoForm';
import MediosPagoForm from './Forms/MediosPagoForm';
import ProveedorForm from './Forms/ProveedorForm';

interface ProveedorFormData {
  ruc: string;
  razon_social: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
  id?: string;
}

interface FormComponentProps {
  initialValues?: Partial<ProveedorFormData>;
  onSuccess?: () => void;
}

interface ContactoData {
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
}

interface MediosPagoData {
  cuenta_bcp: string;
  cuenta_bbva: string;
  yape: string;
}

// Actualizar las interfaces para coincidir con los datos del servidor
interface Proveedor {
  id: string;
  razon_social: string;
  direccion: string;
  nombre_comercial: string;
  ruc: string;
  rubro: string;
  estado: string;
}

interface ContactoProveedor {
  id: string;
  proveedor_id: Proveedor;
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
}

interface MediosPagoProveedor {
  id: string;
  proveedor_id: Proveedor;
  cuenta_bcp: string;
  cuenta_bbva: string;
  yape: string;
}

const ProveedorFormComponent: React.FC<FormComponentProps> = ({ 
  initialValues,
  onSuccess 
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [showContactForm, setShowContactForm] = useState(false);
  const [showMediosPagoForm, setShowMediosPagoForm] = useState(false);

  const [editContactoId, setEditContactoId] = useState<string | null>(null);
  const [editContactoData, setEditContactoData] = useState<ContactoData>({
    nombres: '',
    apellidos: '',
    cargo: '',
    telefono: ''
  });
  const [editMediosPagoId, setEditMediosPagoId] = useState<string | null>(null);
  const [editMediosPagoData, setEditMediosPagoData] = useState<MediosPagoData>({
    cuenta_bcp: '',
    cuenta_bbva: '',
    yape: ''
  });

  const contactos = useSelector((state: RootState) => state.contactoProveedor.contactos);
  const mediosPago = useSelector((state: RootState) => state.mediosPagoProveedor.mediosPago);

  console.log(contactos, mediosPago);

  useEffect(() => {
    if (initialValues?.id) {
      dispatch(fetchContactosByProveedor(initialValues.id));
      dispatch(fetchMediosPagoByProveedor(initialValues.id));
    }
  }, [dispatch, initialValues]);

  const handleSubmit = async (formData: ProveedorFormData) => {
    try {
      if (initialValues?.id) {
        await dispatch(updateProveedor({ 
          id: initialValues.id, 
          ...formData 
        })).unwrap();
      } else {
        await dispatch(addProveedor(formData)).unwrap();
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
    }
  };

  const handleContactoSubmit = (contactoData: ContactoData) => {
    if (initialValues?.id) {
      if (editContactoId) {
        // Editar contacto existente
        dispatch(updateContactoProveedor({
          id: editContactoId,
          proveedor_id: initialValues.id,
          ...contactoData
        })).then(() => {
          setEditContactoId(null);
          setEditContactoData({
            nombres: '',
            apellidos: '',
            cargo: '',
            telefono: ''
          });
          setShowContactForm(false);
        });
      } else {
        // Crear nuevo contacto
        dispatch(addContactoProveedor({
          proveedor_id: initialValues.id,
          ...contactoData
        })).then(() => {
          setShowContactForm(false);
        });
      }
    }
  };

  const handleMediosPagoSubmit = (mediosPagoData: MediosPagoData) => {
    if (initialValues?.id) {
      if (editMediosPagoId) {
        // Editar medio de pago existente
        dispatch(updateMediosPagoProveedor({
          id: editMediosPagoId,
          proveedor_id: initialValues.id,
          ...mediosPagoData
        })).then(() => {
          setEditMediosPagoId(null);
          setEditMediosPagoData({
            cuenta_bcp: '',
            cuenta_bbva: '',
            yape: ''
          });
          setShowMediosPagoForm(false);
        });
      } else {
        // Crear nuevo medio de pago
        dispatch(addMediosPagoProveedor({
          proveedor_id: initialValues.id,
          ...mediosPagoData
        })).then(() => {
          setShowMediosPagoForm(false);
        });
      }
    }
  };

  const handleEditContacto = (contacto: ContactoProveedor) => {
    setEditContactoId(contacto.id);
    setEditContactoData({
      nombres: contacto.nombres,
      apellidos: contacto.apellidos,
      cargo: contacto.cargo,
      telefono: contacto.telefono
    });
    setShowContactForm(true);
  };

  const handleEditMedioPago = (medio: MediosPagoProveedor) => {
    setEditMediosPagoId(medio.id);
    setEditMediosPagoData({
      cuenta_bcp: medio.cuenta_bcp,
      cuenta_bbva: medio.cuenta_bbva,
      yape: medio.yape
    });
    setShowMediosPagoForm(true);
  };

  const handleDeleteContacto = (contactoId: string) => {
    if (window.confirm('¿Está seguro de eliminar este contacto?')) {
      dispatch(deleteContactoProveedor(contactoId));
    }
  };

  const handleDeleteMedioPago = (medioId: string) => {
    if (window.confirm('¿Está seguro de eliminar este medio de pago?')) {
      dispatch(deleteMediosPagoProveedor(medioId));
    }
  };

  const contactosTableData = {
    headers: ['Nombres', 'Apellidos', 'Cargo', 'Telefono', 'Acciones'],
    filter: [true, true, true, true, false],
    rows: contactos.map((contacto: ContactoProveedor) => ({
      Nombres: contacto.nombres,
      Apellidos: contacto.apellidos,
      Cargo: contacto.cargo,
      Telefono: contacto.telefono,
      Acciones: (
        <div className="flex gap-2">
          <FiEdit 
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => handleEditContacto(contacto)}
          />
          <FiTrash2 
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => handleDeleteContacto(contacto.id)}
          />
        </div>
      )
    }))
  };

  const mediosPagoTableData = {
    headers: ['Entidad', 'NroCuenta', 'Notas', 'Acciones'],
    filter: [true, true, true, false],
    rows: mediosPago.map((medio: MediosPagoProveedor) => ({
      'Entidad': medio.cuenta_bcp || '-',
      'NroCuenta': medio.cuenta_bbva || '-',
      'Notas': medio.yape || '-',
      Acciones: (
        <div className="flex gap-2">
          <FiEdit 
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => handleEditMedioPago(medio)}
          />
          <FiTrash2 
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => handleDeleteMedioPago(medio.id)}
          />
        </div>
      )
    }))
  };

  return (
    <div className="space-y-6">
      <div className='flex flex-row'>
        <div className='mr-4 min-w-[400px] '>
          <ProveedorForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        </div>

        {initialValues && (
          <div className=''>
            <div className='grid gap-4'>
              <div>
                <div className="bg-white shadow-md rounded px-8 p-2">
                  <div className="flex justify-between items-center mb-2 mt-2 gap-20">
                    <h3 className="text-lg font-semibold">Contactos</h3>
                    <Button
                      text="Nuevo Contacto"
                      color="azul"
                      className='w-auto px-6 py-2 text-sm font-medium'
                      icon={<FiPlus />}
                      onClick={() => setShowContactForm(true)}
                    />
                  </div>
                  {showContactForm ? (
                    <ContactoForm
                      onSubmit={handleContactoSubmit}
                      onCancel={() => setShowContactForm(false)}
                      initialData={editContactoData}
                    />
                  ) : (
                    <TableComponent tableData={contactosTableData} />
                  )}
                </div>
              </div>

              <div>
                <div className="bg-white shadow-md rounded px-8 p-2">
                  <div className="flex justify-between items-center mb-2 mt-2 gap-20">
                    <h3 className="text-lg font-semibold">Medios de Pago</h3>
                    <Button
                      text="Nuevo Medio de Pago"
                      className='w-auto px-6 py-2 text-sm font-medium'
                      color="azul"
                      icon={<FiPlus />}
                      onClick={() => setShowMediosPagoForm(true)}
                    />
                  </div>
                  {showMediosPagoForm ? (
                    <MediosPagoForm
                      onSubmit={handleMediosPagoSubmit}
                      onCancel={() => setShowMediosPagoForm(false)}
                      initialData={editMediosPagoData}
                    />
                  ) : (
                    <TableComponent tableData={mediosPagoTableData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProveedorFormComponent;