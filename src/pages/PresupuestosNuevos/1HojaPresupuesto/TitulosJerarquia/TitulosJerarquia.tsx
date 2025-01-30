import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import { getTitulosByPresupuesto, addTitulo, updateTitulo, deleteTitulo, Titulo, getTitulosFromCache } from '../../../../slices/tituloSlice';
import Modal from '../../../../components/Modal/Modal';
import TituloForm from './TituloForm';
import { FiTrash2 } from 'react-icons/fi';
import ModalAlert from '../../../../components/Modal/ModalAlert';
import LoaderPage from '../../../../components/Loader/LoaderPage';
import LoaderOverlay from '../../../../components/Loader/LoaderOverlay';
import { setEditMode } from '../../../../slices/activeDataSlice';

const TitulosJerarquia: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const activePresupuesto = useSelector((state: RootState) => state.activeData.activePresupuesto);
    const titulos = useSelector((state: RootState) => state.titulo.titulos);
    const titulosPorPresupuesto = useSelector((state: RootState) => state.titulo.titulosPorPresupuesto);
    const [showTituloForm, setShowTituloForm] = useState(false);
    const [editingTitulo, setEditingTitulo] = useState<Titulo | null>(null);
    const [titulosEnEdicion, setTitulosEnEdicion] = useState<Titulo[]>([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [tituloMoviendose, setTituloMoviendose] = useState<string | null>(null);
    const [titulosColapsados, setTitulosColapsados] = useState<Set<string>>(new Set());
    const [parentId, setParentId] = useState<string | undefined>();
    const [ordenCreate, setOrdenCreate] = useState<number | undefined>();
    const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: boolean }>({});
    const [tipoTitulo, setTipoTitulo] = useState<'TITULO' | 'PARTIDA'>('TITULO');
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [tituloToDelete, setTituloToDelete] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const loading = useSelector((state: RootState) => state.titulo.loading);

    useEffect(() => {
        if (activePresupuesto) {
            const presupuestoId = activePresupuesto.id_presupuesto;
            if (titulosPorPresupuesto[presupuestoId]) {
                dispatch(getTitulosFromCache(presupuestoId));
            } else {
                dispatch(getTitulosByPresupuesto(presupuestoId));
            }
        }
    }, [dispatch, activePresupuesto]);

    useEffect(() => {
        // Asegurar que los títulos siempre estén ordenados
        setTitulosEnEdicion([...titulos].sort((a, b) => a.orden - b.orden));
    }, [titulos, modoEdicion]);

    const handleEdit = (titulo: Titulo) => {
        setEditingTitulo(titulo);
        setShowTituloForm(true);
    };

    const handleCreate = (parentId?: string, ordenTitulo?: number, tipo: 'TITULO' | 'PARTIDA' = 'TITULO') => {
        setEditingTitulo(null);
        setParentId(parentId);
        setOrdenCreate(ordenTitulo);
        setTipoTitulo(tipo);
        setShowTituloForm(true);
    };

    const toggleMenu = (tituloId: string) => {
        setMenuAnchorEl(prev => ({
            ...prev,
            [tituloId]: !prev[tituloId]
        }));
    };

    const handleSubmit = async (tituloData: Titulo) => {
        if (editingTitulo) {
            await dispatch(updateTitulo(tituloData));
        } else {
            await dispatch(addTitulo(tituloData));
        }
        setShowTituloForm(false);
        setEditingTitulo(null);
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
        setTituloMoviendose(tituloId);
        setTitulosEnEdicion(prevTitulos => {
            const titulos = prevTitulos.map(t => ({ ...t })); // Crear copias profundas de cada título
            const index = titulos.findIndex(t => t.id_titulo === tituloId);

            if (direccion === 'arriba' && index > 0) {
                // Crear nuevos objetos con órdenes intercambiados
                const ordenActual = titulos[index].orden;
                const ordenAnterior = titulos[index - 1].orden;

                titulos[index] = { ...titulos[index], orden: ordenAnterior };
                titulos[index - 1] = { ...titulos[index - 1], orden: ordenActual };
            } else if (direccion === 'abajo' && index < titulos.length - 1) {
                // Crear nuevos objetos con órdenes intercambiados
                const ordenActual = titulos[index].orden;
                const ordenSiguiente = titulos[index + 1].orden;

                titulos[index] = { ...titulos[index], orden: ordenSiguiente };
                titulos[index + 1] = { ...titulos[index + 1], orden: ordenActual };
            }

            return titulos.sort((a, b) => a.orden - b.orden);
        });
        // Remover el resaltado después de un breve momento
        setTimeout(() => setTituloMoviendose(null), 300);
    };

    const calcularEstructura = async () => {
        setIsCalculating(true);
        try {
            console.log('Iniciando cálculo de estructura...');

            // Guardar estado original de los títulos para comparación
            const titulosOriginales = new Map(titulos.map(t => [t.id_titulo, { ...t }]));
            console.log('Estado original de títulos:', titulosOriginales);

            // Primera pasada: cálculo inicial
            let titulosOrdenados = await calcularEstructuraInterna([...titulosEnEdicion]);
            console.log('Primera pasada - títulos ordenados:', titulosOrdenados);

            // Segunda pasada: verificación y corrección
            titulosOrdenados = await calcularEstructuraInterna(titulosOrdenados);
            console.log('Segunda pasada - títulos ordenados:', titulosOrdenados);

            // Filtrar solo los títulos que realmente cambiaron
            const titulosModificados = titulosOrdenados.filter(titulo => {
                const original = titulosOriginales.get(titulo.id_titulo);
                if (!original) return true;

                const hayCambios =
                    titulo.nivel !== original.nivel ||
                    titulo.orden !== original.orden ||
                    titulo.item !== original.item ||
                    titulo.id_titulo_padre !== original.id_titulo_padre;

                if (hayCambios) {
                    console.log('Título modificado:', {
                        id: titulo.id_titulo,
                        cambios: {
                            nivel: `${original.nivel} -> ${titulo.nivel}`,
                            orden: `${original.orden} -> ${titulo.orden}`,
                            item: `${original.item} -> ${titulo.item}`,
                            padre: `${original.id_titulo_padre} -> ${titulo.id_titulo_padre}`
                        }
                    });
                }

                return hayCambios;
            });

            console.log('Títulos que requieren actualización:', titulosModificados);

            // Guardar solo los cambios necesarios
            for (const titulo of titulosModificados) {
                console.log('Actualizando título:', titulo);
                await dispatch(updateTitulo(titulo));
            }

            if (titulosModificados.length === 0) {
                console.log('No se detectaron cambios en la estructura');
            }

            setModoEdicion(false);
        } catch (error) {
            console.error('Error al calcular estructura:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    const calcularEstructuraInterna = async (titulos: Titulo[]): Promise<Titulo[]> => {
        console.log('Iniciando cálculo de estructura interna');

        // Ordenar por orden
        let titulosOrdenados = [...titulos].sort((a, b) => a.orden - b.orden);
        console.log('Títulos ordenados inicialmente:', titulosOrdenados.map(t => ({
            id: t.id_titulo,
            orden: t.orden,
            nivel: t.nivel
        })));

        // Asignar orden secuencial
        titulosOrdenados = titulosOrdenados.map((titulo, index) => ({
            ...titulo,
            orden: index + 1
        }));

        // Procesar niveles y validar reglas
        for (let i = 0; i < titulosOrdenados.length; i++) {
            const titulo = titulosOrdenados[i];

            // Regla 1: PARTIDA no puede ser nivel 1
            if (titulo.tipo === 'PARTIDA' && titulo.nivel === 1) {
                titulo.nivel = 2;
            }

            // Regla 2: PARTIDA no puede tener hijos
            if (titulo.tipo === 'PARTIDA') {
                const tieneHijos = titulosOrdenados.some(t => t.id_titulo_padre === titulo.id_titulo);
                if (tieneHijos) {
                    // Reasignar los hijos al padre del título tipo PARTIDA
                    const padreId = titulo.id_titulo_padre;
                    titulosOrdenados = titulosOrdenados.map(t => {
                        if (t.id_titulo_padre === titulo.id_titulo) {
                            return { ...t, id_titulo_padre: padreId };
                        }
                        return t;
                    });
                }
            }

            // Regla 3: PARTIDA solo puede tener padre tipo TITULO
            if (titulo.tipo === 'PARTIDA' && titulo.id_titulo_padre) {
                const padre = titulosOrdenados.find(t => t.id_titulo === titulo.id_titulo_padre);
                if (padre?.tipo === 'PARTIDA') {
                    // Buscar el primer ancestro que sea TITULO
                    const ancestroTitulo = titulosOrdenados.find(t =>
                        t.id_titulo === padre.id_titulo_padre && t.tipo === 'TITULO'
                    );
                    titulo.id_titulo_padre = ancestroTitulo?.id_titulo || null;
                }
            }

            // Nueva Regla 4: TITULO no puede estar bajo el nivel de una PARTIDA
            if (titulo.tipo === 'TITULO') {
                const padreInmediato = titulosOrdenados.find(t => t.id_titulo === titulo.id_titulo_padre);
                if (padreInmediato?.tipo === 'PARTIDA') {
                    // Mover el TITULO al mismo nivel que la PARTIDA
                    titulo.nivel = padreInmediato.nivel;
                    titulo.id_titulo_padre = padreInmediato.id_titulo_padre;
                }
            }

            if (i === 0) {
                titulo.nivel = titulo.tipo === 'PARTIDA' ? 2 : 1;
                continue;
            }

            const nivelAnterior = titulosOrdenados[i - 1].nivel;
            if (titulo.nivel > nivelAnterior + 1) {
                titulo.nivel = nivelAnterior + 1;
            }
        }

        // Calcular items y relaciones padre-hijo
        return titulosOrdenados.map((titulo, index) => {
            const item = calcularItem(titulo, titulosOrdenados.slice(0, index));
            const padre = encontrarPadreApropiado(titulo, titulosOrdenados.slice(0, index));

            return {
                ...titulo,
                item,
                id_titulo_padre: padre?.id_titulo || null
            };
        });
    };

    const calcularItem = (titulo: Titulo, titulosAnteriores: Titulo[]): string => {
        if (titulo.nivel === 1) {
            // Para nivel 1, contar cuántos títulos de nivel 1 hay antes
            const titulosNivel1Anteriores = titulosAnteriores.filter(t => t.nivel === 1);
            const numeroSecuencial = titulosNivel1Anteriores.length + 1;
            return numeroSecuencial.toString().padStart(2, '0');
        } else {
            // Encontrar el padre inmediato
            const padre = encontrarPadreApropiado(titulo, titulosAnteriores);
            if (!padre) return '01';

            // Encontrar hermanos (títulos con el mismo padre)
            const hermanos = titulosAnteriores.filter(t =>
                t.nivel === titulo.nivel &&
                t.id_titulo_padre === padre.id_titulo
            );

            // Obtener el siguiente número secuencial para este nivel
            const siguienteNumero = hermanos.length + 1;

            // Construir el nuevo item usando el item completo del padre
            return `${padre.item}.${siguienteNumero.toString().padStart(2, '0')}`;
        }
    };

    const encontrarPadreApropiado = (titulo: Titulo, titulosAnteriores: Titulo[]): Titulo | null => {
        for (const posiblePadre of [...titulosAnteriores].reverse()) {
            if (posiblePadre.nivel === titulo.nivel - 1) {
                return posiblePadre;
            }
        }
        return null;
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


    const tieneHijos = (tituloId: string, titulos: Titulo[]): boolean => {
        return titulos.some(t => t.id_titulo_padre === tituloId);
    };

    const esHijoDeTituloColapsado = (titulo: Titulo, titulos: Titulo[]): boolean => {
        let currentTitulo = titulo;
        while (currentTitulo.id_titulo_padre) {
            if (titulosColapsados.has(currentTitulo.id_titulo_padre)) {
                return true;
            }
            currentTitulo = titulos.find(t => t.id_titulo === currentTitulo.id_titulo_padre) || currentTitulo;
        }
        return false;
    };

    const handleToggleColapso = (tituloId: string) => {
        setTitulosColapsados(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tituloId)) {
                newSet.delete(tituloId);
            } else {
                newSet.add(tituloId);
            }
            return newSet;
        });
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

    const sortedTitulos = [...titulos].sort((a, b) => (a.orden || 0) - (b.orden || 0));
    const titulosFiltrados = (modoEdicion ? titulosEnEdicion : sortedTitulos).filter(titulo =>
        modoEdicion || !esHijoDeTituloColapsado(titulo, sortedTitulos)
    );

    return (
        <>
            {loading && <LoaderOverlay message="Cargando títulos..." />}
            {isCalculating ? <LoaderPage /> :
                <div className="mx-auto w-full h-[calc(100vh-7rem)] bg-white shadow-sm border border-gray-200 flex flex-col">
                    <div className="bg-gray-100 p-2 border-b border-gray-200 flex flex-col gap-1 sticky top-0 z-20">
                        <h2 className="font-semibold text-sm text-gray-800">
                            {activePresupuesto?.nombre_presupuesto}
                        </h2>
                        <div className="flex gap-1">

                            {!modoEdicion ? (
                                <>
                                    <button
                                        onClick={() => dispatch(setEditMode(false))}
                                        className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                                    >
                                        Volver a Presupuesto
                                    </button>
                                    <button
                                        onClick={() => setModoEdicion(true)}
                                        className="px-2 py-0.5 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 flex items-center gap-1"
                                    >
                                        Editar Estructura
                                    </button></>
                            ) : (
                                <>
                                    <button
                                        onClick={calcularEstructura}
                                        className="px-2 py-0.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1"
                                    >
                                        Guardar Estructura
                                    </button>
                                    <button
                                        onClick={() => {
                                            setModoEdicion(false);
                                            setTitulosEnEdicion([...titulos]);
                                        }}
                                        className="px-2 py-0.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 flex items-center gap-1"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleCreate(undefined, undefined, 'TITULO')}
                                className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                            >
                                Nuevo Título
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1 relative">
                        <div className="min-w-full divide-y divide-gray-200 text-[11px]">
                            {titulosFiltrados.map((titulo, index, array) => (
                                <div
                                    key={titulo.id_titulo}
                                    className={`flex justify-between items-center px-3 py-0 border-b border-gray-200
                                        ${modoEdicion ? 'hover:bg-gray-50' : ''} 
                                        ${tituloMoviendose === titulo.id_titulo ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}
                                    style={{ paddingLeft: `${(titulo.nivel + 1) * 20}px` }}
                                >
                                    <div className="flex items-center gap-x-2">
                                        {!modoEdicion && tieneHijos(titulo.id_titulo, sortedTitulos) && (
                                            <button
                                                onClick={() => handleToggleColapso(titulo.id_titulo)}
                                                className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                            >
                                                {titulosColapsados.has(titulo.id_titulo) ? '►' : '▼'}
                                            </button>
                                        )}
                                        <span className="text-gray-500 w-14">{titulo.item}</span>
                                        <span className={`${titulo.tipo === 'PARTIDA' ? 'text-gray-900' : getTitleColor(titulo.nivel, titulo.tipo)}`}>
                                            {titulo.descripcion}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {modoEdicion && (
                                            <>
                                                {titulo.tipo === 'TITULO' && (
                                                    <button
                                                        onClick={() => toggleMenu(titulo.id_titulo)}
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-green-300 border border-gray-300 rounded hover:bg-green-500"
                                                    >
                                                        +
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleNivelChange(titulo.id_titulo, false)}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-yellow-300 border border-gray-300 rounded hover:bg-yellow-500"
                                                >
                                                    {'<'}
                                                </button>
                                                <button
                                                    onClick={() => handleNivelChange(titulo.id_titulo, true)}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-yellow-300 border border-gray-300 rounded hover:bg-yellow-500"
                                                >
                                                    {'>'}
                                                </button>
                                                <button
                                                    onClick={() => handleMoverOrden(titulo.id_titulo, 'arriba')}
                                                    disabled={index === 0}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-100 bg-sky-600 border border-gray-300 rounded hover:bg-sky-500 disabled:opacity-50"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => handleMoverOrden(titulo.id_titulo, 'abajo')}
                                                    disabled={index === array.length - 1}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-100 bg-sky-600 border border-gray-300 rounded hover:bg-sky-500 disabled:opacity-50"
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(titulo.id_titulo)}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </>
                                        )}
                                        {!modoEdicion && (
                                            <button
                                                onClick={() => handleEdit(titulo)}
                                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </div>

                                    {menuAnchorEl[titulo.id_titulo] && (
                                        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    handleCreate(titulo.id_titulo, titulo.orden, 'TITULO');
                                                    toggleMenu(titulo.id_titulo);
                                                }}
                                                className="block w-40 px-4 py-0 text-left text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Agregar Título
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleCreate(titulo.id_titulo, titulo.orden, 'PARTIDA');
                                                    toggleMenu(titulo.id_titulo);
                                                }}
                                                className="block w-40 px-4 py-0 text-left text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Agregar Partida
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }

            {showTituloForm &&
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
            }

            {showDeleteAlert && tituloToDelete &&
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
            }
        </>
    );
};

export default TitulosJerarquia;
