import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userReducer } from '../slices/userSlice';
import { cargoReducer } from '../slices/cargoSlice';
import { tipoRecursoReducer } from '../slices/tipoRecursoSlice';
import { recursoReducer } from '../slices/recursoSlice';
import { usuarioReducer } from '../slices/usuarioSlice';
import { unidadReducer } from '../slices/unidadSlice';
import { clasificacionRecursoReducer } from '../slices/clasificacionRecursoSlice';
import { obraReducer } from '../slices/obrasSlice';
import { roleReducer } from '../slices/rolesSlice';
import { menuReducer } from '../slices/menuSlice';
import { proveedorReducer } from '../slices/proveedorSlice';
import { requerimientoReducer } from '../slices/requerimientoSlice';
import { requerimientoRecursoReducer } from '../slices/requerimientoRecursoSlice';
import { tipoCostoRecursoReducer } from '../slices/tipoCostoRecursoSlice';
import { almacenReducer } from '../slices/almacenSlice';
import { almacenRecursoReducer } from '../slices/almacenRecursoSlice';
import { requerimientoAprobacionReducer } from '../slices/requerimientoAprobacionSlice';
import { comprasRecursoReducer } from '../slices/comprasRecursoSlice';
import { compraReducer } from '../slices/comprasSlice';
import { solicitudAlmacenReducer } from '../slices/solicitudAlmacenSlice';
import { solicitudRecursoAlmacenReducer } from '../slices/solicitudRecursoAlmacenSlice';
import { ordenCompraReducer } from '../slices/ordenCompraSlice';
import { ordenCompraRecursosReducer } from '../slices/ordenCompraRecursosSlice';
import { requerimientoRecursoWithAlmacenReducer } from '../slices/requerimientoRecursoWithAlmacenSlice';
import { preSolicitudAlmacenReducer } from '../slices/preSolicitudAlmacenSlice';
import { preSolicitudAlmacenRecursoReducer } from '../slices/preSolicitudAlmacenRecursoSlice';
import { cotizacionReducer } from '../slices/cotizacionSlice';
import { guiaTransferenciaReducer } from '../slices/guiaTransferenciaSlice';
import { transferenciaReducer } from '../slices/transferenciaSlice';
import { transferenciaDetalleReducer } from '../slices/transferenciaDetalleSlice';
import { requerimientoEstadoHistorialReducer } from '../slices/requerimientoEstadoHistorialSlice';
import { almacenCentroCostoReducer } from '../slices/almacenCentroCostoSlice';
import { bodegaReducer } from '../slices/bodegaSlice';
import { centroCostoReducer } from '../slices/centroCostoSlice';
import { solicitudCompraReducer } from '../slices/solicitudCompraSlice';
import { movimientoReducer } from '../slices/movimientoSlice';
import { recursosObraReducer } from '../slices/recursosObraSlice';
import { transferenciaRecursoReducer } from '../slices/transferenciaRecursoSlice';
import { tipoAlmacenReducer } from '../slices/tipoAlmacenSlice';
import { cotizacionRecursoReducer } from '../slices/cotizacionRecursoSlice';
import { solicitudCompraRecursoReducer } from '../slices/solicitudCompraRecursoSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cargo: cargoReducer,
    tipoRecurso: tipoRecursoReducer,
    recurso: recursoReducer,
    usuario: usuarioReducer,
    unidad: unidadReducer,
    clasificacionRecurso: clasificacionRecursoReducer,
    obra: obraReducer,
    role: roleReducer,
    menu: menuReducer,
    proveedor: proveedorReducer,
    requerimiento: requerimientoReducer,
    requerimientoRecurso: requerimientoRecursoReducer,
    tipoCostoRecurso: tipoCostoRecursoReducer,
    almacen: almacenReducer,
    almacenRecurso: almacenRecursoReducer,
    requerimientoAprobacion: requerimientoAprobacionReducer,
    compraRecurso: comprasRecursoReducer,
    compra: compraReducer,
    solicitudAlmacen: solicitudAlmacenReducer,
    solicitudRecursoAlmacen: solicitudRecursoAlmacenReducer,
    ordenCompra: ordenCompraReducer,
    ordenCompraRecursos: ordenCompraRecursosReducer,
    requerimientoRecursoWithAlmacen: requerimientoRecursoWithAlmacenReducer,
    preSolicitudAlmacen: preSolicitudAlmacenReducer,
    preSolicitudAlmacenRecurso: preSolicitudAlmacenRecursoReducer,
    cotizacion: cotizacionReducer,
    guiaTransferencia: guiaTransferenciaReducer,
    transferencia: transferenciaReducer,
    transferenciaDetalle: transferenciaDetalleReducer,
    requerimientoEstadoHistorial: requerimientoEstadoHistorialReducer,
    almacenCentroCosto: almacenCentroCostoReducer,
    bodega: bodegaReducer,
    centroCosto: centroCostoReducer,
    solicitudCompra: solicitudCompraReducer,
    movimiento: movimientoReducer,
    recursosObra: recursosObraReducer,
    transferenciaRecurso: transferenciaRecursoReducer,
    tipoAlmacen: tipoAlmacenReducer,
    cotizacionRecurso: cotizacionRecursoReducer,
    solicitudCompraRecurso: solicitudCompraRecursoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);