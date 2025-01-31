import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import EmpresaForm from './EmpresaForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchEmpresas, addEmpresa, updateEmpresa, Empresa } from '../../slices/empresaSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import { FiEdit } from 'react-icons/fi';
import type { EmpresaFormData } from './EmpresaForm'; // Importamos el tipo

const EmpresaPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { empresas, loading, error } = useSelector((state: RootState) => state.empresa);

    useEffect(() => {
        dispatch(fetchEmpresas());
    }, [dispatch]);

    const handleNew = () => {
        setEditingEmpresa(null);
        setIsModalOpen(true);
    };

    const handleEdit = (emp: Empresa): void => {
        setEditingEmpresa(emp);
        setIsModalOpen(true);
    };

    const handleSubmit = (data: EmpresaFormData) => {
        if (editingEmpresa) {
            dispatch(updateEmpresa({
                updateEmpresaId: editingEmpresa.id,
                ...data
            }));
        } else {
            dispatch(addEmpresa(data));
        }
        setIsModalOpen(false);
        setEditingEmpresa(null);
    };

    if (loading) return <LoaderPage />;
    if (error) return <div>Error: {error}</div>;

    const tableData = {
        headers: ["nombre_comercial", "razon_social", "estado", "ruc", "opciones"],
        rows: empresas.map((emp) => ({
            nombre_comercial: emp.nombre_comercial,
            razon_social: emp.razon_social,
            estado: emp.estado,
            ruc: emp.ruc,
            opciones: (
                <Button
                    text={<FiEdit size={18} className="text-blue-500" />}
                    color="transp"
                    className="text-black"
                    onClick={() => handleEdit(emp)}
                />
            )
        }))
    };

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
                className="x text-white pb-4 px-0 md:px-4 flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-2xl font-bold">Recursos</h1>
                <div className="flex items-center justify-end p-4">
                    <Button text="Nueva Empresa" color="verde" onClick={handleNew} />
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
                    <Modal title={editingEmpresa ? 'Actualizar Empresa' : 'Crear Empresa'} isOpen onClose={() => setIsModalOpen(false)}>
                        <EmpresaForm
                            initialValues={editingEmpresa ? {
                                nombre_comercial: editingEmpresa.nombre_comercial || '',
                                razon_social: editingEmpresa.razon_social || '',
                                estado: editingEmpresa.estado || '',
                                regimen_fiscal: editingEmpresa.regimen_fiscal || '',
                                ruc: editingEmpresa.ruc || '',
                                descripcion: editingEmpresa.descripcion || ''
                            } : undefined}
                            onSubmit={handleSubmit}
                        />
                    </Modal>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default EmpresaPage;
