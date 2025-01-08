import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listTransferenciaRecursosService,
  listTransferenciaRecursosByIdService,
  addTransferenciaRecursoService,
  updateTransferenciaRecursoService,
  deleteTransferenciaRecursoService
} from '../services/transferenciaRecursoService';

interface TransferenciaDetalle {
  id: string;
  referencia_id: string;
  fecha: string;
  tipo: string;
  referencia: string;
}

export interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  vigente: boolean;
  tipo_recurso_id: string;
  tipo_costo_recurso_id: string;
  clasificacion_recurso_id: string;
  imagenes: {
    file: string;
  }[];
}

interface TransferenciaRecurso {
  _id: string;
  transferencia_detalle_id: TransferenciaDetalle;
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
  diferencia: number;
}

interface TransferenciaRecursoState {
  transferenciaRecursos: TransferenciaRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: TransferenciaRecursoState = {
  transferenciaRecursos: [],
  loading: false,
  error: null,
};

export const fetchTransferenciaRecursos = createAsyncThunk(
  'transferenciaRecurso/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listTransferenciaRecursosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTransferenciaRecursosById = createAsyncThunk(
  'transferenciaRecurso/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await listTransferenciaRecursosByIdService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/add',
  async (data: { transferencia_detalle_id: string; recurso_id: string; cantidad: number; costo: number }, { rejectWithValue }) => {
    try {
      return await addTransferenciaRecursoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/update',
  async (data: { id: string; cantidad: number; costo: number }, { rejectWithValue }) => {
    try {
      return await updateTransferenciaRecursoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTransferenciaRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const transferenciaRecursoSlice = createSlice({
  name: 'transferenciaRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All cases
      .addCase(fetchTransferenciaRecursos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransferenciaRecursos.fulfilled, (state, action: PayloadAction<TransferenciaRecurso[]>) => {
        state.loading = false;
        state.transferenciaRecursos = action.payload;
      })
      .addCase(fetchTransferenciaRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Id cases
      .addCase(fetchTransferenciaRecursosById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransferenciaRecursosById.fulfilled, (state, action: PayloadAction<TransferenciaRecurso[]>) => {
        state.loading = false;
        state.transferenciaRecursos = action.payload;
      })
      .addCase(fetchTransferenciaRecursosById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addTransferenciaRecurso.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTransferenciaRecurso.fulfilled, (state, action: PayloadAction<TransferenciaRecurso>) => {
        state.loading = false;
        state.transferenciaRecursos.push(action.payload);
      })
      .addCase(addTransferenciaRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cases
      .addCase(updateTransferenciaRecurso.fulfilled, (state, action: PayloadAction<TransferenciaRecurso>) => {
        const index = state.transferenciaRecursos.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.transferenciaRecursos[index] = action.payload;
        }
      })
      // Delete cases
      .addCase(deleteTransferenciaRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.transferenciaRecursos = state.transferenciaRecursos.filter(
          item => item._id !== action.payload
        );
      });
  },
});

export const { clearErrors } = transferenciaRecursoSlice.actions;
export const transferenciaRecursoReducer = transferenciaRecursoSlice.reducer;
