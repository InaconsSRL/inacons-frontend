import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_UNIDAD_QUERY = gql`
  query ListUnidad {
    listUnidad {
      id
      nombre
    }
  }
`;

const ADD_UNIDAD_MUTATION = gql`
  mutation AddUnidad($nombre: String!) {
    addUnidad(nombre: $nombre) {
      id
      nombre
    }
  }
`;

const UPDATE_UNIDAD_MUTATION = gql`
  mutation UpdateUnidad($updateUnidadId: ID!, $nombre: String!) {
    updateUnidad(id: $updateUnidadId, nombre: $nombre) {
      id
      nombre
    }
  }
`;

export const listUnidadService = async () => {
  try {
    const response = await client.query({
      query: LIST_UNIDAD_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listUnidad;
  } catch (error) {
    console.error('Error al obtener la lista de unidades:', error);
    throw error;
  }
};

export const addUnidadService = async (unidadData: { nombre: string }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_UNIDAD_MUTATION,
      variables: unidadData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addUnidad;
  } catch (error) {
    console.error('Error al crear la unidad:', error);
    throw error;
  }
};

export const updateUnidadService = async (unidad: { id: string; nombre: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_UNIDAD_MUTATION,
      variables: { updateUnidadId: unidad.id, nombre: unidad.nombre },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateUnidad;
  } catch (error) {
    console.error('Error al actualizar la unidad:', error);
    throw error;
  }
};