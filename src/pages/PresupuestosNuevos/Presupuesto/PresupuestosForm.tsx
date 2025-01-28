import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import type { IPresupuesto } from '../../../types/PresupuestosTypes';
import { fetchProyectos } from '../../../slices/proyectosSlice';

interface PresupuestosFormProps {
  initialValues?: IPresupuesto;
  onSubmit: (data: Omit<IPresupuesto, 'id_presupuesto'>) => void;
}

const PresupuestosForm: React.FC<PresupuestosFormProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { proyectos } = useSelector((state: RootState) => state.proyectos);

  useEffect(() => {
    dispatch(fetchProyectos());
  }, [dispatch]);

  const [formData, setFormData] = React.useState<Omit<IPresupuesto, 'id_presupuesto' | 'numeracion_presupuesto'>>({
    nombre_presupuesto: initialValues?.nombre_presupuesto || '',
    fecha_creacion: initialValues?.fecha_creacion || new Date().toISOString(),
    plazo: initialValues?.plazo || 0,
    ppto_base: initialValues?.ppto_base || 0,
    ppto_oferta: initialValues?.ppto_oferta || 0,
    id_proyecto: initialValues?.id_proyecto || '',
    costo_directo: initialValues?.costo_directo || 0,
    porcentaje_utilidad: initialValues?.porcentaje_utilidad || 0,
    monto_utilidad: initialValues?.monto_utilidad || 0,
    porcentaje_igv: initialValues?.porcentaje_igv || 0,
    monto_igv: initialValues?.monto_igv || 0,
    parcial_presupuesto: initialValues?.parcial_presupuesto || 0,
    total_presupuesto: initialValues?.total_presupuesto || 0,
    observaciones: initialValues?.observaciones || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) :
              name === 'fecha_creacion' ? value :
              value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-8">
        {/* Descripción */}
        <div className="col-span-2">
          <label htmlFor="nombre_presupuesto" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Presupuesto
          </label>
          <input
            type="text"
            id="nombre_presupuesto"
            name="nombre_presupuesto"
            value={formData.nombre_presupuesto}
            onChange={handleChange}
            className="w-full min-h-[60px] px-4 py-3 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     text-gray-700 bg-gray-50/50"
            required
            placeholder="Ingrese el nombre del presupuesto"
          />
        </div>

        {/* Fecha */}
        <div className="col-span-1">
          <label htmlFor="fecha_creacion" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            id="fecha_creacion"
            name="fecha_creacion"
            value={formData.fecha_creacion.toString().split('T')[0]}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     text-gray-700 bg-gray-50/50"
            required
          />
        </div>

        {/* Plazo */}
        <div className="col-span-1">
          <label htmlFor="plazo" className="block text-sm font-medium text-gray-700 mb-2">
            Plazo (días)
          </label>
          <input
            type="number"
            id="plazo"
            name="plazo"
            value={formData.plazo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     text-gray-700 bg-gray-50/50"
            required
          />
        </div>

        {/* Presupuesto Base */}
        <div className="col-span-1">
          <label htmlFor="ppto_base" className="block text-sm font-medium text-gray-700 mb-2">
            Presupuesto Base
          </label>
          <input
            type="number"
            id="ppto_base"
            name="ppto_base"
            value={formData.ppto_base}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     text-gray-700 bg-gray-50/50"
            required
          />
        </div>

        {/* Presupuesto Oferta */}
        <div className="col-span-1">
          <label htmlFor="ppto_oferta" className="block text-sm font-medium text-gray-700 mb-2">
            Presupuesto Oferta
          </label>
          <input
            type="number"
            id="ppto_oferta"
            name="ppto_oferta"
            value={formData.ppto_oferta}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     text-gray-700 bg-gray-50/50"
            required
          />
        </div>

        {/* Proyecto Select - Reemplaza el input anterior de id_proyecto */}
        <div className="col-span-2">
          <label htmlFor="id_proyecto" className="block text-sm font-medium text-gray-700 mb-2">
            Proyecto
          </label>
          <select
            id="id_proyecto"
            name="id_proyecto"
            value={formData.id_proyecto}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     text-gray-700 bg-gray-50/50
                     appearance-none bg-white"
            required
          >
            <option value="">Seleccione un proyecto</option>
            {proyectos && proyectos.map(proyecto => (
              <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                {proyecto.nombre_proyecto}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón Submit */}
      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   transform transition-all duration-200 ease-in-out
                   hover:shadow-lg active:scale-95"
        >
          {initialValues ? 'Actualizar' : 'Crear'} Presupuesto
        </button>
      </div>
    </form>
  );
};

export default PresupuestosForm;
