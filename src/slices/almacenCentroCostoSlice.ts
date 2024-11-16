
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  listAlmacenCentroCostos,
  listAlmacenCentroCostosByAlmacenId,
  listAlmacenCentroCostosByCentroCostoId,
  updateAlmacenCentroCosto,
  deleteAlmacenCentroCosto
} from '../services/almacenCentroCostoService';

interface AlmacenCentroCosto {
  id: string;
  centro_costo_id: string;
  almacen_id: string;
  merma: number;
  depreciacion: number;
  otros: number;
}

interface AlmacenCentroCostoState {
  almacenCentroCostos: AlmacenCentroCosto[];
  loading: boolean;
  error: string | null;
}

const initialState: AlmacenCentroCostoState = {
  almacenCentroCostos: [],
  loading: false,
  error: null,
};

export const fetchAlmacenCentroCostos = createAsyncThunk(
  'almacenCentroCosto/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listAlmacenCentroCostos();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchByAlmacenId = createAsyncThunk(
  'almacenCentroCosto/fetchByAlmacenId',
  async (almacenId: string, { rejectWithValue }) => {
    try {
      return await listAlmacenCentroCostosByAlmacenId(almacenId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchByCentroCostoId = createAsyncThunk(
  'almacenCentroCosto/fetchByCentroCostoId',
  async (centroCostoId: string, { rejectWithValue }) => {
    try {
      return await listAlmacenCentroCostosByCentroCostoId(centroCostoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAlmacenCentroCostoThunk = createAsyncThunk(
  'almacenCentroCosto/update',
  async (data: AlmacenCentroCosto, { rejectWithValue }) => {
    try {
      return await updateAlmacenCentroCosto(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAlmacenCentroCostoThunk = createAsyncThunk(
  'almacenCentroCosto/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteAlmacenCentroCosto(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const almacenCentroCostoSlice = createSlice({
  name: 'almacenCentroCosto',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlmacenCentroCostos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlmacenCentroCostos.fulfilled, (state, action) => {
        state.loading = false;
        state.almacenCentroCostos = action.payload;
      })
      .addCase(fetchAlmacenCentroCostos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ... similar patterns for other async thunks ...
      .addCase(deleteAlmacenCentroCostoThunk.fulfilled, (state, action) => {
        state.almacenCentroCostos = state.almacenCentroCostos.filter(
          (item) => item.id !== action.payload.id
        );
      });
  },
});

export const { clearErrors } = almacenCentroCostoSlice.actions;
export const almacenCentroCostoReducer = almacenCentroCostoSlice.reducer;