import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { deleteComposicionApu, getComposicionesApuByTitulo, updateComposicionApu } from '../../../slices/composicionApuSlice';
import { FaToolbox, FaFileContract, FaPlus, FaTrash } from 'react-icons/fa';
import { BsClock, BsPersonStanding, BsTools } from 'react-icons/bs';
import { MdSmartButton } from 'react-icons/md';
import Modal from '../../../components/Modal/Modal';
import { addPrecioRecursoProyecto, updatePrecioRecursoProyecto } from '../../../slices/precioRecursoProyectoSlice';
import { updateDetallePartida } from '../../../slices/detallePartidaSlice';
import CatalogoRecursos from './CatalogoRecursos';
import { updateRecursoComposicionApu } from '../../../slices/recursoComposicionApuSlice';
import ModalAlert from '../../../components/Modal/ModalAlert';

export interface IComposicionApu {
  id_composicion_apu: string;
  id_titulo: string;
  id_rec_comp_apu: string;
  rec_comp_apu?: IRecursoComposicionApu;
  cuadrilla: number;
  cantidad: number;
}

export interface IRecursoComposicionApu {
  id_rec_comp_apu: string;
  id_recurso: string;
  id_unidad: string;
  nombre: string;
  especificaciones?: string;
  descripcion?: string;
  fecha_creacion: string;
  precio_recurso_proyecto?: IPrecioRecursoProyecto;
  recurso_presupuesto?:RecursoPresupuesto;
  unidad_presupuesto?:UnidadPresupuesto;

}

export interface IPrecioRecursoProyecto {
  id_prp: string;
  id_proyecto: string;
  id_rec_comp_apu: string;
  precio: number;
}

export interface RecursoPresupuesto {
  id_recurso: string;
  id_unidad: string;
  id_clase: string;
  id_tipo: string;
  tipo?: ITipo;
  id_recurso_app: string;
  nombre: string;
  precio_referencial: number;
  fecha_actualizacion: string; // Cambiado de Date a string
}

export interface UnidadPresupuesto {
  id_unidad: string;
  abreviatura_unidad: string;
  descripcion: string;
}

export interface IClase {
  id_clase: string;
  nombre: string;
}

export interface ITipo {
  id_tipo: string;
  descripcion: string;
  codigo: string;
}

interface CompositionTableProps {
  className?: string;
}

const APU: React.FC<CompositionTableProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeProyecto = useSelector((state: RootState) => state.activeData.activeProyecto);
  const activeTitulo = useSelector((state: RootState) => state.activeData.activeTitulo);
  const composiciones = useSelector((state: RootState) => state.composicionApu.composicionesApu);
  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  const tipos = useSelector((state: RootState) => state.tipo.tipos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedComposicion, setSelectedComposicion] = useState<IComposicionApu | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [totalCalculado, setTotalCalculado] = useState<number>(0);

  useEffect(() => {
    if (activeTitulo?.id_titulo) {
      if (activeProyecto) {
        dispatch(getComposicionesApuByTitulo({
          id_titulo: activeTitulo.id_titulo,
          id_proyecto: activeProyecto.id_proyecto
        }));
      }
    }
  }, [activeTitulo, dispatch]);

  console.log(activeTitulo)

  // Función auxiliar para calcular el total
  const calcularTotal = (composicionesArray: IComposicionApu[]) => {
    const total = composicionesArray.reduce(
      (sum, comp) =>
        sum + (comp.cantidad || 0) * (comp.rec_comp_apu?.precio_recurso_proyecto?.precio || 0),
      0
    );
    console.log('🔄 Calculando nuevo total:', total);
    return total;
  };

  // useEffect para actualizar el total local
  useEffect(() => {
    const total = calcularTotal(composiciones);
    setTotalCalculado(total);
    console.log('💫 Total actualizado en estado local:', total);
  }, [composiciones]);

  // useEffect separado para actualizar el detalle de partida
  useEffect(() => {
    const actualizarPrecioDetalle = async () => {
      if (activeTitulo?.detallePartida && totalCalculado !== activeTitulo.detallePartida.precio) {
        console.log('📝 Intentando actualizar detalle partida. Precio actual:', activeTitulo.detallePartida.precio, 'Nuevo precio:', totalCalculado);
        
        const detalleActualizado = {
          ...activeTitulo.detallePartida,
          precio: totalCalculado
        };

        try {
          console.log('🚀 Enviando actualización al servidor...');
          const resultado = await dispatch(updateDetallePartida(detalleActualizado)).unwrap();
          console.log('✅ Actualización completada:', resultado);
        } catch (error) {
          console.error('❌ Error al actualizar el precio del detalle:', error);
        }
      }
    };

    actualizarPrecioDetalle();
  }, [totalCalculado, activeTitulo?.detallePartida, dispatch]);

  const containerVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } } };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleOpenModal = (composicion?: IComposicionApu) => {
    if (!activeTitulo?.detallePartida?.id_detalle_partida) {
      setIsAlertOpen(true);
      return;
    }
    setSelectedComposicion(composicion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComposicion(undefined);
  };

  const handleDelete = (composicion: IComposicionApu) => {
    dispatch(deleteComposicionApu(composicion.id_composicion_apu));
  };

  const handleStartEditing = (composicion: IComposicionApu, field: string, value: number | null) => {
    setEditingId(composicion.id_composicion_apu);
    setEditingField(field);
    setEditingValue(value?.toString() || '');
  };

  const handleEditingChange = (value: string) => {
    setEditingValue(value);
  };

  // Modificar la función handleFinishEditing para asegurarnos de que se dispare el useEffect
  const handleFinishEditing = async (composicion: IComposicionApu) => {
    if (!editingField) return;

    const numericValue = parseFloat(editingValue) || 0;
    console.log('🖊️ Iniciando edición:', { campo: editingField, valor: numericValue });

    try {
        if (editingField === 'precio' && composicion.rec_comp_apu) {
            if (!composicion.rec_comp_apu.precio_recurso_proyecto) {
                await dispatch(addPrecioRecursoProyecto({
                    idProyecto: activeProyecto?.id_proyecto || '',
                    idRecCompApu: composicion.id_rec_comp_apu,
                    precio: numericValue
                })).unwrap();
            } else {
                await dispatch(updatePrecioRecursoProyecto({
                    ...composicion.rec_comp_apu.precio_recurso_proyecto,
                    precio: numericValue
                })).unwrap();
            }
        } else {
            const updatedComposicion = {
                ...composicion,
                [editingField]: numericValue
            };
            console.log('📊 Actualizando composición:', updatedComposicion);
            await dispatch(updateComposicionApu(updatedComposicion)).unwrap();
        }
        
        // Forzar la actualización del estado después de cada edición
        if (activeTitulo?.id_titulo && activeProyecto) {
            console.log('🔄 Recargando composiciones...');
            await dispatch(getComposicionesApuByTitulo({
                id_titulo: activeTitulo.id_titulo,
                id_proyecto: activeProyecto.id_proyecto
            }));
        }
    } catch (error) {
        console.error('❌ Error en la actualización:', error);
    }

    setEditingId(null);
    setEditingField(null);
};

  const handleUnitChange = async (composicion: IComposicionApu, unidadId: string) => {
    if (!composicion.rec_comp_apu) return;

    try {
      await dispatch(updateRecursoComposicionApu({
        ...composicion.rec_comp_apu,
        id_unidad: unidadId
      }));
    } catch (error) {
      console.error('Error al actualizar la unidad:', error);
    } finally {
      setEditingUnitId(null);
    }
  };

  // Agregar esta función para calcular subtotales por tipo
  const calcularSubtotalPorTipo = (tipoId: string) => {
    return composiciones
      .filter(comp => comp.rec_comp_apu?.recurso_presupuesto?.id_tipo === tipoId)
      .reduce((sum, comp) =>
        sum + (comp.cantidad || 0) * (comp.rec_comp_apu?.precio_recurso_proyecto?.precio || 0),
        0
      );
  };

  console.log(composiciones);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-gray-50 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header con botón nuevo */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-0.5 rounded-t-lg border-b border-gray-200">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-6 items-center">
                <span className="text-lg font-semibold text-gray-800 flex flex-row">
                  {activeTitulo?.item}<p className='font-normal ml-4'>{activeTitulo?.descripcion}</p>
                </span>
                <div className="flex items-center px-3 py-1 bg-white rounded-md shadow-sm border border-gray-200">
                  <BsClock className="text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Jornada: <span className="text-gray-800">{activeTitulo?.detallePartida?.jornada || 8} hrs</span>
                  </span>
                </div>
                <div className="flex items-center px-3 py-1 bg-white rounded-md shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Nivel:</span>
                  <span className="text-sm text-gray-700">{activeTitulo?.nivel}</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <FaPlus size={12} />
                Nueva Composición
              </button>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col gap-0">
              {tipos.map(tipo => (
                <div key={tipo.id_tipo} className="flex items-center justify-between bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-200 text-xs">
                  <div className="flex items-center gap-1">
                    {tipo.descripcion === 'MANO DE OBRA' && <BsPersonStanding className="text-green-600" />}
                    {tipo.descripcion === 'MATERIALES' && <FaToolbox className="text-red-600" />}
                    {tipo.descripcion === 'EQUIPO' && <BsTools className="text-blue-600" />}
                    {tipo.descripcion === 'SUB-CONTRATOS' && <FaFileContract className="text-lime-500" />}
                    {tipo.descripcion === 'SUB-PARTIDAS' && <MdSmartButton className="text-pink-500" />}
                    <span className="font-medium text-gray-600">{tipo.descripcion}:</span>
                  </div>
                  <span className="text-gray-700 ml-2">S/. {calcularSubtotalPorTipo(tipo.id_tipo).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-center">Tipo</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-left">Descripción</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-center">Und.</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-center">Cuadrilla</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-center">Cantidad</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-right">Precio S/.</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-right">Parcial</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-600 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {composiciones.map((comp) => (
              <motion.tr
                key={comp.id_composicion_apu}
                variants={rowVariants}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-2 py-1 text-center">
                  <div className="flex justify-center">
                    {(() => {
                      const descripcion = comp.rec_comp_apu?.recurso?.tipo?.descripcion || '';
                      switch (descripcion) {
                        case 'MANO DE OBRA':
                          return <BsPersonStanding className="text-green-600" />;
                        case 'MATERIALES':
                          return <FaToolbox className="text-red-600" />;
                        case 'EQUIPO':
                          return <BsTools className="text-blue-600" />;
                        case 'SUB-CONTRATOS':
                          return <FaFileContract className="text-lime-500" />;
                        default:
                          return <MdSmartButton className="text-pink-500" />;
                      }
                    })()}
                  </div>
                </td>
                <td className="px-2 py-1 text-xs text-gray-700">{comp.rec_comp_apu?.nombre}</td>
                <td className="px-2 py-1 text-xs text-gray-600 text-center w-24">
                  {editingUnitId === comp.id_composicion_apu ? (
                    <select
                      className="w-24 text-xs border rounded text-center bg-white"
                      value={comp.rec_comp_apu?.id_unidad || ''}
                      onChange={(e) => handleUnitChange(comp, e.target.value)}
                      onBlur={() => setEditingUnitId(null)}
                      autoFocus
                    >
                      <option value="">Seleccionar</option>
                      {unidades.map(unidad => (
                        <option key={unidad.id_unidad} value={unidad.id_unidad}>
                          {unidad.abreviatura_unidad} - {unidad.descripcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 min-h-[1.5rem] flex items-center justify-center"
                      onDoubleClick={() => setEditingUnitId(comp.id_composicion_apu)}
                    >
                      {comp.rec_comp_apu?.unidad?.abreviatura_unidad || '-'}
                    </div>
                  )}
                </td>
                <td className="px-2 py-1 text-xs text-gray-600 text-center w-20">
                  {editingId === comp.id_composicion_apu && editingField === 'cuadrilla' ? (
                    <input
                      type="number"
                      className="w-20 text-xs border rounded text-center bg-white"
                      value={editingValue}
                      onChange={(e) => handleEditingChange(e.target.value)}
                      onBlur={() => handleFinishEditing(comp)}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 min-h-[1.5rem] flex items-center justify-center"
                      onDoubleClick={() => handleStartEditing(comp, 'cuadrilla', comp.cuadrilla || 0)}
                    >
                      {comp.cuadrilla || '-'}
                    </div>
                  )}
                </td>
                <td className="px-2 py-1 text-xs text-gray-600 text-center w-20">
                  {editingId === comp.id_composicion_apu && editingField === 'cantidad' ? (
                    <input
                      type="number"
                      step="0.01"
                      className="w-20 text-xs border rounded text-center bg-white"
                      value={editingValue}
                      onChange={(e) => handleEditingChange(e.target.value)}
                      onBlur={() => handleFinishEditing(comp)}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 min-h-[1.5rem] flex items-center justify-center"
                      onDoubleClick={() => handleStartEditing(comp, 'cantidad', comp.cantidad || 0)}
                    >
                      {comp.cantidad || '-'}
                    </div>
                  )}
                </td>
                <td className="px-2 py-1 text-xs text-gray-600 text-right w-24">
                  {editingId === comp.id_composicion_apu && editingField === 'precio' ? (
                    <input
                      type="number"
                      step="0.01"
                      className="w-24 text-xs border rounded text-right bg-white"
                      value={editingValue}
                      onChange={(e) => handleEditingChange(e.target.value)}
                      onBlur={() => handleFinishEditing(comp)}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 min-h-[1.5rem] flex items-center justify-end"
                      onDoubleClick={() => handleStartEditing(comp, 'precio', comp.rec_comp_apu?.precio_recurso_proyecto?.precio || 0)}
                    >
                      {comp.rec_comp_apu?.precio_recurso_proyecto?.precio?.toFixed(2) || '-'}
                    </div>
                  )}
                </td>
                <td className="px-2 py-1 text-xs text-gray-700 font-medium text-right">
                  {((comp.cantidad ?? 0) * (comp.rec_comp_apu?.precio_recurso_proyecto?.precio || 0)).toFixed(2)}
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => handleDelete(comp)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with totals */}
      <div className="bg-gray-50 p-2 rounded-b-lg border-t border-gray-200">
        <div className="flex justify-end gap-4">
          <span className="text-xs font-medium text-gray-600">
            Total: S/. {totalCalculado.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedComposicion ? "Editar Composición" : "Nueva Composición"}
      >
        <CatalogoRecursos onClose={handleCloseModal}/>
      </Modal>}

      <ModalAlert
        isOpen={isAlertOpen}
        title="Atención"
        message={`Debe seleccionar una Unidad para la partida "${activeTitulo?.descripcion}" antes de añadir recursos.`}
        onConfirm={() => setIsAlertOpen(false)}
        onCancel={() => setIsAlertOpen(false)}
        variant="yellow"
      />
    </motion.div>
  );
};

export default APU;