import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import { getTitulosByPresupuesto, addTitulo, updateTitulo, deleteTitulo, TituloBasic, getTitulosFromCache } from '../../../../slices/tituloSlice';
import Modal from '../../../../components/Modal/Modal';
import TituloForm from './TituloForm';
import { FiRefreshCcw, FiTrash2 } from 'react-icons/fi';
import ModalAlert from '../../../../components/Modal/ModalAlert';
import LoaderPage from '../../../../components/Loader/LoaderPage';
import LoaderOverlay from '../../../../components/Loader/LoaderOverlay';

const TitulosJerarquia: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const activePresupuesto = useSelector((state: RootState) => state.activeData.activePresupuesto);
    const titulos = useSelector((state: RootState) => state.titulo.titulos);
    const titulosPorPresupuesto = useSelector((state: RootState) => state.titulo.titulosPorPresupuesto);
    const [showTituloForm, setShowTituloForm] = useState(false);
    const [editingTitulo, setEditingTitulo] = useState<TituloBasic | null>(null);
    const [titulosEnEdicion, setTitulosEnEdicion] = useState<TituloBasic[]>([]);
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
    const lastSync = useSelector((state: RootState) => state.titulo.lastSync);
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

    const handleEdit = (titulo: TituloBasic) => {
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

    const handleSubmit = async (tituloData: TituloBasic) => {
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

    const titulosIguales = (titulo1: TituloBasic, titulo2: TituloBasic): boolean => {
        return titulo1.nivel === titulo2.nivel &&
            titulo1.orden === titulo2.orden &&
            titulo1.item === titulo2.item &&
            titulo1.id_titulo_padre === titulo2.id_titulo_padre;
    };

    const calcularEstructura = async () => {
        setIsCalculating(true);
        try {
            // Guardar estado original de los títulos para comparación
            const titulosOriginales = new Map(titulos.map(t => [t.id_titulo, { ...t }]));

            console.group('Análisis de cambios en títulos');
            console.log('Estado original de títulos:', [...titulosOriginales.values()]);

            // Primera pasada: cálculo inicial
            let titulosOrdenados = await calcularEstructuraInterna([...titulosEnEdicion]);

            // Segunda pasada: verificación y corrección
            titulosOrdenados = await calcularEstructuraInterna(titulosOrdenados);
            console.log('Títulos después del cálculo:', titulosOrdenados);

            // Filtrar solo los títulos que realmente cambiaron
            const titulosModificados = titulosOrdenados.filter(titulo => {
                const original = titulosOriginales.get(titulo.id_titulo);
                if (!original) {
                    console.log(`Título nuevo encontrado:`, titulo);
                    return true;
                }
                const hayCambios = !titulosIguales(titulo, original);
                if (hayCambios) {
                    console.log(`Cambios detectados en título ${titulo.id_titulo}:`, {
                        original,
                        modificado: titulo,
                        cambios: {
                            nivel: original.nivel !== titulo.nivel ? `${original.nivel} → ${titulo.nivel}` : 'sin cambios',
                            orden: original.orden !== titulo.orden ? `${original.orden} → ${titulo.orden}` : 'sin cambios',
                            item: original.item !== titulo.item ? `${original.item} → ${titulo.item}` : 'sin cambios',
                            id_titulo_padre: original.id_titulo_padre !== titulo.id_titulo_padre ?
                                `${original.id_titulo_padre} → ${titulo.id_titulo_padre}` : 'sin cambios'
                        }
                    });
                }
                return hayCambios;
            });

            console.log(`Resumen de cambios:`, {
                totalTitulos: titulosOrdenados.length,
                titulosModificados: titulosModificados.length,
                listaModificados: titulosModificados.map(t => ({
                    id: t.id_titulo,
                    descripcion: t.descripcion,
                    item: t.item,
                    nivel: t.nivel,
                    orden: t.orden
                }))
            });
            console.groupEnd();

            // Guardar solo los cambios necesarios
            for (const titulo of titulosModificados) {
                await dispatch(updateTitulo(titulo));
            }

            setModoEdicion(false);
        } finally {
            setIsCalculating(false);
        }
    };

    const calcularEstructuraInterna = async (titulos: TituloBasic[]): Promise<TituloBasic[]> => {
        // Ordenar por orden
        let titulosOrdenados = [...titulos].sort((a, b) => a.orden - b.orden);

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

    const calcularItem = (titulo: TituloBasic, titulosAnteriores: TituloBasic[]): string => {
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

    const encontrarPadreApropiado = (titulo: TituloBasic, titulosAnteriores: TituloBasic[]): TituloBasic | null => {
        for (const posiblePadre of [...titulosAnteriores].reverse()) {
            if (posiblePadre.nivel === titulo.nivel - 1) {
                return posiblePadre;
            }
        }
        return null;
    };

    const getNivelColor = (nivel: number, isEditing: boolean, tipo: string) => {
        if (tipo === 'PARTIDA') {
            return 'bg-black/60'; // Todas las partidas serán negras
        }

        if (isEditing) {
            // Colores para modo edición de títulos
            switch (nivel) {
                case 1: return 'bg-purple-900';
                case 2: return 'bg-indigo-900';
                case 3: return 'bg-blue-900';
                case 4: return 'bg-cyan-900';
                case 5: return 'bg-teal-900';
                case 6: return 'bg-green-900';
                case 7: return 'bg-lime-900';
                default: return 'bg-yellow-900';
            }
        } else {
            // Colores para modo visualización de títulos
            switch (nivel) {
                case 1: return 'bg-purple-800';
                case 2: return 'bg-indigo-800';
                case 3: return 'bg-blue-800';
                case 4: return 'bg-cyan-800';
                case 5: return 'bg-teal-800';
                case 6: return 'bg-green-800';
                case 7: return 'bg-lime-800';
                default: return 'bg-yellow-800';
            }
        }
    };

    const tieneHijos = (tituloId: string, titulos: TituloBasic[]): boolean => {
        return titulos.some(t => t.id_titulo_padre === tituloId);
    };

    const esHijoDeTituloColapsado = (titulo: TituloBasic, titulos: TituloBasic[]): boolean => {
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

    const handleRefresh = () => {
        if (activePresupuesto) {
            dispatch(getTitulosByPresupuesto(activePresupuesto.id_presupuesto));
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
                <div className="p-1 ">
                    <div className="justify-between items-center ">
                        <div className={`${modoEdicion ? "bg-zinc-950 text-white" : "bg-gray-900 text-white"}  p-4 rounded-md mb-4`}>
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-base font-bold flex-grow break-words max-w-[800px]">
                                    {activePresupuesto?.nombre_presupuesto}
                                </h1>
                                {activePresupuesto && lastSync[activePresupuesto.id_presupuesto] && (
                                    <div className="flex flex-col min-w-40">
                                        <span className="text-xs text-gray-400">
                                            Última sincronización:
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {lastSync[activePresupuesto.id_presupuesto]}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start text-sm">

                                    {!modoEdicion ? (
                                        <button

                                            onClick={() => setModoEdicion(true)}
                                            className="px-3 py-0.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-300"
                                        >
                                            Editar Estructura
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={calcularEstructura}
                                                className="px-3 py-0.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                                            >
                                                Guardar Estructura
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setModoEdicion(false);
                                                    setTitulosEnEdicion([...titulos]);
                                                }}
                                                className="px-3 py-0.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleCreate(undefined, undefined, 'TITULO')}
                                        className="px-3 py-0.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Nuevo Título
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleRefresh}
                                        className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-300"
                                    >
                                        <FiRefreshCcw />
                                    </button>
                                </div>
                            </div>



                        </div>
                    </div>

                    <div className="h-[calc(100vh-16rem)] overflow-y-auto space-y-2 text-[11px] bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-2 rounded-lg pb-32">
                        {titulosFiltrados.map((titulo, index, array) => (
                            <div
                                key={titulo.id_titulo}
                                className={`flex justify-between items-center px-3 py-0.5 rounded-md transition-all duration-300 
                            ${getNivelColor(titulo.nivel, modoEdicion, titulo.tipo)}
                            ${tituloMoviendose === titulo.id_titulo ? 'border-2 border-blue-500' : ''}`}
                                style={{ marginLeft: `${(titulo.nivel - 1) * 2}rem` }}
                            >
                                <div className="flex items-center space-x-2">
                                    {!modoEdicion && tieneHijos(titulo.id_titulo, sortedTitulos) && (
                                        <button
                                            onClick={() => handleToggleColapso(titulo.id_titulo)}
                                            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-white"
                                        >
                                            {titulosColapsados.has(titulo.id_titulo) ? '►' : '▼'}
                                        </button>
                                    )}
                                    <span className="text-gray-400">{titulo.item}</span>
                                    <span className="text-gray-100">{titulo.descripcion}</span>
                                </div>
                                <div className="flex space-x-2">
                                    {modoEdicion && (
                                        <>
                                            {titulo.tipo === 'TITULO' && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => toggleMenu(titulo.id_titulo)}
                                                        className="px-2 py-1 bg-green-700 text-gray-200 rounded hover:bg-green-600"
                                                    >
                                                        +
                                                    </button>
                                                    {menuAnchorEl[titulo.id_titulo] && (
                                                        <div className="absolute z-10 mt-1 bg-sky-700 rounded-md shadow-lg">
                                                            <button
                                                                onClick={() => {
                                                                    handleCreate(titulo.id_titulo, titulo.orden, 'TITULO');
                                                                    toggleMenu(titulo.id_titulo);
                                                                }}
                                                                className="block w-40 px-4 py-2 text-left text-sm text-gray-200 hover:bg-sky-500"
                                                            >
                                                                Agregar Título
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleCreate(titulo.id_titulo, titulo.orden, 'PARTIDA');
                                                                    toggleMenu(titulo.id_titulo);
                                                                }}
                                                                className="block w-40 px-4 py-2 text-left text-sm text-gray-200 hover:bg-sky-500"
                                                            >
                                                                Agregar Partida
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                            )}
                                            <button
                                                onClick={() => handleNivelChange(titulo.id_titulo, false)}
                                                className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                                            >
                                                {'<'}
                                            </button>
                                            <button
                                                onClick={() => handleNivelChange(titulo.id_titulo, true)}
                                                className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                                            >
                                                {'>'}
                                            </button>
                                            <button
                                                onClick={() => handleMoverOrden(titulo.id_titulo, 'arriba')}
                                                disabled={index === 0}
                                                className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => handleMoverOrden(titulo.id_titulo, 'abajo')}
                                                disabled={index === array.length - 1}
                                                className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => handleDelete(titulo.id_titulo)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </>
                                    )}
                                    {!modoEdicion && (
                                        <button
                                            onClick={() => handleEdit(titulo)}
                                            className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                                        >
                                            Editar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

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
                </div>}
        </>
    );
};

export default TitulosJerarquia;
