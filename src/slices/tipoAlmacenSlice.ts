import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listTipoAlmacenesService, 
  addTipoAlmacenService, 
  updateTipoAlmacenService, 
  deleteTipoAlmacenService 
} from '../services/tipoAlmacenService';

export interface TipoAlmacen {
  id: string;
  nombre: string;
}

interface TipoAlmacenState {
  tipoAlmacenes: TipoAlmacen[];
  loading: boolean;
  error: string | null;
}

const initialState: TipoAlmacenState = {
  tipoAlmacenes: [],
  loading: false,
  error: null,
};

export const fetchTipoAlmacenes = createAsyncThunk(
  'tipoAlmacen/fetchTipoAlmacenes',
  async (_, { rejectWithValue }) => {
    try {
      return await listTipoAlmacenesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTipoAlmacen = createAsyncThunk(
  'tipoAlmacen/addTipoAlmacen',
  async (nombre: string, { rejectWithValue }) => {
    try {
      return await addTipoAlmacenService(nombre);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTipoAlmacen = createAsyncThunk(
  'tipoAlmacen/updateTipoAlmacen',
  async (data: { id: string; nombre: string }, { rejectWithValue }) => {
    try {
      return await updateTipoAlmacenService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTipoAlmacen = createAsyncThunk(
  'tipoAlmacen/deleteTipoAlmacen',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTipoAlmacenService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tipoAlmacenSlice = createSlice({
  name: 'tipoAlmacen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTipoAlmacenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipoAlmacenes.fulfilled, (state, action: PayloadAction<TipoAlmacen[]>) => {
        state.loading = false;
        state.tipoAlmacenes = action.payload;
      })
      .addCase(fetchTipoAlmacenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTipoAlmacen.fulfilled, (state, action: PayloadAction<TipoAlmacen>) => {
        state.tipoAlmacenes.push(action.payload);
      })
      .addCase(updateTipoAlmacen.fulfilled, (state, action: PayloadAction<TipoAlmacen>) => {
        const index = state.tipoAlmacenes.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.tipoAlmacenes[index] = action.payload;
        }
      })
      .addCase(deleteTipoAlmacen.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.tipoAlmacenes = state.tipoAlmacenes.filter(item => item.id !== action.payload.id);
      });
  },
});

export const tipoAlmacenReducer = tipoAlmacenSlice.reducer;