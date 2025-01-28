import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listTiposCambioService,
  getTipoCambioByOrdenPagoService,
  addTipoCambioService,
  updateTipoCambioService,
  deleteTipoCambioService,
  TipoCambioInput
} from '../services/tipoCambioOrdenPagoService';

export interface TipoCambio {
  id: string;
  cambio: number;
  orden_pago_id: {
    id: string;
    codigo: string;
    monto_solicitado: number;
    tipo_moneda: string;
    tipo_pago: string;
    estado: string;
    observaciones: string;
    comprobante: string;
    fecha: string;
  };
}

export interface TipoCambioInput {
  cambio: number;
  monto_soles: number;
  orden_pago_id: string;
}

interface TipoCambioState {
  tiposCambio: TipoCambio[];
  tipoCambioByOrdenPago: TipoCambio | null;
  loading: boolean;
  error: string | null;
}

const initialState: TipoCambioState = {
  tiposCambio: [],
  tipoCambioByOrdenPago: null,
  loading: false,
  error: null
};

export const fetchTiposCambio = createAsyncThunk(
  'tipoCambio/fetchTiposCambio',
  async (_, { rejectWithValue }) => {
    try {
      return await listTiposCambioService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTipoCambioByOrdenPago = createAsyncThunk(
  'tipoCambio/fetchTipoCambioByOrdenPago',
  async (ordenPagoId: string, { rejectWithValue }) => {
    try {
      return await getTipoCambioByOrdenPagoService(ordenPagoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTipoCambio = createAsyncThunk(
  'tipoCambio/addTipoCambio',
  async (tipoCambio: TipoCambioInput, { rejectWithValue }) => {
    try {
      return await addTipoCambioService(tipoCambio);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTipoCambio = createAsyncThunk(
  'tipoCambio/updateTipoCambio',
  async ({ id, ...data }: TipoCambioInput & { id: string }, { rejectWithValue }) => {
    try {
      return await updateTipoCambioService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTipoCambio = createAsyncThunk(
  'tipoCambio/deleteTipoCambio',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTipoCambioService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tipoCambioOrdenPagoSlice = createSlice({
  name: 'tipoCambio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposCambio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposCambio.fulfilled, (state, action: PayloadAction<TipoCambio[]>) => {
        state.loading = false;
        state.tiposCambio = action.payload;
      })
      .addCase(fetchTiposCambio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTipoCambioByOrdenPago.fulfilled, (state, action: PayloadAction<TipoCambio>) => {
        state.tipoCambioByOrdenPago = action.payload;
      })
      .addCase(addTipoCambio.fulfilled, (state, action: PayloadAction<TipoCambio>) => {
        state.tiposCambio.push(action.payload);
      })
      .addCase(updateTipoCambio.fulfilled, (state, action: PayloadAction<TipoCambio>) => {
        const index = state.tiposCambio.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.tiposCambio[index] = action.payload;
        }
      })
      .addCase(deleteTipoCambio.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.tiposCambio = state.tiposCambio.filter(item => item.id !== action.payload.id);
      });
  },
});

export const tipoCambioOrdenPagoReducer = tipoCambioOrdenPagoSlice.reducer;
