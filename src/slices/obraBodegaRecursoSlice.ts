import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listObraBodegaRecursosService,
  listObraBodegaRecursosByBodegaService,
  addObraBodegaRecursoService,
  updateObraBodegaRecursoService,
  deleteObraBodegaRecursoService,
} from '../services/obraBodegaRecursoService';

interface Imagen {
  file: string;
}

interface Recurso {
  id: string;
  nombre: string;
  codigo: string;
  unidad_id: string;
  cantidad: number;
  descripcion: string;
  precio_actual: number;
  imagenes: Imagen[];
}

interface ObraBodega {
  id: string;
  nombre: string;
  codigo: string;
  estado: string;
}

interface ObraBodegaRecurso {
  id: string;
  obra_bodega_id: ObraBodega;
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
  estado: string;
}

interface ObraBodegaRecursoState {
  obraBodegaRecursos: ObraBodegaRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: ObraBodegaRecursoState = {
  obraBodegaRecursos: [],
  loading: false,
  error: null,
};

export const fetchObraBodegaRecursos = createAsyncThunk(
  'obraBodegaRecurso/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listObraBodegaRecursosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchObraBodegaRecursosByBodega = createAsyncThunk(
  'obraBodegaRecurso/fetchByBodega',
  async (obraBodegaId: string, { rejectWithValue }) => {
    try {
      return await listObraBodegaRecursosByBodegaService(obraBodegaId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addObraBodegaRecurso = createAsyncThunk(
  'obraBodegaRecurso/add',
  async (recursoData: {
    obraBodegaId: string;
    recursoId: string;
    cantidad: number;
    costo: number;
    estado: string;
  }, { rejectWithValue }) => {
    try {
      return await addObraBodegaRecursoService(recursoData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateObraBodegaRecurso = createAsyncThunk(
  'obraBodegaRecurso/update',
  async (recursoData: {
    updateObraBodegaRecursoId: string;
    obraBodegaId: string;
    recursoId: string;
    cantidad: number;
    costo: number;
    estado: string;
  }, { rejectWithValue }) => {
    try {
      return await updateObraBodegaRecursoService(recursoData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteObraBodegaRecurso = createAsyncThunk(
  'obraBodegaRecurso/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteObraBodegaRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const obraBodegaRecursoSlice = createSlice({
  name: 'obraBodegaRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all cases
      .addCase(fetchObraBodegaRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObraBodegaRecursos.fulfilled, (state, action: PayloadAction<ObraBodegaRecurso[]>) => {
        state.loading = false;
        state.obraBodegaRecursos = action.payload;
      })
      .addCase(fetchObraBodegaRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by bodega cases
      .addCase(fetchObraBodegaRecursosByBodega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObraBodegaRecursosByBodega.fulfilled, (state, action: PayloadAction<ObraBodegaRecurso[]>) => {
        state.loading = false;
        state.obraBodegaRecursos = action.payload;
      })
      .addCase(fetchObraBodegaRecursosByBodega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addObraBodegaRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addObraBodegaRecurso.fulfilled, (state, action: PayloadAction<ObraBodegaRecurso>) => {
        state.loading = false;
        state.obraBodegaRecursos.push(action.payload);
      })
      .addCase(addObraBodegaRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cases
      .addCase(updateObraBodegaRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateObraBodegaRecurso.fulfilled, (state, action: PayloadAction<ObraBodegaRecurso>) => {
        state.loading = false;
        const index = state.obraBodegaRecursos.findIndex(recurso => recurso.id === action.payload.id);
        if (index !== -1) {
          state.obraBodegaRecursos[index] = action.payload;
        }
      })
      .addCase(updateObraBodegaRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete cases
      .addCase(deleteObraBodegaRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteObraBodegaRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.obraBodegaRecursos = state.obraBodegaRecursos.filter(recurso => recurso.id !== action.payload);
      })
      .addCase(deleteObraBodegaRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = obraBodegaRecursoSlice.actions;

export const obraBodegaRecursoReducer = obraBodegaRecursoSlice.reducer;