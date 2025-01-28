import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { addProyecto, updateProyecto, Proyecto } from '../../../slices/proyectoSlice';
import { fetchInfraestructuras, Infraestructura } from '../../../slices/infraestructuraSlice';
import { addDepartamento, fetchDepartamentos, Departamento } from '../../../slices/departamentoSlice';
import { addProvincia, fetchProvinciasByDepartamento, Provincia } from '../../../slices/provinciaSlice';
import { addDistrito, getDistritosByProvincia, Distrito  } from '../../../slices/distritoSlice';
import { addLocalidad, getLocalidadesByDistrito, Localidad } from '../../../slices/localidadSlice';
import Modal from '../../../components/Modal/Modal';
import { AppDispatch, RootState } from '../../../store/store';
import { setActiveProyecto } from '../../../slices/activeDataSlice';
import DepartamentoForm from '../Departamento/DepartamentoForm';
import ProvinciaForm from '../Provincia/ProvinciaForm';
import DistritoForm from '../Distrito/DistritoForm';
import LocalidadForm from '../Localidad/LocalidadForm';

interface ProyectoFormProps {
  editMode?: boolean;
  initialData?: Proyecto;
}


const ProyectoForm: React.FC<ProyectoFormProps> = ({
  editMode = false,
  initialData
}) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para los modales
  const [isDepartamentoModalOpen, setIsDepartamentoModalOpen] = useState(false);
  const [isProvinciaModalOpen, setIsProvinciaModalOpen] = useState(false);
  const [isDistritoModalOpen, setIsDistritoModalOpen] = useState(false);
  const [isLocalidadModalOpen, setIsLocalidadModalOpen] = useState(false);

  const { infraestructuras } = useSelector((state: RootState) => state.infraestructura);
  const { departamentos } = useSelector((state: RootState) => state.departamento);
  const { provincias } = useSelector((state: RootState) => state.provincia);
  const { distritos } = useSelector((state: RootState) => state.distrito);
  const { localidades } = useSelector((state: RootState) => state.localidad);

  const [formData, setFormData] = useState({
    nombre_proyecto: '',
    id_infraestructura: '',
    id_departamento: '',
    id_provincia: '',
    id_distrito: '',
    id_localidad: '',
    cliente: '',
    empresa: '',
    plazo: 0,
    ppto_base: 0,
    ppto_oferta: 0,
    jornada: 8,
  });

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        ...initialData,
        plazo: initialData.plazo || 0,
        ppto_base: initialData.ppto_base || 0,
        ppto_oferta: initialData.ppto_oferta || 0,
        jornada: initialData.jornada || 8,
        nombre_proyecto: initialData.nombre_proyecto || '',
        id_infraestructura: initialData.id_infraestructura || '',
        id_departamento: initialData.id_departamento || '',
        id_provincia: initialData.id_provincia || '',
        id_distrito: initialData.id_distrito || '',
        id_localidad: initialData.id_localidad || '',
        cliente: initialData.cliente || '',
      });
    }
  }, [editMode, initialData]);

  useEffect(() => {
    if (infraestructuras.length === 0) {
      dispatch(fetchInfraestructuras());
    }
    if (departamentos.length === 0) {
      dispatch(fetchDepartamentos());
    }
  }, [dispatch, infraestructuras.length, departamentos.length]);

  useEffect(() => {
    if (formData.id_departamento && !provincias.some(p => p.id_departamento === formData.id_departamento)) {
      dispatch(fetchProvinciasByDepartamento(formData.id_departamento));
    }
  }, [formData.id_departamento, dispatch, provincias]);

  useEffect(() => {
    if (formData.id_provincia && !distritos.some(d => d.id_provincia === formData.id_provincia)) {
      dispatch(getDistritosByProvincia(formData.id_provincia));
    }
  }, [formData.id_provincia, dispatch, distritos]);

  useEffect(() => {
    if (formData.id_distrito && !localidades.some(l => l.id_distrito === formData.id_distrito)) {
      dispatch(getLocalidadesByDistrito(formData.id_distrito));
    }
  }, [formData.id_distrito, dispatch, localidades]);

  useEffect(() => {
    if (!editMode) {
      setFormData({
        nombre_proyecto: '',
        id_infraestructura: '',
        id_departamento: '',
        id_provincia: '',
        id_distrito: '',
        id_localidad: '',
        cliente: '',
        empresa: '',
        plazo: 0,
        ppto_base: 0,
        ppto_oferta: 0,
        jornada: 8,
      });
    }
  }, [editMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editMode && initialData) {
        const updateData = {
          idProyecto: initialData.id_proyecto,
          nombreProyecto: formData.nombre_proyecto,
          cliente: formData.cliente,
          empresa: formData.empresa,
          plazo: formData.plazo,
          pptoBase: formData.ppto_base,
          pptoOferta: formData.ppto_oferta,
          jornada: formData.jornada
        };
        
        const response = await dispatch(updateProyecto(updateData));
        if ('payload' in response) {
          const payload = response.payload as Proyecto;
          dispatch(setActiveProyecto(payload));
        } else {
          throw new Error('Error al actualizar el proyecto');
        }
      } else {
        const newProyecto = {
          idUsuario: user.id||'',
          idInfraestructura: formData.id_infraestructura,
          nombreProyecto: formData.nombre_proyecto,
          idDepartamento: formData.id_departamento,
          idProvincia: formData.id_provincia,
          idDistrito: formData.id_distrito,
          idLocalidad: formData.id_localidad,
          estado: 'PLANTILLA',
          cliente: formData.cliente,
          empresa: formData.empresa,
          plazo: formData.plazo,
          pptoBase: formData.ppto_base,
          pptoOferta: formData.ppto_oferta,
          jornada: formData.jornada,
          totalProyecto: 0
        };

        const response = await dispatch(addProyecto(newProyecto));
        if ('payload' in response) {
          const payload = response.payload as Proyecto;
          dispatch(setActiveProyecto(payload));
        } else {
          throw new Error('Error al crear el proyecto');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al ${editMode ? 'actualizar' : 'crear'} el proyecto`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDepartamentoSubmit = async (data: Omit<Departamento, 'id_departamento'>) => {
    dispatch(addDepartamento({
      nombreDepartamento: data.nombre_departamento,
      ubigeo: data.ubigeo
    }));
    setIsDepartamentoModalOpen(false);
    dispatch(fetchDepartamentos());
  };

  const handleProvinciaSubmit = async (data: Omit<Provincia, 'id_provincia'>) => {
    dispatch(addProvincia({
      nombreProvincia: data.nombre_provincia,
      idDepartamento: data.id_departamento
    }));
    setIsProvinciaModalOpen(false);
    if (formData.id_departamento) {
      dispatch(fetchProvinciasByDepartamento(formData.id_departamento));
    }
  };

  const handleDistritoSubmit = async (data: Omit<Distrito, 'id_distrito'>) => {
    dispatch(addDistrito({
      nombreDistrito: data.nombre_distrito,
      idProvincia: data.id_provincia
    }));
    setIsDistritoModalOpen(false);
    if (formData.id_provincia) {
      dispatch(getDistritosByProvincia(formData.id_provincia));
    }
  };

  const handleLocalidadSubmit = async (data: Omit<Localidad, 'id_localidad'>) => {
    dispatch(addLocalidad({
      nombreLocalidad: data.nombre_localidad,
      idDistrito: data.id_distrito
    }));
    setIsLocalidadModalOpen(false);
    if (formData.id_distrito) {
      dispatch(getDistritosByProvincia(formData.id_distrito));
    }
  };

  const activeProyecto = useSelector((state: RootState) => state.activeData.activeProyecto);

  console.log(activeProyecto)

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="pb-6">
          <div className="border-b rounded-lg border-gray-700 bg-gray-900 flex flex-row justify-between items-center px-6 py-2">
            <h2 className="text-xl font-bold text-cyan-400">
              {editMode ? initialData?.nombre_proyecto : 'Nuevo Proyecto'}
            </h2>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors"
              onClick={handleSubmit}
              >
              {isSubmitting ? (editMode ? 'Actualizando...' : 'Creando...') : (editMode ? 'Actualizar' : 'Crear')}
            </button>
          </div>

          <div className="space-y-1 pt-2 px-6">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-400 text-xs font-medium">Nombre del Proyecto</label>
              <input
                className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={formData.nombre_proyecto}
                onChange={(e) => handleChange('nombre_proyecto', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-400 text-xs font-medium">Infraestructura</label>
              <select
                value={formData.id_infraestructura}
                onChange={(e) => handleChange('id_infraestructura', e.target.value)}
                className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione infraestructura</option>
                {infraestructuras.map((inf: Infraestructura) => (
                  <option key={inf.id_infraestructura} value={inf.id_infraestructura}>
                    {inf.nombre_infraestructura}
                  </option>
                ))}
              </select>
            </div>

            {/* Sección Ubicación */}
            <div className="grid grid-cols-2 gap-x-4">
              {/* Sección Departamento con FiPlus */}
              <div className="space-y-1">
              <label className="block text-gray-400 text-xs font-medium">Departamento</label>
              <div className="flex gap-1">
                <select
                value={formData.id_departamento}
                onChange={(e) => handleChange('id_departamento', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 text-gray-100 text-xs rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
                >
                <option value="">Seleccione departamento</option>
                {departamentos.map((dep: Departamento) => (
                  <option key={dep.id_departamento} value={dep.id_departamento}>
                  {dep.nombre_departamento}
                  </option>
                ))}
                </select>
                <button
                type="button"
                onClick={() => setIsDepartamentoModalOpen(true)}
                className="p-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
                >
                <FiPlus className="h-4 w-4" />
                </button>
              </div>
              </div>

              {/* Sección Provincia con FiPlus */}
              {formData.id_departamento && (
              <div className="space-y-1">
                <label className="block text-gray-400 text-xs font-medium">Provincia</label>
                <div className="flex gap-1">
                <select
                  value={formData.id_provincia}
                  onChange={(e) => handleChange('id_provincia', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 text-gray-100 text-xs rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione provincia</option>
                  {provincias.map((prov: Provincia) => (
                  <option key={prov.id_provincia} value={prov.id_provincia}>
                    {prov.nombre_provincia}
                  </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsProvinciaModalOpen(true)}
                  className="p-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
                </div>
              </div>
              )}

              {/* Sección Distrito con FiPlus */}
              {formData.id_provincia && (
              <div className="space-y-1">
                <label className="block text-gray-400 text-xs font-medium">Distrito</label>
                <div className="flex gap-1">
                <select
                  value={formData.id_distrito}
                  onChange={(e) => handleChange('id_distrito', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 text-gray-100 text-xs rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione distrito</option>
                  {distritos.map((dist: Distrito) => (
                  <option key={dist.id_distrito} value={dist.id_distrito}>
                    {dist.nombre_distrito}
                  </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsDistritoModalOpen(true)}
                  className="p-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
                </div>
              </div>
              )}

              {/* Sección Localidad con FiPlus */}
              {formData.id_distrito && (
              <div className="space-y-1">
                <label className="block text-gray-400 text-xs font-medium">Localidad</label>
                <div className="flex gap-1">
                <select
                  value={formData.id_localidad}
                  onChange={(e) => handleChange('id_localidad', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 text-gray-100 text-xs rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione Localidad</option>
                  {localidades.map((loc: Localidad) => (
                  <option key={loc.id_localidad} value={loc.id_localidad}>
                    {loc.nombre_localidad}
                  </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsLocalidadModalOpen(true)}
                  className="p-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
                </div>
              </div>
              )}
            </div>



            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-2">
                <label className="block text-gray-400 text-xs font-medium">Cliente</label>
                <input
                  className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={formData.cliente}
                  onChange={(e) => handleChange('cliente', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-400 text-xs font-medium">Empresa</label>
                <input
                  className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={formData.empresa}
                  onChange={(e) => handleChange('empresa', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6">
              <div className="space-y-2">
                <label className="block text-gray-400 text-xs font-medium">Plazo (días)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={formData.plazo}
                  onChange={(e) => handleChange('plazo', parseInt(e.target.value))}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-400 text-xs font-medium">Presupuesto Base</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={formData.ppto_base}
                  onChange={(e) => handleChange('ppto_base', parseFloat(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-400 text-xs font-medium">Presupuesto Oferta</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-xs border border-gray-600 text-gray-100 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={formData.ppto_oferta}
                  onChange={(e) => handleChange('ppto_oferta', parseFloat(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>            
        </form>
      </div>

      {/* Renderizado condicional de modales */}
      {isDepartamentoModalOpen && (
        <Modal
          isOpen={isDepartamentoModalOpen}
          onClose={() => setIsDepartamentoModalOpen(false)}
          title="Nuevo Departamento"
        >
          <DepartamentoForm onSubmit={handleDepartamentoSubmit} />
        </Modal>
      )}

      {isProvinciaModalOpen && (
        <Modal
          isOpen={isProvinciaModalOpen}
          onClose={() => setIsProvinciaModalOpen(false)}
          title="Nueva Provincia"
        >
          <ProvinciaForm onSubmit={handleProvinciaSubmit} />
        </Modal>
      )}

      {isDistritoModalOpen && (
        <Modal
          isOpen={isDistritoModalOpen}
          onClose={() => setIsDistritoModalOpen(false)}
          title="Nuevo Distrito"
        >
          <DistritoForm onSubmit={handleDistritoSubmit} />
        </Modal>
      )}

      {isLocalidadModalOpen && (
        <Modal
          isOpen={isLocalidadModalOpen}
          onClose={() => setIsLocalidadModalOpen(false)}
          title="Nueva Localidad"
        >
          <LocalidadForm onSubmit={handleLocalidadSubmit} />
        </Modal>
      )}

    </div>
  );
};

export default ProyectoForm;