import React, { useState } from 'react';
import { mockRequerimientos, mockRecursos } from './mockData';
import Modal from '../../components/Modal/Modal';
import { motion } from 'framer-motion';
import ComprasForm from './ComprasForm';
import { FiTrash2 } from 'react-icons/fi';
import TableComponentSimple from '../../components/Table/TableComponentSimple';

// Definimos las interfaces


interface TableAction {
    icon: React.ReactNode;
    onClick: (row: any) => void;
    className?: string;
}

interface Recurso {
    id: string;
    requerimiento_id: string;
    codigo: string;
    nombre: string;
    unidad: string;
    precio_actual: number;
    cantidad: number;
}

interface RecursoSeleccionado {
    Recurso: Recurso;
    cantidadCompra: number;

}

const ComprasPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recursosCompra, setRecursosCompra] = useState<RecursoSeleccionado[]>([]);

    const actualizarCantidad = (recursoId: string, nuevaCantidad: number) => {
        setRecursosCompra(recursosCompra.map(recurso =>
            recurso.Recurso.id === recursoId
                ? { ...recurso, cantidadCompra: nuevaCantidad }
                : recurso
        ));
    };

    const eliminarRecurso = (recursoId: string) => {
        setRecursosCompra(recursosCompra.filter(recurso => recurso.Recurso.id !== recursoId));
    };

    const total = recursosCompra.reduce((sum, recurso) =>
        sum + (recurso.Recurso.precio_actual * recurso.cantidadCompra), 0
    );

    // Definición simplificada de columnas
    const columns = [
        {
            key: 'codigo',
            title: 'Código',
            type: 'text' as const,
        },
        {
            key: 'nombre',
            title: 'Nombre',
            type: 'text' as const,
        },
        {
            key: 'cantidadCompra',
            title: 'Cantidad',
            type: 'input' as const,
            inputProps: {
                type: 'number',
                min: '1',
                className: 'w-24 px-2 py-1 border rounded-md'
            }
        },
        {
            key: 'precioUnitario',
            title: 'Precio Unit.',
            type: 'text' as const,
        },
        {
            key: 'subtotal',
            title: 'Subtotal',
            type: 'text' as const,
        }
    ];

    interface TableRow {
        id: string;
        codigo: string;
        nombre: string;
        cantidadCompra: number;
        precioUnitario: string;
        subtotal: string;
    }

    // Definición de acciones separada
    const tableActions: TableAction[] = [  // Especificamos explícitamente el tipo
        {
            icon: <FiTrash2 className='h-5 w-5 text-red-500' />,
            onClick: (row: TableRow) => eliminarRecurso(row.id),  // Usamos el tipo RowData
            className: "text-red-600 hover:text-red-800"
        }
    ];

    // Transformar recursosCompra al formato esperado por TableComponentSimple
    const tableData = recursosCompra.map(recurso => ({
        id: recurso.Recurso.id,
        codigo: recurso.Recurso.codigo,
        nombre: recurso.Recurso.nombre,
        cantidadCompra: recurso.cantidadCompra,
        precioUnitario: `S/ ${recurso.Recurso.precio_actual.toFixed(2)}`,
        subtotal: `S/ ${(recurso.Recurso.precio_actual * recurso.cantidadCompra).toFixed(2)}`,
    }));

    const handleRowChange = (index: number, field: string, value: string | number) => {
        if (field === 'cantidadCompra') {
            actualizarCantidad(recursosCompra[index].Recurso.id, Number(value));
        }
    };

    return (
        <div className="container mx-auto px-6 max-w-[calc(100vw)] ">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Módulo de Compras</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i>
                        Agregar Recursos
                    </button>
                </div>

                {recursosCompra.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <p className="text-gray-500 text-lg">No hay recursos seleccionados</p>
                        <p className="text-gray-400">Haga clic en "Agregar Recursos" para comenzar</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <div className="max-h-[calc(83vh-12rem)] overflow-y-auto">
                                <TableComponentSimple
                                    columns={columns}
                                    data={tableData}
                                    onRowChange={handleRowChange}
                                    actions={tableActions}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-xl font-semibold text-gray-800">
                                    Total: S/ {total.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </>
                )}



            </div>
            {isModalOpen && (
                <Modal
                    title="Agregar Recursos"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ComprasForm

                            onSave={(recursos: RecursoSeleccionado[]) => {
                                const nuevosRecursos: RecursoSeleccionado[] = recursos;
                                setRecursosCompra([...recursosCompra, ...nuevosRecursos.filter(
                                    newRecurso => !recursosCompra.some(r => r.Recurso.id === newRecurso.Recurso.id)
                                )]);
                            }}
                            requerimientos={mockRequerimientos}
                            recursos={mockRecursos}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </motion.div>
                </Modal>
            )}
        </div>
    );
}

export default ComprasPage;