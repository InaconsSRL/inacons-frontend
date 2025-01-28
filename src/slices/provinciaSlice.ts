import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listProvinciasService,
  getProvinciasByDepartamentoService,
  getProvinciaService,
  addProvinciaService,
  updateProvinciaService,
  deleteProvinciaService
} from '../services/provinciaService';

export interface Provincia {
  _id: string;
  id_provincia: string;
  id_departamento: string;
  nombre_provincia: string;
}

interface ProvinciaState {
  provincias: Provincia[];
  selectedProvincia: Provincia | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProvinciaState = {
  provincias: [],
  selectedProvincia: null,
  loading: false,
  error: null,
};

export const fetchProvincias = createAsyncThunk(
  'provincia/fetchProvincias',
  async (_, { rejectWithValue }) => {
    try {
      return await listProvinciasService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchProvinciasByDepartamento = createAsyncThunk(
  'provincia/fetchProvinciasByDepartamento',
  async (idDepartamento: string, { rejectWithValue }) => {
    try {
      return await getProvinciasByDepartamentoService(idDepartamento);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getProvincia = createAsyncThunk(
  'provincia/getProvincia',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProvinciaService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addProvincia = createAsyncThunk(
  'provincia/addProvincia',
  async (data: { nombreProvincia: string; idDepartamento: string }, { rejectWithValue }) => {
    try {
      return await addProvinciaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProvincia = createAsyncThunk(
  'provincia/updateProvincia',
  async (data: {
    idProvincia: string;
    nombreProvincia?: string;
    idDepartamento?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateProvinciaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProvincia = createAsyncThunk(
  'provincia/deleteProvincia',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteProvinciaService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const provinciaSlice = createSlice({
  name: 'provincia',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all provincias
      .addCase(fetchProvincias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvincias.fulfilled, (state, action: PayloadAction<Provincia[]>) => {
        state.loading = false;
        state.provincias = action.payload;
      })
      .addCase(fetchProvincias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch provincias by departamento
      .addCase(fetchProvinciasByDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinciasByDepartamento.fulfilled, (state, action: PayloadAction<Provincia[]>) => {
        state.loading = false;
        state.provincias = action.payload;
      })
      .addCase(fetchProvinciasByDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get single provincia
      .addCase(getProvincia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProvincia.fulfilled, (state, action: PayloadAction<Provincia>) => {
        state.loading = false;
        state.selectedProvincia = action.payload;
      })
      .addCase(getProvincia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add provincia
      .addCase(addProvincia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProvincia.fulfilled, (state, action: PayloadAction<Provincia>) => {
        state.loading = false;
        state.provincias.push(action.payload);
      })
      .addCase(addProvincia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update provincia
      .addCase(updateProvincia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProvincia.fulfilled, (state, action: PayloadAction<Provincia>) => {
        state.loading = false;
        const index = state.provincias.findIndex(prov => prov.id_provincia === action.payload.id_provincia);
        if (index !== -1) {
          state.provincias[index] = action.payload;
        }
      })
      .addCase(updateProvincia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete provincia
      .addCase(deleteProvincia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProvincia.fulfilled, (state, action: PayloadAction<Provincia>) => {
        state.loading = false;
        state.provincias = state.provincias.filter(prov => prov.id_provincia !== action.payload.id_provincia);
      })
      .addCase(deleteProvincia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = provinciaSlice.actions;
export const provinciaReducer = provinciaSlice.reducer;
