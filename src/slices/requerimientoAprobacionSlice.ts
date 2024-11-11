import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listRequerimientoAprobaciones,
  addRequerimientoAprobacion,
  updateRequerimientoAprobacion,
  deleteRequerimientoAprobacion,
  getRequerimientoAprobacionByRequerimientoId
} from '../services/requerimientoAprobacionService';

interface RequerimientoAprobacion {
  requerimiento_id: string;
  usuario_id: string;
  estado_aprobacion: string;
  fecha_aprobacion?: Date;
  comentario?: string;
  gerarquia_aprobacion?: number;
}

interface RequerimientoUpdate {
  id: string;
  requerimiento_id: string;
  usuario_id: string;
  estado_aprobacion: string;
  fecha_aprobacion?: Date;
  comentario?: string;
  gerarquia_aprobacion?: number;
}

interface RequerimientoAprobacionState {
  aprobaciones: RequerimientoUpdate[];
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoAprobacionState = {
  aprobaciones: [],
  loading: false,
  error: null
};

export const fetchAprobaciones = createAsyncThunk(
  'requerimientoAprobacion/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listRequerimientoAprobaciones();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addAprobacion = createAsyncThunk(
  'requerimientoAprobacion/add',
  async (data: RequerimientoAprobacion, { rejectWithValue }) => {
    try {
      return await addRequerimientoAprobacion(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAprobacion = createAsyncThunk(
  'requerimientoAprobacion/update',
  async (data: RequerimientoUpdate, { rejectWithValue }) => {
    try {
      return await updateRequerimientoAprobacion(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAprobacion = createAsyncThunk(
  'requerimientoAprobacion/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRequerimientoAprobacion(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getAprobacionByRequerimientoId = createAsyncThunk(
  'requerimientoAprobacion/getByRequerimientoId',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRequerimientoAprobacionByRequerimientoId(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const requerimientoAprobacionSlice = createSlice({
  name: 'requerimientoAprobacion',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchAprobaciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAprobaciones.fulfilled, (state, action: PayloadAction<RequerimientoUpdate[]>) => {
        state.loading = false;
        state.aprobaciones = action.payload;
        state.error = null;
      })
      .addCase(fetchAprobaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addAprobacion.fulfilled, (state, action: PayloadAction<RequerimientoUpdate>) => {
        state.aprobaciones.push(action.payload);
        state.error = null;
      })
      // Update cases
      .addCase(updateAprobacion.fulfilled, (state, action) => {
        const index = state.aprobaciones.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.aprobaciones[index] = action.payload;
        }
        state.error = null;
      })
      // Delete cases
      .addCase(deleteAprobacion.fulfilled, (state, action) => {
        state.aprobaciones = state.aprobaciones.filter(a => a.id !== action.payload);
        state.error = null;
      })
      // Fetch by Requerimiento ID cases
      .addCase(getAprobacionByRequerimientoId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAprobacionByRequerimientoId.fulfilled, (state, action) => {
        state.loading = false;
        state.aprobaciones = [action.payload];
        state.error = null;
      })
      .addCase(getAprobacionByRequerimientoId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearErrors } = requerimientoAprobacionSlice.actions;
export const requerimientoAprobacionReducer = requerimientoAprobacionSlice.reducer;