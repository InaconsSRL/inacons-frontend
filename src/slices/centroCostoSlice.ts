
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listCentrosCostoService,
  addCentroCostoService,
  updateCentroCostoService,
  deleteCentroCostoService,
} from '../services/centroCostoService';

export interface CentroCosto {
  id: string;
  nombre: string;
  tipo: string;
}

interface CentroCostoState {
  centrosCosto: CentroCosto[];
  loading: boolean;
  error: string | null;
}

const initialState: CentroCostoState = {
  centrosCosto: [],
  loading: false,
  error: null,
};

export const fetchCentrosCosto = createAsyncThunk(
  'centroCosto/fetchCentrosCosto',
  async (_, { rejectWithValue }) => {
    try {
      return await listCentrosCostoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addCentroCosto = createAsyncThunk(
  'centroCosto/addCentroCosto',
  async (data: { nombre: string; tipo: string }, { rejectWithValue }) => {
    try {
      return await addCentroCostoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCentroCosto = createAsyncThunk(
  'centroCosto/updateCentroCosto',
  async (data: { id: string; nombre?: string; tipo?: string }, { rejectWithValue }) => {
    try {
      return await updateCentroCostoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCentroCosto = createAsyncThunk(
  'centroCosto/deleteCentroCosto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCentroCostoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const centroCostoSlice = createSlice({
  name: 'centroCosto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCentrosCosto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCentrosCosto.fulfilled, (state, action: PayloadAction<CentroCosto[]>) => {
        state.loading = false;
        state.centrosCosto = action.payload;
      })
      .addCase(fetchCentrosCosto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCentroCosto.fulfilled, (state, action: PayloadAction<CentroCosto>) => {
        state.centrosCosto.push(action.payload);
      })
      .addCase(updateCentroCosto.fulfilled, (state, action: PayloadAction<CentroCosto>) => {
        const index = state.centrosCosto.findIndex(cc => cc.id === action.payload.id);
        if (index !== -1) {
          state.centrosCosto[index] = action.payload;
        }
      })
      .addCase(deleteCentroCosto.fulfilled, (state, action: PayloadAction<CentroCosto>) => {
        state.centrosCosto = state.centrosCosto.filter(cc => cc.id !== action.payload.id);
      });
  },
});

export const centroCostoReducer = centroCostoSlice.reducer;