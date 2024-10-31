import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listRecursosService, addRecursoService, updateRecursoService, listDataService, deleteImagenRecursoService, uploadImagenRecursoService } from '../services/recursoService';


// Interfaces
interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;  
  tipo_costo_recurso_id: string;
  vigente: boolean;
  imagenes: { id: string; file: string }[];
}

interface RecursoAdd {
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad_id: string;
  precio_actual: number,  
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
  tipo_costo_recurso_id: string;
  vigente: boolean;
  imagenes: { id: string; file: string }[];
}

interface RecursoUpdate {
  id: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  unidad_id?: string;
  precio_actual?: number,  
  tipo_recurso_id?: string;
  clasificacion_recurso_id?: string;
  tipo_costo_recurso_id?: string;
  vigente: boolean;
  imagenes?: { id: string; file: string }[];
}

interface ListDataQueryResult {
  listTipoRecurso: Array<{
    id: string;
    nombre: string;
  }>;
  listUnidad: Array<{
    id: string;
    nombre: string;
  }>;
  listClasificacionRecurso: Array<{
    id: string;
    nombre: string;
    parent_id: string | null;
    childs: Array<{
      nombre: string;
      id: string;
      parent_id: string;
    }>;
  }>;
  listTipoCostoRecurso: Array<{
    id: string;
    nombre: string;
  }>;
}

interface RecursoState {
  recursos: Recurso[];
  listData: ListDataQueryResult | null;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: RecursoState = {
  recursos: [],
  listData: null,
  loading: false,
  error: null,
};

// Interfaces Upload Image
interface ImagenRecursoResponse {
  id: string;
  file: string;
  recurso_id: string; 
  fecha: string;
}

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchRecursos = createAsyncThunk(
  'recurso/fetchRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listRecursosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchListData = createAsyncThunk(
  'recurso/fetchListData',
  async (_, { rejectWithValue }) => {
    try {
      return await listDataService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addRecurso = createAsyncThunk(
  'recurso/addRecurso',
  async (recursoData: Omit<RecursoAdd, 'id' | 'fecha'>, { rejectWithValue }) => {
    try {
      return await addRecursoService(recursoData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateRecurso = createAsyncThunk(
  'recurso/updateRecurso',
  async (recursoData: RecursoUpdate, { rejectWithValue }) => {
    try {
      console.log("Se envio", recursoData)
      const response = await updateRecursoService(recursoData);
      console.log("Se recibio", response)
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteImagenRecurso = createAsyncThunk(
  'recurso/deleteImagenRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteImagenRecursoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const uploadImagenRecurso = createAsyncThunk(
  'recurso/uploadImagenRecurso',
  async ({ recursoId, file }: { recursoId: string, file: File }, { rejectWithValue }) => {
    try {
      return await uploadImagenRecursoService(recursoId, file);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


// Slice
const recursoSlice = createSlice({
  name: 'recurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecursos.fulfilled, (state, action: PayloadAction<Recurso[]>) => {
        state.loading = false;
        state.recursos = action.payload;
      })
      .addCase(fetchRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchListData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListData.fulfilled, (state, action: PayloadAction<ListDataQueryResult>) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(fetchListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRecurso.fulfilled, (state, action: PayloadAction<Recurso>) => {
        state.recursos.push(action.payload);
      })
      .addCase(updateRecurso.fulfilled, (state, action: PayloadAction<Recurso>) => {
        const index = state.recursos.findIndex(recurso => recurso.id === action.payload.id);
        if (index !== -1) {
          state.recursos[index] = action.payload;
        }
      })
      .addCase(deleteImagenRecurso.fulfilled, (state, action: PayloadAction<{ id: string, recurso_id: string }>) => {
        console.log(action.payload);
        const recursoIndex = state.recursos.findIndex(recurso => recurso.id === action.payload.recurso_id);
        if (recursoIndex !== -1) {
          state.recursos[recursoIndex].imagenes = state.recursos[recursoIndex].imagenes.filter(
            imagen => imagen.id !== action.payload.id
          );
        }
      })
      .addCase(uploadImagenRecurso.fulfilled, (state, action: PayloadAction<ImagenRecursoResponse>) => {
        // Buscar el recurso usando el recurso_id de la respuesta
        const recurso = state.recursos.find(r => r.id === action.payload.recurso_id);
        if (recurso) {
          // Añadir solo id y file a imagenes (para mantener consistencia con la estructura)
          const newImage = {
            id: action.payload.id,
            file: action.payload.file
          };
          recurso.imagenes = Array.isArray(recurso.imagenes) 
            ? [...recurso.imagenes, newImage]
            : [newImage];
        }
      });
  },
});

export const recursoReducer = recursoSlice.reducer;