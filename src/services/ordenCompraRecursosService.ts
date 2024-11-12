import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ORDEN_COMPRA_RECURSOS_QUERY = gql`
  query ListOrdenCompraRecursos {
    listOrdenCompraRecursos {
      id
      orden_compra_id
      id_recurso
      costo_real
      costo_aproximado
      estado
    }
  }
`;

const ADD_ORDEN_COMPRA_RECURSO_MUTATION = gql`
  mutation AddOrdenCompraRecurso($ordenCompraId: ID!, $idRecurso: ID!, $costoReal: Float!, $costoAproximado: Float!, $estado: EstadoOrdenCompraRecurso!) {
    addOrdenCompraRecurso(orden_compra_id: $ordenCompraId, id_recurso: $idRecurso, costo_real: $costoReal, costo_aproximado: $costoAproximado, estado: $estado) {
      id
      orden_compra_id
      id_recurso
      costo_real
      costo_aproximado
      estado
    }
  }
`;

const UPDATE_ORDEN_COMPRA_RECURSO_MUTATION = gql`
  mutation UpdateOrdenCompraRecurso($updateOrdenCompraRecursoId: ID!, $ordenCompraId: ID!, $idRecurso: ID!, $costoReal: Float!, $costoAproximado: Float!, $estado: EstadoOrdenCompraRecurso!) {
    updateOrdenCompraRecurso(id: $updateOrdenCompraRecursoId, orden_compra_id: $ordenCompraId, id_recurso: $idRecurso, costo_real: $costoReal, costo_aproximado: $costoAproximado, estado: $estado) {
      id
      orden_compra_id
      id_recurso
      costo_real
      costo_aproximado
      estado
    }
  }
`;

const DELETE_ORDEN_COMPRA_RECURSO_MUTATION = gql`
  mutation DeleteOrdenCompraRecurso($deleteOrdenCompraRecursoId: ID!) {
    deleteOrdenCompraRecurso(id: $deleteOrdenCompraRecursoId) {
      id
    }
  }
`;

export const listOrdenCompraRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_ORDEN_COMPRA_RECURSOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listOrdenCompraRecursos;
  } catch (error) {
    console.error('Error al obtener la lista de recursos de orden de compra:', error);
    throw error;
  }
};

export const addOrdenCompraRecursoService = async (data: {
  orden_compra_id: string;
  id_recurso: string;
  costo_real: number;
  costo_aproximado: number;
  estado: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_ORDEN_COMPRA_RECURSO_MUTATION,
      variables: {
        ordenCompraId: data.orden_compra_id,
        idRecurso: data.id_recurso,
        costoReal: data.costo_real,
        costoAproximado: data.costo_aproximado,
        estado: data.estado,
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addOrdenCompraRecurso;
  } catch (error) {
    console.error('Error al crear el recurso de orden de compra:', error);
    throw error;
  }
};

export const updateOrdenCompraRecursoService = async (data: {
  id: string;
  orden_compra_id: string;
  id_recurso: string;
  costo_real: number;
  costo_aproximado: number;
  estado: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ORDEN_COMPRA_RECURSO_MUTATION,
      variables: {
        updateOrdenCompraRecursoId: data.id,
        ordenCompraId: data.orden_compra_id,
        idRecurso: data.id_recurso,
        costoReal: data.costo_real,
        costoAproximado: data.costo_aproximado,
        estado: data.estado,
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateOrdenCompraRecurso;
  } catch (error) {
    console.error('Error al actualizar el recurso de orden de compra:', error);
    throw error;
  }
};

export const deleteOrdenCompraRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_ORDEN_COMPRA_RECURSO_MUTATION,
      variables: { deleteOrdenCompraRecursoId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteOrdenCompraRecurso;
  } catch (error) {
    console.error('Error al eliminar el recurso de orden de compra:', error);
    throw error;
  }
};
