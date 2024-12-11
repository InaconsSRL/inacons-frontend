import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listMovimientosService,
  addMovimientoService,
  updateMovimientoService,
  deleteMovimientoService
} from '../services/movimientoService';

interface Movimiento {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
}

interface MovimientoState {
  movimientos: Movimiento[];
  loading: boolean;
  error: string | null;
}

const initialState: MovimientoState = {
  movimientos: [],
  loading: false,
  error: null,
};

export const fetchMovimientos = createAsyncThunk(
  'movimiento/fetchMovimientos',
  async (_, { rejectWithValue }) => {
    try {
      return await listMovimientosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addMovimiento = createAsyncThunk(
  'movimiento/addMovimiento',
  async (movimientoData: { nombre: string; tipo: string; descripcion?: string }, { rejectWithValue }) => {
    try {
      return await addMovimientoService(movimientoData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateMovimiento = createAsyncThunk(
  'movimiento/updateMovimiento',
  async ({ id, data }: { id: string; data: Partial<Movimiento> }, { rejectWithValue }) => {
    try {
      return await updateMovimientoService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteMovimiento = createAsyncThunk(
  'movimiento/deleteMovimiento',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteMovimientoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const movimientoSlice = createSlice({
  name: 'movimiento',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovimientos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimientos.fulfilled, (state, action: PayloadAction<Movimiento[]>) => {
        state.loading = false;
        state.movimientos = action.payload;
      })
      .addCase(fetchMovimientos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMovimiento.fulfilled, (state, action: PayloadAction<Movimiento>) => {
        state.movimientos.push(action.payload);
      })
      .addCase(updateMovimiento.fulfilled, (state, action: PayloadAction<Movimiento>) => {
        const index = state.movimientos.findIndex(mov => mov.id === action.payload.id);
        if (index !== -1) {
          state.movimientos[index] = action.payload;
        }
      })
      .addCase(deleteMovimiento.fulfilled, (state, action: PayloadAction<string>) => {
        state.movimientos = state.movimientos.filter(mov => mov.id !== action.payload);
      });
  },
});

export const { clearErrors } = movimientoSlice.actions;
export const movimientoReducer = movimientoSlice.reducer;