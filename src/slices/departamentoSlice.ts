import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listDepartamentosService,
  getDepartamentoService,
  addDepartamentoService,
  updateDepartamentoService,
  deleteDepartamentoService
} from '../services/departamentoService';

export interface Departamento {
  id_departamento: string;
  nombre_departamento: string;
  ubigeo: string;
}

interface DepartamentoState {
  departamentos: Departamento[];
  selectedDepartamento: Departamento | null;
  loading: boolean;
  error: string | null;
}

const initialState: DepartamentoState = {
  departamentos: [],
  selectedDepartamento: null,
  loading: false,
  error: null,
};

export const fetchDepartamentos = createAsyncThunk(
  'departamento/fetchDepartamentos',
  async (_, { rejectWithValue }) => {
    try {
      return await listDepartamentosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getDepartamento = createAsyncThunk(
  'departamento/getDepartamento',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getDepartamentoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addDepartamento = createAsyncThunk(
  'departamento/addDepartamento',
  async (data: { nombreDepartamento: string; ubigeo: string }, { rejectWithValue }) => {
    try {
      return await addDepartamentoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDepartamento = createAsyncThunk(
  'departamento/updateDepartamento',
  async (data: {
    idDepartamento: string;
    nombreDepartamento?: string;
    ubigeo?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateDepartamentoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDepartamento = createAsyncThunk(
  'departamento/deleteDepartamento',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteDepartamentoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const departamentoSlice = createSlice({
  name: 'departamento',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartamentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartamentos.fulfilled, (state, action: PayloadAction<Departamento[]>) => {
        state.loading = false;
        state.departamentos = action.payload;
      })
      .addCase(fetchDepartamentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartamento.fulfilled, (state, action: PayloadAction<Departamento>) => {
        state.loading = false;
        state.selectedDepartamento = action.payload;
      })
      .addCase(getDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDepartamento.fulfilled, (state, action: PayloadAction<Departamento>) => {
        state.loading = false;
        state.departamentos.push(action.payload);
      })
      .addCase(addDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartamento.fulfilled, (state, action: PayloadAction<Departamento>) => {
        state.loading = false;
        const index = state.departamentos.findIndex(dep => dep.id_departamento === action.payload.id_departamento);
        if (index !== -1) {
          state.departamentos[index] = action.payload;
        }
      })
      .addCase(updateDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDepartamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartamento.fulfilled, (state, action: PayloadAction<Departamento>) => {
        state.loading = false;
        state.departamentos = state.departamentos.filter(dep => dep.id_departamento !== action.payload.id_departamento);
      })
      .addCase(deleteDepartamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = departamentoSlice.actions;
export const departamentoReducer = departamentoSlice.reducer;
