import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecursosForObraAndRecursoId } from '../services/cantidadRecursosByBodegaService';

export const fetchRecursosForObraAndRecursoId = createAsyncThunk(
  'recursos/fetchRecursosForObraAndRecursoId',
  async ({ obraId, recursoId }: { obraId: string; recursoId: string }) => {
    const response = await getRecursosForObraAndRecursoId(obraId, recursoId);
    return response;
  }
);

interface Recurso {
  cantidad: number;
  nombre: string;
}

const recursosSlice = createSlice({
  name: 'recursos',
  initialState: {
    cantidadRecursosByBodega: [] as Recurso[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecursosForObraAndRecursoId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecursosForObraAndRecursoId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cantidadRecursosByBodega  = action.payload;
      })
      .addCase(fetchRecursosForObraAndRecursoId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const cantidadRecursosByBodegaReducer = recursosSlice.reducer;
