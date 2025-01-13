import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import BodegaFormComponent from './BodegaFormComponent';

import { useDispatch, useSelector } from 'react-redux';
// import { fetchObraBodegas, addObraBodega, updateObraBodega, deleteObraBodega } from '../../slices/obraBodegaSlice';
import { fetchObraBodegas, addObraBodega, updateObraBodega } from '../../slices/obraBodegaSlice';
import { RootState, AppDispatch } from '../../store/store';
import LoaderPage from '../../components/Loader/LoaderPage';
// import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import { fetchObras } from '../../slices/obrasSlice';

interface ObraBodega {
    id: string;
    obra_id: {
        id: string;
        nombre: string;
    };
    codigo: string;
    nombre: string;
    descripcion: string;
    estado: string;
}

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
};

const BodegasComponent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBodega, setEditingBodega] = useState<ObraBodega | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { obraBodegas, loading, error } = useSelector((state: RootState) => state.obraBodega);
    const { obras } = useSelector((state: RootState) => state.obra);

    useEffect(() => {
        const loadInitialData = async () => {
            if (obraBodegas.length === 0) {
                dispatch(fetchObraBodegas());
            }
            if (obras.length === 0) {
                dispatch(fetchObras());
            }
        };

        loadInitialData();
    }, [dispatch, obraBodegas.length, obras.length]);

    const handleSubmit = (data: {
        obra_id: string;
        codigo: string;
        nombre: string;
        descripcion: string;
        estado: string;
    }) => {
        if (editingBodega) {
            dispatch(updateObraBodega({
                updateObraBodegaId: editingBodega.id,
                obraId: data.obra_id,
                estado: data.estado,
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion,
            }));
        } else {
            dispatch(addObraBodega({
                obraId: data.obra_id,
                estado: data.estado,
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion,
            }));
        }
        setIsModalOpen(false);
        setEditingBodega(null);
    };

    const handleEdit = (bodega: ObraBodega) => {
        setEditingBodega(bodega);
        setIsModalOpen(true);
    };

    // const handleDelete = (id: string) => {
    //     if (window.confirm('¿Está seguro de eliminar esta bodega?')) {
    //         dispatch(deleteObraBodega(id));
    //     }
    // };

    const handleButtonClick = () => {
        setEditingBodega(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBodega(null);
    };

    const tableData = {
        filterSelect:[true, false, false, true, true, false],
        filter: [true, true, true, true, true, false],
        headers: ["obra", "código", "nombre", "descripción", "estado", "opciones"],
        rows: obraBodegas.map(bodega => ({
            obra: bodega.obra_id.nombre,
            código: bodega.codigo,
            nombre: bodega.nombre,
            descripción: bodega.descripcion,
            estado: bodega.estado.toString() === "true" ? "Activo" : "Desactivo",
            opciones: (
                <div className="flex space-x-2">
                    <button
                        className='text-black'
                        onClick={() => handleEdit(bodega)}
                    >
                        <FiEdit size={18} className='text-blue-500' />
                    </button>
                    {/* <button
                        className='text-black'
                        onClick={() => handleDelete(bodega.id)}
                    >
                        <FiTrash2 size={18} className='text-red-500' />
                    </button> */}
                </div>
            )
        }))
    };

    if (loading) return <LoaderPage />;
    if (error) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

    return (
        <motion.div
            className="flex flex-col h-full"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <motion.div
                className="text-white pb-4 px-4 flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-2xl font-bold">Bodegas</h1>
                <div className="flex items-center space-x-2">
                    <Button text='Nueva Bodega' color='verde' onClick={handleButtonClick} className="rounded w-full" />
                </div>
            </motion.div>

            <motion.div
                className="flex flex-1 overflow-hidden rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
                    <motion.div
                        className="flex-grow border rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="h-full overflow-auto">
                            <TableComponent tableData={tableData} />
                        </div>
                    </motion.div>
                </main>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal title={editingBodega ? 'Actualizar Bodega' : 'Crear Bodega'} isOpen={isModalOpen} onClose={handleCloseModal}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <BodegaFormComponent
                                initialValues={editingBodega ? {
                                    obra_id: editingBodega.obra_id.id,
                                    codigo: editingBodega.codigo,
                                    nombre: editingBodega.nombre,
                                    descripcion: editingBodega.descripcion,
                                    estado: editingBodega.estado
                                } : undefined}
                                onSubmit={handleSubmit}
                            />
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BodegasComponent;
