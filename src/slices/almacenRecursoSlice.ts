import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listAlmacenRecursosService,
  listAlmacenRecursosByRecursoIdService,
  getAlmacenRecursoService,
  addAlmacenRecursoService,
  updateAlmacenRecursoService,
  deleteAlmacenRecursoService,
  AlmacenRecurso,
  AlmacenRecursoDetallado
} from '../services/almacenRecursoService';

interface AlmacenRecursoState {
  almacenRecursos: AlmacenRecurso[];
  almacenRecursosDetallados: AlmacenRecursoDetallado[];  // Cambiar a array
  loading: boolean;
  error: string | null;
}

const initialState: AlmacenRecursoState = {
  almacenRecursos: [],
  almacenRecursosDetallados: [],  // Inicializar como array vacío
  loading: false,
  error: null,
};

export const fetchAlmacenRecursos = createAsyncThunk(
  'almacenRecurso/fetchAlmacenRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listAlmacenRecursosService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const fetchAlmacenRecursosByRecursoId = createAsyncThunk(
  'almacenRecurso/fetchAlmacenRecursosByRecursoId',
  async (recursoId: string, { rejectWithValue }) => {
    try {
      return await listAlmacenRecursosByRecursoIdService(recursoId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const getAlmacenRecurso = createAsyncThunk(
  'almacenRecurso/getAlmacenRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getAlmacenRecursoService(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addAlmacenRecurso = createAsyncThunk(
  'almacenRecurso/addAlmacenRecurso',
  async (data: { recursoId: string; cantidad: number; almacenId: string; costo: number }, { rejectWithValue }) => {
    try {
      return await addAlmacenRecursoService(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updateAlmacenRecurso = createAsyncThunk(
  'almacenRecurso/updateAlmacenRecurso',
  async (data: { id: string; recursoId?: string; cantidad?: number; almacenId?: string; costo?: number }, { rejectWithValue }) => {
    try {
      return await updateAlmacenRecursoService(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deleteAlmacenRecurso = createAsyncThunk(
  'almacenRecurso/deleteAlmacenRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAlmacenRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const almacenRecursoSlice = createSlice({
  name: 'almacenRecurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlmacenRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlmacenRecursos.fulfilled, (state, action: PayloadAction<AlmacenRecurso[]>) => {
        state.loading = false;
        state.almacenRecursos = action.payload;
      })
      .addCase(fetchAlmacenRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAlmacenRecursosByRecursoId.fulfilled, (state, action: PayloadAction<AlmacenRecurso[]>) => {
        state.loading = false;
        state.almacenRecursos = action.payload;
      })
      .addCase(getAlmacenRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlmacenRecurso.fulfilled, (state, action: PayloadAction<AlmacenRecursoDetallado[]>) => {
        state.loading = false;
        state.almacenRecursosDetallados = action.payload;
        
        // Actualizar almacenRecursos con la información básica de cada recurso
        const recursosBasicos = action.payload
          .filter(item => item.recurso_id) // Filtrar elementos donde recurso_id no es null
          .map(item => ({
            id: item.id,
            recurso_id: item.recurso_id.id,
            cantidad: item.cantidad,
            almacen_id: item.bodega_id?.id || '',
            costo: item.costo || 0,
            nombre_almacen: ''
          }));

        state.almacenRecursos = recursosBasicos;
      })
      .addCase(getAlmacenRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAlmacenRecurso.fulfilled, (state, action: PayloadAction<AlmacenRecurso>) => {
        state.almacenRecursos.push(action.payload);
      })
      .addCase(updateAlmacenRecurso.fulfilled, (state, action: PayloadAction<AlmacenRecurso>) => {
        const index = state.almacenRecursos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.almacenRecursos[index] = action.payload;
        }
      })
      .addCase(deleteAlmacenRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.almacenRecursos = state.almacenRecursos.filter(item => item.id !== action.payload);
      });
  },
});

export const almacenRecursoReducer = almacenRecursoSlice.reducer;