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

  // Filtrar supervisores disponibles (los que no están asignados)
  const supervisoresDisponibles = supervisores.filter(
    supervisor => !supervisoresAsignados.some(
      asignado => asignado.usuario.id === supervisor.id
    )
  );

  // Filtrar gerentes disponibles (los que no están asignados)
  const gerentesDisponibles = gerentes.filter(
    gerente => !gerentesAsignados.some(
      asignado => asignado.usuario.id === gerente.id
    )
  );

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
  const handleSupervisorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSupervisorId = e.target.value;
    if (newSupervisorId) {
      const usuario = supervisores.find(u => u.id === newSupervisorId);
      if (usuario) {
        const aprobacionData = {
          requerimiento_id: requerimientoId,
          usuario_id: newSupervisorId,
          estado_aprobacion: 'pendiente_aprobacion',
          comentario: 'Asignación inicial de supervisor',
          gerarquia_aprobacion: 3
        };
        setLoading(true);
        try {
          const response = await dispatch(addAprobacion(aprobacionData)).unwrap();
          setSupervisoresAsignados(prev => [...prev, { usuario, aprobacion_id: response.id }]);
          setSupervisorId('');
          setToastMessage({ message: 'Supervisor asignado con éxito', variant: 'success' });
        } catch (error) {
          setToastMessage({ message: 'Error al asignar supervisor', variant: 'danger' });
          console.error('Error al asignar supervisor:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Modificamos handleAddGerente de manera similar
  const handleGerenteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGerenteId = e.target.value;
    if (newGerenteId) {
      const usuario = gerentes.find(u => u.id === newGerenteId);
      if (usuario) {
        const aprobacionData = {
          requerimiento_id: requerimientoId,
          usuario_id: newGerenteId,
          estado_aprobacion: 'pendiente_aprobacion',
          comentario: 'Asignación inicial de gerente',
          gerarquia_aprobacion: 4
        };
        setLoading(true);
        try {
          const response = await dispatch(addAprobacion(aprobacionData)).unwrap();
          setGerentesAsignados(prev => [...prev, { usuario, aprobacion_id: response.id }]);
          setGerenteId('');
          setToastMessage({ message: 'Gerente asignado con éxito', variant: 'success' });
        } catch (error) {
          setToastMessage({ message: 'Error al asignar gerente', variant: 'danger' });
          console.error('Error al asignar gerente:', error);
        } finally {
          setLoading(false);
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

  const handleSubmit = () => {
    if (supervisoresAsignados.length === 0 || gerentesAsignados.length === 0) {
      setToastMessage({ 
        message: 'Debe asignar al menos un supervisor y un gerente para continuar', 
        variant: 'danger' 
      });
      return;
    }
    onSubmit();
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
                  onChange={handleSupervisorChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="">Seleccione un supervisor</option>
                  {supervisoresDisponibles.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombres} {usuario.apellidos}
                    </option>
                  ))}
                </select>
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
                  onChange={handleGerenteChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="">Seleccione un gerente</option>
                  {gerentesDisponibles.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombres} {usuario.apellidos}
                    </option>
                  ))}
                </select>
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
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ENVIAR
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              CANCELAR
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default AssignApproversModal;