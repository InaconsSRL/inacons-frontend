import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listRequerimientosService, addRequerimientoService, updateRequerimientoService, getRequerimientoService, deleteRequerimientoService } from '../services/requerimientoService';

interface Aprobacion {
  id_usuario: string;
  id_aprobacion: string;
  cargo: string;
  gerarquia: number;
  nombres: string;
  apellidos: string;
}

export interface Requerimiento {
  estado: string;
  aprobacion: Aprobacion[];
  codigo: string;
  estado_atencion: string;
  fecha_final: string;
  fecha_solicitud: string;
  id: string;
  obra_id: string;
  presupuesto_id: string;
  sustento: string;
  usuario: string;
  usuario_id: string;
}

interface RequerimientoState {
  requerimientos: Requerimiento[];
  selectedRequerimiento: Requerimiento | null;
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoState = {
  requerimientos: [],
  selectedRequerimiento: null,
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
    async (requerimientoData: { usuario_id: string; obra_id: string; fecha_final: Date; sustento: string, estado_atencion: string}, { rejectWithValue }) => {
      try {
        return await addRequerimientoService(requerimientoData);
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );
  
  export const updateRequerimiento = createAsyncThunk(
    'requerimiento/updateRequerimiento',
    async (requerimiento: { id: string; usuario_id: string; obra_id:  string; fecha_final: Date; sustento: string; estado_atencion:string }, { rejectWithValue }) => {
      try {
        return await updateRequerimientoService(requerimiento);
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );

export const getRequerimiento = createAsyncThunk(
  'requerimiento/getRequerimiento',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRequerimientoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteRequerimiento = createAsyncThunk(
  'requerimiento/deleteRequerimiento',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteRequerimientoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);
  
  const requerimientoSlice = createSlice({
    name: 'requerimiento',
    initialState,
    reducers: {
      setRequerimientos: (state, action: PayloadAction<Requerimiento[]>) => {
        state.requerimientos = action.payload;
        state.loading = false;
        state.error = null;
      }
    },
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
        })
        .addCase(getRequerimiento.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getRequerimiento.fulfilled, (state, action: PayloadAction<Requerimiento>) => {
          state.loading = false;
          state.selectedRequerimiento = action.payload;
        })
        .addCase(getRequerimiento.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(deleteRequerimiento.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
          state.requerimientos = state.requerimientos.filter(req => req.id !== action.payload.id);
        });
    },
  });
  
  export const { setRequerimientos } = requerimientoSlice.actions;
  export const requerimientoReducer = requerimientoSlice.reducer;