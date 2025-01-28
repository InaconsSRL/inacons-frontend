import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ComprobantePago,
  listComprobantesPagoService,
  getComprobantesByOrdenPagoService,
  uploadComprobantePagoService,
  deleteComprobantePagoService,
} from '../services/comprobantePagoService';

export interface UploadComprobanteParams {
  ordenPagoId: string;
  file: File;
}

interface ComprobantePagoState {
  comprobantes: ComprobantePago[];
  comprobantesByOrdenPago: ComprobantePago[];
  loading: boolean;
  error: string | null;
}

const initialState: ComprobantePagoState = {
  comprobantes: [],
  comprobantesByOrdenPago: [],
  loading: false,
  error: null
};

export const fetchComprobantes = createAsyncThunk(
  'comprobantePago/fetchComprobantes',
  async (_, { rejectWithValue }) => {
    try {
      return await listComprobantesPagoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchComprobantesByOrdenPago = createAsyncThunk(
  'comprobantePago/fetchComprobantesByOrdenPago',
  async (ordenPagoId: string, { rejectWithValue }) => {
    try {
      return await getComprobantesByOrdenPagoService(ordenPagoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const uploadComprobante = createAsyncThunk(
  'comprobantePago/uploadComprobante',
  async ({ ordenPagoId, file }: UploadComprobanteParams, { rejectWithValue }) => {
    try {
      return await uploadComprobantePagoService(ordenPagoId, file);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteComprobante = createAsyncThunk(
  'comprobantePago/deleteComprobante',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteComprobantePagoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const comprobantePagoSlice = createSlice({
  name: 'comprobantePago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComprobantes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprobantes.fulfilled, (state, action: PayloadAction<ComprobantePago[]>) => {
        state.loading = false;
        state.comprobantes = action.payload;
      })
      .addCase(fetchComprobantes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchComprobantesByOrdenPago.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprobantesByOrdenPago.fulfilled, (state, action: PayloadAction<ComprobantePago[]>) => {
        state.loading = false;
        state.comprobantesByOrdenPago = action.payload;
      })
      .addCase(fetchComprobantesByOrdenPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadComprobante.fulfilled, (state, action: PayloadAction<ComprobantePago>) => {
        if (state.comprobantesByOrdenPago.length > 0 && 
            state.comprobantesByOrdenPago[0].orden_pago_id.id === action.payload.orden_pago_id.id) {
          state.comprobantesByOrdenPago.push(action.payload);
        }
        state.comprobantes.push(action.payload);
      })
      .addCase(deleteComprobante.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.comprobantes = state.comprobantes.filter(item => item.id !== action.payload.id);
        state.comprobantesByOrdenPago = state.comprobantesByOrdenPago.filter(item => item.id !== action.payload.id);
      });
  },
});

export const comprobantePagoReducer = comprobantePagoSlice.reducer;
