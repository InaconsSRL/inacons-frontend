import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { fetchOrdenCompras } from '../../slices/ordenCompraSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import { RootState, AppDispatch } from '../../store/store';
import OrdenCompraDetalle from './OrdenCompraDetalle';

// Definir interfaces
interface OrdenCompra {
    id: string;
    codigo_orden: string;
    cotizacion_id: string;
    estado: boolean;
    descripcion: string;
    fecha_ini: string;
    fecha_fin: string;
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

const OrdenCompraPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { ordenCompras, loading, error } = useSelector((state: RootState) => state.ordenCompra);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrdenCompra, setEditingOrdenCompra] = useState<OrdenCompra | null>(null);
    const [activeFilter, setActiveFilter] = useState('todos');
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    useEffect(() => {
        dispatch(fetchOrdenCompras());
    }, [dispatch]);

    const handleView = (ordenCompra: OrdenCompra) => {
        setEditingOrdenCompra(ordenCompra);
        setShowDetalleModal(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOrdenCompra(null);
    };

    const handleRefresh = () => {
        dispatch(fetchOrdenCompras());
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getFilteredOrdenCompras = () => {
        switch (activeFilter) {
            case 'activas':
                return ordenCompras.filter(oc => oc.estado);
            case 'inactivas':
                return ordenCompras.filter(oc => !oc.estado);
            default:
                return ordenCompras;
        }
    };

    const tableData = useMemo(() => ({
        headers: [
            "id",
            "fecha inicio",
            "fecha fin",
            "codigo",
            "descripción",
            "estado",
            "opciones"
        ],
        rows: getFilteredOrdenCompras().map(oc => ({
            id: oc.id,
            codigo: oc.codigo_orden,
            descripción: oc.descripcion,
            "fecha inicio": formatDate(oc.fecha_ini),
            "fecha fin": formatDate(oc.fecha_fin),
            estado: oc.estado ? 'Activo' : 'Inactivo',
            opciones: (
                <div className='flex flex-row gap-2'>
                    <button className='text-yellow-500' onClick={() => handleView(oc)}>
                        <FiEye />
                    </button>
                    
                </div>
            )
        }))
    }), [ordenCompras, activeFilter]);

    if (loading) return <LoaderPage />;
    if (error) return <div>Error: {error}</div>;

    return (
        <motion.div
            className="flex flex-col h-full"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <motion.div className="text-white pb-4 px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-blue-50">Órdenes de Compra</h1>
                </div>
                <Button
                    text='Actualizar'
                    color='blanco'
                    onClick={handleRefresh}
                    className="rounded w-auto"
                    icon={<FiRefreshCw className="text-green-500 text-center h-3 w-3" />}
                />
            </motion.div>

            <motion.div className="flex flex-1 overflow-hidden rounded-xl">
                <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
                    <div className="mb-4 space-x-2">
                        <button
                            className={`px-3 py-1 ${activeFilter === 'activas' ? 'bg-green-600' : 'bg-green-500'} text-white rounded-md text-xs`}
                            onClick={() => setActiveFilter('activas')}
                        >
                            Activas
                        </button>
                        <button
                            className={`px-3 py-1 ${activeFilter === 'inactivas' ? 'bg-red-600' : 'bg-red-500'} text-white rounded-md text-xs`}
                            onClick={() => setActiveFilter('inactivas')}
                        >
                            Inactivas
                        </button>
                        <button
                            className={`px-3 py-1 ${activeFilter === 'todos' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md text-xs`}
                            onClick={() => setActiveFilter('todos')}
                        >
                            Todas
                        </button>
                    </div>
                    <motion.div className="flex-grow border rounded-lg overflow-hidden">
                        <div className="h-full overflow-auto">
                            <TableComponent tableData={tableData} />
                        </div>
                    </motion.div>
                </main>
            </motion.div>

            <AnimatePresence>
                {showDetalleModal && editingOrdenCompra && (
                    <Modal
                        title="Detalle de Orden de Compra"
                        isOpen={showDetalleModal}
                        onClose={() => setShowDetalleModal(false)}
                    >
                        <OrdenCompraDetalle ordenCompra={editingOrdenCompra} />
                    </Modal>
                )}
                {isModalOpen && (
                    <Modal
                        title="Resumen de Orden de Compra"
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Aquí irá tu formulario de Orden de Compra */}
                            <div>Contenido del formulario</div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrdenCompraPage;
