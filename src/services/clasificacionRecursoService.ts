import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CLASIFICACION_RECURSO_QUERY = gql`
  query ListClasificacionRecurso {
    listClasificacionRecurso {
      id
      nombre
      parent_id
      childs {
        id
        nombre
        parent_id
        childs {
          id
          nombre
          parent_id
        }
      }
    }
  }
`;

const ADD_CLASIFICACION_RECURSO_MUTATION = gql`
  mutation AddClasificacionRecurso($nombre: String!, $parent_id: ID) {
    addClasificacionRecurso(nombre: $nombre, parent_id: $parent_id) {
      id
      nombre
      parent_id
    }
  }
`;

const UPDATE_CLASIFICACION_RECURSO_MUTATION = gql`
  mutation UpdateClasificacionRecurso($updateClasificacionRecursoId: ID!, $nombre: String, $parent_id: ID) {
    updateClasificacionRecurso(id: $updateClasificacionRecursoId, nombre: $nombre, parent_id: $parent_id) {
      id
      nombre
      parent_id
    }
  }
`;

export const listClasificacionRecursoService = async () => {
  try {
    const response = await client.query({
      query: LIST_CLASIFICACION_RECURSO_QUERY,
      fetchPolicy: 'network-only',
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listClasificacionRecurso;
  } catch (error) {
    console.error('Error al obtener la lista de clasificaciones de recursos:', error);
    throw error;
  }
};

export const addClasificacionRecursoService = async (clasificacionRecursoData: { nombre: string; parent_id: string | null }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_CLASIFICACION_RECURSO_MUTATION,
      variables: clasificacionRecursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addClasificacionRecurso;
  } catch (error) {
    console.error('Error al crear la clasificación de recurso:', error);
    throw error;
  }
};

export const updateClasificacionRecursoService = async (clasificacionRecurso: { id: string; nombre: string; parent_id: string | null }) => {
  try {
    const variables = {
      updateClasificacionRecursoId: clasificacionRecurso.id,
      nombre: clasificacionRecurso.nombre,
      parent_id: clasificacionRecurso.parent_id,
    };
    const response = await client.mutate({
      mutation: UPDATE_CLASIFICACION_RECURSO_MUTATION,
      variables,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateClasificacionRecurso;
  } catch (error) {
    console.error('Error al actualizar la clasificación de recurso:', error);
    throw error;
  }
};