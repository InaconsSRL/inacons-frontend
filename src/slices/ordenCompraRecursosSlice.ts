import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listOrdenCompraRecursosService, 
  addOrdenCompraRecursoService, 
  updateOrdenCompraRecursoService, 
  deleteOrdenCompraRecursoService,
  getOrdenCompraRecursosByOrdenIdService 
} from '../services/ordenCompraRecursosService';

// Interfaces base para las estructuras anidadas
interface RecursoImagen {
  file: string;
}

interface Recurso {
  id: string;
  nombre: string;
  codigo: string;
  imagenes: RecursoImagen[];
  precio_actual: number;
  unidad_id: string;
}

interface OrdenCompraRef {
  id: string;
}

// Interface para las respuestas de consultas (GET/LIST)
interface OrdenCompraRecursoQuery {
  id: string;
  orden_compra_id: OrdenCompraRef;
  id_recurso: Recurso;
  costo_real: number;
  costo_aproximado: number;
  estado: string;
  cantidad: number;
}

// Interface para las mutaciones (ADD/UPDATE)
interface OrdenCompraRecursoMutation {
  id?: string;
  orden_compra_id: string;
  id_recurso: string;
  costo_real: number;
  costo_aproximado: number;
  estado: string;
  cantidad: number;
}

interface OrdenCompraRecursoState {
  ordenCompraRecursos: OrdenCompraRecursoQuery[];
  ordenCompraRecursosByOrdenId: OrdenCompraRecursoQuery[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdenCompraRecursoState = {
  ordenCompraRecursos: [],
  ordenCompraRecursosByOrdenId: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchOrdenCompraRecursos = createAsyncThunk(
  'ordenCompraRecursos/fetchOrdenCompraRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listOrdenCompraRecursosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addOrdenCompraRecurso = createAsyncThunk(
  'ordenCompraRecursos/addOrdenCompraRecurso',
  async (data: OrdenCompraRecursoMutation, { rejectWithValue }) => {
    try {
      return await addOrdenCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateOrdenCompraRecurso = createAsyncThunk(
  'ordenCompraRecursos/updateOrdenCompraRecurso',
  async (data: OrdenCompraRecursoMutation & { id: string }, { rejectWithValue }) => {
    try {
      return await updateOrdenCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteOrdenCompraRecurso = createAsyncThunk(
  'ordenCompraRecursos/deleteOrdenCompraRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteOrdenCompraRecursoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchOrdenCompraRecursosByOrdenId = createAsyncThunk(
  'ordenCompraRecursos/fetchByOrdenId',
  async (ordenId: string, { rejectWithValue }) => {
    try {
      return await getOrdenCompraRecursosByOrdenIdService(ordenId);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const ordenCompraRecursosSlice = createSlice({
  name: 'ordenCompraRecursos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenCompraRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenCompraRecursos.fulfilled, (state, action: PayloadAction<OrdenCompraRecursoQuery[]>) => {
        state.loading = false;
        state.ordenCompraRecursos = action.payload;
      })
      .addCase(fetchOrdenCompraRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOrdenCompraRecurso.fulfilled, (state, action: PayloadAction<OrdenCompraRecursoQuery>) => {
        state.ordenCompraRecursos.push(action.payload);
      })
      .addCase(updateOrdenCompraRecurso.fulfilled, (state, action: PayloadAction<OrdenCompraRecursoQuery>) => {
        const index = state.ordenCompraRecursos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.ordenCompraRecursos[index] = action.payload;
        }
      })
      .addCase(deleteOrdenCompraRecurso.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.ordenCompraRecursos = state.ordenCompraRecursos.filter(item => item.id !== action.payload.id);
      })
      .addCase(fetchOrdenCompraRecursosByOrdenId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenCompraRecursosByOrdenId.fulfilled, (state, action: PayloadAction<OrdenCompraRecursoQuery[]>) => {
        state.loading = false;
        state.ordenCompraRecursosByOrdenId = action.payload;
      })
      .addCase(fetchOrdenCompraRecursosByOrdenId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const ordenCompraRecursosReducer = ordenCompraRecursosSlice.reducer;
