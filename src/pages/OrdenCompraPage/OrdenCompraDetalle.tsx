import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrdenCompraRecursosByOrdenId } from '../../slices/ordenCompraRecursosSlice';
import LoaderPage from '../../components/Loader/LoaderPage';
import PDFOCGenerator from './PDFOCGenerator';
import { OrdenCompraExtendidaType, Unidad } from '../../types/ordenCompra.types';

// Mock Data
const mockOrdenCompra: OrdenCompraExtendidaType = {
  id: "1",
  codigo_orden: "6689",
  obra: "CU PLAN3",
  descripcion: "20M3 DE CONCRETO DE 175",
  fecha_ini: "2024-12-10",
  fecha_fin: "2024-12-10",
  fechaEmision: "2024-12-10",
  fechaEntrega: "2024-12-10",
  moneda: "Sol",
  cambio: 1.00,
  solicitante: "CRISTHIAN ANDAMAYO",
  proveedor: {
    ruc: "20297346353",
    razonSocial: "UNION DE CONCRETERAS S.A",
    direccion: "Av. Industrial 1201",
    ciudad: "Lima",
    fonos: "01-2345678",
    contacto: "Juan Pérez",
    email: "ventas@unicon.com.pe",
    formaPago: "Transferencia bancaria"
  },
  datosBancarios: [
    {
      banco: "BCP",
      nroCta: "193-1234567-0-12",
      tipoMoneda: "Soles"
    },
    {
      banco: "BBVA",
      nroCta: "0011-0123-0123456789",
      tipoMoneda: "Soles"
    }
  ],
  datosFacturacion: {
    rSocial: "INACONS S.R.L.",
    ruc: "20564567767",
    giro: "CONSTRUCTORA",
    direccion: "MZA. D1 LOTE: 3 URB. VILLA SANTA MARIA",
    ciudad: "CARABAYLLO",
    departamento: "LIMA",
    fono: "064791255",
    email: "ypodrno@inacons.com.pe"
  },
  datosDespacho: {
    obra: "HABILITACION URBANA DEL PROYECTO LA PLANICIE ETAPA 4B",
    despacho: "PLANICIE ETAPA 4B– CARABAYLLO",
    direccion: "Av. Las Palmeras S/N",
    ciudad: "CARABAYLLO",
    departamento: "LIMA",
    fono: "01-5678901",
    email: "obra@inacons.com.pe"
  }
};

interface OrdenCompraDetalleProps {
  ordenCompra: Pick<OrdenCompraExtendidaType, 'id' | 'codigo_orden' | 'descripcion' | 'fecha_ini' | 'fecha_fin'>;
}

const OrdenCompraDetalle: React.FC<OrdenCompraDetalleProps> = ({ ordenCompra }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ordenCompraRecursosByOrdenId, loading } = useSelector(
    (state: RootState) => state.ordenCompraRecursos
  );
  const unidades = useSelector((state: RootState) => state.unidad.unidades) as Unidad[];
  const [showPDF, setShowPDF] = useState(false);

  // Añadir detección de dispositivo móvil
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    dispatch(fetchOrdenCompraRecursosByOrdenId(ordenCompra.id));
  }, [dispatch, ordenCompra.id]);

  const formatCurrency = (value: number) => `S/ ${value.toFixed(2)}`;



  // Función para manejar la visualización/descarga del PDF
  const handlePDFAction = async () => {
    if (isMobile) {
      // En móviles, crear y descargar el PDF usando react-pdf
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(
        <PDFOCGenerator
          ordenCompra={ordenCompraCompleta}
          recursos={recursosCompletos}
        />
      ).toBlob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OC-${ordenCompra.codigo_orden}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      // En desktop, mostrar vista previa
      setShowPDF(!showPDF);
    }
  };

  if (loading) return <LoaderPage />;

  // Combine real data with mock data
  const ordenCompraCompleta = {
    ...ordenCompra,
    ...mockOrdenCompra
  };

  const recursosCompletos = ordenCompraRecursosByOrdenId.map(recurso => ({
    ...recurso,
    precio: recurso.costo_real, // Usar el costo real como precio
    descuento: 0, // Valor por defecto
    subTotal: recurso.costo_real * recurso.cantidad, // Calcular el subtotal
    sr: "", // Campo vacío por defecto
    notas: "" // Campo vacío por defecto
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto shadow-md rounded-lg mt-4"
    >
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Orden de Compra: {ordenCompra.codigo_orden}
          </h3>
          <button
            onClick={handlePDFAction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isMobile ? 'Descargar PDF' : (showPDF ? 'Ver Tabla' : 'Ver PDF')}
          </button>
        </div>

        {showPDF ? (
          <div id="pdf-container">
            <PDFOCGenerator
              ordenCompra={ordenCompraCompleta}
              recursos={recursosCompletos}
            />
          </div>
        ) : (
          <>
          
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="text-xs">
                <th className="border p-2">Código</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Unidad</th>
                <th className="border p-2 text-right">Cantidad</th>
                <th className="border p-2 text-right">Costo Real</th>
                <th className="border p-2 text-right">Costo Aprox.</th>
                <th className="border p-2">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ordenCompraRecursosByOrdenId.map((recurso) => (
                <tr key={recurso.id} className="hover:bg-gray-50">
                  <td className="border p-2">{recurso.id_recurso.codigo}</td>
                  <td className="border p-2">{recurso.id_recurso.nombre}</td>
                  <td className="border p-2">
                    {unidades.find(u => u.id === recurso.id_recurso.unidad_id)?.nombre || 'N/A'}
                  </td>
                  <td className="border p-2 text-right">{recurso.cantidad}</td>
                  <td className="border p-2 text-right">{formatCurrency(recurso.costo_real)}</td>
                  <td className="border p-2 text-right">{formatCurrency(recurso.costo_aproximado)}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${recurso.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        recurso.estado === 'completado' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {recurso.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold text-xs">
              <tr>
                <td colSpan={4} className="border p-2 text-right">Totales:</td>
                <td className="border p-2 text-right">
                  {formatCurrency(
                    ordenCompraRecursosByOrdenId.reduce((sum, item) => sum + item.costo_real * item.cantidad, 0)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {formatCurrency(
                    ordenCompraRecursosByOrdenId.reduce((sum, item) => sum + item.costo_aproximado * item.cantidad, 0)
                  )}
                </td>
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
          {/* Data Adicional de la Orden de Compra */}
        <div className="bg-white p-4 rounded-lg space-y-4 max-h-[80vh] overflow-y-auto text-sm">
          {/* Cabecera */}
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800">Orden de Compra: {ordenCompraCompleta.codigo_orden}</h2>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
          <p className="text-gray-600">Emisión: {ordenCompraCompleta.fechaEmision}</p>
          <p className="text-gray-600">Entrega: {ordenCompraCompleta.fechaEntrega}</p>
              </div>
              <div>
          <p className="text-gray-600">Moneda: {ordenCompraCompleta.moneda}</p>
          <p className="text-gray-600">Cambio: {ordenCompraCompleta.cambio}</p>
              </div>
            </div>
          </div>

          {/* Datos del Proveedor */}
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold mb-2 text-gray-700">Proveedor</h3>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-medium">RUC:</span> {ordenCompraCompleta.proveedor.ruc}</p>
              <p><span className="font-medium">Razón Social:</span> {ordenCompraCompleta.proveedor.razonSocial}</p>
              <p><span className="font-medium">Dirección:</span> {ordenCompraCompleta.proveedor.direccion}</p>
              <p><span className="font-medium">Ciudad:</span> {ordenCompraCompleta.proveedor.ciudad}</p>
              <p><span className="font-medium">Teléfono:</span> {ordenCompraCompleta.proveedor.fonos}</p>
              <p><span className="font-medium">Email:</span> {ordenCompraCompleta.proveedor.email}</p>
            </div>
          </div>

          {/* Datos Bancarios */}
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold mb-2 text-gray-700">Bancarios</h3>
            {ordenCompraCompleta.datosBancarios.map((banco, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-1">
          <p><span className="font-medium">Banco:</span> {banco.banco}</p>
          <p><span className="font-medium">Cuenta:</span> {banco.nroCta}</p>
          <p><span className="font-medium">Moneda:</span> {banco.tipoMoneda}</p>
              </div>
            ))}
          </div>

          {/* Datos de Facturación */}
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold mb-2 text-gray-700">Facturación</h3>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-medium">Razón Social:</span> {ordenCompraCompleta.datosFacturacion.rSocial}</p>
              <p><span className="font-medium">RUC:</span> {ordenCompraCompleta.datosFacturacion.ruc}</p>
              <p><span className="font-medium">Giro:</span> {ordenCompraCompleta.datosFacturacion.giro}</p>
              <p><span className="font-medium">Dirección:</span> {ordenCompraCompleta.datosFacturacion.direccion}</p>
              <p><span className="font-medium">Ciudad:</span> {ordenCompraCompleta.datosFacturacion.ciudad}</p>
              <p><span className="font-medium">Departamento:</span> {ordenCompraCompleta.datosFacturacion.departamento}</p>
            </div>
          </div>

          {/* Datos de Despacho */}
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold mb-2 text-gray-700">Despacho</h3>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-medium">Obra:</span> {ordenCompraCompleta.datosDespacho.obra}</p>
              <p><span className="font-medium">Despacho:</span> {ordenCompraCompleta.datosDespacho.despacho}</p>
              <p><span className="font-medium">Dirección:</span> {ordenCompraCompleta.datosDespacho.direccion}</p>
              <p><span className="font-medium">Ciudad:</span> {ordenCompraCompleta.datosDespacho.ciudad}</p>
              <p><span className="font-medium">Departamento:</span> {ordenCompraCompleta.datosDespacho.departamento}</p>
              <p><span className="font-medium">Teléfono:</span> {ordenCompraCompleta.datosDespacho.fono}</p>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold mb-2 text-gray-700">Adicional</h3>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-medium">Solicitante:</span> {ordenCompraCompleta.solicitante}</p>
              <p><span className="font-medium">Obra:</span> {ordenCompraCompleta.obra}</p>
              <p><span className="font-medium">Descripción:</span> {ordenCompraCompleta.descripcion}</p>
            </div>
          </div>
        </div>
        </>
        )}

        
      </div>
    </motion.div>
  );
};

export default OrdenCompraDetalle;