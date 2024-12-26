import { FiEye } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTransferencias } from '../../slices/transferenciaSlice';
import { fetchTransferenciaDetalles } from '../../slices/transferenciaDetalleSlice';
import { fetchTransferenciaRecursosById } from '../../slices/transferenciaRecursoSlice';
import { TransferFilter } from "./TransferFilter";
import { DetalleTransferencia } from "./DetalleTransferencia";
import { TransferenciaCompleta, TipoFiltro, SortState } from "./types";
import { TableHeader } from "./components/TableHeader";

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  </div>
);

export function TransferTable() {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(true);
    const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('TODOS');
    const [selectedTransferencia, setSelectedTransferencia] = useState<TransferenciaCompleta | null>(null);
    const [sortState, setSortState] = useState<SortState>({ field: '', direction: 'asc' });
    
    const transferencias = useSelector((state: RootState) => state.transferencia.transferencias);
    const detalles = useSelector((state: RootState) => state.transferenciaDetalle.transferenciaDetalles);
    const recursos = useSelector((state: RootState) => state.transferenciaRecurso.transferenciaRecursos);
    const error = useSelector((state: RootState) => state.transferencia.error);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchTransferencias()).unwrap();
            } catch (err) {
                console.error('Error al cargar los datos:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    useEffect(() => {
        const loadDetalles = async () => {
            if (transferencias.length > 0 && selectedTransferencia) {
                try {
                    // Cargar todos los detalles en paralelo
                    const detallesPromises = transferencias.map(_transferencia =>
                        dispatch(fetchTransferenciaDetalles()).unwrap()
                    );
                    const todosDetalles = await Promise.all(detallesPromises);

                    // Aplanar el array de detalles y cargar todos los recursos en paralelo
                    const detallesAplanados = todosDetalles.flat();
                    const recursosPromises = detallesAplanados.map(detalle =>
                        dispatch(fetchTransferenciaRecursosById(detalle.id))
                    );
                    await Promise.all(recursosPromises);
                } catch (err) {
                    console.error('Error al cargar detalles y recursos:', err);
                }
            }
        };
        loadDetalles();
    }, [selectedTransferencia, transferencias, dispatch]);
    
    const transferenciasCompletas: TransferenciaCompleta[] = transferencias
    .filter(transferencia => {
        if (tipoFiltro === 'TODOS') return true;
        
        switch (tipoFiltro) {
            case 'COMPRAS':
                return transferencia.movimiento_id.tipo === 'entrada' && 
                       transferencia.movimiento_id.nombre.toLowerCase().includes('compra');
            case 'RECEPCIONES':
                return transferencia.movimiento_id.tipo === 'entrada' && 
                       transferencia.movimiento_id.nombre.toLowerCase().includes('transferencia');
            case 'PRESTAMOS':
                return transferencia.movimiento_id.tipo === 'salida' && 
                       transferencia.movimiento_id.nombre.toLowerCase().includes('prestamo');
            case 'SALIDA':
                return transferencia.movimiento_id.tipo === 'salida' && 
                       transferencia.movimiento_id.nombre.toLowerCase().includes('salida');
            default:
                return true;
        }
    })
    .map(transferencia => {
        // Obtener los detalles de esta transferencia
        const detallesTransferencia = detalles.filter(d => 
            d.transferencia_id && d.transferencia_id.id === transferencia.id
        );
        
        // Obtener los recursos asociados a estos detalles
        const recursosTransferencia = recursos.filter(r => 
            detallesTransferencia.some(d => d.id === r.transferencia_detalle_id?.id)
        );

        return {
            ...transferencia,
            detalles: detallesTransferencia,
            recursos: recursosTransferencia
        };
    });

    const handleSort = (field: keyof TransferenciaCompleta) => {
        setSortState(prevState => {
            const direction = prevState.field === field && prevState.direction === 'asc' ? 'desc' : 'asc';
            return { field, direction };
        });
    };

    const sortedTransferencias = [...transferenciasCompletas].sort((a, b) => {
        if (sortState.field) {
            const fieldA = a[sortState.field];
            const fieldB = b[sortState.field];
            if (fieldA !== undefined && fieldB !== undefined) {
                if (fieldA < fieldB) return sortState.direction === 'asc' ? -1 : 1;
                if (fieldA > fieldB) return sortState.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    return (
        <div className="w-full">
            <TransferFilter tipoFiltro={tipoFiltro} onChange={setTipoFiltro} />
            <table className="min-w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-50">
                        <TableHeader field="id" label="ID" onSort={handleSort} currentSort={sortState} />
                        <TableHeader field="usuario_id" label="Usuario" onSort={handleSort} currentSort={sortState} />
                        <TableHeader field="fecha" label="Fecha" onSort={handleSort} currentSort={sortState} />
                        <TableHeader field="movimiento_id" label="Movimiento" onSort={handleSort} currentSort={sortState} />
                        <TableHeader field="movilidad_id" label="Transporte" onSort={handleSort} currentSort={sortState} />
                        <TableHeader field="estado" label="Estado" onSort={handleSort} currentSort={sortState} />
                        <th className="font-semibold p-2 text-left">Acciones</th>
                    </tr>
                </thead>
            </table>
            {/* Contenedor con scroll */}
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <table className="min-w-full mt-4 border">
                    <tbody>
                        {isLoading ? (
                            [...Array(3)].map((_, index) => (
                                <tr key={index}>
                                    <td colSpan={8} className="p-2">
                                        <Skeleton />
                                    </td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={8} className="p-4 text-center text-red-500">
                                    Error al cargar las transferencias: {error}
                                </td>
                            </tr>
                        ) : sortedTransferencias.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-4 text-center text-gray-500">
                                    No hay transferencias disponibles
                                </td>
                            </tr>
                        ) : (
                            sortedTransferencias.map((transferencia: TransferenciaCompleta) => (
                                <tr key={transferencia.id} className="hover:bg-gray-50">
                                    <td className="p-2">{transferencia.id}</td>
                                    <td className="p-2">
                                        {transferencia.usuario_id.nombres} {transferencia.usuario_id.apellidos}
                                    </td>
                                    <td className="p-2">{new Date(transferencia.fecha).toLocaleDateString()}</td>
                                    <td className="p-2">{transferencia.movimiento_id.nombre}</td>
                                    <td className="p-2">{transferencia.movilidad_id?.denominacion || '-'}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            transferencia.movimiento_id.tipo === 'entrada' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {transferencia.movimiento_id.tipo}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <button 
                                            className="bg-transparent border-none text-blue-800 hover:text-blue-600 transition-colors"
                                            title="Ver detalles"
                                            onClick={() => setSelectedTransferencia(transferencia)}
                                        >
                                            <FiEye className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {selectedTransferencia && (
                <DetalleTransferencia
                    transferencia={selectedTransferencia}
                    onClose={() => setSelectedTransferencia(null)}
                />
            )}
        </div>
    );
}
