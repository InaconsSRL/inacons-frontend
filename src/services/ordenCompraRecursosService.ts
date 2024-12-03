import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ORDEN_COMPRA_RECURSOS_QUERY = gql`
  query ListOrdenCompraRecursos {
    listOrdenCompraRecursos {
      id
    orden_compra_id {
      id
    }
    id_recurso {
      id
    }
    costo_real
    costo_aproximado
    estado
    cantidad
  }
}
`;

const ADD_ORDEN_COMPRA_RECURSO_MUTATION = gql`
  mutation AddOrdenCompraRecurso($ordenCompraId: ID!, $idRecurso: ID!, $costoReal: Float!, $cantidad:Int!, $costoAproximado: Float!, $estado: EstadoOrdenCompraRecurso!) {
    addOrdenCompraRecurso(orden_compra_id: $ordenCompraId, id_recurso: $idRecurso, cantidad:$cantidad, costo_real: $costoReal, costo_aproximado: $costoAproximado, estado: $estado) {
      id
    orden_compra_id {
      id
    }
    id_recurso {
      id
    }
    costo_real
    costo_aproximado
    estado
    cantidad
  }
}
`;

const UPDATE_ORDEN_COMPRA_RECURSO_MUTATION = gql`
  mutation UpdateOrdenCompraRecurso($updateOrdenCompraRecursoId: ID!, $ordenCompraId: ID!, $cantidad:Int!, $idRecurso: ID!, $costoReal: Float!, $costoAproximado: Float!, $estado: EstadoOrdenCompraRecurso!) {
    updateOrdenCompraRecurso(id: $updateOrdenCompraRecursoId, cantidad:$cantidad, orden_compra_id: $ordenCompraId, id_recurso: $idRecurso, costo_real: $costoReal, costo_aproximado: $costoAproximado, estado: $estado) {
      id
    orden_compra_id {
      id
    }
    id_recurso {
      id
    }
    costo_real
    costo_aproximado
    estado
    cantidad
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

const GET_ORDEN_COMPRA_RECURSOS_BY_ORDEN_ID = gql`
  query GetOrdenCompraRecursoforOrdenId($getOrdenCompraRecursoforOrdenIdId: ID!) {
    getOrdenCompraRecursoforOrdenId(id: $getOrdenCompraRecursoforOrdenIdId) {
      id
      orden_compra_id {
        id
      }
      id_recurso {
        id
        nombre
        codigo
        imagenes {
          file
        }
        precio_actual
        unidad_id
      }
      costo_real
      costo_aproximado
      estado
      cantidad
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
  cantidad: number;
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
        cantidad: data.cantidad,
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
  cantidad: number;
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
        cantidad: data.cantidad,
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

export const getOrdenCompraRecursosByOrdenIdService = async (ordenId: string) => {
  try {
    const response = await client.query({
      query: GET_ORDEN_COMPRA_RECURSOS_BY_ORDEN_ID,
      variables: { getOrdenCompraRecursoforOrdenIdId: ordenId },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getOrdenCompraRecursoforOrdenId;
  } catch (error) {
    console.error('Error al obtener recursos por ID de orden de compra:', error);
    throw error;
  }
};
