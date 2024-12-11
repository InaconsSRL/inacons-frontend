import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIA_RECURSOS_QUERY = gql`
  query ListTransferenciaRecursos {
    listTransferenciaRecursos {
      _id
      transferencia_detalle_id {
        id
        referencia_id
        fecha
        tipo
        referencia
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        unidad_id
        precio_actual
        vigente
        tipo_recurso_id
        tipo_costo_recurso_id
        clasificacion_recurso_id
      }
      cantidad
      costo
    }
  }
`;

const LIST_TRANSFERENCIA_RECURSOS_BY_ID_QUERY = gql`
  query ListTransferenciaRecursosById($listTransferenciaRecursosById: ID!) {
    listTransferenciaRecursosById(id: $listTransferenciaRecursosById) {
      _id
      transferencia_detalle_id {
        id
        referencia_id
        fecha
        tipo
        referencia
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        unidad_id
        precio_actual
        vigente
        tipo_recurso_id
        tipo_costo_recurso_id
        clasificacion_recurso_id
      }
      cantidad
      costo
    }
  }
`;

const ADD_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation AddTransferenciaRecurso($transferenciaDetalleId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float) {
    addTransferenciaRecurso(
      transferencia_detalle_id: $transferenciaDetalleId,
      recurso_id: $recursoId,
      cantidad: $cantidad,
      costo: $costo
    ) {
      _id
      transferencia_detalle_id {
        id
      }
      recurso_id {
        codigo
        id
        nombre
        imagenes {
          file
        }
        precio_actual
        unidad_id
      }
      cantidad
      costo
    }
  }
`;

const UPDATE_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation UpdateTransferenciaRecurso($updateTransferenciaRecursoId: ID!, $cantidad: Int, $costo: Float) {
    updateTransferenciaRecurso(id: $updateTransferenciaRecursoId, cantidad: $cantidad, costo: $costo) {
      _id
      cantidad
      costo
    }
  }
`;

const DELETE_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation DeleteTransferenciaRecurso($deleteTransferenciaRecursoId: ID!) {
    deleteTransferenciaRecurso(id: $deleteTransferenciaRecursoId) {
      _id
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

export const listTransferenciaRecursosByIdService = async (id: string) => {
  try {
    const response = await client.query({
      query: LIST_TRANSFERENCIA_RECURSOS_BY_ID_QUERY,
      variables: { listTransferenciaRecursosById: id },
    });
    return response.data.listTransferenciaRecursosById;
  } catch (error) {
    throw new Error(`Error al listar transferencia recursos por ID: ${error}`);
  }
};

export const addTransferenciaRecursoService = async (data: {
  transferencia_detalle_id: string;
  recurso_id: string;
  cantidad: number;
  costo?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TRANSFERENCIA_RECURSO_MUTATION,
      variables: {
        transferenciaDetalleId: data.transferencia_detalle_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        costo: data.costo,
      },
    });
    return response.data.addTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error al agregar transferencia recurso: ${error}`);
  }
};

export const updateTransferenciaRecursoService = async (data: {
  id: string;
  cantidad?: number;
  costo?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_RECURSO_MUTATION,
      variables: {
        updateTransferenciaRecursoId: data.id,
        cantidad: data.cantidad,
        costo: data.costo,
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