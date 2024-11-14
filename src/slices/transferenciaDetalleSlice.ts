import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listTransferenciaDetallesService,
  listTransferenciaDetallesByTransferenciaIdService,
  addTransferenciaDetalleService,
  updateTransferenciaDetalleService,
  deleteTransferenciaDetalleService,
} from '../services/transferenciaDetalleService';

interface TransferenciaDetalle {
  id: string;
  transferencia_id: string;
  referencia_id: number;
  fecha: string;
  tipo: string;
  referencia: string;
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
    return await listTransferenciaDetallesByTransferenciaIdService(transferenciaId);
  }
);

export const addTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/add',
  async (data: {
    transferencia_id: string;
    referencia_id: number;
    fecha: Date;
    tipo: string;
    referencia: string;
  }) => {
    return await addTransferenciaDetalleService(data);
  }
);

export const updateTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/update',
  async (data: {
    id: string;
    transferencia_id?: string;
    referencia_id?: number;
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
