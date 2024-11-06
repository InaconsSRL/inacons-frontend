import { gql } from '@apollo/client';
import client from '../apolloClient';

interface AlmacenDetalle {
  nombre: string;
  ubicacion: string;
  direccion: string;
}

export interface AlmacenRecurso {
  id: string;
  recurso_id: string;
  cantidad: number;
  almacen_id: string;
  almacen_detalle: AlmacenDetalle;
}

const LIST_ALMACEN_RECURSOS_QUERY = gql`
  query ListAlmacenRecursos {
    listAlmacenRecursos {
      id
      recurso_id
      cantidad
      almacen_id
      almacen_detalle {
        nombre
        ubicacion
        direccion
      }
    }
  }
`;

const ADD_ALMACEN_RECURSO_MUTATION = gql`
  mutation AddAlmacenRecurso($recursoId: ID!, $cantidad: Int!, $almacenId: ID!) {
    addAlmacenRecurso(recurso_id: $recursoId, cantidad: $cantidad, almacen_id: $almacenId) {
      id
      recurso_id
      cantidad
      almacen_id
      almacen_detalle {
        nombre
        ubicacion
        direccion
      }
    }
  }
`;

const UPDATE_ALMACEN_RECURSO_MUTATION = gql`
  mutation UpdateAlmacenRecurso($updateAlmacenRecursoId: ID!, $recursoId: ID, $cantidad: Int, $almacenId: ID) {
    updateAlmacenRecurso(id: $updateAlmacenRecursoId, recurso_id: $recursoId, cantidad: $cantidad, almacen_id: $almacenId) {
      id
      recurso_id
      cantidad
      almacen_id
      almacen_detalle {
        nombre
        ubicacion
        direccion
      }
    }
  }
`;

const DELETE_ALMACEN_RECURSO_MUTATION = gql`
  mutation DeleteAlmacenRecurso($deleteAlmacenRecursoId: ID!) {
    deleteAlmacenRecurso(id: $deleteAlmacenRecursoId) {
      id
    }
  }
`;

export const listAlmacenRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_ALMACEN_RECURSOS_QUERY,
    });
    return response.data.listAlmacenRecursos;
  } catch (error) {
    console.error('Error al obtener recursos de almacén:', error);
    throw error;
  }
};

export const addAlmacenRecursoService = async (data: {
  recursoId: string;
  cantidad: number;
  almacenId: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_ALMACEN_RECURSO_MUTATION,
      variables: data,
    });
    return response.data.addAlmacenRecurso;
  } catch (error) {
    console.error('Error al añadir recurso al almacén:', error);
    throw error;
  }
};

export const updateAlmacenRecursoService = async (data: {
  id: string;
  recursoId?: string;
  cantidad?: number;
  almacenId?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ALMACEN_RECURSO_MUTATION,
      variables: {
        updateAlmacenRecursoId: data.id,
        recursoId: data.recursoId,
        cantidad: data.cantidad,
        almacenId: data.almacenId,
      },
    });
    return response.data.updateAlmacenRecurso;
  } catch (error) {
    console.error('Error al actualizar recurso del almacén:', error);
    throw error;
  }
};

export const deleteAlmacenRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_ALMACEN_RECURSO_MUTATION,
      variables: { deleteAlmacenRecursoId: id },
    });
    return response.data.deleteAlmacenRecurso;
  } catch (error) {
    console.error('Error al eliminar recurso del almacén:', error);
    throw error;
  }
};