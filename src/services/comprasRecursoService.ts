import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COMPRAS_RECURSOS_QUERY = gql`
  query ListComprasRecursos {
    listComprasRecursos {
      id
      compra_id
      recurso_id
      cantidad
      costo
      fecha
    }
  }
`;

const GET_COMPRA_RECURSO_QUERY = gql`
  query GetCompraRecurso($getCompraRecursoId: ID!) {
    getCompraRecurso(id: $getCompraRecursoId) {
      id
      compra_id
      recurso_id
      cantidad
      costo
      fecha
    }
  }
`;

const ADD_COMPRA_RECURSO_MUTATION = gql`
  mutation AddCompraRecurso($compraId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float!, $fecha: String) {
    addCompraRecurso(compra_id: $compraId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, fecha: $fecha) {
      id
      compra_id
      recurso_id
      cantidad
      costo
      fecha
    }
  }
`;

const UPDATE_COMPRA_RECURSO_MUTATION = gql`
  mutation UpdateCompraRecurso($updateCompraRecursoId: ID!, $compraId: ID, $recursoId: ID, $cantidad: Int, $costo: Float, $fecha: String) {
    updateCompraRecurso(id: $updateCompraRecursoId, compra_id: $compraId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, fecha: $fecha) {
      id
      compra_id
      recurso_id
      cantidad
      costo
      fecha
    }
  }
`;

const DELETE_COMPRA_RECURSO_MUTATION = gql`
  mutation DeleteCompraRecurso($deleteCompraRecursoId: ID!) {
    deleteCompraRecurso(id: $deleteCompraRecursoId) {
      id
    }
  }
`;

const LIST_COMPRAS_RECURSOS_BY_RECURSO_ID_QUERY = gql`
  query ListComprasRecursosByRecursoId($recursoId: ID!) {
    listComprasRecursosByRecursoId(recursoId: $recursoId) {
      id
      recurso_id
      cantidad
      costo
      fecha
      detalles_compra {
        proveedor_id
        usuario_id
      }
      detalles_proveedor {
        razon_social
      }
      detalles_usuario {
        nombres
        apellidos
      }
    }
  }
`;

export const listComprasRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_COMPRAS_RECURSOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listComprasRecursos;
  } catch (error) {
    console.error('Error al obtener la lista de compras recursos:', error);
    throw error;
  }
};

export const getCompraRecursoService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_COMPRA_RECURSO_QUERY,
      variables: { getCompraRecursoId: id }
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getCompraRecurso;
  } catch (error) {
    console.error('Error al obtener la compra recurso:', error);
    throw error;
  }
};

export const addCompraRecursoService = async (compraRecursoData: { compraId: string; recursoId: string; cantidad: number; costo: number; fecha?: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_COMPRA_RECURSO_MUTATION,
      variables: compraRecursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addCompraRecurso;
  } catch (error) {
    console.error('Error al crear la compra recurso:', error);
    throw error;
  }
};

export const updateCompraRecursoService = async (compraRecurso: { id: string; compraId?: string; recursoId?: string; cantidad?: number; costo?: number; fecha?: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_COMPRA_RECURSO_MUTATION,
      variables: { updateCompraRecursoId: compraRecurso.id, ...compraRecurso },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateCompraRecurso;
  } catch (error) {
    console.error('Error al actualizar la compra recurso:', error);
    throw error;
  }
};

export const deleteCompraRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COMPRA_RECURSO_MUTATION,
      variables: { deleteCompraRecursoId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteCompraRecurso;
  } catch (error) {
    console.error('Error al eliminar la compra recurso:', error);
    throw error;
  }
};

export const listComprasRecursosByRecursoIdService = async (recursoId: string) => {
  try {
    const response = await client.query({
      query: LIST_COMPRAS_RECURSOS_BY_RECURSO_ID_QUERY,
      variables: { recursoId }
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listComprasRecursosByRecursoId;
  } catch (error) {
    console.error('Error al obtener las compras recursos por recurso:', error);
    throw error;
  }
};
