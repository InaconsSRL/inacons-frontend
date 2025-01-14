import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import { fetchEmpleados, addEmpleado } from '../../../../slices/empleadoSlice';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';

interface RecursoRetornable {
  recurso: {
    id: string;
    recurso_id: {
      nombre: string;
    };
  };
  cantidad: number;
};

interface RecursoNoRetornable {
  recurso: {
    id: string;
    recurso_id: {
      nombre: string;
    };
  };
  cantidad: number;
};

interface PrestamoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { empleadoId: string; fRetorno: Date; prestamosRecursos: RecursoRetornable[]; consumosRecursos: RecursoNoRetornable[]; responsableId: string }) => void;
  recursosRetornables: RecursoRetornable[];
  recursosNoRetornables: RecursoNoRetornable[];
};

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  <label {...props} className="block text-xs font-medium text-gray-700 mb-1">
    {props.children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full border rounded-md p-2" />
);

export const PrestamoModal: React.FC<PrestamoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recursosRetornables,
  recursosNoRetornables
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [fechaRetorno, setFechaRetorno] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEmpleadoForm, setShowNewEmpleadoForm] = useState(false);
  const [newEmpleado, setNewEmpleado] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    telefono_secundario: '',
    cargo_id: '67634bf0f67ec7aecd5f013e' // ID por defecto del cargo
  });
  const [selectedResponsable, setSelectedResponsable] = useState('');
  const [responsableSearchTerm, setResponsableSearchTerm] = useState('');
  
  const empleados = useSelector((state: RootState) => state.empleado.empleados);
  const usuariosCargo = useSelector((state: RootState) => state.usuario.usuariosCargo);

  // Filtrar empleados basado en el término de búsqueda
  const filteredEmpleados = empleados.filter(emp => 
    `${emp.nombres} ${emp.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.dni.includes(searchTerm)
  );

  // Filtrar usuarios basado en el término de búsqueda y jerarquía
  const filteredResponsables = usuariosCargo.filter(user => 
    (user.cargo_id.gerarquia >= 2) && // Filtrar por jerarquía
    (
      `${user.nombres} ${user.apellidos}`.toLowerCase().includes(responsableSearchTerm.toLowerCase()) ||
      (user.dni && user.dni.toString().includes(responsableSearchTerm))
    )
  );

  useEffect(() => {
    const cargarEmpleados = async () => {
      if (empleados.length === 0) {
        setLoading(true);
        try {
          await dispatch(fetchEmpleados()).unwrap();
        } catch (error) {
          console.error('Error al cargar empleados:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      cargarEmpleados();
    }
  }, [dispatch, empleados.length, isOpen]);

  const validateEmpleadoForm = () => {
    return (
      newEmpleado.dni.length >= 8 &&
      newEmpleado.nombres.trim() !== '' &&
      newEmpleado.apellidos.trim() !== '' &&
      newEmpleado.telefono.trim() !== ''
    );
  };

  const handleAddEmpleado = async () => {
    try {
      setLoading(true);
      if (!validateEmpleadoForm()) {
        throw new Error('Por favor complete los campos obligatorios');
      }

      const empleadoCreado = await dispatch(addEmpleado(newEmpleado)).unwrap();
      setSelectedEmpleado(empleadoCreado.id);
      setShowNewEmpleadoForm(false);
      setNewEmpleado({
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        telefono_secundario: '',
        cargo_id: '6765ed96444c04c94802b3e1'
      });
    } catch (error) {
      console.error('Error al crear empleado:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registrar Préstamo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Lista de recursos */}
        <div className="mb-6 bg-gray-50 p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-2 text-gray-700">Recursos a prestar (retornables):</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {recursosRetornables.map(({ recurso, cantidad }) => (
              <li key={recurso.id} className="flex justify-between">
                <span>{recurso.recurso_id.nombre}</span>
                <span className="font-medium">Cant: {cantidad}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nueva sección para los recursos no retornables */}
        <div className="mb-6 bg-gray-50 p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-2 text-gray-700">Recursos a consumir (no retornables):</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {recursosNoRetornables.map(({ recurso, cantidad }) => (
              <li key={recurso.id} className="flex justify-between">
                <span>{recurso.recurso_id.nombre}</span>
                <span className="font-medium">Cant: {cantidad}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selector de Responsable */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable
          </label>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o DNI..."
                value={responsableSearchTerm}
                onChange={(e) => setResponsableSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border rounded-lg"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={selectedResponsable}
              onChange={(e) => setSelectedResponsable(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Seleccione un responsable</option>
              {filteredResponsables.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombres} {user.apellidos} {user.dni ? `- DNI: ${user.dni}` : ''} - {user.cargo_id.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Selector de empleado con búsqueda */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Empleado </label>
            <button
              onClick={() => setShowNewEmpleadoForm(!showNewEmpleadoForm)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FiPlus size={16} />
              Nuevo empleado
            </button>
          </div>

          {!showNewEmpleadoForm ? (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 border rounded-lg"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <select
                value={selectedEmpleado}
                onChange={(e) => setSelectedEmpleado(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Seleccione un empleado</option>
                {filteredEmpleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombres} {empleado.apellidos} - DNI: {empleado.dni}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="DNI"
                    value={newEmpleado.dni}
                    onChange={(e) => setNewEmpleado({...newEmpleado, dni: e.target.value})}
                    maxLength={8}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    type="text"
                    placeholder="Nombres"
                    value={newEmpleado.nombres}
                    onChange={(e) => setNewEmpleado({...newEmpleado, nombres: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    type="text"
                    placeholder="Apellidos"
                    value={newEmpleado.apellidos}
                    onChange={(e) => setNewEmpleado({...newEmpleado, apellidos: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono Principal *</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="Teléfono"
                    value={newEmpleado.telefono}
                    onChange={(e) => setNewEmpleado({...newEmpleado, telefono: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono_secundario">Teléfono Secundario</Label>
                  <Input
                    id="telefono_secundario"
                    type="tel"
                    placeholder="Teléfono Secundario"
                    value={newEmpleado.telefono_secundario}
                    onChange={(e) => setNewEmpleado({...newEmpleado, telefono_secundario: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowNewEmpleadoForm(false)}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800 border rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEmpleado}
                  disabled={!validateEmpleadoForm() || loading}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">↻</span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar empleado'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        
        {/* Selector de fecha - Solo mostrar si hay recursos retornables */}
        {recursosRetornables.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Devolución
            </label>
            <input
              type="date"
              value={fechaRetorno}
              onChange={(e) => setFechaRetorno(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm({
              empleadoId: selectedEmpleado,
              fRetorno: new Date(fechaRetorno),
              responsableId: selectedResponsable, // Añadir el responsableId
              prestamosRecursos: recursosRetornables,
              consumosRecursos: recursosNoRetornables
            })}
            disabled={!selectedEmpleado || !selectedResponsable || (!fechaRetorno && recursosRetornables.length > 0) || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Confirmar préstamo
          </button>
        </div>
      </div>
    </div>
  );
};
