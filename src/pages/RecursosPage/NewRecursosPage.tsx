export const RecursoFormComponent = () => {
    return (
      <div className="bg-gray-100 p-4 w-[800px] h-[600px] overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Nuevo</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Duplicar</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Notas</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Cambia Recurso</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Cambia Unidad</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Ver Historial</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Grabar</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Código</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="012135" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vigente</label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option>Si</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="ALVARILLA DE ACERO CORRUGADO 3/8" />
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Clase</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="180301" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidad</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="und" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bloquear Salida</label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bien/Servicio</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="Bien" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Con Stock</label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option>Si</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo Costo</label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option>Material</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="Gravado" />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unidades Catálogos</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Add table rows here */}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Costo Promedio</label>
              <input type="text" className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm" value="18.79" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Última Compra</label>
              <input type="text" className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm" value="16.68" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Costo Inicial</label>
              <input type="text" className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm" value="16.71" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duración</label>
              <input type="text" className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm" value="0" />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Ver Precios</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Grabar Costo</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Grabar Duración</button>
          </div>
        </div>
      </div>
    );
    };