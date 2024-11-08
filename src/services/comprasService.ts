import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COMPRAS_QUERY = gql`
  query ListCompras {
    listCompras {
      id
      proveedor_id
      usuario_id
      orden_compra_id
      fecha
    }
  }
`;

const GET_COMPRA_QUERY = gql`
  query GetCompra($getCompraId: ID!) {
    getCompra(id: $getCompraId) {
      id
      proveedor_id
      usuario_id
      orden_compra_id
      fecha
    }
  }
`;

const ADD_COMPRA_MUTATION = gql`
  mutation AddCompra($proveedor_id: ID!, $usuario_id: ID!, $orden_compra_id: ID!) {
    addCompra(proveedor_id: $proveedor_id, usuario_id: $usuario_id, orden_compra_id: $orden_compra_id) {
      id
      proveedor_id
      usuario_id
      orden_compra_id
      fecha
    }
  }
`;

const UPDATE_COMPRA_MUTATION = gql`
  mutation UpdateCompra($updateCompraId: ID!, $proveedor_id: ID, $usuario_id: ID, $orden_compra_id: ID, $fecha: String) {
    updateCompra(id: $updateCompraId, proveedor_id: $proveedor_id, usuario_id: $usuario_id, orden_compra_id: $orden_compra_id, fecha: $fecha) {
      id
      proveedor_id
      usuario_id
      orden_compra_id
      fecha
    }
  }
`;

const DELETE_COMPRA_MUTATION = gql`
  mutation DeleteCompra($deleteCompraId: ID!) {
    deleteCompra(id: $deleteCompraId) {
      id
    }
  }
`;

export const listComprasService = async () => {
  try {
    const response = await client.query({
      query: LIST_COMPRAS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listCompras;
  } catch (error) {
    console.error('Error al obtener la lista de compras:', error);
    throw error;
  }
};

export const getCompraService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_COMPRA_QUERY,
      variables: { getCompraId: id }
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getCompra;
  } catch (error) {
    console.error('Error al obtener la compra:', error);
    throw error;
  }
};

export const addCompraService = async (compraData: { proveedor_id: string; usuario_id: string; orden_compra_id: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_COMPRA_MUTATION,
      variables: compraData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addCompra;
  } catch (error) {
    console.error('Error al crear la compra:', error);
    throw error;
  }
};

export const updateCompraService = async (compra: { id: string; proveedor_id?: string; usuario_id?: string; orden_compra_id?: string; fecha?: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_COMPRA_MUTATION,
      variables: { updateCompraId: compra.id, ...compra },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateCompra;
  } catch (error) {
    console.error('Error al actualizar la compra:', error);
    throw error;
  }
};

export const deleteCompraService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COMPRA_MUTATION,
      variables: { deleteCompraId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteCompra;
  } catch (error) {
    console.error('Error al eliminar la compra:', error);
    throw error;
  }
};
