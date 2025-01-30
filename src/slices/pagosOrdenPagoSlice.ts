import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listPagosOrdenPagoService,
  getPagosByOrdenPagoService,
  addPagoOrdenPagoService,
  updatePagoOrdenPagoService,
  deletePagoOrdenPagoService,
  PagoOrdenPagoInput
} from '../services/pagosOrdenPagoService';

export interface PagoOrdenPago {
  id: string;
  fecha_pago: string;
  monto: number;
  tipo_monedas: string;
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
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
    dni: string;
    usuario: string;
    contrasenna: string;
    rol_id: string;
  };
}

interface PagoOrdenPagoState {
  pagos: PagoOrdenPago[];
  pagosByOrdenPago: PagoOrdenPago[];
  loading: boolean;
  error: string | null;
}

const initialState: PagoOrdenPagoState = {
  pagos: [],
  pagosByOrdenPago: [],
  loading: false,
  error: null
};

// Thunks
export const fetchPagos = createAsyncThunk(
  'pagoOrdenPago/fetchPagos',
  async (_, { rejectWithValue }) => {
    try {
      return await listPagosOrdenPagoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPagosByOrdenPago = createAsyncThunk(
  'pagoOrdenPago/fetchPagosByOrdenPago',
  async (ordenPagoId: string, { rejectWithValue }) => {
    try {
      return await getPagosByOrdenPagoService(ordenPagoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addPago = createAsyncThunk(
  'pagoOrdenPago/addPago',
  async (pago: PagoOrdenPagoInput, { rejectWithValue }) => {
    try {
      return await addPagoOrdenPagoService(pago);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePago = createAsyncThunk(
  'pagoOrdenPago/updatePago',
  async ({ id, ...data }: PagoOrdenPagoInput & { id: string }, { rejectWithValue }) => {
    try {
      return await updatePagoOrdenPagoService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePago = createAsyncThunk(
  'pagoOrdenPago/deletePago',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePagoOrdenPagoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const pagosOrdenPagoSlice = createSlice({
  name: 'pagoOrdenPago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch pagos
      .addCase(fetchPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagos.fulfilled, (state, action: PayloadAction<PagoOrdenPago[]>) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch pagos by orden pago
      .addCase(fetchPagosByOrdenPago.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosByOrdenPago.fulfilled, (state, action: PayloadAction<PagoOrdenPago[]>) => {
        state.loading = false;
        state.pagosByOrdenPago = action.payload;
      })
      .addCase(fetchPagosByOrdenPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add pago
      .addCase(addPago.fulfilled, (state, action: PayloadAction<PagoOrdenPago>) => {
        state.pagos.push(action.payload);
      })
      // Update pago
      .addCase(updatePago.fulfilled, (state, action: PayloadAction<PagoOrdenPago>) => {
        const index = state.pagos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.pagos[index] = action.payload;
        }
      })
      // Delete pago
      .addCase(deletePago.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.pagos = state.pagos.filter(item => item.id !== action.payload.id);
      });
  },
});

export const pagosOrdenPagoReducer = pagosOrdenPagoSlice.reducer;
