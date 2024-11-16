
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIA_RECURSOS_QUERY = gql`
  query ListTransferenciaRecursos {
    listTransferenciaRecursos {
      id
      transferencia_detalle_id
      recurso_id
      cantidad
    }
  }
`;

const LIST_TRANSFERENCIA_RECURSOS_BY_DETALLE_QUERY = gql`
  query ListTransferenciaRecursosByTransferenciaDetalle($listTransferenciaRecursosByTransferenciaDetalleId: ID!) {
    listTransferenciaRecursosByTransferenciaDetalle(id: $listTransferenciaRecursosByTransferenciaDetalleId) {
      id
      transferencia_detalle_id
      recurso_id
      cantidad
    }
  }
`;

const ADD_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation AddTransferenciaRecurso($transferenciaDetalleId: ID!, $recursoId: ID!, $cantidad: Int!) {
    addTransferenciaRecurso(transferencia_detalle_id: $transferenciaDetalleId, recurso_id: $recursoId, cantidad: $cantidad) {
      id
      transferencia_detalle_id
      recurso_id
      cantidad
    }
  }
`;

const UPDATE_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation UpdateTransferenciaRecurso($updateTransferenciaRecursoId: ID!, $cantidad: Int, $recursoId: ID, $transferenciaDetalleId: ID) {
    updateTransferenciaRecurso(id: $updateTransferenciaRecursoId, cantidad: $cantidad, recurso_id: $recursoId, transferencia_detalle_id: $transferenciaDetalleId) {
      id
      transferencia_detalle_id
      recurso_id
      cantidad
    }
  }
`;

const DELETE_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation DeleteTransferenciaRecurso($deleteTransferenciaRecursoId: ID!) {
    deleteTransferenciaRecurso(id: $deleteTransferenciaRecursoId) {
      id
      transferencia_detalle_id
      recurso_id
      cantidad
    }
  }
`;

export const listTransferenciaRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_TRANSFERENCIA_RECURSOS_QUERY,
    });
    return response.data.listTransferenciaRecursos;
  } catch (error) {
    throw new Error(`Error al listar transferencia recursos: ${error}`);
  }
};

export const listTransferenciaRecursosByDetalleService = async (id: string) => {
  try {
    const response = await client.query({
      query: LIST_TRANSFERENCIA_RECURSOS_BY_DETALLE_QUERY,
      variables: { listTransferenciaRecursosByTransferenciaDetalleId: id },
    });
    return response.data.listTransferenciaRecursosByTransferenciaDetalle;
  } catch (error) {
    throw new Error(`Error al listar transferencia recursos por detalle: ${error}`);
  }
};

export const addTransferenciaRecursoService = async (data: { transferencia_detalle_id: string; recurso_id: string; cantidad: number }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TRANSFERENCIA_RECURSO_MUTATION,
      variables: {
        transferenciaDetalleId: data.transferencia_detalle_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
      },
    });
    return response.data.addTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error al agregar transferencia recurso: ${error}`);
  }
};

export const updateTransferenciaRecursoService = async (data: { id: string; cantidad?: number; recurso_id?: string; transferencia_detalle_id?: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_RECURSO_MUTATION,
      variables: {
        updateTransferenciaRecursoId: data.id,
        cantidad: data.cantidad,
        recursoId: data.recurso_id,
        transferenciaDetalleId: data.transferencia_detalle_id,
      },
    });
    return response.data.updateTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error al actualizar transferencia recurso: ${error}`);
  }
};

export const deleteTransferenciaRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_TRANSFERENCIA_RECURSO_MUTATION,
      variables: { deleteTransferenciaRecursoId: id },
    });
    return response.data.deleteTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error al eliminar transferencia recurso: ${error}`);
  }
};