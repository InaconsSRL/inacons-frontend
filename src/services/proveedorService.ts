import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PROVEEDOR_QUERY = gql`
  query ListProveedor {
    listProveedor {
      id
      razon_social
      direccion
      nombre_comercial
      ruc
      rubro
      estado
      contactos {
        nombres
        apellidos
        cargo
        telefono
        id
      }
      mediosPago {
        id
        cuenta_bcp
        cuenta_bbva
        yape
      }
    }
  }
`;

const ADD_PROVEEDOR_MUTATION = gql`
 mutation AddProveedor($razon_social: String!, $ruc: String!, $direccion: String, $nombre_comercial: String, $rubro: String, $estado: String) {
  addProveedor(razon_social: $razon_social, ruc: $ruc, direccion: $direccion, nombre_comercial: $nombre_comercial, rubro: $rubro, estado: $estado) {
    id
      razon_social
      direccion
      nombre_comercial
      ruc
      rubro
      estado
    }
  }
`;

const UPDATE_PROVEEDOR_MUTATION = gql`
  mutation UpdateProveedor($updateProveedorId: ID!, $razon_social: String, $ruc: String, $direccion: String, $nombre_comercial: String, $rubro: String, $estado: String) {
    updateProveedor(id: $updateProveedorId, razon_social: $razon_social, ruc: $ruc, direccion: $direccion, nombre_comercial: $nombre_comercial, rubro: $rubro, estado: $estado) {
      id
      razon_social
      direccion
      nombre_comercial
      ruc
      rubro
      estado
    }
  }
`;

const CONSULTAR_RUC_QUERY = gql`
  query ConsultarRuc($numeroDocumento: String!) {
    consultarRuc(numeroDocumento: $numeroDocumento) {
      result {
        numeroDocumento
        razonSocial
        direccion
      }
    }
  }
`;

const GET_PROVEEDOR_QUERY = gql`
  query GetProveedor($updateProveedorId: ID!) {
    getProveedor(id: $updateProveedorId) {
      id
      razon_social
      direccion
      nombre_comercial
      ruc
      rubro
      estado
      contactos {
        nombres
        apellidos
        cargo
        telefono
        id
      }
      mediosPago {
        id
        cuenta_bcp
        cuenta_bbva
        yape
      }
    }
  }
`;

// ...existing code...

export const listProveedoresService = async () => {
  try {
    const response = await client.query({
      query: LIST_PROVEEDOR_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.listProveedor; // Retornamos directamente el array de proveedores
  } catch (error) {
    console.error('Error al obtener la lista de proveedores:', error);
    throw error;
  }
};

// ...existing code...

export const addProveedorService = async (proveedorData: {
  razon_social: string;
  ruc: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PROVEEDOR_MUTATION,
      variables: { input: proveedorData },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addProveedor;
  } catch (error) {
    console.error('Error al crear el proveedor:', error);
    throw error;
  }
};

export const updateProveedorService = async (proveedor: {
  id: string;
  razon_social?: string;
  ruc?: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
}) => {
  const { id, ...updateData } = proveedor;
  try {
    const response = await client.mutate({
      mutation: UPDATE_PROVEEDOR_MUTATION,
      variables: { 
        updateProveedorId: id,
        ...updateData
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateProveedor;
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    throw error;
  }
};

export const consultarRucService = async (numeroDocumento: string) => {
  try {
    const response = await client.query({
      query: CONSULTAR_RUC_QUERY,
      variables: { numeroDocumento },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.consultarRuc.result;
  } catch (error) {
    console.error('Error al consultar RUC:', error);
    throw error;
  }
};

export const getProveedorByIdService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_PROVEEDOR_QUERY,
      variables: { updateProveedorId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getProveedorId;
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    throw error;
  }
};