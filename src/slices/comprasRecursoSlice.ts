import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listComprasRecursosService,
  getCompraRecursoService,
  addCompraRecursoService,
  updateCompraRecursoService,
  deleteCompraRecursoService,
  listComprasRecursosByRecursoIdService
} from '../services/comprasRecursoService';

interface DetallesCompra {
  proveedor_id: string;
  usuario_id: string;
}

interface DetallesProveedor {
  razon_social: string;
}

interface DetallesUsuario {
  nombres: string;
  apellidos: string;
}

interface CompraRecurso {
  id: string;
  compra_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
  fecha: string;
  detalles_compra?: DetallesCompra;
  detalles_proveedor?: DetallesProveedor;
  detalles_usuario?: DetallesUsuario;
}

interface ComprasRecursoState {
  comprasRecursos: CompraRecurso[];
  selectedCompraRecurso: CompraRecurso | null;
  loading: boolean;
  error: string | null;
}

const initialState: ComprasRecursoState = {
  comprasRecursos: [],
  selectedCompraRecurso: null,
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchComprasRecursos = createAsyncThunk(
  'comprasRecurso/fetchComprasRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listComprasRecursosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getCompraRecurso = createAsyncThunk(
  'comprasRecurso/getCompraRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCompraRecursoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addCompraRecurso = createAsyncThunk(
  'comprasRecurso/addCompraRecurso',
  async (data: { compraId: string; recursoId: string; cantidad: number; costo: number; fecha?: string }, { rejectWithValue }) => {
    try {
      return await addCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateCompraRecurso = createAsyncThunk(
  'comprasRecurso/updateCompraRecurso',
  async (data: { id: string; compraId?: string; recursoId?: string; cantidad?: number; costo?: number; fecha?: string }, { rejectWithValue }) => {
    try {
      return await updateCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteCompraRecurso = createAsyncThunk(
  'comprasRecurso/deleteCompraRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCompraRecursoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchComprasRecursosByRecursoId = createAsyncThunk(
  'comprasRecurso/fetchComprasRecursosByRecursoId',
  async (recursoId: string, { rejectWithValue }) => {
    try {
      return await listComprasRecursosByRecursoIdService(recursoId);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const comprasRecursoSlice = createSlice({
  name: 'comprasRecurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComprasRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprasRecursos.fulfilled, (state, action: PayloadAction<CompraRecurso[]>) => {
        state.loading = false;
        state.comprasRecursos = action.payload;
      })
      .addCase(fetchComprasRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCompraRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompraRecurso.fulfilled, (state, action: PayloadAction<CompraRecurso>) => {
        state.loading = false;
        state.selectedCompraRecurso = action.payload;
      })
      .addCase(getCompraRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCompraRecurso.fulfilled, (state, action: PayloadAction<CompraRecurso>) => {
        state.comprasRecursos.push(action.payload);
      })
      .addCase(updateCompraRecurso.fulfilled, (state, action: PayloadAction<CompraRecurso>) => {
        const index = state.comprasRecursos.findIndex(cr => cr.id === action.payload.id);
        if (index !== -1) {
          state.comprasRecursos[index] = action.payload;
        }
      })
      .addCase(deleteCompraRecurso.fulfilled, (state, action: PayloadAction<CompraRecurso>) => {
        state.comprasRecursos = state.comprasRecursos.filter(cr => cr.id !== action.payload.id);
      })
      .addCase(fetchComprasRecursosByRecursoId.fulfilled, (state, action: PayloadAction<CompraRecurso[]>) => {
        state.comprasRecursos = action.payload;
      });
  },
});

export const comprasRecursoReducer = comprasRecursoSlice.reducer;
