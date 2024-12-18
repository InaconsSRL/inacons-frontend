import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAlmacenes } from "../../slices/almacenSlice";
import { getAlmacenRecurso } from '../../slices/almacenRecursoSlice';
import TableComponent from '../../components/Table/TableComponent';
import LoaderPage from '../../components/Loader/LoaderPage';

const AlmacenBetha: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedAlmacenId, setSelectedAlmacenId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Selectors
    const almacenes = useSelector((state: RootState) => state.almacen.almacenes);
    const almacenRecursosDetallados = useSelector((state: RootState) => state.almacenRecurso.almacenRecursosDetallados);
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    useEffect(() => {
        if (almacenes.length === 0) {
            dispatch(fetchAlmacenes());
        }
    }, [dispatch, almacenes.length]);

    const handleAlmacenChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const almacenId = e.target.value;
        setSelectedAlmacenId(almacenId);
        if (almacenId) {
            setIsLoading(true);
            await dispatch(getAlmacenRecurso(almacenId));
            setIsLoading(false);
        }
    };


    // Preparar datos para la tabla
    const tableData = {
        headers: ['Código', 'Nombre', 'Descripción', 'Cantidad', 'Costo', 'Unidad', 'Bodega', 'Imagen'],
        filterSelect: [false, false, false, false, false, true, true, false],
        filter: [true, true, true, true, true, true, false],
        rows: almacenRecursosDetallados
            .map(recurso => {
                const unidad = recurso.recurso_id ? unidades.find(u => u.id === recurso.recurso_id.unidad_id) : null;
                return {
                    Código: recurso.recurso_id ? recurso.recurso_id.codigo : "no hay código",
                    Nombre: recurso.recurso_id ? recurso.recurso_id.nombre : 'Sin nombre',
                    Descripción: recurso.recurso_id ? recurso.recurso_id.descripcion : 'Sin descripción',
                    Cantidad: recurso.cantidad,
                    Costo: recurso.costo,
                    Bodega: recurso.bodega_id ? recurso.bodega_id.codigo : 'Sin bodega',
                    Unidad: recurso.recurso_id ? (unidad ? unidad.nombre : 'Unidad no encontrada') : 'Sin unidad',
                    Imagen: recurso.recurso_id?.imagenes?.length > 0
                        ? recurso.recurso_id.imagenes[0].file
                        : 'Sin imagen'
                };
            })
    };

    return (

        <div className="w-full p-4 flex flex-col flex-grow bg-white/60 overflow-hidden rounded-xl">
            <div className="mb-6">
                <label htmlFor="almacen" className="block text-sm font-medium text-white mb-2">
                    Seleccionar Almacén
                </label>
                <select
                    id="almacen"
                    value={selectedAlmacenId}
                    onChange={handleAlmacenChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Seleccione un almacén</option>
                    {almacenes.map(almacen => (
                        <option key={almacen.id} value={almacen.id}>
                            {almacen.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {selectedAlmacenId && (
                <div className="flex flex-1 overflow-hidden rounded-xl">
                    <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
                        <div className="flex-grow border rounded-lg overflow-hidden">
                            <div className="h-full overflow-auto">
                                {isLoading ? (
                                    <LoaderPage />
                                ) : (
                                    almacenRecursosDetallados.length > 0 && <TableComponent tableData={tableData} />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};

export default AlmacenBetha;