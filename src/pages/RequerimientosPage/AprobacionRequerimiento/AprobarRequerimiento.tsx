import { useState, useEffect } from 'react';
import { FiCalendar, FiChevronsDown } from 'react-icons/fi';
// import { addRequerimientoRecurso, deleteRequerimientoRecurso, fetchRequerimientoRecursos } from '../../slices/requerimientoRecursoSlice';
import { fetchRequerimientoRecursos } from '../../../slices/requerimientoRecursoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import LoaderPage from '../../../components/Loader/LoaderPage';

// Tipos
type RequestItem = {
  codigo: string;
  nombre: string;
  unidad: string;
  uEmb: string;
  cantidad: number;
  notas: string;
  comprado: number;
  cotizado: number;
  urgencia: string;
  estado: string;
  factor: number;
  precioHistorico: number;
  fechaEntrega?: string;
};


const AprobarRequerimiento = ({ id, requerimiento }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { requerimientoRecursos, loading } = useSelector((state: RootState) => state.requerimientoRecurso);

  console.log(requerimiento)

  useEffect(() => {
    if (id) dispatch(fetchRequerimientoRecursos(id));
  }, []);

  if (loading) {
    return <LoaderPage />;
  }
  console.log(requerimientoRecursos);
  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Tipo de Solicitud:</label>
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white text-xs">
              <span>SP-Según Ppto.</span>
              <FiChevronsDown size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">F Emisión:</label>
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white text-xs">
              <span>{requerimiento.deliveryDate}</span>
              <FiCalendar size={14} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Obra:</label>
            <input
              type="text"
              value={requerimiento.title.split('-')[1]}
              className="px-2 py-1 border rounded text-xs"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Número:</label>
            <input
              type="text"
              value={requerimiento.projectCode}
              className="px-2 py-1 border rounded text-xs w-16"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Estado:</label>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              {requerimiento.approvedBy}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Aprobado:</label>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Por Aprobar
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Código</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Nombre</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Unidad</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">U.Emb</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Metrado</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Estado</th>
              {/* <th className="px-2 py-2 text-left font-medium text-gray-600">Comprado</th>
                            <th className="px-2 py-2 text-left font-medium text-gray-600">Cotizado</th> */}
              <th className="px-2 py-2 text-left font-medium text-gray-600">P.Historico</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">F.Entrega</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">CostoParcial</th>
              <th className="px-2 py-2 text-left font-medium text-gray-600">Notas</th>
            </tr>
          </thead>
          <tbody>
            {requerimientoRecursos.map((recurso) => (
              <tr
                key={recurso.id}
                className="border-b hover:bg-blue-50 transition-colors text-[10px] text-center text-slate-500"
              >
                <td className="px-2 py-2">{recurso.codigo}</td>
                <td className="px-2 py-2">{recurso.nombre}</td>
                {/* <td className="px-2 py-2">{recurso.unidad}</td> */}
                <td className="px-2 py-2">UNID</td>
                <td className="px-2 py-2">UNID</td>
                <td className="px-2 py-2">{recurso.cantidad_aprobada ?? "-"}</td>
                <td className="px-2 py-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{recurso.estado}</span></td>
                <td className="px-2 py-2">{recurso.costo_ref ?? "-"}</td>
                <td className="px-2 py-2">{new Date(recurso.fecha_limit).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                <td className="px-2 py-2">{(recurso.costo_ref ?? 1) * (recurso.cantidad_aprobada ?? 2)}</td>
                <td className="px-2 py-2">{recurso.notas}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8} className="px-2 py-2 text-right font-medium text-gray-600">Total:</td>
              <td className="px-2 py-2 text-center font-medium text-gray-600">
          S/. {requerimientoRecursos.reduce((total, recurso) => total + (recurso.costo_ref ?? 1) * (recurso.cantidad_aprobada ?? 2), 0)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex justify-end gap-2 mt-4">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors">
                    Ver Compras
                </button>
                <button className="px-3 py-1 bg-gray-500 text-white rounded-md text-xs hover:bg-gray-600 transition-colors">
                    Ver Historial
                </button>
                <button className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors">
                    Act. Compras
                </button>
                <button className="px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors">
                    Dar por Terminada
                </button>
            </div> */}
    </div>
  );
};

export default AprobarRequerimiento;