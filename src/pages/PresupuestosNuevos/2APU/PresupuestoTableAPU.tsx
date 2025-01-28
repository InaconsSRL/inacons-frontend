import React, { useEffect, useState } from 'react';
import { getTitulosByPresupuesto, updateTitulo, TituloDetailed } from '../../../slices/tituloSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { MdKeyboardArrowRight, MdUnfoldLess, MdUnfoldMore } from 'react-icons/md';
import { IoLayersOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { addDetallePartida, updateDetallePartida } from '../../../slices/detallePartidaSlice';
import { updateActiveTitulo } from '../../../slices/activeDataSlice'

const PresupuestoTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());
  const [editingTituloId, setEditingTituloId] = useState<string | null>(null);
  const [editingMetrado, setEditingMetrado] = useState<{ [key: string]: string }>({});
  const [editingMetradoId, setEditingMetradoId] = useState<string | null>(null);
  const activePresupuesto = useSelector((state: RootState) => state.activeData.activePresupuesto);
  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  const activeTitulo = useSelector((state: RootState) => state.activeData.activeTitulo);
  const titulos = useSelector((state: RootState) => state.titulo.titulos);
  
  // Agregar esta función para ordenar los títulos
  const sortedTitulos = [...titulos].sort((a, b) => {
    return (a.orden || 0) - (b.orden || 0);
  });

  useEffect(() => {
    if (activePresupuesto?.id_presupuesto) {
      dispatch(getTitulosByPresupuesto(activePresupuesto.id_presupuesto))
    }
  }, [dispatch, activePresupuesto]);

  const getIndentation = (nivel: number) => {
    // Usar padding-left directamente en píxeles
    return { paddingLeft: `${(nivel - 1) * 20}px` };
  };

  const getTitleColor = (nivel: number, tipo: string) => {
    if (tipo === 'PARTIDA') return 'text-gray-900';
    switch (nivel) {
      case 1: return 'text-blue-600';
      case 2: return 'text-orange-500';
      case 3: return 'text-red-800';
      case 4: return 'text-pink-500';
      case 5: return 'text-cyan-500';
      default: return 'text-gray-900';
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const toggleCollapse = (itemId: string) => {
    const newCollapsedItems = new Set(collapsedItems);
    if (collapsedItems.has(itemId)) {
      newCollapsedItems.delete(itemId);
    } else {
      newCollapsedItems.add(itemId);
    }
    setCollapsedItems(newCollapsedItems);
  };

  const isVisible = (titulo: TituloDetailed) => {
    const parentItems = sortedTitulos.filter(t => 
      t.item.split('.').length < titulo.item.split('.').length &&
      titulo.item.startsWith(t.item)
    );
    return !parentItems.some(parent => collapsedItems.has(parent.id_titulo));
  };

  const collapseAll = () => {
    const allTitulos = sortedTitulos
      .filter(t => t.tipo !== 'PARTIDA')
      .map(t => t.id_titulo);
    setCollapsedItems(new Set(allTitulos));
  };

  const expandAll = () => {
    setCollapsedItems(new Set());
  };

  const toggleByLevel = (level: number) => {
    const newCollapsedItems = new Set(collapsedItems);
    const levelTitulos = sortedTitulos.filter(t => t.nivel === level && t.tipo !== 'PARTIDA');

    // Si todos los títulos del nivel están colapsados, expandimos
    const allCollapsed = levelTitulos.every(t => collapsedItems.has(t.id_titulo));
    
    levelTitulos.forEach(titulo => {
      if (allCollapsed) {
        newCollapsedItems.delete(titulo.id_titulo);
      } else {
        newCollapsedItems.add(titulo.id_titulo);
      }
    });

    setCollapsedItems(newCollapsedItems);
  };

  const handleUnidadChange = async (titulo: TituloDetailed, unidadId: string) => {
    try {
      let updatedDetalle;
      let updatedTitulo = { ...titulo };
  
      if (titulo.id_detalle_partida) {
        // Actualizar detalle existente
        updatedDetalle = await dispatch(updateDetallePartida({
          id_detalle_partida: titulo.detallePartida?.id_detalle_partida || '',
          id_unidad: unidadId,
          metrado: titulo.detallePartida?.metrado || 0,
          precio: titulo.detallePartida?.precio || 0,
          jornada: titulo.detallePartida?.jornada || 0
        })).unwrap();
      } else {
        // Crear nuevo detalle
        updatedDetalle = await dispatch(addDetallePartida({
          id_unidad: unidadId,
          metrado: 0,
          precio: 0,
          jornada: 0
        })).unwrap();
  
        // Actualizar el título con el nuevo id_detalle_partida
        updatedTitulo = {
          ...titulo,
          id_detalle_partida: updatedDetalle.id_detalle_partida,
          detallePartida: updatedDetalle // Añadir el detalle al título
        };
        
        await dispatch(updateTitulo(updatedTitulo)).unwrap();
        dispatch(getTitulosByPresupuesto(updatedTitulo.id_presupuesto));
      }
    } catch (error) {
      console.error('Error al manejar el cambio de unidad:', error);
    } finally {
      setEditingTituloId(null);
    }
  };
  
  const handleMetradoChange = async (titulo: TituloDetailed, metrado: number) => {
    try {
      let updatedDetalle;
      if (titulo.id_detalle_partida) {
        console.log('Actualizando detalle existente...');
        updatedDetalle = await dispatch(updateDetallePartida({
          id_detalle_partida: titulo.id_detalle_partida,
          id_unidad: titulo.detallePartida?.id_unidad || '',
          metrado,
          precio: titulo.detallePartida?.precio || 0,
          jornada: titulo.detallePartida?.jornada || 0
        })).unwrap();
      } else {
        console.log('Creando nuevo detalle...');
        updatedDetalle = await dispatch(addDetallePartida({
          id_detalle_partida: '',
          id_unidad: '',
          metrado,
          precio: 0,
          jornada: 0
        })).unwrap();

        // Actualizar el título con el nuevo id_detalle_partida
        await dispatch(updateTitulo({
          ...titulo,
          id_detalle_partida: updatedDetalle.id_detalle_partida
        })).unwrap();
      }
  
      // Actualizar el estado local

    } catch (error) {
      console.error('Error al manejar el cambio de metrado:', error);
    }
  };

  const handleMetradoInputChange = (tituloId: string, value: string) => {
    setEditingMetrado(prev => ({
      ...prev,
      [tituloId]: value
    }));
  };

  const handleMetradoBlur = (titulo: TituloDetailed) => {
    const value = editingMetrado[titulo.id_titulo];
    if (value !== undefined) {
      handleMetradoChange(titulo, parseFloat(value) || 0);
      setEditingMetrado(prev => {
        const newState = { ...prev };
        delete newState[titulo.id_titulo];
        return newState;
      });
    }
  };

  const handleMetradoKeyDown = (e: React.KeyboardEvent, titulo: TituloDetailed) => {
    if (e.key === 'Enter') {
      handleMetradoBlur(titulo);
    }
  };
  
  const handleTituloClick = (titulo: TituloDetailed, event: React.MouseEvent) => {
    // Solo actualizar el título activo si el click no fue en un input
    const target = event.target as HTMLElement;
    if (!target.closest('input') && !target.closest('select')) {
      dispatch(updateActiveTitulo(titulo));
      console.log('Título modificado:', titulo.descripcion);
    }
  };

  const handleStartEditingMetrado = (tituloId: string, currentValue: number) => {
    setEditingMetradoId(tituloId);
    setEditingMetrado({
      ...editingMetrado,
      [tituloId]: currentValue.toString()
    });
  };

  const handleFinishEditingMetrado = (titulo: TituloDetailed) => {
    handleMetradoBlur(titulo);
    setEditingMetradoId(null);
  };

  const calcularParcial = (titulo: TituloDetailed): number => {
    if (titulo.tipo === 'PARTIDA') {
      return (titulo.detallePartida?.metrado || 0) * (titulo.detallePartida?.precio || 0);
    }

    // Para títulos, sumar los parciales de los hijos
    const hijosDirectos = sortedTitulos.filter(t => t.id_titulo_padre === titulo.id_titulo);
    return hijosDirectos.reduce((sum, hijo) => sum + calcularParcial(hijo), 0);
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const rowVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  return (
    <div className="mx-auto h-full bg-white shadow-sm border border-gray-200 flex flex-col px-2">
      <motion.div 
        className="bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-semibold text-sm text-gray-800">Hoja del Presupuesto</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={expandAll}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
              title="Expandir todo"
            >
              <MdUnfoldMore className="w-4 h-4" />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={collapseAll}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
              title="Colapsar todo"
            >
              <MdUnfoldLess className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1" /> {/* Separador vertical */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.button
                key={level}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => toggleByLevel(level)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                title={`Toggle nivel ${level}`}
              >
                <IoLayersOutline className="w-3 h-3 mr-1" />
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <div className="overflow-x-auto flex-1 relative">
        <table className="min-w-full divide-y divide-gray-200 text-[11px]">
          <thead className="bg-gray-50 sticky top-[0px] z-10">
            <tr>
              <th className="w-14 px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider border-r bg-gray-50">
                Item
              </th>
              <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider border-r bg-gray-50">
                Descripción
              </th>
              <th className="w-16 px-2 py-1 text-center font-medium text-gray-500 uppercase tracking-wider border-r bg-gray-50">
                Und.
              </th>
              <th className="w-20 px-2 py-1 text-center font-medium text-gray-500 uppercase tracking-wider border-r bg-gray-50">
                Metrado
              </th>
              <th className="w-20 px-2 py-1 text-center font-medium text-gray-500 uppercase tracking-wider border-r bg-gray-50">
                Precio
              </th>
              <th className="w-24 px-2 py-1 text-center font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Parcial
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence initial={false}>
              {sortedTitulos.map((titulo, index) => (
                isVisible(titulo) && (
                  <motion.tr
                    key={titulo.id_titulo}
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className={`
                      ${activeTitulo?.id_titulo === titulo.id_titulo ? 'bg-blue-100 ring-2 ring-blue-200' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-gray-100
                    `}
                    onClick={(e) => handleTituloClick(titulo, e)}
                  >
                    <td className="px-2 py-1 text-gray-900 border-r whitespace-nowrap">
                      {titulo.item}
                    </td>
                    <td className="px-2 py-1 border-r">
                      <div 
                        className="flex items-center"
                        style={getIndentation(titulo.nivel)}
                      >
                        {titulo.tipo !== 'PARTIDA' && (
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevenir que el click del botón active el título
                              toggleCollapse(titulo.id_titulo);
                            }}
                            className="mr-1 focus:outline-none"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <motion.div
                              animate={{ rotate: collapsedItems.has(titulo.id_titulo) ? 0 : 90 }}
                              transition={{ duration: 0.2 }}
                            >
                              {collapsedItems.has(titulo.id_titulo) 
                                ? <MdKeyboardArrowRight className="text-gray-500" />
                                : <MdKeyboardArrowRight className="text-gray-500" />
                              }
                            </motion.div>
                          </motion.button>
                        )}
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`
                            ${getTitleColor(titulo.nivel, titulo.tipo)} 
                            ${titulo.nivel === 1 ? 'font-bold' : ''}
                            ${activeTitulo?.id_titulo === titulo.id_titulo ? 'font-semibold' : ''}
                          `}
                        >
                          {titulo.descripcion}
                        </motion.span>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center text-gray-500 border-r">
                      {titulo.tipo === 'PARTIDA' ? (
                        editingTituloId === titulo.id_titulo ? (
                          <select
                            className="w-full text-xs border rounded"
                            onChange={(e) => handleUnidadChange(titulo, e.target.value)}
                            onBlur={() => setEditingTituloId(null)}
                            value={titulo.detallePartida?.id_unidad || ''}
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
                            className="cursor-pointer hover:bg-gray-100"
                            onDoubleClick={() => setEditingTituloId(titulo.id_titulo)}
                          >
                            {unidades.find(u => u.id_unidad === titulo.detallePartida?.id_unidad)?.abreviatura_unidad || '-'}
                          </div>
                        )
                      ) : ''}
                    </td>
                    <td className="px-2 py-1 text-center text-gray-500 border-r">
                      {titulo.tipo === 'PARTIDA' && (
                        editingMetradoId === titulo.id_titulo ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full text-xs border rounded text-center"
                            value={editingMetrado[titulo.id_titulo] !== undefined 
                              ? editingMetrado[titulo.id_titulo] 
                              : titulo.detallePartida?.metrado || ''}
                            onChange={(e) => handleMetradoInputChange(titulo.id_titulo, e.target.value)}
                            onBlur={() => handleFinishEditingMetrado(titulo)}
                            onKeyDown={(e) => handleMetradoKeyDown(e, titulo)}
                            autoFocus
                          />
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-100"
                            onDoubleClick={() => handleStartEditingMetrado(
                              titulo.id_titulo, 
                              titulo.detallePartida?.metrado || 0
                            )}
                          >
                            {formatNumber(titulo.detallePartida?.metrado || 0)}
                          </div>
                        )
                      )}
                    </td>
                    <td className="px-2 py-1 text-center text-gray-500 border-r">
                      {titulo.tipo === 'PARTIDA' && formatNumber(titulo.detallePartida?.precio || 0) }
                    </td>
                    <td className="px-2 py-1 text-right text-gray-900">
                      {formatNumber(calcularParcial(titulo))}
                    </td>
                  </motion.tr>
                )
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresupuestoTable;