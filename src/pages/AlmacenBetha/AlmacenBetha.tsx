import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import TableComponent from '../../components/Table/TableComponent';
import LoaderPage from '../../components/Loader/LoaderPage';
import { fetchRecursosBodegaByObra } from '../../slices/obraBodegaRecursoSlice';
import { fetchObras } from '../../slices/obrasSlice';
import SalidasConsumosPrestamos from '../Tranferencias/SalidasConsumosPrestamos/SalidasConsumosPrestamos';
import Modal from '../../components/Modal/Modal';

const AlmacenBetha: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedObraId, setSelectedObraId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSalidas, setShowSalidas] = useState<boolean>(false);

    // Selectors
    const obras = useSelector((state: RootState) => state.obra.obras);
    const obraBodegaRecursos = useSelector((state: RootState) => state.obraBodegaRecurso.obraBodegaRecursos);
    const unidades = useSelector((state: RootState) => state.unidad.unidades);

    useEffect(() => {
        if (obras.length === 0) {
            dispatch(fetchObras());
        }
    }, [dispatch, obras.length]);

    const handleObraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const obraId = e.target.value;
        setSelectedObraId(obraId);
        if (obraId) {
            setIsLoading(true);
            await dispatch(fetchRecursosBodegaByObra(obraId));
            setIsLoading(false);
        }
    };

    // Preparar datos para la tabla
    const tableData = {
        headers: ['Código', 'Nombre', 'Cantidad', 'Costo', 'Unidad', 'Bodega', 'Estado', 'Imagen', 'ID'],
        filterSelect: [false, false, false, false, true, true, true, false, false],
        filter: [true, true, true, true, true, true, true, false, true],
        rows: obraBodegaRecursos
            .map(recurso => {
                const unidad = recurso.recurso_id ? unidades.find(u => u.id === recurso.recurso_id.unidad_id) : null;
                return {
                    ID: recurso.id,
                    Código: recurso.recurso_id?.codigo || "No hay código",
                    Nombre: recurso.recurso_id?.nombre || 'Sin nombre',
                    Cantidad: recurso.cantidad,
                    Costo: recurso.costo.toFixed(2),
                    Bodega: recurso.obra_bodega_id?.nombre || 'Sin bodega',
                    Unidad: unidad?.nombre || 'Sin unidad',
                    Estado: recurso.estado,
                    Imagen: recurso.recurso_id?.imagenes?.[0]?.file || 'Sin imagen'
                };
            })
    };

    return (
        <div className="w-full p-4 flex flex-col flex-grow bg-white/60 overflow-hidden rounded-xl">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex-1">
                    <label htmlFor="obra" className="block text-sm font-medium text-white mb-2">
                        Seleccionar Obra
                    </label>
                    <select
                        id="obra"
                        value={selectedObraId}
                        onChange={handleObraChange}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Seleccione una obra</option>
                        {obras.map(obra => (
                            <option key={obra.id} value={obra.id}>
                                {obra.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedObraId && (
                    <button
                        onClick={() => setShowSalidas(true)}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Registrar Salida
                    </button>
                )}
            </div>

            {selectedObraId && !showSalidas && (
                <div className="flex flex-1 overflow-hidden rounded-xl">
                    <main className="w-full flex flex-col flex-grow p-4 bg-white/80 overflow-hidden">
                        <div className="flex-grow border rounded-lg overflow-hidden">
                            <div className="h-full overflow-auto">
                                {isLoading ? (
                                    <LoaderPage />
                                ) : (
                                    obraBodegaRecursos.length > 0 && <TableComponent tableData={tableData} />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            )}

            {showSalidas && (
                <Modal
                    isOpen={showSalidas}
                    onClose={() => setShowSalidas(false)}
                    title="Salidas de Consumos y Préstamos"
                >
                    <SalidasConsumosPrestamos
                        obraId={selectedObraId}
                        recursos={obraBodegaRecursos}
                        onClose={() => setShowSalidas(false)}
                        loading={isLoading} // Pasamos la prop
                    />
                </Modal>
            )}
        </div>
    );
};

export default AlmacenBetha;