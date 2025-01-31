import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listEmpresasService,
  getEmpresaService,
  addEmpresaService,
  updateEmpresaService,
  deleteEmpresaService
} from '../services/empresaService';

export interface Empresa {
  id: string;
  nombre_comercial: string;
  razon_social: string;
  descripcion?: string;
  estado: string;
  regimen_fiscal: string;
  ruc: string;
}

interface EmpresaState {
  empresas: Empresa[];
  selectedEmpresa: Empresa | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmpresaState = {
  empresas: [],
  selectedEmpresa: null,
  loading: false,
  error: null,
};

export const fetchEmpresas = createAsyncThunk(
  'empresa/fetchEmpresas',
  async (_, { rejectWithValue }) => {
    try {
      return await listEmpresasService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getEmpresa = createAsyncThunk(
  'empresa/getEmpresa',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getEmpresaService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addEmpresa = createAsyncThunk(
  'empresa/addEmpresa',
  async (data: {
    nombre_comercial: string;
    razon_social: string;
    estado: string;
    regimen_fiscal: string;
    ruc: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await addEmpresaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateEmpresa = createAsyncThunk(
  'empresa/updateEmpresa',
  async (data: {
    updateEmpresaId: string;
    nombre_comercial?: string;
    razon_social?: string;
    estado?: string;
    regimen_fiscal?: string;
    ruc?: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateEmpresaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteEmpresa = createAsyncThunk(
  'empresa/deleteEmpresa',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteEmpresaService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const empresaSlice = createSlice({
  name: 'empresa',
  initialState,
  reducers: {
    setEmpresas: (state, action: PayloadAction<Empresa[]>) => {
      state.empresas = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpresas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresas.fulfilled, (state, action: PayloadAction<Empresa[]>) => {
        state.loading = false;
        state.empresas = action.payload;
      })
      .addCase(fetchEmpresas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmpresa.fulfilled, (state, action: PayloadAction<Empresa>) => {
        state.loading = false;
        state.selectedEmpresa = action.payload;
      })
      .addCase(getEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmpresa.fulfilled, (state, action: PayloadAction<Empresa>) => {
        state.loading = false;
        state.empresas.push(action.payload);
      })
      .addCase(addEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmpresa.fulfilled, (state, action: PayloadAction<Empresa>) => {
        state.loading = false;
        const index = state.empresas.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.empresas[index] = action.payload;
        }
      })
      .addCase(updateEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmpresa.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.empresas = state.empresas.filter(emp => emp.id !== action.payload.id);
      })
      .addCase(deleteEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEmpresas, clearErrors } = empresaSlice.actions;
export const empresaReducer = empresaSlice.reducer;
