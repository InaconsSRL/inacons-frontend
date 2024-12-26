import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { TransferenciaRecurso, TransferenciaCompleta } from './types';


interface DetalleTransferenciaProps {
  transferencia: TransferenciaCompleta;
  onClose: () => void;
}

export function DetalleTransferencia({ transferencia, onClose }: DetalleTransferenciaProps): JSX.Element {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detalle de Transferencia</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Información General
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'recursos'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('recursos')}
            >
              Recursos
            </button>
          </div>
        </div>

        {activeTab === 'info' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-600">ID Transferencia</h3>
                <p>{transferencia.id}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Fecha</h3>
                <p>{new Date(transferencia.fecha).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Usuario</h3>
                <p>{`${transferencia.usuario_id.nombres} ${transferencia.usuario_id.apellidos}`}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-600">Tipo de Movimiento</h3>
                <p>{transferencia.movimiento_id.nombre}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Transporte</h3>
                <p>{transferencia.movilidad_id?.denominacion || '-'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Estado</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transferencia.movimiento_id.tipo === 'entrada' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {transferencia.movimiento_id.tipo}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recursos' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Cantidad</th>
                  <th className="px-4 py-2 text-left">Precio</th>
                  <th className="px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {transferencia.recursos.map((recurso: TransferenciaRecurso) => (
                  <tr key={recurso.recurso_id.codigo} className="border-b">
                    <td className="px-4 py-2">{recurso.recurso_id.codigo}</td>
                    <td className="px-4 py-2">{recurso.recurso_id.nombre}</td>
                    <td className="px-4 py-2">{recurso.cantidad}</td>
                    <td className="px-4 py-2">
                      S/. {recurso.recurso_id.precio_actual.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      S/. {(recurso.cantidad * recurso.recurso_id.precio_actual).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={4} className="px-4 py-2 text-right">Total:</td>
                  <td className="px-4 py-2">
                    S/. {transferencia.recursos.reduce(
                      (total: number, recurso: TransferenciaRecurso) => 
                        total + (recurso.cantidad * recurso.recurso_id.precio_actual),
                      0
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
