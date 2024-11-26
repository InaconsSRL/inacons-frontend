import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlusCircle, FiTrash2, FiAward } from 'react-icons/fi';
import Button from '../../../components/Buttons/Button';
import ModalAgregarProveedor from './ModalAgregarProveedor';

interface CompararProveedoresProps {
  onClose: () => void;
}

interface RecursoItem {
  id: string;
  codigo: string;
  nombre: string;
  unidad: string;
  notas: string;
  cantidadPpto: number;
  cantidadSol: number;
  precio: number;
  subTotal: number;
}

interface ProveedorCotizacion {
  id: string;
  nombre: string;
  items: {
    recursoId: string;
    cantidad: number;
    precio: number;
    subTotal: number;
  }[];
  total: number;
}

const CompararProveedores: React.FC<CompararProveedoresProps> = ({ onClose }) => {
  const [recursos] = useState<RecursoItem[]>([
    {
      id: '1',
      codigo: '023564',
      nombre: 'Al_Bolsas de Cemento',
      unidad: 'Und',
      notas: '04755_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 15,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '2',
      codigo: '023565',
      nombre: 'Al_Varillas de Acero 1/2"',
      unidad: 'Und',
      notas: '04756_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 2,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '3',
      codigo: '023566',
      nombre: 'Al_Arena Gruesa',
      unidad: 'm³',
      notas: '04757_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 5,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '4',
      codigo: '023567',
      nombre: 'Al_Piedra Chancada',
      unidad: 'm³',
      notas: '04758_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 3,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '5',
      codigo: '023568',
      nombre: 'Al_Ladrillos King Kong',
      unidad: 'Millar',
      notas: '04759_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 2,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '6',
      codigo: '023569',
      nombre: 'Al_Tubería PVC 4"',
      unidad: 'Und',
      notas: '04760_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 10,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '7',
      codigo: '023570',
      nombre: 'Al_Pintura Látex',
      unidad: 'Gal',
      notas: '04761_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 8,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '8',
      codigo: '023571',
      nombre: 'Al_Alambre Negro #16',
      unidad: 'Kg',
      notas: '04762_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 25,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '9',
      codigo: '023572',
      nombre: 'Al_Clavos 2"',
      unidad: 'Kg',
      notas: '04763_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 15,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '10',
      codigo: '023573',
      nombre: 'Al_Madera Tornillo',
      unidad: 'p²',
      notas: '04764_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 100,
      precio: 0,
      subTotal: 0,
    },
    {
      id: '11',
      codigo: '023574',
      nombre: 'Al_Yeso',
      unidad: 'Kg',
      notas: '04765_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 50,
      precio: 0,
      subTotal: 0,
    }
  ]);

  const [proveedores, setProveedores] = useState<ProveedorCotizacion[]>([]);
  const [showAddProveedor, setShowAddProveedor] = useState(false);

  const agregarProveedor = (nombre: string) => {
    const newProveedor: ProveedorCotizacion = {
      id: Date.now().toString(),
      nombre,
      items: recursos.map(recurso => ({
        recursoId: recurso.id,
        cantidad: 0,
        precio: 0,
        subTotal: 0
      })),
      total: 0
    };
    setProveedores([...proveedores, newProveedor]);
    setShowAddProveedor(false);
  };

  const actualizarProveedor = (proveedorId: string, itemIndex: number, campo: 'cantidad' | 'precio', valor: number) => {
    setProveedores(prevProveedores => {
      return prevProveedores.map(prov => {
        if (prov.id !== proveedorId) return prov;
        
        const newItems = [...prov.items];
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          [campo]: valor,
          subTotal: campo === 'cantidad' 
            ? valor * newItems[itemIndex].precio
            : newItems[itemIndex].cantidad * valor
        };

        return {
          ...prov,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.subTotal, 0)
        };
      });
    });
  };

  const getMejorPrecio = (recursoIndex: number) => {
    const precios = proveedores.map(p => p.items[recursoIndex].precio).filter(p => p > 0);
    return Math.min(...precios);
  };

  return (
    <motion.div 
      className="w-full h-full bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Comparación de Proveedores</h2>
          <div className="space-x-3">
            <Button 
              text="Agregar Proveedor" 
              color="azul"
              icon={<FiPlusCircle className="w-5 h-5" />}
              onClick={() => setShowAddProveedor(true)}
            />
            <Button text="Finalizar Comparación" color="verde" />
          </div>
        </div>

        {/* Tabla de Comparación */}
        <div className="bg-white rounded-lg shadow-sm overflow-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Recurso</th>
                <th className="p-3 text-left">Cant. Sol</th>
                {proveedores.map(prov => (
                  <th key={prov.id} className="p-3">
                    <div className="flex flex-col items-center space-y-2">
                      <span>{prov.nombre}</span>
                      <button 
                        onClick={() => setProveedores(prev => prev.filter(p => p.id !== prov.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recursos.map((recurso, idx) => (
                <tr key={recurso.id} className="border-t">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{recurso.nombre}</span>
                      <span className="text-sm text-gray-500">{recurso.codigo}</span>
                    </div>
                  </td>
                  <td className="p-3">{recurso.cantidadSol}</td>
                  {proveedores.map(prov => (
                    <td key={prov.id} className="p-3">
                      <div className="space-y-2">
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          placeholder="Precio"
                          value={prov.items[idx].precio || ''}
                          onChange={(e) => actualizarProveedor(prov.id, idx, 'precio', Number(e.target.value))}
                        />
                        {prov.items[idx].precio === getMejorPrecio(idx) && prov.items[idx].precio > 0 && (
                          <div className="flex items-center justify-center text-green-500">
                            <FiAward className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={2} className="p-3">Total</td>
                {proveedores.map(prov => (
                  <td key={prov.id} className="p-3 text-center">
                    S/. {prov.total.toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar proveedor */}
      <AnimatePresence>
        {showAddProveedor && (
          <ModalAgregarProveedor
            onClose={() => setShowAddProveedor(false)}
            onAdd={agregarProveedor}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompararProveedores;