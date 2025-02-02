import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listSolicitudRecursoAlmacenesService, addSolicitudRecursoAlmacenService, updateSolicitudRecursoAlmacenService, deleteSolicitudRecursoAlmacenService, getOrdenSolicitudRecursoByIdService } from '../services/solicitudRecursoAlmacenService';

// Interfaces para respuestas del servidor
interface Imagen {
  file: string;
}

interface Recurso {
  id: string;
  cantidad: number;
  codigo: string;
  descripcion: string;
  imagenes: Imagen[];
  nombre: string;
  precio_actual: number;
  vigente: boolean;
  unidad_id: string;
}

interface SolicitudAlmacen {
  id: string;
}

// Interface para la respuesta del servidor
export interface SolicitudRecursoAlmacenResponse {
  id: string;
  recurso_id: Recurso;
  cantidad: number;
  solicitud_almacen_id: SolicitudAlmacen;
  costo: number;
  pendiente: boolean;
}

// Interfaces para mutations (entrada de datos)
export interface SolicitudRecursoAlmacenInput {
  recursoId: string;
  cantidad: number;
  solicitudAlmacenId: string;
}

export interface UpdateSolicitudRecursoAlmacenInput {
  updateSolicitudRecursoAlmacenId: string;
  recursoId?: string;
  cantidad?: number;
  solicitudAlmacenId?: string;
}

// Estado
interface SolicitudRecursoAlmacenState {
  solicitudesRecurso: SolicitudRecursoAlmacenResponse[];
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
  'solicitudRecursoAlmacen/addSolicitudRecursoAlmacen',
  async (data: SolicitudRecursoAlmacenInput, { rejectWithValue }) => {
    try {
      return await addSolicitudRecursoAlmacenService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateSolicitudRecursoAlmacen = createAsyncThunk(
  'solicitudRecursoAlmacen/updateSolicitud',
  async (data: UpdateSolicitudRecursoAlmacenInput, { rejectWithValue }) => {
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

export const getOrdenSolicitudRecursoById = createAsyncThunk(
  'solicitudRecursoAlmacen/getOrdenById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getOrdenSolicitudRecursoByIdService(id);
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
      .addCase(fetchSolicitudesRecursoAlmacen.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacenResponse[]>) => {
        state.loading = false;
        state.solicitudesRecurso = action.payload;
      })
      .addCase(fetchSolicitudesRecursoAlmacen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSolicitudRecursoAlmacen.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacenResponse>) => {
        state.solicitudesRecurso.push(action.payload);
      })
      .addCase(updateSolicitudRecursoAlmacen.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacenResponse>) => {
        const index = state.solicitudesRecurso.findIndex(sol => sol.id === action.payload.id);
        if (index !== -1) {
          state.solicitudesRecurso[index] = action.payload;
        }
      })
      .addCase(deleteSolicitudRecursoAlmacen.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.solicitudesRecurso = state.solicitudesRecurso.filter(sol => sol.id !== action.payload.id);
      })
      .addCase(getOrdenSolicitudRecursoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdenSolicitudRecursoById.fulfilled, (state, action: PayloadAction<SolicitudRecursoAlmacenResponse>) => {
        state.loading = false;
        const index = state.solicitudesRecurso.findIndex(sol => sol.id === action.payload.id);
        if (index !== -1) {
          state.solicitudesRecurso[index] = action.payload;
        } else {
          state.solicitudesRecurso.push(action.payload);
        }
      })
      .addCase(getOrdenSolicitudRecursoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const solicitudRecursoAlmacenReducer = solicitudRecursoAlmacenSlice.reducer;
