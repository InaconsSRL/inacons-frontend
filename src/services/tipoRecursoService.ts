import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TIPO_RECURSO_QUERY = gql`
  query ListTipoRecurso {
    listTipoRecurso {
      id
      nombre
    }
  }
`;

const ADD_TIPO_RECURSO_MUTATION = gql`
  mutation AddTipoRecurso($nombre: String!) {
    addTipoRecurso(nombre: $nombre) {
      id
      nombre
    }
  }
`;

const UPDATE_TIPO_RECURSO_MUTATION = gql`
  mutation UpdateTipoRecurso($updateTipoRecursoId: ID!, $nombre: String!) {
    updateTipoRecurso(id: $updateTipoRecursoId, nombre: $nombre) {
      id
      nombre
    }
  }
`;

export const listTipoRecursoService = async () => {
  try {
    const response = await client.query({
      query: LIST_TIPO_RECURSO_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listTipoRecurso;
  } catch (error) {
    console.error('Error al obtener la lista de tipos de recurso:', error);
    throw error;
  }
};

export const addTipoRecursoService = async (tipoRecursoData: { nombre: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TIPO_RECURSO_MUTATION,
      variables: tipoRecursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addTipoRecurso;
  } catch (error) {
    console.error('Error al crear el tipo de recurso:', error);
    throw error;
  }
};

export const updateTipoRecursoService = async (tipoRecurso: { id: string; nombre: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TIPO_RECURSO_MUTATION,
      variables: { updateTipoRecursoId: tipoRecurso.id, nombre: tipoRecurso.nombre },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateTipoRecurso;
  } catch (error) {
    console.error('Error al actualizar el tipo de recurso:', error);
    throw error;
  }
};