import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listCargosService, addCargoService, updateCargoService } from '../services/cargoService';

// Interfaces
interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
}

interface CargoState {
  cargos: Cargo[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: CargoState = {
  cargos: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchCargos = createAsyncThunk(
  'cargo/fetchCargos',
  async (_, { rejectWithValue }) => {
    try {
      return await listCargosService();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCargo = createAsyncThunk(
  'cargo/addCargo',
  async (cargoData: { nombre: string; descripcion: string }, { rejectWithValue }) => {
    try {
      return await addCargoService(cargoData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCargo = createAsyncThunk(
  'cargo/updateCargo',
  async (cargo: Cargo, { rejectWithValue }) => {
    try {
      return await updateCargoService(cargo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const cargoSlice = createSlice({
  name: 'cargo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCargos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCargos.fulfilled, (state, action: PayloadAction<Cargo[]>) => {
        state.loading = false;
        state.cargos = action.payload;
      })
      .addCase(fetchCargos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCargo.fulfilled, (state, action: PayloadAction<Cargo>) => {
        state.cargos.push(action.payload);
      })
      .addCase(updateCargo.fulfilled, (state, action: PayloadAction<Cargo>) => {
        const index = state.cargos.findIndex(cargo => cargo.id === action.payload.id);
        if (index !== -1) {
          state.cargos[index] = action.payload;
        }
      });
  },
});

export const cargoReducer = cargoSlice.reducer;