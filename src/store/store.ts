import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { almacenCentroCostoReducer } from '../slices/almacenCentroCostoSlice';
import { almacenRecursoReducer } from '../slices/almacenRecursoSlice';
import { almacenReducer } from '../slices/almacenSlice';
import { bodegaReducer } from '../slices/bodegaSlice';
import { cargoReducer } from '../slices/cargoSlice';
import { centroCostoReducer } from '../slices/centroCostoSlice';
import { clasificacionRecursoReducer } from '../slices/clasificacionRecursoSlice';
import { compraReducer } from '../slices/comprasSlice';
import { comprasRecursoReducer } from '../slices/comprasRecursoSlice';
import { contactoProveedorReducer } from '../slices/contactoProveedorSlice';
import { cotizacionProveedorReducer } from '../slices/cotizacionProveedorSlice';
import { cotizacionRecursoReducer } from '../slices/cotizacionRecursoSlice';
import { cotizacionReducer } from '../slices/cotizacionSlice';
import { guiaTransferenciaReducer } from '../slices/guiaTransferenciaSlice';
import { menuReducer } from '../slices/menuSlice';
import { movimientoReducer } from '../slices/movimientoSlice';
import { movilidadReducer } from '../slices/movilidadSlice';
import { obraReducer } from '../slices/obrasSlice';
import { ordenCompraRecursosReducer } from '../slices/ordenCompraRecursosSlice';
import { ordenCompraReducer } from '../slices/ordenCompraSlice';
import { ordenPagoReducer } from '../slices/ordenPagoSlice';
import { desccuentoPagoReducer, descuentoPagoReducer} from '../slices/descuentoPagoSlice';

import { preSolicitudAlmacenRecursoReducer } from '../slices/preSolicitudAlmacenRecursoSlice';
import { preSolicitudAlmacenReducer } from '../slices/preSolicitudAlmacenSlice';
import { proveedorReducer } from '../slices/proveedorSlice';
import { recursoReducer } from '../slices/recursoSlice';
import { recursosObraReducer } from '../slices/recursosObraSlice';
import { requerimientoAprobacionReducer } from '../slices/requerimientoAprobacionSlice';
import { requerimientoEstadoHistorialReducer } from '../slices/requerimientoEstadoHistorialSlice';
import { requerimientoRecursoReducer } from '../slices/requerimientoRecursoSlice';
import { requerimientoRecursoWithAlmacenReducer } from '../slices/requerimientoRecursoWithAlmacenSlice';
import { requerimientoReducer } from '../slices/requerimientoSlice';
import { roleReducer } from '../slices/rolesSlice';
import { solicitudAlmacenReducer } from '../slices/solicitudAlmacenSlice';
import { solicitudCompraRecursoReducer } from '../slices/solicitudCompraRecursoSlice';
import { solicitudCompraReducer } from '../slices/solicitudCompraSlice';
import { solicitudRecursoAlmacenReducer } from '../slices/solicitudRecursoAlmacenSlice';
import { tipoAlmacenReducer } from '../slices/tipoAlmacenSlice';
import { tipoCostoRecursoReducer } from '../slices/tipoCostoRecursoSlice';
import { tipoRecursoReducer } from '../slices/tipoRecursoSlice';
import { transferenciaDetalleReducer } from '../slices/transferenciaDetalleSlice';
import { transferenciaRecursoReducer } from '../slices/transferenciaRecursoSlice';
import { transferenciaReducer } from '../slices/transferenciaSlice';
import { unidadReducer } from '../slices/unidadSlice';
import { userReducer } from '../slices/userSlice';
import { usuarioReducer } from '../slices/usuarioSlice';
import { mediosPagoProveedorReducer } from '../slices/mediosPagoProveedorSlice';
import { cotizacionProveedoresRecursoReducer } from '../slices/cotizacionProveedoresRecursoSlice';
import { valoracionProveedorReducer } from '../slices/valoracionProveedorSlice';
import { datosValoracionProveedorReducer } from '../slices/datosValoracionProveedorSlice';
import { cuestionarioHomologacionReducer } from '../slices/cuestionarioHomologacionSlice';
import { prestamoReducer } from '../slices/prestamoSlice';
import { prestamoRecursoReducer } from '../slices/prestamoRecursoSlice';
import { recursosAllTablesReducer } from '../slices/recursosAllTablesSlice';
import { empleadoReducer } from '../slices/empleadoSlice';
import { obraBodegaReducer } from '../slices/obraBodegaSlice';
import { obraBodegaRecursoReducer } from '../slices/obraBodegaRecursoSlice';
import { cantidadRecursosByBodegaReducer } from '../slices/cantidadRecursosByBodegaSlice';
import  {consumoRecursoReducer}  from '../slices/consumoRecursoSlice';
import dateFilterReducer from '../slices/dateFilterSlice';

export const store = configureStore({
  reducer: {
    almacenCentroCosto: almacenCentroCostoReducer,
    almacenRecurso: almacenRecursoReducer,
    almacen: almacenReducer,
    bodega: bodegaReducer,
    cargo: cargoReducer,
    centroCosto: centroCostoReducer,
    clasificacionRecurso: clasificacionRecursoReducer,
    compra: compraReducer,
    compraRecurso: comprasRecursoReducer,
    contactoProveedor: contactoProveedorReducer,
    cotizacionProveedor: cotizacionProveedorReducer,
    cotizacionProveedoresRecurso: cotizacionProveedoresRecursoReducer,
    cotizacionRecurso: cotizacionRecursoReducer,
    cotizacion: cotizacionReducer,
    cuestionarioHomologacion: cuestionarioHomologacionReducer,
    datosValoracionProveedor: datosValoracionProveedorReducer,
    empleado: empleadoReducer,
    guiaTransferencia: guiaTransferenciaReducer,
    mediosPagoProveedor: mediosPagoProveedorReducer,
    menu: menuReducer,
    movimiento: movimientoReducer,
    movilidad: movilidadReducer,
    obra: obraReducer,
    ordenCompraRecursos: ordenCompraRecursosReducer,
      ordenCompra: ordenCompraReducer,
      ordenPago : ordenPagoReducer,
      descuentoPago: descuentoPagoReducer,
    preSolicitudAlmacenRecurso: preSolicitudAlmacenRecursoReducer,
    preSolicitudAlmacen: preSolicitudAlmacenReducer,
    proveedor: proveedorReducer,
    recurso: recursoReducer,
    recursosObra: recursosObraReducer,
    requerimientoAprobacion: requerimientoAprobacionReducer,
    requerimientoEstadoHistorial: requerimientoEstadoHistorialReducer,
    requerimientoRecurso: requerimientoRecursoReducer,
    requerimientoRecursoWithAlmacen: requerimientoRecursoWithAlmacenReducer,
    requerimiento: requerimientoReducer,
    role: roleReducer,
    solicitudAlmacen: solicitudAlmacenReducer,
    solicitudCompraRecurso: solicitudCompraRecursoReducer,
    solicitudCompra: solicitudCompraReducer,
    solicitudRecursoAlmacen: solicitudRecursoAlmacenReducer,
    tipoAlmacen: tipoAlmacenReducer,
    tipoCostoRecurso: tipoCostoRecursoReducer,
    tipoRecurso: tipoRecursoReducer,
    transferenciaDetalle: transferenciaDetalleReducer,
    transferenciaRecurso: transferenciaRecursoReducer,
    transferencia: transferenciaReducer,
    unidad: unidadReducer,
    user: userReducer,
    usuario: usuarioReducer,
    valoracionProveedor: valoracionProveedorReducer,
    prestamo: prestamoReducer,
    prestamoRecurso: prestamoRecursoReducer,
    recursosAllTables: recursosAllTablesReducer,
    obraBodega: obraBodegaReducer,
    obraBodegaRecurso: obraBodegaRecursoReducer,
    cantidadRecursosByBodega: cantidadRecursosByBodegaReducer,
    consumoRecurso: consumoRecursoReducer,
    dateFilter: dateFilterReducer,
  },

  //Para que se tome mas tiempo en responder todas las solicitudes de la API
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Aumentar el tiempo de advertencia a 100ms
        warnAfter: 10,
        // Opcionalmente, puedes ignorar ciertas acciones
        ignoredActions: ['some/action/type'],
        // Opcionalmente, puedes ignorar ciertas rutas del estado
        ignoredPaths: ['some.path.to.ignore'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
