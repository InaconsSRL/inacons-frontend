// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTransferenciaRecursosById } from '../../../slices/transferenciaRecursoSlice';
// import { addTransferenciaDetalle } from '../../../slices/transferenciaDetalleSlice';
// import { addTransferenciaRecurso } from '../../../slices/transferenciaRecursoSlice';
// import { addTransferencia } from '../../../slices/transferenciaSlice';
// import GuiaTransfersPDF from './GuiaTransferPDF';

// type EstadoTransferencia = 'PARCIAL' | 'COMPLETO';

// interface Usuario {
//   id: string;
//   nombres: string;
//   apellidos: string;
// }

// interface Movimiento {
//   id: string;
//   nombre: string;
//   descripcion: string;
//   tipo: string;
// }

// interface Movilidad {
//   id: string;
//   denominacion: string;
//   descripcion: string;
// }

// interface Transferencia {
//   id: string;
//   usuario_id: Usuario;
//   fecha: string;
//   movimiento_id: Movimiento;
//   movilidad_id: Movilidad;
// }

// interface Item {
//   id: string;
//   transferencia_id: Transferencia;
//   referencia_id: string;
//   fecha: string;
//   tipo: string;
//   referencia: string;
//   cantidad: number;
//   precio: number;
//   total: number;
//   bodega: string;

// }

// interface RootState {
//   transferenciaDetalle: {
//     transferenciaDetalles: any[];
//     loading: boolean;
//     error: string | null;
//   };
//   transferenciaRecurso: {
//     transferenciaRecursos: any[];
//     loading: boolean;
//   };
//   unidad: {
//     unidades: Array<{
//       id: string;
//       nombre: string;
//     }>;
//   };
// }

// interface Props {
//   numero: number;
//   solicita: string;
//   recibe: string;
//   fEmision: Date;
//   estado: EstadoTransferencia; 
//   obra: string;
//   transferenciaId: string;
//   recursos?: RecursoState[],
// }

// interface GuiaTransferProps {
//   onClose: () => void;
// }

// interface RecursoState {
//   id: string; 
//   cantidad_recibida: number;
//   precio_actual: number; 
// }

// const GuiaTransferencia: React.FC<Props & GuiaTransferProps> = ({
//   numero,
//   solicita,
//   recibe,
//   fEmision,
//   estado,
//   obra,
//   transferenciaId,
//   onClose,
// }) => {
//   const dispatch = useDispatch();
//   const [recursosState, setRecursosState] = useState<{ [key: string]: RecursoState }>({});
//   const { transferenciaRecursos, loading: recursosLoading } = useSelector((state: RootState) => state.transferenciaRecurso);
//   const [showPDF, setShowPDF] = useState(false); 

//   const { transferenciaDetalles, loading: detallesLoading, error: detallesError } = useSelector((state: RootState) => state.transferenciaDetalle);
//   const unidades = useSelector((state: RootState) => state.unidad.unidades);
  
//   const loading = detallesLoading || recursosLoading;
//   const error = detallesError;
//   const [selectedDetalleId, setSelectedDetalleId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log('Fetching data for transferenciaId:', transferenciaId);
//       const detalles = await dispatch(fetchTransferenciaDetallesByTransferenciaId(transferenciaId) as any).unwrap();
//       if (detalles && detalles.length > 0) {
//         setSelectedDetalleId(detalles[0].id);
//         await dispatch(fetchTransferenciaRecursosById(detalles[0].id) as any);
//       }
//     };
//     fetchData();
//   }, [dispatch, transferenciaId]);

//   useEffect(() => {
//     if (selectedDetalleId) {
//       dispatch(fetchTransferenciaRecursosById(selectedDetalleId) as any);
//     }
//   }, [selectedDetalleId, dispatch]);

//   const handleDownload = () => {
//     const element = document.createElement("a");
//     const file = new Blob([document.getElementById('guia-transferencia')?.innerHTML || ''], {type: 'text/html'});
//     element.href = URL.createObjectURL(file);
//     element.download = `Guia_Transferencia_${numero}.html`;
//     document.body.appendChild(element); 
//     element.click();
//   };

//   const handleShowPDF = () => {
//     setShowPDF(true); 
//   };

//   const handleClosePDF = () => {
//     setShowPDF(false);
//   };

//   const handleSave = async () => {
//     // Guardar la transferencia
//     const transferenciaData = {
//       usuario_id: 'user_id_placeholder', 
//       fecha: new Date(),
//       movimiento_id: 'movimiento_id_placeholder', 
//       movilidad_id: 'movilidad_id_placeholder', 
//       estado: 'COMPLETO' as EstadoTransferencia
//     };

//     const transferencia = await dispatch(addTransferencia(transferenciaData) as any).unwrap();

//     // Guardar los recursos
//     const recursosGuardados = Object.values(recursosState).map(recurso => ({
//       transferencia_detalle_id: transferencia.id, 
//       recurso_id: recurso.id,
//       cantidad: recurso.cantidad_recibida,
//       costo: recurso.precio_actual 
//     }));

//     for (const recurso of recursosGuardados) {
//       await dispatch(addTransferenciaRecurso(recurso) as any);
//     }

//     // Guardar los detalles
//     const detallesGuardados = transferenciaDetalles.map(detalle => ({
//       transferencia_id: transferencia.id,
//       referencia_id: detalle.referencia_id,
//       fecha: detalle.fecha,
//       tipo: detalle.tipo,
//       referencia: detalle.referencia
//     }));

//     for (const detalle of detallesGuardados) {
//       await dispatch(addTransferenciaDetalle(detalle) as any);
//     }

//     console.log('Transferencia, recursos y detalles guardados exitosamente');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-[1000px] max-h-[85vh] overflow-y-auto">
//         <div className="flex justify-between items-center bg-blue-900 text-white px-6 py-3">
//           <h2 className="text-xl font-semibold">Recepción de transferencia</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-300">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="p-6" id="guia-transferencia">
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             {/* Panel izquierdo */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">N° de oden de Transferencia</label>
//                 <input
//                   type="text"
//                   value={`TRA-${transferenciaDetalles[0]?.referencia_id || ''}`}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Enviado por </label>
//                 <input
//                   type="text"
//                   value={solicita}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Almacen de Salida</label>
//                 <input
//                   type="text"
//                   value={obra}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Almacen de Destino</label>
//                 <input
//                   type="text"
//                   value={recibe}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   readOnly
//                 />
//               </div>
//             </div>

//             {/* Panel derecho */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
//                 <input
//                   type="text"
//                   value={estado}
//                   className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
//                   disabled
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de movimiento</label>
//                 <input
//                   type="text"
//                   value={transferenciaDetalles[0]?.tipo || ''}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">observaciones:</label>
//                 <textarea
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   rows={3}
//                   readOnly
//                 ></textarea>
//               </div>

//               <div className="text-right">
//                 <span className="text-sm text-gray-600">
//                   Fecha de Emision: {fEmision.toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {loading && <p className="text-center">Cargando...</p>}
//           {error && <p className="text-red-500">Error al cargar los detalles: {error}</p>}

//           {/* Tabla con scroll vertical y ancho fijo */}
//           <div className="overflow-x-auto" style={{ maxHeight: '350px' }}>
//             <table className="min-w-[900px] divide-y divide-gray-200 border-b">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left">
//                     <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unidad</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cant. Solicitada</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Unit.</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cant. recibida</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Imagen</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {transferenciaRecursos.filter((recurso: any) => recurso.transferencia_detalle_id === selectedDetalleId).map((recurso: any, index: number) => (
//                   <tr key={index}>
//                     <td className="px-4 py-3">
//                       <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                     </td>
//                     <td className="px-4 py-3">{recurso.recurso_id.codigo}</td>
//                     <td className="px-4 py-3">{recurso.recurso_id.nombre}</td>
//                     <td className="px-4 py-3">{recurso.recurso_id.descripcion}</td>
//                     <td className="px-4 py-3">
//                       {unidades?.find((u: { id: string; nombre: string }) => u.id === recurso.recurso_id.unidad_id)?.nombre || 'UND'}
//                     </td>
//                     <td className="px-4 py-3">{recurso.cantidad}</td>
//                     <td className="px-4 py-3">{recurso.recurso_id.precio_actual}</td>
//                     <td className="px-4 py-3">{(recurso.cantidad * recurso.recurso_id.precio_actual).toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         min="0"
//                         max={recurso.cantidad}
//                         value={recursosState[recurso._id]?.cantidad_recibida || ''}
//                         onChange={(e) => {
//                           const cantidad = parseInt(e.target.value) || 0;
//                           setRecursosState(prev => ({
//                             ...prev,
//                             [recurso._id]: {
//                               cantidad_recibida: cantidad
//                             }
//                           }));
//                         }}
//                         className="w-24 p-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 flex justify-end space-x-4">
//             <button 
//               onClick={handleSave} 
//               className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
//             >
//               Guardar
//             </button>
//             <button 
//               onClick={handleShowPDF}
//               className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
//             >
//               Mostrar PDF
//             </button>
//           </div>

//           {/* Modal para mostrar el PDF */}
//           {showPDF && (
//             <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex justify-center items-center">
//               <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
//                 <button 
//                   onClick={handleClosePDF}
//                   className="absolute top-2 right-2 text-white font-bold text-xl">
//                   X
//                 </button>
//                 <GuiaTransfersPDF
//                   numero={numero}
//                   solicita={solicita}
//                   recibe={recibe}
//                   fEmision={fEmision}
//                   estado={estado}
//                   obra={obra}
//                   recursos={Object.values(recursosState).map(recurso => ({
//                     ...recurso,
//                     cantidad_original: recurso.cantidad_recibida,
//                     diferencia: recurso.cantidad_recibida - recurso.cantidad_recibida
//                   }))}
//                   transferenciaRecursos={transferenciaRecursos}
//                   unidades={unidades}
//                   tipoTransporte={transferenciaDetalles[0]?.tipo || ''}
//                   usuarioTransferencia={{ nombres: '', apellidos: '' }}
//                   descripcionMovimiento={''} obraDestino={''}                />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuiaTransferencia;
