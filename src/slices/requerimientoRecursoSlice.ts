import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getRequerimientoRecursoByRequerimientoId, 
  addRequerimientoRecurso as addRequerimientoRecursoService, 
  deleteRequerimientoRecurso as deleteRequerimientoRecursoService,
  updateRequerimientoRecurso as updateRequerimientoRecursoService,
} from '../services/requerimientoRecursoService';

// Interfaz actualizada con todos los campos del GraphQL
interface RequerimientoRecurso {
  unidad_id: string;
  id: string;
  requerimiento_id: string;
  recurso_id: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  cantidad_aprobada: number | null;
  estado_atencion: string;
  notas?: string;
  costo_ref?: number;
  metrado?: number;
  fecha_limit?: Date;
  presupuestado: boolean;
  unidad: string;
  estado: string;
  listAlmacenRecursos: AlmacenRecurso[];
}

interface AlmacenRecurso {
  recurso_id: string;
  cantidad: number;
  almacen_id: string;
  costo: number;
  nombre_almacen: string;
  _id: string;
}

interface RequerimientoRecursoState {
  requerimientoRecursos: RequerimientoRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoRecursoState = {
  requerimientoRecursos: [],
  loading: false,
  error: null,
};

// Interfaz para los datos de creación
interface AddRequerimientoRecursoData {
  requerimiento_id: string;
  recurso_id: string;
  cantidad: number;
  cantidad_aprobada: number;
  notas?: string;
  costo_ref?: number;
  fecha_limit?: Date;
  metrado?: number;
}

//interfaz para los datos de actualización
interface UpdateRequerimientoRecursoData {
  id: string;
  cantidad_aprobada?: number;
  notas?: string;
  fecha_limit?: Date;
  cantidad?: number;
}

export const fetchRequerimientoRecursos = createAsyncThunk(
  'requerimientoRecurso/fetchRequerimientoRecursos',
  async (requerimientoId: string, { rejectWithValue }) => {
    try {
      const response = await getRequerimientoRecursoByRequerimientoId(requerimientoId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addRequerimientoRecurso = createAsyncThunk(
  'requerimientoRecurso/addRequerimientoRecurso',
  async (data: AddRequerimientoRecursoData, { rejectWithValue }) => {
    try {
      console.log("data enviada creare recurso", data)
      const response = await addRequerimientoRecursoService({
        ...data,
        fecha_limit: data.fecha_limit ?? new Date(),
        notas: data.notas ?? '',
      });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRequerimientoRecurso = createAsyncThunk(
  'requerimientoRecurso/updateRequerimientoRecurso',
  async (data: UpdateRequerimientoRecursoData, { rejectWithValue }) => {
    try {
      const response = await updateRequerimientoRecursoService({
        id: data.id,
        cantidad_aprobada: data.cantidad_aprobada ?? 0,
        notas: data.notas ?? '',
        fecha_limit: data.fecha_limit ?? new Date(),
      });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRequerimientoRecurso = createAsyncThunk(
  'requerimientoRecurso/deleteRequerimientoRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRequerimientoRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const requerimientoRecursoSlice = createSlice({
  name: 'requerimientoRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearRequerimientoRecursos: (state) => {
      state.requerimientoRecursos = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchRequerimientoRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequerimientoRecursos.fulfilled, (state, action: PayloadAction<RequerimientoRecurso[]>) => {
        state.loading = false;
        state.requerimientoRecursos = action.payload;
        state.error = null;
      })
      .addCase(fetchRequerimientoRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addRequerimientoRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRequerimientoRecurso.fulfilled, (state, action: PayloadAction<RequerimientoRecurso>) => {
        state.loading = false;
        state.requerimientoRecursos.push(action.payload);
        state.error = null;
      })
      .addCase(addRequerimientoRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para update
      .addCase(updateRequerimientoRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequerimientoRecurso.fulfilled, (state, action: PayloadAction<RequerimientoRecurso>) => {
        state.loading = false;
        // Actualizamos el recurso en el array
        const index = state.requerimientoRecursos.findIndex(
          (recurso) => recurso.id === action.payload.id
        );
        if (index !== -1) {
          state.requerimientoRecursos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRequerimientoRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete cases
      .addCase(deleteRequerimientoRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRequerimientoRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.requerimientoRecursos = state.requerimientoRecursos.filter(
          (recurso) => recurso.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteRequerimientoRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, clearRequerimientoRecursos } = requerimientoRecursoSlice.actions;
export const requerimientoRecursoReducer = requerimientoRecursoSlice.reducer;