
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listRequerimientoEstadoHistorialesService,
  addRequerimientoEstadoHistorialService,
  updateRequerimientoEstadoHistorialService,
  deleteRequerimientoEstadoHistorialService,
  AddHistorialData,
  UpdateHistorialData
} from '../services/requerimientoEstadoHistorialService';

interface RequerimientoEstadoHistorial {
  id: string;
  requerimiento_id: string;
  estado_anterior: string;
  estado_nuevo: string;
  fecha_cambio: string;
  usuario_id: string;
  comentario: string;
}

interface RequerimientoEstadoHistorialState {
  historiales: RequerimientoEstadoHistorial[];
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoEstadoHistorialState = {
  historiales: [],
  loading: false,
  error: null,
};

export const fetchHistoriales = createAsyncThunk(
  'requerimientoEstadoHistorial/fetchHistoriales',
  async () => {
    return await listRequerimientoEstadoHistorialesService();
  }
);

export const addHistorial = createAsyncThunk(
  'requerimientoEstadoHistorial/addHistorial',
  async (historialData: AddHistorialData) => {
    return await addRequerimientoEstadoHistorialService(historialData);
  }
);

export const updateHistorial = createAsyncThunk(
  'requerimientoEstadoHistorial/updateHistorial',
  async (historialData: UpdateHistorialData) => {
    return await updateRequerimientoEstadoHistorialService(historialData);
  }
);

export const deleteHistorial = createAsyncThunk(
  'requerimientoEstadoHistorial/deleteHistorial',
  async (id: string) => {
    await deleteRequerimientoEstadoHistorialService(id);
    return id;
  }
);

const requerimientoEstadoHistorialSlice = createSlice({
  name: 'requerimientoEstadoHistorial',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchHistoriales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistoriales.fulfilled, (state, action: PayloadAction<RequerimientoEstadoHistorial[]>) => {
        state.loading = false;
        state.historiales = action.payload;
      })
      .addCase(fetchHistoriales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error desconocido';
      })
      // Add cases
      .addCase(addHistorial.fulfilled, (state, action: PayloadAction<RequerimientoEstadoHistorial>) => {
        state.historiales.push(action.payload);
      })
      // Update cases
      .addCase(updateHistorial.fulfilled, (state, action: PayloadAction<RequerimientoEstadoHistorial>) => {
        const index = state.historiales.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.historiales[index] = action.payload;
        }
      })
      // Delete cases
      .addCase(deleteHistorial.fulfilled, (state, action: PayloadAction<string>) => {
        state.historiales = state.historiales.filter(h => h.id !== action.payload);
      });
  },
});

export const { clearErrors } = requerimientoEstadoHistorialSlice.actions;
export const requerimientoEstadoHistorialReducer = requerimientoEstadoHistorialSlice.reducer;