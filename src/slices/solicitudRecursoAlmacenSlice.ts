import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listSolicitudRecursoAlmacenesService, addSolicitudRecursoAlmacenService, updateSolicitudRecursoAlmacenService, deleteSolicitudRecursoAlmacenService } from '../services/solicitudRecursoAlmacenService';

// Interfaces
interface SolicitudRecursoAlmacen {
  id: string;
  recurso_id: string;
  cantidad: number;
  solicitud_almacen_id: string;
}

interface SolicitudRecursoAlmacenState {
  solicitudesRecurso: SolicitudRecursoAlmacen[];
  loading: boolean;
  error: string | null;
}

const initialState: SolicitudRecursoAlmacenState = {
  solicitudesRecurso: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchSolicitudesRecursoAlmacen = createAsyncThunk(
  'solicitudRecursoAlmacen/fetchSolicitudes',
  async (_, { rejectWithValue }) => {
    try {
      return await listSolicitudRecursoAlmacenesService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addSolicitudRecursoAlmacen = createAsyncThunk(
  'solicitudRecursoAlmacen/addSolicitud',
  async (data: { recursoId: string; cantidad: number; solicitudAlmacenId: string }, { rejectWithValue }) => {
    try {
      return await addSolicitudRecursoAlmacenService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateSolicitudRecursoAlmacen = createAsyncThunk(
  'solicitudRecursoAlmacen/updateSolicitud',
  async (data: { updateSolicitudRecursoAlmacenId: string; recursoId: string; cantidad: number; solicitudAlmacenId: string }, { rejectWithValue }) => {
    try {
      return await updateSolicitudRecursoAlmacenService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteSolicitudRecursoAlmacen = createAsyncThunk(
  'solicitudRecursoAlmacen/deleteSolicitud',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteSolicitudRecursoAlmacenService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const solicitudRecursoAlmacenSlice = createSlice({
  name: 'solicitudRecursoAlmacen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudesRecursoAlmacen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolicitudesRecursoAlmacen.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacen[]>) => {
        state.loading = false;
        state.solicitudesRecurso = action.payload;
      })
      .addCase(fetchSolicitudesRecursoAlmacen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSolicitudRecursoAlmacen.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacen>) => {
        state.solicitudesRecurso.push(action.payload);
      })
      .addCase(updateSolicitudRecursoAlmacen.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacen>) => {
        const index = state.solicitudesRecurso.findIndex(sol => sol.id === action.payload.id);
        if (index !== -1) {
          state.solicitudesRecurso[index] = action.payload;
        }
      })
      .addCase(deleteSolicitudRecursoAlmacen.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.solicitudesRecurso = state.solicitudesRecurso.filter(sol => sol.id !== action.payload.id);
      });
  },
});

export const solicitudRecursoAlmacenReducer = solicitudRecursoAlmacenSlice.reducer;
