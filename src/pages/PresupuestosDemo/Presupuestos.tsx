import React, { useState } from 'react';

interface Item {
  id: string;
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  parcial: number;
}

interface Partida {
  id: string;
  codigo: string;
  nombre: string;
  items: Item[];
}

interface Presupuesto {
  codigo: string;
  nombre: string;
  fecha: string;
  lugar: string;
  partidas: Partida[];
}

interface Version {
  id: number;
  nombre: string;
  data: Presupuesto;
}

export const Presupuestos: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeVersion, setActiveVersion] = useState<Version | null>(null);
  const [comparingVersions, setComparingVersions] = useState(false);
  const [projectStatus] = useState<string>('En progreso');
  const [projectManager] = useState<string>('Juan Pérez');
  const [versionToCompare, setVersionToCompare] = useState<Version | null>(null);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [costVariation, setCostVariation] = useState<{ variance: number; percentageChange: number } | null>(null);

  const mockData: Presupuesto = {
    codigo: '0105005',
    nombre: 'PROYECTO DE CONSTRUCCIÓN COMPLEJO',
    fecha: '16/05/2023',
    lugar: 'LIMA',
    partidas: [
      {
        id: '1',
        codigo: '001',
        nombre: 'Fundaciones',
        items: [
          {
            id: '1',
            codigo: '001-001',
            descripcion: 'Cemento',
            unidad: 'Bolsa',
            cantidad: 100,
            precioUnitario: 20,
            parcial: 2000,
          },
          {
            id: '2',
            codigo: '001-002',
            descripcion: 'Arena',
            unidad: 'm3',
            cantidad: 50,
            precioUnitario: 15,
            parcial: 750,
          },
        ],
      },
      {
        id: '2',
        codigo: '002',
        nombre: 'Estructura',
        items: [
          {
            id: '3',
            codigo: '002-001',
            descripcion: 'Acero',
            unidad: 'Tonelada',
            cantidad: 10,
            precioUnitario: 1500,
            parcial: 15000,
          },
          {
            id: '4',
            codigo: '002-002',
            descripcion: 'Mano de Obra',
            unidad: 'Jornal',
            cantidad: 200,
            precioUnitario: 50,
            parcial: 10000,
          },
        ],
      },
    ],
  };

  // Inicializar versiones de ejemplo
  React.useEffect(() => {
    const version1: Version = {
      id: 1,
      nombre: 'Versión 1',
      data: mockData,
    };

    const version2Data: Presupuesto = {
      ...mockData,
      partidas: mockData.partidas.map((partida) => ({
        ...partida,
        items: partida.items.map((item) => {
          if (item.id === '1') {
            return { ...item, precioUnitario: item.precioUnitario * 1.1, parcial: item.parcial * 1.1 };
          }
          return item;
        }),
      })),
    };

    const version2: Version = {
      id: 2,
      nombre: 'Versión 2',
      data: version2Data,
    };

    setVersions([version1, version2]);
    setActiveVersion(version1);
  }, []);

  // Función mejorada para crear nueva versión
  const createNewVersion = () => {
    const newVersionId = versions.length + 1;
    if (!activeVersion) return;

    const newVersionData = { 
      ...activeVersion.data,
      fecha: new Date().toLocaleDateString()
    };
    
    const newVersion: Version = {
      id: newVersionId,
      nombre: `Versión ${newVersionId}`,
      data: newVersionData,
    };
    setVersions([...versions, newVersion]);
    setActiveVersion(newVersion);
  };

  // Función para comparar versiones
  const compareVersions = (version1: Version, version2: Version) => {
    // Comparar partidas e items
    const differences: any[] = [];

    version1.data.partidas.forEach((partida1) => {
      const partida2 = version2.data.partidas.find((p) => p.id === partida1.id);
      if (partida2) {
        partida1.items.forEach((item1) => {
          const item2 = partida2.items.find((i) => i.id === item1.id);
          if (item2) {
            if (item1.precioUnitario !== item2.precioUnitario || item1.cantidad !== item2.cantidad) {
              differences.push({
                itemId: item1.id,
                descripcion: item1.descripcion,
                version1: { precioUnitario: item1.precioUnitario, cantidad: item1.cantidad },
                version2: { precioUnitario: item2.precioUnitario, cantidad: item2.cantidad },
              });
            }
          } else {
            differences.push({
              itemId: item1.id,
              descripcion: item1.descripcion,
              version1: 'Item existe',
              version2: 'Item no existe',
            });
          }
        });
      }
    });

    setComparisonResults(differences);
  };

  // Función mejorada para comparar versiones
  const handleCompareVersions = () => {
    if (!activeVersion || !versionToCompare) return;
    
    setComparingVersions(true);
    compareVersions(activeVersion, versionToCompare);
    analyzeCostVariation(activeVersion, versionToCompare);
  };

  // Función para analizar variación de costos
  const analyzeCostVariation = (originalVersion: Version, newVersion: Version) => {
    const totalOriginal = calculateTotal(originalVersion.data);
    const totalNew = calculateTotal(newVersion.data);
    const variance = totalNew - totalOriginal;
    const percentageChange = (variance / totalOriginal) * 100;
    setCostVariation({ variance, percentageChange });
  };

  const calculateTotal = (data: Presupuesto) => {
    return data.partidas.reduce((totalPartidas, partida) => {
      const totalItems = partida.items.reduce((total, item) => total + item.parcial, 0);
      return totalPartidas + totalItems;
    }, 0);
  };

  const handleExport = () => {
    if (!activeVersion) return;
    const dataStr = JSON.stringify(activeVersion.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `presupuesto_${activeVersion.data.codigo}_${activeVersion.nombre}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text) as Presupuesto;
      const newVersionId = versions.length + 1;
      const newVersion: Version = {
        id: newVersionId,
        nombre: `Versión ${newVersionId}`,
        data: importedData
      };
      setVersions([...versions, newVersion]);
      setActiveVersion(newVersion);
    } catch (error) {
      console.error('Error al importar:', error);
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Estructura</h2>
        </div>
        <div className="p-2 overflow-y-auto">
          <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
            <i className="fas fa-folder-open text-yellow-500 mr-2"></i>
            <span className="text-sm">{activeVersion?.data.nombre}</span>
          </div>
          {activeVersion?.data.partidas.map((partida) => (
            <div key={partida.id} className="ml-4">
              <div
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleExpand(partida.id)}
              >
                <i
                  className={`fas fa-folder${expandedItems.includes(partida.id) ? '-open' : ''
                    } text-yellow-500 mr-2`}
                ></i>
                <span className="text-sm">{partida.nombre}</span>
              </div>
              {expandedItems.includes(partida.id) && (
                <div className="ml-4">
                  {partida.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <i className="fas fa-file text-gray-500 mr-2"></i>
                      <span className="text-sm">{item.descripcion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar actualizado */}
        <div className="bg-white shadow-sm p-2 flex items-center space-x-2">
          <button 
            onClick={createNewVersion}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <i className="fas fa-plus mr-1"></i> Nuevo
          </button>
          <button 
            onClick={() => {/* Implementar lógica de guardado */}}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            <i className="fas fa-save mr-1"></i> Guardar
          </button>
          <div className="relative">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=".json"
              onChange={handleImport}
            />
            <button 
              onClick={() => document.getElementById('fileInput')?.click()}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
              <i className="fas fa-file-import mr-1"></i> Importar
            </button>
          </div>
          <button 
            onClick={handleExport}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
            <i className="fas fa-file-export mr-1"></i> Exportar
          </button>
          <button
            onClick={handleCompareVersions}
            disabled={!versionToCompare || !activeVersion}
            className={`px-3 py-1 text-white rounded ${
              !versionToCompare || !activeVersion 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            <i className="fas fa-exchange-alt mr-1"></i> Comparar Versiones
          </button>
        </div>

        {/* Header Info */}
        <div className="bg-white m-4 p-4 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm">
                <span className="font-semibold">Código:</span> {activeVersion?.data.codigo}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Nombre:</span> {activeVersion?.data.nombre}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Gerente de Proyecto:</span> {projectManager}
              </p>
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold">Fecha:</span> {activeVersion?.data.fecha}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Lugar:</span> {activeVersion?.data.lugar}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Estado:</span> {projectStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 m-4 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ítem
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unit.
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcial
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeVersion?.data.partidas.map((partida) => (
                <React.Fragment key={partida.id}>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium">{partida.codigo}</td>
                    <td className="px-4 py-2 text-sm font-medium" colSpan={5}>
                      {partida.nombre}
                    </td>
                  </tr>
                  {partida.items.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 ${selectedItem?.id === item.id ? 'bg-gray-100' : ''
                        }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-2 text-sm">{item.codigo}</td>
                      <td className="px-4 py-2 text-sm">{item.descripcion}</td>
                      <td className="px-4 py-2 text-sm">{item.unidad}</td>
                      <td className="px-4 py-2 text-sm text-right">{item.cantidad.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        {item.precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">{item.parcial.toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resultados de comparación mejorados */}
        {comparingVersions && comparisonResults && (
          <div className="m-4 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resultados de la Comparación</h3>
              <button
                onClick={() => {
                  setComparingVersions(false);
                  setComparisonResults(null);
                  setCostVariation(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ítem
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versión Actual
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versión Comparada
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonResults.map((diff: any) => (
                  <tr key={diff.itemId}>
                    <td className="px-4 py-2 text-sm">{diff.itemId}</td>
                    <td className="px-4 py-2 text-sm">{diff.descripcion}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {JSON.stringify(diff.version1)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {JSON.stringify(diff.version2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {costVariation && (
              <div className="mt-4">
                <p className="text-sm">
                  <span className="font-semibold">Variación de Costo Total:</span>{' '}
                  {costVariation.variance.toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Porcentaje de Cambio:</span>{' '}
                  {costVariation.percentageChange.toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Detalles</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Versión Activa</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={activeVersion?.id || ''}
                onChange={(e) => {
                  const version = versions.find((v) => v.id === Number(e.target.value));
                  setActiveVersion(version || null);
                }}
              >
                <option value="">Selecciona una versión</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comparar con</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={versionToCompare?.id || ''}
                onChange={(e) => {
                  const version = versions.find((v) => v.id === Number(e.target.value));
                  setVersionToCompare(version || null);
                }}
              >
                <option value="">Selecciona una versión</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {projectStatus}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ítem Seleccionado</label>
              {selectedItem ? (
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-semibold">Código:</span> {selectedItem.codigo}
                  </p>
                  <p>
                    <span className="font-semibold">Descripción:</span> {selectedItem.descripcion}
                  </p>
                  <p>
                    <span className="font-semibold">Cantidad:</span> {selectedItem.cantidad}
                  </p>
                  <p>
                    <span className="font-semibold">Precio Unitario:</span>{' '}
                    {selectedItem.precioUnitario}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No hay ítem seleccionado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};