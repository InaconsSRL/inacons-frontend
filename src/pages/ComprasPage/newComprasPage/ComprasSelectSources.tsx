import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import TableComponentSimple, { Column, CellType } from '../../../components/Table/TableComponentSimple';
import Modal from '../../../components/Modal/Modal';
import AddRecursoRequerimientoCompra from './AddRecursoRequerimientoCompra';
import CompararProveedores from './CompararProveedores';
import { fetchCotizacionRecursoForCotizacionId, deleteCotizacionRecurso } from '../../../slices/cotizacionRecursoSlice';
import noImage from '../../../assets/NoImage.webp';
import Loader from '../../../components/Loader/LoaderPage';
import { RootState } from '../../../store/store';
import { CotizacionRecurso, updateCotizacion } from '../../../slices/cotizacionSlice';


// Definir interfaces si es necesario

interface ComprasSelectSourcesProps {
    cotizacion: {
        id?: string;
        fecha?: string;
        monto?: number;
        codigo_cotizacion?: string;
        usuario_id?: {
            id: string;
            nombres: string;
            apellidos: string;
        };
        estado?: string;
        aprobacion?: boolean;
    };
}

interface FormattedProduct {
    id: string;
    imagen: string;
    codigo: string;
    nombre: string;
    unidad: string | undefined;
    cantidad: number;
    costo: number;
    subtotal: number;
    nota: string;
    [key: string]: string | number | undefined;
}

interface Unidad {
    id: string;
    nombre: string;
}

function ComprasSelectSources({ cotizacion: initialCotizacion }: ComprasSelectSourcesProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [products, setProducts] = useState<FormattedProduct[]>([]);
    const unidades = useSelector((state: RootState) => state.unidad.unidades);
    
    // Añadir selector para obtener la cotización actualizada del store
    const cotizacionFromStore = useSelector((state: RootState) => 
        state.cotizacion.cotizaciones.find(c => c.id === initialCotizacion.id)
    ) || initialCotizacion;

    // Añadir selectores para loading states
    const cotizacionRecursoLoading = useSelector((state: RootState) => state.cotizacionRecurso.loading);
    const cotizacionLoading = useSelector((state: RootState) => state.cotizacion.loading);

    // Función para cargar los recursos
    const loadResources = React.useCallback(async () => {
        if (cotizacionFromStore.estado !== "vacio" && cotizacionFromStore.id) {
            try {
                const recursos = await dispatch(fetchCotizacionRecursoForCotizacionId(cotizacionFromStore.id.toString())).unwrap() as CotizacionRecurso[];
                const formattedProducts = recursos.map((recurso: CotizacionRecurso) => ({
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
                setProducts(formattedProducts);
            } catch (error) {
                console.error('Error al cargar recursos:', error);
            }
        }
    }, [cotizacionFromStore.estado, cotizacionFromStore.id, dispatch, unidades]);

    // Efecto inicial para cargar recursos
    useEffect(() => {
        loadResources();
    }, [loadResources]);

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalProveedorOpen, setIsModalProveedorOpen] = useState(false);

    const handleModalClose = () => {
        loadResources(); // Recargar recursos cuando se cierra el modal
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteCotizacionRecurso(id));
            await loadResources(); // Recargar la lista después de eliminar
            
            // Verificar si quedan recursos después de eliminar
            const recursos = await dispatch(fetchCotizacionRecursoForCotizacionId(cotizacionFromStore.id!.toString())).unwrap() as CotizacionRecurso[];
            
            // Si no quedan recursos, actualizar el estado de la cotización a "vacio"
            if (recursos.length === 0 && cotizacionFromStore.id) {
                await dispatch(updateCotizacion({
                    id: cotizacionFromStore.id,
                    estado: "vacio"
                }));
            }
        } catch (error) {
            console.error('Error al eliminar el recurso:', error);
        }
    };

    // Mostrar loader si cualquier operación está en progreso
    if (cotizacionRecursoLoading || cotizacionLoading) {
        return <Loader />;
    }

    return (
        <div className="min-h-[80vh] bg-gray-100 p-4">
            {/* Header */}
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
                <button
                    onClick={() => setIsModalProveedorOpen(true)}
                    className="bg-blue-800 text-white px-4 py-2 rounded">
                    Proveedor
                </button>
                {cotizacionFromStore.estado === "vacio" && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Añadir Recursos
                    </button>
                )}
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Guardar
                </button>
                <button className="bg-yellow-400 text-white px-4 py-2 rounded">
                    Enviar
                </button>
            </div>

            {/* Reemplazar la tabla existente por TableComponentSimple */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 bg-blue-500 text-white">
                    Productos Seleccionados
                </h2>
                <div className="overflow-x-auto">
                    <TableComponentSimple
                        columns={columns}
                        data={products}
                        onDelete={(row) => handleDelete(row.id)}
                    />
                </div>
            </div>

            {/* Modal con ComprasForm */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title="Seleccionar Recursos"
            >
                <AddRecursoRequerimientoCompra
                    cotizacionId={cotizacionFromStore.id ? cotizacionFromStore.id.toString() : null}
                    onClose={handleModalClose}
                />
            </Modal>
            <Modal
                isOpen={isModalProveedorOpen}
                onClose={() => setIsModalProveedorOpen(false)}
                title="Añadir Proveedores"

            >
                <CompararProveedores
                    onClose={() => setIsModalProveedorOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default ComprasSelectSources;