import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { RecursoSeleccionado, OrdenTransferenciaProps } from './interfaces';
import { addTransferencia } from '../../slices/transferenciaSlice';
import { addTransferenciaRecurso } from '../../slices/transferenciaRecursoSlice';
import { addTransferenciaDetalle } from '../../slices/transferenciaDetalleSlice';
import { useDispatch, useSelector } from 'react-redux'; 
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from '../../store/store';
import { fetchMovimientos } from '../../slices/movimientoSlice';
import { fetchMovilidades } from '../../slices/movilidadSlice';

const OrdenTransferencia: React.FC<OrdenTransferenciaProps> = ({ 
  onClose, 
  recursos,
  solicitudData 
}) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  
  // Estados para mensajes
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para datos del formulario
  const [descripcion, setDescripcion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [movilidadId, setMovilidadId] = useState('');

  // Obtener movimientos y movilidades del store
  const movimientos = useSelector((state: RootState) => state.movimiento.movimientos);
  const movilidades = useSelector((state: RootState) => state.movilidad.movilidades) || [];

  // Cargar movimientos y movilidades al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [movimientosResult, movilidadesResult] = await Promise.all([
          dispatch(fetchMovimientos()),
          dispatch(fetchMovilidades())
        ]);
        console.log('Resultado de cargar movimientos:', movimientosResult);
        console.log('Resultado de cargar movilidades:', movilidadesResult);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setErrorMessage('Error al cargar los datos necesarios');
      }
    };
    cargarDatos();
  }, [dispatch]);

  // Obtener ID del movimiento de transferencia
  const getMovimientoSalidaId = () => {
    const movimientoTransferencia = movimientos.find((m: { tipo: string; nombre: string }) => {
      return m.nombre.toLowerCase().includes('transferencia');
    });

    if (!movimientoTransferencia) {
      return null;
    }

    return movimientoTransferencia.id;
  };

  // Método para guardar la transferencia y sus recursos
  const handleSave = async () => {
    try {
      if (!movilidadId) {
        setErrorMessage('Debe seleccionar un tipo de transporte');
        return;
      }

      const movimientoId = getMovimientoSalidaId();
      if (!movimientoId) {
        setErrorMessage('No se encontró el tipo de movimiento');
        return;
      }

      if (!solicitudData.usuario.id || !movimientoId || !movilidadId) {
        setErrorMessage('Error en los datos de la transferencia');
        return;
      }

      // Crear la transferencia con los datos de la solicitud
      const transferencia = {
        usuario_id: solicitudData.usuario.id.toString(),
        movimiento_id: movimientoId.toString(),
        movilidad_id: movilidadId.toString(),
        fecha: new Date(),
        descripcion,
        observaciones,
        almacen_origen_id: solicitudData.almacenOrigen.id,
        almacen_destino_id: solicitudData.almacenDestino?.id
      };

      const result = await dispatch(addTransferencia(transferencia)).unwrap();

      // Crear el detalle de transferencia
      if (result.id) {
        if (!result.id) {
          setErrorMessage('No se pudo obtener el ID de la transferencia');
          return;
        }

        if (!solicitudData.id) {
          setErrorMessage('No se pudo obtener el ID de la referencia');
          return;
        }

        const detalleTransferencia = {
          transferencia_id: result.id,
          referencia_id: solicitudData.id,
          tipo: 'TRANSFERENCIA',
          referencia: descripcion || 'Transferencia de recursos',
          fecha: new Date()
        };
        
        const detalleResult = await dispatch(addTransferenciaDetalle(detalleTransferencia)).unwrap();

        // Guardar los recursos de transferencia
        if (detalleResult.id) {
          for (const recurso of recursos) {
            const recursoTransferencia = {
              transferencia_detalle_id: detalleResult.id,
              recurso_id: recurso.recurso_id.id,
              cantidad: recurso.cantidadSeleccionada
            };
            await dispatch(addTransferenciaRecurso(recursoTransferencia)).unwrap();
          }
        }
      }
      
      setSuccessMessage('Transferencia guardada con éxito');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setErrorMessage('Error al guardar la transferencia');
      console.error('Error al guardar la transferencia:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[1.5rem] font-bold text-[#003876]">Orden de Transferencia</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <IoMdCloseCircle size={24} />
        </button>
      </div>

      {/* Mensajes de error/éxito */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Información de almacenes */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Almacén de Salida</label>
            <input
              type="text"
              value={solicitudData.almacenOrigen?.nombre || ''}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Almacén de Destino</label>
            <input
              type="text"
              value={solicitudData.almacenDestino?.nombre || ''}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo de Transporte</label>
            <select
              value={movilidadId}
              onChange={(e) => setMovilidadId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Seleccione un tipo de transporte</option>
              {movilidades.map((movilidad) => (
                <option key={movilidad.id} value={movilidad.id}>
                  {movilidad.denominacion} - {movilidad.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ingrese una descripción"
            />
          </div>
        </div>
      </div>

      {/* Tabla de recursos */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recursos a Transferir</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bodega</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recursos.map((recurso) => (
                <tr key={recurso.recurso_id.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recurso.recurso_id.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recurso.recurso_id.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recurso.recurso_id.unidad_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recurso.cantidadSeleccionada}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S/ {recurso.recurso_id.precio_actual}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recurso.bodega || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observaciones */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Ingrese observaciones adicionales"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generar Transferencia
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default OrdenTransferencia;
