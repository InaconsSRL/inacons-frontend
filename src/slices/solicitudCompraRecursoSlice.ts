import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listSolicitudCompraRecursosService,
  listBySolicitudIdService,
  addSolicitudCompraRecursoService,
  updateSolicitudCompraRecursoService,
  deleteSolicitudCompraRecursoService,
} from '../services/solicitudCompraRecursoService';

interface SolicitudCompraRecurso {
  id: string;
  solicitud_compra_id: string;
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio_actual: number;
    vigente: boolean;
    imagenes: {
      file: string;
    }[];
  };
  cantidad: number;
  costo: number;
}

interface SolicitudCompraRecursoState {
  solicitudCompraRecursos: SolicitudCompraRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: SolicitudCompraRecursoState = {
  solicitudCompraRecursos: [],
  loading: false,
  error: null,
};

export const fetchSolicitudCompraRecursos = createAsyncThunk(
  'solicitudCompraRecurso/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listSolicitudCompraRecursosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchBySolicitudId = createAsyncThunk(
  'solicitudCompraRecurso/fetchBySolicitudId',
  async (solicitudId: string, { rejectWithValue }) => {
    try {
      return await listBySolicitudIdService(solicitudId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addSolicitudCompraRecurso = createAsyncThunk(
  'solicitudCompraRecurso/add',
  async (data: { solicitud_compra_id: string; recurso_id: string; cantidad: number; costo: number }, { rejectWithValue }) => {
    try {
      return await addSolicitudCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateSolicitudCompraRecurso = createAsyncThunk(
  'solicitudCompraRecurso/update',
  async (data: { id: string; solicitud_compra_id?: string; recurso_id?: string; cantidad?: number; costo?: number }, { rejectWithValue }) => {
    try {
      return await updateSolicitudCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteSolicitudCompraRecurso = createAsyncThunk(
  'solicitudCompraRecurso/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSolicitudCompraRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const solicitudCompraRecursoSlice = createSlice({
  name: 'solicitudCompraRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSolicitudCompraRecursos: (state) => {
      state.solicitudCompraRecursos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudCompraRecursos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolicitudCompraRecursos.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitudCompraRecursos = action.payload;
        state.error = null;
      })
      .addCase(fetchSolicitudCompraRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchBySolicitudId
      .addCase(fetchBySolicitudId.fulfilled, (state, action) => {
        state.solicitudCompraRecursos = action.payload;
        state.loading = false;
        state.error = null;
      })
      // Casos para add
      .addCase(addSolicitudCompraRecurso.fulfilled, (state, action) => {
        state.solicitudCompraRecursos.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      // Casos para update
      .addCase(updateSolicitudCompraRecurso.fulfilled, (state, action) => {
        const index = state.solicitudCompraRecursos.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.solicitudCompraRecursos[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      // Casos para delete
      .addCase(deleteSolicitudCompraRecurso.fulfilled, (state, action) => {
        state.solicitudCompraRecursos = state.solicitudCompraRecursos.filter(
          (item) => item.id !== action.payload
        );
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearErrors, clearSolicitudCompraRecursos } = solicitudCompraRecursoSlice.actions;
export const solicitudCompraRecursoReducer = solicitudCompraRecursoSlice.reducer;