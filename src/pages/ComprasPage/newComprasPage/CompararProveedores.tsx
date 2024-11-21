import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Buttons/Button';

interface RecursoItem {
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
  nombre: string;
  items: {
    cantidad: number;
    precio: number;
    subTotal: number;
  }[];
}

const CompararProveedores: React.FC = ({ requerimiento, onClose}) => {
  const [recursos, setRecursos] = useState<RecursoItem[]>([
    {
      codigo: '023564',
      nombre: 'Al_Bolsas de Cemento',
      unidad: 'Und',
      notas: '04755_GTTRF',
      cantidadPpto: 0,
      cantidadSol: 1,
      precio: 0,
      subTotal: 0,
    },
  ]);

  const [proveedores, setProveedores] = useState<ProveedorCotizacion[]>([
    {
      nombre: 'Juan Perez (Mejor Precio)',
      items: recursos.map(() => ({ cantidad: 0, precio: 45, subTotal: 45 })),
    },
    {
      nombre: 'Armando',
      items: recursos.map(() => ({ cantidad: 0, precio: 45, subTotal: 45 })),
    },
    {
      nombre: 'Proveedor 3',
      items: recursos.map(() => ({ cantidad: 0, precio: 45, subTotal: 45 })),
    },
  ]);

  const handleUpdateCantidad = (proveedorIndex: number, itemIndex: number, value: number) => {
    const newProveedores = [...proveedores];
    newProveedores[proveedorIndex].items[itemIndex].cantidad = value;
    newProveedores[proveedorIndex].items[itemIndex].subTotal = 
      value * newProveedores[proveedorIndex].items[itemIndex].precio;
    setProveedores(newProveedores);
  };

  const handleUpdatePrecio = (proveedorIndex: number, itemIndex: number, value: number) => {
    const newProveedores = [...proveedores];
    newProveedores[proveedorIndex].items[itemIndex].precio = value;
    newProveedores[proveedorIndex].items[itemIndex].subTotal = 
      newProveedores[proveedorIndex].items[itemIndex].cantidad * value;
    setProveedores(newProveedores);
  };

  return (
    <motion.div 
      className="w-full max-w-[1800px] mx-auto bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Selección de Proveedores</h2>
        <div className="space-x-2">
          <Button text="Confirmar Selección" color="azul" />
          <Button text="Sustento" color="azul-oscuro" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th colSpan={4} className="border p-2">Recurso Solicitado</th>
              <th colSpan={4} className="border p-2">Presupuesto</th>
              {proveedores.map((prov, index) => (
                <th key={index} colSpan={3} className="border p-2">{prov.nombre}</th>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <th className="border p-2">Código</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Unidad</th>
              <th className="border p-2">Notas</th>
              <th className="border p-2">Cant.Ppto</th>
              <th className="border p-2">Cant.Sol</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Sub.Total</th>
              {proveedores.map((_, provIndex) => (
                <React.Fragment key={provIndex}>
                  <th className="border p-2">Cantidad</th>
                  <th className="border p-2">Precio</th>
                  <th className="border p-2">Sub.Total</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {recursos.map((recurso, recursoIndex) => (
              <tr key={recursoIndex}>
                <td className="border p-2">{recurso.codigo}</td>
                <td className="border p-2">{recurso.nombre}</td>
                <td className="border p-2">{recurso.unidad}</td>
                <td className="border p-2">{recurso.notas}</td>
                <td className="border p-2">{recurso.cantidadPpto}</td>
                <td className="border p-2">{recurso.cantidadSol}</td>
                <td className="border p-2">S/.{recurso.precio.toFixed(2)}</td>
                <td className="border p-2">S/.{recurso.subTotal.toFixed(2)}</td>
                {proveedores.map((prov, provIndex) => (
                  <React.Fragment key={provIndex}>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={prov.items[recursoIndex].cantidad}
                        onChange={(e) => handleUpdateCantidad(provIndex, recursoIndex, Number(e.target.value))}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={prov.items[recursoIndex].precio}
                        onChange={(e) => handleUpdatePrecio(provIndex, recursoIndex, Number(e.target.value))}
                      />
                    </td>
                    <td className="border p-2">
                      S/.{prov.items[recursoIndex].subTotal.toFixed(2)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CompararProveedores;