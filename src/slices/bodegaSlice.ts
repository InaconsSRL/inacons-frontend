
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listBodegasService, 
  addBodegaService, 
  updateBodegaService, 
  deleteBodegaService 
} from '../services/bodegaService';

interface Bodega {
  id: string;
  codigo: string;
  descripcion: string;
}

interface BodegaState {
  bodegas: Bodega[];
  loading: boolean;
  error: string | null;
}

const initialState: BodegaState = {
  bodegas: [],
  loading: false,
  error: null,
};

export const fetchBodegas = createAsyncThunk(
  'bodega/fetchBodegas',
  async () => {
    return await listBodegasService();
  }
);

export const addBodega = createAsyncThunk(
  'bodega/addBodega',
  async (bodegaData: { codigo: string; descripcion: string }) => {
    return await addBodegaService(bodegaData);
  }
);

export const updateBodega = createAsyncThunk(
  'bodega/updateBodega',
  async ({ id, data }: { id: string; data: { codigo?: string; descripcion?: string } }) => {
    return await updateBodegaService(id, data);
  }
);

export const deleteBodega = createAsyncThunk(
  'bodega/deleteBodega',
  async (id: string) => {
    await deleteBodegaService(id);
    return id;
  }
);

const bodegaSlice = createSlice({
  name: 'bodega',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBodegas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBodegas.fulfilled, (state, action: PayloadAction<Bodega[]>) => {
        state.loading = false;
        state.bodegas = action.payload;
      })
      .addCase(fetchBodegas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar bodegas';
      })
      .addCase(addBodega.fulfilled, (state, action: PayloadAction<Bodega>) => {
        state.bodegas.push(action.payload);
      })
      .addCase(updateBodega.fulfilled, (state, action: PayloadAction<Bodega>) => {
        const index = state.bodegas.findIndex(bodega => bodega.id === action.payload.id);
        if (index !== -1) {
          state.bodegas[index] = action.payload;
        }
      })
      .addCase(deleteBodega.fulfilled, (state, action: PayloadAction<string>) => {
        state.bodegas = state.bodegas.filter(bodega => bodega.id !== action.payload);
      });
  },
});

export const bodegaReducer = bodegaSlice.reducer;