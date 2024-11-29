import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIA_RECURSOS_QUERY = gql`
  query ListTransferenciaRecursos {
    listTransferenciaRecursos {
      id
      transferencia_detalle_id {
        id
        fecha
        referencia
        referencia_id
        tipo
        transferencia_id {
          fecha
          id
          movilidad_id {
            id
            denominacion
            descripcion
          }
          movimiento_id {
            id
            nombre
            descripcion
            tipo
          }
          usuario_id {
            apellidos
            nombres
            id
          }
        }
      }
      recurso_id {
        cantidad
        codigo
        id
        imagenes {
          file
        }
        nombre
        precio_actual
        vigente
      }
      cantidad
      costo
    }
  }
`;

const LIST_TRANSFERENCIA_RECURSOS_BY_DETALLE_QUERY = gql`
  query ListTransferenciaRecursosByTransferenciaDetalle($listTransferenciaRecursosByTransferenciaDetalleId: ID!) {
    listTransferenciaRecursosByTransferenciaDetalle(id: $listTransferenciaRecursosByTransferenciaDetalleId) {
      id
      transferencia_detalle_id {
        id
        fecha
        referencia
        referencia_id
        tipo
        transferencia_id {
          fecha
          id
          movilidad_id {
            id
            denominacion
            descripcion
          }
          movimiento_id {
            id
            nombre
            descripcion
            tipo
          }
          usuario_id {
            apellidos
            nombres
            id
          }
        }
      }
      recurso_id {
        cantidad
        codigo
        id
        imagenes {
          file
        }
        nombre
        precio_actual
        vigente
      }
      cantidad
      costo
    }
  }
`;

const LIST_TRANSFERENCIA_RECURSOS_BY_TRANSFERENCIA_DETALLE_QUERY = gql`
  query ListTransferenciaRecursosByTransferenciaDetalle($listTransferenciaRecursosByTransferenciaDetalleId: ID!) {
    listTransferenciaRecursosByTransferenciaDetalle(id: $listTransferenciaRecursosByTransferenciaDetalleId) {
      id
      transferencia_detalle_id {
        id
        transferencia_id {
          id
          usuario_id {
            id
            nombres
            apellidos
          }
          fecha
          movimiento_id {
            id
            nombre
            descripcion
            tipo
          }
          movilidad_id {
            id
            denominacion
            descripcion
          }
        }
        referencia_id
        fecha
        tipo
        referencia
      }
      recurso_id {
        id
        codigo
        nombre
        precio_actual
        unidad_id
        vigente
        imagenes {
          file
        }
      }
      cantidad
      costo
    }
  }
`;

const ADD_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation AddTransferenciaRecurso($transferenciaDetalleId: ID!, $recursoId: ID!, $cantidad: Int!) {
    addTransferenciaRecurso(transferencia_detalle_id: $transferenciaDetalleId, recurso_id: $recursoId, cantidad: $cantidad) {
      id
      cantidad
      costo
    }
  }
`;

const UPDATE_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation UpdateTransferenciaRecurso($updateTransferenciaRecursoId: ID!) {
    updateTransferenciaRecurso(id: $updateTransferenciaRecursoId) {
      id
      cantidad
      costo
    }
  }
`;

const DELETE_TRANSFERENCIA_RECURSO_MUTATION = gql`
  mutation DeleteTransferenciaRecurso($deleteTransferenciaRecursoId: ID!) {
    deleteTransferenciaRecurso(id: $deleteTransferenciaRecursoId) {
      id
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

export const listTransferenciaRecursosByTransferenciaDetalleService = async (id: string) => {
  try {
    const response = await client.query({
      query: LIST_TRANSFERENCIA_RECURSOS_BY_TRANSFERENCIA_DETALLE_QUERY,
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