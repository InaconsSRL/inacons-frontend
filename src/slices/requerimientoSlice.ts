import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listRequerimientosService, addRequerimientoService, updateRequerimientoService } from '../services/requerimientoService';

interface Requerimiento {
  id: string;
  codigo: string;
  usuario_id: string;
  usuario: string;
  presupuesto_id: string;
  fecha_solicitud: string;
  fecha_final: string;
  estado: string;
  sustento: string;
  obra_id: string;
}

interface RequerimientoState {
  requerimientos: Requerimiento[];
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoState = {
  requerimientos: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchRequerimientos = createAsyncThunk(
  'requerimiento/fetchRequerimientos',
  async (_, { rejectWithValue }) => {
    try {
      return await listRequerimientosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addRequerimiento = createAsyncThunk(
    'requerimiento/addRequerimiento',
    async (requerimientoData: { usuario_id: string; obra_id: string; sustento: string }, { rejectWithValue }) => {
      try {
        return await addRequerimientoService(requerimientoData);
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );
  
  export const updateRequerimiento = createAsyncThunk(
    'requerimiento/updateRequerimiento',
    async (requerimiento: { id: string; usuario_id: string; obra_id: string; sustento: string }, { rejectWithValue }) => {
      try {
        return await updateRequerimientoService(requerimiento);
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );
  
  const requerimientoSlice = createSlice({
    name: 'requerimiento',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchRequerimientos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchRequerimientos.fulfilled, (state, action: PayloadAction<Requerimiento[]>) => {
          state.loading = false;
          state.requerimientos = action.payload;
        })
        .addCase(fetchRequerimientos.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(addRequerimiento.fulfilled, (state, action: PayloadAction<Requerimiento>) => {
          state.requerimientos.push(action.payload);
        })
        .addCase(updateRequerimiento.fulfilled, (state, action: PayloadAction<Requerimiento>) => {
          const index = state.requerimientos.findIndex(req => req.id === action.payload.id);
          if (index !== -1) {
            state.requerimientos[index] = action.payload;
          }
        });
    },
  });
  
  export const requerimientoReducer = requerimientoSlice.reducer;