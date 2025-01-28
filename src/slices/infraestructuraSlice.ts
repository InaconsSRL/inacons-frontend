import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listInfraestructurasService,
  getInfraestructuraService,
  addInfraestructuraService,
  updateInfraestructuraService,
  deleteInfraestructuraService
} from '../services/infraestructuraService';

export interface Infraestructura {
  id_infraestructura: string;
  nombre_infraestructura: string;
  tipo_infraestructura: string;
  descripcion: string;
}

interface InfraestructuraState {
  infraestructuras: Infraestructura[];
  selectedInfraestructura: Infraestructura | null;
  loading: boolean;
  error: string | null;
}

const initialState: InfraestructuraState = {
  infraestructuras: [],
  selectedInfraestructura: null,
  loading: false,
  error: null,
};

export const fetchInfraestructuras = createAsyncThunk(
  'infraestructura/fetchInfraestructuras',
  async (_, { rejectWithValue }) => {
    try {
      return await listInfraestructurasService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getInfraestructura = createAsyncThunk(
  'infraestructura/getInfraestructura',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getInfraestructuraService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addInfraestructura = createAsyncThunk(
  'infraestructura/addInfraestructura',
  async (data: Omit<Infraestructura, 'id_infraestructura'>, { rejectWithValue }) => {
    try {
      return await addInfraestructuraService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateInfraestructura = createAsyncThunk(
  'infraestructura/updateInfraestructura',
  async (data: Partial<Infraestructura> & { idInfraestructura: string }, { rejectWithValue }) => {
    try {
      return await updateInfraestructuraService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteInfraestructura = createAsyncThunk(
  'infraestructura/deleteInfraestructura',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteInfraestructuraService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const infraestructuraSlice = createSlice({
  name: 'infraestructura',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Infraestructuras
      .addCase(fetchInfraestructuras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfraestructuras.fulfilled, (state, action: PayloadAction<Infraestructura[]>) => {
        state.loading = false;
        state.infraestructuras = action.payload;
      })
      .addCase(fetchInfraestructuras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Infraestructura
      .addCase(getInfraestructura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfraestructura.fulfilled, (state, action: PayloadAction<Infraestructura>) => {
        state.loading = false;
        state.selectedInfraestructura = action.payload;
      })
      .addCase(getInfraestructura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Infraestructura
      .addCase(addInfraestructura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInfraestructura.fulfilled, (state, action: PayloadAction<Infraestructura>) => {
        state.loading = false;
        state.infraestructuras.push(action.payload);
      })
      .addCase(addInfraestructura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Infraestructura
      .addCase(updateInfraestructura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInfraestructura.fulfilled, (state, action: PayloadAction<Infraestructura>) => {
        state.loading = false;
        const index = state.infraestructuras.findIndex(i => i.id_infraestructura === action.payload.id_infraestructura);
        if (index !== -1) {
          state.infraestructuras[index] = action.payload;
        }
      })
      .addCase(updateInfraestructura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Infraestructura
      .addCase(deleteInfraestructura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInfraestructura.fulfilled, (state, action: PayloadAction<{ id_infraestructura: string }>) => {
        state.loading = false;
        state.infraestructuras = state.infraestructuras.filter(i => i.id_infraestructura !== action.payload.id_infraestructura);
      })
      .addCase(deleteInfraestructura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = infraestructuraSlice.actions;
export default infraestructuraSlice.reducer;
