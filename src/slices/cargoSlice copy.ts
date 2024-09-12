import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listCargosService, createCargoService, updateCargoService } from '../services/cargoService';

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

export const createCargo = createAsyncThunk(
  'cargo/createCargo',
  async (cargoData: Omit<Cargo, 'id'>, { rejectWithValue }) => {
    try {
      return await createCargoService(cargoData);
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
      .addCase(createCargo.fulfilled, (state, action: PayloadAction<Cargo>) => {
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

// Exporta el reducer
export const cargoReducer = cargoSlice.reducer;

// Exporta las acciones
export { fetchCargos, createCargo, updateCargo };