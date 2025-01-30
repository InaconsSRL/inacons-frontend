import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { getTitulosByPresupuesto, addTitulo, updateTitulo, deleteTitulo, Titulo } from '../../../slices/tituloSlice';
import { updateActiveTitulo, setEditMode } from '../../../slices/activeDataSlice';
import Modal from '../../../components/Modal/Modal';
import ModalAlert from '../../../components/Modal/ModalAlert';
import TituloForm from '../1HojaPresupuesto/TitulosJerarquia/TituloForm';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowRight} from 'react-icons/md';
import { FiTrash2, FiCheck } from 'react-icons/fi';

const EdicionPresupuestoTableAPU: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());
  const [showTituloForm, setShowTituloForm] = useState(false);
  const [editingTitulo, setEditingTitulo] = useState<Titulo | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [tituloToDelete, setTituloToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: boolean }>({});
  const [parentId, setParentId] = useState<string | undefined>();
  const [ordenCreate, setOrdenCreate] = useState<number | undefined>();
  const [tipoTitulo, setTipoTitulo] = useState<'TITULO' | 'PARTIDA'>('TITULO');
  const [titulosEnEdicion, setTitulosEnEdicion] = useState<Titulo[]>([]);

  const activePresupuesto = useSelector((state: RootState) => state.activeData.activePresupuesto);
  const titulos = useSelector((state: RootState) => state.titulo.titulos);
  const activeTitulo = useSelector((state: RootState) => state.activeData.activeTitulo);

  useEffect(() => {
    if (activePresupuesto?.id_presupuesto) {
      dispatch(getTitulosByPresupuesto(activePresupuesto.id_presupuesto));
    }
  }, [dispatch, activePresupuesto]);

  useEffect(() => {
    setTitulosEnEdicion([...titulos].sort((a, b) => a.orden - b.orden));
  }, [titulos]);

  const sortedTitulos = [...titulosEnEdicion].sort((a, b) => {
    return (a.orden || 0) - (b.orden || 0);
  });

  const handleSubmit = async (tituloData: Titulo) => {
    if (editingTitulo) {
      await dispatch(updateTitulo(tituloData));
    } else {
      await dispatch(addTitulo(tituloData));
    }
    setShowTituloForm(false);
    setEditingTitulo(null);
  };

  const handleCreate = (parentId?: string, ordenTitulo?: number, tipo: 'TITULO' | 'PARTIDA' = 'TITULO') => {
    setEditingTitulo(null);
    setParentId(parentId);
    setOrdenCreate(ordenTitulo);
    setTipoTitulo(tipo);
    setShowTituloForm(true);
  };

  const handleDelete = async (tituloId: string) => {
    setTituloToDelete(tituloId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (tituloToDelete) {
      await dispatch(deleteTitulo(tituloToDelete));
      setShowDeleteAlert(false);
      setTituloToDelete(null);
    }
  };

  const handleNivelChange = (tituloId: string, incrementar: boolean) => {
    setTitulosEnEdicion(prevTitulos =>
      prevTitulos.map(t => {
        if (t.id_titulo === tituloId) {
          return {
            ...t,
            nivel: incrementar ? t.nivel + 1 : Math.max(1, t.nivel - 1)
          };
        }
        return t;
      })
    );
  };

  const handleMoverOrden = (tituloId: string, direccion: 'arriba' | 'abajo') => {
    setTitulosEnEdicion(prevTitulos => {
      const titulos = prevTitulos.map(t => ({ ...t }));
      const index = titulos.findIndex(t => t.id_titulo === tituloId);

      if (direccion === 'arriba' && index > 0) {
        const ordenActual = titulos[index].orden;
        const ordenAnterior = titulos[index - 1].orden;
        titulos[index] = { ...titulos[index], orden: ordenAnterior };
        titulos[index - 1] = { ...titulos[index - 1], orden: ordenActual };
      } else if (direccion === 'abajo' && index < titulos.length - 1) {
        const ordenActual = titulos[index].orden;
        const ordenSiguiente = titulos[index + 1].orden;
        titulos[index] = { ...titulos[index], orden: ordenSiguiente };
        titulos[index + 1] = { ...titulos[index + 1], orden: ordenActual };
      }

      return titulos.sort((a, b) => a.orden - b.orden);
    });
  };

  const toggleMenu = (tituloId: string) => {
    setMenuAnchorEl(prev => ({
      ...prev,
      [tituloId]: !prev[tituloId]
    }));
  };

  // Funciones de colapso heredadas de PresupuestoTableAPU
  const toggleCollapse = (itemId: string) => {
    const newCollapsedItems = new Set(collapsedItems);
    if (collapsedItems.has(itemId)) {
      newCollapsedItems.delete(itemId);
    } else {
      newCollapsedItems.add(itemId);
    }
    setCollapsedItems(newCollapsedItems);
  };

  const isVisible = (titulo: Titulo) => {
    const parentItems = sortedTitulos.filter(t => 
      t.item.split('.').length < titulo.item.split('.').length &&
      titulo.item.startsWith(t.item)
    );
    return !parentItems.some(parent => collapsedItems.has(parent.id_titulo));
  };

  const getIndentation = (nivel: number) => {
    return { paddingLeft: `${(nivel - 1) * 20}px` };
  };

  const getTitleColor = (nivel: number, tipo: string) => {
    if (tipo === 'PARTIDA') return 'text-gray-900';
    switch (nivel) {
      case 1: return 'text-blue-600 font-bold';
      case 2: return 'text-orange-500';
      case 3: return 'text-red-800';
      case 4: return 'text-pink-500';
      case 5: return 'text-cyan-500';
      default: return 'text-gray-900';
    }
  };

  const handleTituloClick = (titulo: Titulo) => {
    dispatch(updateActiveTitulo(titulo));
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="mx-auto h-full bg-white shadow-sm border border-gray-200 flex flex-col px-2">
      {/* Header heredado de PresupuestoTableAPU */}
      <motion.div 
        className="bg-gray-800 p-2 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-semibold text-sm text-white">Modo Edición - Estructura del Presupuesto</h2>
        <div className="flex gap-2">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => dispatch(setEditMode(false))}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2"
          >
            <FiCheck className="w-4 h-4" />
            Finalizar Edición
          </motion.button>
          <button
            onClick={() => handleCreate(undefined, undefined, 'TITULO')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Nuevo Título
          </button>
        </div>
      </motion.div>

      <div className="overflow-x-auto flex-1 relative">
        <table className="min-w-full divide-y divide-gray-200 text-[11px]">
          <thead className="bg-gray-50 sticky top-[0px] z-10">
            <tr>
              <th className="w-14 px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider border-r">
                Item
              </th>
              <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="w-40 px-2 py-1 text-center font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence initial={false}>
              {sortedTitulos.map((titulo, index) => (
                isVisible(titulo) && (
                  <motion.tr
                    key={titulo.id_titulo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`
                      hover:bg-gray-100 cursor-pointer
                      ${activeTitulo?.id_titulo === titulo.id_titulo ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => handleTituloClick(titulo)}
                  >
                    <td className="px-2 py-1 text-gray-900 border-r whitespace-nowrap">
                      {titulo.item}
                    </td>
                    <td className="px-2 py-1">
                      <div 
                        className="flex items-center"
                        style={getIndentation(titulo.nivel)}
                      >
                        {titulo.tipo !== 'PARTIDA' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCollapse(titulo.id_titulo);
                            }}
                            className="mr-1 focus:outline-none"
                          >
                            <MdKeyboardArrowRight 
                              className={`transform transition-transform ${
                                !collapsedItems.has(titulo.id_titulo) ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        )}
                        <span className={getTitleColor(titulo.nivel, titulo.tipo)}>
                          {titulo.descripcion}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-right">
                      <div className="flex justify-end space-x-1">
                        {titulo.tipo === 'TITULO' && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(titulo.id_titulo);
                              }}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              +
                            </button>
                            {menuAnchorEl[titulo.id_titulo] && (
                              <div className="absolute right-0 z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreate(titulo.id_titulo, titulo.orden, 'TITULO');
                                    toggleMenu(titulo.id_titulo);
                                  }}
                                  className="block w-32 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Agregar Título
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreate(titulo.id_titulo, titulo.orden, 'PARTIDA');
                                    toggleMenu(titulo.id_titulo);
                                  }}
                                  className="block w-32 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Agregar Partida
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNivelChange(titulo.id_titulo, false);
                          }}
                          className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          {'<'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNivelChange(titulo.id_titulo, true);
                          }}
                          className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          {'>'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoverOrden(titulo.id_titulo, 'arriba');
                          }}
                          disabled={index === 0}
                          className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoverOrden(titulo.id_titulo, 'abajo');
                          }}
                          disabled={index === sortedTitulos.length - 1}
                          className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(titulo.id_titulo);
                          }}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {showTituloForm && (
        <Modal
          isOpen={showTituloForm}
          onClose={() => {
            setShowTituloForm(false);
            setParentId(undefined);
            setOrdenCreate(undefined);
          }}
          title={editingTitulo ? "Editar Título" : "Nuevo Título"}
        >
          <TituloForm
            titulo={editingTitulo}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowTituloForm(false);
              setParentId(undefined);
              setOrdenCreate(undefined);
            }}
            titulos={titulos}
            tituloParentId={parentId}
            ordenCreate={ordenCreate}
            tipo={tipoTitulo}
          />
        </Modal>
      )}

      {showDeleteAlert && tituloToDelete && (
        <ModalAlert
          isOpen={showDeleteAlert}
          title="Confirmar Eliminación"
          message="¿Estás seguro de eliminar este título?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteAlert(false);
            setTituloToDelete(null);
          }}
          variant="red"
        />
      )}
    </div>
  );
};

export default EdicionPresupuestoTableAPU;
