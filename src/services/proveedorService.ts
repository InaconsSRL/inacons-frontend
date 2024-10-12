import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PROVEEDOR_QUERY = gql`
  query ListProveedores {
    listProveedor {
      id
      razon_social
      ruc
    }
  }
`;

const ADD_PROVEEDOR_MUTATION = gql`
  mutation AddProveedor($razon_social: String!, $ruc: String!) {
    addProveedor(razon_social: $razon_social, ruc: $ruc) {
      id
      razon_social
      ruc
    }
  }
`;

const UPDATE_PROVEEDOR_MUTATION = gql`
  mutation UpdateProveedor($updateProveedorId: ID!, $razon_social: String, $ruc: String) {
    updateProveedor(id: $updateProveedorId, razon_social: $razon_social, ruc: $ruc) {
      id
      razon_social
      ruc
    }
  }
`;

export const listProveedoresService = async () => {
  try {
    const response = await client.query({
      query: LIST_PROVEEDOR_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.listProveedor;
  } catch (error) {
    console.error('Error al obtener la lista de proveedores:', error);
    throw error;
  }
};

export const addProveedorService = async (proveedorData: { razon_social: string; ruc: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PROVEEDOR_MUTATION,
      variables: proveedorData,
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

export const updateProveedorService = async (proveedor: { id: string; razon_social: string; ruc: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_PROVEEDOR_MUTATION,
      variables: { updateProveedorId: proveedor.id, ...proveedor },
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