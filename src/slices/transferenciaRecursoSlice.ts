import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listTransferenciaRecursosService, listTransferenciaRecursosByDetalleService, addTransferenciaRecursoService, updateTransferenciaRecursoService, deleteTransferenciaRecursoService, listTransferenciaRecursosByTransferenciaDetalleService } from '../services/transferenciaRecursoService';

interface Movilidad {
  id: string;
  denominacion: string;
  descripcion: string;
}

interface Movimiento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

interface Usuario {
  id: string;
  apellidos: string;
  nombres: string;
}

interface Transferencia {
  fecha: string;
  id: string;
  movilidad_id: Movilidad;
  movimiento_id: Movimiento;
  usuario_id: Usuario;
}

interface TransferenciaDetalle {
  id: string;
  fecha: string;
  referencia: string;
  referencia_id: string;
  tipo: string;
  transferencia_id: Transferencia;
}

interface Imagen {
  file: string;
}

interface Recurso {
  cantidad: number;
  codigo: string;
  id: string;
  imagenes: Imagen[];
  nombre: string;
  precio_actual: number;
  vigente: boolean;
}

interface TransferenciaRecurso {
  id: string;
  transferencia_detalle_id: TransferenciaDetalle;
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
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
  'transferenciaRecurso/fetchTransferenciaRecursos',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listTransferenciaRecursosService();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTransferenciaRecursosByDetalle = createAsyncThunk(
  'transferenciaRecurso/fetchTransferenciaRecursosByDetalle',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await listTransferenciaRecursosByDetalleService(id);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTransferenciaRecursosByTransferenciaDetalle = createAsyncThunk(
  'transferenciaRecurso/fetchByTransferenciaDetalle',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await listTransferenciaRecursosByTransferenciaDetalleService(id);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/addTransferenciaRecurso',
  async (data: { transferencia_detalle_id: string; recurso_id: string; cantidad: number }, { rejectWithValue }) => {
    try {
      const response = await addTransferenciaRecursoService(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/updateTransferenciaRecurso',
  async (data: { id: string; cantidad?: number; recurso_id?: string; transferencia_detalle_id?: string }, { rejectWithValue }) => {
    try {
      const response = await updateTransferenciaRecursoService(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/deleteTransferenciaRecurso',
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
    clearTransferenciaRecursos: (state) => {
      state.transferenciaRecursos = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferenciaRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferenciaRecursos.fulfilled, (state, action: PayloadAction<TransferenciaRecurso[]>) => {
        state.loading = false;
        state.transferenciaRecursos = action.payload;
      })
      .addCase(fetchTransferenciaRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransferenciaRecursosByDetalle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferenciaRecursosByDetalle.fulfilled, (state, action: PayloadAction<TransferenciaRecurso[]>) => {
        state.loading = false;
        state.transferenciaRecursos = action.payload;
      })
      .addCase(fetchTransferenciaRecursosByDetalle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransferenciaRecursosByTransferenciaDetalle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferenciaRecursosByTransferenciaDetalle.fulfilled, (state, action: PayloadAction<TransferenciaRecurso[]>) => {
        state.loading = false;
        state.transferenciaRecursos = action.payload;
      })
      .addCase(fetchTransferenciaRecursosByTransferenciaDetalle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTransferenciaRecurso.fulfilled, (state, action: PayloadAction<TransferenciaRecurso>) => {
        state.transferenciaRecursos.push(action.payload);
      })
      .addCase(updateTransferenciaRecurso.fulfilled, (state, action: PayloadAction<TransferenciaRecurso>) => {
        const index = state.transferenciaRecursos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.transferenciaRecursos[index] = action.payload;
        }
      })
      .addCase(deleteTransferenciaRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.transferenciaRecursos = state.transferenciaRecursos.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearTransferenciaRecursos, clearError } = transferenciaRecursoSlice.actions;
export const transferenciaRecursoReducer = transferenciaRecursoSlice.reducer;