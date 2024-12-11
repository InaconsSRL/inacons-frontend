import { FiEye } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTransferencias } from '../../slices/transferenciaSlice';
import { fetchTransferenciaDetalles } from '../../slices/transferenciaDetalleSlice';
import { fetchTransferenciaRecursos } from '../../slices/transferenciaRecursoSlice';

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  </div>
);

interface TransferenciaCompleta {
  id: string;
  fecha: Date;
  usuario_id: {
    nombres: string;
    apellidos: string;
  };
  movimiento_id: {
    nombre: string;
    tipo: string;
  };
  movilidad_id: {
    denominacion: string;
  };
  detalles: any[];
  recursos: any[];
}

export function TransferTable() {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(true);
    
    const transferencias = useSelector((state: RootState) => state.transferencia.transferencias);
    const detalles = useSelector((state: RootState) => state.transferenciaDetalle.transferenciaDetalles);
    const recursos = useSelector((state: RootState) => state.transferenciaRecurso.transferenciaRecursos);
    
    const error = useSelector((state: RootState) => 
        state.transferencia.error || 
        state.transferenciaDetalle.error || 
        state.transferenciaRecurso.error
    );

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchTransferencias()).unwrap(),
                    dispatch(fetchTransferenciaDetalles()).unwrap(),
                    dispatch(fetchTransferenciaRecursos()).unwrap()
                ]);
            } catch (err) {
                console.error('Error al cargar los datos:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    const transferenciasCompletas = transferencias.map(transferencia => ({
        ...transferencia,
        detalles: detalles.filter(d => d.transferencia_id === transferencia.id),
        recursos: recursos.filter(r => {
            console.log('Transferencia ID:', transferencia.id, 'Recurso ID:', r.transferencia_id);
            return r.transferencia_id === transferencia.id;
        })
    }));

    return (
        <div className="w-full">
            <table className="min-w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="font-semibold p-2 text-left">ID</th>
                        <th className="font-semibold p-2 text-left">Usuario</th>
                        <th className="font-semibold p-2 text-left">Fecha</th>
                        <th className="font-semibold p-2 text-left">Movimiento</th>
                        <th className="font-semibold p-2 text-left">Transporte</th>
                        <th className="font-semibold p-2 text-left">Recursos</th>
                        <th className="font-semibold p-2 text-left">Estado</th>
                        <th className="font-semibold p-2 text-left">Acciones</th>
                    </tr>
                </thead>
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
                    ) : transferenciasCompletas.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="p-4 text-center text-gray-500">
                                No hay transferencias disponibles
                            </td>
                        </tr>
                    ) : (
                        transferenciasCompletas.map((transferencia: TransferenciaCompleta) => (
                            <tr key={transferencia.id} className="hover:bg-gray-50">
                                <td className="p-2">{transferencia.id}</td>
                                <td className="p-2">
                                    {transferencia.usuario_id.nombres} {transferencia.usuario_id.apellidos}
                                </td>
                                <td className="p-2">{new Date(transferencia.fecha).toLocaleDateString()}</td>
                                <td className="p-2">{transferencia.movimiento_id.nombre}</td>
                                <td className="p-2">{transferencia.movilidad_id?.denominacion || '-'}</td>
                                <td className="p-2">{transferencia.recursos.length} recursos</td>
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
    );
}
