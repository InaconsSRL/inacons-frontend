import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransferenciaDetallesByTransferenciaId } from '../../../slices/transferenciaDetalleSlice';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Movimiento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

interface Movilidad {
  id: string;
  denominacion: string;
  descripcion: string;
}

interface Transferencia {
  id: string;
  usuario_id: Usuario;
  fecha: string;
  movimiento_id: Movimiento;
  movilidad_id: Movilidad;
}

interface Item {
  id: string;
  transferencia_id: Transferencia;
  referencia_id: string;
  fecha: string;
  tipo: string;
  referencia: string;
  cantidad: number;
  precio: number;
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
  transferenciaId: string;
}

interface GuiaTransferProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const GuiaTransferencia: React.FC<Props & GuiaTransferProps> = ({
  numero,
  solicita,
  recibe,
  fEmision,
  estado,
  obra,
  transferenciaId,
  onSubmit,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { transferenciaDetalles, loading, error } = useSelector((state: any) => state.transferenciaDetalle);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    dispatch(fetchTransferenciaDetallesByTransferenciaId(transferenciaId) as any);
  }, [dispatch, transferenciaId]);

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  const calculateTotalItems = () => {
    return transferenciaDetalles.reduce((total: number, item: Item) => total + item.total, 0);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Guía de Transferencia de Obra</h1>
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
        {loading && <p>Cargando...</p>}
        {error && <p>Error al cargar los detalles: {error}</p>}
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
              {transferenciaDetalles.map((item: Item, index: number) => (
                <tr key={index}>
                  <td>{item.referencia_id}</td>
                  <td>{item.referencia}</td>
                  <td>{item.tipo}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>{new Date(item.fecha).toLocaleDateString()}</td>
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

export default GuiaTransferencia;
