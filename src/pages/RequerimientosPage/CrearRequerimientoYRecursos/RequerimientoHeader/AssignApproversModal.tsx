import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { addAprobacion, deleteAprobacion, getAprobacionByRequerimientoId } from '../../../../slices/requerimientoAprobacionSlice';
import { FiTrash2 } from 'react-icons/fi';
import LoaderPage from '../../../../components/Loader/LoaderPage';
import Toast from '../../../../components/Toast/Toast';

interface UsuarioCargo {
  id: string;
  nombres: string;
  apellidos: string;
  cargo_id: {
    gerarquia: number;
  };
}

interface Aprobacion {
  id: string;
  gerarquia_aprobacion: number;
  usuario_id: string;
}

interface AssignApproversModalProps {
  onClose: () => void;
  requerimientoId: string;
  usuariosCargo: UsuarioCargo[];
  onSubmit: () => void;
}

// Definimos una nueva interfaz para almacenar el usuario y el id de aprobación
interface AprobacionAsignada {
  usuario: UsuarioCargo;
  aprobacion_id: string;
}

const AssignApproversModal: React.FC<AssignApproversModalProps> = ({ onSubmit, onClose, requerimientoId, usuariosCargo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [supervisorId, setSupervisorId] = useState('');
  const [gerenteId, setGerenteId] = useState('');
  // Actualizamos los estados para utilizar AprobacionAsignada
  const [supervisoresAsignados, setSupervisoresAsignados] = useState<AprobacionAsignada[]>([]);
  const [gerentesAsignados, setGerentesAsignados] = useState<AprobacionAsignada[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; variant: 'success' | 'danger' } | null>(null);

  const supervisores = usuariosCargo.filter(usuario => usuario.cargo_id.gerarquia === 3);
  const gerentes = usuariosCargo.filter(usuario => usuario.cargo_id.gerarquia === 4);

  useEffect(() => {
    const loadAprobadores = async () => {
      setLoading(true);
      try {
        const aprobaciones = await dispatch(getAprobacionByRequerimientoId(requerimientoId)).unwrap();

        const supervisores: AprobacionAsignada[] = aprobaciones
          .filter((aprobacion: Aprobacion) => aprobacion.gerarquia_aprobacion === 3)
          .map((aprobacion: Aprobacion) => ({
            aprobacion_id: aprobacion.id,
            usuario: usuariosCargo.find((u: UsuarioCargo) => u.id === aprobacion.usuario_id)!
          }));

        const gerentes: AprobacionAsignada[] = aprobaciones
          .filter((aprobacion: Aprobacion) => aprobacion.gerarquia_aprobacion === 4)
          .map((aprobacion: Aprobacion) => ({
            aprobacion_id: aprobacion.id,
            usuario: usuariosCargo.find(u => u.id === aprobacion.usuario_id)!
          }));

        setSupervisoresAsignados(supervisores);
        setGerentesAsignados(gerentes);
      } catch (error) {
        console.error('Error al cargar aprobadores:', error);
        setToastMessage({ message: 'Error al cargar aprobadores', variant: 'danger' });
      } finally {
        setLoading(false);
      }
    };

    loadAprobadores();
  }, [requerimientoId, dispatch, usuariosCargo]);

  // Modificamos handleAddSupervisor
  const handleAddSupervisor = async () => {
    if (supervisorId) {
      const usuario = supervisores.find(u => u.id === supervisorId);
      if (usuario) {
        const aprobacionData = {
          requerimiento_id: requerimientoId,
          usuario_id: supervisorId,
          estado_aprobacion: 'pendiente_aprobacion',
          comentario: 'Asignación inicial de supervisor',
          gerarquia_aprobacion: 3
        };
        setLoading(true);
        try {
          const response = await dispatch(addAprobacion(aprobacionData)).unwrap();
          const aprobacion_id = response.id; // Asegúrate de que este sea el campo correcto
          setSupervisoresAsignados(prev => [...prev, { usuario, aprobacion_id }]);
          setSupervisorId(''); // Limpiar el select después de agregar
          setLoading(false);
          setToastMessage({ message: 'Supervisor asignado con éxito', variant: 'success' });
        } catch (error) {
          setLoading(false);
          setToastMessage({ message: 'Error al asignar supervisor', variant: 'danger' });
          console.error('Error al asignar supervisor:', error);
        }
      }
    }
  };

  // Modificamos handleAddGerente de manera similar
  const handleAddGerente = async () => {
    if (gerenteId) {
      const usuario = gerentes.find(u => u.id === gerenteId);
      if (usuario) {
        const aprobacionData = {
          requerimiento_id: requerimientoId,
          usuario_id: gerenteId,
          estado_aprobacion: 'pendiente_aprobacion',
          comentario: 'Asignación inicial de gerente',
          gerarquia_aprobacion: 4
        };
        setLoading(true);
        try {
          const response = await dispatch(addAprobacion(aprobacionData)).unwrap();
          const aprobacion_id = response.id; // Asegúrate de que este sea el campo correcto
          setGerentesAsignados(prev => [...prev, { usuario, aprobacion_id }]);
          setGerenteId(''); // Limpiar el select después de agregar
          setLoading(false);
          setToastMessage({ message: 'Gerente asignado con éxito', variant: 'success' });
        } catch (error) {
          setLoading(false);
          setToastMessage({ message: 'Error al asignar gerente', variant: 'danger' });
          console.error('Error al asignar gerente:', error);
        }
      }
    }
  };

  // Modificamos handleRemoveSupervisor
  const handleRemoveSupervisor = async (usuarioId: string) => {
    const asignacion = supervisoresAsignados.find(a => a.usuario.id === usuarioId);
    setLoading(true);
    if (asignacion) {
      setSupervisoresAsignados(prev => prev.filter(a => a.usuario.id !== usuarioId));
      try {
        await dispatch(deleteAprobacion(asignacion.aprobacion_id)).unwrap();
        setToastMessage({ message: 'Supervisor eliminado con éxito', variant: 'success' });
      } catch (error) {
        setToastMessage({ message: 'Error al eliminar supervisor', variant: 'danger' });
        console.error('Error al eliminar supervisor:', error);
      }
    }
    setLoading(false);
  };

  // Modificamos handleRemoveGerente de manera similar
  const handleRemoveGerente = async (usuarioId: string) => {
    const asignacion = gerentesAsignados.find(a => a.usuario.id === usuarioId);
    setLoading(true);
    if (asignacion) {
      setGerentesAsignados(prev => prev.filter(a => a.usuario.id !== usuarioId));
      try {
        await dispatch(deleteAprobacion(asignacion.aprobacion_id)).unwrap();
        setToastMessage({ message: 'Gerente eliminado con éxito', variant: 'success' });
      } catch (error) {
        console.error('Error al eliminar gerente:', error);
        setToastMessage({ message: 'Error al eliminar gerente', variant: 'danger' });
      }
    }
    setLoading(false);
  };

  return (
    <>

      {toastMessage && (
        <Toast
          index={3}
          message={toastMessage.message}
          variant={toastMessage.variant}
          onClose={() => setToastMessage(null)}
          position="bottom-right"
          duration={2000}
        />
      )}
      {loading
        ? <div className='w-52 h-52'><LoaderPage /></div>
        :
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-base font-semibold mb-4">Asignar Aprobadores</h2>
          <div className="flex space-x-8">
            {/* Columna de Supervisores */}
            <div className="w-1/2">
              <h3 className="text-xs font-medium mb-2">Supervisores</h3>
              <div className="flex mb-4">
                <select
                  value={supervisorId}
                  onChange={(e) => setSupervisorId(e.target.value)}
                  className="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="">Seleccione un supervisor</option>
                  {supervisores.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombres} {usuario.apellidos}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddSupervisor}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 text-xs"
                >
                  Añadir
                </button>
              </div>
              <ul className="space-y-2 bg-neutral-200 p-4 rounded-xl h-44">
                {supervisoresAsignados.map(({ usuario }) => (
                  <li key={usuario.id} className="flex justify-between items-center">
                    <span className='text-xs'>
                      {usuario.nombres} {usuario.apellidos}
                    </span>
                    <button
                      onClick={() => handleRemoveSupervisor(usuario.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Columna de Gerentes */}
            <div className="w-1/2">
              <h3 className="text-xs font-medium mb-2">Gerentes</h3>
              <div className="flex mb-4">
                <select
                  value={gerenteId}
                  onChange={(e) => setGerenteId(e.target.value)}
                  className="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="">Seleccione un gerente</option>
                  {gerentes.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombres} {usuario.apellidos}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddGerente}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 text-xs"
                >
                  Añadir
                </button>
              </div>
              <ul className="space-y-2 bg-neutral-200 p-4 rounded-xl h-44">
                {gerentesAsignados.map(({ usuario }) => (
                  <li key={usuario.id} className="flex justify-between items-center">
                    <span className='text-xs'>
                      {usuario.nombres} {usuario.apellidos}
                    </span>
                    <button
                      onClick={() => handleRemoveGerente(usuario.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-4">
            <button
              onClick={onSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Guardar
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default AssignApproversModal;