import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listContactosProveedorService,
  listContactosByProveedorService,
  addContactoProveedorService,
  updateContactoProveedorService,
  deleteContactoProveedorService
} from '../services/contactoProveedorService';

interface Proveedor {
  id: string;
  razon_social: string;
  direccion: string;
  nombre_comercial: string;
  ruc: string;
  rubro: string;
  estado: string;
}

interface ContactoProveedor {
  id: string;
  proveedor_id: Proveedor;
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
}

interface ContactoProveedorState {
  contactos: ContactoProveedor[];
  selectedContacto: ContactoProveedor | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactoProveedorState = {
  contactos: [],
  selectedContacto: null,
  loading: false,
  error: null,
};

export const fetchContactosProveedor = createAsyncThunk(
  'contactoProveedor/fetchContactos',
  async (_, { rejectWithValue }) => {
    try {
      return await listContactosProveedorService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchContactosByProveedor = createAsyncThunk(
  'contactoProveedor/fetchContactosByProveedor',
  async (proveedorId: string, { rejectWithValue }) => {
    try {
      return await listContactosByProveedorService(proveedorId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addContactoProveedor = createAsyncThunk(
  'contactoProveedor/addContacto',
  async (data: { proveedor_id: string; nombres: string; apellidos: string; cargo: string; telefono: string }, { rejectWithValue }) => {
    try {
      return await addContactoProveedorService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateContactoProveedor = createAsyncThunk(
  'contactoProveedor/updateContacto',
  async (data: { id: string; proveedor_id?: string; nombres?: string; apellidos?: string; cargo?: string; telefono?: string }, { rejectWithValue }) => {
    try {
      return await updateContactoProveedorService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteContactoProveedor = createAsyncThunk(
  'contactoProveedor/deleteContacto',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteContactoProveedorService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const contactoProveedorSlice = createSlice({
  name: 'contactoProveedor',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearContactos: (state) => {
      state.contactos = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all cases
      .addCase(fetchContactosProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactosProveedor.fulfilled, (state, action: PayloadAction<ContactoProveedor[]>) => {
        state.loading = false;
        state.contactos = action.payload;
      })
      .addCase(fetchContactosProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addContactoProveedor.fulfilled, (state, action: PayloadAction<ContactoProveedor>) => {
        state.contactos.push(action.payload);
      })
      // Update cases
      .addCase(updateContactoProveedor.fulfilled, (state, action: PayloadAction<ContactoProveedor>) => {
        const index = state.contactos.findIndex(contacto => contacto.id === action.payload.id);
        if (index !== -1) {
          state.contactos[index] = action.payload;
        }
      })
      // Delete cases
      .addCase(deleteContactoProveedor.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.contactos = state.contactos.filter(contacto => contacto.id !== action.payload.id);
      });
  },
});

export const { clearErrors, clearContactos } = contactoProveedorSlice.actions;
export const contactoProveedorReducer = contactoProveedorSlice.reducer;