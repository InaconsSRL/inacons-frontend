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
    role : roleReducer,
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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);