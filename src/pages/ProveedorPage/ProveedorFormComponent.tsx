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
import { 
  fetchValoracionesByProveedor,
  addValoracionProveedor,
  updateValoracionProveedor,
  deleteValoracionProveedor
} from '../../slices/valoracionProveedorSlice';
import { 
  //fetchDatosValoracionByProveedor,
  // addDatosValoracionProveedor,
  // deleteDatosValoracionProveedor
} from '../../slices/datosValoracionProveedorSlice';
import { fetchCuestionarios } from '../../slices/cuestionarioHomologacionSlice';
import type { AppDispatch, RootState } from '../../store/store';
import ContactoForm from './Forms/ContactoForm';
import MediosPagoForm from './Forms/MediosPagoForm';
import ProveedorForm from './Forms/ProveedorForm';
import ValoracionForm from './Forms/ValoracionForm';
//import CuestionarioForm from './Forms/CuestionarioForm';
import { formatDate } from '../../components/Utils/dateUtils';

interface ProveedorFormData {
  ruc: string;
  razon_social: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
  tipo?: string;
  actividad?: string;
  correo?: string;
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

interface ContactoProveedor {
  id: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
}

interface MediosPagoProveedor {
  id: string;
  cuenta_bcp: string;
  cuenta_bbva: string;
  yape: string;
}

interface ValoracionData {
  puntuacion: number;
  fecha_inicio: string;
  fecha_fin: string;
  notas?: string;
  usuario_id: string;
}

interface ValoracionProveedor {
  id: string;
  puntuacion: number;
  fecha_inicio: string;
  fecha_fin: string;
  notas?: string;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
  };
}

const ProveedorFormComponent: React.FC<FormComponentProps> = ({ 
  initialValues,
  onSuccess 
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const user_id = useSelector((state: RootState) => state.user.id);

  const [showContactForm, setShowContactForm] = useState(false);
  const [showMediosPagoForm, setShowMediosPagoForm] = useState(false);
  const [showValoracionForm, setShowValoracionForm] = useState(false);
  // const [showCuestionarioForm, setShowCuestionarioForm] = useState(false);

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

  const [editValoracionId, setEditValoracionId] = useState<string | null>(null);
  const [editValoracionData, setEditValoracionData] = useState<ValoracionData>({
    puntuacion: 0,
    fecha_inicio: '',
    fecha_fin: '',
    notas: '',
    usuario_id: user_id || ''
  });


  const contactos = useSelector((state: RootState) => state.contactoProveedor.contactos);
  const mediosPago = useSelector((state: RootState) => state.mediosPagoProveedor.mediosPago);
  const valoraciones = useSelector((state: RootState) => state.valoracionProveedor.valoraciones);
  // const datosValoraciones = useSelector((state: RootState) => state.datosValoracionProveedor.datosValoraciones);
  // const cuestionarios = useSelector((state: RootState) => state.cuestionarioHomologacion.cuestionarios);

  useEffect(() => {
    if (initialValues?.id) {
      dispatch(fetchContactosByProveedor(initialValues.id));
      dispatch(fetchMediosPagoByProveedor(initialValues.id));
      dispatch(fetchValoracionesByProveedor(initialValues.id));
      // dispatch(fetchDatosValoracionByProveedor(initialValues.id));
      dispatch(fetchCuestionarios());
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

  const handleValoracionSubmit = (valoracionData: ValoracionData) => {
    if (initialValues?.id) {
      if (editValoracionId) {
        // Editar valoración existente
        dispatch(updateValoracionProveedor({
          id: editValoracionId,
          proveedor_id: initialValues.id,
          ...valoracionData
        })).then(() => {
          setEditValoracionId(null);
          setEditValoracionData({
            puntuacion: 0,
            fecha_inicio: '',
            fecha_fin: '',
            notas: '',
            usuario_id: user_id || ''
          });
          setShowValoracionForm(false);
        });
      } else {
        // Crear nueva valoración
        dispatch(addValoracionProveedor({
          proveedor_id: initialValues.id,
          ...valoracionData
        })).then(() => {
          setShowValoracionForm(false);
        });
      }
    }
  };

  // const handleCuestionarioSubmit = (cuestionarioData: any) => {
  //   if (initialValues?.id) {
  //     dispatch(addDatosValoracionProveedor({
  //       id_proveedor: initialValues.id,
  //       ...cuestionarioData
  //     })).then(() => {
  //       setShowCuestionarioForm(false);
  //     });
  //   }
  // };

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

  const handleEditValoracion = (valoracion: ValoracionProveedor) => {
    setEditValoracionId(valoracion.id);
    setEditValoracionData({
      puntuacion: valoracion.puntuacion,
      fecha_inicio: valoracion.fecha_inicio,
      fecha_fin: valoracion.fecha_fin,
      notas: valoracion.notas || '',
      usuario_id: valoracion.usuario_id.id
    });
    setShowValoracionForm(true);
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

  const valoracionesTableData = {
    headers: ['Puntuación', 'Fecha Inicio', 'Fecha Fin', 'Notas', 'Usuario', 'Acciones'],
    filter: [true, true, true, true, true, false],
    rows: valoraciones.map((val: ValoracionProveedor) => ({
      Puntuación: val.puntuacion,
      'Fecha Inicio': formatDate(val.fecha_inicio, 'dd/mm/yyyy'),
      'Fecha Fin': formatDate(val.fecha_fin, 'dd/mm/yyyy'),
      Notas: val.notas || '-',
      Usuario: `${val.usuario_id.nombres} ${val.usuario_id.apellidos}`,
      Acciones: (
        <div className="flex gap-2">
          <FiEdit 
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => handleEditValoracion(val)}
          />
          <FiTrash2 
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => dispatch(deleteValoracionProveedor(val.id))}
          />
        </div>
      )
    }))
  };

  // const datosValoracionTableData = {
  //   headers: ['Cuestionario', 'Respuesta', 'Fecha', 'Acciones'],
  //   filter: [true, true, true, false],
  //   rows: datosValoraciones.map((dato: any) => ({
  //     Cuestionario: dato.cuestionario_id.denominacion,
  //     Respuesta: dato.respuesta,
  //     Fecha: new Date(dato.fecha_creacion).toLocaleDateString(),
  //     Acciones: (
  //       <div className="flex gap-2">
  //         <FiTrash2 
  //           className="cursor-pointer text-red-500 hover:text-red-700"
  //           onClick={() => dispatch(deleteDatosValoracionProveedor(dato.id))}
  //         />
  //       </div>
  //     )
  //   }))
  // };

  return (
    <div className="space-y-6">
      <div className='flex flex-row'>
        <div className='mr-4 min-w-[400px]'>
          <ProveedorForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        </div>

        {initialValues && (
          <div className='flex-1'>
            <div className='grid gap-4'>
              {/* Sección Contactos */}
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

              {/* Sección Medios de Pago */}
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

              {/* Sección Valoraciones */}
              <div className="bg-white shadow-md rounded px-8 p-2">
                <div className="flex justify-between items-center mb-2 mt-2 gap-20">
                  <h3 className="text-lg font-semibold">Valoraciones</h3>
                  <Button
                    text="Nueva Valoración"
                    color="azul"
                    className='w-auto px-6 py-2 text-sm font-medium'
                    icon={<FiPlus />}
                    onClick={() => setShowValoracionForm(true)}
                  />
                </div>
                {showValoracionForm ? (
                  <ValoracionForm
                    onSubmit={handleValoracionSubmit}
                    onCancel={() => {
                      setShowValoracionForm(false);
                      setEditValoracionId(null);
                      setEditValoracionData({
                        puntuacion: 0,
                        fecha_inicio: '',
                        fecha_fin: '',
                        notas: '',
                        usuario_id: user_id || ''
                      });
                    }}
                    initialData={editValoracionId ? editValoracionData : undefined}
                  />
                ) : (
                  <TableComponent tableData={valoracionesTableData} />
                )}
              </div>

              {/* Sección Cuestionarios */}
              {/* <div className="bg-white shadow-md rounded px-8 p-2">
                <div className="flex justify-between items-center mb-2 mt-2 gap-20">
                  <h3 className="text-lg font-semibold">Cuestionarios de Homologación</h3>
                  <Button
                    text="Nuevo Cuestionario"
                    color="azul"
                    className='w-auto px-6 py-2 text-sm font-medium'
                    icon={<FiPlus />}
                    onClick={() => setShowCuestionarioForm(true)}
                  />
                </div>
                {showCuestionarioForm ? (
                  <CuestionarioForm
                    cuestionarios={cuestionarios}
                    onSubmit={handleCuestionarioSubmit}
                    onCancel={() => setShowCuestionarioForm(false)}
                  />
                ) : (
                  <TableComponent tableData={datosValoracionTableData} />
                )}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProveedorFormComponent;