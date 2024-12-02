import React, { useState } from 'react';

interface Item {
  codigo: string;
  nombre: string;
  unidad: string;
  cantidad: number;
  precio: number;
  fecha: Date;
  total: number;
  bodega: string;
}

interface Props {
  numero: number;
  solicita: string;
  recibe: string;
  fEmision: Date;
  estado: string;
  obra: string;
  items: Item[];
}

const TransferenciaObra: React.FC<Props> = ({
  numero,
  solicita,
  recibe,
  fEmision,
  estado,
  obra,
  items,
}) => {
  const [showTable, setShowTable] = useState(false);

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  const calculateTotalItems = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Guia de Transferencia de Obra</h1>
        <div className="info">
          <div className="field">
            <label htmlFor="numero">Número:</label>
            <span>{numero}</span>
          </div>
          <div className="field">
            <label htmlFor="solicita">Solicita:</label>
            <span>{solicita}</span>
          </div>
          <div className="field">
            <label htmlFor="recibe">Recibe:</label>
            <span>{recibe}</span>
          </div>
          <div className="field">
            <label htmlFor="fEmision">F. Emisión:</label>
            <span>{fEmision.toLocaleDateString()}</span>
          </div>
          <div className="field">
            <label htmlFor="estado">Estado:</label>
            <span>{estado}</span>
          </div>
          <div className="field">
            <label htmlFor="obra">Obra:</label>
            <span>{obra}</span>
          </div>
        </div>
      </div>
      <div className="content">
        <h2>Detalles</h2>
        <button onClick={handleShowTable}>
          {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}
        </button>
        {showTable && (
          <table className="items-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Bodega</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>{item.unidad}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>{item.fecha.toLocaleDateString()}</td>
                  <td>${item.total.toFixed(2)}</td>
                  <td>{item.bodega}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>Total General</td>
                <td>${calculateTotalItems().toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransferenciaObra;