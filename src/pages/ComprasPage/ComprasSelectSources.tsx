import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import TableComponentSimple, { Column, CellType } from '../../components/Table/TableComponentSimple';
import Modal from '../../components/Modal/Modal';
import AddRecursoRequerimientoCompra from './AddRecursoRequerimientoCompra';
import CompararProveedores from './CompararProveedores';
import { fetchCotizacionRecursoForCotizacionId, deleteCotizacionRecurso } from '../../slices/cotizacionRecursoSlice';
import noImage from '../../assets/NoImage.webp';
import { CotizacionRecurso, updateCotizacion } from '../../slices/cotizacionSlice';
import Button from '../../components/Buttons/Button';
import { FiEdit, FiPlusCircle } from 'react-icons/fi';

//Todo Ok 

export interface ComprasSelectSourcesProps {
    cotizacion: {
        id: string;
        fecha: string;
        monto?: number;
        codigo_cotizacion: string;
        usuario_id: {
            id: string;
            nombres: string;
            apellidos: string;
        };
        solicitud_compra_id?: {  // Hacer opcional esta propiedad
            id: string;
        }
        estado: string;
        aprobacion: boolean;
    };
}

interface Unidad {
    id: string;
    nombre: string;
}

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

function ComprasSelectSources({ cotizacion: initialCotizacion }: ComprasSelectSourcesProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalProveedoresOpen, setIsModalProveedoresOpen] = useState(false);
    const [isModalAddRecursosOpen, setIsModalAddRecursosOpen] = useState(false);
    // Reemplazar el estado local por el selector de Redux
    const cotizacionRecursos = useSelector((state: RootState) => state.cotizacionRecurso.cotizacionRecursos);
    const cotizacionFromStore = useSelector((state: RootState) =>
        state.cotizacion.cotizaciones.find(c => c.id === initialCotizacion.id)
    ) || initialCotizacion;
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    // Formatear productos solo si el estado no es "vacio"
    const products = React.useMemo(() => {
        if (cotizacionFromStore.estado === "vacio") return [];
        
        return cotizacionRecursos.map((recurso: CotizacionRecurso) => ({
            id: recurso.id,
            imagen: recurso.recurso_id.imagenes && recurso.recurso_id.imagenes.length > 0
                ? recurso.recurso_id.imagenes[0].file
                : noImage,
            codigo: recurso.recurso_id.codigo,
            nombre: recurso.recurso_id.nombre,
            unidad: unidades.find((unidad: Unidad) => unidad.id === recurso.recurso_id.unidad_id)?.nombre,
            cantidad: recurso.cantidad,
            costo: recurso.costo,
            subtotal: recurso.cantidad * recurso.costo,
            nota: recurso.atencion
        }));
    }, [cotizacionRecursos, unidades, cotizacionFromStore.estado]);

    // Cargar recursos solo si el estado no es "vacio"
    useEffect(() => {
        if (cotizacionFromStore.estado === "vacio") {
            setIsLoading(false);
            return;
        }

        if (cotizacionFromStore.id) {
            setIsLoading(true);
            dispatch(fetchCotizacionRecursoForCotizacionId(cotizacionFromStore.id.toString()))
                .finally(() => setIsLoading(false));
        }
    }, [cotizacionFromStore.estado, cotizacionFromStore.id, dispatch]);

    const handleCloseModal = () => {
        setIsModalAddRecursosOpen(false);
        setIsModalProveedoresOpen(false);
    };

    const [header] = useState({
        codigo: cotizacionFromStore.codigo_cotizacion,
        usuario: `${cotizacionFromStore.usuario_id?.nombres ?? ''} ${cotizacionFromStore.usuario_id?.apellidos ?? ''}`,
        estado: cotizacionFromStore.estado,
        aprobacion: cotizacionFromStore.aprobacion ? 'Aprobado' : 'No Aprobado'
    });

    const columns: Column[] = [
        { key: 'imagen', title: 'Imagen', type: 'image' as CellType },
        { key: 'codigo', title: 'Código', type: 'text' as CellType },
        { key: 'nombre', title: 'Nombre', type: 'text' as CellType },
        { key: 'unidad', title: 'Unidad', type: 'text' as CellType },
        { key: 'cantidad', title: 'Cantidad', type: 'text' as CellType },
        { key: 'costo', title: 'Costo', type: 'number' as CellType },
        { key: 'subtotal', title: 'Subtotal', type: 'number' as CellType },
    ];

    const handleDelete = async (id: string) => {
        try {
            // Eliminar recurso
            await dispatch(deleteCotizacionRecurso(id)).unwrap();

            // Si no quedan recursos, actualizar el estado de la cotización a "vacio"
            if (cotizacionRecursos.length === 1 && cotizacionFromStore.id) {
                await dispatch(updateCotizacion({
                    id: cotizacionFromStore.id,
                    estado: "vacio"
                }));
            }
        } catch (error) {
            console.error('Error al eliminar el recurso:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-lg px-4 mb-6 w-full min-w-[60vw]">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
                <div className="flex gap-4 mb-6">
                    <Skeleton className="h-10 w-52" />
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <Skeleton className="h-16 w-full" />
                    <div className="p-4">
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full mb-2" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-gray-100 p-4">
            {isModalProveedoresOpen ?
                (<Modal
                    isOpen={isModalProveedoresOpen}
                    onClose={handleCloseModal}
                    title="Añadir Proveedores"

                >
                    <CompararProveedores
                        onClose={handleCloseModal}
                        recursos={cotizacionRecursos.map(recurso => ({
                            ...recurso,
                            cotizacion_id: {
                                ...recurso.cotizacion_id,
                                aprobacion: recurso.cotizacion_id.aprobacion === 'true'
                            }
                        }))}
                        cotizacion={cotizacionFromStore}
                    />
                </Modal>) :
                (
                    <>{/* Header */}
                        <div className="bg-white rounded-lg shadow-lg px-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Código Cotización:</p>
                                    <p className="font-semibold">{header.codigo}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Usuario:</p>
                                    <p className="font-semibold">{header.usuario}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Estado:</p>
                                    <p className="font-semibold">{header.estado}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Aprobación:</p>
                                    <p className="font-semibold">{header.aprobacion}</p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mb-6">
                            {(cotizacionFromStore.estado !== "vacio") && (
                                <Button
                                    onClick={() => setIsModalProveedoresOpen(true)}
                                    className="text-white px-4 py-2 rounded min-w-52"
                                    text="Gestionar Proveedores"
                                    color='azul'
                                    icon={<FiPlusCircle />}
                                />
                            )}
                            {cotizacionFromStore.estado === "vacio" && (
                                <Button
                                    onClick={() => setIsModalAddRecursosOpen(true)}
                                    className="text-white px-4 py-2 rounded min-w-52"
                                    text="Añadir Recursos"
                                    color='verde'
                                    icon={<FiPlusCircle />}
                                />
                            )}
                            {(cotizacionFromStore.estado === "pendiente" || cotizacionFromStore.estado === "iniciada") && (
                                <Button
                                    onClick={() => setIsModalAddRecursosOpen(true)}
                                    text="Editar Recursos"
                                    className="text-white px-4 py-2 rounded min-w-52"
                                    color='amarillo'
                                    icon={<FiEdit />}
                                />
                            )}

                        </div>

                        {/* Reemplazar la tabla existente por TableComponentSimple */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <h2 className="text-xl font-semibold p-4 bg-blue-500 text-white">
                                Productos Seleccionados
                            </h2>
                            <div className="overflow-x-auto">
                                <TableComponentSimple
                                    columns={columns}
                                    data={cotizacionFromStore.estado === "vacio" ? [] : products}
                                    onDelete={(row) => handleDelete(row.id)}
                                    cotizacionEstado={cotizacionFromStore.estado}
                                />
                            </div>
                        </div>

                        {/* Modal con ComprasForm */}
                        <Modal
                            isOpen={isModalAddRecursosOpen}
                            onClose={handleCloseModal}
                            title="Seleccionar Recursos"
                        >
                            <AddRecursoRequerimientoCompra
                                cotizacionId={cotizacionFromStore.id ? cotizacionFromStore.id.toString() : null}
                                estadoCotizacion={cotizacionFromStore.estado}
                                solicitudCompraId={cotizacionFromStore.solicitud_compra_id?.id}
                                recursosActuales={cotizacionFromStore.estado === "vacio" ? [] : cotizacionRecursos}
                                onClose={handleCloseModal}
                            />
                        </Modal>
                    </>)}



        </div>
    );
}

export default ComprasSelectSources;