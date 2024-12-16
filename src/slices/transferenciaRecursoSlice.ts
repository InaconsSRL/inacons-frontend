import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listTransferenciaRecursosService,
  listTransferenciaRecursosByIdService,
  addTransferenciaRecursoService,
  updateTransferenciaRecursoService,
  deleteTransferenciaRecursoService,
} from '../services/transferenciaRecursoService';

interface TransferenciaRecurso {
  _id: string;
  transferencia_detalle_id: {
    id: string;
    referencia_id: string;
    fecha: string;
    tipo: string;
    referencia: string;
  };
  recurso_id: {
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
  };
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
  'transferenciaRecurso/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listTransferenciaRecursosService();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTransferenciaRecursosById = createAsyncThunk(
  'transferenciaRecurso/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await listTransferenciaRecursosByIdService(id);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/add',
  async (
    data: {
      transferencia_detalle_id: string;
      recurso_id: string;
      cantidad: number;
      costo?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await addTransferenciaRecursoService(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTransferenciaRecurso = createAsyncThunk(
  'transferenciaRecurso/update',
  async (
    data: {
      id: string;
      cantidad?: number;
      costo?: number;
    },
    { rejectWithValue }
  ) => {
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
      .addCase(fetchTransferenciaRecursosById.fulfilled, (state, action: PayloadAction<TransferenciaRecurso[]>) => {
        state.loading = false;
        // Filtrar recursos existentes que no pertenezcan al detalle actual
        const detalleId = action.payload[0]?.transferencia_detalle_id.id;
        const recursosActualizados = state.transferenciaRecursos.filter(
          recurso => recurso.transferencia_detalle_id.id !== detalleId
        );
        // Agregar los nuevos recursos
        state.transferenciaRecursos = [...recursosActualizados, ...action.payload];
      })
      .addCase(addTransferenciaRecurso.fulfilled, (state, action: PayloadAction<TransferenciaRecurso>) => {
        state.transferenciaRecursos.push(action.payload);
      })
      .addCase(updateTransferenciaRecurso.fulfilled, (state, action: PayloadAction<TransferenciaRecurso>) => {
        const index = state.transferenciaRecursos.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.transferenciaRecursos[index] = action.payload;
        }
      })
      .addCase(deleteTransferenciaRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.transferenciaRecursos = state.transferenciaRecursos.filter(item => item._id !== action.payload);
      });
  },
});

export const { clearTransferenciaRecursos, clearError } = transferenciaRecursoSlice.actions;
export const transferenciaRecursoReducer = transferenciaRecursoSlice.reducer;