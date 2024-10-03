import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FiX } from 'react-icons/fi';



interface Recurso {
  id: number;
  codigo: string;
  nombre: string;
  cantidad: number;
}

interface FormData {
  obra: string;
  usuarioId: string;
  sustento: string;
  recursos: Recurso[];
}

interface RecursoListItem {
  recurso_id: number;
  codigo: string;
  nombre: string;
}

interface PedirRequerimientoProps {
  recursosList: RecursoListItem[];
  onSubmit: (formData: FormData) => void;
}

interface FocusedResource {
  index: number;
  field: 'codigo' | 'nombre';
  value: string;
}

const PedirRequerimiento: React.FC<PedirRequerimientoProps> = ({ recursosList, onSubmit }) => {
  console.log(onSubmit)
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<FormData>({
    obra: '',
    usuarioId: user.id ?? '',
    sustento: '',
    recursos: [{ id: Date.now(), codigo: '', nombre: '', cantidad: 0 }]
  });
  const [filteredResources, setFilteredResources] = useState<RecursoListItem[]>([]);
  const [focusedResource, setFocusedResource] = useState<FocusedResource | null>(null);

  useEffect(() => {
    if (focusedResource) {
      const { field, value } = focusedResource;
      if (value.length >= 2) {
        const filtered = recursosList.filter(recurso =>
          recurso[field].toLowerCase().includes(value.toLowerCase())
        );
        setFilteredResources(filtered);
      } else {
        setFilteredResources([]);
      }
    }
  }, [focusedResource, recursosList]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number | null = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newRecursos = [...formData.recursos];
      newRecursos[index] = { ...newRecursos[index], [name]: name === 'cantidad' ? Number(value) : value };
      setFormData({ ...formData, recursos: newRecursos });
      if (name === 'codigo' || name === 'nombre') {
        setFocusedResource({ index, field: name, value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleResourceSelection = (index: number, selectedResource: RecursoListItem) => {
    const newRecursos = [...formData.recursos];
    newRecursos[index] = {
      ...newRecursos[index],
      codigo: selectedResource.codigo,
      nombre: selectedResource.nombre
    };
    setFormData({ ...formData, recursos: newRecursos });
    setFilteredResources([]);
    setFocusedResource(null);
  };

  const addNewRow = () => {
    setFormData({
      ...formData,
      recursos: [...formData.recursos, { id: Date.now(), codigo: '', nombre: '', cantidad: 0 }]
    });
  };

  const removeRow = (id: number) => {
    setFormData({
      ...formData,
      recursos: formData.recursos.filter(recurso => recurso.id !== id)
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // onSubmit(formData);
  };



  return (
    <motion.div className="flex flex-col h-full">
      <motion.div className="text-white p-4 flex items-center justify-between">
        <motion.h1 className="text-lg font-bold">
          Requerimiento
        </motion.h1>
      </motion.div>

      <motion.div className="flex flex-1 overflow-hidden rounded-md">
        <main className="w-full flex flex-col flex-grow p-4 bg-white/75 overflow-hidden">
          <h3 className='text-xs/tight text-gray-600/30 mb-2'>Userid:{formData.usuarioId.slice(0, 5)} </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-12 gap-0.5">
              <input
                type="text"
                name="obra"
                value={formData.obra}
                onChange={handleInputChange}
                placeholder="Obra"
                className="px-2 border rounded text-xs col-span-4 md:col-span-1"
                required
                autoComplete="off"
              />
              <textarea
                name="sustento"
                value={formData.sustento}
                onChange={handleInputChange}
                placeholder="Sustento"
                className="w-full p-2 border rounded text-xs col-span-8 md:col-span-11"
                rows={1}
                required
                autoComplete="off"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Recursos</h3>
            <div className='overflow-x-auto h-80'>
              {formData.recursos.map((recurso, index) => (
                <div key={recurso.id} className="grid mb-0.5 grid-cols-12 gap-0.5">
                  <input
                    type="text"
                    name="codigo"
                    value={recurso.codigo}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Código"
                    autoComplete="off"
                    className="px-1 md:px-2 border rounded text-[8px] md:text-xs flex-1 col-span-2 md:col-span-1"
                  />
                  <input
                    type="text"
                    name="nombre"
                    value={recurso.nombre}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Nombre"
                    autoComplete="off"
                    className="px-1 md:px-2 border rounded text-[8px] md:text-xs flex-1 col-span-7 md:col-span-9"
                  />
                  <input
                    type="number"
                    name="cantidad"
                    value={recurso.cantidad}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Cantidad"
                    className="px-1 md:px-2 border rounded text-[8px] md:text-xs col-span-2 md:col-span-1"
                    autoComplete="off"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(recurso.id)}
                    className="px-0 md:px-2 bg-red-500 text-white flex justify-center items-center p-0 md:p-1 align-middle rounded col-span-1 md:col-span-1"
                  >
                    <FiX className='h-2 w-2 md:h-4 md:w-4' />
                  </button>
                </div>
              ))}
              {/* {focusedResource && filteredResources.length > 0 && (
                <div className="border rounded  max-h-40 overflow-y-auto">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.recurso_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-xs z-50"
                      onClick={() => handleResourceSelection(focusedResource.index, resource)}
                    >
                      {resource.codigo} - {resource.nombre}
                    </div>
                  ))}
                </div>
              )} */}
              
                {focusedResource && filteredResources.length > 0 && (
                  <div
                    className="border rounded max-h-40 overflow-y-auto bg-amber-200"
                    style={{
                      position: 'absolute',
                      bottom: 50,
                      left: 150,
                      zIndex: 50,
                    }}
                  >
                    {filteredResources.map((resource) => (
                      <div
                        key={resource.recurso_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-[8px] md:text-xs"
                        onClick={() => handleResourceSelection(focusedResource.index, resource)}
                      >
                        {resource.codigo} - {resource.nombre}
                      </div>
                    ))}
                  </div>
                )}
              

            </div>
            <div className='flex justify-between'>
              <button
                type="button"
                onClick={addNewRow}
                className="p-2 bg-blue-500 text-white text-[8px] md:text-xl rounded mx-2 md:mx-10"
              >
                Añadir fila
              </button>
              <button
                type="submit"
                className="p-2 bg-green-500 text-white text-[8px] md:text-xl rounded mx-2 md:mx-10"
              >
                Enviar Requerimiento
              </button>
            </div>
          </form>
        </main>
      </motion.div>
    </motion.div>
  );
};

export default PedirRequerimiento;