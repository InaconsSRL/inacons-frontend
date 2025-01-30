import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listAprobacionesOrdenPagoService,
  addAprobacionOrdenPagoService,
  updateAprobacionOrdenPagoService,
  deleteAprobacionOrdenPagoService,
  AprobacionOrdenPagoInput,
  getAprobacionesByOrdenPagoService
} from '../services/aprobacionesOrdenPagoService';

// Interfaces
export interface AprobacionOrdenPago {
  id: string;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
    dni: string;
    usuario: string;
    contrasenna: string;
    rol_id: string;
  };
  estado: string;
  fecha: string;
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

interface AprobacionOrdenPagoState {
  aprobaciones: AprobacionOrdenPago[];
  aprobacionesByOrdenPago: AprobacionOrdenPago[]; // Nueva propiedad
  loading: boolean;
  error: string | null;
}

const initialState: AprobacionOrdenPagoState = {
  aprobaciones: [],
  aprobacionesByOrdenPago: [], // Nueva propiedad
  loading: false,
  error: null
};

// Thunks
export const fetchAprobaciones = createAsyncThunk(
  'aprobacionOrdenPago/fetchAprobaciones',
  async (_, { rejectWithValue }) => {
    try {
      return await listAprobacionesOrdenPagoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addAprobacion = createAsyncThunk(
  'aprobacionOrdenPago/addAprobacion',
  async (aprobacion: AprobacionOrdenPagoInput, { rejectWithValue }) => {
    try {
      return await addAprobacionOrdenPagoService(aprobacion);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAprobacion = createAsyncThunk(
  'aprobacionOrdenPago/updateAprobacion',
  async ({ id, ...data }: AprobacionOrdenPagoInput & { id: string }, { rejectWithValue }) => {
    try {
      return await updateAprobacionOrdenPagoService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAprobacion = createAsyncThunk(
  'aprobacionOrdenPago/deleteAprobacion',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAprobacionOrdenPagoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Agregar nuevo thunk
export const fetchAprobacionesByOrdenPago = createAsyncThunk(
  'aprobacionOrdenPago/fetchAprobacionesByOrdenPago',
  async (ordenPagoId: string, { rejectWithValue }) => {
    try {
      return await getAprobacionesByOrdenPagoService(ordenPagoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const aprobacionOrdenPagoSlice = createSlice({
  name: 'aprobacionOrdenPago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch aprobaciones
      .addCase(fetchAprobaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAprobaciones.fulfilled, (state, action: PayloadAction<AprobacionOrdenPago[]>) => {
        state.loading = false;
        state.aprobaciones = action.payload;
      })
      .addCase(fetchAprobaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add aprobacion
      .addCase(addAprobacion.fulfilled, (state, action: PayloadAction<AprobacionOrdenPago>) => {
        state.aprobaciones.push(action.payload);
      })
      // Update aprobacion
      .addCase(updateAprobacion.fulfilled, (state, action: PayloadAction<AprobacionOrdenPago>) => {
        const index = state.aprobaciones.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.aprobaciones[index] = action.payload;
        }
      })
      // Delete aprobacion
      .addCase(deleteAprobacion.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.aprobaciones = state.aprobaciones.filter(item => item.id !== action.payload.id);
      })
      // Agregar casos para fetchAprobacionesByOrdenPago
      .addCase(fetchAprobacionesByOrdenPago.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAprobacionesByOrdenPago.fulfilled, (state, action: PayloadAction<AprobacionOrdenPago[]>) => {
        state.loading = false;
        state.aprobacionesByOrdenPago = action.payload;
      })
      .addCase(fetchAprobacionesByOrdenPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const aprobacionOrdenPagoReducer = aprobacionOrdenPagoSlice.reducer;
