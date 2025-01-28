import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaFolder, FaFolderOpen } from 'react-icons/fa';
import { fetchRecursos, Recurso } from '../../../slices/recursoSlice';
import { fetchRecursosComposicionApu, RecursoComposicionApu } from '../../../slices/recursoComposicionApuSlice';
import CrearRecursoApuForm from './CrearRecursoApuForm';
import Modal from '../../../components/Modal/Modal';
import { addComposicionApu } from '../../../slices/composicionApuSlice';
import ModalAlert, { ColorVariant } from '../../../components/Modal/ModalAlert';



interface ITipoNode {
  id_tipo: string;
  descripcion: string;
  isActive: boolean;
}

interface CatalogoRecursosProps {
  onClose: () => void;
}

const CatalogoRecursos: React.FC<CatalogoRecursosProps> = (
  { onClose }
) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [tiposTree, setTiposTree] = useState<ITipoNode[]>([
    { id_tipo: 'TIP0000000001', descripcion: 'MANO DE OBRA', isActive: false },
    { id_tipo: 'TIP0000000002', descripcion: 'MATERIALES', isActive: false },
    { id_tipo: 'TIP0000000003', descripcion: 'EQUIPO', isActive: false },
    { id_tipo: 'TIP0000000004', descripcion: 'SUB-CONTRATOS', isActive: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [acumuladorRecursos, setAcumuladorRecursos] = useState<RecursoComposicionApu[]>([]);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: ColorVariant;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'blue',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const recursos = useSelector((state: RootState) => state.recurso.recursos);
  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  const activeTitulo = useSelector((state: RootState) => state.activeData.activeTitulo);
  const recursosComposicionApu = useSelector(
    (state: RootState) => state.recursoComposicionApu.recursosComposicionApu
  );

  useEffect(() => {
    dispatch(fetchRecursos());
    dispatch(fetchRecursosComposicionApu());
  }, [dispatch]);

  const handleTipoClick = (tipoId: string) => {
    setTiposTree(prev => prev.map(tipo => ({
      ...tipo,
      isActive: tipo.id_tipo === tipoId ? !tipo.isActive : false
    })));
    setSelectedTipo(tipoId);
  };

  const filteredRecursos = recursos.filter(
    recurso => recurso.id_tipo === selectedTipo
  );

  const filteredRecursosComposicionApu = recursosComposicionApu.filter(
    rca => recursos.find(
      r => r.id_recurso === rca.id_recurso && r.id_tipo === selectedTipo
    )
  );

  // Modificar la función filterResources
  const filterResources = (resources: Recurso[] | RecursoComposicionApu[]) => {
    const searchTermLower = searchTerm.toLowerCase();
    return resources.filter(resource => {
      // Verificar si el recurso ya está en el acumulador
      const isInAcumulador = isRecursoComposicionApu(resource)
        ? acumuladorRecursos.some(r => r.id_rec_comp_apu === resource.id_rec_comp_apu)
        : acumuladorRecursos.some(r => r.id_recurso === resource.id_recurso);

      // Si ya está en el acumulador, no lo mostramos
      if (isInAcumulador) return false;

      const nameMatch = resource.nombre.toLowerCase().includes(searchTermLower);
      const idMatch = isRecursoComposicionApu(resource)
        ? resource.id_rec_comp_apu.toLowerCase().includes(searchTermLower)
        : resource.id_recurso.toLowerCase().includes(searchTermLower);
      return nameMatch || idMatch;
    });
  };

  // Añadir esta función helper antes del return
  const isRecursoComposicionApu = (
    recurso: Recurso | RecursoComposicionApu
  ): recurso is RecursoComposicionApu => {
    return 'id_rec_comp_apu' in recurso;
  };

  const handleAddToAcumulador = (recurso: Recurso | RecursoComposicionApu) => {
    if (isRecursoComposicionApu(recurso)) {
      setAcumuladorRecursos(prev => [...prev, recurso]);
    } else {
      setSelectedRecurso(recurso);
      setShowForm(true);
    }
  };

  const handleRemoveFromAcumulador = (id: string) => {
    setAcumuladorRecursos(prev => prev.filter(r => r.id_rec_comp_apu !== id));
  };

  const handleRecursoApuCreated = (nuevoRecursoApu: RecursoComposicionApu) => {
    setAcumuladorRecursos(prev => [...prev, nuevoRecursoApu]);
    setShowForm(false);
    setSelectedRecurso(null);
  };

  const handleSubmitRecursos = async () => {
    if (acumuladorRecursos.length === 0) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'No hay recursos para enviar',
        variant: 'red',
        onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!activeTitulo) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'No hay un título seleccionado',
        variant: 'blue',
        onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }

    try {
      // Crear una nueva composición APU por cada recurso acumulado
      for (const recurso of acumuladorRecursos) {
        const nuevaComposicion: IComposicionApu = {
          id_composicion_apu: '',
          id_rec_comp_apu: recurso.id_rec_comp_apu,
          id_titulo: activeTitulo.id_titulo,
          cuadrilla: 0,
          cantidad: 0,
        };

        await dispatch(addComposicionApu(nuevaComposicion));
      }

      setAcumuladorRecursos([]);
      setAlertModal({
        isOpen: true,
        title: 'Éxito',
        message: 'Recursos enviados exitosamente',
        variant: 'green',
        onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
      });
      onClose();
    } catch (error) {
      console.error('Error al enviar recursos:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al enviar recursos',
        variant: 'red',
        onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
      });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-[calc(100vh-9rem)] w-full bg-gray-300 rounded-lg overflow-hidden">
        <div className="flex flex-1">
          {/* Panel izquierdo - Árbol de tipos */}
          <div className="w-[full] md:w-56 lg:min-w-[20rem] bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">
                Catálogo de Recursos
              </h2>

            </div>
            <div className=" overflow-y-auto">
              {tiposTree.map((tipo) => (
                <motion.div
                  key={tipo.id_tipo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="cursor-pointer"
                >
                  <div
                    onClick={() => handleTipoClick(tipo.id_tipo)}
                    className={`flex items-center p-3 hover:bg-gray-50 ${selectedTipo === tipo.id_tipo ? 'bg-blue-50' : ''
                      }`}
                  >
                    <span className="mr-2">
                      {tipo.isActive ? (
                        <FaFolderOpen className="text-blue-500" />
                      ) : (
                        <FaFolder className="text-yellow-500" />
                      )}
                    </span>
                    <span className="text-sm text-gray-700">{tipo.descripcion}</span>
                    <FaChevronRight
                      className={`ml-auto transform transition-transform ${tipo.isActive ? 'rotate-90' : ''
                        }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Panel central - Lista de recursos */}
          <div className="flex-1 h-[calc(100vh-14rem)] min-w-0 lg:max-w-5xl">
            <div className="p-2 bg-white border-b border-gray-200">
              {/* Barra de búsqueda y botones */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    -
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                    -
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    -
                  </button>
                </div>
              </div>
            </div>

            <div className="h-[calc(100vh-28rem)] p-4 overflow-y-auto">
              <AnimatePresence>
                {selectedTipo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    {/* Recursos de composición APU */}
                    {filterResources(filteredRecursosComposicionApu).map((rca) => {
                      if (!isRecursoComposicionApu(rca)) return null;
                      return (
                        <motion.div
                          key={rca.id_recurso}
                          className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow grid grid-cols-5 gap-2 items-center"
                        >
                          <div className="col-span-3">
                            <h3 className="font-medium text-sm text-gray-800 break-words">
                              {rca.nombre}
                            </h3>
                            <p className="text-xs text-gray-500">
                              ID: {rca.id_rec_comp_apu} <span className='text-gray-300'>(recurso APU)</span>
                            </p>
                          </div>
                            <p className="text-blue-600">
                              {unidades.find(und => und.id_unidad === rca.id_unidad)?.abreviatura_unidad}
                            </p>
                            <button
                              onClick={() => handleAddToAcumulador(rca)}
                              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                            >
                              Añadir al acumulador
                            </button>
                        </motion.div>
                      );
                    })}

                    {/* Recursos normales */}
                    {filterResources(filteredRecursos).map((recurso) => (
                      <motion.div
                        key={recurso.id_recurso}
                        className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow grid grid-cols-5 gap-2 items-center"
                      >
                        <div className="col-span-3">
                          <h3 className="font-medium text-sm text-gray-800 break-words">
                            {recurso.nombre}
                          </h3>
                          <p className="text-xs text-gray-500">
                            ID: {recurso.id_recurso} <span className='text-gray-300'>(recurso materia prima)</span>
                          </p>
                        </div>
                        <p className="text-blue-600">
                            {unidades.find(und => und.id_unidad === recurso.id_unidad)?.abreviatura_unidad}
                          </p>
                          <button
                            onClick={() => handleAddToAcumulador(recurso)}
                            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-md text-sm"
                          >
                            Crear APU y añadir
                          </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Acumulador de recursos */}
            <div className="h-full px-4 py-2 border-t-2 border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-800 sticky top-0">Recursos Acumulados</h3>
                <button
                  onClick={handleSubmitRecursos}
                  className="px-3 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                >
                  Enviar Recursos
                </button>
              </div>
              <div className="h-44 space-y-2 overflow-y-auto">
                {acumuladorRecursos.map((recurso) => (
                  <div key={recurso.id_rec_comp_apu} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-xs text-slate-800">{recurso.nombre} - {unidades.find(und => und.id_unidad === recurso.id_unidad)?.abreviatura_unidad}</span>
                    <button
                      onClick={() => handleRemoveFromAcumulador(recurso.id_rec_comp_apu)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reemplazar el panel derecho por el Modal */}
        {showForm && <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Crear Recurso APU"
        >
          <CrearRecursoApuForm
            recurso={selectedRecurso!}
            onSuccess={handleRecursoApuCreated}
            onCancel={() => setShowForm(false)}
          />
        </Modal>}
      </div>
      <ModalAlert
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
        onConfirm={alertModal.onConfirm}
        onCancel={alertModal.onCancel}
      />
    </>
  );
};

export default CatalogoRecursos;