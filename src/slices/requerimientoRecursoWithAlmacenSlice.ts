import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getRequerimientoRecursoWithAlmacen } from '../services/requerimientoRecursoWithAlmacenService';

interface Bodega {
  obra_bodega_id: string;
  nombre: string;
  cantidad: number;
  costo: number;
}

interface ObraBodegaRecurso {
  obra_id: string;
  cantidad_total_obra: number;
  obra_nombre: string;
  bodegas: Bodega[];
}

interface RequerimientoRecursoWithAlmacen {
  id: string;
  requerimiento_id: string;
  recurso_id: string;
  nombre: string;
  codigo: string;
  unidad: string;
  cantidad: number;
  cantidad_aprobada: number;
  estado: string;
  notas: string;
  costo_ref: number;
  metrado: number;
  fecha_limit: Date;
  presupuestado: boolean;
  list_obra_bodega_recursos: ObraBodegaRecurso[];
}

interface RequerimientoRecursoWithAlmacenState {
  recursos: RequerimientoRecursoWithAlmacen[];
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoRecursoWithAlmacenState = {
  recursos: [],
  loading: false,
  error: null,
};

export const fetchRequerimientoRecursosWithAlmacen = createAsyncThunk(
  'requerimientoRecursoWithAlmacen/fetch',
  async (requerimientoId: string, { rejectWithValue }) => {
    try {
      const response = await getRequerimientoRecursoWithAlmacen(requerimientoId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const requerimientoRecursoWithAlmacenSlice = createSlice({
  name: 'requerimientoRecursoWithAlmacen',
  initialState,
  reducers: {
    clearState: (state) => {
      state.recursos = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequerimientoRecursosWithAlmacen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequerimientoRecursosWithAlmacen.fulfilled, (state, action: PayloadAction<RequerimientoRecursoWithAlmacen[]>) => {
        state.loading = false;
        state.recursos = action.payload;
        state.error = null;
      })
      .addCase(fetchRequerimientoRecursosWithAlmacen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearState } = requerimientoRecursoWithAlmacenSlice.actions;
export const requerimientoRecursoWithAlmacenReducer = requerimientoRecursoWithAlmacenSlice.reducer;