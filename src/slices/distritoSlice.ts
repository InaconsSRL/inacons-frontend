import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listDistritosService,
  getDistritoService,
  getDistritosByProvinciaService,
  addDistritoService,
  updateDistritoService,
  deleteDistritoService
} from '../services/distritoService';

export interface Distrito {
  id_distrito: string;
  id_provincia: string;
  nombre_distrito: string;
}

interface DistritoState {
  distritos: Distrito[];
  selectedDistrito: Distrito | null;
  loading: boolean;
  error: string | null;
}

const initialState: DistritoState = {
  distritos: [],
  selectedDistrito: null,
  loading: false,
  error: null,
};

export const fetchDistritos = createAsyncThunk(
  'distrito/fetchDistritos',
  async (_, { rejectWithValue }) => {
    try {
      return await listDistritosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getDistritosByProvincia = createAsyncThunk(
  'distrito/getDistritosByProvincia',
  async (idProvincia: string, { rejectWithValue }) => {
    try {
      return await getDistritosByProvinciaService(idProvincia);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getDistrito = createAsyncThunk(
  'distrito/getDistrito',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getDistritoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addDistrito = createAsyncThunk(
  'distrito/addDistrito',
  async (data: { nombreDistrito: string; idProvincia: string }, { rejectWithValue }) => {
    try {
      return await addDistritoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDistrito = createAsyncThunk(
  'distrito/updateDistrito',
  async (data: { idDistrito: string; idProvincia?: string; nombreDistrito?: string }, { rejectWithValue }) => {
    try {
      return await updateDistritoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDistrito = createAsyncThunk(
  'distrito/deleteDistrito',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteDistritoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const distritoSlice = createSlice({
  name: 'distrito',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistritos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistritos.fulfilled, (state, action: PayloadAction<Distrito[]>) => {
        state.loading = false;
        state.distritos = action.payload;
      })
      .addCase(fetchDistritos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDistritosByProvincia.fulfilled, (state, action: PayloadAction<Distrito[]>) => {
        state.loading = false;
        state.distritos = action.payload;
      })
      .addCase(getDistrito.fulfilled, (state, action: PayloadAction<Distrito>) => {
        state.loading = false;
        state.selectedDistrito = action.payload;
      })
      .addCase(addDistrito.fulfilled, (state, action: PayloadAction<Distrito>) => {
        state.loading = false;
        state.distritos.push(action.payload);
      })
      .addCase(updateDistrito.fulfilled, (state, action: PayloadAction<Distrito>) => {
        state.loading = false;
        const index = state.distritos.findIndex(dist => dist.id_distrito === action.payload.id_distrito);
        if (index !== -1) {
          state.distritos[index] = action.payload;
        }
      })
      .addCase(deleteDistrito.fulfilled, (state, action: PayloadAction<{ id_distrito: string }>) => {
        state.loading = false;
        state.distritos = state.distritos.filter(dist => dist.id_distrito !== action.payload.id_distrito);
      });
  },
});

export const { clearErrors } = distritoSlice.actions;
export const distritoReducer = distritoSlice.reducer;
