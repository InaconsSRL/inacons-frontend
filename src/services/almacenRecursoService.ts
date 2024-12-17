import { gql } from '@apollo/client';
import client from '../apolloClient';

export interface AlmacenRecurso {
  id: string;
  recurso_id: string;
  cantidad: number;
  almacen_id: string;
  costo: number;
  nombre_almacen: string;
}

interface Imagen {
  file: string;
}

interface Recurso {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  imagenes: Imagen[];
  unidad_id: string;
}

interface Bodega {
  id: string;
  codigo: string;
}

export interface AlmacenRecursoDetallado {
  id: string;
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
  bodega_id: Bodega;
}

const LIST_ALMACEN_RECURSOS_QUERY = gql`
  query ListAlmacenRecursos {
    listAlmacenRecursos {
      id
      recurso_id
      cantidad
      almacen_id
      costo
      nombre_almacen
    }
  }
`;

const LIST_ALMACEN_RECURSOS_BY_RECURSO_ID_QUERY = gql`
  query ListAlmacenRecursosByRecursoId($recursoId: ID!) {
    listAlmacenRecursosByRecursoId(recursoId: $recursoId) {
      id
      recurso_id
      cantidad
      almacen_id
      costo
      nombre_almacen
    }
  }
`;

const GET_ALMACEN_RECURSO_QUERY = gql`
  query GetAlmacenRecurso($getAlmacenRecursoId: ID!) {
    getAlmacenRecurso(id: $getAlmacenRecursoId) {
      id
      recurso_id {
        id
        nombre
        codigo
        descripcion
        imagenes {
          file
        }
        unidad_id
      }
      cantidad
      costo
      bodega_id {
        id
        codigo
      }
    }
  }
`;

const ADD_ALMACEN_RECURSO_MUTATION = gql`
  mutation AddAlmacenRecurso($recursoId: ID!, $cantidad: Int!, $almacenId: ID!, $costo: Float!) {
    addAlmacenRecurso(recurso_id: $recursoId, cantidad: $cantidad, almacen_id: $almacenId, costo: $costo) {
      id
      recurso_id
      cantidad
      almacen_id
      costo
      nombre_almacen
    }
  }
`;

const UPDATE_ALMACEN_RECURSO_MUTATION = gql`
  mutation UpdateAlmacenRecurso($updateAlmacenRecursoId: ID!, $recursoId: ID, $cantidad: Int, $almacenId: ID, $costo: Float) {
    updateAlmacenRecurso(id: $updateAlmacenRecursoId, recurso_id: $recursoId, cantidad: $cantidad, almacen_id: $almacenId, costo: $costo) {
      id
      recurso_id
      cantidad
      almacen_id
      costo
      nombre_almacen
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

export const listAlmacenRecursosByRecursoIdService = async (recursoId: string) => {
  try {
    const response = await client.query({
      query: LIST_ALMACEN_RECURSOS_BY_RECURSO_ID_QUERY,
      variables: { recursoId },
    });
    return response.data.listAlmacenRecursosByRecursoId;
  } catch (error) {
    console.error('Error al obtener recursos de almacén por recurso ID:', error);
    throw error;
  }
};

export const getAlmacenRecursoService = async (id: string): Promise<AlmacenRecursoDetallado[]> => {
  try {
    const response = await client.query({
      query: GET_ALMACEN_RECURSO_QUERY,
      variables: { getAlmacenRecursoId: id },
    });
    return response.data.getAlmacenRecurso;
  } catch (error) {
    console.error('Error al obtener recurso de almacén:', error);
    throw error;
  }
};

export const addAlmacenRecursoService = async (data: {
  recursoId: string;
  cantidad: number;
  almacenId: string;
  costo: number;
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
  costo?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ALMACEN_RECURSO_MUTATION,
      variables: {
        updateAlmacenRecursoId: data.id,
        recursoId: data.recursoId,
        cantidad: data.cantidad,
        almacenId: data.almacenId,
        costo: data.costo,
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