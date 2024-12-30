import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listTransferenciaDetallesService,
  listTransferenciaDetallesByTransferenciaIdService,
  addTransferenciaDetalleService,
  updateTransferenciaDetalleService,
  deleteTransferenciaDetalleService,
} from '../services/transferenciaDetalleService';

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

interface Obra {
  _id: string;
  nombre: string;
}

interface Transferencia {
  id: string;
  usuario_id: Usuario;
  fecha: string;
  movimiento_id: Movimiento;
  movilidad_id: Movilidad;
}

interface ReferenciaId {
  obra_destino_id: Obra;
  obra_origen_id: Obra;
}

interface TransferenciaDetalle {
  id: string;
  transferencia_id: Transferencia;
  fecha: string;
  tipo: string;
  referencia: string;
  referencia_id: ReferenciaId; 
}

interface TransferenciaDetalleState {
  transferenciaDetalles: TransferenciaDetalle[];
  loading: boolean;
  error: string | null;
}

const initialState: TransferenciaDetalleState = {
  transferenciaDetalles: [],
  loading: false,
  error: null,
};

export const fetchTransferenciaDetalles = createAsyncThunk(
  'transferenciaDetalle/fetchAll',
  async () => {
    return await listTransferenciaDetallesService();
  }
);

export const fetchTransferenciaDetallesByTransferenciaId = createAsyncThunk(
  'transferenciaDetalle/fetchByTransferenciaId',
  async (transferenciaId: string) => {
    const response = await listTransferenciaDetallesByTransferenciaIdService(transferenciaId);
    console.log( 'IMPRIMIENDO RESPONSE ',response);
    //console.log( 'IMPRIMIENDO RESPONSE con data  ',response.);
     return response.map((detalle: any) => ({
      fecha: detalle.fecha,
      id: detalle.id,
      referencia: detalle.referencia,
      referencia_id: {
        id: detalle.referencia_id._id,
        obra_destino_id:{
          _id: detalle.referencia_id.obra_destino_id._id,
          nombre: detalle.referencia_id.obra_destino_id.nombre,
        },
        obra_origen_id:{
          _id: detalle.referencia_id.obra_origen_id._id,
          nombre: detalle.referencia_id.obra_origen_id.nombre,
        }
      },
      tipo: detalle.tipo,
      transferencia_id: {
        estado: detalle.transferencia_id.estado,
        fecha: detalle.transferencia_id.fecha,
        id: detalle.transferencia_id.id,
        movilidad_id: detalle.transferencia_id.movilidad_id,
        usuario_id: detalle.transferencia_id.usuario_id,
        movimiento_id: detalle.transferencia_id.movimiento_id,
      },
    }));
  }
);

export interface TransferenciaDetalleData {
  transferencia_id: string;
  referencia_id: string;
  fecha?: Date;
  tipo: string;
  referencia: string;
  estado?: string;
}

export const addTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/add',
  async (data: TransferenciaDetalleData) => {
    return await addTransferenciaDetalleService(data);
  }
);

export const updateTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/update',
  async (data: {
    id: string;
    transferencia_id?: string;
    referencia_id?: string;
    fecha?: Date;
    tipo?: string;
    referencia?: string;
  }) => {
    return await updateTransferenciaDetalleService(data);
  }
);

export const deleteTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/delete',
  async (id: string) => {
    await deleteTransferenciaDetalleService(id);
    return id;
  }
);

const transferenciaDetalleSlice = createSlice({
  name: 'transferenciaDetalle',
  initialState,
  reducers: {
    clearTransferenciaDetalles: (state) => {
      state.transferenciaDetalles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferenciaDetalles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransferenciaDetalles.fulfilled, (state, action) => {
        state.loading = false;
        state.transferenciaDetalles = action.payload;
        state.error = null;
      })
      .addCase(fetchTransferenciaDetalles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchTransferenciaDetallesByTransferenciaId.fulfilled, (state, action) => {
        state.loading = false;
        state.transferenciaDetalles = action.payload;
        state.error = null;
      })
      .addCase(addTransferenciaDetalle.fulfilled, (state, action) => {
        state.transferenciaDetalles.push(action.payload);
      })
      .addCase(updateTransferenciaDetalle.fulfilled, (state, action) => {
        const index = state.transferenciaDetalles.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.transferenciaDetalles[index] = action.payload;
        }
      })
      .addCase(deleteTransferenciaDetalle.fulfilled, (state, action) => {
        state.transferenciaDetalles = state.transferenciaDetalles.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { clearTransferenciaDetalles } = transferenciaDetalleSlice.actions;
export const transferenciaDetalleReducer = transferenciaDetalleSlice.reducer;
