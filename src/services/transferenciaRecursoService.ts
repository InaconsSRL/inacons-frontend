import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIA_RECURSOS = gql`
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

const LIST_TRANSFERENCIA_RECURSOS_BY_ID = gql`
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
        imagenes {
          file
        }
      }
      cantidad
      costo
      diferencia
    }
  }
`;

const ADD_TRANSFERENCIA_RECURSO = gql`
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

const UPDATE_TRANSFERENCIA_RECURSO = gql`
  mutation UpdateTransferenciaRecurso($updateTransferenciaRecursoId: ID!, $cantidad: Int, $costo: Float) {
    updateTransferenciaRecurso(id: $updateTransferenciaRecursoId, cantidad: $cantidad, costo: $costo) {
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

const DELETE_TRANSFERENCIA_RECURSO = gql`
  mutation DeleteTransferenciaRecurso($deleteTransferenciaRecursoId: ID!) {
    deleteTransferenciaRecurso(id: $deleteTransferenciaRecursoId) {
      _id
    }
  }
`;

export const listTransferenciaRecursosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_TRANSFERENCIA_RECURSOS,
    });
    return data.listTransferenciaRecursos;
  } catch (error) {
    throw new Error(`Error fetching transferencia recursos: ${error}`);
  }
};

export const listTransferenciaRecursosByIdService = async (id: string) => {
  try {
    const { data } = await client.query({
      query: LIST_TRANSFERENCIA_RECURSOS_BY_ID,
      variables: { listTransferenciaRecursosById: id },
    });
    return data.listTransferenciaRecursosById;
  } catch (error) {
    throw new Error(`Error fetching transferencia recurso by id: ${error}`);
  }
};

export const addTransferenciaRecursoService = async (data: {
  transferencia_detalle_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
}) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: ADD_TRANSFERENCIA_RECURSO,
      variables: {
        transferenciaDetalleId: data.transferencia_detalle_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        costo: data.costo,
      },
    });
    return responseData.addTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error adding transferencia recurso: ${error}`);
  }
};

export const updateTransferenciaRecursoService = async (data: {
  id: string;
  cantidad: number;
  costo: number;
}) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_RECURSO,
      variables: {
        updateTransferenciaRecursoId: data.id,
        cantidad: data.cantidad,
        costo: data.costo,
      },
    });
    return responseData.updateTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error updating transferencia recurso: ${error}`);
  }
};

export const deleteTransferenciaRecursoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_TRANSFERENCIA_RECURSO,
      variables: { deleteTransferenciaRecursoId: id },
    });
    return data.deleteTransferenciaRecurso;
  } catch (error) {
    throw new Error(`Error deleting transferencia recurso: ${error}`);
  }
};
